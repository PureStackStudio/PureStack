import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, type Plugin } from 'esbuild'
import { regorTemplateTagsPlugin } from './regorTemplateTransform'

interface SharedLibrariesOptions {
  contentDir: string
  outDir: string
  libraries?: readonly string[]
  reserveOutput?: (outPath: string) => void
}

interface SharedLibrariesOutput {
  entries: Map<string, string>
  inputPaths: string[]
}

/** Resolution changes need a fresh graph, including package exports and aliases. */
export function isScriptConfigFile(filePath: string) {
  const name = path.basename(filePath).toLowerCase()
  return (
    name === 'package.json' ||
    /^(?:tsconfig|jsconfig)(?:\.[\w-]+)*\.json$/.test(name)
  )
}

async function writeRuntimeFile(filePath: string, contents: Uint8Array) {
  const existing = await fs
    .readFile(filePath)
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error
      return undefined
    })
  if (existing?.equals(contents)) return

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const temporary = `${filePath}.${randomUUID()}.tmp`
  try {
    await fs.writeFile(temporary, contents, { flag: 'wx' })
    await fs.rename(temporary, filePath)
  } finally {
    await fs.rm(temporary, { force: true })
  }
}

function entryName(specifier: string) {
  if (/^[\w-]+$/.test(specifier)) return specifier
  const slug = specifier.replace(/[^\w-]/g, '-')
  const hash = createHash('sha256').update(specifier).digest('hex').slice(0, 8)
  return `${slug}-${hash}`
}

async function writeLibraries(
  options: SharedLibrariesOptions,
  libraries: readonly string[],
) {
  const contentDir = path.resolve(options.contentDir)
  const outDir = path.resolve(options.outDir, 'assets', 'runtime')
  const skipResolution = Symbol('shared library resolution')
  const entries = new Map(libraries.map((name) => [name, entryName(name)]))
  // Build all configured entrypoints in one graph. This also preserves identity
  // across package subpaths and dependencies shared by different libraries.
  const result = await build({
    absWorkingDir: contentDir,
    entryPoints: Object.fromEntries(
      [...entries].map(([specifier, name]) => [name, specifier]),
    ),
    outdir: outDir,
    entryNames: '[name].[hash]',
    chunkNames: 'chunks/[name].[hash]',
    bundle: true,
    splitting: true,
    format: 'esm',
    platform: 'browser',
    conditions: ['source'],
    target: 'esnext',
    minify: true,
    write: false,
    metafile: true,
    logLevel: 'silent',
    plugins: [
      regorTemplateTagsPlugin(),
      {
        name: 'shared-library-resolution',
        setup(pluginBuild) {
          pluginBuild.onResolve({ filter: /^[^./]/ }, async (args) => {
            if (args.pluginData === skipResolution || !entries.has(args.path))
              return undefined
            // Every importer uses the site's copy, including packages that
            // resolve a different nested copy of a configured shared library.
            const resolved = await pluginBuild.resolve(args.path, {
              kind: args.kind,
              resolveDir: contentDir,
              pluginData: skipResolution,
            })
            if (resolved.errors.length === 0) return resolved
            // Framework dependencies can be private to its installation (for
            // example with pnpm), rather than resolvable from the content root.
            return pluginBuild.resolve(args.path, {
              kind: args.kind,
              resolveDir: path.dirname(fileURLToPath(import.meta.url)),
              pluginData: skipResolution,
            })
          })
        },
      },
    ],
  })
  const inputPaths = Object.keys(result.metafile.inputs).map((input) =>
    path.resolve(contentDir, input),
  )
  for (const file of result.outputFiles) options.reserveOutput?.(file.path)
  await Promise.all(
    result.outputFiles.map((file) =>
      writeRuntimeFile(file.path, file.contents),
    ),
  )
  const outputEntries = new Map(
    [...entries].map(([specifier, name]) => {
      const file = result.outputFiles.find(
        (file) =>
          path.dirname(file.path) === outDir &&
          path.basename(file.path).startsWith(`${name}.`),
      )
      if (!file)
        throw new Error(`Missing shared library output for ${specifier}.`)
      return [specifier, file.path]
    }),
  )
  return { entries: outputEntries, inputPaths }
}

const fileKey = (filePath: string) => {
  const absolute = path.resolve(filePath)
  return process.platform === 'win32' ? absolute.toLowerCase() : absolute
}

/** One lazy shared-library build per site session, reused by every script. */
export class SharedLibraryCache {
  private readonly libraries: string[]
  private output: Promise<SharedLibrariesOutput> | undefined
  private dependencies = new Set<string>()

  constructor(private readonly options: SharedLibrariesOptions) {
    this.libraries = [
      ...new Set(['regor', ...(options.libraries ?? [])]),
    ].sort()
  }

  /** No filesystem work on entry edits; only changes to library inputs evict the build. */
  invalidate(filePath?: string) {
    if (
      filePath &&
      !isScriptConfigFile(filePath) &&
      this.dependencies.size > 0 &&
      !this.dependencies.has(fileKey(filePath))
    )
      return
    this.output = undefined
    this.dependencies.clear()
  }

  private getOutput(): Promise<SharedLibrariesOutput> {
    if (!this.output) {
      const task = writeLibraries(this.options, this.libraries)
        .then((result) => {
          if (this.output === task)
            this.dependencies = new Set(result.inputPaths.map(fileKey))
          return result
        })
        .catch((error) => {
          if (this.output === task) this.output = undefined
          throw error
        })
      this.output = task
    }
    return this.output
  }

  plugin(
    scriptOutPath: string,
    onDependencies: (inputPaths: string[]) => void,
  ): Plugin {
    return {
      name: 'shared-libraries',
      setup: (pluginBuild) => {
        let output: Promise<Map<string, string>> | undefined
        pluginBuild.onResolve({ filter: /^[^./]/ }, async (args) => {
          if (!this.libraries.includes(args.path)) {
            if (
              this.libraries.some((name) => args.path.startsWith(`${name}/`))
            ) {
              return {
                errors: [
                  {
                    text: `Add "${args.path}" to scripts.sharedLibraries so its subpath shares the same dependency graph.`,
                  },
                ],
              }
            }
            return undefined
          }
          output ??= this.getOutput().then(({ entries, inputPaths }) => {
            onDependencies(inputPaths)
            return entries
          })
          const outPath = (await output).get(args.path)
          if (!outPath)
            throw new Error(`Missing shared library output for ${args.path}.`)
          const relativePath = path
            .relative(path.dirname(scriptOutPath), outPath)
            .split(path.sep)
            .map(encodeURIComponent)
            .join('/')
          return {
            path: relativePath.startsWith('.')
              ? relativePath
              : `./${relativePath}`,
            external: true,
          }
        })
      },
    }
  }
}

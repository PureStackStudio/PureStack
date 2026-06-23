import { existsSync, globSync, readFileSync } from 'node:fs'
import { rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, type InlineConfig } from 'tsdown'

import { timeIt } from './timeIt'

interface PackageJson extends Record<string, unknown> {
  name: string
  version: string
  private?: boolean
  type?: string
  main?: string
  module?: string
  types?: string
  bin?: string | Record<string, string>
  exports?: Record<string, PackageExport>
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface PackageExport {
  types?: string
  import?: string
  require?: string
  default?: string
}

interface PublishPackage {
  packageJsonPath: string
  packageDir: string
  srcDir: string
  distDir: string
  packageJson: PackageJson
  entries: PackageEntry[]
  externalPackageNames: string[]
}

interface PackageEntry {
  name: string
  sourcePath: string
  outputPath: string
  typePath?: string
  kind: 'export' | 'bin'
}

const projectRoot = process.cwd()
const generatedTsconfigPath = path.join(
  projectRoot,
  'tsconfig.bundle.generated.json',
)
const packageJsonPaths = globSync('packages/*/package.json').sort()
const allPackages = packageJsonPaths.map(readPackageJson)
const publishPackages = sortByWorkspaceDependencies(
  allPackages.filter(isPublishPackage),
)
const workspacePackageNames = allPackages
  .map((pkg) => pkg.packageJson.name)
  .filter((name) => name.startsWith('@purestack/'))

function readPackageJson(packageJsonPath: string) {
  const packageDir = path.dirname(path.join(projectRoot, packageJsonPath))
  const packageJson = JSON.parse(
    readFileSync(path.join(projectRoot, packageJsonPath), 'utf8'),
  ) as PackageJson

  return {
    packageJsonPath,
    packageDir,
    packageJson,
  }
}

function isPublishPackage(pkg: { packageJson: PackageJson }): pkg is {
  packageJsonPath: string
  packageDir: string
  packageJson: PackageJson
} {
  return (
    !pkg.packageJson.private &&
    pkg.packageJson.name.startsWith('@purestack/') &&
    Boolean(pkg.packageJson.exports)
  )
}

function sortByWorkspaceDependencies<
  T extends { packageJson: PackageJson; packageJsonPath: string },
>(packages: T[]) {
  const byName = new Map(packages.map((pkg) => [pkg.packageJson.name, pkg]))
  const sorted: T[] = []
  const visiting = new Set<string>()
  const visited = new Set<string>()

  function visit(pkg: T) {
    const name = pkg.packageJson.name
    if (visited.has(name)) return
    if (visiting.has(name)) {
      throw new Error(`Circular workspace dependency detected at ${name}.`)
    }

    visiting.add(name)
    for (const depName of getWorkspaceDependencyNames(pkg.packageJson)) {
      const dep = byName.get(depName)
      if (dep) visit(dep)
    }
    visiting.delete(name)
    visited.add(name)
    sorted.push(pkg)
  }

  for (const pkg of packages) visit(pkg)
  return sorted
}

function getWorkspaceDependencyNames(pkg: PackageJson) {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ].filter((name) => name.startsWith('@purestack/'))
}

function toPublishPackage(pkg: {
  packageJsonPath: string
  packageDir: string
  packageJson: PackageJson
}): PublishPackage {
  const packageName = pkg.packageJson.name
  const srcDir = path.join(pkg.packageDir, 'src')
  const distDir = path.join(pkg.packageDir, 'dist')
  const entries = collectEntries(pkg.packageJson, srcDir)
  const externalPackageNames = [
    ...new Set([
      ...workspacePackageNames.filter((name) => name !== packageName),
      ...Object.keys(pkg.packageJson.dependencies ?? {}),
      ...Object.keys(pkg.packageJson.peerDependencies ?? {}),
      ...Object.keys(pkg.packageJson.optionalDependencies ?? {}),
    ]),
  ].sort()

  return {
    ...pkg,
    srcDir,
    distDir,
    entries,
    externalPackageNames,
  }
}

function collectEntries(pkg: PackageJson, srcDir: string) {
  const entries = new Map<string, PackageEntry>()

  for (const [exportKey, exportValue] of Object.entries(pkg.exports ?? {})) {
    if (exportKey !== '.' && !exportKey.startsWith('./')) {
      throw new Error(
        `${pkg.name} export key "${exportKey}" must be "." or start with "./".`,
      )
    }

    if (exportValue.require) {
      throw new Error(
        `${pkg.name} export "${exportKey}" declares "require", but PureStack publishes ESM-only packages.`,
      )
    }

    const importPath = requireDistPath(
      pkg.name,
      exportKey,
      'import',
      exportValue.import,
      '.mjs',
    )
    const typePath = requireDistPath(
      pkg.name,
      exportKey,
      'types',
      exportValue.types,
      '.d.mts',
    )
    const sourceName = exportKey === '.' ? 'index' : exportKey.slice(2)
    const sourcePath = path.join(srcDir, `${sourceName}.ts`)
    const entryName = toEntryName(importPath, '.mjs')

    ensureEntry(entries, {
      name: entryName,
      sourcePath,
      outputPath: importPath,
      typePath,
      kind: 'export',
    })
  }

  for (const binPath of Object.values(resolveBin(pkg))) {
    const outputPath = requireDistPath(pkg.name, 'bin', 'bin', binPath, '.mjs')
    const entryName = toEntryName(outputPath, '.mjs')
    ensureEntry(entries, {
      name: entryName,
      sourcePath: path.join(srcDir, `${entryName}.ts`),
      outputPath,
      kind: 'bin',
    })
  }

  return [...entries.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function resolveBin(pkg: PackageJson) {
  if (!pkg.bin) return {}
  return typeof pkg.bin === 'string'
    ? { [packageSlug(pkg.name)]: pkg.bin }
    : pkg.bin
}

function packageSlug(packageName: string) {
  return packageName.split('/').at(-1) ?? packageName
}

function requireDistPath(
  packageName: string,
  exportKey: string,
  field: string,
  value: string | undefined,
  extension: string,
) {
  if (!value) {
    throw new Error(`${packageName} export "${exportKey}" is missing ${field}.`)
  }
  if (!value.startsWith('./dist/') || !value.endsWith(extension)) {
    throw new Error(
      `${packageName} export "${exportKey}" ${field} must point to ./dist/*${extension}.`,
    )
  }
  return value
}

function toEntryName(distPath: string, extension: string) {
  return distPath.slice('./dist/'.length, -extension.length)
}

function ensureEntry(entries: Map<string, PackageEntry>, entry: PackageEntry) {
  const existing = entries.get(entry.name)
  if (existing && existing.sourcePath !== entry.sourcePath) {
    throw new Error(
      `Multiple entries want to emit ${entry.outputPath}: ${existing.sourcePath} and ${entry.sourcePath}.`,
    )
  }
  entries.set(entry.name, entry)
}

function getBanner(pkg: PackageJson) {
  return `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} Ahmed Yasin Koculu | ${pkg.license} License */\n\n`
}

async function cleanDist(pkg: PublishPackage) {
  await timeIt(`clean ${relative(pkg.distDir)}`, 'clean', async () => {
    const artifactFiles = pkg.entries.flatMap((entry) => [
      path.join(pkg.packageDir, entry.outputPath),
      path.join(pkg.packageDir, `${entry.outputPath}.map`),
      ...(entry.typePath
        ? [
            path.join(pkg.packageDir, entry.typePath),
            path.join(pkg.packageDir, `${entry.typePath}.map`),
          ]
        : []),
    ])

    await Promise.all(
      artifactFiles.map((filePath) => rm(filePath, { force: true })),
    )
  })
}

async function validatePackage(pkg: PublishPackage) {
  if (pkg.packageJson.type !== 'module') {
    throw new Error(`${pkg.packageJson.name} must declare "type": "module".`)
  }

  if (pkg.packageJson.main && pkg.packageJson.main !== pkg.packageJson.module) {
    throw new Error(
      `${pkg.packageJson.name} main and module must point to the same ESM artifact.`,
    )
  }

  const mainExport = pkg.packageJson.exports?.['.']
  if (!mainExport?.import || pkg.packageJson.module !== mainExport.import) {
    throw new Error(
      `${pkg.packageJson.name} module must match exports["."].import.`,
    )
  }
  if (!mainExport.types || pkg.packageJson.types !== mainExport.types) {
    throw new Error(
      `${pkg.packageJson.name} types must match exports["."].types.`,
    )
  }

  for (const entry of pkg.entries) {
    if (!existsSync(entry.sourcePath)) {
      throw new Error(
        `${pkg.packageJson.name} ${entry.kind} entry ${entry.name} is missing ${relative(entry.sourcePath)}.`,
      )
    }
  }
}

async function bundlePackage(pkg: PublishPackage) {
  const banner = getBanner(pkg.packageJson)

  await writeDtsTsconfig(pkg)

  for (const pkgEntry of pkg.entries) {
    await timeIt(
      `build ${pkg.packageJson.name}:${pkgEntry.name}`,
      'build',
      async () => {
        const opts: InlineConfig = {
          name: pkg.packageJson.name,
          cwd: projectRoot,
          entry: { [pkgEntry.name]: pkgEntry.sourcePath },
          platform: 'node',
          target: 'esnext',
          tsconfig: './tsconfig.json',
          format: ['esm'],
          treeshake: true,
          minify: false,
          deps: {
            neverBundle: pkg.externalPackageNames,
            skipNodeModulesBundle: true,
          },
          outputOptions: {
            sourcemap: true,
            codeSplitting: false,
          },
          dts: pkgEntry.typePath
            ? {
                tsgo: true,
                tsconfig: generatedTsconfigPath,
                sourcemap: true,
              }
            : false,
          sourcemap: true,
          clean: false,
          unbundle: false,
          outDir: pkg.distDir,
          outExtensions: () => ({ js: '.mjs', dts: '.d.mts' }),
          logLevel: 'silent',
          plugins: [
            replaceVersion(pkg.packageJson.version),
            inlineStaticRegorTemplates(),
            addBanner(banner),
          ],
        }
        await build(opts)
      },
    )
  }
}

async function writeDtsTsconfig(pkg: PublishPackage) {
  const sourceGlob = `${relative(pkg.srcDir)}/**/*.ts`
  const testGlob = `${relative(pkg.srcDir)}/**/*.test.ts`
  const declarationGlob = `${relative(pkg.srcDir)}/**/*.d.ts`
  const tsconfig = {
    compilerOptions: {
      target: 'ESNext',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      esModuleInterop: true,
      isolatedModules: true,
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      noImplicitOverride: true,
      noImplicitAny: true,
      forceConsistentCasingInFileNames: true,
      skipLibCheck: true,
      types: ['node'],
      lib: ['ESNext', 'DOM', 'DOM.Iterable'],
    },
    include: [sourceGlob],
    exclude: [testGlob, declarationGlob],
  }

  await writeFile(
    generatedTsconfigPath,
    `${JSON.stringify(tsconfig, null, 2)}\n`,
    'utf8',
  )
}

function replaceVersion(version: string) {
  return {
    name: 'replace-version',
    transform(code: string, id: string) {
      if (!id.endsWith('index.ts')) return null
      return {
        code: code.replace(
          /\bversion = PURESTACK_VERSION\b/g,
          `version = ${JSON.stringify(version)}`,
        ),
        map: null,
      }
    },
  }
}

function inlineStaticRegorTemplates() {
  return {
    name: 'inline-static-regor-templates',
    transform(code: string, id: string) {
      const normalizedId = id.replaceAll('\\', '/')
      if (!normalizedId.includes('/packages/ts-components/src/')) return null

      const nextCode = code.replace(/(?<![\w$.])(?:html|svg)\s*`/g, '`')

      if (nextCode === code) return null
      return {
        code: nextCode,
        map: null,
      }
    },
  }
}

function addBanner(banner: string) {
  return {
    name: 'add-banner',
    renderChunk(code: string) {
      if (code.startsWith('#!')) {
        const firstLineEnd = code.indexOf('\n')
        if (firstLineEnd !== -1) {
          return {
            code: `${code.slice(0, firstLineEnd + 1)}${banner}${code.slice(firstLineEnd + 1)}`,
            map: null,
          }
        }
      }

      return {
        code: banner + code,
        map: null,
      }
    },
  }
}

async function verifyPackage(pkg: PublishPackage) {
  await timeIt(`verify ${pkg.packageJson.name}`, 'verify', async () => {
    for (const entry of pkg.entries) {
      await assertFile(pkg, entry.outputPath)
      await assertFile(pkg, `${entry.outputPath}.map`)
      if (entry.typePath) {
        await assertFile(pkg, entry.typePath)
        await assertFile(pkg, `${entry.typePath}.map`)
      }
    }

    for (const binPath of Object.values(resolveBin(pkg.packageJson))) {
      const contents = readFileSync(path.join(pkg.packageDir, binPath), 'utf8')
      if (!contents.startsWith('#!')) {
        throw new Error(
          `${pkg.packageJson.name} bin ${binPath} lost its shebang.`,
        )
      }
    }

    await smokeImport(pkg)
  })
}

async function assertFile(pkg: PublishPackage, packageRelativePath: string) {
  const fullPath = path.join(pkg.packageDir, packageRelativePath)
  const fileStat = await stat(fullPath).catch(() => null)
  if (!fileStat?.isFile()) {
    throw new Error(`${pkg.packageJson.name} missing ${packageRelativePath}.`)
  }
}

async function smokeImport(pkg: PublishPackage) {
  const mainExport = pkg.packageJson.exports?.['.']
  if (!mainExport?.import) return

  await import(pathToFileURL(path.join(pkg.packageDir, mainExport.import)).href)
}

function relative(fullPath: string) {
  return path.relative(projectRoot, fullPath).replaceAll(path.sep, '/')
}

async function main() {
  const packages = publishPackages.map(toPublishPackage)

  try {
    await timeIt('total', 'total', async () => {
      for (const pkg of packages) {
        await validatePackage(pkg)
        await cleanDist(pkg)
        await bundlePackage(pkg)
        await verifyPackage(pkg)
        console.log('')
      }
    })
    console.log('Build complete.')
  } finally {
    await rm(generatedTsconfigPath, { force: true })
  }
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})

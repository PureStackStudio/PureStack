import fs from 'node:fs'
import { isBuiltin } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { isPlainObject } from '@purestack/ts-util'
import { build, type Plugin } from 'esbuild'
import type { BuildInput } from '../build/site'
import type { PureStackPlugin } from '../plugins/plugin'

export const PROJECT_CONFIG_FILENAME = 'purestack.config.ts'

const CONFIG_FIELDS = ['plugins']
const SKIP_PACKAGE_RESOLUTION = Symbol('skip package resolution')

/** The code a site adds to PureStack, loaded from `purestack.config.ts`. */
export interface PureStackConfig {
  plugins?: PureStackPlugin[]
}

export function defineConfig(config: PureStackConfig): PureStackConfig {
  return config
}

export interface LoadedProjectConfig {
  filePath: string
  config: PureStackConfig
  /** Local files the config imports, itself included; edits reload it. */
  dependencies: string[]
}

export function findProjectConfig(contentDir: string) {
  const filePath = path.join(contentDir, PROJECT_CONFIG_FILENAME)
  return fs.existsSync(filePath) ? filePath : undefined
}

/** Adds the config's plugins after any the build input already lists. */
export function withProjectConfig(
  input: BuildInput,
  loaded: LoadedProjectConfig | undefined,
): BuildInput {
  if (!loaded?.config.plugins) return input
  return {
    ...input,
    options: {
      ...input.options,
      plugins: [...(input.options?.plugins ?? []), ...loaded.config.plugins],
    },
  }
}

/**
 * Bundles the config with the local files it imports and runs it. Packages
 * stay external: one PureStack can resolve uses PureStack's own copy, so
 * plugins share its registries, and any other resolves from the config.
 */
export async function loadProjectConfig(
  filePath: string,
): Promise<LoadedProjectConfig> {
  const configDir = path.dirname(filePath)
  let bundled: Awaited<ReturnType<typeof bundleConfig>>
  try {
    bundled = await bundleConfig(filePath, configDir)
  } catch (error) {
    throw new Error(`Could not bundle ${filePath}: ${toMessage(error)}`, {
      cause: error,
    })
  }
  let exported: unknown
  try {
    const code = bundled.outputFiles[0]?.text ?? ''
    const module = await import(
      `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
    )
    exported = module.default
  } catch (error) {
    throw new Error(`Could not run ${filePath}: ${toMessage(error)}`, {
      cause: error,
    })
  }
  assertProjectConfig(exported, filePath)
  return {
    filePath,
    config: exported,
    dependencies: Object.keys(bundled.metafile.inputs).map((input) =>
      path.resolve(configDir, input),
    ),
  }
}

function bundleConfig(filePath: string, configDir: string) {
  return build({
    entryPoints: [filePath],
    absWorkingDir: configDir,
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    // Resolve the way Node's own `import` does.
    conditions: ['node'],
    mainFields: ['main'],
    sourcemap: 'inline',
    metafile: true,
    logLevel: 'silent',
    plugins: [resolvePackagesToFiles()],
  })
}

function resolvePackagesToFiles(): Plugin {
  return {
    name: 'purestack-config-packages',
    setup(pluginBuild) {
      pluginBuild.onResolve({ filter: /.*/ }, async (args) => {
        if (args.kind === 'entry-point') return undefined
        if (args.pluginData === SKIP_PACKAGE_RESOLUTION) return undefined
        if (args.path.startsWith('.') || path.isAbsolute(args.path)) {
          return undefined
        }
        if (isBuiltin(args.path)) return { path: args.path, external: true }
        const shared = resolveFromPureStack(args.path)
        if (shared) return { path: shared, external: true }
        const local = await pluginBuild.resolve(args.path, {
          kind: args.kind,
          resolveDir: args.resolveDir,
          pluginData: SKIP_PACKAGE_RESOLUTION,
        })
        if (local.errors.length > 0) return { errors: local.errors }
        return { path: pathToFileURL(local.path).href, external: true }
      })
    },
  }
}

function resolveFromPureStack(specifier: string) {
  try {
    return import.meta.resolve(specifier)
  } catch {
    return undefined
  }
}

function assertProjectConfig(
  value: unknown,
  filePath: string,
): asserts value is PureStackConfig {
  if (!isPlainObject(value)) {
    throw new Error(
      `${filePath} must export its config as the default export: export default defineConfig({ plugins: [...] })`,
    )
  }
  for (const field of Object.keys(value)) {
    if (!CONFIG_FIELDS.includes(field)) {
      throw new Error(
        `${filePath} has an unknown field "${field}". Config fields: ${CONFIG_FIELDS.join(', ')}.`,
      )
    }
  }
}

function toMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

import path from 'node:path'
import type { BuildInput } from '../build/site'
import { resolveBuildPlugins } from '../plugins/default-plugins'
import { assertValidPlugins } from '../plugins/plugin'
import type { PureStackPlugin } from '../plugins/types'
import {
  loadSiteConfigFile,
  resolveSiteContentDir,
  SITE_CONFIG_FILENAME,
} from './core-config'
import { loadPluginExport } from './project-config'

/** Package declarations are build setup; each integration still owns its settings. */
export async function resolveConfiguredPlugins(input: BuildInput) {
  const contentDir = resolveSiteContentDir(input.siteConfig)
  const file = loadSiteConfigFile(contentDir)
  if (
    file.defaultPlugins !== undefined &&
    typeof file.defaultPlugins !== 'boolean'
  )
    throw new Error('siteConfig.json defaultPlugins must be a boolean.')
  const options = {
    ...input.options,
    defaultPlugins: input.options?.defaultPlugins ?? file.defaultPlugins,
  }
  const modules: unknown = file.plugins
  if (modules === undefined)
    return { file, plugins: resolveBuildPlugins(options) }
  if (!Array.isArray(modules))
    throw new Error(
      'siteConfig.json plugins must be an array of installed package names.',
    )
  const seen = new Set<string>()
  const declared: PureStackPlugin[] = []
  for (const [index, reference] of modules.entries()) {
    const match =
      typeof reference === 'string'
        ? /^((?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*(?:\/[a-zA-Z0-9._-]+)*)(?:#([a-zA-Z_$][a-zA-Z0-9_$]*))?$/.exec(
            reference,
          )
        : null
    if (
      !match ||
      match[1].split('/').some((part) => part === '.' || part === '..')
    )
      throw new Error(
        `siteConfig.json plugins[${index}] must be an installed npm package name, optionally with a subpath and #exportName.`,
      )
    const [, specifier, exportName = 'default'] = match
    const key = `${specifier}#${exportName}`
    if (seen.has(key))
      throw new Error(
        `siteConfig.json plugins declares "${key}" more than once.`,
      )
    seen.add(key)
    try {
      const exported = await loadPluginExport(
        specifier,
        exportName,
        path.resolve(contentDir, SITE_CONFIG_FILENAME),
      )
      const plugin: unknown =
        typeof exported === 'function' ? await exported() : exported
      assertValidPlugins([plugin as PureStackPlugin])
      declared.push(plugin as PureStackPlugin)
    } catch (error) {
      throw new Error(
        `Could not load plugin "${reference}" from siteConfig.json: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }
  }
  assertValidPlugins(declared)
  // Explicit TypeScript/programmatic instances can customize a declared owner.
  const supplied = options.plugins ?? []
  const replacements = new Set(supplied.map((plugin) => plugin.name))
  return {
    file,
    plugins: resolveBuildPlugins({
      ...options,
      plugins: [
        ...declared.filter((plugin) => !replacements.has(plugin.name)),
        ...supplied,
      ],
    }),
  }
}

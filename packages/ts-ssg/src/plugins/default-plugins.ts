import { componentsPlugin } from '@purestack/ts-components'
import { highlightPlugin } from '@purestack/ts-highlight'
import { pageScriptsPlugin } from '@purestack/ts-page-scripts'
import { pagefindPlugin } from '@purestack/ts-pagefind'
import { themePlugin } from '@purestack/ts-theme'
import type { BuildContext } from '../build/page'
import type { BuildOptions } from '../build/site'
import {
  assertValidPlugins,
  composePluginHooks,
  type PureStackPlugin,
  resolvePluginComponents,
  resolvePluginSearch,
  resolvePluginStyles,
  resolvePluginTemplates,
} from './plugin'

export {
  componentsPlugin,
  highlightPlugin,
  pagefindPlugin,
  pageScriptsPlugin,
  themePlugin,
}

/** A fresh set for each build/session; the libraries have no registration side effects. */
export function createDefaultPlugins(): PureStackPlugin[] {
  // CSS initialization precedes component styles; theme startup precedes the
  // browser runtimes. Both use the ordinary plugin lifecycle below.
  return [
    themePlugin(),
    componentsPlugin(),
    pageScriptsPlugin(),
    highlightPlugin(),
    pagefindPlugin(),
  ]
}

export function resolveBuildPlugins(options: BuildOptions = {}) {
  const supplied = options.plugins ?? []
  assertValidPlugins(supplied)
  const replacements = new Map(supplied.map((plugin) => [plugin.name, plugin]))
  const standard = createDefaultPlugins()
  const names = new Set(standard.map((plugin) => plugin.name))
  const all =
    options.defaultPlugins === false
      ? supplied
      : [
          ...standard.map((plugin) => replacements.get(plugin.name) ?? plugin),
          ...supplied.filter((plugin) => !names.has(plugin.name)),
        ]
  return all
}

/** Every plugin follows the same initialization sequence. */
export async function initializePluginContext(
  context: BuildContext,
  plugins: readonly PureStackPlugin[],
) {
  context.styles = resolvePluginStyles(plugins, context.config)
  context.search = resolvePluginSearch(plugins, context.config)
  context.components = resolvePluginComponents(plugins, context.config)
  context.templates = resolvePluginTemplates(plugins)
  context.headTemplates = plugins.flatMap((plugin) => plugin.head ?? [])
  await composePluginHooks(plugins).onConfigResolved?.(context)
}

import type { IncomingMessage, ServerResponse } from 'node:http'
import type {
  MdxCodeHighlighter,
  PageTemplateMap,
  SiteConfig,
  SiteSearch,
  SiteStyles,
} from '@purestack/ts-common'
import { registerSkin, type ThemeSkin, themeSkins } from '@purestack/ts-style'
import { escapeHtml, isPlainObject } from '@purestack/ts-util'
import { awaitPlugin, callPlugin } from './errors'

import type { HighlighterConfig, PureStackPlugin } from './types'

export { composePluginHooks } from './hooks'
export { resolvePluginContentProcessor } from './markdown'
export {
  definePlugin,
  type GeneratedPage,
  type HighlighterConfig,
  type PageGenerationContext,
  type PureStackMarkdown,
  type PureStackPlugin,
} from './types'
export { assertValidPlugins } from './validation'

/**
 * Runs `resolve` with every plugin skin registered. Skins are looked up only
 * while the site config resolves, so they are removed afterwards and never
 * outlast the build that added them.
 */
export function withPluginSkins<T>(
  plugins: readonly PureStackPlugin[],
  resolve: () => T,
): T {
  const skins = mergeByName(plugins, 'skin', (plugin) => plugin.skins)
  const replaced = new Map<string, ThemeSkin | undefined>()
  for (const [name, skin] of Object.entries(skins)) {
    replaced.set(name, themeSkins[name])
    registerSkin(name, skin)
  }
  try {
    return resolve()
  } finally {
    for (const [name, previous] of replaced) {
      if (previous) registerSkin(name, previous)
      else delete themeSkins[name]
    }
  }
}

export function resolvePluginComponents(
  plugins: readonly PureStackPlugin[],
  config: SiteConfig,
) {
  return mergeByName(
    plugins,
    'component',
    (plugin) => {
      const components = callPlugin(plugin.name, 'components', () =>
        plugin.components?.(config),
      )
      if (components !== undefined && !isPlainObject(components)) {
        throw new Error(
          `Plugin "${plugin.name}" needs \`components\` to return an object of components.`,
        )
      }
      return components
    },
    true,
  )
}

export function resolvePluginTemplates(
  plugins: readonly PureStackPlugin[],
): PageTemplateMap {
  return mergeByName(
    plugins,
    'template',
    (plugin) =>
      plugin.templates &&
      Object.fromEntries(
        Object.entries(plugin.templates).map(([name, template]) => [
          name,
          async (input: Parameters<typeof template>[0]) =>
            awaitPlugin(plugin.name, `templates.${name}`, async () => {
              const result = await template(input)
              if (!result || typeof result.toHtml !== 'function')
                throw new Error('A page template must return an html node.')
              return result
            }),
        ]),
      ),
    true,
  )
}

export function resolvePluginStyles(
  plugins: readonly PureStackPlugin[],
  config: SiteConfig,
) {
  const providers = plugins.filter((plugin) => plugin.styles)
  if (providers.length > 1) {
    throw new Error(
      `Plugins "${providers[0].name}" and "${providers[1].name}" both define styles.`,
    )
  }
  const provider = providers[0]
  const styles =
    provider &&
    callPlugin(provider.name, 'styles', () => provider.styles?.(config))
  if (
    provider &&
    (!styles ||
      typeof styles.revision !== 'number' ||
      typeof styles.links !== 'function' ||
      typeof styles.write !== 'function')
  ) {
    throw new Error(
      `Plugin "${provider.name}" needs \`styles\` to return a stylesheet provider.`,
    )
  }
  if (!styles || !provider) return undefined
  return {
    get revision() {
      return callPlugin(provider.name, 'styles.revision', () => styles.revision)
    },
    links: (cacheKey?: string) =>
      callPlugin(provider.name, 'styles.links', () => styles.links(cacheKey)),
    write: (input: Parameters<SiteStyles['write']>[0]) =>
      awaitPlugin(provider.name, 'styles.write', () => styles.write(input)),
  }
}

/** Ordinary providers override defaults; competing providers fail before initialization. */
export async function createPluginHighlighter(
  plugins: readonly PureStackPlugin[],
  config: HighlighterConfig,
): Promise<MdxCodeHighlighter | undefined> {
  if (config.mdx.disableHighlighter) return undefined
  const providers = plugins.filter(
    (plugin) => plugin.markdown?.createHighlighter,
  )
  let owner: PureStackPlugin | undefined
  for (const defaults of [true, false]) {
    const group = providers.filter(
      (plugin) => (plugin.defaults === true) === defaults,
    )
    if (group.length > 1)
      throw new Error(
        `Plugins "${group[0].name}" and "${group[1].name}" both define markdown.createHighlighter.`,
      )
    owner = group[0] ?? owner
  }
  if (!owner) return undefined
  return awaitPlugin(owner.name, 'markdown.createHighlighter', async () => {
    const highlighter = await owner.markdown?.createHighlighter?.(config)
    if (
      highlighter !== undefined &&
      (typeof highlighter?.codeToHtml !== 'function' ||
        (highlighter.flush !== undefined &&
          typeof highlighter.flush !== 'function'))
    )
      throw new Error(
        'markdown.createHighlighter must return a code highlighter or undefined.',
      )
    return (
      highlighter && {
        ...(highlighter.flush
          ? {
              flush: () =>
                awaitPlugin(
                  owner.name,
                  'markdown.createHighlighter.flush',
                  () => highlighter.flush?.(),
                ),
            }
          : {}),
        codeToHtml: (code: string, lang?: string) =>
          awaitPlugin(owner.name, 'markdown.createHighlighter.codeToHtml', () =>
            highlighter.codeToHtml(code, lang),
          ),
      }
    )
  })
}

export function resolvePluginSearch(
  plugins: readonly PureStackPlugin[],
  config: SiteConfig,
) {
  const providers = plugins.filter((plugin) => plugin.search)
  if (providers.length > 1)
    throw new Error(
      `Plugins "${providers[0].name}" and "${providers[1].name}" both define search.`,
    )
  const provider = providers[0]
  const search =
    provider &&
    callPlugin(provider.name, 'search', () => provider.search?.(config))
  if (
    provider &&
    (!search ||
      typeof search.ownsPath !== 'function' ||
      typeof search.write !== 'function')
  )
    throw new Error(
      `Plugin "${provider.name}" needs search to return a search provider.`,
    )
  if (!search || !provider) return undefined
  return {
    ownsPath: (pathname: string) =>
      callPlugin(provider.name, 'search.ownsPath', () =>
        search.ownsPath(pathname),
      ),
    write: (input: Parameters<SiteSearch['write']>[0]) =>
      awaitPlugin(provider.name, 'search.write', () => search.write(input)),
  }
}

/** Tries plugin resolvers in order, then uses the default highlighter. */
export function resolvePluginHighlighter(
  plugins: readonly PureStackPlugin[],
  fallback: MdxCodeHighlighter | undefined,
): MdxCodeHighlighter | undefined {
  const resolvers = plugins.flatMap((plugin) =>
    plugin.markdown?.resolveHighlighter
      ? [{ plugin, resolve: plugin.markdown.resolveHighlighter }]
      : [],
  )
  if (resolvers.length === 0) return fallback
  return {
    ...(fallback?.flush ? { flush: () => fallback.flush?.() } : {}),
    async codeToHtml(code, lang) {
      const normalizedLang = lang?.trim().toLowerCase() ?? ''
      for (const { plugin, resolve } of resolvers) {
        const highlighter = await awaitPlugin(
          plugin.name,
          'markdown.resolveHighlighter',
          () => resolve(normalizedLang),
        )
        if (highlighter !== null)
          return awaitPlugin(plugin.name, 'markdown.resolveHighlighter', () => {
            if (typeof highlighter !== 'function')
              throw new Error(
                'A highlighter resolver must return a function or null.',
              )
            return highlighter(code, lang)
          })
      }
      if (fallback) return fallback.codeToHtml(code, lang)
      const language = lang ? ` class="language-${escapeHtml(lang, true)}"` : ''
      return `<pre><code${language}>${escapeHtml(code)}</code></pre>`
    },
  }
}

/**
 * Runs each plugin's dev middleware in order until one responds. Returns
 * whether a plugin handled the request.
 */
export function composeDevMiddleware(plugins: readonly PureStackPlugin[]) {
  const handlers = plugins.flatMap((plugin) =>
    plugin.devMiddleware ? [{ plugin, handler: plugin.devMiddleware }] : [],
  )
  return async (request: IncomingMessage, response: ServerResponse) => {
    for (const { plugin, handler } of handlers) {
      await awaitPlugin(plugin.name, 'devMiddleware', () =>
        handler(request, response),
      )
      if (response.headersSent || response.writableEnded) return true
    }
    return false
  }
}

function mergeByName<T>(
  plugins: readonly PureStackPlugin[],
  kind: string,
  pick: (plugin: PureStackPlugin) => Record<string, T> | undefined,
  allowDefaults = false,
) {
  // Evaluate factories in plugin order, even when their contributions have
  // different precedence. Metadata never changes initialization order.
  const contributions = plugins.map((plugin) => ({
    plugin,
    values: pick(plugin),
  }))
  const merged: Record<string, T> = {}
  for (const defaults of allowDefaults ? [true, false] : [false]) {
    const owners = new Map<string, string>()
    for (const { plugin, values } of contributions) {
      if (allowDefaults && (plugin.defaults === true) !== defaults) continue
      for (const [name, value] of Object.entries(values ?? {})) {
        const owner = owners.get(name)
        if (owner) {
          throw new Error(
            `Plugins "${owner}" and "${plugin.name}" both define the ${kind} "${name}".`,
          )
        }
        owners.set(name, plugin.name)
        merged[name] = value
      }
    }
  }
  return merged
}

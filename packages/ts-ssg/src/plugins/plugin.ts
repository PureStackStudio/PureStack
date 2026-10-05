import type { IncomingMessage, ServerResponse } from 'node:http'
import type { PageTemplateMap, SiteConfig } from '@purestack/ts-common'
import { registerSkin, type ThemeSkin, themeSkins } from '@purestack/ts-style'
import { isPlainObject } from '@purestack/ts-util'
import type { PluggableList } from 'unified'
import type { BuildHooks } from '../build/site'
import type { ResolvedContentFile } from '../i18n/content'
import { createContentProcessor } from '../mdx/compile'

/**
 * A named bundle of extensions for a PureStack site. Plugins compose in
 * order: skins, components, and templates merge by name, and each lifecycle
 * hook runs every plugin's handler in turn.
 */
export interface PureStackPlugin {
  /** Names the plugin in conflict and hook error messages. */
  name: string
  /** Theme skins the site config can select with `style.theme.skin`. */
  skins?: Record<string, ThemeSkin>
  /** Regor components, built from the resolved site config. */
  components?: (config: SiteConfig) => Record<string, object>
  /** Page templates, selected by the `template` frontmatter field. */
  templates?: PageTemplateMap
  /** Remark and rehype plugins, run on every page and shared partial. */
  markdown?: PureStackMarkdown
  /**
   * Pages without files, such as tag or index pages. Runs whenever the
   * site's content or assets change, so pages can follow other pages.
   */
  pages?: (
    context: PageGenerationContext,
  ) => GeneratedPage[] | Promise<GeneratedPage[]>
  /**
   * Sees every request the development server receives, before the site is
   * served. Respond to handle it; otherwise the next plugin, then the site,
   * handles it. Builds ignore it.
   */
  devMiddleware?: (
    request: IncomingMessage,
    response: ServerResponse,
  ) => void | Promise<void>
  /** Build lifecycle hooks. */
  hooks?: BuildHooks
}

export interface PageGenerationContext {
  config: SiteConfig
  /** The site's content files; generated pages are not among them. */
  files: readonly ResolvedContentFile[]
}

export interface GeneratedPage {
  /**
   * The content path the page takes, such as `blog/tags/regor.mdx`. Routes,
   * links, navigation, and partials treat it like a file at that path.
   */
  path: string
  /**
   * Frontmatter and Markdown or Regor MDX, as a file would hold, or a
   * function that returns it. PureStack never keeps what the function
   * returns and calls it whenever it needs the text, so the plugin decides
   * what to cache.
   */
  source: string | (() => string | Promise<string>)
}

export interface PureStackMarkdown {
  /** Transform the Markdown tree, after Regor markup is restored. */
  remarkPlugins?: PluggableList
  /** Transform the HTML tree, before the outline and code highlighting. */
  rehypePlugins?: PluggableList
}

export function definePlugin(plugin: PureStackPlugin): PureStackPlugin {
  return plugin
}

const PLUGIN_FIELDS = [
  'name',
  'skins',
  'components',
  'templates',
  'markdown',
  'pages',
  'devMiddleware',
  'hooks',
]
const MARKDOWN_FIELDS = ['remarkPlugins', 'rehypePlugins']

const HOOK_NAMES = [
  'onConfigResolved',
  'onContentDiscovered',
  'onNavigationBuilt',
  'onPageStart',
  'onPageDocument',
  'onPageRendered',
  'onPageWritten',
  'onStylesWritten',
  'onBuildComplete',
] as const satisfies readonly (keyof BuildHooks)[]

// A built-in skin also backs the default theme, so a plugin replacing one
// would apply only where a page selects it by name.
const BUILT_IN_SKIN_NAMES = new Set(Object.keys(themeSkins))

/**
 * Checks the shape of every plugin before the build uses it, so a typo such
 * as `onPageRender` fails with the plugin's name instead of being ignored.
 */
export function assertValidPlugins(plugins: readonly PureStackPlugin[]) {
  if (!Array.isArray(plugins)) {
    throw new Error('`plugins` must be an array of plugins.')
  }
  const names = new Set<string>()
  plugins.forEach((plugin: unknown, index) => {
    if (!isPlainObject(plugin)) {
      throw new Error(`Plugin ${index + 1} must be an object.`)
    }
    const { name } = plugin
    if (typeof name !== 'string' || !name.trim()) {
      throw new Error(`Plugin ${index + 1} needs a name.`)
    }
    if (names.has(name)) {
      throw new Error(`The plugin "${name}" is listed more than once.`)
    }
    names.add(name)
    assertPluginFields(name, plugin)
  })
}

function assertPluginFields(name: string, plugin: Record<string, unknown>) {
  const fail = (problem: string): never => {
    throw new Error(`Plugin "${name}" ${problem}`)
  }
  for (const field of Object.keys(plugin)) {
    if (!PLUGIN_FIELDS.includes(field)) {
      fail(
        `has an unknown field "${field}". Plugin fields: ${PLUGIN_FIELDS.join(', ')}.`,
      )
    }
  }
  const {
    skins,
    components,
    templates,
    markdown,
    pages,
    devMiddleware,
    hooks,
  } = plugin
  if (pages !== undefined && typeof pages !== 'function') {
    fail('needs `pages` to be a function that returns pages.')
  }
  if (devMiddleware !== undefined && typeof devMiddleware !== 'function') {
    fail('needs `devMiddleware` to be a function that handles requests.')
  }
  if (markdown !== undefined) {
    if (!isPlainObject(markdown)) {
      fail('needs `markdown` to be an object of remark and rehype plugins.')
    }
    for (const [field, list] of Object.entries(markdown as object)) {
      if (!MARKDOWN_FIELDS.includes(field)) {
        fail(
          `has an unknown markdown field "${field}". Markdown fields: ${MARKDOWN_FIELDS.join(', ')}.`,
        )
      }
      if (list !== undefined && !Array.isArray(list)) {
        fail(`needs \`markdown.${field}\` to be a list of plugins.`)
      }
    }
  }
  if (skins !== undefined) {
    if (!isPlainObject(skins)) fail('needs `skins` to be an object of skins.')
    for (const [skinName, skin] of Object.entries(skins as object)) {
      if (!isPlainObject(skin) || typeof skin.create !== 'function') {
        fail(`needs the skin "${skinName}" to have a create() function.`)
      }
      if (BUILT_IN_SKIN_NAMES.has(skinName)) {
        fail(
          `cannot replace the built-in skin "${skinName}". Give its skin another name.`,
        )
      }
    }
  }
  if (components !== undefined && typeof components !== 'function') {
    fail('needs `components` to be a function that returns components.')
  }
  if (templates !== undefined) {
    if (!isPlainObject(templates)) {
      fail('needs `templates` to be an object of templates.')
    }
    for (const [templateName, template] of Object.entries(
      templates as object,
    )) {
      if (typeof template !== 'function') {
        fail(`needs the template "${templateName}" to be a function.`)
      }
    }
  }
  if (hooks !== undefined) {
    if (!isPlainObject(hooks)) fail('needs `hooks` to be an object of hooks.')
    for (const [hookName, hook] of Object.entries(hooks as object)) {
      if (!(HOOK_NAMES as readonly string[]).includes(hookName)) {
        fail(
          `has an unknown hook "${hookName}". Hooks: ${HOOK_NAMES.join(', ')}.`,
        )
      }
      // Hooks are optional, so `undefined` turns one off conditionally.
      if (hook !== undefined && typeof hook !== 'function') {
        fail(`needs the hook "${hookName}" to be a function.`)
      }
    }
  }
}

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
  return mergeByName(plugins, 'component', (plugin) => {
    const components = plugin.components?.(config)
    if (components !== undefined && !isPlainObject(components)) {
      throw new Error(
        `Plugin "${plugin.name}" needs \`components\` to return an object of components.`,
      )
    }
    return components
  })
}

export function resolvePluginTemplates(
  plugins: readonly PureStackPlugin[],
): PageTemplateMap {
  return mergeByName(plugins, 'template', (plugin) => plugin.templates)
}

/** The build's content processor, with every plugin's remark and rehype plugins. */
export function resolvePluginContentProcessor(
  plugins: readonly PureStackPlugin[],
) {
  return createContentProcessor(
    plugins.flatMap((plugin) => plugin.markdown?.remarkPlugins ?? []),
    plugins.flatMap((plugin) => plugin.markdown?.rehypePlugins ?? []),
  )
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
      try {
        await handler(request, response)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(
          `Plugin "${plugin.name}" failed in devMiddleware: ${message}`,
          { cause: error },
        )
      }
      if (response.headersSent || response.writableEnded) return true
    }
    return false
  }
}

/** One set of hooks that runs each plugin's handlers in plugin order. */
export function composePluginHooks(
  plugins: readonly PureStackPlugin[],
): BuildHooks {
  const hooks: BuildHooks = {}
  for (const name of HOOK_NAMES) {
    const handlers = plugins.flatMap((plugin) => {
      const handler = plugin.hooks?.[name]
      return handler ? [{ plugin, handler }] : []
    })
    if (handlers.length === 0) continue
    Object.assign(hooks, {
      [name]: async (...args: unknown[]) => {
        for (const { plugin, handler } of handlers) {
          try {
            // Called as a method of the plugin's hooks, as a build calls it.
            await (handler as (...hookArgs: unknown[]) => unknown).apply(
              plugin.hooks,
              args,
            )
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error)
            throw new Error(
              `Plugin "${plugin.name}" failed in ${name}: ${message}`,
              { cause: error },
            )
          }
        }
      },
    })
  }
  return hooks
}

function mergeByName<T>(
  plugins: readonly PureStackPlugin[],
  kind: string,
  pick: (plugin: PureStackPlugin) => Record<string, T> | undefined,
) {
  const merged: Record<string, T> = {}
  const owners = new Map<string, string>()
  for (const plugin of plugins) {
    for (const [name, value] of Object.entries(pick(plugin) ?? {})) {
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
  return merged
}

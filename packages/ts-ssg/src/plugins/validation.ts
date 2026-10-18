import { themeSkins } from '@purestack/ts-style'
import { isPlainObject } from '@purestack/ts-util'
import { HOOK_NAMES } from './hooks'
import type { PureStackPlugin } from './types'

const PLUGIN_FIELDS = [
  'name',
  'defaults',
  'skins',
  'config',
  'components',
  'templates',
  'head',
  'headConfig',
  'styles',
  'search',
  'assets',
  'markdown',
  'pages',
  'devMiddleware',
  'hooks',
]
const MARKDOWN_FIELDS = [
  'remarkPlugins',
  'rehypePlugins',
  'rehypePostPlugins',
  'resolveHighlighter',
  'createHighlighter',
]

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
  if (plugin.defaults !== undefined && typeof plugin.defaults !== 'boolean')
    fail('needs `defaults` to be a boolean.')
  if (plugin.config !== undefined) {
    if (!isPlainObject(plugin.config))
      fail('needs `config` to be an object of configuration contributions.')
    for (const [phase, resolve] of Object.entries(plugin.config as object)) {
      if (phase !== 'resolve' && phase !== 'normalize' && phase !== 'finalize')
        fail(
          `has an unknown config field "${phase}". Config fields: resolve, normalize, finalize.`,
        )
      if (resolve !== undefined && typeof resolve !== 'function')
        fail(`needs \`config.${phase}\` to be a configuration resolver.`)
    }
  }
  if (plugin.head !== undefined && typeof plugin.head !== 'function')
    fail('needs `head` to be a head template.')
  if (
    plugin.headConfig !== undefined &&
    typeof plugin.headConfig !== 'function'
  )
    fail('needs `headConfig` to be a head configuration template.')
  if (plugin.styles !== undefined && typeof plugin.styles !== 'function')
    fail('needs `styles` to be a stylesheet provider.')
  if (plugin.search !== undefined && typeof plugin.search !== 'function')
    fail('needs `search` to be a search provider.')
  if (plugin.assets !== undefined && typeof plugin.assets !== 'function')
    fail('needs `assets` to be an asset processor factory.')
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
      if (list === undefined) continue
      if (
        field === 'remarkPlugins' ||
        field === 'rehypePlugins' ||
        field === 'rehypePostPlugins'
      ) {
        if (!Array.isArray(list))
          fail(`needs \`markdown.${field}\` to be a list of plugins.`)
      } else if (typeof list !== 'function') {
        fail(`needs \`markdown.${field}\` to be a function.`)
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

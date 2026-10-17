import type { SiteMdxConfig } from '@purestack/ts-common'
import type { HLJSApi } from 'highlight.js'
import { createHljsHighlighter } from './highlightjs'
import { createMdxHighlighter, type MdxShikiFactory } from './shiki'

export { createHljsHighlighter } from './highlightjs'
export {
  createMdxHighlighter,
  DEFAULT_MDX_CODE_LANGS,
  DEFAULT_MDX_CODE_THEMES,
  type MdxCodeLangs,
  type MdxCodeThemes,
  type MdxShikiFactory,
} from './shiki'

export interface HighlightPluginOptions {
  createShiki?: MdxShikiFactory
  createHighlightJs?: () => HLJSApi | Promise<HLJSApi>
}

/** The standard highlighter, replaceable through markdown.createHighlighter. */
export function highlightPlugin(options: HighlightPluginOptions = {}) {
  return {
    name: 'purestack:highlight',
    defaults: true,
    markdown: {
      async createHighlighter(config: Partial<SiteMdxConfig>) {
        if (config.disableHighlighter) return undefined
        if (config.highlighter === 'highlightjs')
          return createHljsHighlighter(await options.createHighlightJs?.())
        return createMdxHighlighter(undefined, undefined, options.createShiki)
      },
    },
  }
}

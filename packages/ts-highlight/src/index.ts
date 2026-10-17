import type { SiteConfigResolution, SiteMdxConfig } from '@purestack/ts-common'
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
    config: {
      normalize({ config }: SiteConfigResolution) {
        return {
          mdx: { highlighter: backendIdentifier(config.mdx.highlighter) },
        }
      },
    },
    markdown: {
      async createHighlighter(config: Partial<SiteMdxConfig>) {
        if (config.disableHighlighter) return undefined
        const backend = backendIdentifier(config.highlighter)
        if (backend === 'highlightjs')
          return createHljsHighlighter(await options.createHighlightJs?.())
        if (backend === 'shiki')
          return createMdxHighlighter(undefined, undefined, options.createShiki)
        throw new Error(
          `The standard highlighting plugin does not support backend "${backend}". Supply a custom markdown.createHighlighter provider.`,
        )
      },
    },
  }
}

function backendIdentifier(value: unknown): string {
  if (value === undefined) return 'highlightjs'
  if (typeof value !== 'string' || !value.trim())
    throw new Error('mdx.highlighter must be a non-empty backend identifier.')
  return value.trim()
}

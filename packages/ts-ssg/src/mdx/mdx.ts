import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import {
  compileAstToHtml,
  type MdxCompileResult,
  type MdxRenderOptions,
} from './compile'
import {
  maskRegorMarkup,
  normalizeMarkupParagraphs,
  renderRegorMarkupCodeFences,
  restoreRegorMarkup,
} from './regorMarkup'

export {
  DEFAULT_MDX_CODE_LANGS,
  DEFAULT_MDX_CODE_THEMES,
  type MdxCodeHighlighter,
  type MdxCodeLangs,
  type MdxCodeThemes,
  type MdxShikiFactory,
} from './highlight'

export type { MdxCompileResult, MdxRenderOptions }

export async function compileMdx(
  source: string,
  options: MdxRenderOptions = {},
): Promise<MdxCompileResult> {
  const parser = unified().use(remarkParse).use(remarkGfm)
  const masked = maskRegorMarkup(source, (text) => parser.parse(text), {
    sourceRelPath: options.sourceRelPath,
  })
  const file = parser.parse(masked.source)
  restoreRegorMarkup(
    file,
    await renderRegorMarkupCodeFences(masked.segments, options.highlighter),
  )
  normalizeMarkupParagraphs(file)
  return compileAstToHtml(file, options)
}

export async function compileMdxToHtml(source: string): Promise<string> {
  return (await compileMdx(source)).bodyHtml
}

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
} from './highlight'

export type { MdxCompileResult, MdxRenderOptions }

export function compileMdx(
  source: string,
  options: MdxRenderOptions = {},
): MdxCompileResult {
  const parser = unified().use(remarkParse).use(remarkGfm)
  const roughFile = parser.parse(source)
  const masked = maskRegorMarkup(source, roughFile, {
    sourceRelPath: options.sourceRelPath,
  })
  const file = parser.parse(masked.source)
  restoreRegorMarkup(
    file,
    renderRegorMarkupCodeFences(masked.segments, options.highlighter),
  )
  normalizeMarkupParagraphs(file)
  return compileAstToHtml(file, options)
}

export function compileMdxToHtml(source: string): string {
  return compileMdx(source).bodyHtml
}

import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import {
  compileAstToHtml,
  type MdxCompileResult,
  type MdxRenderOptions,
  type PageOutlineItem,
} from './compile'

export {
  DEFAULT_MDX_CODE_LANGS,
  DEFAULT_MDX_CODE_THEMES,
  type MdxCodeHighlighter,
  type MdxCodeLangs,
  type MdxCodeThemes,
} from './highlight'

export type { MdxCompileResult, MdxRenderOptions, PageOutlineItem }

export function compileMdx(
  source: string,
  options: MdxRenderOptions = {},
): MdxCompileResult {
  const file = unified().use(remarkParse).use(remarkMdx).parse(source)
  return compileAstToHtml(file, options, { stripMdxArtifacts: true })
}

export function compileMdxToHtml(source: string): string {
  return compileMdx(source).bodyHtml
}

import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import {
  compileAstToHtml,
  type MdxCompileResult,
  type MdxRenderOptions,
  type PageOutlineItem,
} from './compile'
import { normalizeTemplateMdxTree } from './normalizeTemplateMdxTree'

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
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .parse(source)
  normalizeTemplateMdxTree(file)
  return compileAstToHtml(file, options, { stripMdxArtifacts: true })
}

export function compileMdxToHtml(source: string): string {
  return compileMdx(source).bodyHtml
}

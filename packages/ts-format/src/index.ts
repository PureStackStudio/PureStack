import { buildMdxFormattingEdits } from './mdx'
import { applySourceEdits, type FormatOptions, SourceText } from './source'
import { buildTemplateFormattingEdits } from './templates'

export {
  maskRegorExpressions,
  type RegorExpressionPlaceholder,
  restoreRegorExpressions,
} from './expressions'
export * from './fences'
export * from './html'
export * from './markup'
export * from './mdx'
export * from './source'
export * from './templates'

/** Formats only component markup and html/svg tagged template contents. */
export async function formatSource(text: string, options: FormatOptions = {}) {
  const source = new SourceText(text, options)
  const language =
    options.language ??
    (/\.[cm]?tsx?$/i.test(source.filePath) ? 'typescript' : 'mdx')
  const edits = await (language === 'typescript'
    ? buildTemplateFormattingEdits(source, options)
    : buildMdxFormattingEdits(source, options))
  const code = applySourceEdits(text, edits)
  return {
    code,
    edits,
    diagnostics: source.diagnostics,
    changed: code !== text,
  }
}

import {
  findMdxExpressionEnd,
  isMdxExpressionStart,
} from '@purestack/ts-format'
import type * as TypeScript from 'typescript'
import * as vscode from 'vscode'
import runtimeTs from './typescriptRuntime'

const ts = runtimeTs

const SUPPORTED_TEMPLATE_TAG_NAMES = new Set(['html', 'svg'])

export {
  findMdxExpressionEnd,
  findTagEnd,
  isMdxExpressionStart,
  scanTagTokens,
  type TagToken,
  VOID_HTML_TAG_NAMES,
} from '@purestack/ts-format'

export interface MarkupContext {
  contentEndOffset: number
  contentStartOffset: number
  ignoredRanges: Array<{ end: number; start: number }>
}

interface MdxIgnoreScanState {
  fenceMarker?: string
  fenceStartOffset?: number
  frontmatterStartOffset?: number
  inFence: boolean
  inFrontmatter: boolean
}

export function getMarkupContextAtOffset(
  document: vscode.TextDocument,
  offset: number,
): MarkupContext | undefined {
  if (document.languageId === 'typescript') {
    return getTypeScriptTemplateContextAtOffset(document, offset)
  }

  if (document.languageId === 'mdx') {
    return getMdxContextAtOffset(document, offset)
  }

  return undefined
}

export function isOffsetInsideIgnoredRange(
  context: MarkupContext,
  offset: number,
) {
  return context.ignoredRanges.some(
    (range) => offset >= range.start && offset < range.end,
  )
}

export function sanitizeMarkup(
  document: vscode.TextDocument,
  context: MarkupContext,
  startOffset: number,
  endOffset: number,
) {
  const source = document.getText(
    new vscode.Range(
      document.positionAt(startOffset),
      document.positionAt(endOffset),
    ),
  )
  const chars = source.split('')

  for (const range of context.ignoredRanges) {
    const localStart = Math.max(0, range.start - startOffset)
    const localEnd = Math.min(chars.length, range.end - startOffset)
    for (let index = localStart; index < localEnd; index++) {
      chars[index] = ' '
    }
  }

  return chars.join('')
}

export function getPendingOpeningTagAtEnd(markup: string) {
  for (
    let index = markup.lastIndexOf('<');
    index >= 0;
    index = markup.lastIndexOf('<', index - 1)
  ) {
    const candidate = markup.slice(index)
    if (candidate.includes('>')) continue
    if (/^<\s*\//.test(candidate)) return undefined

    const nameStart = skipWhitespace(candidate, 1)
    const nameEnd = readTagNameEnd(candidate, nameStart)
    if (nameEnd === nameStart) continue

    if (!endsWithSelfClosingSlash(candidate.slice(nameEnd))) return undefined
    if (!isTagTailBalanced(candidate.slice(nameEnd))) return undefined

    return candidate.slice(nameStart, nameEnd)
  }

  return undefined
}

export function hasImmediateClosingTag(
  document: vscode.TextDocument,
  cursorOffset: number,
  tagName: string,
) {
  const trailingText = document.getText(
    new vscode.Range(
      document.positionAt(cursorOffset),
      document.positionAt(
        Math.min(cursorOffset + 200, document.getText().length),
      ),
    ),
  )
  return new RegExp(`^\\s*</\\s*${escapeRegExp(tagName)}\\s*>`).test(
    trailingText,
  )
}

function getTypeScriptTemplateContextAtOffset(
  document: vscode.TextDocument,
  offset: number,
): MarkupContext | undefined {
  const sourceFile = ts.createSourceFile(
    document.uri.fsPath,
    document.getText(),
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  let matchedContext: MarkupContext | undefined

  visitNode(sourceFile)
  return matchedContext

  function visitNode(node: TypeScript.Node) {
    if (matchedContext) return
    if (offset < node.getStart(sourceFile) || offset > node.getEnd()) return

    const templateContext = getSupportedTemplateContext(
      sourceFile,
      node,
      offset,
    )
    if (templateContext) {
      matchedContext = templateContext
      return
    }

    ts.forEachChild(node, visitNode)
  }
}

function getMdxContextAtOffset(
  document: vscode.TextDocument,
  offset: number,
): MarkupContext | undefined {
  const ignoredRanges = getMdxIgnoredRanges(document)
  const contentEndOffset = document.getText().length
  if (offset < 0 || offset > contentEndOffset) return undefined
  if (
    ignoredRanges.some((range) => offset >= range.start && offset < range.end)
  ) {
    return undefined
  }

  return {
    contentStartOffset: 0,
    contentEndOffset,
    ignoredRanges,
  }
}

function normalizeSupportedTemplateTagName(tagText: string) {
  const normalizedTag = tagText.trim()

  for (const tagName of SUPPORTED_TEMPLATE_TAG_NAMES) {
    if (normalizedTag === tagName || normalizedTag.endsWith(`.${tagName}`)) {
      return tagName
    }
  }

  return undefined
}

function getMdxIgnoredRanges(document: vscode.TextDocument) {
  const ignoredRanges: Array<{ start: number; end: number }> = []
  const state: MdxIgnoreScanState = {
    inFence: false,
    inFrontmatter: false,
  }

  for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
    const line = document.lineAt(lineIndex)
    const trimmed = line.text.trim()

    if (startFrontmatter(document, lineIndex, trimmed, state)) {
      continue
    }

    if (closeFrontmatter(document, lineIndex, trimmed, state, ignoredRanges)) {
      continue
    }

    updateFenceState(document, trimmed, line, state, ignoredRanges)
  }

  pushTrailingIgnoredRange(document, ignoredRanges, state)

  return ignoredRanges.concat(getMdxExpressionRanges(document))
}

function getSupportedTemplateContext(
  sourceFile: TypeScript.SourceFile,
  node: TypeScript.Node,
  offset: number,
): MarkupContext | undefined {
  if (!ts.isTaggedTemplateExpression(node)) return undefined

  const tagName = normalizeSupportedTemplateTagName(
    node.tag.getText(sourceFile),
  )
  if (!tagName) return undefined

  const template = node.template
  const contentStartOffset = template.getStart(sourceFile) + 1
  const contentEndOffset = template.getEnd() - 1
  if (offset < contentStartOffset || offset > contentEndOffset) return undefined

  return {
    contentEndOffset,
    contentStartOffset,
    ignoredRanges: getTemplateIgnoredRanges(sourceFile, template),
  }
}

function getTemplateIgnoredRanges(
  sourceFile: TypeScript.SourceFile,
  template: TypeScript.TemplateLiteral,
) {
  if (!ts.isTemplateExpression(template)) return []

  return template.templateSpans.map((span) => ({
    start: span.expression.getStart(sourceFile),
    end: span.expression.getEnd(),
  }))
}

function startFrontmatter(
  document: vscode.TextDocument,
  lineIndex: number,
  trimmed: string,
  state: MdxIgnoreScanState,
) {
  if (lineIndex !== 0 || trimmed !== '---') return false

  state.inFrontmatter = true
  state.frontmatterStartOffset = document.offsetAt(
    document.lineAt(0).range.start,
  )
  return true
}

function closeFrontmatter(
  document: vscode.TextDocument,
  lineIndex: number,
  trimmed: string,
  state: MdxIgnoreScanState,
  ignoredRanges: Array<{ start: number; end: number }>,
) {
  if (!state.inFrontmatter) return false
  if (trimmed !== '---' || lineIndex === 0) return true

  ignoredRanges.push({
    start: state.frontmatterStartOffset ?? 0,
    end: document.offsetAt(
      document.lineAt(lineIndex).rangeIncludingLineBreak.end,
    ),
  })
  state.inFrontmatter = false
  state.frontmatterStartOffset = undefined
  return true
}

function updateFenceState(
  document: vscode.TextDocument,
  trimmed: string,
  line: vscode.TextLine,
  state: MdxIgnoreScanState,
  ignoredRanges: Array<{ start: number; end: number }>,
) {
  const fenceMatch = /^(```+|~~~+)/.exec(trimmed)
  if (!fenceMatch) return

  if (!state.inFence) {
    state.inFence = true
    state.fenceMarker = fenceMatch[1][0]
    state.fenceStartOffset = document.offsetAt(line.range.start)
    return
  }

  if (!state.fenceMarker || !trimmed.startsWith(state.fenceMarker.repeat(3))) {
    return
  }

  ignoredRanges.push({
    start: state.fenceStartOffset ?? document.offsetAt(line.range.start),
    end: document.offsetAt(line.rangeIncludingLineBreak.end),
  })
  state.inFence = false
  state.fenceMarker = undefined
  state.fenceStartOffset = undefined
}

function pushTrailingIgnoredRange(
  document: vscode.TextDocument,
  ignoredRanges: Array<{ start: number; end: number }>,
  state: MdxIgnoreScanState,
) {
  if (state.inFrontmatter && state.frontmatterStartOffset !== undefined) {
    ignoredRanges.push({
      start: state.frontmatterStartOffset,
      end: document.getText().length,
    })
  }

  if (state.inFence && state.fenceStartOffset !== undefined) {
    ignoredRanges.push({
      start: state.fenceStartOffset,
      end: document.getText().length,
    })
  }
}

export function getMdxExpressionRanges(document: vscode.TextDocument) {
  const text = document.getText()
  const ranges: Array<{ start: number; end: number }> = []

  for (let index = 0; index < text.length; index++) {
    if (!isMdxExpressionStart(text, index)) continue

    const end = findMdxExpressionEnd(text, index)
    if (end === -1) continue

    ranges.push({ start: index, end })
    index = end - 1
  }

  return ranges
}

function endsWithSelfClosingSlash(tagTail: string) {
  return /\/\s*$/.test(tagTail)
}

function isTagTailBalanced(tagTail: string) {
  let quote: '"' | "'" | undefined

  for (let index = 0; index < tagTail.length; index++) {
    const current = tagTail[index]
    if (quote) {
      if (current === quote && tagTail[index - 1] !== '\\') quote = undefined
      continue
    }

    if (current === '"' || current === "'") {
      quote = current
    }
  }

  return !quote
}

function skipWhitespace(markup: string, startIndex: number) {
  let index = startIndex
  while (index < markup.length && /\s/.test(markup[index])) index++
  return index
}

function readTagNameEnd(markup: string, startIndex: number) {
  let index = startIndex
  while (index < markup.length && /[A-Za-z0-9._:$-]/.test(markup[index])) {
    index++
  }
  return index
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

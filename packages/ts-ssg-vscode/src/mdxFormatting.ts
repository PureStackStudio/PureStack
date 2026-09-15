import * as vscode from 'vscode'
import {
  formatHtmlFragment,
  getHtmlFormattingOptions,
  normalizeSelfClosingTagSpacing,
  shouldFormatOnSave,
} from './htmlFormatting'
import {
  findMdxExpressionEnd,
  findTagEnd,
  isMdxExpressionStart,
  scanTagTokens,
  VOID_HTML_TAG_NAMES,
} from './markupSupport'
import {
  buildMdxFenceDelimiterEdits,
  isMdxFenceClosingDelimiter,
  maskMdxFencedRegions,
  parseInlineMdxFenceCloser,
  parseInlineMdxFenceOpener,
  parseMdxFenceDelimiter,
  restoreMdxFencedRegions,
} from './mdxFenceFormatting'

export interface MdxMarkupBlock {
  content: string
  range: vscode.Range
}

interface MdxExpressionPlaceholder {
  placeholder: string
  source: string
}

interface MdxInlineCodePlaceholder {
  placeholder: string
  source: string
}

interface MdxFormattingRequest {
  onlyWithinRange?: vscode.Range
  requireFormatOnSave?: boolean
}

interface MdxMarkupBlockOptions {
  includeIncomplete?: boolean
}

interface MdxBlockScanState {
  activeEndLine?: number
  activeLines: string[]
  activeStartLine?: number
  fenceLength?: number
  fenceMarker?: '`' | '~'
  frontmatterHandled: boolean
  inFence: boolean
  inFrontmatter: boolean
}

export async function buildMdxFormattingEdits(
  document: vscode.TextDocument,
  request: MdxFormattingRequest = {},
) {
  if (document.languageId !== 'mdx') return []
  if (request.requireFormatOnSave && !shouldFormatMarkupOnSave(document)) {
    return []
  }

  const blocks = getMdxMarkupBlocks(document).filter((block) =>
    request.onlyWithinRange
      ? block.range.intersection(request.onlyWithinRange)
      : true,
  )

  const edits: vscode.TextEdit[] = []
  const blockRanges = blocks.map((block) => block.range)

  for (const block of blocks) {
    const formatted = await formatMdxMarkupBlock(document, block)
    if (!formatted || formatted === block.content) continue

    edits.push(vscode.TextEdit.replace(block.range, formatted))
  }

  edits.push(
    ...buildMdxFenceDelimiterEdits(document, blockRanges, {
      onlyWithinRange: request.onlyWithinRange,
    }),
  )

  return edits
}

export async function formatActiveEditorMdxMarkup(
  editor: vscode.TextEditor,
  request: MdxFormattingRequest = {},
) {
  const edits = await buildMdxFormattingEdits(editor.document, request)
  if (edits.length === 0) return false

  return editor.edit((editBuilder) => {
    for (const edit of edits) {
      editBuilder.replace(edit.range, edit.newText)
    }
  })
}

export function getMdxMarkupBlocks(
  document: vscode.TextDocument,
  options: MdxMarkupBlockOptions = {},
) {
  const blocks: MdxMarkupBlock[] = []
  const state: MdxBlockScanState = {
    activeEndLine: undefined,
    activeLines: [],
    frontmatterHandled: false,
    inFence: false,
    inFrontmatter: false,
  }

  for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
    const lineText = document.lineAt(lineIndex).text
    const trimmed = lineText.trim()

    if (startMdxFrontmatter(lineIndex, trimmed, state)) {
      continue
    }

    if (closeMdxFrontmatter(trimmed, state)) {
      continue
    }

    collectActiveMarkupBlock(
      blocks,
      document,
      lineIndex,
      lineText,
      trimmed,
      state,
    )
  }

  if (
    options.includeIncomplete &&
    state.activeStartLine !== undefined &&
    state.activeEndLine !== undefined
  ) {
    pushActiveBlock(
      blocks,
      document,
      state.activeStartLine,
      state.activeEndLine,
      state.activeLines,
    )
  }

  return blocks
}

function pushActiveBlock(
  blocks: MdxMarkupBlock[],
  document: vscode.TextDocument,
  startLine: number,
  endLine: number,
  lines: string[],
) {
  const start = new vscode.Position(startLine, 0)
  const end = document.lineAt(endLine).range.end
  blocks.push({
    content: lines.join('\n'),
    range: new vscode.Range(start, end),
  })
}

function looksLikeMarkupBlockStart(trimmedLine: string) {
  return /^<[A-Za-z][A-Za-z0-9._:$-]*/.test(trimmedLine)
}

function isCompleteMarkupBlock(markup: string) {
  const { placeholderContent } = maskMdxFencedRegions(markup)
  if (!placeholderContent.includes('<')) return false
  if (hasUnterminatedTag(placeholderContent)) return false

  return getUnclosedTagNames(placeholderContent).length === 0
}

async function formatMdxMarkupBlock(
  document: vscode.TextDocument,
  block: MdxMarkupBlock,
) {
  const formattingOptions = getHtmlFormattingOptions(document)
  const { fences, placeholderContent: fencePlaceholderContent } =
    maskMdxFencedRegions(block.content.trim())
  const { inlineCodeSpans, placeholderContent: inlineCodePlaceholderContent } =
    maskMdxInlineCodeSpans(fencePlaceholderContent)
  const { expressions, placeholderContent } = maskMdxExpressions(
    inlineCodePlaceholderContent,
  )
  if (!placeholderContent.includes('<')) return undefined

  let formatted: string
  try {
    formatted = await formatHtmlFragment(placeholderContent, formattingOptions)
  } catch (error) {
    console.warn(
      `[PureStack] Skipping MDX markup formatting for ${document.uri.fsPath}:`,
      error,
    )
    return undefined
  }

  const restoredExpressions = restoreMdxExpressions(
    normalizeSelfClosingTagSpacing(formatted.trim()),
    expressions,
  )
  const restoredInlineCode = restoreMdxInlineCodeSpans(
    restoredExpressions,
    inlineCodeSpans,
  )

  return restoreMdxFencedRegions(restoredInlineCode, fences)
}

function maskMdxInlineCodeSpans(source: string) {
  const inlineCodeSpans: MdxInlineCodePlaceholder[] = []
  const lines = source.split('\n')
  const placeholderLines = lines.map((line) =>
    maskMdxInlineCodeSpansInLine(line, inlineCodeSpans),
  )

  return {
    inlineCodeSpans,
    placeholderContent: placeholderLines.join('\n'),
  }
}

function maskMdxInlineCodeSpansInLine(
  line: string,
  inlineCodeSpans: MdxInlineCodePlaceholder[],
) {
  let placeholderLine = ''

  for (let index = 0; index < line.length; ) {
    const start = line.indexOf('`', index)
    if (start === -1) {
      placeholderLine += line.slice(index)
      break
    }

    const tickCount = countRepeatedChar(line, start, '`')
    if (tickCount !== 1) {
      placeholderLine += line.slice(index, start + tickCount)
      index = start + tickCount
      continue
    }

    const end = findMdxInlineCodeEnd(line, start + 1)
    if (end === -1) {
      placeholderLine += line.slice(index)
      break
    }

    const source = line.slice(start, end + 1)
    const placeholder = createMdxInlineCodePlaceholder(
      inlineCodeSpans.length,
      line,
      start,
      end + 1,
    )
    inlineCodeSpans.push({ placeholder, source })
    placeholderLine += line.slice(index, start)
    placeholderLine += placeholder
    index = end + 1
  }

  return placeholderLine
}

function createMdxInlineCodePlaceholder(
  index: number,
  line: string,
  start: number,
  end: number,
) {
  const lineBefore = line.slice(0, start)
  const lineAfter = line.slice(end)
  if (lineBefore.trim().length === 0 && lineAfter.trim().length === 0) {
    return `<!--PURESTACK_MDX_INLINE_CODE_${index}-->`
  }

  return `PURESTACK_MDX_INLINE_CODE_${index}`
}

function restoreMdxInlineCodeSpans(
  formatted: string,
  inlineCodeSpans: MdxInlineCodePlaceholder[],
) {
  let restored = formatted

  for (const inlineCodeSpan of sortLongestPlaceholderFirst(inlineCodeSpans)) {
    restored = restored
      .split(inlineCodeSpan.placeholder)
      .join(inlineCodeSpan.source)
  }

  return restored
}

export function maskMdxExpressions(source: string) {
  const expressions: MdxExpressionPlaceholder[] = []
  let placeholderContent = ''

  for (let index = 0; index < source.length; ) {
    const rawTextEnd = findRawTextElementEnd(source, index)
    if (rawTextEnd !== undefined) {
      placeholderContent += source.slice(index, rawTextEnd)
      index = rawTextEnd
      continue
    }

    if (!isMdxExpressionStart(source, index)) {
      placeholderContent += source[index]
      index++
      continue
    }

    const expressionEnd = findMdxExpressionEnd(source, index)
    if (expressionEnd === -1) {
      placeholderContent += source[index]
      index++
      continue
    }

    const placeholder = `PURESTACK_MDX_EXPR_${expressions.length}`
    expressions.push({
      placeholder,
      source: source.slice(index, expressionEnd),
    })
    placeholderContent += placeholder
    index = expressionEnd
  }

  return { expressions, placeholderContent }
}

function restoreMdxExpressions(
  formatted: string,
  expressions: MdxExpressionPlaceholder[],
) {
  let restored = formatted

  for (const expression of sortLongestPlaceholderFirst(expressions)) {
    restored = restored.split(expression.placeholder).join(expression.source)
  }

  return restored
}

function hasUnterminatedTag(markup: string) {
  for (let index = 0; index < markup.length; index++) {
    if (markup[index] !== '<') continue

    if (markup.startsWith('<!--', index)) {
      const commentEnd = markup.indexOf('-->', index + 4)
      if (commentEnd === -1) return true
      index = commentEnd + 2
      continue
    }

    const nextTagEnd = findTagEnd(markup, index + 1)
    if (nextTagEnd === -1) return true
    index = nextTagEnd
  }

  return false
}

function shouldFormatMarkupOnSave(document: vscode.TextDocument) {
  return shouldFormatOnSave(document)
}

function startMdxFrontmatter(
  lineIndex: number,
  trimmed: string,
  state: MdxBlockScanState,
) {
  if (state.frontmatterHandled || lineIndex !== 0 || trimmed !== '---') {
    return false
  }

  state.inFrontmatter = true
  state.frontmatterHandled = true
  return true
}

function closeMdxFrontmatter(trimmed: string, state: MdxBlockScanState) {
  if (!state.inFrontmatter) return false

  if (trimmed === '---') {
    state.inFrontmatter = false
  }

  return true
}

function updateMdxFenceState(trimmed: string, state: MdxBlockScanState) {
  const activeFence =
    state.fenceMarker && state.fenceLength
      ? { length: state.fenceLength, marker: state.fenceMarker }
      : undefined
  const delimiter =
    state.inFence && activeFence
      ? (parseInlineMdxFenceCloser(trimmed, activeFence) ??
        parseMdxFenceDelimiter(trimmed))
      : (parseMdxFenceDelimiter(trimmed) ?? parseInlineMdxFenceOpener(trimmed))
  if (!delimiter) return state.inFence

  if (!state.inFence) {
    state.inFence = true
    state.fenceLength = delimiter.length
    state.fenceMarker = delimiter.marker
    return true
  }

  if (
    state.fenceMarker &&
    state.fenceLength &&
    isMdxFenceClosingDelimiter(delimiter, {
      length: state.fenceLength,
      marker: state.fenceMarker,
    })
  ) {
    state.inFence = false
    state.fenceLength = undefined
    state.fenceMarker = undefined
  }

  return true
}

function collectActiveMarkupBlock(
  blocks: MdxMarkupBlock[],
  document: vscode.TextDocument,
  lineIndex: number,
  lineText: string,
  trimmed: string,
  state: MdxBlockScanState,
) {
  if (state.activeStartLine === undefined) {
    if (state.inFence) {
      updateMdxFenceState(trimmed, state)
      return
    }

    if (!looksLikeMarkupBlockStart(trimmed)) {
      if (updateMdxFenceState(trimmed, state)) return
      return
    }

    state.activeStartLine = lineIndex
    state.activeEndLine = lineIndex
    state.activeLines = [lineText]
  } else {
    state.activeEndLine = lineIndex
    state.activeLines.push(lineText)
  }

  updateMdxFenceState(trimmed, state)
  if (state.inFence) return
  if (!isCompleteMarkupBlock(state.activeLines.join('\n'))) return

  pushActiveBlock(
    blocks,
    document,
    state.activeStartLine,
    state.activeEndLine ?? lineIndex,
    state.activeLines,
  )
  state.activeEndLine = undefined
  state.activeStartLine = undefined
  state.activeLines = []
}

function getUnclosedTagNames(markup: string) {
  const stack: string[] = []

  for (const token of scanTagTokens(markup)) {
    if (token.kind === 'opening') {
      if (isSelfContainedTag(token.name, token.selfClosing)) continue

      stack.push(token.name)
      continue
    }

    closeMatchingTag(stack, token.name)
  }

  return stack
}

function isSelfContainedTag(tagName: string, selfClosing: boolean) {
  return selfClosing || VOID_HTML_TAG_NAMES.has(tagName.toLowerCase())
}

function closeMatchingTag(stack: string[], tagName: string) {
  for (let index = stack.length - 1; index >= 0; index--) {
    if (stack[index] !== tagName) continue
    stack.splice(index)
    return
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function sortLongestPlaceholderFirst<T extends { placeholder: string }>(
  placeholders: T[],
) {
  return [...placeholders].sort(
    (left, right) => right.placeholder.length - left.placeholder.length,
  )
}

function findMdxInlineCodeEnd(line: string, startIndex: number) {
  for (let index = startIndex; index < line.length; index++) {
    if (line[index] === '`') return index
  }

  return -1
}

function countRepeatedChar(line: string, startIndex: number, char: string) {
  let count = 0

  while (line[startIndex + count] === char) {
    count++
  }

  return count
}

function findRawTextElementEnd(source: string, startIndex: number) {
  if (source[startIndex] !== '<' || source[startIndex + 1] === '/') {
    return undefined
  }

  const tagEnd = findTagEnd(source, startIndex + 1)
  if (tagEnd === -1) return undefined

  const openingTag = source.slice(startIndex, tagEnd + 1)
  const tagName = /^<\s*(script|style)\b/i.exec(openingTag)?.[1]
  if (!tagName) return undefined

  const closingTagPattern = new RegExp(
    `<\\/\\s*${escapeRegExp(tagName)}\\s*>`,
    'i',
  )
  const closingTagMatch = closingTagPattern.exec(source.slice(tagEnd + 1))
  if (!closingTagMatch) return undefined

  return tagEnd + 1 + closingTagMatch.index + closingTagMatch[0].length
}

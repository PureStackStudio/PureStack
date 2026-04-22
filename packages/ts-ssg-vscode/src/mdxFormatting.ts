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

export interface MdxMarkupBlock {
  content: string
  range: vscode.Range
}

interface MdxExpressionPlaceholder {
  placeholder: string
  source: string
}

interface MdxFencePlaceholder {
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
  activeLines: string[]
  activeStartLine?: number
  fenceMarker?: string
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
  if (blocks.length === 0) return []

  const edits: vscode.TextEdit[] = []

  for (const block of blocks) {
    const formatted = await formatMdxMarkupBlock(document, block)
    if (!formatted || formatted === block.content) continue

    edits.push(vscode.TextEdit.replace(block.range, formatted))
  }

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

    if (
      state.activeStartLine === undefined &&
      updateMdxFenceState(trimmed, state)
    ) {
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
    state.activeLines.length > 0
  ) {
    pushActiveBlock(blocks, document, state.activeStartLine, state.activeLines)
  }

  return blocks
}

function pushActiveBlock(
  blocks: MdxMarkupBlock[],
  document: vscode.TextDocument,
  startLine: number,
  lines: string[],
) {
  const start = new vscode.Position(startLine, 0)
  const end = document.lineAt(startLine + lines.length - 1).range.end
  blocks.push({
    content: lines.join('\n'),
    range: new vscode.Range(start, end),
  })
}

function looksLikeMarkupBlockStart(trimmedLine: string) {
  return /^<[A-Za-z][A-Za-z0-9._:$-]*/.test(trimmedLine)
}

function isCompleteMarkupBlock(markup: string) {
  const { placeholderContent: maskedMarkup } = maskMdxFormattingContent(markup)
  if (!maskedMarkup.includes('<')) return false
  if (hasUnterminatedTag(maskedMarkup)) return false

  return getUnclosedTagNames(maskedMarkup).length === 0
}

async function formatMdxMarkupBlock(
  document: vscode.TextDocument,
  block: MdxMarkupBlock,
) {
  const formattingOptions = getHtmlFormattingOptions(document)
  const normalizedBlockContent = normalizeMdxFenceLayout(block.content.trim())
  const { expressions, fences, placeholderContent } = maskMdxFormattingContent(
    normalizedBlockContent,
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

  const restored = restoreMdxExpressions(
    restoreMdxFencedCodeBlocks(
      normalizeSelfClosingTagSpacing(formatted.trim()),
      fences,
    ),
    expressions,
  )

  return restored
}

function maskMdxFormattingContent(source: string) {
  const { expressions, placeholderContent: expressionMaskedContent } =
    maskMdxExpressions(source)
  const { fences, placeholderContent } = maskMdxFencedCodeBlocks(
    expressionMaskedContent,
  )

  return {
    expressions,
    fences,
    placeholderContent,
  }
}

function normalizeMdxFenceLayout(source: string) {
  const lines = source.split('\n')
  const normalizedLines: string[] = []
  let activeFenceMarker: string | undefined

  for (const line of lines) {
    if (!activeFenceMarker) {
      normalizeFenceOpeningLine(line, normalizedLines, (marker) => {
        activeFenceMarker = marker
      })
      continue
    }

    normalizeFenceBodyLine(line, activeFenceMarker, normalizedLines, () => {
      activeFenceMarker = undefined
    })
  }

  return normalizedLines.join('\n')
}

export function maskMdxExpressions(source: string) {
  const expressions: MdxExpressionPlaceholder[] = []
  let placeholderContent = ''

  for (let index = 0; index < source.length; ) {
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

    const placeholder = createMdxPlaceholder('EXPR', expressions.length)
    expressions.push({
      placeholder,
      source: source.slice(index, expressionEnd),
    })
    placeholderContent += placeholder
    index = expressionEnd
  }

  return { expressions, placeholderContent }
}

function maskMdxFencedCodeBlocks(source: string) {
  const fences: MdxFencePlaceholder[] = []
  const lines = source.split('\n')
  const nextLines: string[] = []

  for (let index = 0; index < lines.length; index++) {
    const trimmed = lines[index].trim()
    const openingFenceMatch = /^(```+|~~~+)/.exec(trimmed)
    if (!openingFenceMatch) {
      nextLines.push(lines[index])
      continue
    }

    const marker = openingFenceMatch[1][0]
    const fencedLines = [lines[index]]
    let endIndex = index

    for (let scanIndex = index + 1; scanIndex < lines.length; scanIndex++) {
      fencedLines.push(lines[scanIndex])
      endIndex = scanIndex
      if (lines[scanIndex].trim().startsWith(marker.repeat(3))) {
        break
      }
    }

    const placeholder = createMdxPlaceholder('FENCE', fences.length)
    fences.push({
      placeholder,
      source: fencedLines.join('\n'),
    })
    nextLines.push(placeholder)
    index = endIndex
  }

  return {
    fences,
    placeholderContent: nextLines.join('\n'),
  }
}

function restoreMdxFencedCodeBlocks(
  formatted: string,
  fences: MdxFencePlaceholder[],
) {
  let restored = formatted

  for (const fence of fences) {
    const placeholderLinePattern = new RegExp(
      `^([ \\t]*)${fence.placeholder}[ \\t]*$`,
      'gm',
    )
    restored = restored.replace(placeholderLinePattern, (_match, indent) =>
      alignFenceBlock(fence.source, indent),
    )
    restored = restored.split(fence.placeholder).join(fence.source)
  }

  return restored
}

function restoreMdxExpressions(
  formatted: string,
  expressions: MdxExpressionPlaceholder[],
) {
  let restored = formatted

  for (const expression of expressions) {
    restored = restored.split(expression.placeholder).join(expression.source)
  }

  return restored
}

function createMdxPlaceholder(kind: 'EXPR' | 'FENCE', index: number) {
  return `PURESTACK_MDX_${kind}_BLOCK_${index}_PURESTACK`
}

function normalizeFenceOpeningLine(
  line: string,
  normalizedLines: string[],
  onOpenFence: (marker: string) => void,
) {
  const fenceMatch = /(```+|~~~+)/.exec(line)
  if (!fenceMatch) {
    normalizedLines.push(line)
    return
  }

  const fenceIndex = fenceMatch.index
  const marker = fenceMatch[1]
  const beforeFence = line.slice(0, fenceIndex).trimEnd()
  const afterFence = line.slice(fenceIndex + marker.length)
  const closingIndex = afterFence.lastIndexOf(marker)

  if (beforeFence) {
    normalizedLines.push(beforeFence)
  }

  if (closingIndex >= 0) {
    const inlineContent = afterFence.slice(0, closingIndex).trim()
    const afterClosing = afterFence.slice(closingIndex + marker.length).trim()
    const [infoString = '', ...contentParts] =
      inlineContent.length > 0 ? inlineContent.split(/\s+/) : []
    normalizedLines.push(`${marker}${infoString}`)
    const inlineCode = contentParts.join(' ').trim()
    if (inlineCode) {
      normalizedLines.push(inlineCode)
    }
    normalizedLines.push(marker)
    if (afterClosing) {
      normalizedLines.push(afterClosing)
    }
    return
  }

  normalizedLines.push(`${marker}${afterFence.trim()}`)
  onOpenFence(marker[0])
}

function normalizeFenceBodyLine(
  line: string,
  activeFenceMarker: string,
  normalizedLines: string[],
  onCloseFence: () => void,
) {
  const closingMarker = activeFenceMarker.repeat(3)
  const closingIndex = line.indexOf(closingMarker)
  if (closingIndex === -1) {
    normalizedLines.push(line)
    return
  }

  const beforeClosing = line.slice(0, closingIndex).trimEnd()
  const afterClosing = line.slice(closingIndex + closingMarker.length).trim()

  if (beforeClosing) {
    normalizedLines.push(beforeClosing)
  }

  normalizedLines.push(closingMarker)

  if (afterClosing) {
    normalizedLines.push(afterClosing)
  }

  onCloseFence()
}

function alignFenceBlock(source: string, indent: string) {
  const lines = source.split('\n')
  if (lines.length === 0) return source

  const openingLine = `${indent}${lines[0].trim()}`
  if (lines.length === 1) return openingLine

  const closingLine = `${indent}${lines[lines.length - 1]?.trim() ?? ''}`
  const bodyLines = lines.slice(1, -1)
  const commonIndent = getCommonBodyIndent(bodyLines)
  const normalizedBodyLines = bodyLines.map((line) => {
    if (line.trim().length === 0) return indent

    if (commonIndent && line.startsWith(commonIndent)) {
      return `${indent}${line.slice(commonIndent.length)}`
    }

    return `${indent}${line.trimStart()}`
  })

  return [openingLine, ...normalizedBodyLines, closingLine].join('\n')
}

function getCommonBodyIndent(lines: string[]) {
  let commonIndent: string | undefined

  for (const line of lines) {
    if (line.trim().length === 0) continue

    const indent = /^\s*/.exec(line)?.[0] ?? ''
    if (commonIndent === undefined) {
      commonIndent = indent
      continue
    }

    while (!indent.startsWith(commonIndent) && commonIndent.length > 0) {
      commonIndent = commonIndent.slice(0, -1)
    }
  }

  return commonIndent
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
  const fenceMatch = /^(```+|~~~+)/.exec(trimmed)
  if (!fenceMatch) return state.inFence

  if (!state.inFence) {
    state.inFence = true
    state.fenceMarker = fenceMatch[1][0]
    return true
  }

  if (state.fenceMarker && trimmed.startsWith(state.fenceMarker.repeat(3))) {
    state.inFence = false
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
  if (state.inFence) return

  if (state.activeStartLine === undefined) {
    if (!looksLikeMarkupBlockStart(trimmed)) return

    state.activeStartLine = lineIndex
    state.activeLines = [lineText]
  } else {
    state.activeLines.push(lineText)
  }

  if (!isCompleteMarkupBlock(state.activeLines.join('\n'))) return

  pushActiveBlock(blocks, document, state.activeStartLine, state.activeLines)
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

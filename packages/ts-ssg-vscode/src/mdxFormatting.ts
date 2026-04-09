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

interface MdxFormattingRequest {
  onlyWithinRange?: vscode.Range
  requireFormatOnSave?: boolean
}

interface MdxMarkupBlockOptions {
  includeIncomplete?: boolean
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
  let inFence = false
  let fenceMarker: string | undefined
  let inFrontmatter = false
  let frontmatterHandled = false
  let activeStartLine: number | undefined
  let activeLines: string[] = []

  for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
    const lineText = document.lineAt(lineIndex).text
    const trimmed = lineText.trim()

    if (!frontmatterHandled && lineIndex === 0 && trimmed === '---') {
      inFrontmatter = true
      frontmatterHandled = true
      continue
    }

    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false
      continue
    }

    const fenceMatch = /^(```+|~~~+)/.exec(trimmed)
    if (fenceMatch) {
      if (!inFence) {
        inFence = true
        fenceMarker = fenceMatch[1][0]
      } else if (fenceMarker && trimmed.startsWith(fenceMarker.repeat(3))) {
        inFence = false
        fenceMarker = undefined
      }
      continue
    }

    if (inFence) continue

    if (activeStartLine === undefined) {
      if (!looksLikeMarkupBlockStart(trimmed)) continue

      activeStartLine = lineIndex
      activeLines = [lineText]
    } else {
      activeLines.push(lineText)
    }

    if (!isCompleteMarkupBlock(activeLines.join('\n'))) continue

    pushActiveBlock(blocks, document, activeStartLine, activeLines)
    activeStartLine = undefined
    activeLines = []
  }

  if (
    options.includeIncomplete &&
    activeStartLine !== undefined &&
    activeLines.length > 0
  ) {
    pushActiveBlock(blocks, document, activeStartLine, activeLines)
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
  if (!markup.includes('<')) return false
  if (hasUnterminatedTag(markup)) return false

  const stack: string[] = []

  for (const token of scanTagTokens(markup)) {
    if (token.kind === 'opening') {
      if (
        token.selfClosing ||
        VOID_HTML_TAG_NAMES.has(token.name.toLowerCase())
      ) {
        continue
      }

      stack.push(token.name)
      continue
    }

    for (let index = stack.length - 1; index >= 0; index--) {
      if (stack[index] !== token.name) continue
      stack.splice(index)
      break
    }
  }

  return stack.length === 0
}

async function formatMdxMarkupBlock(
  document: vscode.TextDocument,
  block: MdxMarkupBlock,
) {
  const formattingOptions = getHtmlFormattingOptions(document)
  const { expressions, placeholderContent } = maskMdxExpressions(
    block.content.trim(),
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
    normalizeSelfClosingTagSpacing(formatted.trim()),
    expressions,
  )

  return restored
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

  for (const expression of expressions) {
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

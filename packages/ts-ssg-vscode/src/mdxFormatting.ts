import * as vscode from 'vscode'
import {
  formatHtmlFragment,
  getHtmlFormattingOptions,
  normalizeSelfClosingTagSpacing,
  shouldFormatOnSave,
} from './htmlFormatting'

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

const VOID_HTML_TAG_NAMES = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

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
    if (!startsMdxExpression(source, index)) {
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

function startsMdxExpression(source: string, index: number) {
  return (
    source[index] === '{' &&
    source[index - 1] !== '{' &&
    source[index + 1] !== '{'
  )
}

function findMdxExpressionEnd(source: string, startIndex: number) {
  let braceDepth = 0
  let quote: '"' | "'" | '`' | undefined

  for (let index = startIndex; index < source.length; index++) {
    const current = source[index]
    const previous = source[index - 1]

    if (quote) {
      if (current === quote && previous !== '\\') {
        quote = undefined
      } else if (
        quote === '`' &&
        current === '$' &&
        source[index + 1] === '{'
      ) {
        const templateExpressionEnd = findMdxExpressionEnd(source, index + 1)
        if (templateExpressionEnd === -1) return -1
        index = templateExpressionEnd - 1
      }
      continue
    }

    if (current === '"' || current === "'" || current === '`') {
      quote = current
      continue
    }

    if (current === '{') {
      braceDepth++
      continue
    }

    if (current !== '}') continue

    braceDepth--
    if (braceDepth === 0) return index + 1
    if (braceDepth < 0) return -1
  }

  return -1
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

    const tagEnd = findTagEnd(markup, index + 1)
    if (tagEnd === -1) return true
    index = tagEnd
  }

  return false
}

function scanTagTokens(markup: string) {
  const tokens: Array<{
    kind: 'closing' | 'opening'
    name: string
    selfClosing: boolean
  }> = []

  for (let index = 0; index < markup.length; index++) {
    if (markup[index] !== '<') continue

    if (markup.startsWith('<!--', index)) {
      const commentEnd = markup.indexOf('-->', index + 4)
      if (commentEnd === -1) break
      index = commentEnd + 2
      continue
    }

    const isClosing = markup[index + 1] === '/'
    const nameStart = skipWhitespace(markup, index + (isClosing ? 2 : 1))
    const nameEnd = readTagNameEnd(markup, nameStart)
    if (nameEnd === nameStart) continue

    const tagEnd = findTagEnd(markup, nameEnd)
    if (tagEnd === -1) break

    const name = markup.slice(nameStart, nameEnd)
    const trailing = markup.slice(nameEnd, tagEnd)
    tokens.push({
      kind: isClosing ? 'closing' : 'opening',
      name,
      selfClosing: !isClosing && /\/\s*$/.test(trailing),
    })
    index = tagEnd
  }

  return tokens
}

function findTagEnd(markup: string, startIndex: number) {
  let quote: '"' | "'" | undefined

  for (let index = startIndex; index < markup.length; index++) {
    const current = markup[index]
    if (quote) {
      if (current === quote && markup[index - 1] !== '\\') quote = undefined
      continue
    }

    if (current === '"' || current === "'") {
      quote = current
      continue
    }

    if (current === '>') return index
  }

  return -1
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

function shouldFormatMarkupOnSave(document: vscode.TextDocument) {
  return shouldFormatOnSave(document)
}

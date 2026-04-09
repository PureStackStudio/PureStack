import ts from 'typescript'
import * as vscode from 'vscode'

const SUPPORTED_TEMPLATE_TAG_NAMES = new Set(['html', 'raw', 'svg'])

export const VOID_HTML_TAG_NAMES = new Set([
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

export interface MarkupContext {
  contentEndOffset: number
  contentStartOffset: number
  ignoredRanges: Array<{ end: number; start: number }>
}

export interface TagToken {
  end: number
  kind: 'closing' | 'opening'
  name: string
  nameEnd: number
  nameStart: number
  selfClosing: boolean
  start: number
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

export function scanTagTokens(markup: string) {
  const tokens: TagToken[] = []

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
      start: index,
      end: tagEnd + 1,
      kind: isClosing ? 'closing' : 'opening',
      name,
      nameStart,
      nameEnd,
      selfClosing: !isClosing && /\/\s*$/.test(trailing),
    })
    index = tagEnd
  }

  return tokens
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

  function visitNode(node: ts.Node) {
    if (matchedContext) return
    if (offset < node.getStart(sourceFile) || offset > node.getEnd()) return

    if (ts.isTaggedTemplateExpression(node)) {
      const tagName = normalizeSupportedTemplateTagName(
        node.tag.getText(sourceFile),
      )
      if (!tagName) {
        ts.forEachChild(node, visitNode)
        return
      }

      const template = node.template
      const contentStartOffset = template.getStart(sourceFile) + 1
      const contentEndOffset = template.getEnd() - 1
      if (offset < contentStartOffset || offset > contentEndOffset) {
        ts.forEachChild(node, visitNode)
        return
      }

      matchedContext = {
        contentEndOffset,
        contentStartOffset,
        ignoredRanges: ts.isTemplateExpression(template)
          ? template.templateSpans.map((span) => ({
              start: span.expression.getStart(sourceFile),
              end: span.expression.getEnd(),
            }))
          : [],
      }
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
    ignoredRanges.some((range) => offset >= range.start && offset <= range.end)
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
  let inFence = false
  let fenceMarker: string | undefined
  let fenceStartOffset: number | undefined
  let inFrontmatter = false
  let frontmatterStartOffset: number | undefined

  for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
    const line = document.lineAt(lineIndex)
    const trimmed = line.text.trim()

    if (lineIndex === 0 && trimmed === '---') {
      inFrontmatter = true
      frontmatterStartOffset = document.offsetAt(line.range.start)
      continue
    }

    if (inFrontmatter) {
      if (trimmed === '---' && lineIndex > 0) {
        ignoredRanges.push({
          start: frontmatterStartOffset ?? 0,
          end: document.offsetAt(line.rangeIncludingLineBreak.end),
        })
        inFrontmatter = false
        frontmatterStartOffset = undefined
      }
    } else {
      const fenceMatch = /^(```+|~~~+)/.exec(trimmed)
      if (fenceMatch) {
        if (!inFence) {
          inFence = true
          fenceMarker = fenceMatch[1][0]
          fenceStartOffset = document.offsetAt(line.range.start)
        } else if (fenceMarker && trimmed.startsWith(fenceMarker.repeat(3))) {
          ignoredRanges.push({
            start: fenceStartOffset ?? document.offsetAt(line.range.start),
            end: document.offsetAt(line.rangeIncludingLineBreak.end),
          })
          inFence = false
          fenceMarker = undefined
          fenceStartOffset = undefined
        }
      }
    }
  }

  if (inFrontmatter && frontmatterStartOffset !== undefined) {
    ignoredRanges.push({
      start: frontmatterStartOffset,
      end: document.getText().length,
    })
  }

  if (inFence && fenceStartOffset !== undefined) {
    ignoredRanges.push({
      start: fenceStartOffset,
      end: document.getText().length,
    })
  }

  return ignoredRanges.concat(getMdxExpressionRanges(document))
}

function getMdxExpressionRanges(document: vscode.TextDocument) {
  const text = document.getText()
  const ranges: Array<{ start: number; end: number }> = []

  for (let index = 0; index < text.length; index++) {
    if (!startsMdxExpression(text, index)) continue

    const end = findMdxExpressionEnd(text, index)
    if (end === -1) continue

    ranges.push({ start: index, end })
    index = end - 1
  }

  return ranges
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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

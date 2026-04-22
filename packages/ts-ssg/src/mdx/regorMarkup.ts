type MarkdownNode = {
  type?: unknown
  value?: unknown
  children?: unknown
  position?: {
    start?: { offset?: number }
    end?: { offset?: number }
  }
}

type MutableMarkdownNode = {
  type?: string
  value?: string
  children?: unknown[]
}

type ParentNode = MutableMarkdownNode & {
  children: unknown[]
}

type ParagraphNode = ParentNode & {
  type: 'paragraph'
}

type TextNode = MutableMarkdownNode & {
  type: 'text'
  value: string
}

type HtmlNode = MutableMarkdownNode & {
  type: 'html'
  value: string
}

type MarkupSegment = {
  placeholder: string
  source: string
}

type TagToken = {
  end: number
  kind: 'closing' | 'opening'
  name: string
  nameEnd: number
  selfClosing: boolean
  start: number
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

export function maskRegorMarkup(source: string, root: unknown) {
  const ignoredRanges = collectIgnoredRanges(root)
  const ranges = collectMarkupRanges(source, ignoredRanges)
  const segments: MarkupSegment[] = []
  if (ranges.length === 0) {
    return { segments, source }
  }

  let next = ''
  let lastIndex = 0
  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index]
    const placeholder = `PURESTACK_REGOR_MARKUP_${index}_`
    segments.push({
      placeholder,
      source: source.slice(range.start, range.end),
    })
    next += source.slice(lastIndex, range.start)
    next += placeholder
    lastIndex = range.end
  }
  next += source.slice(lastIndex)

  return { segments, source: next }
}

export function restoreRegorMarkup(root: unknown, segments: MarkupSegment[]) {
  if (segments.length === 0) return
  const byPlaceholder = new Map(
    segments.map((segment) => [segment.placeholder, segment.source]),
  )
  visit(root)

  function visit(node: unknown) {
    if (!isObject(node)) return
    const children = getChildren(node)
    if (!children) return

    const next: unknown[] = []
    for (const child of children) {
      if (isTextNode(child)) {
        next.push(...splitTextByPlaceholders(child, byPlaceholder))
        continue
      }
      next.push(child)
    }

    ;(node as ParentNode).children = next
    for (const child of next) {
      visit(child)
    }
  }
}

export function normalizeMarkupParagraphs(root: unknown) {
  visit(root)

  function visit(node: unknown) {
    if (!isObject(node)) return
    const children = getChildren(node)
    if (!children) return

    const next: unknown[] = []
    for (const child of children) {
      if (isParagraphNode(child) && containsOnlyMarkupAndWhitespace(child)) {
        next.push(...child.children)
        continue
      }
      next.push(child)
    }

    ;(node as ParentNode).children = next
    for (const child of next) {
      visit(child)
    }
  }
}

function splitTextByPlaceholders(
  node: TextNode,
  byPlaceholder: Map<string, string>,
): Array<TextNode | HtmlNode> {
  let index = 0
  const parts: Array<TextNode | HtmlNode> = []
  const value = node.value

  while (index < value.length) {
    const match = findNextPlaceholder(value, index, byPlaceholder)
    if (!match) {
      parts.push(createTextNode(value.slice(index)))
      break
    }

    if (match.index > index) {
      parts.push(createTextNode(value.slice(index, match.index)))
    }
    parts.push(createHtmlNode(match.source))
    index = match.index + match.placeholder.length
  }

  return parts.filter((part) =>
    part.type === 'html' ? true : part.value.length > 0,
  )
}

function findNextPlaceholder(
  value: string,
  startIndex: number,
  byPlaceholder: Map<string, string>,
) {
  let best: { index: number; placeholder: string; source: string } | undefined

  for (const [placeholder, source] of byPlaceholder) {
    const index = value.indexOf(placeholder, startIndex)
    if (index === -1) continue
    if (!best || index < best.index) {
      best = { index, placeholder, source }
    }
  }

  return best
}

function createTextNode(value: string): TextNode {
  return { type: 'text', value }
}

function createHtmlNode(value: string): HtmlNode {
  return { type: 'html', value }
}

function containsOnlyMarkupAndWhitespace(node: ParagraphNode) {
  const children = getChildren(node)
  if (!children || children.length === 0) return false
  let sawHtml = false

  for (const child of children) {
    if (isWhitespaceTextNode(child)) continue
    if (isHtmlNode(child)) {
      sawHtml = true
      continue
    }
    return false
  }

  return sawHtml
}

function collectMarkupRanges(
  source: string,
  ignoredRanges: Array<{ start: number; end: number }>,
) {
  const sanitized = maskIgnoredRanges(source, ignoredRanges)
  const tokens = scanTagTokens(sanitized)
  const ranges: Array<{ start: number; end: number }> = []
  const stack: TagToken[] = []

  for (const token of tokens) {
    if (token.kind === 'opening') {
      if (stack.length === 0) {
        if (
          token.selfClosing ||
          VOID_HTML_TAG_NAMES.has(token.name.toLowerCase())
        ) {
          ranges.push({ start: token.start, end: token.end })
          continue
        }
      }
      if (
        token.selfClosing ||
        VOID_HTML_TAG_NAMES.has(token.name.toLowerCase())
      ) {
        continue
      }
      stack.push(token)
      continue
    }

    const openIndex = findMatchingOpenTagIndex(stack, token.name)
    if (openIndex === -1) continue

    const isTopLevelPair = openIndex === 0
    const opening = stack[openIndex]
    stack.splice(openIndex)
    if (isTopLevelPair) {
      ranges.push({ start: opening.start, end: token.end })
    }
  }

  return ranges.sort((left, right) => left.start - right.start)
}

function findMatchingOpenTagIndex(stack: TagToken[], tagName: string) {
  for (let index = stack.length - 1; index >= 0; index--) {
    if (stack[index].name === tagName) return index
  }
  return -1
}

function maskIgnoredRanges(
  source: string,
  ignoredRanges: Array<{ start: number; end: number }>,
) {
  if (ignoredRanges.length === 0) return source
  const chars = source.split('')
  for (const range of ignoredRanges) {
    for (let index = range.start; index < range.end; index++) {
      chars[index] = ' '
    }
  }
  return chars.join('')
}

function collectIgnoredRanges(root: unknown) {
  const ranges: Array<{ start: number; end: number }> = []
  visit(root)
  return ranges

  function visit(node: unknown) {
    if (!isObject(node)) return
    if (
      isNodeWithPosition(node) &&
      (node.type === 'code' || node.type === 'inlineCode')
    ) {
      ranges.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
      })
      return
    }

    const children = getChildren(node)
    if (!children) return
    for (const child of children) {
      visit(child)
    }
  }
}

function scanTagTokens(markup: string) {
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
    if (!isLikelyMarkupTag(markup, nameEnd, tagEnd, isClosing)) continue

    tokens.push({
      start: index,
      end: tagEnd + 1,
      kind: isClosing ? 'closing' : 'opening',
      name: markup.slice(nameStart, nameEnd),
      nameEnd,
      selfClosing: !isClosing && /\/\s*$/.test(markup.slice(nameEnd, tagEnd)),
    })
    index = tagEnd
  }

  return tokens
}

function isLikelyMarkupTag(
  markup: string,
  nameEnd: number,
  tagEnd: number,
  isClosing: boolean,
) {
  const next = markup[nameEnd]
  if (next === '>' || next === '/' || /\s/.test(next)) return true
  if (isClosing) return false

  const between = markup.slice(nameEnd, tagEnd)
  return /^\s/.test(between)
}

function findTagEnd(markup: string, startIndex: number) {
  let quote: '"' | "'" | undefined

  for (let index = startIndex; index < markup.length; index++) {
    const current = markup[index]
    if (quote) {
      if (current === quote && markup[index - 1] !== '\\') {
        quote = undefined
      }
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
  while (index < markup.length && /\s/.test(markup[index])) {
    index++
  }
  return index
}

function readTagNameEnd(markup: string, startIndex: number) {
  let index = startIndex
  while (index < markup.length && /[A-Za-z0-9._:$-]/.test(markup[index])) {
    index++
  }
  return index
}

function isObject(value: unknown): value is MarkdownNode {
  return typeof value === 'object' && value !== null
}

function isNodeWithPosition(node: MarkdownNode): node is MarkdownNode & {
  position: { start: { offset: number }; end: { offset: number } }
} {
  return (
    typeof node.position?.start?.offset === 'number' &&
    typeof node.position?.end?.offset === 'number'
  )
}

function getChildren(node: MarkdownNode): unknown[] | null {
  return Array.isArray(node.children) ? node.children : null
}

function isTextNode(node: unknown): node is TextNode {
  return (
    isObject(node) && node.type === 'text' && typeof node.value === 'string'
  )
}

function isWhitespaceTextNode(node: unknown): node is TextNode {
  return isTextNode(node) && node.value.trim().length === 0
}

function isHtmlNode(node: unknown): node is HtmlNode {
  return (
    isObject(node) && node.type === 'html' && typeof node.value === 'string'
  )
}

function isParagraphNode(node: unknown): node is ParagraphNode {
  return (
    isObject(node) && node.type === 'paragraph' && Array.isArray(node.children)
  )
}

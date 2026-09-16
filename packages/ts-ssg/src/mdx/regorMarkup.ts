/**
 * `regorMarkup.ts` is the adapter that makes “Regor-style MDX” work with a plain markdown parser.

In this codebase, MDX isn’t parsed with a real JSX/MDX parser first. Instead, [mdx.ts](/d:/code/modern/mygit/PureStack/packages/ts-ssg/src/mdx/mdx.ts:28) uses `regorMarkup.ts` to temporarily hide component markup like `<Tabs>`, `<Btn>`, directive attrs like `:tone`, `@click`, `#slot`, and then restore it afterward.

The file does four main jobs:

1. `maskRegorMarkup(...)`
[regorMarkup.ts](/d:/code/modern/mygit/PureStack/packages/ts-ssg/src/mdx/regorMarkup.ts:72)
It scans the raw source, finds top-level markup islands, and replaces them with placeholders like `PURESTACK_REGOR_MARKUP_0_`.
This prevents `remark-parse` from mangling Regor component markup.

2. `restoreRegorMarkup(...)`
[regorMarkup.ts](/d:/code/modern/mygit/PureStack/packages/ts-ssg/src/mdx/regorMarkup.ts:98)
After markdown parsing, it walks the mdast tree and swaps those placeholders back into `html` nodes so the original markup is preserved.

3. `normalizeMarkupParagraphs(...)`
[regorMarkup.ts](/d:/code/modern/mygit/PureStack/packages/ts-ssg/src/mdx/regorMarkup.ts:137)
Markdown likes to wrap standalone raw HTML in paragraphs. This function removes those synthetic `<p>...</p>` wrappers when a paragraph contains only markup and whitespace.

4. Code handling inside opaque Regor markup
[regorMarkup.ts](/d:/code/modern/mygit/PureStack/packages/ts-ssg/src/mdx/regorMarkup.ts:126)
[regorMarkup.ts](/d:/code/modern/mygit/PureStack/packages/ts-ssg/src/mdx/regorMarkup.ts:449)
Because masked Regor markup is opaque to the markdown parser, fenced blocks and inline backticks inside components would otherwise be missed. The file now post-processes restored markup segments to turn:
- fenced blocks into `<pre><code>...`
- inline backticks into `<code>...`
and, if a highlighter exists, it renders them with the same highlighting path as normal markdown code.

Internally, the interesting helpers are:
- `collectIgnoredRanges(...)`: skips real markdown code spans/fences so `<Btn>` inside code samples is not mistaken for markup
- `collectMarkupRanges(...)` + `scanTagTokens(...)`: lightweight tag scanner to find markup islands in raw text
- `splitTextByPlaceholders(...)`: turns placeholder text back into real html nodes

So the short version is: `regorMarkup.ts` is the compatibility layer that lets this project support Regor component syntax inside `.mdx` files while still using a mostly markdown-first pipeline.
 */

import type { MdxCodeHighlighter } from './highlight'
import {
  renderHighlightedInlineCodeHtml,
  renderHighlightedPreHtml,
} from './shikiHighlighting'

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

type RegorMarkupMaskOptions = {
  sourceRelPath?: string
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

export function maskRegorMarkup(
  source: string,
  parse: (source: string) => unknown,
  options: RegorMarkupMaskOptions = {},
) {
  // Markdown's HTML blocks can hide a fence opener but expose its closer.
  // Mask fences first so the preliminary parse cannot consume later markup.
  const fenceRanges = collectFencedCodeRanges(source)
  const root = parse(maskIgnoredRanges(source, fenceRanges))
  const ignoredRanges = [...fenceRanges, ...collectIgnoredRanges(root)]
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
      source: annotateRegorScriptSourceRelPath(
        source.slice(range.start, range.end),
        options.sourceRelPath,
      ),
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

export function renderRegorMarkupCodeFences(
  segments: MarkupSegment[],
  highlighter?: MdxCodeHighlighter,
) {
  if (segments.length === 0) return segments
  return segments.map((segment) => ({
    ...segment,
    source: replaceMarkupCodeFences(segment.source, highlighter),
  }))
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

function annotateRegorScriptSourceRelPath(
  source: string,
  sourceRelPath?: string,
) {
  const normalizedSourceRelPath = sourceRelPath?.trim()
  if (!normalizedSourceRelPath) return source

  const tokens = scanTagTokens(
    maskIgnoredRanges(source, collectFencedCodeRanges(source)),
  ).filter(
    (token) =>
      token.kind === 'opening' && isSourceOwnedScriptComponentName(token.name),
  )
  if (tokens.length === 0) return source

  const attribute = ` sourceRelPath="${escapeHtmlAttribute(normalizedSourceRelPath)}"`
  let cursor = 0
  const parts = tokens.flatMap((token) => {
    const insertIndex = getAttributeInsertIndex(source, token)
    const part = [source.slice(cursor, insertIndex), attribute]
    cursor = insertIndex
    return part
  })

  parts.push(source.slice(cursor))
  return parts.join('')
}

function isSourceOwnedScriptComponentName(name: string) {
  const normalized = normalizeMarkupName(name)
  return normalized === 'pagescript' || normalized === 'regorapp'
}

function normalizeMarkupName(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]/g, '')
}

function getAttributeInsertIndex(source: string, token: TagToken) {
  if (!token.selfClosing) return token.end - 1
  const slashIndex = getSelfClosingSlashIndex(source, token)
  if (slashIndex === undefined) return token.end - 1

  let insertIndex = slashIndex
  while (insertIndex > token.nameEnd && /\s/.test(source[insertIndex - 1])) {
    insertIndex -= 1
  }
  return insertIndex
}

function getSelfClosingSlashIndex(source: string, token: TagToken) {
  let index = token.end - 2
  while (index > token.nameEnd && /\s/.test(source[index])) {
    index -= 1
  }
  return source[index] === '/' ? index : undefined
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
      if (chars[index] !== '\n' && chars[index] !== '\r') chars[index] = ' '
    }
  }
  return chars.join('')
}

function collectFencedCodeRanges(source: string) {
  const ranges: Array<{ start: number; end: number }> = []
  let active: { start: number; marker: string; length: number } | undefined
  let offset = 0
  for (const line of source.split('\n')) {
    if (active) {
      if (isFenceEnd(line, active.marker, active.length)) {
        ranges.push({ start: active.start, end: offset + line.length })
        active = undefined
      }
    } else {
      const fence = parseFenceStart(line)
      if (fence) active = { start: offset, ...fence }
    }
    offset += line.length + 1
  }
  if (active) ranges.push({ start: active.start, end: source.length })
  return ranges
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

function replaceMarkupCodeFences(
  source: string,
  highlighter?: MdxCodeHighlighter,
) {
  const lines = source.split('\n')
  const next: string[] = []
  let markupStart = 0

  for (let index = 0; index < lines.length; index += 1) {
    const fence = parseFenceStart(lines[index])
    if (!fence) continue

    const body: string[] = []
    let closeIndex = index + 1
    for (; closeIndex < lines.length; closeIndex += 1) {
      if (isFenceEnd(lines[closeIndex], fence.marker, fence.length)) break
      body.push(stripFenceIndent(lines[closeIndex], fence.indent))
    }
    if (closeIndex >= lines.length) continue

    if (markupStart < index) {
      next.push(
        replaceMarkupInlineCode(
          lines.slice(markupStart, index).join('\n'),
          highlighter,
        ),
      )
    }
    next.push(
      renderCodeFenceBlock(body.join('\n'), fence.language, highlighter),
    )
    index = closeIndex
    markupStart = closeIndex + 1
  }

  if (markupStart < lines.length) {
    next.push(
      replaceMarkupInlineCode(lines.slice(markupStart).join('\n'), highlighter),
    )
  }
  return next.join('\n')
}

function parseFenceStart(line: string) {
  const match = /^([ \t]*)(`{3,}|~{3,})([^\r\n]*)\r?$/.exec(line)
  if (!match) return undefined
  const marker = match[2][0]
  if (marker === '`' && match[3].includes('`')) return undefined
  const language = normalizeFenceLanguage(match[3])
  return {
    indent: match[1],
    length: match[2].length,
    language,
    marker,
  }
}

function normalizeFenceLanguage(info: string) {
  const value = info.trim()
  if (!value) return undefined
  const [language] = value.split(/\s+/g)
  return language || undefined
}

function isFenceEnd(line: string, marker: string, length: number) {
  const trimmed = line.trim()
  if (!trimmed) return false
  if (trimmed[0] !== marker) return false
  if (trimmed.length < length) return false
  for (let index = 0; index < trimmed.length; index += 1) {
    if (trimmed[index] !== marker) {
      return /^\s*$/.test(trimmed.slice(index))
    }
  }
  return true
}

function stripFenceIndent(line: string, indent: string) {
  return indent && line.startsWith(indent) ? line.slice(indent.length) : line
}

function renderCodeFenceBlock(
  code: string,
  language: string | undefined,
  highlighter?: MdxCodeHighlighter,
) {
  if (highlighter) {
    const highlighted = renderHighlightedPreHtml(code, language, highlighter)
    if (highlighted) return highlighted
  }

  const languageClass = language
    ? ` class="language-${escapeHtmlAttribute(language)}"`
    : ''
  return `<pre><code${languageClass}>${escapeHtml(code)}</code></pre>`
}

function replaceMarkupInlineCode(
  source: string,
  highlighter?: MdxCodeHighlighter,
) {
  const parts = source.split(/(<[^>]+>)/g)
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]
    if (!part || looksLikeTag(part)) continue
    parts[index] = replaceInlineCodeInText(part, highlighter)
  }
  return parts.join('')
}

function replaceInlineCodeInText(
  value: string,
  highlighter?: MdxCodeHighlighter,
) {
  let next = ''
  let index = 0

  while (index < value.length) {
    const start = value.indexOf('`', index)
    if (start === -1) {
      next += value.slice(index)
      break
    }

    const tickCount = countRepeatedChar(value, start, '`')
    if (tickCount !== 1) {
      next += value.slice(index, start + tickCount)
      index = start + tickCount
      continue
    }

    const end = findInlineCodeEnd(value, start + 1)
    if (end === -1) {
      next += value.slice(index)
      break
    }

    next += value.slice(index, start)
    next += renderInlineCodeSpan(value.slice(start + 1, end), highlighter)
    index = end + 1
  }

  return next
}

function findInlineCodeEnd(value: string, startIndex: number) {
  for (let index = startIndex; index < value.length; index += 1) {
    if (value[index] === '`') return index
  }
  return -1
}

function renderInlineCodeSpan(code: string, highlighter?: MdxCodeHighlighter) {
  if (highlighter) {
    const highlighted = renderHighlightedInlineCodeHtml(
      code,
      undefined,
      highlighter,
    )
    if (highlighted) return highlighted
  }

  return `<code>${escapeHtml(code)}</code>`
}

function looksLikeTag(value: string) {
  return value.startsWith('<') && value.endsWith('>')
}

function countRepeatedChar(value: string, start: number, char: string) {
  let count = 0
  while (value[start + count] === char) {
    count += 1
  }
  return count
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeHtmlAttribute(value: string) {
  return escapeHtml(value).replaceAll('"', '&quot;')
}

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

export interface TagToken {
  end: number
  kind: 'closing' | 'opening'
  name: string
  nameEnd: number
  nameStart: number
  selfClosing: boolean
  start: number
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

export function isMdxExpressionStart(source: string, index: number) {
  return (
    source[index] === '{' &&
    source[index - 1] !== '{' &&
    source[index + 1] !== '{'
  )
}

export function findMdxExpressionEnd(source: string, startIndex: number) {
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

export function findTagEnd(markup: string, startIndex: number) {
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

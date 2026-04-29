export type ComponentTagContext = {
  activeAttributeName?: string
  attributeNames: Set<string>
  componentName: string
  isClosingTag: boolean
}

export function getComponentTagContextAtOffset(
  documentText: string,
  offset: number,
): ComponentTagContext | undefined {
  const tagStart = findTagStart(documentText, offset)
  if (tagStart < 0) return undefined

  const tagEnd = documentText.indexOf('>', offset)
  if (tagEnd < 0) return undefined
  if (documentText.slice(tagStart, offset).includes('>')) return undefined

  const tagText = documentText.slice(tagStart, tagEnd + 1)
  const isClosingTag = /^<\s*\//.test(tagText)
  const tagNameMatch = /^<\s*\/?\s*([A-Za-z][A-Za-z0-9-]*)/.exec(tagText)
  if (!tagNameMatch) return undefined

  const componentName = tagNameMatch[1]
  const cursorRelativeOffset = offset - tagStart

  return {
    activeAttributeName: isClosingTag
      ? undefined
      : getActiveAttributeName(tagText, cursorRelativeOffset),
    attributeNames: isClosingTag ? new Set() : getAttributeNames(tagText),
    componentName,
    isClosingTag,
  }
}

export function stripAttributePrefix(value: string) {
  if (value.startsWith('r-bind:')) return value.slice('r-bind:'.length)
  if (value.startsWith(':') || value.startsWith('.')) return value.slice(1)
  return value
}

function findTagStart(documentText: string, offset: number) {
  for (let index = offset - 1; index >= 0; index--) {
    const currentCharacter = documentText[index]
    if (currentCharacter === '<') return index
    if (currentCharacter === '>') return -1
  }

  return -1
}

function getAttributeNames(tagText: string) {
  const attributeNames = new Set<string>()
  const pattern =
    /([:@.]?[A-Za-z][A-Za-z0-9:-]*)\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+)/g

  for (;;) {
    const match = pattern.exec(tagText)
    if (!match) return attributeNames

    attributeNames.add(stripAttributePrefix(match[1]))
  }
}

function getActiveAttributeName(tagText: string, cursorRelativeOffset: number) {
  const textBeforeCursor = tagText.slice(0, cursorRelativeOffset)
  const quotedValueMatch =
    /([:@.]?[A-Za-z][A-Za-z0-9:-]*)\s*=\s*(?:"[^"]*$|'[^']*$)/.exec(
      textBeforeCursor,
    )
  if (quotedValueMatch) return stripAttributePrefix(quotedValueMatch[1])

  return undefined
}

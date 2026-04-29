import * as vscode from 'vscode'
import {
  getMarkupContextAtOffset,
  isOffsetInsideIgnoredRange,
  sanitizeMarkup,
  scanTagTokens,
  type TagToken,
  VOID_HTML_TAG_NAMES,
} from './markupSupport'

const TAG_NAME_PATTERN = /[A-Za-z][A-Za-z0-9._:$-]*/
const LINKED_EDITING_SELECTORS: vscode.DocumentSelector = [
  { language: 'mdx', scheme: 'file' },
  { language: 'typescript', scheme: 'file' },
]

export function registerLinkedEditingProvider() {
  return vscode.languages.registerLinkedEditingRangeProvider(
    LINKED_EDITING_SELECTORS,
    new MarkupLinkedEditingProvider(),
  )
}

class MarkupLinkedEditingProvider implements vscode.LinkedEditingRangeProvider {
  provideLinkedEditingRanges(
    document: vscode.TextDocument,
    position: vscode.Position,
  ) {
    const offset = document.offsetAt(position)
    const context = getMarkupContextAtOffset(document, offset)
    if (!context) return undefined
    if (isOffsetInsideIgnoredRange(context, offset)) return undefined

    const sanitized = sanitizeMarkup(
      document,
      context,
      context.contentStartOffset,
      context.contentEndOffset,
    )
    const localOffset = offset - context.contentStartOffset
    const tokens = scanTagTokens(sanitized)
    const activeTokenIndex = tokens.findIndex(
      (token) => localOffset >= token.nameStart && localOffset <= token.nameEnd,
    )
    if (activeTokenIndex === -1) return undefined

    const activeToken = tokens[activeTokenIndex]
    if (
      activeToken.selfClosing ||
      VOID_HTML_TAG_NAMES.has(activeToken.name.toLowerCase())
    ) {
      return undefined
    }

    const pairIndex = findPairedTokenIndex(tokens, activeTokenIndex)
    if (pairIndex === undefined) return undefined

    const linkedRanges = [activeTokenIndex, pairIndex].map((index) =>
      toDocumentRange(document, context.contentStartOffset, tokens[index]),
    )

    return new vscode.LinkedEditingRanges(linkedRanges, TAG_NAME_PATTERN)
  }
}

function findPairedTokenIndex(tokens: TagToken[], tokenIndex: number) {
  const pairIndexes = new Map<number, number>()
  const openStack: Array<{ index: number; name: string }> = []

  tokens.forEach((token, index) => {
    if (token.kind === 'opening') {
      if (
        token.selfClosing ||
        VOID_HTML_TAG_NAMES.has(token.name.toLowerCase())
      ) {
        return
      }

      openStack.push({ index, name: token.name })
      return
    }

    for (let stackIndex = openStack.length - 1; stackIndex >= 0; stackIndex--) {
      const candidate = openStack[stackIndex]
      if (candidate.name !== token.name) continue

      pairIndexes.set(candidate.index, index)
      pairIndexes.set(index, candidate.index)
      openStack.splice(stackIndex, 1)
      break
    }
  })

  return pairIndexes.get(tokenIndex)
}

function toDocumentRange(
  document: vscode.TextDocument,
  contentStartOffset: number,
  token: TagToken,
) {
  const start = document.positionAt(contentStartOffset + token.nameStart)
  const end = document.positionAt(contentStartOffset + token.nameEnd)
  return new vscode.Range(start, end)
}

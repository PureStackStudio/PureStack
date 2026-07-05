import * as vscode from 'vscode'
import { scanTagTokens } from './markupSupport'

export interface MdxFencePlaceholder {
  placeholder: string
  source: string
}

export interface MdxFence {
  length: number
  marker: '`' | '~'
}

export interface MdxFenceDelimiter extends MdxFence {
  suffix: string
}

export interface MdxFenceDelimiterEditOptions {
  onlyWithinRange?: vscode.Range
}

export function buildMdxFenceDelimiterEdits(
  document: vscode.TextDocument,
  excludedRanges: vscode.Range[],
  options: MdxFenceDelimiterEditOptions = {},
) {
  const edits: vscode.TextEdit[] = []
  let activeFence: MdxFence | undefined
  let frontmatterHandled = false
  let inFrontmatter = false

  for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
    const line = document.lineAt(lineIndex)
    const lineText = line.text
    const trimmed = lineText.trim()

    if (!frontmatterHandled && lineIndex === 0 && trimmed === '---') {
      frontmatterHandled = true
      inFrontmatter = true
      continue
    }

    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false
      continue
    }

    if (isLineInsideAnyRange(lineIndex, excludedRanges)) {
      continue
    }

    if (
      options.onlyWithinRange &&
      !line.range.intersection(options.onlyWithinRange)
    ) {
      continue
    }

    if (!activeFence) {
      const splitLine = splitLineBeforeInlineMdxFenceOpener(lineText)
      if (splitLine) {
        const replacement = [
          ...splitAdjacentMarkupTags(splitLine.before),
          splitLine.fenceLine,
        ].join('\n')
        pushLineReplacement(edits, line.range, lineText, replacement)

        const delimiter = parseMdxFenceDelimiter(splitLine.fenceLine.trim())
        activeFence = delimiter
          ? { length: delimiter.length, marker: delimiter.marker }
          : undefined
        continue
      }

      const delimiter = parseMdxFenceDelimiter(trimmed)
      if (!delimiter) continue

      pushLineReplacement(
        edits,
        line.range,
        lineText,
        trimLineStartIndent(lineText),
      )
      activeFence = { length: delimiter.length, marker: delimiter.marker }
      continue
    }

    const splitClosingPrefix = splitLineAfterInlineMdxFenceCloser(
      lineText,
      activeFence,
    )
    if (splitClosingPrefix) {
      const replacement = [
        trimLineStartIndent(splitClosingPrefix.fenceLine),
        splitClosingPrefix.after,
      ].join('\n')
      pushLineReplacement(edits, line.range, lineText, replacement)
      activeFence = undefined
      continue
    }

    const splitClosingSuffix = splitLineBeforeInlineMdxFenceCloser(
      lineText,
      activeFence,
    )
    if (splitClosingSuffix) {
      const replacement = [
        splitClosingSuffix.before,
        trimLineStartIndent(splitClosingSuffix.fenceLine),
      ].join('\n')
      pushLineReplacement(edits, line.range, lineText, replacement)
      activeFence = undefined
      continue
    }

    const delimiter = parseMdxFenceDelimiter(trimmed)
    if (!delimiter || !isMdxFenceClosingDelimiter(delimiter, activeFence)) {
      continue
    }

    pushLineReplacement(
      edits,
      line.range,
      lineText,
      trimLineStartIndent(lineText),
    )
    activeFence = undefined
  }

  return edits
}

export function maskMdxFencedRegions(source: string) {
  const fences: MdxFencePlaceholder[] = []
  const lines = splitInlineMdxFenceDelimiters(source).split('\n')
  const placeholderLines: string[] = []

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const openingDelimiter = parseMdxFenceDelimiter(lines[lineIndex].trim())
    if (!openingDelimiter) {
      placeholderLines.push(lines[lineIndex])
      continue
    }

    let closingLineIndex = -1
    for (
      let candidateLineIndex = lineIndex + 1;
      candidateLineIndex < lines.length;
      candidateLineIndex++
    ) {
      const closingDelimiter = parseMdxFenceDelimiter(
        lines[candidateLineIndex].trim(),
      )
      if (
        closingDelimiter &&
        isMdxFenceClosingDelimiter(closingDelimiter, openingDelimiter)
      ) {
        closingLineIndex = candidateLineIndex
        break
      }
    }

    if (closingLineIndex === -1) {
      placeholderLines.push(lines[lineIndex])
      continue
    }

    const placeholder = `<!--PURESTACK_MDX_FENCE_${fences.length}-->`
    fences.push({
      placeholder,
      source: normalizeMdxFenceDelimiterIndent(
        lines.slice(lineIndex, closingLineIndex + 1),
      ),
    })
    placeholderLines.push(placeholder)
    lineIndex = closingLineIndex
  }

  return { fences, placeholderContent: placeholderLines.join('\n') }
}

export function restoreMdxFencedRegions(
  formatted: string,
  fences: MdxFencePlaceholder[],
) {
  let restored = formatted

  for (const fence of fences) {
    const standalonePlaceholderPattern = new RegExp(
      `^[\\t ]*${escapeRegExp(fence.placeholder)}$`,
      'gm',
    )
    if (standalonePlaceholderPattern.test(restored)) {
      restored = restored.replace(standalonePlaceholderPattern, fence.source)
      continue
    }

    restored = restored.split(fence.placeholder).join(fence.source)
  }

  return restored
}

export function parseMdxFenceDelimiter(trimmed: string) {
  const match = /^(`{3,}|~{3,})(.*)$/.exec(trimmed)
  if (!match) return undefined

  return {
    length: match[1].length,
    marker: match[1][0] as '`' | '~',
    suffix: match[2],
  }
}

export function parseInlineMdxFenceOpener(trimmed: string) {
  const splitLine = splitLineBeforeInlineMdxFenceOpener(trimmed)
  if (!splitLine) return undefined

  return parseMdxFenceDelimiter(splitLine.fenceLine.trim())
}

export function parseInlineMdxFenceCloser(
  trimmed: string,
  activeFence: MdxFence,
) {
  const splitLine = splitLineAfterInlineMdxFenceCloser(trimmed, activeFence)
  if (splitLine) return parseMdxFenceDelimiter(splitLine.fenceLine.trim())

  const trailingSplitLine = splitLineBeforeInlineMdxFenceCloser(
    trimmed,
    activeFence,
  )
  if (!trailingSplitLine) return undefined

  return parseMdxFenceDelimiter(trailingSplitLine.fenceLine.trim())
}

export function isMdxFenceClosingDelimiter(
  delimiter: MdxFenceDelimiter,
  activeFence: MdxFence,
) {
  return (
    delimiter.marker === activeFence.marker &&
    delimiter.length >= activeFence.length &&
    delimiter.suffix.trim().length === 0
  )
}

function splitInlineMdxFenceDelimiters(source: string) {
  const lines = source.split('\n')
  const splitLines: string[] = []
  let activeFence: MdxFence | undefined

  for (const line of lines) {
    if (!activeFence) {
      const splitLine = splitLineBeforeInlineMdxFenceOpener(line)
      if (splitLine) {
        splitLines.push(
          ...splitAdjacentMarkupTags(splitLine.before),
          splitLine.fenceLine,
        )

        const delimiter = parseMdxFenceDelimiter(splitLine.fenceLine.trim())
        activeFence = delimiter
          ? { length: delimiter.length, marker: delimiter.marker }
          : undefined
        continue
      }

      splitLines.push(line)

      const delimiter = parseMdxFenceDelimiter(line.trim())
      if (!delimiter) continue
      activeFence = { length: delimiter.length, marker: delimiter.marker }
      continue
    }

    const splitClosingLine = splitLineAfterInlineMdxFenceCloser(
      line,
      activeFence,
    )
    if (splitClosingLine) {
      splitLines.push(splitClosingLine.fenceLine, splitClosingLine.after)
      activeFence = undefined
      continue
    }

    const splitTrailingClosingLine = splitLineBeforeInlineMdxFenceCloser(
      line,
      activeFence,
    )
    if (splitTrailingClosingLine) {
      splitLines.push(
        splitTrailingClosingLine.before,
        splitTrailingClosingLine.fenceLine,
      )
      activeFence = undefined
      continue
    }

    splitLines.push(line)

    const delimiter = parseMdxFenceDelimiter(line.trim())
    if (!delimiter) continue

    if (isMdxFenceClosingDelimiter(delimiter, activeFence)) {
      activeFence = undefined
    }
  }

  return splitLines.join('\n')
}

function splitLineBeforeInlineMdxFenceOpener(line: string) {
  if (parseMdxFenceDelimiter(line.trim())) return undefined

  const match = /^(.+?)[\t ]*((?:`{3,}|~{3,}).*)$/.exec(line)
  if (!match) return undefined

  const before = match[1].trimEnd()
  if (before.trim().length === 0) return undefined

  return {
    before,
    fenceLine: match[2],
  }
}

function splitAdjacentMarkupTags(line: string) {
  const tokens = scanTagTokens(line)
  if (tokens.length < 2) return [line]

  let cursor = 0
  const lines: string[] = []
  const indent = /^\s*/.exec(line)?.[0] ?? ''

  for (const token of tokens) {
    if (line.slice(cursor, token.start).trim().length > 0) return [line]

    const tag = line.slice(token.start, token.end)
    lines.push(lines.length === 0 ? `${indent}${tag}` : tag)
    cursor = token.end
  }

  if (line.slice(cursor).trim().length > 0) return [line]

  return lines
}

function splitLineBeforeInlineMdxFenceCloser(
  line: string,
  activeFence: MdxFence,
) {
  const pattern = new RegExp(
    `^(.*?)[\\t ]*(${escapeRegExp(activeFence.marker.repeat(activeFence.length))}${escapeRegExp(activeFence.marker)}*)[\\t ]*$`,
  )
  const match = pattern.exec(line)
  if (!match || match[1].trim().length === 0) return undefined

  const closingDelimiter = parseMdxFenceDelimiter(match[2].trim())
  if (!closingDelimiter) return undefined
  if (!isMdxFenceClosingDelimiter(closingDelimiter, activeFence)) {
    return undefined
  }

  return {
    before: match[1].trimEnd(),
    fenceLine: match[2],
  }
}

function splitLineAfterInlineMdxFenceCloser(
  line: string,
  activeFence: MdxFence,
) {
  const pattern = new RegExp(
    `^([\\t ]*${escapeRegExp(activeFence.marker.repeat(activeFence.length))}${escapeRegExp(activeFence.marker)}*)(.*)$`,
  )
  const match = pattern.exec(line)
  if (!match || match[2].trim().length === 0) return undefined

  const closingDelimiter = parseMdxFenceDelimiter(match[1].trim())
  if (!closingDelimiter) return undefined
  if (!isMdxFenceClosingDelimiter(closingDelimiter, activeFence)) {
    return undefined
  }

  return {
    fenceLine: match[1],
    after: match[2],
  }
}

function normalizeMdxFenceDelimiterIndent(lines: string[]) {
  if (lines.length < 2) return lines.join('\n')

  const normalizedLines = [...lines]
  normalizedLines[0] = trimLineStartIndent(normalizedLines[0])
  normalizedLines[normalizedLines.length - 1] = trimLineStartIndent(
    normalizedLines[normalizedLines.length - 1],
  )
  return normalizedLines.join('\n')
}

function trimLineStartIndent(line: string) {
  return line.replace(/^[\t ]+/, '')
}

function pushLineReplacement(
  edits: vscode.TextEdit[],
  range: vscode.Range,
  oldText: string,
  newText: string,
) {
  if (newText === oldText) return

  edits.push(vscode.TextEdit.replace(range, newText))
}

function isLineInsideAnyRange(lineIndex: number, ranges: vscode.Range[]) {
  return ranges.some(
    (range) => lineIndex >= range.start.line && lineIndex <= range.end.line,
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

import fs from 'node:fs/promises'
import path from 'node:path'
import type { Loader, Plugin } from 'esbuild'

type RegorTemplateBindings = {
  tags: Set<string>
  namespaces: Set<string>
}

type Range = {
  start: number
  end: number
}

const codeFileFilter = /\.[cm]?[jt]s$/
const regorTemplateTagNames = new Set(['html', 'svg'])

export function regorTemplateTagsPlugin(): Plugin {
  return {
    name: 'regor-template-tags',
    setup(build) {
      build.onLoad({ filter: codeFileFilter }, async (args) => {
        const contents = await fs.readFile(args.path, 'utf8')
        return {
          contents: stripRegorTemplateTags(contents),
          loader: getLoader(args.path),
          resolveDir: path.dirname(args.path),
        }
      })
    },
  }
}

export function stripRegorTemplateTags(source: string) {
  const { bindings, bodyStart } = findRegorTemplateBindings(source)
  removeShadowedBindings(source, bodyStart, bindings)
  if (bindings.tags.size === 0 && bindings.namespaces.size === 0) {
    return source
  }
  if (!source.includes('`', bodyStart)) return source

  const ranges = collectRegorTemplateTagRanges(source, bindings, bodyStart)
  if (ranges.length === 0) return source

  return replaceRangesWithSpaces(source, ranges)
}

function findRegorTemplateBindings(source: string) {
  const bindings: RegorTemplateBindings = {
    tags: new Set(),
    namespaces: new Set(),
  }

  let index = 0
  while (index < source.length) {
    const nextIndex = skipWhitespaceCommentsAndDirectives(source, index)
    if (nextIndex !== index) {
      index = nextIndex
      continue
    }

    if (!isKeywordAt(source, index, 'import')) break

    const parsed = parseImportDeclaration(source, index)
    index = parsed.nextIndex
    if (parsed.moduleName !== 'regor' || parsed.typeOnly) continue

    for (const tag of parseNamedRegorTemplateImports(parsed.importClause)) {
      bindings.tags.add(tag)
    }
    const namespace = parseNamespaceImport(parsed.importClause)
    if (namespace) bindings.namespaces.add(namespace)
  }

  return { bindings, bodyStart: index }
}

function parseImportDeclaration(source: string, start: number) {
  let index = skipWhitespaceAndComments(source, start + 'import'.length)
  if (source[index] === '(' || source[index] === '.') {
    return {
      nextIndex: index + 1,
      importClause: '',
      moduleName: undefined,
      typeOnly: false,
    }
  }

  const sideEffectImport = readQuotedLiteral(source, index)
  if (sideEffectImport) {
    return {
      nextIndex: resolveImportEnd(source, sideEffectImport.end),
      importClause: '',
      moduleName: sideEffectImport.value,
      typeOnly: false,
    }
  }

  const firstToken = readIdentifier(source, index)
  const typeOnly = firstToken.value === 'type'
  if (typeOnly) index = skipWhitespaceAndComments(source, firstToken.end)

  const clauseStart = index
  while (index < source.length) {
    const nextIndex = skipNonCode(source, index)
    if (nextIndex !== index) {
      index = nextIndex
      continue
    }

    if (source[index] === ';') {
      return {
        nextIndex: index + 1,
        importClause: source.slice(clauseStart, index),
        moduleName: undefined,
        typeOnly,
      }
    }

    if (isKeywordAt(source, index, 'from')) {
      const specifierStart = skipWhitespaceAndComments(
        source,
        index + 'from'.length,
      )
      const quoted = readQuotedLiteral(source, specifierStart)
      if (!quoted) {
        index += 'from'.length
        continue
      }

      return {
        nextIndex: resolveImportEnd(source, quoted.end),
        importClause: source.slice(clauseStart, index),
        moduleName: quoted.value,
        typeOnly,
      }
    }

    index += 1
  }

  return {
    nextIndex: index,
    importClause: source.slice(clauseStart),
    moduleName: undefined,
    typeOnly,
  }
}

function resolveImportEnd(source: string, end: number) {
  const nextIndex = skipWhitespaceAndComments(source, end)
  return source[nextIndex] === ';' ? nextIndex + 1 : nextIndex
}

function parseNamedRegorTemplateImports(importClause: string) {
  const namedStart = importClause.indexOf('{')
  const namedEnd = importClause.lastIndexOf('}')
  if (namedStart < 0 || namedEnd <= namedStart) return []

  const names: string[] = []
  const namedClause = importClause.slice(namedStart + 1, namedEnd)
  for (const rawPart of namedClause.split(',')) {
    const part = rawPart.trim()
    if (!part || part.startsWith('type ')) continue

    const [importedName, localName] = part.split(/\s+as\s+/)
    const imported = importedName.trim()
    if (!regorTemplateTagNames.has(imported)) continue

    names.push((localName ?? imported).trim())
  }
  return names.filter(isIdentifierName)
}

function parseNamespaceImport(importClause: string) {
  const match = /\*\s+as\s+([A-Za-z_$][\w$]*)/.exec(importClause)
  return match?.[1]
}

function removeShadowedBindings(
  source: string,
  bodyStart: number,
  bindings: RegorTemplateBindings,
) {
  const body = source.slice(bodyStart)
  for (const tag of [...bindings.tags]) {
    if (hasLocalBinding(body, tag)) bindings.tags.delete(tag)
  }
  for (const namespace of [...bindings.namespaces]) {
    if (hasLocalBinding(body, namespace)) bindings.namespaces.delete(namespace)
  }
}

function hasLocalBinding(source: string, name: string) {
  const escapedName = escapeRegExp(name)
  return new RegExp(
    [
      String.raw`\b(?:const|let|var|function|class)\s+${escapedName}\b`,
      String.raw`\bfunction\b[^(]*\([^)]*\b${escapedName}\b`,
      String.raw`\([^)]*\b${escapedName}\b[^)]*\)\s*=>`,
      String.raw`\b${escapedName}\b\s*=>`,
    ].join('|'),
  ).test(source)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function collectRegorTemplateTagRanges(
  source: string,
  bindings: RegorTemplateBindings,
  start: number,
) {
  const ranges: Range[] = []
  let index = start

  while (index < source.length) {
    const nextIndex = skipNonCode(source, index)
    if (nextIndex !== index) {
      index = nextIndex
      continue
    }

    if (!isIdentifierStart(source[index])) {
      index += 1
      continue
    }

    const identifier = readIdentifier(source, index)
    const directTemplateStart = skipWhitespaceAndComments(
      source,
      identifier.end,
    )
    if (
      bindings.tags.has(identifier.value) &&
      source[directTemplateStart] === '`'
    ) {
      const template = scanTemplate(source, directTemplateStart)
      if (!template.hasInterpolation) {
        ranges.push({ start: identifier.start, end: identifier.end })
      }
      index = template.end
      continue
    }

    if (bindings.namespaces.has(identifier.value)) {
      const member = readRegorNamespaceMember(source, identifier.end)
      if (member) {
        const templateStart = skipWhitespaceAndComments(source, member.end)
        if (source[templateStart] === '`') {
          const template = scanTemplate(source, templateStart)
          if (!template.hasInterpolation) {
            ranges.push({ start: identifier.start, end: member.end })
          }
          index = template.end
          continue
        }
      }
    }

    index = identifier.end
  }

  return ranges
}

function readRegorNamespaceMember(source: string, start: number) {
  if (source[start] !== '.') return undefined

  const property = readIdentifier(source, start + 1)
  if (!regorTemplateTagNames.has(property.value)) return undefined

  return property
}

function replaceRangesWithSpaces(source: string, ranges: Range[]) {
  let output = ''
  let cursor = 0
  for (const range of ranges) {
    output += source.slice(cursor, range.start)
    output += ' '.repeat(range.end - range.start)
    cursor = range.end
  }
  return output + source.slice(cursor)
}

function skipNonCode(source: string, index: number) {
  const char = source[index]
  const next = source[index + 1]

  if (char === '/' && next === '/') return skipLineComment(source, index + 2)
  if (char === '/' && next === '*') return skipBlockComment(source, index + 2)
  if (char === "'" || char === '"') return skipQuotedString(source, index)
  if (char === '`') return scanTemplate(source, index).end

  return index
}

function skipWhitespaceAndComments(source: string, start: number) {
  let index = start
  while (index < source.length) {
    if (/\s/.test(source[index])) {
      index += 1
      continue
    }

    if (source[index] === '/' && source[index + 1] === '/') {
      index = skipLineComment(source, index + 2)
      continue
    }

    if (source[index] === '/' && source[index + 1] === '*') {
      index = skipBlockComment(source, index + 2)
      continue
    }

    break
  }
  return index
}

function skipWhitespaceCommentsAndDirectives(source: string, start: number) {
  let index = skipWhitespaceAndComments(source, start)

  while (source[index] === "'" || source[index] === '"') {
    const quoted = readQuotedLiteral(source, index)
    if (!quoted) return index

    const afterQuote = skipWhitespaceAndComments(source, quoted.end)
    const hasSemicolon = source[afterQuote] === ';'
    const hasLineBreak = source.slice(quoted.end, afterQuote).includes('\n')
    if (!hasSemicolon && !hasLineBreak) return index

    index = skipWhitespaceAndComments(
      source,
      hasSemicolon ? afterQuote + 1 : afterQuote,
    )
  }

  return index
}

function skipLineComment(source: string, start: number) {
  const newlineIndex = source.indexOf('\n', start)
  return newlineIndex === -1 ? source.length : newlineIndex + 1
}

function skipBlockComment(source: string, start: number) {
  const endIndex = source.indexOf('*/', start)
  return endIndex === -1 ? source.length : endIndex + 2
}

function skipQuotedString(source: string, start: number) {
  const quote = source[start]
  let index = start + 1
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2
      continue
    }
    if (source[index] === quote) return index + 1
    index += 1
  }
  return source.length
}

function scanTemplate(source: string, start: number) {
  let index = start + 1
  let hasInterpolation = false

  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2
      continue
    }
    if (source[index] === '`') {
      return { end: index + 1, hasInterpolation }
    }
    if (source[index] === '$' && source[index + 1] === '{') {
      hasInterpolation = true
    }
    index += 1
  }

  return { end: source.length, hasInterpolation }
}

function readQuotedLiteral(source: string, start: number) {
  const quote = source[start]
  if (quote !== "'" && quote !== '"') return undefined

  let index = start + 1
  let value = ''
  while (index < source.length) {
    if (source[index] === '\\') {
      value += source.slice(index, index + 2)
      index += 2
      continue
    }
    if (source[index] === quote) {
      return { value, end: index + 1 }
    }
    value += source[index]
    index += 1
  }

  return undefined
}

function readIdentifier(source: string, start: number) {
  let end = start
  if (!isIdentifierStart(source[end])) return { start, end, value: '' }

  end += 1
  while (end < source.length && isIdentifierPart(source[end])) end += 1

  return {
    start,
    end,
    value: source.slice(start, end),
  }
}

function isKeywordAt(source: string, start: number, keyword: string) {
  if (!source.startsWith(keyword, start)) return false

  const before = source[start - 1]
  const after = source[start + keyword.length]
  return !isIdentifierPart(before) && !isIdentifierPart(after)
}

function isIdentifierName(value: string) {
  if (!value || !isIdentifierStart(value[0])) return false
  return [...value.slice(1)].every(isIdentifierPart)
}

function isIdentifierStart(char: string | undefined) {
  return !!char && /[A-Za-z_$]/.test(char)
}

function isIdentifierPart(char: string | undefined) {
  return !!char && /[\w$]/.test(char)
}

function getLoader(filePath: string): Loader {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.ts' || ext === '.mts' || ext === '.cts') return 'ts'
  return 'js'
}

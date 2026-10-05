import fs from 'node:fs/promises'
import path from 'node:path'
import { parseFragment } from '@purestack/ts-minidom'
import { toPosixPath } from '@purestack/ts-util'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { isSharedContentFile } from '../discover/content'
import { isContentExt } from '../discover/contentExtensions'
import { findMarkupTags } from './regorMarkup'

const IMPORT_TAGS = {
  'import-codeblock': {
    label: 'Code block import',
    attributes: ['src', 'lang'],
    attributesText: 'plain src and lang attributes',
    example: './example.ts',
  },
  'import-content': {
    label: 'Content import',
    attributes: ['src'],
    attributesText: 'a plain src attribute',
    example: './_shared.mdx',
  },
} as const

type ImportTagName = keyof typeof IMPORT_TAGS

const IMPORT_TAG_NAMES = Object.keys(IMPORT_TAGS) as ImportTagName[]

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  '.cjs': 'javascript',
  '.css': 'css',
  '.cts': 'typescript',
  '.html': 'html',
  '.js': 'javascript',
  '.json': 'json',
  '.jsx': 'jsx',
  '.md': 'markdown',
  '.mdx': 'mdx',
  '.mjs': 'javascript',
  '.mts': 'typescript',
  '.rmdx': 'mdx',
  '.sh': 'bash',
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.yaml': 'yaml',
  '.yml': 'yaml',
}

const parser = unified().use(remarkParse).use(remarkGfm)

export interface ImportOptions {
  contentDir: string
  /** The page's path in the content folder; its tags resolve from it. */
  sourceRelPath: string
  /** Receives each imported file's content path, before the file is read. */
  onImport?: (relPath: string) => void
}

/**
 * Expands the import tags in a page's source, as if the page held what they
 * name: `<import-codeblock>` becomes a code block holding a file, and
 * `<import-content>` becomes the Markdown of a shared file, whose own tags
 * expand in turn. Tags inside code stay as written.
 */
export function expandImports(
  source: string,
  options: ImportOptions,
): Promise<string> {
  const page = toPosixPath(options.sourceRelPath)
  return expandSource(source, page, options, [page])
}

async function expandSource(
  source: string,
  sourceRelPath: string,
  options: ImportOptions,
  chain: readonly string[],
): Promise<string> {
  if (!IMPORT_TAG_NAMES.some((name) => source.includes(`<${name}`))) {
    return source
  }
  const tags = findMarkupTags(
    source,
    (text) => parser.parse(text),
    IMPORT_TAG_NAMES,
  )
  let expanded = ''
  let lastIndex = 0
  for (const tag of tags) {
    expanded += source.slice(lastIndex, tag.start)
    expanded += await expandTag(
      tag.name as ImportTagName,
      source.slice(tag.start, tag.end),
      tag.selfClosing,
      sourceRelPath,
      options,
      chain,
    )
    lastIndex = tag.end
  }
  return expanded + source.slice(lastIndex)
}

async function expandTag(
  name: ImportTagName,
  markup: string,
  selfClosing: boolean,
  sourceRelPath: string,
  options: ImportOptions,
  chain: readonly string[],
) {
  const { label, attributes, attributesText, example } = IMPORT_TAGS[name]
  const failure = (problem: string, src?: string) =>
    new Error(
      `${label}${src ? ` "${src}"` : ''} in "${sourceRelPath}" ${problem}`,
    )
  if (!selfClosing) {
    throw failure(`must be self-closing: <${name} src="${example}"/>.`)
  }
  const element = parseFragment(markup).firstElementChild
  for (const attribute of element?.getAttributeNames() ?? []) {
    if (!(attributes as readonly string[]).includes(attribute)) {
      throw failure(
        `has an unknown attribute "${attribute}". It takes ${attributesText}.`,
      )
    }
  }
  const src = element?.getAttribute('src')?.trim()
  if (!src) {
    throw failure(`needs a src, such as <${name} src="${example}"/>.`)
  }
  const relPath = resolveImportPath(src, sourceRelPath)
  if (!relPath) {
    throw failure(
      'needs a relative path that stays inside the content folder.',
      src,
    )
  }

  if (name === 'import-content') {
    if (!isContentExt(path.posix.extname(relPath))) {
      throw failure('needs a Markdown or MDX file: .md, .mdx, or .rmdx.', src)
    }
    if (!isSharedContentFile(relPath)) {
      throw failure(
        'needs shared content: a file whose name, or a folder above it, starts with _, such as ./_shared.mdx.',
        src,
      )
    }
    if (chain.includes(relPath)) {
      throw failure(`imports itself: ${[...chain, relPath].join(' → ')}.`, src)
    }
  }

  options.onImport?.(relPath)
  const text = await readImportedFile(options.contentDir, relPath, () =>
    failure('does not match any file.', src),
  )
  if (name === 'import-codeblock') {
    const lang =
      element?.getAttribute('lang')?.trim() ||
      LANGUAGE_BY_EXTENSION[path.posix.extname(relPath).toLowerCase()] ||
      ''
    return toCodeFence(text, lang)
  }
  const markdown = text.replaceAll('\r\n', '\n').trim()
  if (startsWithFrontmatter(markdown)) {
    throw failure(
      'names a file with frontmatter; shared content uses the frontmatter of the page that shows it.',
      src,
    )
  }
  const content = await expandSource(markdown, relPath, options, [
    ...chain,
    relPath,
  ])
  // Blank lines keep the content in blocks of its own.
  return `\n\n${content}\n\n`
}

/**
 * Frontmatter is a block between two `---` lines at the very start. A passage
 * that only opens with a `---` rule has no closing line, so it is Markdown.
 */
function startsWithFrontmatter(markdown: string) {
  const [first, ...rest] = markdown.split('\n')
  return (
    first.trimEnd() === '---' && rest.some((line) => line.trimEnd() === '---')
  )
}

/** The content path `src` names, or undefined when it leaves the folder. */
function resolveImportPath(src: string, sourceRelPath: string) {
  const posixSrc = toPosixPath(src)
  if (
    posixSrc.startsWith('/') ||
    path.win32.isAbsolute(src) ||
    posixSrc.includes('://')
  ) {
    return undefined
  }
  const relPath = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourceRelPath), posixSrc),
  )
  if (relPath === '..' || relPath.startsWith('../')) return undefined
  return relPath
}

/**
 * Reads the file only when each part of its path matches in case too, so a
 * page that builds on a case-insensitive disk builds on every disk.
 */
async function readImportedFile(
  contentDir: string,
  relPath: string,
  missing: () => Error,
) {
  try {
    let filePath = contentDir
    for (const name of relPath.split('/')) {
      if (!(await fs.readdir(filePath)).includes(name)) throw missing()
      filePath = path.join(filePath, name)
    }
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EISDIR') {
      throw missing()
    }
    throw error
  }
}

/**
 * A fenced code block on lines of its own, even when the tag is indented or
 * inline, with a fence longer than any backtick run in the code.
 */
function toCodeFence(code: string, lang: string) {
  const text = code.replaceAll('\r\n', '\n').trimEnd()
  let longestRun = 0
  let run = 0
  for (const char of text) {
    run = char === '`' ? run + 1 : 0
    longestRun = Math.max(longestRun, run)
  }
  const fence = '`'.repeat(Math.max(3, longestRun + 1))
  return `\n${fence}${lang}\n${text}\n${fence}\n`
}

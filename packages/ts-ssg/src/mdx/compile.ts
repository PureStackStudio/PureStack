import type { MdxCodeHighlighter } from '@purestack/ts-common'
import { toPosixPath } from '@purestack/ts-util'
import type { Element, Root, Text } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { type PluggableList, unified } from 'unified'
import { applyCodeHighlighting } from './codeHighlighting'

export interface MdxCompileResult {
  bodyHtml: string
  /** The first h1-h3 text, the title of a page whose frontmatter has none. */
  headingTitle?: string
}

export interface MdxRenderOptions {
  highlighter?: MdxCodeHighlighter
  sourceRelPath?: string
  compileMdAsMdx?: boolean
  /** Turns the Markdown tree into HTML, with any content plugins. */
  contentProcessor?: ContentProcessor
}

export type ContentProcessor = ReturnType<typeof createContentProcessor>

const DEFAULT_CONTENT_PROCESSOR = createContentProcessor()

/**
 * One processor per build: remark plugins on the Markdown tree, then the
 * HTML tree, then rehype plugins. A single run shares one file, so remark
 * plugins can pass data to rehype plugins through it.
 */
export function createContentProcessor(
  remarkPlugins: PluggableList = [],
  rehypePlugins: PluggableList = [],
  rehypePostPlugins: PluggableList = [],
) {
  return unified()
    .use(remarkPlugins)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePlugins)
    .use(rehypePostPlugins)
    .freeze()
}

export async function compileAstToHtml(
  file: MdastRoot,
  options: MdxRenderOptions,
): Promise<MdxCompileResult> {
  const processor = options.contentProcessor ?? DEFAULT_CONTENT_PROCESSOR
  // Plugins see the same content path on every platform.
  const tree: unknown = await processor.run(file, {
    path: options.sourceRelPath && toPosixPath(options.sourceRelPath),
  })
  if (!isHastRoot(tree)) {
    throw new Error('Content compilation did not produce a HAST root node.')
  }
  const headingTitle = findHeadingTitle(tree)
  if (options.highlighter) {
    await applyCodeHighlighting(tree, options.highlighter)
  }
  keepCodeLiteral(tree)
  const bodyHtml = String(
    unified()
      .use(rehypeStringify, { allowDangerousHtml: true })
      .stringify(tree),
  )
  return { bodyHtml, headingTitle }
}

/**
 * Code shows source, so Regor must not evaluate it when the page renders.
 * Without `r-pre`, `{{ item }}` in a code sample would be replaced by its
 * value, usually an empty string.
 */
function keepCodeLiteral(root: Root) {
  const visit = (node: Root | Element) => {
    for (const child of node.children ?? []) {
      if (child.type !== 'element') continue
      if (child.tagName === 'pre' || child.tagName === 'code') {
        child.properties = { ...child.properties, 'r-pre': '' }
        continue
      }
      visit(child)
    }
  }
  visit(root)
}

function isHastRoot(node: unknown): node is Root {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: unknown }).type === 'root'
  )
}

const HEADING_TAGS = new Set(['h1', 'h2', 'h3'])

function findHeadingTitle(node: Root | Element): string | undefined {
  for (const child of node.children) {
    if (child.type !== 'element') continue
    const title = HEADING_TAGS.has(child.tagName)
      ? extractText(child).trim()
      : ''
    const found = title || findHeadingTitle(child)
    if (found) return found
  }
  return undefined
}

function extractText(node: Element | Text): string {
  if (node.type === 'text') return node.value
  let text = ''
  for (const child of node.children ?? []) {
    if (child.type === 'text') {
      text += child.value
      continue
    }
    if (child.type === 'element') {
      text += extractText(child)
    }
  }
  return text
}

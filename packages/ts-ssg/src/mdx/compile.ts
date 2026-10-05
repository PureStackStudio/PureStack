import type { PageOutlineItem } from '@purestack/ts-common'
import { toPosixPath } from '@purestack/ts-util'
import type { Element, Root, Text } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { type PluggableList, unified } from 'unified'
import type { MdxCodeHighlighter } from './highlight'
import { applyShikiHighlighting } from './shikiHighlighting'

export interface MdxCompileResult {
  bodyHtml: string
  outline: PageOutlineItem[]
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
) {
  return unified()
    .use(remarkPlugins)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePlugins)
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
  wrapTablesInScrollContainers(tree)
  const outline = collectOutline(tree)
  if (options.highlighter) {
    applyShikiHighlighting(tree, options.highlighter)
  }
  keepCodeLiteral(tree)
  const bodyHtml = String(
    unified()
      .use(rehypeStringify, { allowDangerousHtml: true })
      .stringify(tree),
  )
  return { bodyHtml, outline }
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

function wrapTablesInScrollContainers(root: Root) {
  const visit = (node: Root | Element) => {
    const children = node.children ?? []
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.type !== 'element') continue
      if (child.tagName === 'table' && !isTableScrollContainer(node)) {
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [child],
        }
        children[i] = wrapper
        continue
      }
      visit(child)
    }
  }
  visit(root)
}

function isTableScrollContainer(node: Root | Element): node is Element {
  if (node.type !== 'element' || node.tagName !== 'div') return false
  const className = node.properties?.className
  if (typeof className === 'string') {
    return className.split(/\s+/).includes('table-scroll')
  }
  if (Array.isArray(className)) {
    return className.includes('table-scroll')
  }
  return false
}

const OUTLINE_HEADING_LEVELS = new Map([
  ['h1', 1],
  ['h2', 2],
  ['h3', 3],
])

type CollectedOutlineItem = PageOutlineItem & { depth: number }

function collectOutline(root: Root): PageOutlineItem[] {
  const outline: PageOutlineItem[] = []
  const slugCounts = new Map<string, number>()
  const ancestors: CollectedOutlineItem[] = []

  const visit = (node: Element | Text) => {
    if (node.type === 'element') {
      const tag = node.tagName.toLowerCase()
      const depth = OUTLINE_HEADING_LEVELS.get(tag)
      if (depth) {
        const title = extractText(node).trim()
        if (title) {
          const id = ensureHeadingId(node, title, slugCounts)
          if (id) {
            const item: CollectedOutlineItem = { id, title, depth }
            while (true) {
              const ancestor = ancestors.at(-1)
              if (!ancestor || ancestor.depth < depth) break
              ancestors.pop()
            }
            const parent = ancestors.at(-1)
            if (parent) {
              const children = parent.children ?? []
              children.push(item)
              parent.children = children
            } else {
              outline.push(item)
            }
            ancestors.push(item)
          }
        }
      }
      for (const child of node.children ?? []) {
        if (child.type === 'element' || child.type === 'text') {
          visit(child)
        }
      }
    }
  }

  for (const child of root.children ?? []) {
    if (child.type === 'element' || child.type === 'text') {
      visit(child)
    }
  }

  return outline
}

function ensureHeadingId(
  node: Element,
  title: string,
  slugCounts: Map<string, number>,
): string | undefined {
  const raw = node.properties?.id
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim()
  }
  const base = slugify(title)
  if (!base) return undefined
  const count = (slugCounts.get(base) ?? 0) + 1
  slugCounts.set(base, count)
  const id = count === 1 ? base : `${base}-${count}`
  if (!node.properties) node.properties = {}
  node.properties.id = id
  return id
}

function slugify(input: string) {
  const normalized = input
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return normalized || 'section'
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

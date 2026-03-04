import type { Element, Properties, Root, Text } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import type { Handler } from 'mdast-util-to-hast'
import { toHast } from 'mdast-util-to-hast'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'

import { componentRegistry } from '../regor/registry'
import type { MdxCodeHighlighter } from './highlight'
import { applyShikiHighlighting } from './shikiHighlighting'

export interface PageOutlineItem {
  id: string
  title: string
  depth: number
  children?: PageOutlineItem[]
}

export interface MdxCompileResult {
  bodyHtml: string
  outline: PageOutlineItem[]
}

export interface MdxRenderOptions {
  highlighter?: MdxCodeHighlighter
}

export function compileAstToHtml(
  file: MdastRoot,
  options: MdxRenderOptions,
  settings: { stripMdxArtifacts?: boolean } = {},
): MdxCompileResult {
  const tree = toHast(file, {
    allowDangerousHtml: true,
    handlers: {
      mdxJsxFlowElement: mdxJsxHandler,
      mdxJsxTextElement: mdxJsxHandler,
    },
    passThrough: [
      'mdxjsEsm',
      'mdxFlowExpression',
      'mdxTextExpression',
      'mdxJsxFlowElement',
      'mdxJsxTextElement',
    ],
  })
  if (!isHastRoot(tree)) {
    throw new Error('Content compilation did not produce a HAST root node.')
  }
  if (settings.stripMdxArtifacts) {
    stripMdxArtifacts(tree)
  }
  wrapTablesInScrollContainers(tree)
  const outline = collectOutline(tree)
  if (options.highlighter) {
    applyShikiHighlighting(tree, options.highlighter)
  }
  const bodyHtml = String(
    unified()
      .use(rehypeRaw)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .stringify(tree),
  )
  return { bodyHtml, outline }
}

const mdxJsxHandler: Handler = (state, node) => {
  const jsxNode = getMdxJsxNode(node)
  const props = extractMdxJsxProps(jsxNode)
  const children = normalizeMdxJsxChildren(jsxNode.name, state.all(node) ?? [])
  return buildMdxJsxElement(jsxNode.name, props, children)
}

type MdxJsxNode = {
  name?: string
  attributes?: Array<{ type: string; name: string; value: unknown }>
}

function getMdxJsxNode(node: unknown): MdxJsxNode {
  return node as MdxJsxNode
}

function extractMdxJsxProps(jsxNode: MdxJsxNode): Properties {
  const props: Properties = {}
  const attributes = jsxNode.attributes ?? []
  for (const attr of attributes) {
    if (attr.type !== 'mdxJsxAttribute') continue
    if (typeof attr.value === 'string') {
      props[attr.name] = attr.value
      continue
    }
    if (attr.value == null) props[attr.name] = ''
  }
  return props
}

function buildMdxJsxElement(
  name: string | undefined,
  props: Properties,
  children: Element['children'],
): Element {
  if (name && name.toLowerCase() === 'template') {
    return {
      type: 'element',
      tagName: 'template',
      properties: props,
      children: [],
      content: { type: 'root', children },
    } as Element
  }
  return {
    type: 'element',
    tagName: name ?? 'div',
    properties: props,
    children,
  }
}

const INLINE_TAGS = new Set([
  'a',
  'span',
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'small',
  'code',
  'kbd',
  'mark',
  'q',
  'sub',
  'sup',
  'time',
  'abbr',
  'cite',
  'data',
  'dfn',
  'samp',
  'var',
  'del',
  'ins',
  'label',
  'ruby',
  'rt',
  'rp',
  'bdi',
  'bdo',
  'wbr',
  'br',
])

function normalizeMdxJsxChildren(
  name: string | undefined,
  children: Element['children'],
) {
  if (!name) return children
  const normalized = name.toLowerCase()
  const shouldFlattenParagraphChildren =
    normalized === 'p' ||
    INLINE_TAGS.has(normalized) ||
    componentRegistry.hasComponentName(name)
  if (!shouldFlattenParagraphChildren) {
    return children
  }
  const next: Element['children'] = []
  for (const child of children) {
    if (child.type === 'element' && child.tagName === 'p') {
      next.push(...(child.children ?? []))
      continue
    }
    next.push(child)
  }
  return next
}

function isHastRoot(node: ReturnType<typeof toHast>): node is Root {
  return Boolean(node && node.type === 'root')
}

function stripMdxArtifacts(root: Root) {
  const visit = (node: Root | Element) => {
    if (!node.children) return
    node.children = node.children.filter((child) => {
      if (child.type === 'element') {
        visit(child)
      }
      if (child.type === 'mdxjsEsm') return false
      if (child.type === 'mdxFlowExpression') return false
      if (child.type === 'mdxTextExpression') return false
      return true
    })
  }
  visit(root)
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
  ['h2', 2],
  ['h3', 3],
])

function collectOutline(root: Root): PageOutlineItem[] {
  const outline: PageOutlineItem[] = []
  const slugCounts = new Map<string, number>()
  let currentParent: PageOutlineItem | undefined

  const visit = (node: Element | Text) => {
    if (node.type === 'element') {
      const tag = node.tagName.toLowerCase()
      const depth = OUTLINE_HEADING_LEVELS.get(tag)
      if (depth) {
        const title = extractText(node).trim()
        if (title) {
          const id = ensureHeadingId(node, title, slugCounts)
          if (id) {
            const item: PageOutlineItem = { id, title, depth }
            if (depth === 2) {
              outline.push(item)
              currentParent = item
            } else if (depth === 3 && currentParent) {
              const children = currentParent.children ?? []
              children.push(item)
              currentParent.children = children
            } else {
              outline.push(item)
            }
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

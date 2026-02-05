import type { Element, Properties, Root } from 'hast'
import type { Handler } from 'mdast-util-to-hast'
import { toHast } from 'mdast-util-to-hast'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export async function compileMdxToHtml(source: string): Promise<string> {
  const cleaned = stripMdxImports(source)
  const file = unified().use(remarkParse).use(remarkMdx).parse(cleaned)
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
  const html = String(
    unified()
      .use(rehypeRaw)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .stringify(tree as Root),
  )
  return html
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
  if (!INLINE_TAGS.has(name.toLowerCase())) return children
  const normalized: Element['children'] = []
  for (const child of children) {
    if (child.type === 'element' && child.tagName === 'p') {
      normalized.push(...(child.children ?? []))
      continue
    }
    normalized.push(child)
  }
  return normalized
}

function stripMdxImports(source: string) {
  const lines = source.split(/\r?\n/)
  const filtered = lines.filter(
    (line) =>
      !line.startsWith('import ') &&
      !line.startsWith('export ') &&
      !line.startsWith('import\t') &&
      !line.startsWith('export\t'),
  )
  return filtered.join('\n')
}

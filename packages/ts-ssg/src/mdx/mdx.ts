import type { Element, Properties } from 'hast'
import { toHtml } from 'hast-util-to-html'
import type { Handler } from 'mdast-util-to-hast'
import rehypeStringify from 'rehype-stringify'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export async function compileMdxToHtml(source: string): Promise<string> {
  const cleaned = stripMdxImports(source)
  const file = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkRehype, {
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
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(cleaned)
  const html = String(file)
  return html
}

export function processMdxComponent(htmlMarkup: string): string {
  return htmlMarkup
}

const mdxJsxHandler: Handler = (state, node, parent) => {
  const jsxNode = getMdxJsxNode(node)
  const props = extractMdxJsxProps(jsxNode)
  const children = state.all(node) ?? []
  const element = buildMdxJsxElement(jsxNode.name, props, children)
  if (!isRootLevelMdxFlowComponent(node, parent)) return element
  return buildProcessedRawNode(element)
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
  return {
    type: 'element',
    tagName: name ?? 'div',
    properties: props,
    children,
  }
}

function isRootLevelMdxFlowComponent(node: unknown, parent: unknown): boolean {
  if (!hasNodeType(node) || node.type !== 'mdxJsxFlowElement') return false
  if (!hasNodeType(parent) || parent.type !== 'root') return false
  return true
}

function hasNodeType(value: unknown): value is { type: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type?: unknown }).type === 'string'
  )
}

function buildProcessedRawNode(element: Element): ReturnType<Handler> {
  const htmlMarkup = toHtml(element, { allowDangerousHtml: true })
  const processed = processMdxComponent(htmlMarkup)
  return { type: 'raw', value: processed } as ReturnType<Handler>
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

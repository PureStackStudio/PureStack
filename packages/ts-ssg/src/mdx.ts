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
  return String(file)
}

const mdxJsxHandler: Handler = (h, node) => {
  const jsxNode = node as {
    name?: string
    attributes?: Array<{ type: string; name: string; value: unknown }>
  }
  const tagName = jsxNode.name ?? 'div'
  const props: Record<string, string> = {}
  const attributes = jsxNode.attributes ?? []
  for (const attr of attributes) {
    if (attr.type !== 'mdxJsxAttribute') {
      continue
    }
    if (typeof attr.value === 'string') {
      props[attr.name] = attr.value
      continue
    }
    if (attr.value == null) {
      props[attr.name] = ''
    }
  }
  const children = h.all(node)
  return h(node, tagName, props, children)
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

type GenericNode = {
  type?: unknown
  name?: unknown
  children?: unknown
  value?: unknown
}

type ParentNode = {
  children: unknown[]
}

type ParagraphNode = {
  type: 'paragraph'
  children: unknown[]
}

type TextNode = {
  type: 'text'
  value: string
}

type MdxJsxTextElementNode = {
  type: 'mdxJsxTextElement'
  name?: string
  attributes?: unknown
  children?: unknown[]
  data?: unknown
  position?: unknown
}

type MdxJsxFlowElementNode = {
  type: 'mdxJsxFlowElement'
  name?: string
  attributes?: unknown
  children?: unknown[]
  data?: unknown
  position?: unknown
}

export function normalizeMdxJsxParagraphs(root: unknown) {
  visit(root)
}

function visit(node: unknown) {
  if (!isObject(node)) return
  const children = getChildren(node)
  if (children.length === 0) return
  const normalized = normalizeChildList(children)
  ;(node as ParentNode).children = normalized
  for (const child of normalized) {
    visit(child)
  }
}

function normalizeChildList(children: unknown[]) {
  const next: unknown[] = []
  for (const child of children) {
    if (isParagraphNode(child)) {
      const parts = splitParagraphAroundJsx(child)
      if (parts) {
        next.push(...parts)
        continue
      }
    }
    next.push(child)
  }
  return next
}

function splitParagraphAroundJsx(node: ParagraphNode): unknown[] | null {
  const children = getChildren(node)
  if (!children.some(isMdxJsxTextElementNode)) return null
  for (const child of children) {
    if (isWhitespaceTextNode(child)) continue
    if (isMdxJsxTextElementNode(child)) continue
    return null
  }

  const parts: unknown[] = []
  for (const child of children) {
    if (isMdxJsxTextElementNode(child)) {
      parts.push(convertMdxJsxTextToFlow(child))
    }
  }

  return parts
}

function convertMdxJsxTextToFlow(
  node: MdxJsxTextElementNode,
): MdxJsxFlowElementNode {
  return {
    type: 'mdxJsxFlowElement',
    name: node.name,
    attributes: node.attributes,
    children: getChildren(node),
    data: node.data,
    position: node.position,
  }
}

function isObject(value: unknown): value is GenericNode {
  return typeof value === 'object' && value !== null
}

function getChildren(node: GenericNode): unknown[] {
  return Array.isArray(node.children) ? node.children : []
}

function isParagraphNode(node: unknown): node is ParagraphNode {
  return (
    isObject(node) && node.type === 'paragraph' && Array.isArray(node.children)
  )
}

function isMdxJsxTextElementNode(node: unknown): node is MdxJsxTextElementNode {
  return isObject(node) && node.type === 'mdxJsxTextElement'
}

function isWhitespaceTextNode(node: unknown): node is TextNode {
  return (
    isObject(node) &&
    node.type === 'text' &&
    typeof node.value === 'string' &&
    node.value.trim().length === 0
  )
}

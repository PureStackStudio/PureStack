type GenericNode = {
  type?: unknown
  name?: unknown
  children?: unknown
  value?: unknown
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

export function normalizeTemplateMdxTree(root: unknown) {
  visit(root, false)
}

function visit(node: unknown, inTemplateTree: boolean) {
  if (!isObject(node)) return
  const isTemplate = isTemplateNode(node)
  const nextInTemplateTree = inTemplateTree || isTemplate
  const children = getChildren(node)
  if (children.length === 0) return
  if (nextInTemplateTree) {
    node.children = normalizeTemplateChildren(children)
    for (const child of getChildren(node)) {
      visit(child, true)
    }
    return
  }
  for (const child of children) {
    visit(child, false)
  }
}

function normalizeTemplateChildren(children: unknown[]) {
  const next: unknown[] = []
  for (const child of children) {
    if (isParagraphNode(child)) {
      const unwrapped = unwrapTemplateParagraph(child)
      if (unwrapped) {
        next.push(...unwrapped)
        continue
      }
      next.push(child)
      continue
    }
    next.push(child)
  }
  return next
}

function unwrapTemplateParagraph(node: ParagraphNode): unknown[] | null {
  const paragraphChildren = getChildren(node)
  if (paragraphChildren.length === 0) return null
  for (const child of paragraphChildren) {
    if (isWhitespaceTextNode(child)) continue
    if (isMdxJsxTextElementNode(child)) continue
    return null
  }
  const flowChildren: unknown[] = []
  for (const child of paragraphChildren) {
    if (isWhitespaceTextNode(child)) continue
    if (isMdxJsxTextElementNode(child)) {
      const flow = convertMdxJsxTextToFlow(child)
      flowChildren.push(flow)
    }
  }
  return flowChildren
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

function isTemplateNode(node: GenericNode): node is GenericNode & {
  type: 'mdxJsxFlowElement'
  name: string
  children: unknown[]
} {
  return (
    node.type === 'mdxJsxFlowElement' &&
    typeof node.name === 'string' &&
    node.name.toLowerCase() === 'template' &&
    Array.isArray(node.children)
  )
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

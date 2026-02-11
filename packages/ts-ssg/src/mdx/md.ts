import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import {
  compileAstToHtml,
  type MdxCompileResult,
  type MdxRenderOptions,
} from './compile'

export function compileMarkdown(
  source: string,
  options: MdxRenderOptions = {},
): MdxCompileResult {
  const file = unified().use(remarkParse).use(remarkGfm).parse(source)
  sanitizeMarkdownHtmlNodes(file)
  return compileAstToHtml(file, options)
}

function sanitizeMarkdownHtmlNodes(root: unknown) {
  const visit = (node: unknown) => {
    if (!isObject(node)) return
    if (isHtmlNode(node)) {
      const value = node.value.trim()
      if (looksLikeTypeParamTag(value)) {
        convertHtmlNodeToText(node, value)
      }
      return
    }
    const children = getChildren(node)
    if (!children) return
    for (const child of children) {
      visit(child)
    }
  }
  visit(root)
}

function looksLikeTypeParamTag(value: string) {
  if (!value.startsWith('<') || !value.endsWith('>')) return false
  const tagMatch = value.match(/^<\/?([A-Za-z][A-Za-z0-9-]*)\b[^>]*>$/)
  if (!tagMatch) return false
  const tag = tagMatch[1]
  return /[A-Z]/.test(tag)
}

type MarkdownNode = {
  type?: unknown
  value?: unknown
  children?: unknown
}

type MutableMarkdownNode = {
  type?: string
  value?: string
  children?: unknown
}

function isObject(value: unknown): value is MarkdownNode {
  return typeof value === 'object' && value !== null
}

function isHtmlNode(
  node: MarkdownNode,
): node is MutableMarkdownNode & { type: 'html'; value: string } {
  return node.type === 'html' && typeof node.value === 'string'
}

function getChildren(node: MarkdownNode): unknown[] | null {
  return Array.isArray(node.children) ? node.children : null
}

function convertHtmlNodeToText(node: MutableMarkdownNode, value: string) {
  node.type = 'text'
  node.value = value
}

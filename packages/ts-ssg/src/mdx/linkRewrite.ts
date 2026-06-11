import type { Element, Root } from 'hast'
import type { MdxContentHrefResolver, MdxRenderOptions } from './compile'

type RawHtmlNode = {
  type: 'raw'
  value: string
}

type LinkRewriteNode = Root | Element | RawHtmlNode

type RequiredLinkOptions = MdxRenderOptions & {
  sourceRelPath: string
  resolveContentHref: MdxContentHrefResolver
}

export function rewriteLinks(root: Root, options: MdxRenderOptions) {
  if (!options.sourceRelPath || !options.resolveContentHref) return
  const linkOptions: RequiredLinkOptions = {
    ...options,
    sourceRelPath: options.sourceRelPath,
    resolveContentHref: options.resolveContentHref,
  }
  const visit = (node: LinkRewriteNode) => {
    if (isElementNode(node)) {
      rewriteElementHref(node, linkOptions)
    }
    if (isRawHtmlNode(node)) {
      rewriteRawHtmlHref(node, linkOptions)
      return
    }
    for (const child of getNodeChildren(node)) {
      if (isElementNode(child) || isRawHtmlNode(child)) visit(child)
    }
  }
  visit(root)
}

function rewriteElementHref(node: Element, options: RequiredLinkOptions) {
  if (node.tagName.toLowerCase() !== 'a') return
  const href = node.properties?.href
  if (typeof href !== 'string') return
  const rewritten = options.resolveContentHref(href, options.sourceRelPath)
  if (rewritten !== href) {
    if (!node.properties) node.properties = {}
    node.properties.href = rewritten
  }
}

function rewriteRawHtmlHref(node: RawHtmlNode, options: RequiredLinkOptions) {
  node.value = node.value.replace(
    /<a\b([^>]*?)\bhref=(["'])([^"']*)\2([^>]*)>/gi,
    (match, before: string, quote: string, href: string, after: string) => {
      const rewritten = options.resolveContentHref(href, options.sourceRelPath)
      if (rewritten === href) return match
      return `<a${before}href=${quote}${rewritten}${quote}${after}>`
    },
  )
}

function isElementNode(node: unknown): node is Element {
  return isObject(node) && node.type === 'element'
}

function isRawHtmlNode(node: unknown): node is RawHtmlNode {
  return isObject(node) && node.type === 'raw' && typeof node.value === 'string'
}

function getNodeChildren(node: LinkRewriteNode): unknown[] {
  if (!isObject(node)) return []
  const children = (node as Record<string, unknown>).children
  return Array.isArray(children) ? children : []
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

import type { SiteConfig } from '@purestack/ts-common'
import { escapeHtml, withBasePath } from '@purestack/ts-util'
import { type ContentRouteIndex, resolveContentHref } from './content-hrefs'

const CONTENT_SOURCE_TAG = 'purestack-content-source'
const CONTENT_SOURCE_TAG_NAME = CONTENT_SOURCE_TAG.toUpperCase()
const PUBLIC_URL_ATTRIBUTES = ['src', 'action', 'poster'] as const

export interface PageUrlOptions {
  sourceRelPath: string
  contentRoutes: ContentRouteIndex
  config: SiteConfig
}

/**
 * Marks HTML written in another content file, such as a shared header, so
 * the links inside it resolve from that file rather than from the page.
 */
export function markContentSource(html: string, sourceRelPath: string) {
  const file = escapeHtml(sourceRelPath.replaceAll('\\', '/'), true)
  return `<${CONTENT_SOURCE_TAG} file="${file}">${html}</${CONTENT_SOURCE_TAG}>`
}

/**
 * Finishes every URL in a rendered page. Each `href` resolves from the
 * content file that wrote it, and root-absolute URLs gain the base path.
 * Source markers are removed, so the page keeps the markup its files wrote.
 */
export function resolvePageUrls(document: Document, options: PageUrlOptions) {
  visitChildren(document, options.sourceRelPath, options)
}

function visitChildren(
  parent: ParentNode,
  sourceRelPath: string,
  options: PageUrlOptions,
) {
  for (const child of [...parent.childNodes]) {
    if (!isElement(child)) continue
    if (child.tagName === CONTENT_SOURCE_TAG_NAME) {
      visitChildren(child, child.getAttribute('file') ?? sourceRelPath, options)
      child.replaceWith(...child.childNodes)
      continue
    }
    resolveElementUrls(child, sourceRelPath, options)
    visitChildren(
      isTemplate(child) ? child.content : child,
      sourceRelPath,
      options,
    )
  }
}

function resolveElementUrls(
  element: Element,
  sourceRelPath: string,
  options: PageUrlOptions,
) {
  const { basePath } = options.config
  const href = element.getAttribute('href')
  if (href !== null) {
    const resolved = resolveContentHref(
      href,
      sourceRelPath,
      options.contentRoutes,
      options.config,
    )
    updateAttribute(element, 'href', href, withBasePath(basePath, resolved))
  }
  if (!basePath) return
  for (const name of PUBLIC_URL_ATTRIBUTES) {
    const value = element.getAttribute(name)
    if (value !== null) {
      updateAttribute(element, name, value, withBasePath(basePath, value))
    }
  }
  const srcset = element.getAttribute('srcset')
  if (srcset !== null) {
    updateAttribute(
      element,
      'srcset',
      srcset,
      withSrcsetBasePath(basePath, srcset),
    )
  }
}

function withSrcsetBasePath(basePath: string, srcset: string) {
  return srcset
    .split(',')
    .map((candidate) => {
      const url = candidate.trim().split(/\s+/)[0]
      return url
        ? candidate.replace(url, withBasePath(basePath, url))
        : candidate
    })
    .join(',')
}

function updateAttribute(
  element: Element,
  name: string,
  value: string,
  next: string,
) {
  if (next !== value) element.setAttribute(name, next)
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1
}

function isTemplate(element: Element): element is HTMLTemplateElement {
  return element.tagName === 'TEMPLATE'
}

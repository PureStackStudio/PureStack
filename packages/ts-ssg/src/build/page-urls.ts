import type { SiteConfig } from '@purestack/ts-common'
import { escapeHtml, withBasePath } from '@purestack/ts-util'
import { type ContentRouteIndex, resolveContentUrl } from './content-urls'

const CONTENT_SOURCE_TAG = 'purestack-content-source'
const CONTENT_SOURCE_TAG_NAME = CONTENT_SOURCE_TAG.toUpperCase()
const CONTENT_URL_ATTRIBUTES = ['href', 'src', 'poster'] as const

export interface PageUrlOptions {
  sourceRelPath: string
  contentRoutes: ContentRouteIndex
  config: SiteConfig
}

/**
 * Marks HTML written in another content file, such as a shared header, so
 * the URLs inside it resolve from that file rather than from the page.
 */
export function markContentSource(html: string, sourceRelPath: string) {
  const file = escapeHtml(sourceRelPath.replaceAll('\\', '/'), true)
  return `<${CONTENT_SOURCE_TAG} file="${file}">${html}</${CONTENT_SOURCE_TAG}>`
}

/**
 * Finishes every URL in a rendered page. Links, sources and posters resolve
 * from the content file that wrote them, and root-absolute URLs gain the
 * base path. Source markers are removed, so the page keeps its markup.
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
  const finishUrl = (url: string) =>
    withBasePath(
      basePath,
      resolveContentUrl(
        url,
        sourceRelPath,
        options.contentRoutes,
        options.config,
      ),
    )
  for (const name of CONTENT_URL_ATTRIBUTES) {
    updateAttribute(element, name, finishUrl)
  }
  updateAttribute(element, 'srcset', (srcset) =>
    mapSrcsetUrls(srcset, finishUrl),
  )
  // A form posts to an endpoint, which is not a content file.
  updateAttribute(element, 'action', (action) => withBasePath(basePath, action))
}

/**
 * Maps each image candidate URL in a `srcset`. Like the HTML parser, a URL
 * runs to the next whitespace, so commas inside `data:` URLs stay intact.
 */
function mapSrcsetUrls(srcset: string, mapUrl: (url: string) => string) {
  let output = ''
  let index = 0
  while (index < srcset.length) {
    const separatorStart = index
    while (index < srcset.length && /[\s,]/.test(srcset[index])) index++
    output += srcset.slice(separatorStart, index)
    if (index >= srcset.length) break

    const urlStart = index
    while (index < srcset.length && !/\s/.test(srcset[index])) index++
    const token = srcset.slice(urlStart, index)
    const url = token.replace(/,+$/, '')
    output += mapUrl(url) + token.slice(url.length)
    if (url !== token) continue

    const descriptorStart = index
    let depth = 0
    while (index < srcset.length) {
      const current = srcset[index]
      if (current === ',' && depth === 0) break
      if (current === '(') depth++
      if (current === ')') depth = Math.max(0, depth - 1)
      index++
    }
    output += srcset.slice(descriptorStart, index)
  }
  return output
}

function updateAttribute(
  element: Element,
  name: string,
  finish: (value: string) => string,
) {
  const value = element.getAttribute(name)
  if (value === null) return
  const next = finish(value)
  if (next !== value) element.setAttribute(name, next)
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1
}

function isTemplate(element: Element): element is HTMLTemplateElement {
  return element.tagName === 'TEMPLATE'
}

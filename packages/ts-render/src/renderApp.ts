import type { PageContext } from '@purestack/ts-common'
import { runInDom } from '@purestack/ts-minidom'
import { buildModalScript, buildTabsScript } from '@purestack/ts-page-scripts'
import { isPlainObject } from '@purestack/ts-util'
import { createApp } from 'regor'
import { componentRegistry } from './componentRegistry'

export interface RenderAppOptions<TContext extends PageContext> {
  /** Components for this render, on top of the registered ones. */
  components: unknown
  /** Whether this render also inherits the shared component registry. */
  inheritComponents?: boolean
  context: TContext
  /**
   * Runs on the rendered document, before it becomes HTML. It may be async:
   * the document stays this render's own until it finishes.
   */
  onRendered?: (document: Document) => void | Promise<void>
}

/**
 * Renders Regor markup to HTML in a document of its own, so renders can
 * overlap, and `onRendered` can await, without seeing each other's pages.
 */
export const renderApp = <TContext extends PageContext>(
  html: string,
  options: RenderAppOptions<TContext>,
): Promise<string> => {
  const normalizedHtml = html.trimStart()
  const isDocument =
    normalizedHtml.startsWith('<!DOCTYPE html>') ||
    normalizedHtml.startsWith('<!doctype html>') ||
    normalizedHtml.startsWith('<html')
  const htmlToParse = isDocument
    ? normalizedHtml
    : `<!DOCTYPE html><html><body>${html}</body></html>`
  return runInDom(htmlToParse, async (document) => {
    const runtimeEmbeds = new Map<string, 'body' | 'head'>()
    const baseContext = options.context
    const pageContext = {
      ...baseContext,
      recordRuntimeEmbed: (name: string, position: 'body' | 'head') => {
        const normalized = name.trim().toLowerCase()
        if (normalized.length > 0) {
          runtimeEmbeds.set(normalized, position)
        }
        baseContext.recordRuntimeEmbed(name, position)
      },
    }
    createApp(
      {
        components: {
          ...(options.inheritComponents === false
            ? {}
            : componentRegistry.getAll()),
          ...(isPlainObject(options.components) ? options.components : {}),
        },
        pageContext,
      },
      {
        element: document.body,
      },
    )
    appendEmbeddedScriptsToDom(runtimeEmbeds, pageContext)
    await options.onRendered?.(document)
    if (isDocument) {
      return `<!DOCTYPE html>${document.documentElement?.outerHTML ?? ''}`
    }
    return document.body?.innerHTML ?? ''
  })
}

function appendEmbeddedScriptsToDom(
  runtimeEmbeds: Map<string, 'body' | 'head'>,
  context: PageContext,
) {
  appendRuntimeScript(
    resolveTabsEmbedPosition(runtimeEmbeds, context),
    buildTabsScript,
  )
  appendRuntimeScript(
    resolveModalEmbedPosition(runtimeEmbeds, context),
    buildModalScript,
  )
}

function appendRuntimeScript(
  position: 'body' | 'head' | undefined,
  scriptBuilder: () => string,
) {
  if (!position) return
  const targetParent = ensureScriptParent(position)
  if (!targetParent) return
  const script = document.createElement('script')
  script.textContent = scriptBuilder()
  targetParent.appendChild(script)
}

function ensureScriptParent(position: 'body' | 'head') {
  if (position === 'body') {
    return document.body
  }
  return document.head
}

function resolveTabsEmbedPosition(
  runtimeEmbeds: Map<string, 'body' | 'head'>,
  context: PageContext,
) {
  const runtimePosition = runtimeEmbeds.get('tabs')
  if (runtimePosition) return runtimePosition
  return context?.pageInfo?.frontmatter?.embed?.tabs
}

function resolveModalEmbedPosition(
  runtimeEmbeds: Map<string, 'body' | 'head'>,
  context: PageContext,
) {
  const runtimePosition = runtimeEmbeds.get('modal')
  if (runtimePosition) return runtimePosition
  return context?.pageInfo?.frontmatter?.embed?.modal
}

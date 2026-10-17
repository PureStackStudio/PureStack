import type { PageContext, RuntimeEmbeds } from '@purestack/ts-common'
import { runInDom } from '@purestack/ts-minidom'
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
  onRendered?: (
    document: Document,
    runtimeEmbeds: RuntimeEmbeds,
  ) => void | Promise<void>
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
    await options.onRendered?.(document, runtimeEmbeds)
    if (isDocument) {
      return `<!DOCTYPE html>${document.documentElement?.outerHTML ?? ''}`
    }
    return document.body?.innerHTML ?? ''
  })
}

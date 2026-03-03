import { createApp } from 'regor'
import { createDom } from '../minidom/createDom'
import { buildTabsScript } from '../templates/buildTabsScript'
import { componentRegistry } from './registry'
import type { TsSsgContext } from './ts-ssg-context'

export interface RenderAppOptions {
  components?: unknown
  context?: TsSsgContext
}

export const renderApp = (html: string, options: RenderAppOptions = {}) => {
  const normalizedHtml = html.trimStart()
  const isDocument =
    normalizedHtml.startsWith('<!DOCTYPE html>') ||
    normalizedHtml.startsWith('<!doctype html>') ||
    normalizedHtml.startsWith('<html')
  const htmlToParse = isDocument
    ? normalizedHtml
    : `<!DOCTYPE html><html><body>${html}</body></html>`
  const cleanup = createDom(htmlToParse)
  const snapshot = componentRegistry.snapshot()
  const runtimeEmbeds = new Map<string, 'body' | 'head'>()
  const tsSsgContext = options.context
    ? {
        ...options.context,
        recordRuntimeEmbed: (name: string, position: 'body' | 'head') => {
          const normalized = name.trim().toLowerCase()
          if (normalized.length > 0) {
            runtimeEmbeds.set(normalized, position)
          }
          options.context?.recordRuntimeEmbed(name, position)
        },
      }
    : undefined
  try {
    if (options.components) {
      componentRegistry.registerMany(options.components)
    }
    const components = {
      ...componentRegistry.getAll(),
    }
    createApp(
      {
        components,
        tsSsgContext,
      },
      {
        element: document.body as unknown as Node,
      },
    )
    appendEmbeddedScriptsToDom(runtimeEmbeds, tsSsgContext)
    if (isDocument) {
      const documentHtml = document.documentElement?.outerHTML ?? ''
      return `<!DOCTYPE html>${documentHtml}`
    }
    return document.body?.innerHTML ?? ''
  } finally {
    componentRegistry.restore(snapshot)
    cleanup()
  }
}

function appendEmbeddedScriptsToDom(
  runtimeEmbeds: Map<string, 'body' | 'head'>,
  context: TsSsgContext | undefined,
) {
  const tabsPosition = resolveTabsEmbedPosition(runtimeEmbeds, context)
  if (tabsPosition) {
    const targetParent = ensureScriptParent(tabsPosition)
    if (!targetParent) return
    const script = document.createElement('script')
    script.textContent = buildTabsScript()
    targetParent.appendChild(script)
  }
}

function ensureScriptParent(position: 'body' | 'head') {
  if (position === 'body') {
    return document.body
  }
  return document.head
}

function resolveTabsEmbedPosition(
  runtimeEmbeds: Map<string, 'body' | 'head'>,
  context: TsSsgContext | undefined,
) {
  const runtimePosition = runtimeEmbeds.get('tabs')
  if (runtimePosition) return runtimePosition
  return context?.pageInfo?.frontmatter?.embed?.tabs
}

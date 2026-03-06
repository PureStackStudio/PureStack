import { createDom } from '@purestack/ts-minidom'
import { createApp } from 'regor'
import { buildModalScript } from './buildModalScript'
import { buildTabsScript } from './buildTabsScript'
import { componentRegistry } from './componentRegistry'
import type { TsSsgContext } from './ts-ssg-context'

export interface RenderAppOptions {
  components: unknown
  context: TsSsgContext
}

export const renderApp = (html: string, options: RenderAppOptions) => {
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
  const baseContext = options.context
  const tsSsgContext = {
    ...baseContext,
    recordRuntimeEmbed: (name: string, position: 'body' | 'head') => {
      const normalized = name.trim().toLowerCase()
      if (normalized.length > 0) {
        runtimeEmbeds.set(normalized, position)
      }
      baseContext.recordRuntimeEmbed(name, position)
    },
  }
  try {
    if (options.components) componentRegistry.registerMany(options.components)
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
  context: TsSsgContext,
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
  context: TsSsgContext,
) {
  const runtimePosition = runtimeEmbeds.get('tabs')
  if (runtimePosition) return runtimePosition
  return context?.pageInfo?.frontmatter?.embed?.tabs
}

function resolveModalEmbedPosition(
  runtimeEmbeds: Map<string, 'body' | 'head'>,
  context: TsSsgContext,
) {
  const runtimePosition = runtimeEmbeds.get('modal')
  if (runtimePosition) return runtimePosition
  return context?.pageInfo?.frontmatter?.embed?.modal
}

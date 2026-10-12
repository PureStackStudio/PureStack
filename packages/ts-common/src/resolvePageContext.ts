import type { PageContext } from './ts-ssg-context'

type ContextCarrier = {
  pageContext?: PageContext
}

type HeadLike = {
  ctx?: unknown[]
}

function hasPageContext(value: unknown): value is ContextCarrier {
  return typeof value === 'object' && value !== null && 'pageContext' in value
}

function hasContextStack(value: unknown): value is HeadLike {
  return typeof value === 'object' && value !== null && 'ctx' in value
}

export function resolvePageContext(head: unknown): PageContext {
  const stack = hasContextStack(head) && Array.isArray(head.ctx) ? head.ctx : []
  for (const ctx of stack) {
    if (!hasPageContext(ctx)) continue
    if (ctx.pageContext) return ctx.pageContext
  }
  throw new Error('pageContext is not available in the Regor context stack.')
}

export function tryResolvePageContext(
  head: unknown,
): PageContext | undefined {
  const stack = hasContextStack(head) && Array.isArray(head.ctx) ? head.ctx : []
  for (const ctx of stack) {
    if (!hasPageContext(ctx)) continue
    if (ctx.pageContext) return ctx.pageContext
  }
  return undefined
}

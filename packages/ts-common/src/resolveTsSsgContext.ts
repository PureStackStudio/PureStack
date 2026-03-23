import type { TsSsgContext } from './ts-ssg-context'

type ContextCarrier = {
  tsSsgContext?: TsSsgContext
}

type HeadLike = {
  ctx?: unknown[]
}

function hasTsSsgContext(value: unknown): value is ContextCarrier {
  return typeof value === 'object' && value !== null && 'tsSsgContext' in value
}

function hasContextStack(value: unknown): value is HeadLike {
  return typeof value === 'object' && value !== null && 'ctx' in value
}

export function resolveTsSsgContext(head: unknown): TsSsgContext {
  const stack = hasContextStack(head) && Array.isArray(head.ctx) ? head.ctx : []
  for (const ctx of stack) {
    if (!hasTsSsgContext(ctx)) continue
    if (ctx.tsSsgContext) return ctx.tsSsgContext
  }
  throw new Error('tsSsgContext is not available in the Regor context stack.')
}

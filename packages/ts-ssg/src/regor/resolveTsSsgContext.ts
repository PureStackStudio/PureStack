import type { ComponentHead } from 'regor'

import type { TsSsgContext } from './ts-ssg-context'

type ContextCarrier = {
  tsSsgContext?: TsSsgContext
}

function hasTsSsgContext(value: unknown): value is ContextCarrier {
  return typeof value === 'object' && value !== null && 'tsSsgContext' in value
}

export function resolveTsSsgContext<TContext>(
  head?: ComponentHead<TContext>,
): TsSsgContext {
  const stack = head?.ctx ?? []
  for (const ctx of stack) {
    if (!hasTsSsgContext(ctx)) continue
    if (ctx.tsSsgContext) return ctx.tsSsgContext
  }
  throw new Error('tsSsgContext is not available in the Regor context stack.')
}

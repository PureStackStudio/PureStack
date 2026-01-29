import { merge } from '@logpot/utils'
import type { BasicHeadConfig } from '@purestack/ts-html'

export function resolveHeadConfig(frontmatter: Record<string, unknown>) {
  const title = frontmatter.title
  const description = frontmatter.description
  const head = frontmatter.head

  const base: BasicHeadConfig = {
    ...(typeof title === 'string' ? { title } : {}),
    ...(typeof description === 'string' ? { description } : {}),
  }

  return isPlainObject(head) ? merge(base, head) : base
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

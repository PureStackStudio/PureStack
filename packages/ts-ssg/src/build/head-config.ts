import { merge } from '@logpot/utils'
import type { PageFrontmatter } from '@purestack/ts-common'
import type { BasicHeadConfig } from '@purestack/ts-html'

export interface HeadConfigOptions {
  siteTitle?: string
}

export function resolveHeadConfig(
  frontmatter: PageFrontmatter,
  options: HeadConfigOptions = {},
) {
  const title = frontmatter.title
  const description = frontmatter.description
  const head = frontmatter.head
  const siteTitle = options.siteTitle
  const resolvedTitle =
    typeof title === 'string'
      ? siteTitle
        ? `${title} | ${siteTitle}`
        : title
      : typeof siteTitle === 'string'
        ? siteTitle
        : undefined

  const base: BasicHeadConfig = {
    ...(typeof resolvedTitle === 'string' ? { title: resolvedTitle } : {}),
    ...(typeof description === 'string' ? { description } : {}),
  }

  return isPlainObject(head) ? merge(base, head) : base
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

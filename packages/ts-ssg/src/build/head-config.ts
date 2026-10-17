import type {
  PageHeadConfigInput,
  PageHeadConfigTemplate,
} from '@purestack/ts-common'
import type { BasicHeadConfig } from '@purestack/ts-html'
import { isPlainObject, merge } from '@purestack/ts-util'

/** Composes metadata defaults, then applies explicit page overrides. */
export async function resolveHeadConfig(
  input: PageHeadConfigInput,
  templates: readonly PageHeadConfigTemplate[] = [],
): Promise<BasicHeadConfig> {
  const {
    site,
    pageInfo: { frontmatter },
  } = input
  const title = frontmatter.title
  const resolvedTitle =
    typeof title === 'string'
      ? site.siteTitle
        ? `${site.siteTitle} | ${title}`
        : title
      : site.siteTitle
  let config: BasicHeadConfig = {
    ...(typeof resolvedTitle === 'string' ? { title: resolvedTitle } : {}),
    ...(typeof frontmatter.description === 'string'
      ? { description: frontmatter.description }
      : {}),
  }
  for (const renderConfig of templates)
    config = merge(config, await renderConfig(input))
  if (isPlainObject(frontmatter.head)) config = merge(config, frontmatter.head)
  if (frontmatter.index === false) config.robots = 'noindex'
  return config
}

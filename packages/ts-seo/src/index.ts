import type { PageHeadConfigInput } from '@purestack/ts-common'
import { resolvePreviewConfig } from './preview'

export { type PreviewHeadOptions, resolvePreviewConfig } from './preview'

/** Supplies metadata defaults before explicit page head overrides and head rendering. */
export function seoPlugin() {
  return {
    name: 'purestack:seo',
    headConfig({ site, pageInfo }: PageHeadConfigInput) {
      return resolvePreviewConfig(pageInfo.frontmatter, {
        siteTitle: site.siteTitle,
        sitePreview: site.preview,
        basePath: site.basePath,
        baseUrl: site.sitemap.baseUrl,
        urlPath: pageInfo.urlPath,
        translations: pageInfo.translations,
      })
    },
  }
}

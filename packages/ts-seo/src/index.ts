import type {
  PageHeadConfigInput,
  SiteConfigResolution,
} from '@purestack/ts-common'
import { merge } from '@purestack/ts-util'
import { resolvePreviewOptions } from './config'
import { resolvePreviewConfig } from './preview'

export { type PreviewHeadOptions, resolvePreviewConfig } from './preview'

/** Supplies metadata defaults before explicit page head overrides and head rendering. */
export function seoPlugin() {
  return {
    name: 'purestack:seo',
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          preview: merge(
            resolvePreviewOptions(input.preview, file.preview),
            config.preview,
          ),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return { preview: resolvePreviewOptions(config.preview) }
      },
    },
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

import type {
  PageOutlineItem,
  SiteConfigResolution,
} from '@purestack/ts-common'
import { renderPageTocContent } from '@purestack/ts-page-scripts'
import { registerSemanticToneUtilityStyles } from '@purestack/ts-style'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { merge } from '@purestack/ts-util'
import { defineComponents } from './defineComponents'
import { resolveSiteLogoConfig } from './logoConfig'
import { registerStyles } from './registerStyles'

/** The standard server-rendered components and their shared CSS. */
export function componentsPlugin() {
  return {
    name: 'purestack:components',
    defaults: true,
    hooks: {
      onPageDocument(
        _context: unknown,
        page: { document: Document; outline: PageOutlineItem[] },
      ) {
        // Explicit outlines belong to their caller; the others list the
        // rendered article, in any template and inline.
        const targets = page.document.querySelectorAll(
          '[data-page-toc-auto] .page-toc__content',
        )
        if (targets.length === 0) return
        const contentHtml = renderPageTocContent(page.outline)
        for (const content of targets) content.innerHTML = contentHtml
      },
    },
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          logo: merge(
            resolveSiteLogoConfig(input.logo, file.logo),
            config.logo,
          ),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return { logo: resolveSiteLogoConfig(config.logo) }
      },
    },
    components(): Record<string, object> {
      registerStyles()
      registerSemanticToneUtilityStyles()
      return defineComponents(getSvgIcon)
    },
  }
}

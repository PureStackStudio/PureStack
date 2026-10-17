import type { PageFrontmatter, RuntimeEmbeds } from '@purestack/ts-common'
import { isTocEnabled, type PageTemplateInput } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildCodeCopyScript } from './embed/codeCopy.embed'
import { buildMenuRuntimeScript } from './embed/menuRuntime.embed'
import { buildNavMenuScript } from './embed/navMenu.embed'
import { buildPagefindSearchScript } from './embed/pagefindSearch.embed'
import { buildPageTocScript } from './embed/pageToc.embed'
import { appendRuntimeScripts } from './runtimeScripts'

/** The browser behaviors that accompany the default PureStack components. */
export function pageScriptsPlugin() {
  return {
    name: 'purestack:page-scripts',
    head: renderScriptsHead,
    hooks: {
      onPageDocument(
        _context: unknown,
        page: {
          document: Document
          runtimeEmbeds: RuntimeEmbeds
          frontmatter: PageFrontmatter
        },
      ) {
        appendRuntimeScripts(
          page.document,
          page.runtimeEmbeds,
          page.frontmatter.embed,
        )
      },
    },
  }
}

function renderScriptsHead({
  head,
  site: config,
  pageInfo,
  outline,
}: PageTemplateInput) {
  head.push(h('script').raw(buildMenuRuntimeScript()))
  if (pageInfo.frontmatter.layout.showNav !== false)
    head.push(h('script').raw(buildNavMenuScript()))
  head.push(h('script').raw(buildCodeCopyScript()))
  if (config.pagefind.enabled) {
    if (config.basePath)
      head.push(
        h('script').raw(
          `window.tsSsgPagefindBasePath=${JSON.stringify(config.basePath)};`,
        ),
      )
    head.push(
      h('script').attr({ type: 'module' }).raw(buildPagefindSearchScript()),
    )
  }
  if (isTocEnabled(pageInfo.frontmatter, outline))
    head.push(h('script').raw(buildPageTocScript()))
  return head
}

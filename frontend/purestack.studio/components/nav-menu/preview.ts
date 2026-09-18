import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, TsSsgContext } from '@purestack/ts-common'
import { defineComponents } from '@purestack/ts-components'
import {
  buildMenuRuntimeScript,
  buildNavMenuScript,
  buildThemeSwitchScript,
} from '@purestack/ts-page-scripts'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { withBasePath } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export interface NavMenuPreview {
  previewHref: string
}

const navMenuPreviewTemplate = html`<iframe
  title="NavMenu isolated example"
  class="w-full rounded-md b-1 b-subtle"
  style="height: 400px"
  :src="previewHref"
></iframe>`
const exampleTemplate = html`<NavMenu />`

function createNavMenuPreviewDocument(site: SiteConfig): string {
  const context: TsSsgContext = {
    site: { ...site },
    pageInfo: {
      relPath: 'components/nav-menu/nav-menu.mdx',
      urlPath: '/components/nav-menu/',
      frontmatter: {
        template: 'doc',
        hidden: false,
        draft: false,
        nav: { hidden: false },
        layout: {
          showNav: false,
          showToc: false,
          showFooter: false,
          fullWidth: false,
          navMode: 'sidebar',
          tocCollapsed: false,
        },
      },
    },
    theme: site.style.theme,
    basePath: site.basePath,
    locales: site.i18n.locales,
    defaultLocale: site.i18n.defaultLocale,
    resolveLocaleHref: () => undefined,
    resolvePublicHref: (href) => withBasePath(site.basePath, href),
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
  context.site.pagefind = { ...context.site.pagefind, enabled: false }
  context.site.auth = { ...context.site.auth, enabled: false }
  context.pageInfo = { ...context.pageInfo, urlPath: '/components/nav-menu/' }
  context.navigation = {
    root: '/components/',
    items: [
      {
        title: 'Navigation',
        children: [
          { title: 'NavMenu', url: '/components/nav-menu/' },
          { title: 'NavList', url: '/components/nav-list/' },
        ],
      },
      {
        title: 'Layout',
        children: [
          { title: 'Flex', url: '/components/flex/' },
          { title: 'Grid', url: '/components/grid/' },
        ],
      },
    ],
  }
  const body = renderApp(exampleTemplate, {
    components: defineComponents(getSvgIcon),
    context,
  })
  const scripts =
    buildThemeSwitchScript(['light', 'dark']) +
    buildNavMenuScript() +
    buildMenuRuntimeScript()
  const documentHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.css')}" data-theme="light"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.dark.css')}" data-theme="dark"></head><body class="tone--neutral p-3"><main class="doc-content">${body}</main><script>${scripts}</script></body></html>`
  return documentHtml
}

export function defineNavMenuPreviewComponent(site: SiteConfig) {
  return defineComponent<NavMenuPreview>(navMenuPreviewTemplate, {
    context: () => ({
      previewHref: withBasePath(
        site.basePath,
        '/components/nav-menu/preview.html',
      ),
    }),
  })
}

export async function writeNavMenuPreview(site: SiteConfig) {
  const output = path.join(
    site.outDir,
    'components',
    'nav-menu',
    'preview.html',
  )
  const documentHtml = createNavMenuPreviewDocument(site)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, documentHtml, 'utf8')
}

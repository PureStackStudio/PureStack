import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, TsSsgContext } from '@purestack/ts-common'
import { defineComponents } from '@purestack/ts-components'
import {
  buildMenuRuntimeScript,
  buildThemeSwitchScript,
} from '@purestack/ts-page-scripts'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { withBasePath } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export interface TopBarPreview {
  previewHref: string
}

const topBarPreviewTemplate = html`<iframe
  title="TopBar isolated example"
  class="w-full rounded-md b-1 b-subtle"
  style="height: 260px"
  :src="previewHref"
></iframe>`
const exampleTemplate = html`<TopBar tone="neutral" variant="surface" />
<p class="mt-4">
  A complete header in its own document. The logo links home and the theme control
  changes this preview.
</p>`

function createTopBarPreviewDocument(site: SiteConfig): string {
  const context: TsSsgContext = {
    site: { ...site },
    pageInfo: {
      relPath: 'components/site/top-bar/top-bar.mdx',
      urlPath: '/components/site/top-bar/',
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
  const body = renderApp(exampleTemplate, {
    components: defineComponents(getSvgIcon),
    context,
  })
  const scripts =
    buildThemeSwitchScript(['light', 'dark']) + buildMenuRuntimeScript()
  const documentHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.css')}" data-theme="light"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.dark.css')}" data-theme="dark"></head><body class="template-doc tone--neutral p-3" data-pagefind-ignore="all"><main class="doc-content">${body}</main><script>${scripts}</script></body></html>`
  return documentHtml
}

export function defineTopBarPreviewComponent(site: SiteConfig) {
  return defineComponent<TopBarPreview>(topBarPreviewTemplate, {
    context: () => ({
      previewHref: withBasePath(
        site.basePath,
        '/components/site/top-bar/preview.html',
      ),
    }),
  })
}

export async function writeTopBarPreview(site: SiteConfig) {
  const output = path.join(
    site.outDir,
    'components',
    'site',
    'top-bar',
    'preview.html',
  )
  const documentHtml = createTopBarPreviewDocument(site)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, documentHtml, 'utf8')
}

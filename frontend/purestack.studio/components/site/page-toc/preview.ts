import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, TsSsgContext } from '@purestack/ts-common'
import { defineComponents } from '@purestack/ts-components'
import {
  buildPageTocScript,
  buildThemeSwitchScript,
} from '@purestack/ts-page-scripts'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { withBasePath } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export interface PageTocPreview {
  previewHref: string
}

const pageTocPreviewTemplate = html`<iframe
  title="PageToc isolated example"
  class="w-full rounded-md b-1 b-subtle"
  style="height: 420px"
  :src="previewHref"
></iframe>`
const exampleTemplate = html`<PageToc title="Example contents" />
<section id="preview-introduction">
  <h2>Introduction</h2>
  <p>A table of contents points to real section IDs.</p>
</section>
<section id="preview-details">
  <h2>Details</h2>
  <h3 id="preview-contract">Contract</h3>
  <p>Keep headings descriptive and ordered.</p>
</section>`

function createPageTocPreviewDocument(site: SiteConfig): string {
  const context: TsSsgContext = {
    site: { ...site },
    pageInfo: {
      relPath: 'components/site/page-toc/page-toc.mdx',
      urlPath: '/components/site/page-toc/',
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
  context.outline = [
    { id: 'preview-introduction', title: 'Introduction', depth: 2 },
    {
      id: 'preview-details',
      title: 'Details',
      depth: 2,
      children: [{ id: 'preview-contract', title: 'Contract', depth: 3 }],
    },
  ]
  const body = renderApp(exampleTemplate, {
    components: defineComponents(getSvgIcon),
    context,
  })
  const scripts =
    buildThemeSwitchScript(['light', 'dark']) + buildPageTocScript()
  const documentHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.css')}" data-theme="light"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.dark.css')}" data-theme="dark"></head><body class="template-doc tone--neutral p-3" data-pagefind-ignore="all"><main class="doc-content">${body}</main><script>${scripts}</script></body></html>`
  return documentHtml
}

export function definePageTocPreviewComponent(site: SiteConfig) {
  return defineComponent<PageTocPreview>(pageTocPreviewTemplate, {
    context: () => ({
      previewHref: withBasePath(
        site.basePath,
        '/components/site/page-toc/preview.html',
      ),
    }),
  })
}

export async function writePageTocPreview(site: SiteConfig) {
  const output = path.join(
    site.outDir,
    'components',
    'site',
    'page-toc',
    'preview.html',
  )
  const documentHtml = createPageTocPreviewDocument(site)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, documentHtml, 'utf8')
}

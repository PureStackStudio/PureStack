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

export interface SignInPreview {
  previewHref: string
}

const signInPreviewTemplate = html`<iframe
  title="SignIn isolated example"
  class="w-full rounded-md b-1 b-subtle"
  style="height: 340px"
  :src="previewHref"
></iframe>`
const exampleTemplate = html`<Flex align="center" justify="between">
  <span>Example workspace</span>
  <SignIn label="Workspace account" tone="neutral">
    <Flex
      container="nav"
      direction="column"
      aria-label="Example account destinations"
    >
      <BtnLink href="/components/" variant="subtleBtn">Component library</BtnLink>
      <BtnLink href="/components/site/site-logo/" variant="subtleBtn">
        Workspace branding
      </BtnLink>
    </Flex>
  </SignIn>
</Flex>
<p class="mt-4">
  Open the account menu. These custom destinations are documentation links; this
  preview does not sign you in.
</p>`

function createSignInPreviewDocument(site: SiteConfig): string {
  const context: TsSsgContext = {
    site: { ...site },
    pageInfo: {
      relPath: 'components/site/sign-in/sign-in.mdx',
      urlPath: '/components/site/sign-in/',
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
  context.site.auth = { ...context.site.auth, enabled: true, signUp: false }
  const body = renderApp(exampleTemplate, {
    components: defineComponents(getSvgIcon),
    context,
  })
  const scripts =
    buildThemeSwitchScript(['light', 'dark']) + buildMenuRuntimeScript()
  const documentHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.css')}" data-theme="light"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.dark.css')}" data-theme="dark"></head><body class="template-doc tone--neutral p-3" data-pagefind-ignore="all"><main class="doc-content">${body}</main><script>${scripts}</script></body></html>`
  return documentHtml
}

export function defineSignInPreviewComponent(site: SiteConfig) {
  return defineComponent<SignInPreview>(signInPreviewTemplate, {
    context: () => ({
      previewHref: withBasePath(
        site.basePath,
        '/components/site/sign-in/preview.html',
      ),
    }),
  })
}

export async function writeSignInPreview(site: SiteConfig) {
  const output = path.join(
    site.outDir,
    'components',
    'site',
    'sign-in',
    'preview.html',
  )
  const documentHtml = createSignInPreviewDocument(site)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, documentHtml, 'utf8')
}

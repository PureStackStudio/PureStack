import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, TsSsgContext } from '@purestack/ts-common'
import { defineComponents } from '@purestack/ts-components'
import {
  buildConsentScript,
  buildThemeSwitchScript,
} from '@purestack/ts-page-scripts'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { withBasePath } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export interface ConsentPreview {
  previewHref: string
}

const consentPreviewTemplate = html`<iframe
  title="Consent isolated example"
  class="w-full rounded-md b-1 b-subtle"
  style="height: 560px"
  :src="previewHref"
></iframe>`
const exampleTemplate = html`<SectionHeader
  title="Privacy settings example"
  titleTag="h2"
  subtitle="Make a choice, then reopen settings to change it."
/>
<div class="consent-settings-teleport-area"></div>
<Consent />
<Btn
  variant="outline"
  class="mt-3"
  type="button"
  onclick="
    localStorage.removeItem('purestack-docs-consent-example');
    location.reload();
  "
>
  Reset this example
</Btn>`

async function createConsentPreviewDocument(site: SiteConfig): Promise<string> {
  const context: TsSsgContext = {
    site: { ...site },
    pageInfo: {
      relPath: 'components/site/consent/consent.mdx',
      urlPath: '/components/site/consent/',
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
  context.site.consent = {
    ...context.site.consent,
    enabled: true,
    storageKey: 'purestack-docs-consent-example',
    policyVersion: 'example-1',
    bannerTitle: 'Example privacy choices',
    bannerDescription: 'This isolated example has no tracking services.',
    privacyPolicyUrl: '/components/site/consent/',
    privacyPolicyLabel: 'Read the consent guide',
    categories: [
      {
        id: 'necessary',
        label: 'Necessary',
        required: true,
        description: 'Required for this example’s saved choice.',
      },
      {
        id: 'preferences',
        label: 'Preferences',
        description: 'Illustrative optional interface preferences.',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        description: 'Illustrative optional category; no service is loaded.',
      },
      {
        id: 'marketing',
        label: 'Marketing',
        description: 'Illustrative optional category; no service is loaded.',
      },
    ],
    services: [],
  }
  const body = await renderApp(exampleTemplate, {
    components: defineComponents(getSvgIcon),
    context,
  })
  const scripts =
    buildThemeSwitchScript(['light', 'dark']) +
    buildConsentScript(context.site.consent)
  const documentHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.css')}" data-theme="light"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.dark.css')}" data-theme="dark"></head><body class="template-doc tone--neutral p-3" data-pagefind-ignore="all"><main class="doc-content">${body}</main><script>${scripts}</script></body></html>`
  return documentHtml
}

export function defineConsentPreviewComponent(site: SiteConfig) {
  return defineComponent<ConsentPreview>(consentPreviewTemplate, {
    context: () => ({
      previewHref: withBasePath(
        site.basePath,
        '/components/site/consent/preview.html',
      ),
    }),
  })
}

export async function writeConsentPreview(site: SiteConfig) {
  const output = path.join(
    site.outDir,
    'components',
    'site',
    'consent',
    'preview.html',
  )
  const documentHtml = await createConsentPreviewDocument(site)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, documentHtml, 'utf8')
}

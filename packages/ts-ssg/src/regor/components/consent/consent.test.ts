import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../../config/config'
import { normalizeFrontmatter } from '../../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../../../minidom/createDom'
import { renderApp } from '../../renderApp'
import { createConsentComponents } from './consent'

describe('Consent component rendering', () => {
  it('renders consent shell and categories when enabled', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createConsentComponents(),
    }
    const site = resolveSiteConfig({
      consent: {
        enabled: true,
        categories: [
          { id: 'necessary', label: 'Necessary', required: true },
          { id: 'analytics', label: 'Analytics' },
        ],
        services: [],
      },
    })
    const pageInfo = {
      relPath: 'index.md',
      urlPath: '/',
      frontmatter: normalizeFrontmatter({ layout: { showFooter: false } }),
    }
    const html = renderApp(`<Consent />`, {
      components,
      context: { site, theme: site.style.theme, pageInfo },
    })
    cleanup()

    expect(html).toContain('data-consent-root')
    expect(html).toContain('data-consent-banner')
    expect(html).toContain('data-consent-panel')
    expect(html).toContain('data-consent-settings')
    expect(html).toContain('data-consent-category-id="necessary"')
    expect(html).toContain('data-consent-category-id="analytics"')
    expect(html).toContain('Reject non-essential')
  })
})

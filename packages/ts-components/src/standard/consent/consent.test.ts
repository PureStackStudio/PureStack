import { ensureDomGlobals } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../../renderApp'
import { createTestContext } from '../../test/testContext'
import { createButtonComponents } from '../btn/btn'
import { createConsentComponents } from './consent'

describe('Consent component rendering', () => {
  it('renders consent shell and categories when enabled', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createButtonComponents(),
      ...createConsentComponents(),
    }
    const html = renderApp(`<Consent />`, {
      components,
      context: createTestContext({
        site: {
          consent: {
            enabled: true,
            categories: [
              { id: 'necessary', label: 'Necessary', required: true },
              { id: 'analytics', label: 'Analytics' },
            ],
          },
        },
        pageInfo: {
          frontmatter: {
            layout: {
              showFooter: false,
            },
          },
        },
      }),
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

import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineFlexComponents } from '../flex/flex'
import { defineFormComponents } from '../form/form'
import { definePanelComponents } from '../panel/panel'
import { defineConsentComponents } from './consent'

describe('Consent component rendering', () => {
  let cleanup: () => void
  beforeEach(() => {
    cleanup = ensureDomGlobals()
  })
  afterEach(() => cleanup())

  it('renders consent shell and categories when enabled', async () => {
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...definePanelComponents(),
      ...defineConsentComponents(),
    }
    const html = await renderApp(`<Consent />`, {
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

    expect(html).toContain('data-consent-root')
    expect(html).toContain('data-consent-banner')
    expect(html).toContain('data-consent-panel')
    expect(html).not.toContain('data-consent-settings')
    expect(html).toContain('data-consent-category-id="necessary"')
    expect(html).toContain('data-consent-category-id="analytics"')
    expect(html).toContain('Reject non-essential')
  })

  it.each([
    ['<Consent />', '.consent-settings-teleport-area', true],
    ['<Consent settingsTeleport="#privacy" />', '#privacy', true],
    ['<Consent settingsTeleport="#missing" />', '#privacy', false],
    [
      '<Consent settingsTeleport="" />',
      '.consent-settings-teleport-area',
      false,
    ],
  ])(
    'renders settings only at an available target: %s',
    async (markup, target, expected) => {
      const html = await renderApp(
        `<div ${target.startsWith('#') ? `id="${target.slice(1)}"` : `class="${target.slice(1)}"`}></div>${markup}`,
        {
          components: {
            ...defineButtonComponents(),
            ...defineFlexComponents(),
            ...defineFormComponents(),
            ...definePanelComponents(),
            ...defineConsentComponents(),
          },
          context: createTestContext({ site: { consent: { enabled: true } } }),
          onRendered(document) {
            const button = document.querySelector('[data-consent-settings]')
            expect(!!button).toBe(expected)
            if (expected) {
              expect(button?.parentElement).toBe(document.querySelector(target))
            }
          },
        },
      )
      expect(html).toContain('data-consent-panel')
    },
  )
})

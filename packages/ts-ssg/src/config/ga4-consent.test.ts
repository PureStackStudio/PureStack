import fs from 'node:fs'
import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { transformSync } from 'esbuild'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from './config'

// Test the runtime source without regenerating the committed embeds.
const runtime = transformSync(
  fs.readFileSync(
    new URL('../../../ts-page-scripts/src/consent.ts', import.meta.url),
    'utf8',
  ),
  { loader: 'ts', target: 'es2022' },
).code
const site = JSON.parse(
  fs.readFileSync(
    new URL(
      '../../../../frontend/purestack.studio/siteConfig.json',
      import.meta.url,
    ),
    'utf8',
  ),
)
const config = resolveSiteConfig({
  consent: {
    enabled: true,
    policyVersion: '2026-10-07',
    categories: [
      { id: 'necessary', required: true },
      { id: 'analytics', required: false },
    ],
  },
  analytics: {
    ga4: {
      enabled: true,
      measurementId: 'G-TEST1234',
      consentCategory: 'analytics',
      serviceId: 'ga4',
    },
  },
}).consent
const disableKey = 'ga-disable-G-TEST1234'

function withRuntime(
  run: (tracker: Record<string, unknown>) => void,
  stored?: object,
) {
  const cleanupGlobals = ensureDomGlobals()
  const cleanupDom = createDom(
    '<html><head></head><body><div data-consent-root><div data-consent-banner></div><div data-consent-panel></div></div></body></html>',
  )
  try {
    if (stored) localStorage.setItem(config.storageKey, JSON.stringify(stored))
    new Function('consentConfig', runtime)(config)
    document.dispatchEvent(new Event('DOMContentLoaded'))
    run(window as unknown as Record<string, unknown>)
  } finally {
    cleanupDom()
    cleanupGlobals()
  }
}

describe('GA4 consent', () => {
  it('keeps frontend analytics disabled with necessary-only consent enabled', () => {
    const frontend = resolveSiteConfig({
      consent: site.consent,
      analytics: site.analytics,
    })
    expect(frontend.analytics.ga4.enabled).toBe(false)
    expect(frontend.consent.enabled).toBe(true)
    expect(frontend.consent.categories).toHaveLength(1)
    expect(frontend.consent.categories[0]).toMatchObject({
      id: 'necessary',
      required: true,
    })
    expect(frontend.consent.services).toEqual([])
  })

  it('blocks initial/rejected analytics and immediately disables it on withdrawal', () => {
    withRuntime((tracker) => {
      const countScripts = () =>
        document.querySelectorAll('[data-consent-service="ga4"]').length
      expect(tracker[disableKey]).toBe(true)
      expect(countScripts()).toBe(0)
      window.tsSsgConsent.rejectAll()
      expect(countScripts()).toBe(0)
      window.tsSsgConsent.acceptAll()
      expect(tracker[disableKey]).toBe(false)
      expect(countScripts()).toBe(2)
      window.tsSsgConsent.rejectAll()
      expect(tracker[disableKey]).toBe(true)
      window.tsSsgConsent.acceptAll()
      expect(tracker[disableKey]).toBe(false)
      expect(countScripts()).toBe(2)
      window.tsSsgConsent.setCategories({ analytics: false })
      expect(tracker[disableKey]).toBe(true)
      window.tsSsgConsent.reset()
      expect(tracker[disableKey]).toBe(true)
    })
  })

  it.each([true, false])(
    'restores a saved analytics choice (%s)',
    (allowed) => {
      withRuntime(
        (tracker) => {
          expect(tracker[disableKey]).toBe(!allowed)
          expect(
            document.querySelectorAll('[data-consent-service="ga4"]').length,
          ).toBe(allowed ? 2 : 0)
        },
        {
          version: config.policyVersion,
          categories: { necessary: true, analytics: allowed },
        },
      )
    },
  )

  it('does not reuse consent from the old necessary-only policy', () => {
    withRuntime(
      (tracker) => {
        expect(tracker[disableKey]).toBe(true)
        expect(
          document.querySelectorAll('[data-consent-service="ga4"]').length,
        ).toBe(0)
      },
      {
        version: '2026-09-16',
        categories: { necessary: true, analytics: true },
      },
    )
  })
})

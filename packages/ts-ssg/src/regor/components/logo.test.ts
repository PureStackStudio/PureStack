import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { ensureDomGlobals } from '../registerDomGlobals'
import { renderApp } from '../renderApp'
import { createLogoComponents } from './logo'

describe('RegorLogo rendering', () => {
  it('renders two brand words and subtitle', () => {
    const cleanup = ensureDomGlobals()
    const components = createLogoComponents() as Record<string, Component<unknown>>
    const html = renderApp(
      `<RegorLogo
        wordOne="Calc"
        wordTwo="Core"
        subtitle="backend-native engine"
        href="/"
      />`,
      { components },
    )
    cleanup()

    expect(html).toContain('Calc')
    expect(html).toContain('Core')
    expect(html).toContain('backend-native engine')
    expect(html).toContain('href="/"')
  })

  it('uses fallback words and omits subtitle when not provided', () => {
    const cleanup = ensureDomGlobals()
    const components = createLogoComponents() as Record<string, Component<unknown>>
    const html = renderApp(`<RegorLogo />`, { components })
    cleanup()

    expect(html).toContain('Pure')
    expect(html).toContain('Stack')
    expect(html).not.toContain('regor-logo__subtitle')
  })
})

import type { Component } from 'regor'
import { describe, expect, it } from 'vitest'

import { ensureDomGlobals } from '../../registerDomGlobals'
import { renderApp } from '../../renderApp'
import { createBadgeComponents } from './badge'

describe('StatusBadge rendering', () => {
  it('renders badge with status variant class', () => {
    const cleanup = ensureDomGlobals()
    const components = createBadgeComponents() as Record<string, Component<unknown>>
    const html = renderApp('<StatusBadge variant="warning">pending</StatusBadge>', {
      components,
    })
    cleanup()

    expect(html).toContain('class="status-badge status-badge--warning"')
    expect(html).toContain('pending')
  })
})

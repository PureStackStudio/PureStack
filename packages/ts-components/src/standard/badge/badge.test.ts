import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineBadgeComponents } from './badge'

describe('StatusBadge rendering', () => {
  it('renders badge with semantic tone classes', () => {
    const cleanup = ensureDomGlobals()
    const components = defineBadgeComponents()
    const html = renderApp('<Badge tone="warning">pending</Badge>', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="badge tone-button tone--warning"')
    expect(html).toContain('pending')
  })
})

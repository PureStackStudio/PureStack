import { describe, expect, it } from 'vitest'

import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '../../renderApp'
import { createTestContext } from '../../test/testContext'
import { createBadgeComponents } from './badge'

describe('StatusBadge rendering', () => {
  it('renders badge with status variant class', () => {
    const cleanup = ensureDomGlobals()
    const components = createBadgeComponents()
    const html = renderApp('<Badge variant="warning">pending</Badge>', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="badge badge--warning"')
    expect(html).toContain('pending')
  })
})

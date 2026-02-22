import { describe, expect, it } from 'vitest'

import { ensureDomGlobals } from '../../../minidom/registerDomGlobals'
import { renderApp } from '../../renderApp'
import { createBadgeComponents } from './badge'

describe('StatusBadge rendering', () => {
  it('renders badge with status variant class', () => {
    const cleanup = ensureDomGlobals()
    const components = createBadgeComponents()
    const html = renderApp('<Badge variant="warning">pending</Badge>', {
      components,
    })
    cleanup()

    expect(html).toContain('class="badge badge--warning"')
    expect(html).toContain('pending')
  })
})

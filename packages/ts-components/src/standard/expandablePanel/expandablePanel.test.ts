import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'

import { createTestContext } from '../../test/testContext'
import { createIconComponents } from '../icon/icon'
import { createExpandablePanelComponents } from './expandablePanel'

describe('ExpandablePanel rendering', () => {
  it('renders an accent tone open panel with summary and body content', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createExpandablePanelComponents(),
    }
    const html = renderApp(
      `<ExpandablePanel
        title="Microsoft 365"
        description="Desktop apps, cloud storage, and AI-powered workflows."
        badge="Popular"
        meta="Open by default"
        icon="iconoir:computer"
        tone="accent"
        open="true"
      >
        <p>Upgrade today to unlock richer collaboration and advanced protection.</p>
        <p>Three included services are ready as soon as the plan is activated.</p>
      </ExpandablePanel>`,
      {
        components,
        context: createTestContext({
          pageInfo: { relPath: 'expandable-panel.mdx', urlPath: '/guide/' },
        }),
      },
    )
    cleanup()

    expect(html).toContain(
      '<details class="expandable-panel tone-surface--accent tone-text--accent" open',
    )
    expect(html).toContain('Microsoft 365')
    expect(html).toContain('class="icon-wrap tone-icon--accent"')
    expect(html).toContain('Upgrade today to unlock richer collaboration')
  })

  it('renders a closed neutral panel when optional content is omitted', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createExpandablePanelComponents(),
    }
    const html = renderApp('<ExpandablePanel />', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain(
      '<details class="expandable-panel tone-surface--neutral tone-text--neutral">',
    )
    expect(html).not.toContain(
      '<details class="expandable-panel tone-surface--neutral tone-text--neutral" open',
    )
  })
})

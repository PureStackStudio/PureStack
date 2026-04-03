import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { createIconComponents } from '../icon/icon'
import { createTabsComponents } from './tabs'

describe('Tabs rendering', () => {
  it('renders slotted tab content and active tab state', () => {
    const cleanup = ensureDomGlobals()
    const components = { ...createIconComponents(), ...createTabsComponents() }
    const html = renderApp(
      `<Tabs group="quickstart">
        <TabPane id="install" label="Install">Run npm install</TabPane>
        <TabPane id="usage" label="Usage" active="true">
          <strong>Import buildSite</strong>
        </TabPane>
      </Tabs>`,
      {
        components,
        context: createTestContext({
          pageInfo: { relPath: 'tabs.mdx', urlPath: '/tabs/' },
        }),
      },
    )
    cleanup()

    expect(html).toContain('Run npm install')
    expect(html).toContain('<strong>Import buildSite</strong>')
    expect(html).toContain('name="quickstart"')
    expect(html).toContain('aria-selected="true"')
  })

  it('inherits tab group from parent tabs and marks disabled panes', () => {
    const cleanup = ensureDomGlobals()
    const components = { ...createIconComponents(), ...createTabsComponents() }
    const html = renderApp(
      `<Tabs group="sdk-tabs">
        <TabPane id="blocked" label="Blocked" disabled="true">blocked</TabPane>
        <TabPane id="ready" label="Ready">ready</TabPane>
      </Tabs>`,
      {
        components,
        context: createTestContext({
          pageInfo: { relPath: 'tabs.mdx', urlPath: '/tabs/' },
        }),
      },
    )
    cleanup()

    expect(html).toContain('name="sdk-tabs"')
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('>Ready<')
  })

  it('renders optional tab icons', () => {
    const cleanup = ensureDomGlobals()
    const components = { ...createIconComponents(), ...createTabsComponents() }
    const html = renderApp(
      `<Tabs id="icon-tabs">
        <TabPane id="install" label="Install" icon="iconoir:code">Run npm install</TabPane>
      </Tabs>`,
      {
        components,
        context: createTestContext({
          pageInfo: { relPath: 'tabs.mdx', urlPath: '/tabs/' },
        }),
      },
    )
    cleanup()

    expect(html).toContain('class="icon tabs__tab-icon"')
    expect(html).toContain('<span class="icon tabs__tab-icon"')
    expect(html).toContain('<span class="tabs__tab-label">Install</span>')
  })
})

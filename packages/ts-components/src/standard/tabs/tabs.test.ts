import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { createApp, ref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineTabsComponents } from './tabs'

describe('Tabs rendering', () => {
  it.each([
    [undefined, 'false'],
    [true, 'true'],
    [false, 'false'],
  ])(
    'renders the mobile select setting %s as %s',
    async (mobileSelect, expected) => {
      const cleanup = ensureDomGlobals()
      try {
        const binding =
          mobileSelect === undefined ? '' : `:mobileSelect="${mobileSelect}"`
        const html = await renderApp(
          `<Tabs ${binding}><TabPane id="overview" label="Overview">Content</TabPane></Tabs>`,
          {
            components: {
              ...defineIconComponents(getSvgIcon),
              ...defineTabsComponents(),
            },
            context: createTestContext({
              pageInfo: { relPath: 'tabs.mdx', urlPath: '/tabs/' },
            }),
          },
        )
        expect(html).toContain(`data-mobile-select="${expected}"`)
      } finally {
        cleanup()
      }
    },
  )

  it('updates mobileSelect reactively per instance without changing selection', () => {
    const cleanupDom = createDom(
      '<html><body><div id="app"></div></body></html>',
    )
    const mobileSelect = ref(false)
    const selectedTab = ref('details')
    const app = createApp(
      {
        components: {
          ...defineIconComponents(getSvgIcon),
          ...defineTabsComponents(),
        },
        mobileSelect,
        selectedTab,
      },
      {
        selector: '#app',
        template: `<Tabs id="configurable-tabs" group="configurable" :mobileSelect="mobileSelect" :selectedTab="selectedTab">
          <TabPane id="overview" label="Overview">Overview</TabPane>
          <TabPane id="details" label="Details">Details</TabPane>
        </Tabs>
        <Tabs id="default-tabs" group="default"><TabPane id="other" label="Other">Other</TabPane></Tabs>`,
      },
    )
    try {
      const root = document.querySelector('#configurable-tabs')
      const other = document.querySelector('#default-tabs')
      expect(root?.getAttribute('data-mobile-select')).toBe('false')
      expect(other?.getAttribute('data-mobile-select')).toBe('false')

      mobileSelect(true)
      expect(root?.getAttribute('data-mobile-select')).toBe('true')
      mobileSelect(false)
      expect(root?.getAttribute('data-mobile-select')).toBe('false')
      expect(other?.getAttribute('data-mobile-select')).toBe('false')
      expect(selectedTab()).toBe('details')
      expect(
        document.querySelector<HTMLInputElement>('#details')?.checked,
      ).toBe(true)
    } finally {
      app.unbind()
      cleanupDom()
    }
  })

  it('renders slotted tab content and active tab state', async () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineTabsComponents(),
    }
    const html = await renderApp(
      `<Tabs group="quickstart" selected-tab="usage">
        <TabPane id="install" label="Install">Run npm install</TabPane>
        <TabPane id="usage" label="Usage">
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
    expect(html).toContain(
      '<input class="tabs__control" type="radio" name="quickstart" id="usage" checked>',
    )
  })

  it('inherits tab group from parent tabs and marks disabled panes', async () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineTabsComponents(),
    }
    const html = await renderApp(
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

  it('renders optional tab icons', async () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineTabsComponents(),
    }
    const html = await renderApp(
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

  it('binds selectedTab in both directions', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineTabsComponents(),
    }
    const selectedTab = ref('usage')
    const app = createApp(
      {
        components,
        tsSsgContext: createTestContext({
          pageInfo: { relPath: 'tabs.mdx', urlPath: '/tabs/' },
        }),
        selectedTab,
      },
      {
        selector: '#app',
        template: `<Tabs group="docs" :selected-tab="selectedTab">
          <TabPane id="install" label="Install">Run npm install</TabPane>
          <TabPane id="usage" label="Usage">Import buildSite</TabPane>
        </Tabs>
        <output id="selected-tab">{{ selectedTab }}</output>`,
      },
    )
    try {
      const installInput = document.querySelector<HTMLInputElement>('#install')
      const usageInput = document.querySelector<HTMLInputElement>('#usage')
      const selectedTabOutput =
        document.querySelector<HTMLOutputElement>('#selected-tab')

      expect(installInput).toBeTruthy()
      expect(usageInput).toBeTruthy()
      expect(selectedTabOutput?.textContent).toBe('usage')
      expect(usageInput?.checked).toBe(true)
      expect(installInput?.checked).toBe(false)

      selectedTab('install')

      expect(selectedTabOutput?.textContent).toBe('install')
      expect(installInput?.checked).toBe(true)
      expect(usageInput?.checked).toBe(false)
      if (usageInput) {
        usageInput.checked = true
        usageInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
      expect(selectedTab()).toBe('usage')
      expect(selectedTabOutput?.textContent).toBe('usage')
      expect(usageInput?.checked).toBe(true)
      expect(installInput?.checked).toBe(false)
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

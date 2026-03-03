import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../../config/config'
import { normalizeFrontmatter } from '../../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../../../minidom/createDom'
import { renderApp } from '../../renderApp'
import { createTabsComponents } from './tabs'

describe('Tabs rendering', () => {
  it('renders slotted tab content and active tab state', () => {
    const cleanup = ensureDomGlobals()
    const components = createTabsComponents()
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'tabs.mdx',
      urlPath: '/tabs/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(
      `<Tabs id="quickstart" variant="underline">
        <TabsHeader><h2>Quickstart</h2></TabsHeader>
        <TabPane id="install" label="Install">Run npm install</TabPane>
        <TabPane id="usage" label="Usage" active="true">
          <strong>Import buildSite</strong>
        </TabPane>
      </Tabs>`,
      {
        components,
        context: {
          site,
          theme: site.style.theme,
          pageInfo,
          recordScriptEntrypoint: () => {},
          recordRuntimeEmbed: () => {},
        },
      },
    )
    cleanup()

    expect(html).toContain('tabs--underline')
    expect(html).toContain('Run npm install')
    expect(html).toContain('<h2>Quickstart</h2>')
    expect(html).toContain('<strong>Import buildSite</strong>')
    expect(html).toContain('name="tabs-quickstart"')
    expect(html).toContain('aria-selected="true"')
  })

  it('inherits tab group from parent tabs and marks disabled panes', () => {
    const cleanup = ensureDomGlobals()
    const components = createTabsComponents()
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'tabs.mdx',
      urlPath: '/tabs/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(
      `<Tabs id="sdk-tabs">
        <TabPane id="blocked" label="Blocked" disabled="true">blocked</TabPane>
        <TabPane id="ready" label="Ready">ready</TabPane>
      </Tabs>`,
      {
        components,
        context: {
          site,
          theme: site.style.theme,
          pageInfo,
          recordScriptEntrypoint: () => {},
          recordRuntimeEmbed: () => {},
        },
      },
    )
    cleanup()

    expect(html).toContain('name="tabs-sdk-tabs"')
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('>Ready<')
  })

  it('supports explicit group override on tab panes', () => {
    const cleanup = ensureDomGlobals()
    const components = createTabsComponents()
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'tabs.mdx',
      urlPath: '/tabs/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(
      `<Tabs id="outer">
        <TabPane id="a" group="manual-group" label="Manual">content</TabPane>
      </Tabs>`,
      {
        components,
        context: {
          site,
          theme: site.style.theme,
          pageInfo,
          recordScriptEntrypoint: () => {},
          recordRuntimeEmbed: () => {},
        },
      },
    )
    cleanup()

    expect(html).toContain('name="manual-group"')
    expect(html).toContain('id="manual-group__control-a"')
  })

  it('renders optional tab icons', () => {
    const cleanup = ensureDomGlobals()
    const components = createTabsComponents()
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'tabs.mdx',
      urlPath: '/tabs/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(
      `<Tabs id="icon-tabs">
        <TabPane id="install" label="Install" icon="iconoir:code">Run npm install</TabPane>
      </Tabs>`,
      {
        components,
        context: {
          site,
          theme: site.style.theme,
          pageInfo,
          recordScriptEntrypoint: () => {},
          recordRuntimeEmbed: () => {},
        },
      },
    )
    cleanup()

    expect(html).toContain('class="tabs__tab-icon"')
    expect(html).toContain('<span class="tabs__tab-icon"><svg')
    expect(html).toContain('<span class="tabs__tab-label">Install</span>')
  })
})

import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineFlexComponents } from '../flex/flex'
import { defineIconComponents } from '../icon/icon'
import { definePanelComponents } from '../panel/panel'
import { defineSignInComponents } from '../signIn/signIn'
import { defineNavigationComponents } from './navMenu'

describe('NavMenu rendering', () => {
  it('evaluates r-else branches for leaf items', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineIconComponents(getSvgIcon),
      ...definePanelComponents(),
      ...defineSignInComponents(),
      ...defineNavigationComponents(),
    }
    const html = renderApp(
      `<NavMenu
        :items="[
          { title: 'Home', url: '/home/' },
          { title: 'Group', children: [{ title: 'Child', url: '/child/' }] }
        ]"
      ></NavMenu>`,
      {
        components,
        context: createTestContext({
          site: {
            auth: {
              enabled: true,
            },
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('Home')
    expect(html).toContain('Group')
    expect(html).toContain('Child')
    expect(html).toContain('class="sign-in position-relative nav__account"')
    expect(html).not.toContain('r-else=')
  })

  it('renders a neutral flat panel by default and accepts tone and variant', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineIconComponents(getSvgIcon),
      ...definePanelComponents(),
      ...defineSignInComponents(),
      ...defineNavigationComponents(),
    }
    const render = (template: string) =>
      renderApp(template, { components, context: createTestContext() })
    const defaultHtml = render(`<NavMenu :items="[]"></NavMenu>`)
    const customHtml = render(
      `<NavMenu :items="[]" tone="accent" variant="glass" variantMode="stateful"></NavMenu>`,
    )
    cleanup()

    expect(defaultHtml).toMatch(
      /<nav class="nav__menu [^"]*tone-fill-flat [^"]*tone--neutral"/,
    )
    expect(defaultHtml).not.toContain('tone-fill-flat-hover')
    expect(customHtml).toMatch(
      /<nav class="nav__menu [^"]*tone-fill-glass [^"]*tone-fill-glass-hover[^"]*tone--accent"/,
    )
    expect(customHtml).not.toContain('tone-fill-flat')
  })

  it('adds a given class to the navigation panel', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(
      `<NavMenu :items="[]" class="spotlight-from-top-right"></NavMenu>`,
      {
        components: {
          ...defineButtonComponents(),
          ...defineFlexComponents(),
          ...defineIconComponents(getSvgIcon),
          ...definePanelComponents(),
          ...defineSignInComponents(),
          ...defineNavigationComponents(),
        },
        context: createTestContext(),
      },
    )
    cleanup()

    const navClass = html.match(/<nav class="([^"]*)"/)?.[1].split(' ')
    expect(navClass).toContain('spotlight-from-top-right')
    expect(navClass).toContain('tone-fill-flat')
  })

  it('marks the currentUrl item as the current page and opens its group', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineIconComponents(getSvgIcon),
      ...definePanelComponents(),
      ...defineSignInComponents(),
      ...defineNavigationComponents(),
    }
    const html = renderApp(
      `<NavMenu
        currentUrl="/guides/themes/"
        :items="[
          { title: 'Home', url: '/' },
          { title: 'Guides', children: [{ title: 'Themes', url: '/guides/themes/' }] }
        ]"
      ></NavMenu>`,
      { components, context: createTestContext() },
    )
    cleanup()

    expect(html).toMatch(/<a[^>]*aria-current="page"[^>]*>[\s\S]*?Themes/)
    expect(html).toContain('data-nav-default-open="true"')
    expect(html.match(/aria-current="page"/g)).toHaveLength(1)
  })

  it('renders stable state keys for collapsible groups', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineIconComponents(getSvgIcon),
      ...definePanelComponents(),
      ...defineSignInComponents(),
      ...defineNavigationComponents(),
    }
    const html = renderApp(
      `<NavMenu
        :items="[
          {
            title: 'Docs',
            url: '/docs/',
            children: [
              {
                title: 'Storage',
                children: [{ title: 'Disk Segments', url: '/docs/storage/disk-segments/' }]
              }
            ]
          }
        ]"
      ></NavMenu>`,
      {
        components,
        context: createTestContext({
          navigation: {
            root: 'docs',
          },
          pageInfo: {
            urlPath: '/docs/storage/disk-segments/',
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('data-nav-root="docs"')
    expect(html).toContain('data-nav-group-key="docs"')
    expect(html).toContain('data-nav-group-key="docs/Storage"')
    expect(html).toContain('data-nav-default-open="true"')
    expect(html).toContain(
      'window.tsSsgNavMenu?.hydrate(document.currentScript?.parentElement)',
    )
  })
})

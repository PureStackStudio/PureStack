import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineIconComponents } from '../icon/icon'
import { defineSignInComponents } from '../signIn/signIn'
import { defineNavigationComponents } from './navMenu'

describe('NavMenu rendering', () => {
  it('evaluates r-else branches for leaf items', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineIconComponents(getSvgIcon),
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
    expect(html).toContain('class="sign-in nav__account"')
    expect(html).not.toContain('r-else=')
  })
})

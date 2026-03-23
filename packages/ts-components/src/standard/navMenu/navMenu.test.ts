import { ensureDomGlobals } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../../render/renderApp'
import { createTestContext } from '../../test/testContext'
import { createIconComponents } from '../icon/icon'
import { createNavigationComponents } from './navMenu'

describe('NavMenu rendering', () => {
  it('evaluates r-else branches for leaf items', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(),
      ...createNavigationComponents(),
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
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('Home')
    expect(html).toContain('Group')
    expect(html).toContain('Child')
    expect(html).not.toContain('r-else=')
  })
})

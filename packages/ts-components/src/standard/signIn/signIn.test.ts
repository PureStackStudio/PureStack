import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineIconComponents } from '../icon/icon'
import { defineSignInComponents } from './signIn'

const getSvgIcon = (name: string) => `<svg data-icon="${name}"></svg>`

describe('SignIn rendering', () => {
  it('renders a circular icon trigger with default account links', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(`<SignIn />`, {
      components: {
        ...defineButtonComponents(),
        ...defineIconComponents(getSvgIcon),
        ...defineSignInComponents(),
      },
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="sign-in"')
    expect(html).toContain('aria-label="Account menu"')
    expect(html).toContain('data-icon="lucide:circle-user-round"')
    expect(html).toContain('href="/account/"')
    expect(html).toContain('href="/account/settings/"')
    expect(html).toContain('href="/sign-out/"')
  })

  it('renders a supplied avatar image and custom menu content', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(
      `<SignIn avatarSrc="/me.png" avatarAlt="Ada Lovelace">
        <a href="/billing/">Billing</a>
      </SignIn>`,
      {
        components: {
          ...defineButtonComponents(),
          ...defineIconComponents(getSvgIcon),
          ...defineSignInComponents(),
        },
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="sign-in__avatar"')
    expect(html).toContain('src="/me.png"')
    expect(html).toContain('alt="Ada Lovelace"')
    expect(html).toContain('href="/billing/"')
    expect(html).not.toContain('href="/account/settings/"')
  })
})

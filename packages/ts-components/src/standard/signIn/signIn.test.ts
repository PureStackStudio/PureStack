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
      context: createTestContext({
        site: {
          auth: {
            enabled: true,
          },
        },
      }),
    })
    cleanup()

    expect(html).toContain('class="sign-in"')
    expect(html).toContain('data-menu-runtime')
    expect(html).toContain('aria-label="Account menu"')
    expect(html).toContain('data-icon="lucide:log-in"')
    expect(html).toContain('data-icon="tabler:user-filled"')
    expect(html).toContain('href="/signin/"')
    expect(html).toContain('href="/signup/"')
    expect(html).toContain('href="/account/"')
    expect(html).toContain('href="/settings/"')
    expect(html).toContain('href="/signout/"')
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

    expect(html).toContain('class="sign-in__avatar"')
    expect(html).toContain('src="/me.png"')
    expect(html).toContain('alt="Ada Lovelace"')
    expect(html).toContain('href="/billing/"')
    expect(html).not.toContain('href="/settings/"')
  })

  it('renders nothing when site auth is disabled or unavailable', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineIconComponents(getSvgIcon),
      ...defineSignInComponents(),
    }
    const disabledHtml = renderApp(`<SignIn />`, {
      components,
      context: createTestContext(),
    })
    const noContextHtml = renderApp(`<SignIn />`, {
      components,
      context: {} as never,
    })
    cleanup()

    expect(disabledHtml).not.toContain('class="sign-in"')
    expect(noContextHtml).not.toContain('class="sign-in"')
  })

  it('hides sign up when site auth disables registration', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(`<SignIn />`, {
      components: {
        ...defineButtonComponents(),
        ...defineIconComponents(getSvgIcon),
        ...defineSignInComponents(),
      },
      context: createTestContext({
        site: {
          auth: {
            enabled: true,
            signUp: false,
          },
        },
      }),
    })
    cleanup()

    expect(html).toContain('href="/signin/"')
    expect(html).not.toContain('href="/signup/"')
    expect(html).toContain('href="/account/"')
  })
})

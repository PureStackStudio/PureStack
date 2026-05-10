import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineFlexComponents } from '../flex/flex'
import { defineIconComponents } from '../icon/icon'
import { definePanelComponents } from '../panel/panel'
import { defineSignInComponents } from './signIn'

const getSvgIcon = (name: string) => `<svg data-icon="${name}"></svg>`

describe('SignIn rendering', () => {
  it('renders a circular icon trigger with default account links', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(`<SignIn />`, {
      components: {
        ...defineButtonComponents(),
        ...defineFlexComponents(),
        ...defineIconComponents(getSvgIcon),
        ...definePanelComponents(),
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

    expect(html).toContain('class="sign-in position-relative"')
    expect(html).toContain('data-menu-runtime')
    expect(html).toContain('aria-label="Account menu"')
    expect(html).toContain('class="panel tone-text')
    expect(html).toContain('tone-fill-surface')
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
          ...defineFlexComponents(),
          ...defineIconComponents(getSvgIcon),
          ...definePanelComponents(),
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

    expect(html).toContain('class="sign-in__avatar w-full h-full rounded-pill"')
    expect(html).toContain('src="/me.png"')
    expect(html).toContain('alt="Ada Lovelace"')
    expect(html).toContain('href="/billing/"')
    expect(html).not.toContain('href="/settings/"')
  })

  it('renders nothing when site auth is disabled or unavailable', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineIconComponents(getSvgIcon),
      ...definePanelComponents(),
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
        ...defineFlexComponents(),
        ...defineIconComponents(getSvgIcon),
        ...definePanelComponents(),
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

  it('passes tone, variant, and variant mode to the panel', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(
      `<SignIn tone="accent" variant="surfaceAlt" variantMode="stateless" />`,
      {
        components: {
          ...defineButtonComponents(),
          ...defineFlexComponents(),
          ...defineIconComponents(getSvgIcon),
          ...definePanelComponents(),
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

    expect(html).toContain('tone--accent')
    expect(html).toContain('tone-fill-surface-alt')
    expect(html).toContain('tone-border-surface-alt')
    expect(html).toContain('tone-text-surface-alt')
  })
})

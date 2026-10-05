import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { defineComponents } from '../defineComponents'
import { createTestContext } from '../test/testContext'

async function render(template: string, enabled: boolean) {
  const cleanup = ensureDomGlobals()
  try {
    return await renderApp(template, {
      components: defineComponents((name) => `<svg data-icon="${name}"></svg>`),
      context: createTestContext({
        site: {
          auth: { enabled, signUp: enabled },
          pagefind: { enabled },
        },
        outline: [
          { id: 'default-heading', title: 'Default heading', depth: 2 },
        ],
      }),
    })
  } finally {
    cleanup()
  }
}

describe('site component configuration overrides', () => {
  for (const component of ['TopBar', 'NavMenu']) {
    it(`${component} defaults to site search and accepts explicit true and false`, async () => {
      expect(await render(`<${component}/>`, true)).toContain('name="q"')
      expect(await render(`<${component}/>`, false)).not.toContain('name="q"')
      expect(
        await render(`<${component} :search="false"/>`, true),
      ).not.toContain('name="q"')
      expect(await render(`<${component} :search="true"/>`, false)).toContain(
        'name="q"',
      )
    })

    it(`${component} can show an account independently of site authentication`, async () => {
      const html = await render(
        `<${component} :signInEnabled="true" :signInSignedIn="false"/>`,
        false,
      )
      expect(html).toContain('data-menu-runtime')
      expect(html).toContain('data-signed-in="false"')
      expect(
        await render(`<${component} :signInEnabled="false"/>`, true),
      ).not.toContain('data-menu-runtime')
    })
  }

  it('SignIn overrides auth and sign-up without changing another instance', async () => {
    const html = await render(
      '<SignIn :enabled="true" :signUp="true" :signedIn="true"/><SignIn/>',
      false,
    )
    expect((html.match(/data-menu-runtime/g) ?? []).length).toBe(1)
    expect(html).toContain('href="/signup/"')
    expect(html).toContain('data-signed-in="true"')
    expect(
      await render('<SignIn :signUp="false" :signedIn="false"/>', true),
    ).not.toContain('href="/signup/"')
    expect(await render('<SignIn :enabled="false"/>', true)).not.toContain(
      'data-menu-runtime',
    )
    expect(await render('<SignIn/>', true)).not.toContain('data-signed-in')
  })

  it('PageToc uses the page outline by default and accepts custom and empty outlines', async () => {
    expect(await render('<PageToc/>', false)).toContain(
      'href="#default-heading"',
    )
    const html = await render(
      `<PageToc :outline="[{id:'custom',title:'Custom',depth:2}]"/>`,
      false,
    )
    expect(html).toContain('href="#custom"')
    expect(html).not.toContain('Default heading')
    const empty = await render('<PageToc :outline="[]"/>', false)
    expect(empty).toContain('No sections yet.')
    expect(empty).not.toContain('Default heading')
  })
})

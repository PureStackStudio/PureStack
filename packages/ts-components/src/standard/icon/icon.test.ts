import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from './icon'

describe('Icon rendering', () => {
  it('renders svg content by icon name', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = await renderApp(`<Icon name="iconoir:code" />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="icon"')
    expect(html).toContain('<svg')
    expect(html).not.toContain('style="')
  })

  it('passes accessibility attributes through to the icon root', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = await renderApp(
      `<Icon name="iconoir:pin" role="img" aria-label="Pinned" aria-hidden="false" />`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Pinned"')
    expect(html).toMatch(/<span class="icon"[^>]*aria-hidden="false"/)
  })

  it('renders nothing when icon name is missing', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = await renderApp(`<Icon />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).not.toContain('class="icon"')
  })

  it('renders framed icons through IconFrame', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = await renderApp(
      `<IconFrame name="iconoir:check" tone="success" variant="surface" class="icon-frame--lg" role="img" aria-label="Complete" />`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="icon-frame')
    expect(html).toContain('icon-frame--lg')
    expect(html).toContain('tone-fill-surface')
    expect(html).toContain('tone-border-surface')
    expect(html).toContain('tone-text-surface')
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Complete"')
    expect(html).toContain('class="icon"')
    expect(html).toContain('<svg')
  })

  it('renders no frame when IconFrame has no icon name', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = await renderApp(`<IconFrame />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).not.toContain('icon-frame')
    expect(html).not.toContain('class="icon"')
  })
})

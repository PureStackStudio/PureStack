import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from './icon'

describe('Icon rendering', () => {
  it('renders svg content by icon name', () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = renderApp(`<Icon name="iconoir:code" />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="icon"')
    expect(html).toContain('<svg')
    expect(html).not.toContain('style="')
    expect(html).toContain('aria-hidden="true"')
  })

  it('applies accessible label', () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = renderApp(`<Icon name="iconoir:pin" aria-label="Pinned" />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Pinned"')
    expect(html).not.toMatch(/<span class="icon"[^>]*aria-hidden="true"/)
  })

  it('renders nothing when icon name is missing', () => {
    const cleanup = ensureDomGlobals()
    const components = defineIconComponents(getSvgIcon)
    const html = renderApp(`<Icon />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).not.toContain('class="icon"')
  })
})

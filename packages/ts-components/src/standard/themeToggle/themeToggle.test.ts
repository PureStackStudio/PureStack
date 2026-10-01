import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineThemeToggleComponents } from './themeToggle'

describe('ThemeToggle rendering', () => {
  it('renders one labelled toggle button the theme runtime can bind', () => {
    const cleanup = ensureDomGlobals()
    const html = renderApp(`<ThemeToggle/>`, {
      components: {
        ...defineIconComponents((name) => `<svg data-icon="${name}"></svg>`),
        ...defineThemeToggleComponents(),
      },
      context: createTestContext(),
    })
    cleanup()

    expect(html).toMatch(/<button[^>]*class="theme-toggle"/)
    expect(html).toContain('type="button"')
    expect(html).toContain('aria-label="Dark theme"')
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('data-theme-toggle')
    expect(html).toContain('theme-toggle__glyph--light')
    expect(html).toContain('theme-toggle__glyph--dark')
    expect(html).toContain('data-icon="lucide:sun"')
    expect(html).toContain('data-icon="lucide:moon"')
  })
})

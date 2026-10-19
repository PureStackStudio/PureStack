import { beforeEach, describe, expect, it } from 'vitest'

import { getThemeClass, styleBuilder } from './styles'

describe('styleBuilder', () => {
  beforeEach(() => {
    styleBuilder.reset()
  })

  it('renders theme styles in a scope block', async () => {
    styleBuilder.select('.btn', 'dark').color('red')

    const css = await styleBuilder.render('dark')

    expect(css).toContain('@scope (html[data-theme="dark"], .theme--dark)')
    expect(css).toContain(':where(:scope) {')
    expect(css).toContain('--ps-accent:')
    expect(css).toContain('.btn {')
    expect(css).not.toContain('html[data-theme="dark"] .btn')
  })

  it('keeps document root selectors on the document root', async () => {
    styleBuilder.select('html', 'light').fontSize('10px')
    styleBuilder.select(':root', 'light').lineHeight('1.5')

    const css = await styleBuilder.render('light')

    expect(css).toContain('@scope (html[data-theme="light"], .theme--light)')
    expect(css).toContain(':scope:root {')
    expect(css).toContain('font-size: 10px;')
    expect(css).toContain('line-height: 1.5;')
    expect(css).not.toMatch(/(^|[\s}])html \{/)
  })

  it('names the class that renders a region in a theme', () => {
    expect(getThemeClass('Dark')).toBe('theme--dark')
  })

  it.each([true, false])(
    'renders named keyframes in theme styles (pretty %s)',
    async (pretty) => {
      for (const theme of ['light', 'dark']) {
        const name = `notice-fade-${theme}`
        const frames = styleBuilder.get(theme).keyframes(name)
        frames.select('from').opacity('0')
        frames.select('to').opacity('1')
        styleBuilder
          .select('.notice', theme)
          .animation(`${name} 160ms ease-out`)
        styleBuilder
          .select('.notice', theme)
          .media('prefers-reduced-motion: reduce')
          .animation('none !important')
      }

      for (const [theme, other] of [
        ['light', 'dark'],
        ['dark', 'light'],
      ]) {
        const css = (await styleBuilder.render(theme, pretty)).replace(
          /\s+/g,
          ' ',
        )
        expect(css).toContain(
          `@scope (html[data-theme="${theme}"], .theme--${theme}) {`,
        )
        expect(css).toContain(
          `@keyframes notice-fade-${theme} { from { opacity: 0; } to { opacity: 1; } }`,
        )
        expect(css).toContain(`animation: notice-fade-${theme} 160ms ease-out;`)
        expect(css).toMatch(
          /@media\s*\(prefers-reduced-motion: reduce\) \{ \.notice \{ animation: none !important; \} \}/,
        )
        expect(css).not.toContain(`notice-fade-${other}`)
      }

      styleBuilder.reset()
      expect(await styleBuilder.render('light', pretty)).not.toContain(
        '@keyframes',
      )
    },
  )
})

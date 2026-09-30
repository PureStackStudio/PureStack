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
})

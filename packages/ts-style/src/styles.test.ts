import { beforeEach, describe, expect, it } from 'vitest'

import { styleBuilder } from './styles'

describe('styleBuilder', () => {
  beforeEach(() => {
    styleBuilder.reset()
  })

  it('renders theme styles in a scope block', async () => {
    styleBuilder.select('.btn', 'dark').color('red')

    const css = await styleBuilder.render('dark')

    expect(css).toContain('@scope (html[data-theme="dark"])')
    expect(css).toContain(':scope {')
    expect(css).toContain('--ps-accent:')
    expect(css).toContain('.btn {')
    expect(css).not.toContain('html[data-theme="dark"] .btn')
  })

  it('maps document root selectors to scope root styles', async () => {
    styleBuilder.select('html', 'light').fontSize('10px')
    styleBuilder.select(':root', 'light').lineHeight('1.5')

    const css = await styleBuilder.render('light')

    expect(css).toContain('@scope (html[data-theme="light"])')
    expect(css).toContain('font-size: 10px;')
    expect(css).toContain('line-height: 1.5;')
    expect(css).not.toContain('html {')
    expect(css).not.toContain(':root {')
  })
})

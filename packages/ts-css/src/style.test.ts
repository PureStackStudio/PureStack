import { describe, expect, it } from 'vitest'

import { css } from '.'
import { Style } from './style'

describe('Style', () => {
  it('assigns incremental ids and default selector', () => {
    const s1 = css()
    const id1 = s1.id
    const s2 = css()
    const s3 = css()
    expect(s2.id).toBe(id1 + 1)
    expect(s3.id).toBe(id1 + 2)
    expect(s1.selector).toBe('')
  })

  it('sets CSS property and is chainable', () => {
    const s = css()
    const ret = s.color('red')
    expect(ret).toBe(s)
    expect(s.props.get('color')).toBe('red')
  })

  it('sets raw property and is chainable', () => {
    const s = css()
    const ret = s.raw('foo-bar', 'baz')
    expect(ret).toBe(s)
    expect(s.props.get('foo-bar')).toBe('baz')
  })

  it('uses properties from another Style instance', () => {
    const a = css().color('blue').zoom('normal')
    const b = css()
    b.use(a)
    expect(b.props.get('color')).toBe('blue')
    expect(b.props.get('zoom')).toBe('normal')
  })

  it('creates and retrieves child selectors', () => {
    const s = css()
    const child1 = s.select('div')
    const child2 = s.select('div')
    expect(child1).toBe(child2)
    expect(child1.selector).toBe('div')
  })

  it('handles media query children correctly', async () => {
    const s = css().select('.red')
    s.media('max-width: 600px').color('red')
    expect(await s.toPrettyCSS()).toBe(`@media (max-width: 600px) {
  .red {
    color: red;
  }
}
`)
    s.media('max-width: 700px').color('red')
    expect(await s.toPrettyCSS()).toBe(`@media (max-width: 600px) {
  .red {
    color: red;
  }
}

@media (max-width: 700px) {
  .red {
    color: red;
  }
}
`)
  })

  it('sets zoom property and is chainable', () => {
    const s = css()
    const ret = s.zoom('normal')
    expect(ret).toBe(s)
    expect(s.props.get('zoom')).toBe('normal')
  })

  it(':where selector', async () => {
    const s = css()
    s.select(':where(#a, .bar, .foo)').color('red')
    expect(await s.toPrettyCSS()).toBe(`:where(#a, .bar, .foo) {
  color: red;
}
`)
  })

  it('toString outputs CSS rules', () => {
    const s = new Style('div').color('red').css({
      color: 'green',
    })
    const cssText = s.toCSS()
    expect(cssText).toContain('div')
    expect(cssText).toContain('color: green;')
    expect(cssText).not.toContain('red')
  })
})

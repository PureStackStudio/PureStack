import { describe, expect, it } from 'vitest'

import { Style } from './style'

describe('Style', () => {
  it('assigns incremental ids and default selector', () => {
    const s1 = new Style()
    const id1 = s1.id
    const s2 = new Style()
    const s3 = new Style()
    expect(s2.id).toBe(id1 + 1)
    expect(s3.id).toBe(id1 + 2)
    expect(s1.selector).toBe('')
  })

  it('sets CSS property and is chainable', () => {
    const s = new Style()
    const ret = s.color('red')
    expect(ret).toBe(s)
    expect(s.props.get('color')).toBe('red')
  })

  it('sets raw property and is chainable', () => {
    const s = new Style()
    const ret = s.raw('foo-bar', 'baz')
    expect(ret).toBe(s)
    expect(s.props.get('foo-bar')).toBe('baz')
  })

  it('uses properties from another Style instance', () => {
    const a = new Style().color('blue').zoom('normal')
    const b = new Style()
    b.use(a)
    expect(b.props.get('color')).toBe('blue')
    expect(b.props.get('zoom')).toBe('normal')
  })

  it('creates and retrieves child selectors', () => {
    const s = new Style()
    const child1 = s.select('div')
    const child2 = s.select('div')
    expect(child1).toBe(child2)
    expect(child1.selector).toBe('div')
  })

  it('handles media query children correctly', async () => {
    const s = new Style().select('.red')
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
    const s = new Style()
    const ret = s.zoom('normal')
    expect(ret).toBe(s)
    expect(s.props.get('zoom')).toBe('normal')
  })

  it(':where selector', async () => {
    const s = new Style()
    s.select(':where(#a, .bar, .foo)').color('red')
    expect(await s.toPrettyCSS()).toBe(`:where(#a, .bar, .foo) {
  color: red;
}
`)
  })

  it('toString outputs CSS rules', () => {
    const s = new Style('div').color('green')
    const cssText = s.toCSS()
    expect(cssText).toContain('div')
    expect(cssText).toContain('color: green;')
  })
})

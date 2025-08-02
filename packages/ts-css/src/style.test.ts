import { describe, expect, it } from 'vitest'

import { s } from './s'
import { Style } from './style'

describe('Style', () => {
  it('assigns incremental ids and default selector', () => {
    const s1 = s()
    const id1 = s1.id
    const s2 = s()
    const s3 = s()
    expect(s2.id).toBe(id1 + 1)
    expect(s3.id).toBe(id1 + 2)
    expect(s1.selector).toBe('')
  })

  it('sets CSS property and is chainable', () => {
    const st = s()
    const ret = st.color('red')
    expect(ret).toBe(st)
    expect(st.props.get('color')).toBe('red')
  })

  it('sets raw property and is chainable', () => {
    const st = s()
    const ret = st.css({ 'foo-bar': 'baz' })
    expect(ret).toBe(st)
    expect(st.props.get('foo-bar')).toBe('baz')
  })

  it('uses properties from another Style instance', () => {
    const a = s().color('blue').zoom('normal')
    const b = s()
    b.use(a)
    expect(b.props.get('color')).toBe('blue')
    expect(b.props.get('zoom')).toBe('normal')
  })

  it('creates and retrieves child selectors', () => {
    const st = s()
    const child1 = st.select('div')
    const child2 = st.select('div')
    expect(child1).toBe(child2)
    expect(child1.selector).toBe('div')
  })

  it('handles media query children correctly', async () => {
    const st = s().select('.red')
    st.media('max-width: 600px').color('red')
    expect(await st.toPrettyCSS()).toBe(`@media (max-width: 600px) {
  .red {
    color: red;
  }
}
`)
    st.media('max-width: 700px').color('red')
    expect(await st.toPrettyCSS()).toBe(`@media (max-width: 600px) {
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
    const st = s()
    const ret = st.zoom('normal')
    expect(ret).toBe(st)
    expect(st.props.get('zoom')).toBe('normal')
  })

  it(':where selector', async () => {
    const st = s()
    st.select(':where(#a, .bar, .foo)').color('red')
    expect(await st.toPrettyCSS()).toBe(`:where(#a, .bar, .foo) {
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

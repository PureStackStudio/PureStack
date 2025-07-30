import { beforeEach, describe, expect, it } from 'vitest'

import { Style } from './style'

describe('Style', () => {
  beforeEach(() => {
    // Reset the static ID counter before each test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(Style as any).nextId = 1
  })

  it('assigns incremental ids and default selector', () => {
    const s1 = new Style()
    const s2 = new Style()
    expect(s1.id).toBe(1)
    expect(s2.id).toBe(2)
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

  it('handles media query children correctly', () => {
    const s = new Style('abc')
    const mediaChild = s.media('max-width: 600px').color('red').toString()
    expect(mediaChild).toBe('@media(max-width: 600px)')
    const mediaChild2 = s.media('max-width: 600px').color('red').toString()
    expect(mediaChild2).toBe(mediaChild)
  })

  it('sets zoom property and is chainable', () => {
    const s = new Style()
    const ret = s.zoom('normal')
    expect(ret).toBe(s)
    expect(s.props.get('zoom')).toBe('normal')
  })

  it('toString outputs CSS rules', () => {
    const s = new Style('div').color('green')
    const cssText = s.toString()
    expect(cssText).toContain('div')
    expect(cssText).toContain('color: green;')
  })
})

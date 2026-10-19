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

  it('builds motion paths and frame declarations with fluent properties', async () => {
    const root = s()
    const packet = root
      .select('.packet')
      .offsetPath("path('M0 0L100 100')")
      .offsetRotate('auto')
      .transformBox('fill-box')
      .animation('travel 8s linear infinite')
    const frame = root.keyframes('travel').select('to')
    const before = root.revision

    expect(frame.offsetDistance('$travel, 100%')).toBe(frame)
    expect(root.revision).toBeGreaterThan(before)
    const after = root.revision
    frame.offsetDistance('$travel, 100%')
    expect(root.revision).toBe(after)
    expect(packet.offsetAnchor('center')).toBe(packet)
    expect(await root.toPrettyCSS()).toBe(`.packet {
  offset-path: path("M0 0L100 100");
  offset-rotate: auto;
  transform-box: fill-box;
  animation: travel 8s linear infinite;
  offset-anchor: center;
}

@keyframes travel {
  to {
    offset-distance: var(--travel, 100%);
  }
}
`)
  })

  it('composes modern layout, logical, scroll, and typography properties', async () => {
    const root = s('.card')
      .aspectRatio('16 / 9')
      .containerType('inline-size')
      .marginBlock('1rem 2rem')
      .paddingInline('$gutter')
      .rowGap('1rem')
      .scrollbarGutter('stable both-edges')
      .textWrap('balance')
      .fontVariationSettings('"wght" 650')
      .css({ scrollPaddingBlockStart: '4rem', textUnderlineOffset: '.2em' })

    expect(await root.toPrettyCSS()).toBe(`.card {
  aspect-ratio: 16 / 9;
  container-type: inline-size;
  margin-block: 1rem 2rem;
  padding-inline: var(--gutter);
  row-gap: 1rem;
  scrollbar-gutter: stable both-edges;
  text-wrap: balance;
  font-variation-settings: "wght" 650;
  scroll-padding-block-start: 4rem;
  text-underline-offset: 0.2em;
}
`)
  })

  it('keeps hand-added setters and existing numeric and string values after generation', () => {
    const root = s('.existing')
      .placeItems('center')
      .inset('0')
      .scrollMarginTop('4rem')
      .appearance('none')
      .accentColor('$accent')
      .breakInside('avoid')
      .lineClamp('3')
      .whiteSpace('pre-wrap')
      .opacity('.5')
      .zIndex('auto')
      .flexGrow(1)
      .webkitAppearance('none')
      .motionOffset('20%')

    expect(Object.fromEntries(root.props)).toEqual({
      'place-items': 'center',
      inset: '0',
      'scroll-margin-top': '4rem',
      appearance: 'none',
      'accent-color': 'var(--accent)',
      'break-inside': 'avoid',
      'line-clamp': '3',
      'white-space': 'pre-wrap',
      opacity: '.5',
      'z-index': 'auto',
      'flex-grow': 1,
      '-webkit-appearance': 'none',
      'motion-offset': '20%',
    })
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

  it('creates scope grouping rules', async () => {
    const st = s().scope('html[data-theme="dark"]')
    st.select(':scope').color('black')
    st.select('.btn').color('white')

    expect(await st.toPrettyCSS()).toBe(`@scope (html[data-theme="dark"]) {
  :scope {
    color: black;
  }

  .btn {
    color: white;
  }
}
`)
  })

  it('keeps media rules inside scope blocks', async () => {
    const st = s().scope('.shell')
    st.select('.btn').media('min-width: 40rem').display('block')
    st.media('min-width: 60rem').select('.panel').display('grid')

    expect(await st.toPrettyCSS()).toBe(`@scope (.shell) {
  @media (min-width: 40rem) {
    .btn {
      display: block;
    }
  }

  @media (min-width: 60rem) {
    .panel {
      display: grid;
    }
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

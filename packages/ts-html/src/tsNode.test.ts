import { describe, expect, it } from 'vitest'

import { h } from './tsNode'

describe('TSNode', () => {
  describe('toHtml', () => {
    it('renders an empty tag', () => {
      expect(h('div').toHtml()).toBe('<div></div>')
    })

    it('renders void tags as self-closing', () => {
      expect(h('img').attr({ src: 'foo.png' }).toHtml()).toBe(
        '<img src="foo.png"/>',
      )
    })

    it('escapes special characters in text', () => {
      const text = '<&>"\''
      const escaped = '&lt;&amp;&gt;"\''
      expect(h('p').children(h('').text(text)).toHtml()).toBe(
        `<p>${escaped}</p>`,
      )
    })

    it('renders raw HTML inside wrapper', () => {
      expect(h('div').raw('<span>raw</span>').toHtml()).toBe(
        '<div><span>raw</span></div>',
      )
    })

    it('merges multiple attributes correctly', () => {
      const node = h('a')
        .attr({ href: 'url' })
        .attrGlobal({ title: 'title' })
        .attr({ 'data-test': 'value' })

      expect(node.toHtml()).toBe(
        '<a href="url" title="title" data-test="value"></a>',
      )
    })

    it('supports aria, global, and event attributes', () => {
      const node = h('button')
        .attrAria({ 'aria-label': 'Label' })
        .attrGlobal({ class: 'btn' })
        .attrEvents({ onclick: 'handle()' })
        .children(h('').text('Click'))

      expect(node.toHtml()).toBe(
        '<button aria-label="Label" class="btn" onclick="handle()">Click</button>',
      )
    })

    it('renders nested children correctly', () => {
      const htmlStr = h('ul')
        .children(
          h('li').children(h('').text('one')),
          h('li').children(h('').text('two')),
        )
        .toHtml()

      expect(htmlStr).toBe('<ul><li>one</li><li>two</li></ul>')
    })

    it('supports fragments (empty tag)', () => {
      expect(h('').raw('fragment').toHtml()).toBe('fragment')
    })

    it('sets id attribute correctly via id()', () => {
      expect(h('div').id('my-id').toHtml()).toBe('<div id="my-id"></div>')
    })

    it('sets class attribute correctly via class()', () => {
      expect(h('span').class('one', 'two', 'three').toHtml()).toBe(
        '<span class="one two three"></span>',
      )
    })
  })

  describe('toPrettyHtml', () => {
    it('formats HTML with indentation', async () => {
      const pretty = await h('div')
        .children(h('div').children(h('').raw('x')))
        .toPrettyHtml({ printWidth: 5 })

      expect(pretty).toBe('<div>\n  <div>\n    x\n  </div>\n</div>\n')
    })
  })

  describe('immutability and chaining', () => {
    it('preserves original node when adding attributes', () => {
      const base = h('input')
      const derived = base.attr({ type: 'text' })

      expect(base.toHtml()).toBe('<input/>')
      expect(derived.toHtml()).toBe('<input type="text"/>')
    })

    it('merges attributes with correct override order', () => {
      const node = h('button')
        .attrAria({ 'aria-label': 'first' })
        .attr({ 'aria-label': 'second' })

      expect(node.toHtml()).toBe('<button aria-label="second"></button>')
    })
  })

  describe('children accumulation', () => {
    it('accumulates children across multiple children() calls', () => {
      const childA = h('').text('A')
      const childB = h('').text('B')
      const div = h('div').children(childA).children(childB)

      expect(div.toHtml()).toBe('<div>AB</div>')
    })
  })

  describe('attribute escaping', () => {
    it('escapes attribute values', () => {
      expect(h('img').attr({ alt: '<&>' }).toHtml()).toBe(
        '<img alt="&lt;&amp;&gt;"/>',
      )
    })
  })

  describe('raw and text in fragments', () => {
    it('renders raw and text siblings correctly', () => {
      const div = h('div').children(
        h('').raw('<b>Hi</b>'),
        h('').text(' there'),
      )
      expect(div.toHtml()).toBe('<div><b>Hi</b> there</div>')
    })

    it('renders text via fragment children', () => {
      const frag = h('').children(h('').text('frag text'))
      expect(frag.toHtml()).toBe('frag text')
    })
  })

  describe('raw override behavior', () => {
    it('child raw overrides entire serialization, dropping children, attributes', () => {
      const result = h('div')
        .children(
          h('span').text('a'),
          h('')
            .raw('raw')
            .attr({ class: 'aa' })
            .children(h('img').attr({ src: 'abc' })),
          h('span').text('b'),
        )
        .toHtml()
      expect(result).toBe('<div><span>a</span>raw<span>b</span></div>')
    })
  })

  describe('complex nesting', () => {
    it('renders nested mixed raw and text correctly', () => {
      const nested = h('section')
        .attrGlobal({ id: 'main' })
        .children(
          h('article').children(
            h('').raw('Content'),
            h('footer')
              .children(h('').text('Footer text'))
              .children(h('UserRow')),
          ),
        )
      expect(nested.toHtml()).toBe(
        '<section id="main"><article>Content<footer>Footer text<UserRow></UserRow></footer></article></section>',
      )
    })
  })
})

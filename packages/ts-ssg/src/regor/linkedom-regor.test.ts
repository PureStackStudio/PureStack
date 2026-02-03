import { parseHTML } from 'linkedom'
import { createComponent, html } from 'regor'
import { describe, expect, it } from 'vitest'

import { registerDomGlobals } from './registerDomGlobals'

type DomEnv = {
  document: Document
  window: Window
}

function withDom<T>(markup: string, run: (env: DomEnv) => T): T {
  const { document, window } = parseHTML(markup)
  const cleanup = registerDomGlobals(window, document)
  try {
    return run({ document, window })
  } finally {
    cleanup()
  }
}

function mountTemplate(template: string, document: Document): HTMLElement {
  const component = createComponent(html`${template}`)
  const wrapper = document.createElement('div')
  wrapper.appendChild(component.template.cloneNode(true))
  return wrapper
}

describe('regor + linkedom compatibility', () => {
  it('interpolates simple text nodes into r-text bindings', () =>
    withDom('<html><body></body></html>', ({ document }) => {
      const wrapper = mountTemplate(
        '<div><span>{{ title }}</span></div>',
        document,
      )
      const span = wrapper.querySelector('span')
      expect(span?.getAttribute('r-text')).toBe(' title ')
      expect(span?.textContent).toBe('')
    }))

  it('interpolates inside template.content', () =>
    withDom('<html><body></body></html>', ({ document }) => {
      const wrapper = mountTemplate(
        '<div><template #content><span>{{ item.title }}</span></template></div>',
        document,
      )
      const template = wrapper.querySelector('template')
      const contentSpan = template?.content?.firstChild as HTMLElement | null
      expect(contentSpan?.getAttribute('r-text')).toBe(' item.title ')
      expect(contentSpan?.textContent).toBe('')
    }),
  )

  it('handles mixed text + interpolation', () =>
    withDom('<html><body></body></html>', ({ document }) => {
      const wrapper = mountTemplate('<p>Hello {{ name }}!</p>', document)
      const span = wrapper.querySelector('p span')
      expect(span?.getAttribute('r-text')).toBe(' name ')
      expect(wrapper.querySelector('p')?.textContent).toBe('Hello !')
    }))

  it('skips interpolation under r-pre', () =>
    withDom('<html><body></body></html>', ({ document }) => {
      const wrapper = mountTemplate(
        '<div r-pre><span>{{ skip }}</span></div>',
        document,
      )
      const span = wrapper.querySelector('span')
      expect(span?.getAttribute('r-text')).toBeNull()
      expect(span?.textContent).toBe('{{ skip }}')
    }))

  it('supports nested templates inside template.content', () =>
    withDom('<html><body></body></html>', ({ document }) => {
      const wrapper = mountTemplate(
        '<template><template><span>{{ x }}</span></template></template>',
        document,
      )
      const outer = wrapper.querySelector('template')
      const inner = outer?.content?.querySelector?.(
        'template',
      ) as HTMLTemplateElement | null
      const span = inner?.content?.firstChild as HTMLElement | null
      expect(span?.getAttribute('r-text')).toBe(' x ')
    }))

  it('exposes template.content in linkedom', () =>
    withDom(
      '<html><body><template><span>x</span></template></body></html>',
      ({ document }) => {
        const template = document.querySelector('template')
        expect(template?.content).toBeTruthy()
        expect(template?.content?.childNodes.length).toBe(1)
      },
    ))
})

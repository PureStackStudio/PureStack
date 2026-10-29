import { runInDom } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { createSearchViewport } from './pagefindSearchViewport'

const markup =
  '<html><body><div class="site-search"><input><div data-results></div></div></body></html>'

function fixture(document: Document) {
  const root = document.querySelector<HTMLElement>('.site-search')
  const input = document.querySelector<HTMLElement>('input')
  const output = document.querySelector<HTMLElement>('[data-results]')
  if (!root || !input || !output) throw new Error('Missing search fixture')
  const listeners = new Map<string, EventListener>()
  const viewport = {
    height: 844,
    width: 390,
    offsetTop: 0,
    offsetLeft: 0,
    addEventListener: (name: string, listener: EventListener) =>
      listeners.set(name, listener),
  }
  const media = { narrow: true, touch: false }
  Object.assign(window, {
    visualViewport: viewport,
    innerHeight: 844,
    innerWidth: 390,
    matchMedia: (query: string) => ({
      get matches() {
        return query === '(pointer: coarse)' ? media.touch : media.narrow
      },
    }),
    addEventListener: (name: string, listener: EventListener) =>
      listeners.set(name, listener),
  })
  const field = { top: 270, bottom: 314 }
  Object.assign(input, { getBoundingClientRect: () => field })
  let popoverOpen = false
  Object.assign(root, {
    matches: () => popoverOpen,
    showPopover: () => {
      popoverOpen = true
    },
    hidePopover: () => {
      popoverOpen = false
    },
  })
  const panel = createSearchViewport(root, output)
  const bounds = () => ({
    top: Number.parseFloat(
      root.style.getPropertyValue('--ps-search-results-top'),
    ),
    height: Number.parseFloat(
      root.style.getPropertyValue('--ps-search-results-height'),
    ),
  })
  return {
    root,
    output,
    viewport,
    media,
    field,
    listeners,
    panel,
    bounds,
    isOpen: () => popoverOpen,
  }
}

describe('search results visible viewport', () => {
  it.each([20, 150, 270, 1200])(
    'uses the full visible height regardless of the field position (%spx)',
    (top) => {
      runInDom(markup, (document) => {
        const f = fixture(document)
        Object.assign(f.viewport, { height: 360, offsetTop: 100 })
        Object.assign(f.field, { top, bottom: top + 44 })
        f.panel.update()
        expect(f.bounds()).toEqual({ top: 108, height: 344 })
        expect(f.root.getAttribute('popover')).toBe('manual')
        expect(f.output.hasAttribute('popover')).toBe(false)
        expect(f.isOpen()).toBe(true)
      })
    },
  )

  it('repositions on keyboard resize and viewport scrolling', () => {
    runInDom(markup, (document) => {
      const f = fixture(document)
      f.panel.update()
      expect(f.bounds()).toEqual({ top: 8, height: 828 })
      f.viewport.height = 360
      f.listeners.get('resize')?.(new Event('resize'))
      expect(f.bounds()).toEqual({ top: 8, height: 344 })
      f.viewport.offsetTop = 200
      f.listeners.get('scroll')?.(new Event('scroll'))
      expect(f.bounds()).toEqual({ top: 208, height: 344 })
    })
  })

  it.each([280, 600])(
    'uses the visible height in a touch viewport (%spx)',
    (height) => {
      runInDom(markup, (document) => {
        const f = fixture(document)
        Object.assign(f.media, { narrow: false, touch: true })
        Object.assign(f.viewport, { height, width: 844 })
        f.panel.update()
        expect(f.root.hasAttribute('data-search-compact')).toBe(true)
        expect(f.bounds()).toEqual({ top: 8, height: height - 16 })
      })
    },
  )

  it('returns the field to its original layout on dismissal or desktop resize', () => {
    runInDom(markup, (document) => {
      const f = fixture(document)
      f.panel.update()
      f.panel.hide()
      expect(f.isOpen()).toBe(false)
      expect(f.root.hasAttribute('popover')).toBe(false)
      expect(f.root.hasAttribute('data-search-compact')).toBe(false)
      f.panel.update()
      f.media.narrow = false
      f.listeners.get('resize')?.(new Event('resize'))
      expect(f.isOpen()).toBe(false)
      expect(f.root.hasAttribute('data-search-compact')).toBe(false)
      expect(f.root.hasAttribute('popover')).toBe(false)
    })
  })

  it('keeps the field positioned while new results are loading', () => {
    runInDom(markup, (document) => {
      const f = fixture(document)
      f.panel.update()
      f.output.hidden = true
      f.viewport.height = 360
      f.listeners.get('resize')?.(new Event('resize'))
      expect(f.isOpen()).toBe(true)
      expect(f.bounds()).toEqual({ top: 8, height: 344 })
    })
  })

  it('does not reopen a dismissed search when the keyboard closes', () => {
    runInDom(markup, (document) => {
      const f = fixture(document)
      f.viewport.height = 360
      f.panel.update()
      f.panel.hide()
      f.output.hidden = true
      f.viewport.height = 844
      f.listeners.get('resize')?.(new Event('resize'))
      expect(f.isOpen()).toBe(false)
    })
  })
})

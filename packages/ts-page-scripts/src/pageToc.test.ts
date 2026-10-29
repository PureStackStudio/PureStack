import type { PageOutlineItem } from '@purestack/ts-common'
import { runInDom } from '@purestack/ts-minidom'
import { describe, expect, it, vi } from 'vitest'
import { collectPageOutline } from '../../ts-common/src/pageOutline'
import { renderPageTocContent } from './pageTocContent'

describe('page toc refresh', () => {
  it.each([true, false])(
    'rebuilds an initially empty toc and its tracking (observer: %s)',
    async (useObserver) => {
      await vi.resetModules()
      await runInDom(
        '<html><body class="template-doc--has-toc"><main class="doc-main"><article class="doc-content"></article></main><aside class="doc-toc"><nav class="page-toc" data-page-toc-auto><button class="page-toc__panel-toggle"><span class="page-toc__panel-toggle-label"></span></button><div class="page-toc__content"></div></nav></aside><nav class="page-toc" id="explicit"><div class="page-toc__content">Manual</div></nav></body></html>',
        async (document) => {
          const callback = {
            current: (_entries: IntersectionObserverEntry[]) => {},
          }
          const observe = vi.fn()
          const disconnect = vi.fn()
          const Observer = vi.fn(
            class {
              observe = observe
              disconnect = disconnect
              constructor(
                onEntries: (entries: IntersectionObserverEntry[]) => void,
              ) {
                callback.current = onEntries
              }
            },
          )
          const addEventListener = vi.fn()
          Object.assign(document, {
            getElementById: (id: string) =>
              document.querySelector(`[id="${CSS.escape(id)}"]`),
          })
          Object.assign(window, {
            matchMedia: () => ({ matches: false, addEventListener: vi.fn() }),
            location: { hash: '' },
            addEventListener,
            requestAnimationFrame: (run: FrameRequestCallback) => {
              run(0)
              return 1
            },
            setTimeout: () => 1,
            clearTimeout: vi.fn(),
          })
          if (useObserver) {
            vi.stubGlobal('IntersectionObserver', Observer)
            Object.assign(window, { IntersectionObserver: Observer })
          }
          try {
            await import('./pageToc')
            const api = window.tsSsgPageToc
            if (!api) throw new Error('TOC runtime did not initialize')
            if (useObserver) api.hydrate()
            else api.refresh()
            const content = requireElement('.doc-content')
            const setContent = (html: string) => {
              content.innerHTML = html
              for (const heading of content.querySelectorAll('h1, h2, h3')) {
                Object.assign(heading, {
                  getBoundingClientRect: () => ({ top: 200 }),
                })
              }
              api.refresh()
            }
            setContent(
              '<h1>App</h1><h2>First section</h2><h3>Details</h3><div data-toc-ignore><h2>Example</h2></div><h2 id="stable">Second section</h2>',
            )
            const toc = requireElement('.page-toc')
            expect(
              [...toc.querySelectorAll('a')].map((link) =>
                link.getAttribute('href'),
              ),
            ).toEqual(['#first-section', '#details', '#stable'])
            expect(content.querySelector('h2')?.id).toBe('first-section')
            expect(
              toc.querySelector('[aria-current="location"]')?.textContent,
            ).toBe('First section')
            requireElement('#first-section').textContent = 'First renamed'
            api.refresh()
            expect(
              toc.querySelector('a[href="#first-section"]')?.textContent,
            ).toBe('First renamed')
            const secondLabel = requireElement(
              'a[href="#stable"] .btn__label',
              toc,
            )
            secondLabel.dispatchEvent(
              new MouseEvent('click', { bubbles: true }),
            )
            expect(
              toc.querySelector('[aria-current="location"]')?.textContent,
            ).toBe('Second section')
            expect(
              document
                .getElementById('stable')
                ?.classList.contains('page-toc__target'),
            ).toBe(true)

            setContent(
              '<h2 id="stable">Renamed section</h2><h2>New section</h2>',
            )
            window.location.hash = '#unrelated-target'
            api.refresh()
            expect(
              [...toc.querySelectorAll('a')].map((link) => link.textContent),
            ).toEqual(['Renamed section', 'New section'])
            expect(
              toc.querySelector('[aria-current="location"]')?.textContent,
            ).toBe('Renamed section')
            expect(toc.querySelector('a[href="#first-section"]')).toBeNull()
            expect(
              addEventListener.mock.calls.filter(
                ([name]) => name === 'hashchange',
              ),
            ).toHaveLength(1)
            if (useObserver) {
              expect(Observer).toHaveBeenCalledTimes(1)
              expect(disconnect).toHaveBeenCalledTimes(5)
              const newHeading = requireElement('#new-section')
              expect(observe).toHaveBeenLastCalledWith(newHeading)
              callback.current([
                {
                  target: newHeading,
                  isIntersecting: true,
                } as unknown as IntersectionObserverEntry,
              ])
              expect(
                toc.querySelector('[aria-current="location"]')?.textContent,
              ).toBe('New section')
            } else {
              expect(
                addEventListener.mock.calls.filter(
                  ([name]) => name === 'scroll',
                ),
              ).toHaveLength(1)
            }
            setContent('')
            expect(toc.querySelectorAll('a')).toHaveLength(0)
            expect(toc.textContent).toContain('No sections yet.')
            expect(requireElement('#explicit').textContent).toBe('Manual')
          } finally {
            vi.unstubAllGlobals()
          }
        },
      )
    },
  )

  it('nests h1-h3 without attaching skipped headings to stale ancestors', () => {
    runInDom('<html><body></body></html>', (document) => {
      document.body.innerHTML =
        '<h1>First Page</h1><h2>Old Section</h2><h1>Second Page</h1><h3>Skipped Section</h3><dialog><h2>Modal title</h2></dialog>'
      expect(collectPageOutline(document.body)).toEqual([
        {
          id: 'first-page',
          title: 'First Page',
          depth: 1,
          children: [{ id: 'old-section', title: 'Old Section', depth: 2 }],
        },
        {
          id: 'second-page',
          title: 'Second Page',
          depth: 1,
          children: [
            { id: 'skipped-section', title: 'Skipped Section', depth: 3 },
          ],
        },
      ])
    })
  })

  it('escapes outline labels and IDs while retaining deeper children', () => {
    runInDom('<html><body></body></html>', (document) => {
      const title = '<img src=x onerror="alert(1)"> & details'
      document.body.innerHTML = renderPageTocContent([
        {
          id: 'a"&b',
          title,
          depth: 2,
          children: [
            {
              id: 'child',
              title: 'Child',
              depth: 3,
              children: [{ id: 'nested', title: 'Nested', depth: 3 }],
            },
          ],
        },
      ])
      expect(document.querySelector('img')).toBeNull()
      expect(document.querySelector('a')?.textContent).toBe(title)
      expect(document.querySelector('a')?.getAttribute('href')).toBe('#a"&b')
      expect(document.querySelectorAll('a')).toHaveLength(3)
    })
  })

  it('renders only heading levels and tolerates malformed library input', () => {
    runInDom('<html><body></body></html>', (document) => {
      const outline = [
        {
          id: 1,
          title: null,
          depth: '2" onmouseover="alert(1)',
          children: 'not a list',
        },
        { id: 'deep', title: 'Deep', depth: 9 },
      ] as unknown as PageOutlineItem[]
      document.body.innerHTML = renderPageTocContent(outline)
      const items = document.querySelectorAll('li')
      expect(items[0]?.getAttribute('onmouseover')).toBeNull()
      expect(items[0]?.className).toBe('page-toc__item page-toc__item--h2')
      expect(items[1]?.className).toBe('page-toc__item page-toc__item--h2')
      expect(document.querySelector('a')?.getAttribute('href')).toBe('#1')
      expect(document.querySelector('a')?.textContent).toBe('null')
    })
  })
})

describe('page toc Escape handling', () => {
  it.each([
    {
      layout: 'docked',
      narrow: false,
      collapsed: false,
      prevented: false,
      staysOpen: true,
    },
    {
      layout: 'mobile drawer',
      narrow: true,
      collapsed: false,
      prevented: false,
      staysOpen: false,
    },
    {
      layout: 'collapsed desktop drawer',
      narrow: false,
      collapsed: true,
      prevented: false,
      staysOpen: false,
    },
    {
      layout: 'mobile drawer with Escape handled by search',
      narrow: true,
      collapsed: false,
      prevented: true,
      staysOpen: true,
    },
    {
      layout: 'collapsed desktop drawer with Escape handled by search',
      narrow: false,
      collapsed: true,
      prevented: true,
      staysOpen: true,
    },
  ])('$layout', async ({ narrow, collapsed, prevented, staysOpen }) => {
    vi.resetModules()
    await runInDom(
      '<html><body class="template-doc--has-toc"><main class="doc-main"><article class="doc-content"></article></main><aside class="doc-toc"><nav class="page-toc"><button class="page-toc__panel-toggle"><span class="page-toc__panel-toggle-label"></span></button><div class="page-toc__content"></div></nav></aside></body></html>',
      async (document) => {
        document.body.classList.toggle('template-doc--toc-collapsed', collapsed)
        const listeners = new Map<string, EventListener>()
        Object.assign(window, {
          matchMedia: (query: string) => ({
            matches: narrow && query === '(max-width: 1320px)',
            addEventListener: vi.fn(),
          }),
          location: { hash: '' },
          addEventListener: (name: string, listener: EventListener) => {
            listeners.set(name, listener)
          },
        })
        await import('./pageToc')
        window.tsSsgPageToc?.hydrate()
        const shell = requireElement('.doc-toc')
        const toggle = requireElement('.page-toc__panel-toggle')
        if (narrow || collapsed) toggle.dispatchEvent(new Event('click'))
        expect(shell.classList.contains('doc-toc--open')).toBe(true)
        const event = Object.assign(
          new Event('keydown', { cancelable: true }),
          { key: 'Escape' },
        )
        if (prevented) event.preventDefault()
        const onKeydown = listeners.get('keydown')
        expect(onKeydown).toBeDefined()
        onKeydown?.(event)
        expect(shell.classList.contains('doc-toc--open')).toBe(staysOpen)
        expect(toggle.getAttribute('aria-expanded')).toBe(String(staysOpen))
        expect(document.body.classList.contains('doc-toc-open')).toBe(
          staysOpen && (narrow || collapsed),
        )
      },
    )
  })
})

describe('page toc drawer resizing', () => {
  it.each([
    { layout: 'responsive drawer', narrow: true, collapsed: false },
    { layout: 'collapsed desktop drawer', narrow: false, collapsed: true },
  ])(
    'preserves the resized width when reopening the $layout',
    async ({ narrow, collapsed }) => {
      vi.resetModules()
      await runInDom(
        '<html><body class="template-doc--has-toc"><main class="doc-main"><article class="doc-content"></article></main><aside class="doc-toc"><nav class="page-toc"><button class="page-toc__panel-toggle"><span class="page-toc__panel-toggle-label"></span></button><div class="page-toc__content"></div></nav></aside></body></html>',
        async (document) => {
          document.body.classList.toggle(
            'template-doc--toc-collapsed',
            collapsed,
          )
          const listeners = new Map<string, EventListener>()
          Object.assign(window, {
            matchMedia: (query: string) => ({
              matches: narrow && query === '(max-width: 1320px)',
              addEventListener: vi.fn(),
            }),
            location: { hash: '' },
            addEventListener: (name: string, listener: EventListener) =>
              listeners.set(name, listener),
            removeEventListener: (name: string) => listeners.delete(name),
          })
          vi.stubGlobal('getComputedStyle', () => ({
            getPropertyValue: () => '',
            marginInlineStart: '0px',
          }))
          try {
            await import('./pageToc')
            window.tsSsgPageToc?.hydrate()
            const shell = requireElement('.doc-toc')
            const toc = requireElement('.page-toc')
            const toggle = requireElement('.page-toc__panel-toggle')
            let left = 960
            Object.assign(shell, {
              getBoundingClientRect: () => ({ right: 1200 }),
            })
            Object.assign(toc, { getBoundingClientRect: () => ({ left }) })
            const mouse = (type: string, clientX: number) =>
              Object.assign(
                new MouseEvent(type, {
                  button: 0,
                  bubbles: true,
                  cancelable: true,
                }),
                { clientX },
              )
            toggle.dispatchEvent(new Event('click'))
            toc.dispatchEvent(mouse('mousedown', left))
            expect(document.body.classList.contains('resizing')).toBe(true)
            listeners.get('mousemove')?.(mouse('mousemove', 780))
            listeners.get('mouseup')?.(mouse('mouseup', 780))
            const widthProperty = '--ps-doc-layout-user-toc-width'
            const widthStorage = 'ts-ssg:doc-layout:toc-width'
            expect(document.body.style.getPropertyValue(widthProperty)).toBe(
              '420px',
            )
            expect(localStorage.getItem(widthStorage)).toBe('420')
            listeners.get('keydown')?.(
              Object.assign(new Event('keydown'), { key: 'Escape' }),
            )
            expect(shell.classList.contains('doc-toc--open')).toBe(false)
            left = 1174
            // A real button click includes down/up events within the old resize hit area.
            toggle.dispatchEvent(mouse('mousemove', 1187))
            expect(document.body.classList.contains('col-resize')).toBe(false)
            toggle.dispatchEvent(mouse('mousedown', 1187))
            listeners.get('mouseup')?.(mouse('mouseup', 1187))
            toggle.dispatchEvent(new Event('click'))
            expect(shell.classList.contains('doc-toc--open')).toBe(true)
            expect(document.body.classList.contains('resizing')).toBe(false)
            expect(document.body.style.getPropertyValue(widthProperty)).toBe(
              '420px',
            )
            expect(localStorage.getItem(widthStorage)).toBe('420')
          } finally {
            vi.unstubAllGlobals()
          }
        },
      )
    },
  )
})

function requireElement(selector: string, root: ParentNode = document) {
  const element = root.querySelector(selector)
  if (!element) throw new Error(`Missing fixture element ${selector}`)
  return element
}

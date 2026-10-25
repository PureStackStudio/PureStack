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
})

function requireElement(selector: string, root: ParentNode = document) {
  const element = root.querySelector(selector)
  if (!element) throw new Error(`Missing fixture element ${selector}`)
  return element
}

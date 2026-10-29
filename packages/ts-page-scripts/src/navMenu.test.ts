import { runInDom } from '@purestack/ts-minidom'
import { describe, expect, it, vi } from 'vitest'

describe('navigation resizing', () => {
  it.each([false, true])(
    'preserves width when collapsed is %s',
    async (collapsed) => {
      vi.resetModules()
      await runInDom(
        '<html><body class="template-doc--has-nav"><aside class="doc-sidebar"><nav class="nav__menu"><button data-nav-menu-toggle>Navigation</button></nav></aside></body></html>',
        async (document) => {
          if (collapsed) localStorage.setItem('ts-ssg:nav-collapsed:root', '1')
          const listeners = new Map<string, EventListener>()
          Object.assign(document, { getElementById: () => null })
          Object.assign(window, {
            matchMedia: () => ({ matches: true, addEventListener: vi.fn() }),
            addEventListener: (name: string, listener: EventListener) =>
              listeners.set(name, listener),
            removeEventListener: (name: string) => listeners.delete(name),
          })
          vi.stubGlobal('getComputedStyle', () => ({
            getPropertyValue: () => '',
            marginInlineEnd: '0px',
          }))
          vi.stubGlobal('requestAnimationFrame', (run: FrameRequestCallback) =>
            run(0),
          )
          try {
            await import('./navMenu')
            window.tsSsgNavMenu?.hydrate()
            const sidebar = document.querySelector('.doc-sidebar')
            const menu = document.querySelector('.nav__menu')
            const toggle = document.querySelector('[data-nav-menu-toggle]')
            if (!sidebar || !menu || !toggle)
              throw new Error('Missing navigation fixture')
            let right = 260
            Object.assign(sidebar, {
              getBoundingClientRect: () => ({ left: 0 }),
            })
            Object.assign(menu, { getBoundingClientRect: () => ({ right }) })
            const mouse = (type: string, clientX: number) =>
              Object.assign(
                new MouseEvent(type, {
                  button: 0,
                  bubbles: true,
                  cancelable: true,
                }),
                { clientX },
              )
            if (collapsed) toggle.dispatchEvent(new Event('click'))
            menu.dispatchEvent(mouse('mousedown', right))
            expect(document.body.classList.contains('resizing')).toBe(true)
            listeners.get('mousemove')?.(mouse('mousemove', 420))
            listeners.get('mouseup')?.(mouse('mouseup', 420))
            const widthProperty = '--ps-doc-layout-user-nav-width'
            const widthStorage = 'ts-ssg:doc-layout:nav-width'
            expect(document.body.style.getPropertyValue(widthProperty)).toBe(
              '420px',
            )
            expect(localStorage.getItem(widthStorage)).toBe('420')
            if (collapsed) {
              listeners.get('keydown')?.(
                Object.assign(new Event('keydown'), { key: 'Escape' }),
              )
              expect(sidebar.classList.contains('doc-sidebar--open')).toBe(
                false,
              )
              right = 26
              toggle.dispatchEvent(mouse('mousemove', 13))
              expect(document.body.classList.contains('col-resize')).toBe(false)
              toggle.dispatchEvent(mouse('mousedown', 13))
              listeners.get('mouseup')?.(mouse('mouseup', 13))
              toggle.dispatchEvent(new Event('click'))
              expect(sidebar.classList.contains('doc-sidebar--open')).toBe(true)
            }
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

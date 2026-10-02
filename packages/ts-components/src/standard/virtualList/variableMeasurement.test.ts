import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { type Component, createApp, defineComponent, observe, ref } from 'regor'
import { describe, expect, it, vi } from 'vitest'
import { createTestContext } from '../../test/testContext'
import {
  defineVariableVirtualTableComponents,
  type VariableVirtualTable,
} from './variableVirtualTable'
import {
  defineVirtualListComponents,
  type VariableVirtualList,
} from './virtualList'

describe('variable row measurements', () => {
  it.each(['list', 'table'] as const)(
    'keeps %s rows observed after the window updates',
    async (kind) => {
      const cleanupGlobals = ensureDomGlobals()
      const cleanupDom = createDom(
        '<html><body><div id="app"></div></body></html>',
      )
      const frames = new Map<number, FrameRequestCallback>()
      let frameId = 0
      const observers: TestResizeObserver[] = []
      const heights = new Map<Element, number>()
      class TestResizeObserver {
        readonly elements = new Set<Element>()
        constructor(readonly callback: ResizeObserverCallback) {
          observers.push(this)
        }
        observe(element: Element) {
          this.elements.add(element)
          element.getBoundingClientRect = () =>
            ({ height: heights.get(element) ?? 40 }) as DOMRect
        }
        unobserve(element: Element) {
          this.elements.delete(element)
        }
        disconnect() {
          this.elements.clear()
        }
        resize(element: Element) {
          if (this.elements.has(element))
            this.callback(
              [{ target: element } as ResizeObserverEntry],
              this as unknown as ResizeObserver,
            )
        }
      }
      vi.stubGlobal('ResizeObserver', TestResizeObserver)
      vi.stubGlobal(
        'requestAnimationFrame',
        (callback: FrameRequestCallback) => {
          frames.set(++frameId, callback)
          return frameId
        },
      )
      vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
      const flush = async () => {
        for (let pass = 0; pass < 20; pass++) {
          await Promise.resolve()
          if (!frames.size) return
          const pending = [...frames.values()]
          frames.clear()
          for (const callback of pending) callback(0)
        }
        throw new Error('Measurement did not settle')
      }
      let context: VariableVirtualList | VariableVirtualTable | undefined
      const recordContext = <
        T extends VariableVirtualList | VariableVirtualTable,
      >(
        candidate: Component<T>,
      ) => {
        const original = candidate.context
        candidate.context = (head) => {
          const resolved = original(head)
          context = resolved
          return resolved
        }
        return candidate
      }
      const component =
        kind === 'list'
          ? recordContext(defineVirtualListComponents().variableVirtualList)
          : recordContext(
              defineVariableVirtualTableComponents().variableVirtualTable,
            )
      const viewportHeight = ref(160)
      let rowMounts = 0
      const app = createApp(
        {
          components: {
            Measured: component,
            Row: defineComponent(
              kind === 'list'
                ? '<div>{{ item.label }}</div>'
                : '<tr><td>{{ item.label }}</td></tr>',
              {
                props: ['item', 'index'],
                context: (head) => {
                  rowMounts++
                  return head.props
                },
              },
            ),
          },
          tsSsgContext: createTestContext(),
          items: Array.from({ length: 50000 }, (_, index) => ({
            label: `Row ${index}`,
          })),
          viewportHeight,
        },
        {
          selector: '#app',
          template:
            '<Measured :items="items" :height="viewportHeight" estimateHeight="80" overscan="2" rowComponent="Row" />',
        },
      )
      try {
        await flush()
        const beforeRows = context?.visibleRows?.() ?? []
        expect(beforeRows.length).toBeGreaterThan(0)
        const firstRow = beforeRows[0]
        const elements = observers.flatMap((observer) => [...observer.elements])
        expect(elements.length).toBeGreaterThan(0)
        if (kind === 'table')
          expect(elements.every((element) => element.tagName === 'TR')).toBe(
            true,
          )
        const total = () =>
          kind === 'list'
            ? Number.parseFloat(
                (context as VariableVirtualList).spacerStyle?.().height ?? '0',
              )
            : Number.parseFloat(
                (context as VariableVirtualTable).bottomSpacerStyle?.()
                  .height ?? '0',
              )
        const initial = total()
        expect(initial).toBeLessThan(50000 * 80)
        viewportHeight(200)
        await flush()
        expect(context?.visibleRows?.()[0]).toBe(firstRow)
        const element = elements[0]
        const beforeResize = total()
        heights.set(element, 120)
        for (const observer of observers) observer.resize(element)
        await flush()
        expect(total()).toBeGreaterThan(beforeResize)
        expect(context?.visibleRows?.()[0]).toBe(firstRow)
        const emittedSizes: number[] = []
        const visibleRows = context?.visibleRows
        const viewport = context?.viewportElement?.()
        if (!visibleRows || !viewport)
          throw new Error('Virtual rows and viewport were not initialized')
        const stop = observe(visibleRows, (rows) => {
          emittedSizes.push(rows.length)
        })
        for (const position of [1000000, 1900000, 200000, 0]) {
          const beforeJump = rowMounts
          viewport.scrollTop = position
          viewport.dispatchEvent(new Event('scroll'))
          expect(visibleRows().length).toBeLessThan(20)
          expect(rowMounts - beforeJump).toBeLessThan(40)
        }
        stop()
        expect(emittedSizes.length).toBeGreaterThan(0)
        // Checking only the final window misses thousands of transient mounts.
        expect(Math.max(...emittedSizes)).toBeLessThan(20)
        app.unbind()
        expect(
          observers.every((observer) => observer.elements.size === 0),
        ).toBe(true)
      } finally {
        app.unbind()
        vi.unstubAllGlobals()
        cleanupDom()
        cleanupGlobals()
      }
    },
  )
})

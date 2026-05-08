import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineDoughnutChartComponents } from './doughnutChart'

describe('DoughnutChart rendering', () => {
  it('renders an svg doughnut from segment data', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineDoughnutChartComponents(),
        tsSsgContext: createTestContext(),
        segments: [
          { label: 'Product', value: 64, color: '#18a999' },
          { label: 'Services', value: 36, color: '#f4a261' },
        ],
      },
      {
        selector: '#app',
        template: `<DoughnutChart
          title="Revenue mix"
          centerLabel="Total"
          valueSuffix="%"
          :segments="segments"
        />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('<svg')
      expect(html).toContain('class="doughnut-chart"')
      expect(html).toContain('<title>Revenue mix</title>')
      expect(html).toContain('fill="#18a999"')
      expect(html).toContain('Product: 64%')
      expect(html).toContain('Services: 36%')
      expect(html).toContain('<mask')
      expect(html).toContain('mask="url(#doughnut-chart-mask-')
      expect(html).toContain('fill="black"')
      expect(html).toContain('class="doughnut-chart__separator"')
      expect(html).toContain('A 46.35 46.35 0 0')
      expect(html).toContain('A 32 32 0 0')
      expect(html).toContain('<animate')
      expect(html).toContain('<animatetransform')
      expect(html).toContain('Total')
      expect(html).toContain('100%')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('renders an empty state when every segment is zero', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineDoughnutChartComponents(),
        tsSsgContext: createTestContext(),
        segments: [{ label: 'None', value: 0 }],
      },
      {
        selector: '#app',
        template: `<DoughnutChart emptyLabel="Waiting" :segments="segments" />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('Waiting')
      expect(html).not.toContain('None: 0')
      expect(html).not.toContain('<mask')
      expect(html).not.toContain('doughnut-chart__separator')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('shrinks separators around tiny segments', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineDoughnutChartComponents(),
        tsSsgContext: createTestContext(),
        segments: [
          { label: 'Large', value: 99 },
          { label: 'Tiny', value: 1 },
        ],
      },
      {
        selector: '#app',
        template: `<DoughnutChart gap="8" :segments="segments" />`,
      },
    )

    try {
      const separator = document.querySelector<SVGPathElement>(
        '.doughnut-chart__separator',
      )
      const path = separator?.getAttribute('d') || ''
      const points = path.match(
        /M ([\d.-]+) ([\d.-]+) A [^ ]+ [^ ]+ 0 0 0 ([\d.-]+) ([\d.-]+)/,
      )

      expect(points).toBeTruthy()
      if (!points) return

      const width = Math.hypot(
        Number(points[1]) - Number(points[3]),
        Number(points[2]) - Number(points[4]),
      )
      expect(width).toBeLessThan(2)
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('can render without the initial animation', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineDoughnutChartComponents(),
        tsSsgContext: createTestContext(),
        segments: [
          { label: 'Product', value: 60 },
          { label: 'Services', value: 40 },
        ],
      },
      {
        selector: '#app',
        template: `<DoughnutChart animated="false" :segments="segments" />`,
      },
    )

    try {
      const html = document.body.innerHTML

      expect(html).not.toContain('<animate')
      expect(html).not.toContain('<animatetransform')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

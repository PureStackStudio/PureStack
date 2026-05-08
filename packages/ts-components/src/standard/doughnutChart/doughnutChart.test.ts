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
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

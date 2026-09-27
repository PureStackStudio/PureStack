import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineLineChartComponents } from './lineChart'

describe('LineChart rendering', () => {
  it.each([
    [-32, -8, 12, 28],
    [-32, -18, -4, -12],
    [0, 0, 0, 0],
  ])('keeps category labels below values %j', (...values) => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineLineChartComponents(),
        tsSsgContext: createTestContext(),
        series: [
          {
            points: values.map((value, index) => ({
              label: `Day ${index + 1}`,
              value,
            })),
          },
        ],
      },
      {
        selector: '#app',
        template:
          '<LineChart :series="series" :showValues="true" :animated="false" />',
      },
    )
    try {
      const values = Array.from(document.querySelectorAll('.line-chart__value'))
      const labels = Array.from(document.querySelectorAll('.line-chart__label'))
      expect(values).toHaveLength(4)
      for (const [index, value] of values.entries()) {
        expect(
          Number(labels[index].getAttribute('y')) -
            Number(value.getAttribute('y')),
        ).toBeGreaterThan(6)
      }
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('renders an svg line chart from series data', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineLineChartComponents(),
        tsSsgContext: createTestContext(),
        series: [
          {
            label: 'Core',
            color: '#18a999',
            points: [
              { label: 'Jan', value: 18 },
              { label: 'Feb', value: 24 },
              { label: 'Mar', value: 31 },
            ],
          },
          {
            label: 'Edge',
            color: '#f4a261',
            points: [
              { label: 'Jan', value: 12 },
              { label: 'Feb', value: 20 },
              { label: 'Mar', value: 28 },
            ],
          },
        ],
      },
      {
        selector: '#app',
        template: `<LineChart
          title="Runtime trend"
          description="Runtime adoption over time."
          valueSuffix="%"
          showArea="true"
          showValues="true"
          :series="series"
        />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('<svg')
      expect(html).toContain('class="line-chart"')
      expect(html).toContain('<title>Runtime trend</title>')
      expect(html).toContain('<desc>Runtime adoption over time.</desc>')
      expect(html).toContain('stroke="#18a999"')
      expect(html).toContain('fill="#18a999"')
      expect(html).toContain('Core, Jan: 18%')
      expect(html).toContain('class="line-chart__area"')
      expect(html).toContain('class="line-chart__grid-line"')
      expect(html).toContain('<animate')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('renders an empty state without chart marks', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineLineChartComponents(),
        tsSsgContext: createTestContext(),
        series: [
          { label: 'Invalid', points: [{ label: 'Now', value: 'n/a' }] },
        ],
      },
      {
        selector: '#app',
        template: `<LineChart emptyLabel="Waiting" :series="series" />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('Waiting')
      expect(html).not.toContain('Invalid')
      expect(html).not.toContain('line-chart__line')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('can render without labels, axis, points, values, area, or animation', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineLineChartComponents(),
        tsSsgContext: createTestContext(),
        series: [
          {
            label: 'Core',
            points: [
              { label: 'Jan', value: 18 },
              { label: 'Feb', value: 24 },
            ],
          },
        ],
      },
      {
        selector: '#app',
        template: `<LineChart
          showLabels="false"
          showAxis="false"
          showPoints="false"
          showValues="false"
          showArea="false"
          animated="false"
          curve="linear"
          :series="series"
        />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('class="line-chart__line"')
      expect(html).toContain('L 94')
      expect(html).not.toContain('line-chart__label')
      expect(html).not.toContain('line-chart__grid-line')
      expect(html).not.toContain('line-chart__point')
      expect(html).not.toContain('line-chart__value')
      expect(html).not.toContain('line-chart__area')
      expect(html).not.toContain('<animate')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

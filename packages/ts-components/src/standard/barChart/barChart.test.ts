import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { createApp } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineBarChartComponents } from './barChart'

describe('BarChart rendering', () => {
  it('renders an svg bar chart from item data', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineBarChartComponents(),
        tsSsgContext: createTestContext(),
        items: [
          { label: 'Core', value: 42, color: '#18a999' },
          { label: 'Edge', value: 28, color: '#f4a261' },
          { label: 'Legacy', value: -12, color: '#ef4444' },
        ],
      },
      {
        selector: '#app',
        template: `<BarChart
          title="Runtime adoption"
          description="Adoption across runtime tiers."
          valueSuffix="%"
          :items="items"
        />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('<svg')
      expect(html).toContain('class="bar-chart"')
      expect(html).toContain('<title>Runtime adoption</title>')
      expect(html).toContain('<desc>Adoption across runtime tiers.</desc>')
      expect(html).toContain('fill="#18a999"')
      expect(html).toContain('Core: 42%')
      expect(html).toContain('Legacy: -12%')
      expect(html).toContain('class="bar-chart__zero-line"')
      expect(html).toContain('class="bar-chart__grid-line"')
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
        components: defineBarChartComponents(),
        tsSsgContext: createTestContext(),
        items: [{ label: 'Invalid', value: Number.NaN }],
      },
      {
        selector: '#app',
        template: `<BarChart emptyLabel="Waiting" :items="items" />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).toContain('Waiting')
      expect(html).not.toContain('Invalid')
      expect(html).not.toContain('bar-chart__bar')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })

  it('can render without labels, axis, values, or animation', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const app = createApp(
      {
        components: defineBarChartComponents(),
        tsSsgContext: createTestContext(),
        items: [{ label: 'Core', value: 42 }],
      },
      {
        selector: '#app',
        template: `<BarChart
          showLabels="false"
          showValues="false"
          showAxis="false"
          animated="false"
          :items="items"
        />`,
      },
    )

    try {
      const html = document.body.innerHTML
      expect(html).not.toContain('bar-chart__label')
      expect(html).not.toContain('bar-chart__value')
      expect(html).not.toContain('bar-chart__zero-line')
      expect(html).not.toContain('bar-chart__grid-line')
      expect(html).not.toContain('<animate')
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

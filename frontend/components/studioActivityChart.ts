import type { BarChartItem } from '@purestack/ts-components'
import { getThemePaletteVar } from '@purestack/ts-style'
import { defineComponent, html } from 'regor'

export interface StudioActivityChart {
  items: BarChartItem[]
}

const studioActivityChartTemplate = html`<BarChart
  ariaLabel="Example activity across twelve days; illustrative data"
  :items="items"
  :minValue="0"
  :maxValue="100"
  :animated="false"
  :showValues="false"
  :showLabels="false"
  :showAxis="false"
  width="100%"
  height="90"
  preserveAspectRatio="none"
  variant="none"/>`

export function defineStudioActivityChartComponent() {
  return defineComponent<StudioActivityChart>(studioActivityChartTemplate, {
    context: createStudioActivityChart,
  })
}

function createStudioActivityChart(): StudioActivityChart {
  return {
    items: [25, 42, 32, 57, 46, 64, 52, 71, 61, 85, 72, 98].map(
      (value, index) => ({
        label: String(index + 1).padStart(2, '0'),
        value,
        color: getThemePaletteVar(
          index === 11
            ? 'semanticTone.accent.text.default'
            : index % 2 === 0
              ? 'semanticTone.success.surface.rest.border'
              : 'semanticTone.accent.surface.hover.border',
        ),
      }),
    ),
  }
}

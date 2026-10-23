import type { BarChartItem } from '@purestack/ts-components'
import { getThemePaletteVar } from '@purestack/ts-style'
import { defineComponent, html } from 'regor'

export interface ActivityChartPreview {
  items: BarChartItem[]
}

const activityChartPreviewTemplate = html`<BarChart
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

export function defineActivityChartPreviewComponent() {
  return defineComponent<ActivityChartPreview>(activityChartPreviewTemplate, {
    context: createActivityChartPreview,
  })
}

function createActivityChartPreview(): ActivityChartPreview {
  return {
    items: [25, 42, 32, 57, 46, 64, 52, 71, 61, 85, 72, 98].map(
      (value, index) => ({
        label: String(index + 1).padStart(2, '0'),
        value,
        color: getThemePaletteVar(
          index === 11
            ? 'semanticTone.accent.text.default'
            : index % 2 === 0
              ? 'semanticTone.accent.surface.rest.border'
              : 'semanticTone.accent.surface.hover.border',
        ),
      }),
    ),
  }
}

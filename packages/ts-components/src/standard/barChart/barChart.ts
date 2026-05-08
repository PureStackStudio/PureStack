import type { SemanticTone } from '@purestack/ts-style'
import { getThemePaletteVar } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  type RefOrValue,
  svg,
  unref,
} from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'
import { resolveComponentClasses } from '../componentVariant'

export interface BarChartItem {
  label?: RefOrValue<string>
  value?: RefOrValue<number | string>
  color?: RefOrValue<string>
}

export interface ResolvedBarChartItem {
  label: string
  value: number
  formattedValue: string
  color: string
  x: number
  y: number
  width: number
  height: number
  valueLabelX: number
  valueLabelY: number
  valueLabelBaseline: string
  labelX: number
  labelY: number
  roundedTop: number
}

export interface ResolvedBarChartGridLine {
  value: number
  formattedValue: string
  y: number
}

export interface BarChart {
  items?: RefOrValue<Array<RefOrValue<BarChartItem>>>
  title?: RefOrValue<string>
  description?: RefOrValue<string>
  ariaLabel?: RefOrValue<string>
  emptyLabel?: RefOrValue<string>
  valueSuffix?: RefOrValue<string>
  width?: RefOrValue<number | string>
  height?: RefOrValue<number | string>
  minValue?: RefOrValue<number | string>
  maxValue?: RefOrValue<number | string>
  animated?: RefOrValue<boolean | string>
  showValues?: RefOrValue<boolean | string>
  showLabels?: RefOrValue<boolean | string>
  showAxis?: RefOrValue<boolean | string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  classes?: ComputedRef<string>
  resolvedWidth?: ComputedRef<string | number>
  resolvedHeight?: ComputedRef<string | number>
  resolvedAriaLabel?: ComputedRef<string>
  resolvedEmptyLabel?: ComputedRef<string>
  chartItems?: ComputedRef<ResolvedBarChartItem[]>
  gridLines?: ComputedRef<ResolvedBarChartGridLine[]>
  hasItems?: ComputedRef<boolean>
  isAnimated?: ComputedRef<boolean>
  shouldShowValues?: ComputedRef<boolean>
  shouldShowLabels?: ComputedRef<boolean>
  shouldShowAxis?: ComputedRef<boolean>
  zeroLineY?: ComputedRef<number>
}

const VIEWBOX_HEIGHT = 64
const PLOT_X = 8
const PLOT_Y = 6
const PLOT_WIDTH = 86
const PLOT_HEIGHT = 43
const LABEL_Y = 59
const VALUE_LABEL_OFFSET = 2.4
const DEFAULT_CHART_WIDTH = 520
const DEFAULT_CHART_HEIGHT = 320
const DEFAULT_EMPTY_LABEL = 'No data'
const DEFAULT_GRID_LINE_COUNT = 5
const BAR_WIDTH_SHARE = 0.64
const MIN_VISIBLE_BAR_HEIGHT = 0.35

const DEFAULT_BAR_COLORS = [
  getThemePaletteVar('semanticTone.accent.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.feature.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.success.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.info.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.warning.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.secondary.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.danger.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.custom.button.hover.bgcolor'),
]

const barChartTemplate = svg`<svg
  class="bar-chart"
  :class="classes"
  viewBox="0 0 100 64"
  :width="resolvedWidth"
  :height="resolvedHeight"
  role="img"
  :aria-label="resolvedAriaLabel"
>
  <title r-if="title">{{ title }}</title>
  <desc r-if="description">{{ description }}</desc>
  <g class="bar-chart__grid" r-if="hasItems && shouldShowAxis">
    <g r-for="line in gridLines" class="bar-chart__grid-line">
      <line x1="8" x2="94" :y1="line.y" :y2="line.y"/>
      <text x="5.4" :y="line.y">{{ line.formattedValue }}</text>
    </g>
  </g>
  <line
    r-if="hasItems && shouldShowAxis"
    class="bar-chart__zero-line"
    x1="8"
    x2="94"
    :y1="zeroLineY"
    :y2="zeroLineY"/>
  <g class="bar-chart__plot" r-if="hasItems">
    <rect
      r-for="item in chartItems"
      class="bar-chart__bar"
      :x="item.x"
      :y="item.y"
      :width="item.width"
      :height="item.height"
      :rx="item.roundedTop"
      :ry="item.roundedTop"
      :fill="item.color"
      :aria-label="item.label + ': ' + item.formattedValue"
    >
      <title r-text="item.label + ': ' + item.formattedValue"></title>
      <animate
        r-if="isAnimated"
        attributeName="height"
        from="0"
        :to="item.height"
        dur="720ms"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.16 1 0.3 1"
        fill="freeze"/>
      <animate
        r-if="isAnimated"
        attributeName="y"
        :from="zeroLineY"
        :to="item.y"
        dur="720ms"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.16 1 0.3 1"
        fill="freeze"/>
    </rect>
  </g>
  <g class="bar-chart__values" r-if="hasItems && shouldShowValues">
    <text
      r-for="item in chartItems"
      class="bar-chart__value"
      :x="item.valueLabelX"
      :y="item.valueLabelY"
      text-anchor="middle"
      :dominant-baseline="item.valueLabelBaseline"
    >
      {{ item.formattedValue }}
    </text>
  </g>
  <g class="bar-chart__labels" r-if="hasItems && shouldShowLabels">
    <text
      r-for="item in chartItems"
      class="bar-chart__label"
      :x="item.labelX"
      :y="item.labelY"
      text-anchor="middle"
    >
      {{ item.label }}
    </text>
  </g>
  <text
    r-if="!hasItems"
    class="bar-chart__empty"
    x="50"
    y="33"
    text-anchor="middle"
  >
    {{ resolvedEmptyLabel }}
  </text>
</svg>`

function defineBarChartComponent() {
  return defineComponent<BarChart>(barChartTemplate, {
    props: [
      'items',
      'title',
      'description',
      'ariaLabel',
      'emptyLabel',
      'valueSuffix',
      'width',
      'height',
      'minValue',
      'maxValue',
      'animated',
      'showValues',
      'showLabels',
      'showAxis',
      'tone',
      'variant',
      'variantMode',
    ],
    context: (head) => resolveBarChart(head.props),
  })
}

export function defineBarChartComponents() {
  return {
    barChart: defineBarChartComponent(),
  }
}

function resolveBarChart(props: BarChart): BarChart {
  const domain = computed(() => resolveDomain(props))

  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'none',
        defaultVariantMode: 'stateless',
      }),
    ),
    resolvedWidth: computed(() =>
      resolveSize(props.width, DEFAULT_CHART_WIDTH),
    ),
    resolvedHeight: computed(() =>
      resolveSize(props.height, DEFAULT_CHART_HEIGHT),
    ),
    resolvedAriaLabel: computed(() => resolveAriaLabel(props)),
    resolvedEmptyLabel: computed(
      () => resolveText(props.emptyLabel) || DEFAULT_EMPTY_LABEL,
    ),
    chartItems: computed(() => resolveChartItems(props, domain())),
    gridLines: computed(() => resolveGridLines(domain(), props.valueSuffix)),
    hasItems: computed(() => resolveItems(props.items).length > 0),
    isAnimated: computed(() => resolveBoolean(props.animated, true)),
    shouldShowValues: computed(() => resolveBoolean(props.showValues, true)),
    shouldShowLabels: computed(() => resolveBoolean(props.showLabels, true)),
    shouldShowAxis: computed(() => resolveBoolean(props.showAxis, true)),
    zeroLineY: computed(() => valueToY(0, domain())),
  }
}

interface ChartDomain {
  min: number
  max: number
}

function resolveChartItems(
  props: BarChart,
  domain: ChartDomain,
): ResolvedBarChartItem[] {
  const items = resolveItems(props.items)
  if (!items.length) return []

  const laneWidth = PLOT_WIDTH / items.length
  const barWidth = Math.max(1, laneWidth * BAR_WIDTH_SHARE)
  const valueSuffix = resolveText(props.valueSuffix)
  const zeroY = valueToY(0, domain)

  return items.map((item, index) => {
    const valueY = valueToY(item.value, domain)
    const rawHeight = Math.abs(zeroY - valueY)
    const height =
      item.value === 0 ? 0 : Math.max(rawHeight, MIN_VISIBLE_BAR_HEIGHT)
    const isNegative = item.value < 0
    const x = PLOT_X + laneWidth * index + (laneWidth - barWidth) / 2
    const y = isNegative
      ? zeroY
      : Math.min(valueY, zeroY) - (height - rawHeight)
    const valueLabelY = isNegative
      ? Math.min(VIEWBOX_HEIGHT - 2, y + height + VALUE_LABEL_OFFSET)
      : Math.max(2, y - VALUE_LABEL_OFFSET)

    return {
      label: item.label,
      value: item.value,
      formattedValue: formatValue(item.value, valueSuffix),
      color:
        item.color || DEFAULT_BAR_COLORS[index % DEFAULT_BAR_COLORS.length],
      x,
      y,
      width: barWidth,
      height,
      valueLabelX: x + barWidth / 2,
      valueLabelY,
      valueLabelBaseline: isNegative ? 'hanging' : 'auto',
      labelX: x + barWidth / 2,
      labelY: LABEL_Y,
      roundedTop: Math.min(1.4, barWidth / 2, height / 2),
    }
  })
}

interface ResolvedBarChartSourceItem {
  label: string
  value: number
  color: string
}

function resolveItems(items: BarChart['items']): ResolvedBarChartSourceItem[] {
  return (unref(items) || [])
    .map((itemInput, index) => {
      const item = unref(itemInput)
      const value = readNumber(item?.value, Number.NaN)
      return {
        label: resolveText(item?.label) || `Item ${index + 1}`,
        value,
        color: resolveText(item?.color),
      }
    })
    .filter((item) => Number.isFinite(item.value))
}

function resolveDomain(props: BarChart): ChartDomain {
  const values = resolveItems(props.items).map((item) => item.value)
  const fallbackMax = values.length ? Math.max(...values) : 1
  const fallbackMin = values.length ? Math.min(...values) : 0
  let min = Math.min(
    readNumber(props.minValue, Math.min(0, fallbackMin)),
    fallbackMin,
    0,
  )
  let max = Math.max(
    readNumber(props.maxValue, Math.max(0, fallbackMax)),
    fallbackMax,
    0,
  )

  if (min === max) {
    if (min === 0) max = 1
    else if (min > 0) min = 0
    else max = 0
  }

  if (min > max) [min, max] = [max, min]

  return { min, max }
}

function resolveGridLines(
  domain: ChartDomain,
  valueSuffix: BarChart['valueSuffix'],
): ResolvedBarChartGridLine[] {
  const suffix = resolveText(valueSuffix)
  const step = (domain.max - domain.min) / (DEFAULT_GRID_LINE_COUNT - 1)

  return Array.from({ length: DEFAULT_GRID_LINE_COUNT }, (_, index) => {
    const value = domain.max - step * index
    return {
      value,
      formattedValue: formatValue(value, suffix),
      y: valueToY(value, domain),
    }
  })
}

function valueToY(value: number, domain: ChartDomain) {
  const range = domain.max - domain.min
  if (range <= 0) return PLOT_Y + PLOT_HEIGHT
  const ratio = (domain.max - value) / range
  return PLOT_Y + ratio * PLOT_HEIGHT
}

function resolveAriaLabel(props: BarChart) {
  return resolveText(props.ariaLabel) || resolveText(props.title) || 'Bar chart'
}

function resolveSize(
  size: RefOrValue<number | string> | undefined,
  fallback: number,
) {
  const resolved = unref(size)
  if (typeof resolved === 'number' && Number.isFinite(resolved)) {
    return Math.max(1, resolved)
  }
  if (typeof resolved !== 'string') return fallback
  const trimmed = resolved.trim()
  return trimmed || fallback
}

function resolveBoolean(
  value: RefOrValue<boolean | string> | undefined,
  fallback: boolean,
) {
  const resolved = unref(value)
  if (typeof resolved === 'boolean') return resolved
  if (typeof resolved !== 'string') return fallback
  const normalized = resolved.trim().toLowerCase()
  if (!normalized) return fallback
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off'
}

function readNumber(
  value: RefOrValue<number | string> | undefined,
  fallback: number,
) {
  const resolved = unref(value)
  const number =
    typeof resolved === 'number'
      ? resolved
      : Number.parseFloat(String(resolved))
  return Number.isFinite(number) ? number : fallback
}

function resolveText(value?: RefOrValue<string>) {
  const resolved = unref(value)
  return typeof resolved === 'string' ? resolved.trim() : ''
}

function formatValue(value: number, suffix: string) {
  const formatted = Number.isInteger(value) ? String(value) : fmt(value)
  return suffix ? `${formatted}${suffix}` : formatted
}

function fmt(value: number) {
  return Number.parseFloat(value.toFixed(2)).toString()
}

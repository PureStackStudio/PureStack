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
import {
  formatChartNumber,
  formatChartPoint,
  formatChartValue,
  readChartNumber,
  resolveChartBoolean,
  resolveChartSize,
  resolveChartText,
} from '../chart/chartUtils'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'
import { resolveComponentClasses } from '../componentVariant'

export type LineChartCurve = 'linear' | 'smooth'

export interface LineChartPoint {
  label?: RefOrValue<string>
  value?: RefOrValue<number | string>
}

export interface LineChartSeries {
  label?: RefOrValue<string>
  color?: RefOrValue<string>
  points?: RefOrValue<Array<RefOrValue<LineChartPoint>>>
}

export interface ResolvedLineChartPoint {
  label: string
  value: number
  formattedValue: string
  x: number
  y: number
  valueLabelY: number
  valueLabelBaseline: string
}

export interface ResolvedLineChartSeries {
  label: string
  color: string
  path: string
  areaPath: string
  points: ResolvedLineChartPoint[]
}

export interface ResolvedLineChartGridLine {
  value: number
  formattedValue: string
  y: number
}

export interface ResolvedLineChartLabel {
  label: string
  x: number
  y: number
}

export interface LineChart {
  series?: RefOrValue<Array<RefOrValue<LineChartSeries>>>
  title?: RefOrValue<string>
  description?: RefOrValue<string>
  ariaLabel?: RefOrValue<string>
  emptyLabel?: RefOrValue<string>
  valueSuffix?: RefOrValue<string>
  width?: RefOrValue<number | string>
  height?: RefOrValue<number | string>
  minValue?: RefOrValue<number | string>
  maxValue?: RefOrValue<number | string>
  curve?: RefOrValue<LineChartCurve>
  animated?: RefOrValue<boolean | string>
  showArea?: RefOrValue<boolean | string>
  showPoints?: RefOrValue<boolean | string>
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
  chartSeries?: ComputedRef<ResolvedLineChartSeries[]>
  gridLines?: ComputedRef<ResolvedLineChartGridLine[]>
  xLabels?: ComputedRef<ResolvedLineChartLabel[]>
  hasSeries?: ComputedRef<boolean>
  isAnimated?: ComputedRef<boolean>
  shouldShowArea?: ComputedRef<boolean>
  shouldShowPoints?: ComputedRef<boolean>
  shouldShowValues?: ComputedRef<boolean>
  shouldShowLabels?: ComputedRef<boolean>
  shouldShowAxis?: ComputedRef<boolean>
  zeroLineY?: ComputedRef<number>
}

const VIEWBOX_HEIGHT = 58
const PLOT_X = 8
const PLOT_Y = 6
const PLOT_WIDTH = 86
const PLOT_HEIGHT = 43
const LABEL_Y = 53.5
const VALUE_LABEL_OFFSET = 2.6
const DEFAULT_CHART_WIDTH = '100%'
const DEFAULT_CHART_HEIGHT = undefined //auto height
const DEFAULT_EMPTY_LABEL = 'No data'
const DEFAULT_GRID_LINE_COUNT = 5
const MAX_X_LABEL_COUNT = 7

const DEFAULT_SERIES_COLORS = [
  getThemePaletteVar('semanticTone.accent.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.feature.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.success.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.info.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.warning.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.secondary.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.danger.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.custom.button.hover.bgcolor'),
]

const lineChartTemplate = svg`<svg
  class="line-chart"
  :class="classes"
  viewBox="0 0 100 58"
  :width="resolvedWidth"
  :height="resolvedHeight"
  role="img"
  :aria-label="resolvedAriaLabel"
>
  <title r-if="title">{{ title }}</title>
  <desc r-if="description">{{ description }}</desc>
  <g class="line-chart__grid" r-if="hasSeries && shouldShowAxis">
    <g r-for="line in gridLines" class="line-chart__grid-line">
      <line x1="8" x2="94" :y1="line.y" :y2="line.y"/>
      <text x="5.4" :y="line.y">{{ line.formattedValue }}</text>
    </g>
  </g>
  <line
    r-if="hasSeries && shouldShowAxis"
    class="line-chart__zero-line"
    x1="8"
    x2="94"
    :y1="zeroLineY"
    :y2="zeroLineY"/>
  <g class="line-chart__areas" r-if="hasSeries && shouldShowArea">
    <path
      r-for="item in chartSeries"
      class="line-chart__area"
      :d="item.areaPath"
      :fill="item.color"
      :aria-label="item.label"
    >
      <animate
        r-if="isAnimated"
        attributeName="opacity"
        from="0"
        to="1"
        dur="820ms"
        fill="freeze"/>
    </path>
  </g>
  <g class="line-chart__series" r-if="hasSeries">
    <path
      r-for="item in chartSeries"
      class="line-chart__line"
      :d="item.path"
      :stroke="item.color"
      :aria-label="item.label"
    >
      <title r-text="item.label"></title>
      <animate
        r-if="isAnimated"
        attributeName="opacity"
        from="0"
        to="1"
        dur="520ms"
        fill="freeze"/>
    </path>
  </g>
  <g class="line-chart__points" r-if="hasSeries && shouldShowPoints">
    <g r-for="item in chartSeries" class="line-chart__point-series">
      <circle
        r-for="point in item.points"
        class="line-chart__point"
        :cx="point.x"
        :cy="point.y"
        r="0.9"
        :fill="item.color"
        :aria-label="item.label + ', ' + point.label + ': ' + point.formattedValue"
      >
        <title
          r-text="item.label + ', ' + point.label + ': ' + point.formattedValue"
        ></title>
        <animate
          r-if="isAnimated"
          attributeName="r"
          from="0"
          to="0.9"
          dur="520ms"
          fill="freeze"/>
      </circle>
    </g>
  </g>
  <g class="line-chart__values" r-if="hasSeries && shouldShowValues">
    <g r-for="item in chartSeries" class="line-chart__value-series">
      <text
        r-for="point in item.points"
        class="line-chart__value"
        :x="point.x"
        :y="point.valueLabelY"
        text-anchor="middle"
        :dominant-baseline="point.valueLabelBaseline"
      >
        {{ point.formattedValue }}
      </text>
    </g>
  </g>
  <g class="line-chart__labels" r-if="hasSeries && shouldShowLabels">
    <text
      r-for="label in xLabels"
      class="line-chart__label"
      :x="label.x"
      :y="label.y"
      text-anchor="middle"
    >
      {{ label.label }}
    </text>
  </g>
  <text
    r-if="!hasSeries"
    class="line-chart__empty"
    x="50"
    y="30"
    text-anchor="middle"
  >
    {{ resolvedEmptyLabel }}
  </text>
</svg>`

function defineLineChartComponent() {
  return defineComponent<LineChart>(lineChartTemplate, {
    props: [
      'series',
      'title',
      'description',
      'ariaLabel',
      'emptyLabel',
      'valueSuffix',
      'width',
      'height',
      'minValue',
      'maxValue',
      'curve',
      'animated',
      'showArea',
      'showPoints',
      'showValues',
      'showLabels',
      'showAxis',
      'tone',
      'variant',
      'variantMode',
    ],
    context: (head) => resolveLineChart(head.props),
  })
}

export function defineLineChartComponents() {
  return {
    lineChart: defineLineChartComponent(),
  }
}

function resolveLineChart(props: LineChart): LineChart {
  const domain = computed(() => resolveDomain(props))
  const chartSeries = computed(() => resolveChartSeries(props, domain()))

  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'none',
        defaultVariantMode: 'stateless',
      }),
    ),
    resolvedWidth: computed(() =>
      resolveChartSize(props.width, DEFAULT_CHART_WIDTH),
    ),
    resolvedHeight: computed(() =>
      resolveChartSize(props.height, DEFAULT_CHART_HEIGHT),
    ),
    resolvedAriaLabel: computed(() => resolveAriaLabel(props)),
    resolvedEmptyLabel: computed(
      () => resolveChartText(props.emptyLabel) || DEFAULT_EMPTY_LABEL,
    ),
    chartSeries,
    gridLines: computed(() => resolveGridLines(domain(), props.valueSuffix)),
    xLabels: computed(() => resolveXLabels(chartSeries())),
    hasSeries: computed(() => chartSeries().length > 0),
    isAnimated: computed(() => resolveChartBoolean(props.animated, true)),
    shouldShowArea: computed(() => resolveChartBoolean(props.showArea, false)),
    shouldShowPoints: computed(() =>
      resolveChartBoolean(props.showPoints, true),
    ),
    shouldShowValues: computed(() =>
      resolveChartBoolean(props.showValues, false),
    ),
    shouldShowLabels: computed(() =>
      resolveChartBoolean(props.showLabels, true),
    ),
    shouldShowAxis: computed(() => resolveChartBoolean(props.showAxis, true)),
    zeroLineY: computed(() => valueToY(0, domain())),
  }
}

interface ChartDomain {
  min: number
  max: number
}

interface ResolvedLineChartSourceSeries {
  label: string
  color: string
  points: ResolvedLineChartSourcePoint[]
}

interface ResolvedLineChartSourcePoint {
  label: string
  value: number
}

function resolveChartSeries(
  props: LineChart,
  domain: ChartDomain,
): ResolvedLineChartSeries[] {
  const valueSuffix = resolveChartText(props.valueSuffix)
  const curve = resolveCurve(props.curve)
  const zeroY = valueToY(0, domain)

  return resolveSeries(props.series).map((series, index) => {
    const points = series.points.map((point, pointIndex) => {
      const x = pointIndexToX(pointIndex, series.points.length)
      const y = valueToY(point.value, domain)
      const valueLabelY =
        point.value < 0
          ? Math.min(VIEWBOX_HEIGHT - 2, y + VALUE_LABEL_OFFSET)
          : Math.max(2, y - VALUE_LABEL_OFFSET)

      return {
        label: point.label,
        value: point.value,
        formattedValue: formatChartValue(point.value, valueSuffix),
        x,
        y,
        valueLabelY,
        valueLabelBaseline: point.value < 0 ? 'hanging' : 'auto',
      }
    })

    return {
      label: series.label,
      color:
        series.color ||
        DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length],
      path: resolveLinePath(points, curve),
      areaPath: resolveAreaPath(points, zeroY, curve),
      points,
    }
  })
}

function resolveSeries(
  seriesInput: LineChart['series'],
): ResolvedLineChartSourceSeries[] {
  return (unref(seriesInput) || [])
    .map((series, index) => {
      const resolvedSeries = unref(series)
      return {
        label: resolveChartText(resolvedSeries?.label) || `Series ${index + 1}`,
        color: resolveChartText(resolvedSeries?.color),
        points: resolvePoints(resolvedSeries?.points),
      }
    })
    .filter((series) => series.points.length > 0)
}

function resolvePoints(
  pointsInput: LineChartSeries['points'],
): ResolvedLineChartSourcePoint[] {
  return (unref(pointsInput) || [])
    .map((pointInput, index) => {
      const point = unref(pointInput)
      const value = readChartNumber(point?.value, Number.NaN)
      return {
        label: resolveChartText(point?.label) || `Point ${index + 1}`,
        value,
      }
    })
    .filter((point) => Number.isFinite(point.value))
}

function resolveLinePath(
  points: ResolvedLineChartPoint[],
  curve: LineChartCurve,
) {
  if (!points.length) return ''
  if (points.length === 1) return `M ${formatChartPoint(points[0])}`
  if (curve === 'linear') {
    return points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${formatChartPoint(point)}`,
      )
      .join(' ')
  }

  return [
    `M ${formatChartPoint(points[0])}`,
    ...points.slice(1).map((point, index) => {
      const previous = points[index]
      const midpointX = (previous.x + point.x) / 2
      return [
        'C',
        formatChartNumber(midpointX),
        formatChartNumber(previous.y),
        formatChartNumber(midpointX),
        formatChartNumber(point.y),
        formatChartPoint(point),
      ].join(' ')
    }),
  ].join(' ')
}

function resolveAreaPath(
  points: ResolvedLineChartPoint[],
  zeroY: number,
  curve: LineChartCurve,
) {
  if (!points.length) return ''
  const first = points[0]
  const last = points.at(-1) || first
  return [
    `M ${formatChartNumber(first.x)} ${formatChartNumber(zeroY)}`,
    resolveLinePath(points, curve).replace(/^M /, 'L '),
    `L ${formatChartNumber(last.x)} ${formatChartNumber(zeroY)}`,
    'Z',
  ].join(' ')
}

function resolveXLabels(
  series: ResolvedLineChartSeries[],
): ResolvedLineChartLabel[] {
  const points = series[0]?.points || []
  if (!points.length) return []

  const step = Math.max(1, Math.ceil(points.length / MAX_X_LABEL_COUNT))
  return points
    .filter((_, index) => index % step === 0 || index === points.length - 1)
    .map((point) => ({
      label: point.label,
      x: point.x,
      y: LABEL_Y,
    }))
}

function resolveDomain(props: LineChart): ChartDomain {
  const values = resolveSeries(props.series).flatMap((series) =>
    series.points.map((point) => point.value),
  )
  const fallbackMax = values.length ? Math.max(...values) : 1
  const fallbackMin = values.length ? Math.min(...values) : 0
  let min = Math.min(
    readChartNumber(props.minValue, Math.min(0, fallbackMin)),
    fallbackMin,
    0,
  )
  let max = Math.max(
    readChartNumber(props.maxValue, Math.max(0, fallbackMax)),
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
  valueSuffix: LineChart['valueSuffix'],
): ResolvedLineChartGridLine[] {
  const suffix = resolveChartText(valueSuffix)
  const step = (domain.max - domain.min) / (DEFAULT_GRID_LINE_COUNT - 1)

  return Array.from({ length: DEFAULT_GRID_LINE_COUNT }, (_, index) => {
    const value = domain.max - step * index
    return {
      value,
      formattedValue: formatChartValue(value, suffix),
      y: valueToY(value, domain),
    }
  })
}

function pointIndexToX(index: number, count: number) {
  if (count <= 1) return PLOT_X + PLOT_WIDTH / 2
  return PLOT_X + (index / (count - 1)) * PLOT_WIDTH
}

function valueToY(value: number, domain: ChartDomain) {
  const range = domain.max - domain.min
  if (range <= 0) return PLOT_Y + PLOT_HEIGHT
  const ratio = (domain.max - value) / range
  return PLOT_Y + ratio * PLOT_HEIGHT
}

function resolveAriaLabel(props: LineChart) {
  return (
    resolveChartText(props.ariaLabel) ||
    resolveChartText(props.title) ||
    'Line chart'
  )
}

function resolveCurve(value: RefOrValue<LineChartCurve> | undefined) {
  return unref(value) === 'linear' ? 'linear' : 'smooth'
}

import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  type RefOrValue,
  svg,
  unref,
} from 'regor'
import {
  type CartesianChartDomain,
  pointIndexToCartesianChartX,
  type ResolvedCartesianChartGridLine,
  resolveCartesianChartDomain,
  resolveCartesianChartGridLines,
  valueToCartesianChartY,
} from '../chart/cartesianChart'
import {
  CARTESIAN_CHART_LABEL_Y,
  CARTESIAN_CHART_VIEWBOX_HEIGHT,
  DEFAULT_CARTESIAN_CHART_HEIGHT,
  DEFAULT_CARTESIAN_CHART_WIDTH,
  DEFAULT_CHART_COLORS,
  DEFAULT_CHART_EMPTY_LABEL,
} from '../chart/chartDefaults'
import {
  formatChartNumber,
  formatChartPoint,
  formatChartValue,
  readChartNumber,
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

export interface ResolvedLineChartGridLine
  extends ResolvedCartesianChartGridLine {}

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
  resolvedHeight?: ComputedRef<string | number | undefined>
  resolvedAriaLabel?: ComputedRef<string>
  resolvedEmptyLabel?: ComputedRef<string>
  chartSeries?: ComputedRef<ResolvedLineChartSeries[]>
  gridLines?: ComputedRef<ResolvedLineChartGridLine[]>
  xLabels?: ComputedRef<ResolvedLineChartLabel[]>
  hasSeries?: ComputedRef<boolean>
  zeroLineY?: ComputedRef<number>
}

const VALUE_LABEL_OFFSET = 2.6
const MAX_X_LABEL_COUNT = 7

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
  <g class="line-chart__grid" r-if="hasSeries && showAxis">
    <g r-for="line in gridLines" class="line-chart__grid-line">
      <line x1="8" x2="94" :y1="line.y" :y2="line.y"/>
      <text x="5.4" :y="line.y">{{ line.formattedValue }}</text>
    </g>
  </g>
  <line
    r-if="hasSeries && showAxis"
    class="line-chart__zero-line"
    x1="8"
    x2="94"
    :y1="zeroLineY"
    :y2="zeroLineY"/>
  <g class="line-chart__areas" r-if="hasSeries && showArea">
    <path
      r-for="item in chartSeries"
      class="line-chart__area"
      :d="item.areaPath"
      :fill="item.color"
      :aria-label="item.label"
    >
      <animate
        r-if="animated"
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
        r-if="animated"
        attributeName="opacity"
        from="0"
        to="1"
        dur="520ms"
        fill="freeze"/>
    </path>
  </g>
  <g class="line-chart__points" r-if="hasSeries && showPoints">
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
          r-if="animated"
          attributeName="r"
          from="0"
          to="0.9"
          dur="520ms"
          fill="freeze"/>
      </circle>
    </g>
  </g>
  <g class="line-chart__values" r-if="hasSeries && showValues">
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
  <g class="line-chart__labels" r-if="hasSeries && showLabels">
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
    animated: true,
    showArea: false,
    showPoints: true,
    showValues: false,
    showLabels: true,
    showAxis: true,
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'none',
        defaultVariantMode: 'stateless',
      }),
    ),
    resolvedWidth: computed(() =>
      resolveChartSize(props.width, DEFAULT_CARTESIAN_CHART_WIDTH),
    ),
    resolvedHeight: computed(() =>
      resolveChartSize(props.height, DEFAULT_CARTESIAN_CHART_HEIGHT),
    ),
    resolvedAriaLabel: computed(() => resolveAriaLabel(props)),
    resolvedEmptyLabel: computed(
      () => resolveChartText(props.emptyLabel) || DEFAULT_CHART_EMPTY_LABEL,
    ),
    chartSeries,
    gridLines: computed(() =>
      resolveCartesianChartGridLines(domain(), props.valueSuffix),
    ),
    xLabels: computed(() => resolveXLabels(chartSeries())),
    hasSeries: computed(() => chartSeries().length > 0),
    zeroLineY: computed(() => valueToCartesianChartY(0, domain())),
  }
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
  domain: CartesianChartDomain,
): ResolvedLineChartSeries[] {
  const valueSuffix = resolveChartText(props.valueSuffix)
  const curve = resolveCurve(props.curve)
  const zeroY = valueToCartesianChartY(0, domain)

  return resolveSeries(props.series).map((series, index) => {
    const points = series.points.map((point, pointIndex) => {
      const x = pointIndexToCartesianChartX(pointIndex, series.points.length)
      const y = valueToCartesianChartY(point.value, domain)
      const valueLabelY =
        point.value < 0
          ? Math.min(CARTESIAN_CHART_VIEWBOX_HEIGHT - 2, y + VALUE_LABEL_OFFSET)
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
        DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length],
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
      y: CARTESIAN_CHART_LABEL_Y,
    }))
}

function resolveDomain(props: LineChart): CartesianChartDomain {
  const values = resolveSeries(props.series).flatMap((series) =>
    series.points.map((point) => point.value),
  )
  return resolveCartesianChartDomain({
    values,
    minValue: props.minValue,
    maxValue: props.maxValue,
  })
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

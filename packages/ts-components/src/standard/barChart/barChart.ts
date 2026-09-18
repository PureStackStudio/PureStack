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
  type ResolvedCartesianChartGridLine,
  resolveCartesianChartDomain,
  resolveCartesianChartGridLines,
  valueToCartesianChartY,
} from '../chart/cartesianChart'
import {
  CARTESIAN_CHART_LABEL_Y,
  CARTESIAN_CHART_PLOT_WIDTH,
  CARTESIAN_CHART_PLOT_X,
  CARTESIAN_CHART_VIEWBOX_HEIGHT,
  DEFAULT_CARTESIAN_CHART_HEIGHT,
  DEFAULT_CARTESIAN_CHART_WIDTH,
  DEFAULT_CHART_COLORS,
  DEFAULT_CHART_EMPTY_LABEL,
} from '../chart/chartDefaults'
import {
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

export interface ResolvedBarChartGridLine
  extends ResolvedCartesianChartGridLine {}

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
  resolvedHeight?: ComputedRef<string | number | undefined>
  resolvedAriaLabel?: ComputedRef<string>
  resolvedEmptyLabel?: ComputedRef<string>
  chartItems?: ComputedRef<ResolvedBarChartItem[]>
  gridLines?: ComputedRef<ResolvedBarChartGridLine[]>
  hasItems?: ComputedRef<boolean>
  zeroLineY?: ComputedRef<number>
}

const VALUE_LABEL_OFFSET = 2.4
const BAR_WIDTH_SHARE = 0.64
const MIN_VISIBLE_BAR_HEIGHT = 0.35

const barChartTemplate = svg`<svg
  class="bar-chart"
  :class="classes"
  viewBox="0 0 100 58"
  :width="resolvedWidth"
  :height="resolvedHeight"
  role="img"
  :aria-label="resolvedAriaLabel"
>
  <title r-if="title">{{ title }}</title>
  <desc r-if="description">{{ description }}</desc>
  <g class="bar-chart__grid" r-if="hasItems && showAxis">
    <g r-for="line in gridLines" class="bar-chart__grid-line">
      <line x1="8" x2="94" :y1="line.y" :y2="line.y"/>
      <text x="5.4" :y="line.y">{{ line.formattedValue }}</text>
    </g>
  </g>
  <line
    r-if="hasItems && showAxis"
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
      <title>{{ item.label + ': ' + item.formattedValue }}</title>
      <animate
        r-if="animated"
        attributeName="height"
        from="0"
        :to="item.height"
        dur="1720ms"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.16 1 0.3 1"
        fill="freeze"/>
      <animate
        r-if="animated"
        attributeName="y"
        :from="zeroLineY"
        :to="item.y"
        dur="1720ms"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.16 1 0.3 1"
        fill="freeze"/>
    </rect>
  </g>
  <g class="bar-chart__values" r-if="hasItems && showValues">
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
  <g class="bar-chart__labels" r-if="hasItems && showLabels">
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
    y="30"
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
    animated: true,
    showValues: true,
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
    chartItems: computed(() => resolveChartItems(props, domain())),
    gridLines: computed(() =>
      resolveCartesianChartGridLines(domain(), props.valueSuffix),
    ),
    hasItems: computed(() => resolveItems(props.items).length > 0),
    zeroLineY: computed(() => valueToCartesianChartY(0, domain())),
  }
}

function resolveChartItems(
  props: BarChart,
  domain: CartesianChartDomain,
): ResolvedBarChartItem[] {
  const items = resolveItems(props.items)
  if (!items.length) return []

  const laneWidth = CARTESIAN_CHART_PLOT_WIDTH / items.length
  const barWidth = Math.max(1, laneWidth * BAR_WIDTH_SHARE)
  const valueSuffix = resolveChartText(props.valueSuffix)
  const zeroY = valueToCartesianChartY(0, domain)

  return items.map((item, index) => {
    const valueY = valueToCartesianChartY(item.value, domain)
    const rawHeight = Math.abs(zeroY - valueY)
    const height =
      item.value === 0 ? 0 : Math.max(rawHeight, MIN_VISIBLE_BAR_HEIGHT)
    const isNegative = item.value < 0
    const x =
      CARTESIAN_CHART_PLOT_X + laneWidth * index + (laneWidth - barWidth) / 2
    const y = isNegative
      ? zeroY
      : Math.min(valueY, zeroY) - (height - rawHeight)
    const valueLabelY = isNegative
      ? Math.min(
          CARTESIAN_CHART_VIEWBOX_HEIGHT - 2,
          y + height + VALUE_LABEL_OFFSET,
        )
      : Math.max(2, y - VALUE_LABEL_OFFSET)

    return {
      label: item.label,
      value: item.value,
      formattedValue: formatChartValue(item.value, valueSuffix),
      color:
        item.color || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length],
      x,
      y,
      width: barWidth,
      height,
      valueLabelX: x + barWidth / 2,
      valueLabelY,
      valueLabelBaseline: isNegative ? 'hanging' : 'auto',
      labelX: x + barWidth / 2,
      labelY: CARTESIAN_CHART_LABEL_Y,
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
      const value = readChartNumber(item?.value, Number.NaN)
      return {
        label: resolveChartText(item?.label) || `Item ${index + 1}`,
        value,
        color: resolveChartText(item?.color),
      }
    })
    .filter((item) => Number.isFinite(item.value))
}

function resolveDomain(props: BarChart): CartesianChartDomain {
  const values = resolveItems(props.items).map((item) => item.value)
  return resolveCartesianChartDomain({
    values,
    minValue: props.minValue,
    maxValue: props.maxValue,
  })
}

function resolveAriaLabel(props: BarChart) {
  return (
    resolveChartText(props.ariaLabel) ||
    resolveChartText(props.title) ||
    'Bar chart'
  )
}

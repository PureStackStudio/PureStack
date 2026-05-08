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

export interface DoughnutChartSegment {
  label?: RefOrValue<string>
  value?: RefOrValue<number | string>
  color?: RefOrValue<string>
}

export interface ResolvedDoughnutChartSegment {
  label: string
  value: number
  percent: number
  formattedValue: string
  path: string
  color: string
}

export interface ResolvedDoughnutChartSeparator {
  path: string
}

export interface DoughnutChart {
  segments?: RefOrValue<Array<RefOrValue<DoughnutChartSegment>>>
  title?: RefOrValue<string>
  description?: RefOrValue<string>
  ariaLabel?: RefOrValue<string>
  centerLabel?: RefOrValue<string>
  centerValue?: RefOrValue<string>
  emptyLabel?: RefOrValue<string>
  valueSuffix?: RefOrValue<string>
  size?: RefOrValue<number | string>
  thickness?: RefOrValue<number | string>
  gap?: RefOrValue<number | string>
  startAngle?: RefOrValue<number | string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  classes?: ComputedRef<string>
  resolvedSize?: ComputedRef<string | number>
  resolvedAriaLabel?: ComputedRef<string>
  resolvedEmptyLabel?: ComputedRef<string>
  chartSegments?: ComputedRef<ResolvedDoughnutChartSegment[]>
  separators?: ComputedRef<ResolvedDoughnutChartSeparator[]>
  hasSegments?: ComputedRef<boolean>
  total?: ComputedRef<number>
  centerValueText?: ComputedRef<string>
  trackPath?: ComputedRef<string>
}

const CHART_CENTER = 50
const CHART_OUTER_RADIUS = 46
const DEFAULT_CHART_SIZE = 220
const DEFAULT_CHART_THICKNESS = 14
const DEFAULT_CHART_GAP = 2
const DEFAULT_CHART_START_ANGLE = -90
const DEFAULT_EMPTY_LABEL = 'No data'
const FULL_CIRCLE = 360

const DEFAULT_SEGMENT_COLORS = [
  getThemePaletteVar('semanticTone.accent.tone'),
  getThemePaletteVar('semanticTone.success.tone'),
  getThemePaletteVar('semanticTone.info.tone'),
  getThemePaletteVar('semanticTone.warning.tone'),
  getThemePaletteVar('semanticTone.feature.tone'),
  getThemePaletteVar('semanticTone.secondary.tone'),
  getThemePaletteVar('semanticTone.danger.tone'),
]

const doughnutChartTemplate = svg`<svg
  class="doughnut-chart"
  :class="classes"
  viewBox="0 0 100 100"
  :width="resolvedSize"
  :height="resolvedSize"
  role="img"
  :aria-label="resolvedAriaLabel"
  r-inherit
>
  <title r-if="title">{{ title }}</title>
  <desc r-if="description">{{ description }}</desc>
  <path class="doughnut-chart__track" :d="trackPath" fill-rule="evenodd"/>
  <g class="doughnut-chart__segments" r-if="hasSegments">
    <path
      r-for="segment in chartSegments"
      class="doughnut-chart__segment"
      :d="segment.path"
      :fill="segment.color"
      :aria-label="segment.label + ': ' + segment.formattedValue"
      fill-rule="evenodd"
    >
      <title r-text="segment.label + ': ' + segment.formattedValue"></title>
    </path>
  </g>
  <g class="doughnut-chart__separators" r-if="hasSegments">
    <path
      r-for="separator in separators"
      class="doughnut-chart__separator"
      :d="separator.path"/>
  </g>
  <g class="doughnut-chart__center" r-if="centerValueText || centerLabel">
    <text
      class="doughnut-chart__center-value"
      x="50"
      :y="centerLabel ? 48 : 52"
      text-anchor="middle"
    >
      {{ centerValueText }}
    </text>
    <text
      r-if="centerLabel"
      class="doughnut-chart__center-label"
      x="50"
      y="61"
      text-anchor="middle"
    >
      {{ centerLabel }}
    </text>
  </g>
  <text
    r-if="!hasSegments && !centerValueText && !centerLabel"
    class="doughnut-chart__empty"
    x="50"
    y="52"
    text-anchor="middle"
  >
    {{ resolvedEmptyLabel }}
  </text>
</svg>`

function defineDoughnutChartComponent() {
  return defineComponent<DoughnutChart>(doughnutChartTemplate, {
    props: [
      'segments',
      'title',
      'description',
      'ariaLabel',
      'centerLabel',
      'centerValue',
      'emptyLabel',
      'valueSuffix',
      'size',
      'thickness',
      'gap',
      'startAngle',
      'tone',
      'variant',
      'variantMode',
    ],
    context: (head) => resolveDoughnutChart(head.props),
  })
}

export function defineDoughnutChartComponents() {
  return {
    doughnutChart: defineDoughnutChartComponent(),
  }
}

function resolveDoughnutChart(props: DoughnutChart): DoughnutChart {
  const thickness = computed(() =>
    clampNumber(props.thickness, DEFAULT_CHART_THICKNESS, 2, 40),
  )
  const innerRadius = computed(() => CHART_OUTER_RADIUS - thickness())
  const total = computed(() => resolveTotal(props.segments))
  const chartSegments = computed(() =>
    resolveChartSegments(props, total(), innerRadius()),
  )
  const separators = computed(() =>
    resolveSeparators(props, chartSegments(), innerRadius()),
  )

  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'none',
        defaultVariantMode: 'stateless',
      }),
    ),
    resolvedSize: computed(() => resolveSize(props.size)),
    resolvedAriaLabel: computed(() => resolveAriaLabel(props)),
    resolvedEmptyLabel: computed(
      () => resolveText(props.emptyLabel) || DEFAULT_EMPTY_LABEL,
    ),
    total,
    chartSegments,
    separators,
    hasSegments: computed(() => chartSegments().length > 0),
    centerValueText: computed(() => resolveCenterValue(props, total())),
    trackPath: computed(() => fullRingPath(CHART_OUTER_RADIUS, innerRadius())),
  }
}

function resolveChartSegments(
  props: DoughnutChart,
  total: number,
  innerRadius: number,
): ResolvedDoughnutChartSegment[] {
  if (total <= 0) return []

  const startAngle = readNumber(props.startAngle, DEFAULT_CHART_START_ANGLE)
  const valueSuffix = resolveText(props.valueSuffix)
  let cursor = startAngle

  return resolvePositiveSegments(props.segments).map((segment, index) => {
    const span = (segment.value / total) * FULL_CIRCLE
    const segmentStart = cursor
    const segmentEnd = cursor + span
    cursor += span

    return {
      ...segment,
      percent: segment.value / total,
      formattedValue: formatSegmentValue(segment.value, valueSuffix),
      color:
        segment.color ||
        DEFAULT_SEGMENT_COLORS[index % DEFAULT_SEGMENT_COLORS.length],
      path:
        segmentEnd - segmentStart >= FULL_CIRCLE - 0.001
          ? fullRingPath(CHART_OUTER_RADIUS, innerRadius)
          : ringSegmentPath(
              CHART_OUTER_RADIUS,
              innerRadius,
              segmentStart,
              segmentEnd,
            ),
    }
  })
}

function resolveSeparators(
  props: DoughnutChart,
  segments: ResolvedDoughnutChartSegment[],
  innerRadius: number,
): ResolvedDoughnutChartSeparator[] {
  if (segments.length < 2) return []

  const gap = clampNumber(props.gap, DEFAULT_CHART_GAP, 0, 24)
  if (gap <= 0) return []

  let cursor = readNumber(props.startAngle, DEFAULT_CHART_START_ANGLE)
  return segments.map((segment) => {
    const path = separatorPath(cursor, innerRadius, CHART_OUTER_RADIUS, gap)
    cursor += segment.percent * FULL_CIRCLE
    return {
      path,
    }
  })
}

function separatorPath(
  angle: number,
  innerRadius: number,
  outerRadius: number,
  width: number,
) {
  const halfWidth = Math.min(
    width / 2,
    innerRadius - 0.001,
    outerRadius - 0.001,
  )
  if (halfWidth <= 0) return ''

  const radians = (angle * Math.PI) / 180
  const ux = Math.cos(radians)
  const uy = Math.sin(radians)
  const px = -uy
  const py = ux
  const outerDistance = Math.sqrt(outerRadius ** 2 - halfWidth ** 2)
  const innerDistance = Math.sqrt(innerRadius ** 2 - halfWidth ** 2)
  const outerStart = offsetPoint(ux, uy, px, py, outerDistance, halfWidth)
  const outerEnd = offsetPoint(ux, uy, px, py, outerDistance, -halfWidth)
  const innerEnd = offsetPoint(ux, uy, px, py, innerDistance, -halfWidth)
  const innerStart = offsetPoint(ux, uy, px, py, innerDistance, halfWidth)

  return [
    `M ${formatPoint(outerStart)}`,
    `A ${fmt(outerRadius)} ${fmt(outerRadius)} 0 0 0 ${formatPoint(outerEnd)}`,
    `L ${formatPoint(innerEnd)}`,
    `A ${fmt(innerRadius)} ${fmt(innerRadius)} 0 0 1 ${formatPoint(innerStart)}`,
    'Z',
  ].join(' ')
}

function offsetPoint(
  ux: number,
  uy: number,
  px: number,
  py: number,
  radialDistance: number,
  offset: number,
) {
  return {
    x: CHART_CENTER + ux * radialDistance + px * offset,
    y: CHART_CENTER + uy * radialDistance + py * offset,
  }
}

function resolvePositiveSegments(
  segments: DoughnutChart['segments'],
): Array<
  Omit<ResolvedDoughnutChartSegment, 'percent' | 'formattedValue' | 'path'>
> {
  return (unref(segments) || [])
    .map((segmentInput, index) => {
      const segment = unref(segmentInput)
      const value = readNumber(segment?.value, 0)
      return {
        label: resolveText(segment?.label) || `Segment ${index + 1}`,
        value: value > 0 ? value : 0,
        color: resolveText(segment?.color),
      }
    })
    .filter((segment) => segment.value > 0)
}

function resolveTotal(segments: DoughnutChart['segments']) {
  return resolvePositiveSegments(segments).reduce(
    (total, segment) => total + segment.value,
    0,
  )
}

function resolveCenterValue(props: DoughnutChart, total: number) {
  const explicit = resolveText(props.centerValue)
  if (explicit) return explicit
  if (total <= 0) return ''
  return formatSegmentValue(total, resolveText(props.valueSuffix))
}

function resolveAriaLabel(props: DoughnutChart) {
  return (
    resolveText(props.ariaLabel) || resolveText(props.title) || 'Doughnut chart'
  )
}

function resolveSize(size?: RefOrValue<number | string>) {
  const resolved = unref(size)
  if (typeof resolved === 'number' && Number.isFinite(resolved)) {
    return Math.max(1, resolved)
  }
  if (typeof resolved !== 'string') return DEFAULT_CHART_SIZE
  const trimmed = resolved.trim()
  return trimmed || DEFAULT_CHART_SIZE
}

function fullRingPath(outerRadius: number, innerRadius: number) {
  const topOuter = pointAtAngle(outerRadius, -90)
  const bottomOuter = pointAtAngle(outerRadius, 90)
  const topInner = pointAtAngle(innerRadius, -90)
  const bottomInner = pointAtAngle(innerRadius, 90)

  return [
    `M ${formatPoint(topOuter)}`,
    `A ${fmt(outerRadius)} ${fmt(outerRadius)} 0 1 1 ${formatPoint(bottomOuter)}`,
    `A ${fmt(outerRadius)} ${fmt(outerRadius)} 0 1 1 ${formatPoint(topOuter)}`,
    `M ${formatPoint(topInner)}`,
    `A ${fmt(innerRadius)} ${fmt(innerRadius)} 0 1 0 ${formatPoint(bottomInner)}`,
    `A ${fmt(innerRadius)} ${fmt(innerRadius)} 0 1 0 ${formatPoint(topInner)}`,
    'Z',
  ].join(' ')
}

function ringSegmentPath(
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = pointAtAngle(outerRadius, startAngle)
  const outerEnd = pointAtAngle(outerRadius, endAngle)
  const innerEnd = pointAtAngle(innerRadius, endAngle)
  const innerStart = pointAtAngle(innerRadius, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${formatPoint(outerStart)}`,
    `A ${fmt(outerRadius)} ${fmt(outerRadius)} 0 ${largeArc} 1 ${formatPoint(outerEnd)}`,
    `L ${formatPoint(innerEnd)}`,
    `A ${fmt(innerRadius)} ${fmt(innerRadius)} 0 ${largeArc} 0 ${formatPoint(innerStart)}`,
    'Z',
  ].join(' ')
}

function pointAtAngle(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: CHART_CENTER + radius * Math.cos(radians),
    y: CHART_CENTER + radius * Math.sin(radians),
  }
}

function formatPoint(point: { x: number; y: number }) {
  return `${fmt(point.x)} ${fmt(point.y)}`
}

function formatSegmentValue(value: number, suffix: string) {
  const formatted = Number.isInteger(value) ? String(value) : fmt(value)
  return suffix ? `${formatted}${suffix}` : formatted
}

function clampNumber(
  value: RefOrValue<number | string> | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  return Math.min(Math.max(readNumber(value, fallback), min), max)
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

function fmt(value: number) {
  return Number.parseFloat(value.toFixed(3)).toString()
}

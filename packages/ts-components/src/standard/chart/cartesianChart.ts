import type { RefOrValue } from 'regor'
import {
  CARTESIAN_CHART_PLOT_HEIGHT,
  CARTESIAN_CHART_PLOT_WIDTH,
  CARTESIAN_CHART_PLOT_X,
  CARTESIAN_CHART_PLOT_Y,
  DEFAULT_CARTESIAN_GRID_LINE_COUNT,
} from './chartDefaults'
import {
  formatChartValue,
  readChartNumber,
  resolveChartText,
} from './chartUtils'

export interface CartesianChartDomain {
  min: number
  max: number
}

export interface ResolvedCartesianChartGridLine {
  value: number
  formattedValue: string
  y: number
}

export interface ResolveCartesianChartDomainOptions {
  values: number[]
  minValue?: RefOrValue<number | string>
  maxValue?: RefOrValue<number | string>
}

export function resolveCartesianChartDomain({
  values,
  minValue,
  maxValue,
}: ResolveCartesianChartDomainOptions): CartesianChartDomain {
  const fallbackMax = values.length ? Math.max(...values) : 1
  const fallbackMin = values.length ? Math.min(...values) : 0
  let min = Math.min(
    readChartNumber(minValue, Math.min(0, fallbackMin)),
    fallbackMin,
    0,
  )
  let max = Math.max(
    readChartNumber(maxValue, Math.max(0, fallbackMax)),
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

export function resolveCartesianChartGridLines(
  domain: CartesianChartDomain,
  valueSuffix?: RefOrValue<string>,
): ResolvedCartesianChartGridLine[] {
  const suffix = resolveChartText(valueSuffix)
  const step =
    (domain.max - domain.min) / (DEFAULT_CARTESIAN_GRID_LINE_COUNT - 1)

  return Array.from(
    { length: DEFAULT_CARTESIAN_GRID_LINE_COUNT },
    (_, index) => {
      const value = domain.max - step * index
      return {
        value,
        formattedValue: formatChartValue(value, suffix),
        y: valueToCartesianChartY(value, domain),
      }
    },
  )
}

export function valueToCartesianChartY(
  value: number,
  domain: CartesianChartDomain,
) {
  const range = domain.max - domain.min
  if (range <= 0) return CARTESIAN_CHART_PLOT_Y + CARTESIAN_CHART_PLOT_HEIGHT
  const ratio = (domain.max - value) / range
  return CARTESIAN_CHART_PLOT_Y + ratio * CARTESIAN_CHART_PLOT_HEIGHT
}

export function pointIndexToCartesianChartX(index: number, count: number) {
  if (count <= 1) {
    return CARTESIAN_CHART_PLOT_X + CARTESIAN_CHART_PLOT_WIDTH / 2
  }
  return (
    CARTESIAN_CHART_PLOT_X + (index / (count - 1)) * CARTESIAN_CHART_PLOT_WIDTH
  )
}

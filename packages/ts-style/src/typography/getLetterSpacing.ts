import type { CSSProps } from '@purestack/ts-css'
import { clamp } from '@purestack/ts-util'
import { normalizeFontSize, normalizeFontWeight } from './normalizeTypography'
import { roundTo } from './roundTo'

export function getLetterSpacing(
  fontSize: string,
  fontWeight: CSSProps['fontWeight'] = '400',
): string | undefined {
  const normalizedFontSize = normalizeFontSize(fontSize)
  const normalizedFontWeight = normalizeFontWeight(fontWeight)

  const sizeTracking = getTrackingBySize(normalizedFontSize)
  const weightAdjustment = getTrackingByWeight(normalizedFontWeight)

  const tracking = clamp(sizeTracking + weightAdjustment, -1, 1)

  if (tracking === 0) return undefined
  return `${roundTo(tracking, 3)}em`
}
function getTrackingBySize(fontSize: number): number {
  const rules = [
    { min: 3, value: -0.02 },
    { min: 2, value: -0.012 },
    { min: 1.5, value: -0.08 },
    { min: 1.125, value: -0.004 },
    { min: 1, value: 0 },
    { min: 0.875, value: 0.02 },
    { min: 0.75, value: 0.12 },
    { min: 0, value: 0.2 },
  ]

  return rules.find((rule) => fontSize >= rule.min)?.value ?? 0
}

function getTrackingByWeight(fontWeight: number): number {
  const rules = [
    { min: 700, value: -0.003 },
    { min: 600, value: -0.002 },
    { min: 500, value: -0.001 },
    { min: 0, value: 0 },
  ]

  return rules.find((rule) => fontWeight >= rule.min)?.value ?? 0
}

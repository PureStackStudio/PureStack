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

const TRACKING_ORIGIN_FONT_SIZE_REM = 1
const TRACKING_ORIGIN_VALUE_EM = 0
const LEFT_TRACKING_BOUNDARY = {
  fontSize: 0.5,
  value: 0.12,
}
const RIGHT_TRACKING_BOUNDARY = {
  fontSize: 3,
  value: -0.02,
}

function getTrackingBySize(fontSize: number): number {
  if (fontSize === TRACKING_ORIGIN_FONT_SIZE_REM) {
    return TRACKING_ORIGIN_VALUE_EM
  }

  if (fontSize < TRACKING_ORIGIN_FONT_SIZE_REM) {
    return interpolateTracking(
      clamp(
        fontSize,
        LEFT_TRACKING_BOUNDARY.fontSize,
        TRACKING_ORIGIN_FONT_SIZE_REM,
      ),
      LEFT_TRACKING_BOUNDARY.fontSize,
      LEFT_TRACKING_BOUNDARY.value,
      TRACKING_ORIGIN_FONT_SIZE_REM,
      TRACKING_ORIGIN_VALUE_EM,
    )
  }

  return interpolateTracking(
    clamp(
      fontSize,
      TRACKING_ORIGIN_FONT_SIZE_REM,
      RIGHT_TRACKING_BOUNDARY.fontSize,
    ),
    TRACKING_ORIGIN_FONT_SIZE_REM,
    TRACKING_ORIGIN_VALUE_EM,
    RIGHT_TRACKING_BOUNDARY.fontSize,
    RIGHT_TRACKING_BOUNDARY.value,
  )
}

function getTrackingByWeight(fontWeight: number): number {
  const rules = [
    { min: 700, value: -0.0 },
    { min: 600, value: -0.0 },
    { min: 500, value: -0.0 },
    { min: 0, value: 0 },
  ]

  return rules.find((rule) => fontWeight >= rule.min)?.value ?? 0
}

function interpolateTracking(
  value: number,
  start: number,
  startTracking: number,
  end: number,
  endTracking: number,
): number {
  const progress = (value - start) / (end - start)
  return startTracking + (endTracking - startTracking) * progress
}

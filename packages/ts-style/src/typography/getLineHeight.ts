import type { CSSProps } from '@purestack/ts-css'
import { clamp } from '@purestack/ts-util'
import { normalizeFontSize, normalizeFontWeight } from './normalizeTypography'
import { roundTo } from './roundTo'

export function getLineHeight(
  fontSize: string,
  fontWeight: CSSProps['fontWeight'] = '400',
): string {
  const normalizedFontSize = normalizeFontSize(fontSize)
  const normalizedFontWeight = normalizeFontWeight(fontWeight)

  const sizeRules = [
    { min: 3.5, lineHeight: 1.05 },
    { min: 2.5, lineHeight: 1.1 },
    { min: 1.75, lineHeight: 1.18 },
    { min: 1.25, lineHeight: 1.3 },
    { min: 1, lineHeight: 1.5 },
    { min: 0, lineHeight: 1.6 },
  ]

  const weightRules = [
    { min: 700, adjustment: -0.08 },
    { min: 600, adjustment: -0.05 },
    { min: 500, adjustment: -0.02 },
    { min: 0, adjustment: 0 },
  ]

  const baseLineHeight =
    sizeRules.find((rule) => normalizedFontSize >= rule.min)?.lineHeight ?? 1.6

  const weightAdjustment =
    weightRules.find((rule) => normalizedFontWeight >= rule.min)?.adjustment ??
    0

  const minLineHeight = normalizedFontSize >= 1.75 ? 1.0 : 1.3
  const maxLineHeight = 1.7

  const lineHeight = clamp(
    baseLineHeight + weightAdjustment,
    minLineHeight,
    maxLineHeight,
  )

  return `${roundTo(lineHeight, 3)}`
}

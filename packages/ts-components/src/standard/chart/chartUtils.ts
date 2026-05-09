import { clamp } from '@purestack/ts-util'
import { type RefOrValue, unref } from 'regor'

export interface FormatChartNumberOptions {
  precision?: number
}

export function readChartNumber(
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

export function clampChartNumber(
  value: RefOrValue<number | string> | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  return clamp(readChartNumber(value, fallback), min, max)
}

export function resolveChartText(value?: RefOrValue<string>) {
  const resolved = unref(value)
  return typeof resolved === 'string' ? resolved.trim() : ''
}

export function resolveChartSize(
  size: RefOrValue<number | string> | undefined,
  fallback: number | string | undefined,
) {
  const resolved = unref(size)
  if (typeof resolved === 'number' && Number.isFinite(resolved)) {
    return Math.max(1, resolved)
  }
  if (typeof resolved !== 'string') return fallback
  const trimmed = resolved.trim()
  return trimmed || fallback
}

export function resolveChartCssSize(size?: RefOrValue<number | string>) {
  const resolved = unref(size)
  if (typeof resolved === 'number' && Number.isFinite(resolved)) {
    return `${resolved}px`
  }
  if (typeof resolved !== 'string') return ''
  const trimmed = resolved.trim()
  return isNumericChartString(trimmed) ? `${trimmed}px` : trimmed
}

export function formatChartValue(
  value: number,
  suffix: string,
  options: FormatChartNumberOptions = {},
) {
  const formatted = Number.isInteger(value)
    ? String(value)
    : formatChartNumber(value, options)
  return suffix ? `${formatted}${suffix}` : formatted
}

export function formatChartPoint(
  point: { x: number; y: number },
  options: FormatChartNumberOptions = {},
) {
  return `${formatChartNumber(point.x, options)} ${formatChartNumber(point.y, options)}`
}

export function formatChartNumber(
  value: number,
  { precision = 2 }: FormatChartNumberOptions = {},
) {
  return Number.parseFloat(value.toFixed(precision)).toString()
}

function isNumericChartString(value: string) {
  return /^-?\d+(?:\.\d+)?$/.test(value)
}

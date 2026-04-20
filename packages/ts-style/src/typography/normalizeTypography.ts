import type { CSSProps } from '@purestack/ts-css'

export function normalizeFontSize(fontSize: string): number {
  const normalized = fontSize.trim().toLowerCase()

  if (!normalized) {
    throw new TypeError('fontSize must not be empty')
  }

  const match = normalized.match(/^(\d*\.?\d+)rem$/)

  if (!match) {
    throw new TypeError('fontSize must be a positive rem string like "1rem"')
  }

  const value = Number(match[1])

  if (!Number.isFinite(value) || value <= 0) {
    throw new TypeError('fontSize must be a positive rem string like "1rem"')
  }

  return value
}

export function normalizeFontWeight(fontWeight: CSSProps['fontWeight']): number {
  const normalized = fontWeight.trim().toLowerCase()

  if (!normalized) {
    throw new TypeError('fontWeight must not be empty')
  }

  if (normalized === 'normal') {
    return 400
  }

  if (normalized === 'bold') {
    return 700
  }

  if (normalized === 'bolder' || normalized === 'lighter') {
    throw new TypeError(
      'fontWeight must be a concrete weight like "400", "700", "normal", or "bold"',
    )
  }

  const value = Number(normalized)

  if (!Number.isFinite(value)) {
    throw new TypeError(
      'fontWeight must be a concrete weight like "400", "700", "normal", or "bold"',
    )
  }

  return value
}

export type SemanticTone =
  | 'neutral'
  | 'accent'
  | 'feature'
  | 'secondary'
  | 'custom'
  | 'ghost'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export const SEMANTIC_TONES: SemanticTone[] = [
  'neutral',
  'accent',
  'feature',
  'secondary',
  'custom',
  'ghost',
  'info',
  'success',
  'warning',
  'danger',
]

export function pickSemanticTone(
  ...values: Array<unknown>
): SemanticTone | undefined {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const normalized = value.toLowerCase()
    if (isSemanticTone(normalized)) return normalized
  }
  return undefined
}

export function isSemanticTone(value: string): value is SemanticTone {
  return SEMANTIC_TONES.includes(value as SemanticTone)
}

export function getSemanticToneClass(
  tone: SemanticTone | undefined,
  fallback?: SemanticTone,
) {
  tone = pickSemanticTone(tone)
  if (!tone) return fallback ?? ''
  return `tone--${tone}`
}

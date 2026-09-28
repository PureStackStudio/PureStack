import { findMdxExpressionEnd } from './markupSupport'

export interface RegorExpressionPlaceholder {
  placeholder: string
  source: string
}

/**
 * Protects Regor {{ ... }} expressions while the surrounding markup is
 * formatted as HTML. The expression source is restored byte-for-byte.
 */
export function maskRegorExpressions(source: string) {
  const expressions: RegorExpressionPlaceholder[] = []
  let placeholderContent = ''
  let cursor = 0

  while (cursor < source.length) {
    const start = source.indexOf('{{', cursor)
    if (start === -1) {
      placeholderContent += source.slice(cursor)
      break
    }

    placeholderContent += source.slice(cursor, start)

    const end = findRegorExpressionEnd(source, start)
    if (end === -1) {
      // Keep incomplete input untouched rather than guessing its boundary.
      placeholderContent += source.slice(start)
      break
    }

    const placeholder = createPlaceholder(source, expressions.length)
    expressions.push({ placeholder, source: source.slice(start, end) })
    placeholderContent += placeholder
    cursor = end
  }

  return { expressions, placeholderContent }
}

export function restoreRegorExpressions(
  formatted: string,
  expressions: RegorExpressionPlaceholder[],
) {
  let restored = formatted

  for (const expression of expressions) {
    restored = restored.split(expression.placeholder).join(expression.source)
  }

  return restored
}

function findRegorExpressionEnd(source: string, start: number) {
  // Reuse the expression scanner already used by MDX. Starting at the first
  // brace makes {{ ... }} two outer brace levels, so nested object literals,
  // quoted braces and template-literal expressions remain balanced correctly.
  const end = findMdxExpressionEnd(source, start)
  if (end === -1) return -1

  return source.slice(end - 2, end) === '}}' ? end : -1
}

function createPlaceholder(source: string, index: number) {
  let placeholder = `__PURESTACK_REGOR_EXPR_${index}__`

  while (source.includes(placeholder)) {
    placeholder = `_${placeholder}_`
  }

  return placeholder
}

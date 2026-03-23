export const isString = (value: unknown): value is string =>
  typeof value === 'string' || value instanceof String

export function isAbortError(err: unknown): boolean {
  const obj = err as Record<string, unknown>
  return (
    obj != null && typeof obj.name === 'string' && obj.name === 'AbortError'
  )
}

export function isFunction(
  func: unknown,
): func is (...args: unknown[]) => unknown {
  return typeof func === 'function'
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export function isNumberOrBoolean(value: unknown): value is number | boolean {
  return typeof value === 'number' || typeof value === 'boolean'
}

export function isEmptyPlainObject(
  value: unknown,
): value is Record<string, never> {
  if (!isPlainObject(value)) return false
  for (const _ in value) {
    return false
  }
  return true
}

export function isError(o: unknown): o is Error {
  return o instanceof Error
}

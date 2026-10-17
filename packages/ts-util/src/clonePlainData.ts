import { isPlainObject } from './typeCheck'

/** Copies arrays and plain objects recursively, retaining callbacks and other values. */
export function clonePlainData<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clonePlainData) as T
  if (isPlainObject(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clonePlainData(item)]),
    ) as T
  return value
}

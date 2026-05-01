/**
 * Generates a base class that maps interface properties
 * to the class instance at runtime.
 */

export function Base<T>() {
  return class {
    constructor(opts: T) {
      Object.assign(this, opts)
    }
  } as new (
    data: T,
  ) => T & { constructor: unknown }
}

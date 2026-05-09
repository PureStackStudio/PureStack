import { type RefOrValue, unref } from 'regor'

export function createAutoId(prefix: string) {
  let nextId = 1
  return (value?: RefOrValue<string>) =>
    resolveAutoId(value, () => `${prefix}-${nextId++}`)
}

function resolveAutoId(
  value: RefOrValue<string> | undefined,
  createNextId: () => string,
) {
  const id = unref(value)?.trim?.()
  return id || createNextId()
}

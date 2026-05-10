import { type RefOrValue, unref } from 'regor'

export function createAutoId(prefix: string) {
  let nextId = 1
  return (value?: RefOrValue<string>) =>
    resolveAutoId(value, () => createGeneratedId(prefix, nextId++))
}

function resolveAutoId(
  value: RefOrValue<string> | undefined,
  createNextId: () => string,
) {
  const id = unref(value)?.trim?.()
  return id || createNextId()
}

function createGeneratedId(prefix: string, id: number) {
  return isMinidomDocument(globalThis.document)
    ? `${prefix}-s-${id}`
    : `${prefix}-${id}`
}

function isMinidomDocument(document: Document) {
  return (document as { isMinidom?: unknown })?.isMinidom === true
}

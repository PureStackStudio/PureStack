import { createComponent, html } from 'regor'

interface PageScriptProps {
  teleport?: string
  src?: string
  type?: string
  async?: unknown
  defer?: unknown
  integrity?: string
  nonce?: string
  crossOrigin?: string
  referrerPolicy?: string
  noModule?: unknown
}

const pageScriptTemplate = html`<script
    :r-teleport="teleport"
    :src="src"
    :type="type"
    :async="async"
    :defer="defer"
    :integrity="integrity"
    :nonce="nonce"
    :crossorigin="crossOrigin"
    :referrerpolicy="referrerPolicy"
    :nomodule="noModule"
  ></script>`

function createPageScriptComponent() {
  return createComponent<PageScriptProps>(pageScriptTemplate, {
    props: [
      'teleport',
      'src',
      'type',
      'async',
      'defer',
      'integrity',
      'nonce',
      'crossOrigin',
      'referrerPolicy',
      'noModule',
    ],
    context: (head) => resolvePageScriptContext(head.props),
  })
}

export function createScriptComponents() {
  return {
    pageScript: createPageScriptComponent(),
  }
}

function resolvePageScriptContext(props: PageScriptProps): PageScriptProps {
  const src = resolveScriptSrc(props.src)
  return {
    ...props,
    src,
    type: toOptionalString(props.type) ?? 'module',
    teleport: toOptionalString(props.teleport) ?? 'body',
  }
}

function resolveScriptSrc(src: unknown) {
  const normalized = toOptionalString(src)
  if (!normalized) {
    throw new Error('PageScript requires a non-empty "src" prop.')
  }
  const { base, suffix } = splitSuffix(normalized)
  return `${replaceTsExt(base)}${suffix}`
}

function splitSuffix(src: string) {
  const hashIndex = src.indexOf('#')
  const queryIndex = src.indexOf('?')
  const index =
    hashIndex === -1
      ? queryIndex
      : queryIndex === -1
        ? hashIndex
        : Math.min(hashIndex, queryIndex)
  if (index < 0) return { base: src, suffix: '' }
  return {
    base: src.slice(0, index),
    suffix: src.slice(index),
  }
}

function replaceTsExt(value: string) {
  return value.replace(/\.ts$/i, '.js')
}

function toOptionalString(value: unknown) {
  if (value === null || value === undefined) return undefined
  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : undefined
}

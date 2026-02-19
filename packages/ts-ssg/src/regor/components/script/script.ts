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
    r-if="src"
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
  return {
    ...props,
    src: toRequiredString(props.src),
    type: toOptionalString(props.type) ?? 'module',
    teleport: toOptionalString(props.teleport) ?? 'body',
  }
}

function toRequiredString(value: unknown) {
  const parsed = toOptionalString(value)
  return parsed ?? ''
}

function toOptionalString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

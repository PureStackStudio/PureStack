import { resolveTsSsgContext } from '@purestack/ts-common'
import {
  dirnamePosix,
  joinPosix,
  normalizePosixPath,
  toOutputAssetRelPath,
  toPosixPath,
  urlNormalizer,
} from '@purestack/ts-util'
import { type ComponentHead, defineComponent, flatten, html } from 'regor'

export interface PageScript {
  teleport?: string
  src?: string
  sourceRelPath?: string
  type?: string
  async?: unknown
  defer?: unknown
  integrity?: string
  nonce?: string
  crossOrigin?: string
  referrerPolicy?: string
  noModule?: unknown
}

export interface RegorApp {
  src?: string
  sourceRelPath?: string
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

const regorAppTemplate = html`<App><PageScript
  :src="src"
  :sourceRelPath="sourceRelPath"
/></App>`

function definePageScriptComponent() {
  return defineComponent<PageScript>(pageScriptTemplate, {
    props: [
      'teleport',
      'src',
      'sourceRelPath',
      'type',
      'async',
      'defer',
      'integrity',
      'nonce',
      'crossOrigin',
      'referrerPolicy',
      'noModule',
    ],
    context: (head) => resolvePageScript(head),
  })
}

function defineRegorAppComponent() {
  return defineComponent<RegorApp>(regorAppTemplate, {
    props: ['src', 'sourceRelPath'],
    context: (head) => ({
      src: head.props.src,
      sourceRelPath: head.props.sourceRelPath,
    }),
  })
}

export function defineScriptComponents() {
  return {
    pageScript: definePageScriptComponent(),
    regorApp: defineRegorAppComponent(),
  }
}

function resolvePageScript(head: ComponentHead<PageScript>): PageScript {
  const props = flatten(head.props)
  const tsSsgContext = resolveTsSsgContext(head)
  const ownerRelPath =
    toOptionalString(props.sourceRelPath) ?? tsSsgContext.pageInfo.relPath
  const src = resolveScriptSrc(
    props.src,
    ownerRelPath,
    (sourceRelPath) => {
      tsSsgContext.recordScriptEntrypoint(sourceRelPath)
    },
    tsSsgContext.resolveScriptPublicPath,
  )
  return {
    ...props,
    src,
    type: toOptionalString(props.type) ?? 'module',
    teleport: toOptionalString(props.teleport) ?? 'body',
  }
}

function resolveScriptSrc(
  src: unknown,
  pageRelPath: string,
  onSourceResolved?: (sourceRelPath: string) => void,
  resolveScriptPublicPath?: (sourceRelPath: string) => string,
) {
  const normalized = toOptionalString(src)
  if (!normalized) {
    throw new Error('PageScript requires a non-empty "src" prop.')
  }
  if (isExternalSrc(normalized)) return normalized
  const { base, suffix } = urlNormalizer.splitSuffix(normalized)
  const sourceRelPath = resolveSourceRelPath(base, pageRelPath)
  onSourceResolved?.(sourceRelPath)
  const publicPath =
    resolveScriptPublicPath?.(sourceRelPath) ??
    `/${toOutputAssetRelPath(sourceRelPath)}`
  return `${publicPath}${suffix}`
}

function resolveSourceRelPath(value: string, pageRelPath: string) {
  if (value.startsWith('/')) {
    return trimLeadingSlashes(value)
  }
  const sourceDir = dirnamePosix(toPosixPath(pageRelPath))
  const normalizedSourceDir = sourceDir === '.' ? '' : sourceDir
  const resolved = normalizePosixPath(joinPosix(normalizedSourceDir, value))
  if (resolved === '..' || resolved.startsWith('../')) {
    throw new Error(`PageScript src resolves outside content root: "${value}"`)
  }
  return resolved
}

function isExternalSrc(value: string) {
  return (
    value.startsWith('//') ||
    value.startsWith('http://') ||
    value.startsWith('https://')
  )
}

function trimLeadingSlashes(value: string) {
  return value.replace(/^\/+/, '')
}

function toOptionalString(value: unknown) {
  if (value === null || value === undefined) return undefined
  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : undefined
}

import path from 'node:path'
import { resolveTsSsgContext } from '@purestack/ts-render'
import { toOutputAssetRelPath } from '@purestack/ts-util'
import { type ComponentHead, defineComponent, html } from 'regor'

export interface PageScript {
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

export interface RegorApp {
  src?: string
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

const regorAppTemplate = html`<App><PageScript :src="src" /></App>`

function createPageScriptComponent() {
  return defineComponent<PageScript>(pageScriptTemplate, {
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
    context: (head) => resolvePageScript(head),
  })
}

function createRegorAppComponent() {
  return defineComponent<RegorApp>(regorAppTemplate, {
    props: ['src'],
    context: (head) => ({
      src: head.props.src,
    }),
  })
}

export function createScriptComponents() {
  return {
    pageScript: createPageScriptComponent(),
    regorApp: createRegorAppComponent(),
  }
}

function resolvePageScript(head: ComponentHead<PageScript>): PageScript {
  const props = head.props
  const tsSsgContext = resolveTsSsgContext(head)
  const pageRelPath = tsSsgContext.pageInfo.relPath
  const src = resolveScriptSrc(props.src, pageRelPath, (sourceRelPath) => {
    tsSsgContext.recordScriptEntrypoint(sourceRelPath)
  })
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
) {
  const normalized = toOptionalString(src)
  if (!normalized) {
    throw new Error('PageScript requires a non-empty "src" prop.')
  }
  if (isExternalSrc(normalized)) return normalized
  const { base, suffix } = splitSuffix(normalized)
  const sourceRelPath = resolveSourceRelPath(base, pageRelPath)
  onSourceResolved?.(sourceRelPath)
  return `/${toOutputAssetRelPath(sourceRelPath)}${suffix}`
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

function resolveSourceRelPath(value: string, pageRelPath: string) {
  if (value.startsWith('/')) {
    return trimLeadingSlashes(value)
  }
  const sourceDir = path.posix.dirname(toPosixPath(pageRelPath))
  const normalizedSourceDir = sourceDir === '.' ? '' : sourceDir
  const resolved = path.posix.normalize(
    path.posix.join(normalizedSourceDir, value),
  )
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

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
}

function toOptionalString(value: unknown) {
  if (value === null || value === undefined) return undefined
  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : undefined
}

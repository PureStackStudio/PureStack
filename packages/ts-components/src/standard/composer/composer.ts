import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  observe,
  type Ref,
  type RefOrValue,
  ref,
  type SRef,
  sref,
  unref,
} from 'regor'
import { createAutoId } from '../autoId'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'
import {
  copySafeEmailStyles,
  GMAIL_COMPATIBLE_EMAIL_TAGS,
  normalizeEmailCidUrl,
  sanitizePlainAttribute,
  toSafeEmailImageUrl,
} from './emailHtmlPolicy'

export type ComposerCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'removeFormat'

export interface Composer {
  html?: Ref<string> | SRef<string>
  text?: Ref<string> | SRef<string>
  label?: RefOrValue<string>
  placeholder?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  focusOnMount?: RefOrValue<boolean>
  minHeight?: RefOrValue<number | string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  imagePreviewUrls?: RefOrValue<Record<string, string>>
  classes?: ComputedRef<string>
  editorStyle?: ComputedRef<Record<string, string>>
  sourceId?: string
  editorElement?: ReturnType<typeof sref<HTMLElement | null>>
  sourceHtml?: Ref<string>
  sourceMode?: Ref<boolean>
  format?: (command: ComposerCommand) => void
  createLink?: () => void
  toggleSourceMode?: () => void
  handleInput?: (event: Event) => void
  handlePaste?: (event: ClipboardEvent) => void
  handleDragOver?: (event: DragEvent) => void
  handleDrop?: (event: DragEvent) => void
  handleSourceInput?: (event: Event) => void
}

const composerTemplate = html`<div class="composer-field">
  <span class="composer-field__label" r-if="label">{{ label }}</span>
  <div class="composer" :class="classes">
    <div class="composer__toolbar" role="toolbar" aria-label="Composer tools">
      <button
        class="composer__tool"
        type="button"
        title="Bold"
        aria-label="Bold"
        :disabled="disabled"
        @click="format('bold')">
        <Icon name="lucide:bold"/>
      </button>
      <button
        class="composer__tool"
        type="button"
        title="Italic"
        aria-label="Italic"
        :disabled="disabled"
        @click="format('italic')">
        <Icon name="lucide:italic"/>
      </button>
      <button
        class="composer__tool"
        type="button"
        title="Underline"
        aria-label="Underline"
        :disabled="disabled"
        @click="format('underline')">
        <Icon name="lucide:underline"/>
      </button>
      <span class="composer__divider" aria-hidden="true"></span>
      <button
        class="composer__tool"
        type="button"
        title="Align left"
        aria-label="Align left"
        :disabled="disabled"
        @click="format('justifyLeft')">
        <Icon name="tabler:align-left"/>
      </button>
      <button
        class="composer__tool"
        type="button"
        title="Align center"
        aria-label="Align center"
        :disabled="disabled"
        @click="format('justifyCenter')">
        <Icon name="tabler:align-center"/>
      </button>
      <button
        class="composer__tool"
        type="button"
        title="Align right"
        aria-label="Align right"
        :disabled="disabled"
        @click="format('justifyRight')">
        <Icon name="tabler:align-right"/>
      </button>
      <span class="composer__divider" aria-hidden="true"></span>
      <button
        class="composer__tool"
        type="button"
        title="Bulleted list"
        aria-label="Bulleted list"
        :disabled="disabled"
        @click="format('insertUnorderedList')">
        <Icon name="lucide:list"/>
      </button>
      <button
        class="composer__tool"
        type="button"
        title="Numbered list"
        aria-label="Numbered list"
        :disabled="disabled"
        @click="format('insertOrderedList')">
        <Icon name="lucide:list-ordered"/>
      </button>
      <button
        class="composer__tool"
        type="button"
        title="Link"
        aria-label="Link"
        :disabled="disabled"
        @click="createLink">
        <Icon name="lucide:link"/>
      </button>
      <span class="composer__divider" aria-hidden="true"></span>
      <button
        class="composer__tool"
        type="button"
        title="Clear formatting"
        aria-label="Clear formatting"
        :disabled="disabled"
        @click="format('removeFormat')">
        <Icon name="lucide:eraser"/>
      </button>
      <button
        class="composer__tool composer__tool--source"
        type="button"
        title="HTML source"
        aria-label="HTML source"
        :aria-pressed="sourceMode ? 'true' : 'false'"
        :disabled="disabled"
        @click="toggleSourceMode">
        <Icon name="lucide:code"/>
      </button>
    </div>
    <div class="composer__surface">
      <div
        r-if="!sourceMode"
        class="composer__editor"
        :ref="editorElement"
        :style="editorStyle"
        :contenteditable="disabled ? 'false' : 'true'"
        :data-placeholder="placeholder"
        role="textbox"
        :aria-label="label || placeholder || 'Message body'"
        aria-multiline="true"
        spellcheck="true"
        @input="handleInput"
        @paste="handlePaste"
        @dragover="handleDragOver"
        @drop="handleDrop"></div>
      <textarea
        r-if="sourceMode"
        :id="sourceId"
        class="composer__source"
        :style="editorStyle"
        :disabled="disabled"
        :placeholder="placeholder"
        :aria-label="label || placeholder || 'Message body source'"
        spellcheck="false"
        :value="sourceHtml"
        @input="handleSourceInput"></textarea>
    </div>
  </div>
</div>`

function defineComposerComponent() {
  return defineComponent<Composer>(composerTemplate, {
    props: [
      'html',
      'text',
      'label',
      'placeholder',
      'disabled',
      'focusOnMount',
      'minHeight',
      'tone',
      'variant',
      'imagePreviewUrls',
    ],
    context: (head) => resolveComposer(head),
  })
}

export function defineComposerComponents() {
  return {
    composer: defineComposerComponent(),
  }
}

class ComposerContext implements Composer {
  readonly html: Ref<string> | SRef<string>
  readonly text: Ref<string> | SRef<string>
  readonly label?: RefOrValue<string>
  readonly placeholder?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly focusOnMount?: RefOrValue<boolean>
  readonly minHeight?: RefOrValue<number | string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  readonly imagePreviewUrls?: RefOrValue<Record<string, string>>
  readonly editorElement = sref<HTMLElement | null>(null)
  readonly sourceHtml = ref('')
  readonly sourceMode = ref(false)
  readonly classes: ComputedRef<string>
  readonly editorStyle: ComputedRef<Record<string, string>>
  readonly sourceId: string
  private writingModel = false

  constructor(props: Composer) {
    Object.assign(this, props)
    this.html = props.html ?? ref('')
    this.text = props.text ?? ref('')
    this.classes = computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'surfaceAlt',
      }),
    )
    this.editorStyle = computed<Record<string, string>>(() => ({
      minHeight: resolveCssSize(unref(props.minHeight), '13.75rem'),
    }))
    this.sourceId = resolveComposerSourceId()
    this.sourceHtml(this.sanitizeModelHtml(this.html()))
    this.text(htmlToText(this.sourceHtml()))
    observe(this.editorElement, () => {
      this.syncEditorFromModel()
    })
    observe(this.html, (value) => {
      if (this.writingModel) return
      this.syncFromExternalHtml(value)
    })
    if (typeof this.imagePreviewUrls === 'function') {
      observe(this.imagePreviewUrls, () => {
        this.syncEditorFromModel()
      })
    }
  }

  mounted = () => {
    if (unref(this.focusOnMount)) this.scheduleEditorFocus()
  }

  format = (command: ComposerCommand) => {
    if (unref(this.disabled) || this.sourceMode()) return
    this.focusEditor()
    document.execCommand(command)
    this.syncFromEditor()
  }

  createLink = () => {
    if (unref(this.disabled) || this.sourceMode()) return
    const href = sanitizeHref(prompt('Link URL') ?? '')
    if (!href) return

    this.focusEditor()
    document.execCommand('createLink', false, href)
    this.syncFromEditor()
  }

  toggleSourceMode = () => {
    if (this.sourceMode()) {
      this.writeModel(this.sourceHtml())
      this.sourceMode(false)
      this.syncEditorFromModel()
      return
    }

    this.sourceHtml(this.html())
    this.sourceMode(true)
  }

  handleInput = (_event: Event) => {
    if (unref(this.disabled) || this.sourceMode()) return
    this.syncFromEditor()
  }

  handlePaste = (event: ClipboardEvent) => {
    if (unref(this.disabled) || this.sourceMode()) return

    const data = event.clipboardData
    if (!data) return

    const files = Array.from(data.files ?? [])
    const htmlData = data.getData('text/html')
    const textData = data.getData('text/plain')
    if (files.length > 0) this.emitFiles(event, files)

    event.preventDefault()
    const nextHtml = htmlData
      ? this.sanitizeModelHtml(htmlData)
      : plainTextToHtml(textData)
    if (!nextHtml) return

    this.focusEditor()
    document.execCommand('insertHTML', false, nextHtml)
    this.syncFromEditor()
  }

  handleDragOver = (event: DragEvent) => {
    if (
      unref(this.disabled) ||
      this.sourceMode() ||
      !hasFileTransfer(event.dataTransfer)
    ) {
      return
    }

    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  }

  handleDrop = (event: DragEvent) => {
    if (
      unref(this.disabled) ||
      this.sourceMode() ||
      !hasFileTransfer(event.dataTransfer)
    ) {
      return
    }

    event.preventDefault()
    const files = Array.from(event.dataTransfer?.files ?? [])
    if (files.length > 0) this.emitFiles(event, files)
  }

  handleSourceInput = (event: Event) => {
    if (unref(this.disabled)) return

    const target = event.currentTarget
    if (!(target instanceof HTMLTextAreaElement)) return

    this.sourceHtml(target.value)
    this.writeSourceModel(target.value)
  }

  private syncFromEditor() {
    const element = this.editorElement()
    if (!element) return

    const value = this.readModelHtmlFromEditor(element)
    this.writeModel(value)
    if (!value) this.syncEditorFromModel()
  }

  private syncFromExternalHtml(value: string) {
    const sanitized = this.sanitizeModelHtml(value)
    if (sanitized !== value) {
      this.writeModel(sanitized)
      return
    }

    this.sourceHtml(sanitized)
    this.text(htmlToText(sanitized))
    this.syncEditorFromModel()
  }

  private syncEditorFromModel() {
    const element = this.editorElement()
    if (!element || this.sourceMode()) return

    const sanitized = this.toEditorHtml(this.html())
    if (element.innerHTML !== sanitized) element.innerHTML = sanitized
  }

  private writeModel(value: string) {
    const sanitized = this.sanitizeModelHtml(value)
    this.writingModel = true
    this.html(sanitized)
    this.text(htmlToText(sanitized))
    this.sourceHtml(sanitized)
    this.writingModel = false
  }

  private writeSourceModel(value: string) {
    const sanitized = this.sanitizeModelHtml(value)
    this.writingModel = true
    this.html(sanitized)
    this.text(htmlToText(sanitized))
    this.writingModel = false
  }

  private focusEditor() {
    const element = this.editorElement()
    if (element) element.focus()
  }

  private scheduleEditorFocus(attempt = 0) {
    requestAnimationFrame(() => {
      this.syncEditorFromModel()
      if (this.focusEditorForWriting()) return
      if (attempt >= FOCUS_RETRY_COUNT) return

      setTimeout(
        () => this.scheduleEditorFocus(attempt + 1),
        FOCUS_RETRY_DELAY_MS,
      )
    })
  }

  private focusEditorForWriting() {
    const element = this.editorElement()
    if (!element || this.sourceMode() || unref(this.disabled)) return false
    if (!isVisibleForFocus(element)) return false

    element.focus({ preventScroll: true })
    const target = findWritingStartNode(element)
    const range = document.createRange()
    if (target instanceof Text) {
      range.setStart(target, 0)
    } else {
      range.setStart(target, 0)
    }
    range.collapse(true)

    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    return document.activeElement === element
  }

  private emitFiles(event: Event, files: File[]) {
    const target = event.currentTarget
    if (!(target instanceof EventTarget)) return

    target.dispatchEvent(
      new CustomEvent('files', {
        bubbles: true,
        detail: { files },
      }),
    )
  }

  private sanitizeModelHtml(value: string | undefined) {
    return sanitizeHtml(value, {
      imageUrlResolver: (url) => this.toModelImageUrl(url),
      deferCidImageSrc: true,
    })
  }

  private toEditorHtml(value: string | undefined) {
    const sanitized = sanitizeHtml(value, {
      imageUrlResolver: (url) => this.toEditorImageUrl(url),
    })
    return sanitized || createEmptyEditorHtml(unref(this.placeholder))
  }

  private readModelHtmlFromEditor(element: HTMLElement) {
    if (!hasMeaningfulEditorContent(element)) return ''

    return this.sanitizeModelHtml(element.innerHTML)
  }

  private toEditorImageUrl(value: string) {
    const contentId = normalizeEmailCidUrl(value)
    if (contentId) {
      const previewUrls = this.readImagePreviewUrls()
      const previewUrl = previewUrls[contentId]
      if (typeof previewUrl === 'string' && previewUrl) return previewUrl
      return TRANSPARENT_IMAGE_DATA_URL
    }

    return toSafeEmailImageUrl(value)
  }

  private toModelImageUrl(value: string) {
    const contentId = this.findPreviewContentId(value)
    if (contentId) return `cid:${contentId}`
    return toSafeEmailImageUrl(value)
  }

  private findPreviewContentId(value: string) {
    const urls = this.readImagePreviewUrls()
    for (const [contentId, url] of Object.entries(urls))
      if (url === value) return contentId

    return ''
  }

  private readImagePreviewUrls() {
    return (unref(this.imagePreviewUrls) ?? {}) as Record<string, string>
  }
}

const resolveComposerSourceId = createAutoId('composer-source')
export const COMPOSER_BODY_STYLE = 'padding:1rem'
const FOCUS_RETRY_COUNT = 12
const FOCUS_RETRY_DELAY_MS = 25

function resolveComposer(head: ComponentHead<Composer>) {
  return new ComposerContext(head.props) as Composer
}

export function createComposerBodyHtml(contentHtml = '', placeholder?: string) {
  const placeholderAttribute = placeholder
    ? ` data-placeholder="${escapeHtmlAttribute(placeholder)}"`
    : ''
  return `<div data-puregate-composer-body="true"${placeholderAttribute} style="${COMPOSER_BODY_STYLE}">${contentHtml}</div>`
}

function createEmptyEditorHtml(placeholder: string | undefined) {
  return createComposerBodyHtml('', placeholder)
}

function resolveCssSize(value: number | string | undefined, fallback: string) {
  if (typeof value === 'number') return `${Math.max(0, value)}px`
  if (typeof value === 'string' && value.trim()) return value
  return fallback
}

const COMPOSER_BLOCKED_CONTAINER_TAGS = new Set(['BODY', 'HTML', 'STYLE'])
const DROPPED_TAGS = new Set([
  'AREA',
  'AUDIO',
  'BASE',
  'BUTTON',
  'CANVAS',
  'EMBED',
  'FORM',
  'HEAD',
  'IFRAME',
  'INPUT',
  'LINK',
  'MAP',
  'META',
  'NOSCRIPT',
  'OBJECT',
  'OPTION',
  'SCRIPT',
  'SELECT',
  'SOURCE',
  'STYLE',
  'TEMPLATE',
  'TEXTAREA',
  'TITLE',
  'VIDEO',
])
const ALLOWED_TAGS = new Set(
  Array.from(GMAIL_COMPATIBLE_EMAIL_TAGS).filter(
    (tag) => !COMPOSER_BLOCKED_CONTAINER_TAGS.has(tag),
  ),
)

const TRANSPARENT_IMAGE_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

interface SanitizeHtmlOptions {
  imageUrlResolver?: (url: string) => string | undefined
  deferCidImageSrc?: boolean
}

function sanitizeHtml(
  value: string | undefined,
  options: SanitizeHtmlOptions = {},
) {
  const raw = value ?? ''
  if (!raw.trim()) return ''
  if (typeof document === 'undefined') return escapeHtml(raw.trim())

  const template = document.createElement('template')
  template.innerHTML = raw
  const output = document.createDocumentFragment()
  for (const child of Array.from(template.content.childNodes)) {
    appendSanitizedNode(output, child, options)
  }
  const wrapper = document.createElement('div')
  wrapper.appendChild(output)
  const html = wrapper.innerHTML.trim()
  return options.deferCidImageSrc ? restoreDeferredCidImageSources(html) : html
}

function appendSanitizedNode(
  parent: Node,
  node: Node,
  options: SanitizeHtmlOptions,
) {
  if (node.nodeType === Node.TEXT_NODE) {
    parent.appendChild(document.createTextNode(node.textContent ?? ''))
    return
  }
  if (!(node instanceof HTMLElement)) return

  const tag = node.tagName.toUpperCase()
  if (!ALLOWED_TAGS.has(tag)) {
    if (DROPPED_TAGS.has(tag)) return

    for (const child of Array.from(node.childNodes))
      appendSanitizedNode(parent, child, options)
    return
  }

  if (tag === 'A') {
    const href = sanitizeHref(node.getAttribute('href') ?? '')
    if (!href) {
      for (const child of Array.from(node.childNodes))
        appendSanitizedNode(parent, child, options)
      return
    }
  }
  const imageSrc =
    tag === 'IMG'
      ? sanitizeImageSrc(node.getAttribute('src') ?? '', options)
      : undefined
  if (tag === 'IMG' && !imageSrc) return

  const element = document.createElement(tag.toLowerCase())
  if (tag === 'A') {
    element.setAttribute(
      'href',
      sanitizeHref(node.getAttribute('href') ?? '') ?? '',
    )
    element.setAttribute('target', '_blank')
    element.setAttribute('rel', 'noopener noreferrer')
  }
  if (tag === 'IMG') {
    if (
      options.deferCidImageSrc &&
      imageSrc &&
      normalizeEmailCidUrl(imageSrc)
    ) {
      element.setAttribute('data-puregate-cid-src', imageSrc)
    } else {
      element.setAttribute('src', imageSrc ?? '')
    }
    const alt = sanitizePlainAttribute(node.getAttribute('alt') ?? '')
    const title = sanitizePlainAttribute(node.getAttribute('title') ?? '')
    if (alt) element.setAttribute('alt', alt)
    if (title) element.setAttribute('title', title)
  }

  copyAllowedAttributes(node, element, tag)
  copySafeEmailStyles(node, element, {
    imageUrlResolver: options.imageUrlResolver,
  })

  for (const child of Array.from(node.childNodes))
    appendSanitizedNode(element, child, options)
  parent.appendChild(element)
}

function sanitizeImageSrc(value: string, options: SanitizeHtmlOptions) {
  return options.imageUrlResolver
    ? options.imageUrlResolver(value)
    : toSafeEmailImageUrl(value)
}

function restoreDeferredCidImageSources(html: string) {
  return html.replace(/\sdata-puregate-cid-src="([^"]*)"/g, ' src="$1"')
}

function sanitizeHref(value: string) {
  const parsed = parseUrl(value)
  if (!parsed) return undefined

  if (
    parsed.protocol !== 'http:' &&
    parsed.protocol !== 'https:' &&
    parsed.protocol !== 'mailto:'
  )
    return undefined

  if (parsed.protocol === 'mailto:') return parsed.href
  return parsed.toString()
}

function parseUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (typeof URL === 'undefined') return undefined

  try {
    return new URL(trimmed, globalThis.location?.href ?? 'https://localhost/')
  } catch {
    return undefined
  }
}

function hasFileTransfer(dataTransfer: DataTransfer | null) {
  if (!dataTransfer) return false
  return Array.from(dataTransfer.types).includes('Files')
}

function copyAllowedAttributes(
  source: HTMLElement,
  target: HTMLElement,
  tag: string,
) {
  if (tag === 'TABLE') {
    copyDimensionAttribute(source, target, 'width')
    copyNumberAttribute(source, target, 'border', 0, 20)
    copyNumberAttribute(source, target, 'cellpadding', 0, 80)
    copyNumberAttribute(source, target, 'cellspacing', 0, 80)
    copyKeywordAttribute(source, target, 'align', ['center', 'left', 'right'])
    copyKeywordAttribute(source, target, 'role', ['none', 'presentation'])
    return
  }

  if (tag === 'COL' || tag === 'COLGROUP') {
    copyDimensionAttribute(source, target, 'width')
    copyNumberAttribute(source, target, 'span', 1, 100)
    copyKeywordAttribute(source, target, 'align', ['center', 'left', 'right'])
    return
  }

  if (tag === 'TD' || tag === 'TH') {
    copyDimensionAttribute(source, target, 'width')
    copyDimensionAttribute(source, target, 'height')
    copyNumberAttribute(source, target, 'colspan', 1, 100)
    copyNumberAttribute(source, target, 'rowspan', 1, 100)
    copyKeywordAttribute(source, target, 'align', [
      'center',
      'justify',
      'left',
      'right',
    ])
    copyKeywordAttribute(source, target, 'valign', [
      'baseline',
      'bottom',
      'middle',
      'top',
    ])
    copyKeywordAttribute(source, target, 'aria-hidden', ['false', 'true'])
    return
  }

  if (tag === 'TR') {
    copyKeywordAttribute(source, target, 'align', [
      'center',
      'justify',
      'left',
      'right',
    ])
    copyKeywordAttribute(source, target, 'valign', [
      'baseline',
      'bottom',
      'middle',
      'top',
    ])
  }

  if (tag === 'FONT') {
    copyPlainAttribute(source, target, 'face')
    copyColorAttribute(source, target, 'color')
    copyFontSizeAttribute(source, target, 'size')
    return
  }

  if (tag === 'OL') {
    copyNumberAttribute(source, target, 'start', 1, 9999)
    copyKeywordAttribute(source, target, 'type', ['1', 'a', 'A', 'i', 'I'])
  }
}

function copyPlainAttribute(
  source: HTMLElement,
  target: HTMLElement,
  name: string,
) {
  const value = sanitizePlainAttribute(source.getAttribute(name) ?? '')
  if (value) target.setAttribute(name, value)
}

function copyColorAttribute(
  source: HTMLElement,
  target: HTMLElement,
  name: string,
) {
  const value = sanitizeColorAttribute(source.getAttribute(name) ?? '')
  if (value) target.setAttribute(name, value)
}

function copyFontSizeAttribute(
  source: HTMLElement,
  target: HTMLElement,
  name: string,
) {
  const value = sanitizeFontSizeAttribute(source.getAttribute(name) ?? '')
  if (value) target.setAttribute(name, value)
}

function copyDimensionAttribute(
  source: HTMLElement,
  target: HTMLElement,
  name: string,
) {
  const value = sanitizeHtmlDimension(source.getAttribute(name) ?? '')
  if (value) target.setAttribute(name, value)
}

function copyNumberAttribute(
  source: HTMLElement,
  target: HTMLElement,
  name: string,
  min: number,
  max: number,
) {
  const value = sanitizeIntegerAttribute(
    source.getAttribute(name) ?? '',
    min,
    max,
  )
  if (value) target.setAttribute(name, value)
}

function copyKeywordAttribute(
  source: HTMLElement,
  target: HTMLElement,
  name: string,
  allowed: string[],
) {
  const value = sanitizeKeyword(source.getAttribute(name) ?? '', allowed)
  if (value) target.setAttribute(name, value)
}

function sanitizeHtmlDimension(value: string) {
  const trimmed = value.trim()
  const match = /^(\d{1,4})(%)?$/.exec(trimmed)
  if (!match) return undefined

  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return undefined
  if (match[2]) return `${Math.min(100, Math.max(1, amount))}%`
  return String(Math.min(2400, Math.max(0, amount)))
}

function sanitizeIntegerAttribute(value: string, min: number, max: number) {
  const match = /^\d{1,4}$/.exec(value.trim())
  if (!match) return undefined

  const amount = Number(match[0])
  if (!Number.isFinite(amount)) return undefined
  return String(Math.min(max, Math.max(min, amount)))
}

function sanitizeKeyword(value: string, allowed: string[]) {
  const normalized = value.trim()
  const exactMatch = allowed.find((item) => item === normalized)
  if (exactMatch) return exactMatch

  const match = allowed.find(
    (item) => item.toLowerCase() === normalized.toLowerCase(),
  )
  return match
}

function sanitizeColorAttribute(value: string) {
  const normalized = value.trim()
  if (
    /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalized) ||
    /^[a-z]{3,24}$/i.test(normalized)
  ) {
    return normalized
  }

  return undefined
}

function sanitizeFontSizeAttribute(value: string) {
  const match = /^[+-]?\d$/.exec(value.trim())
  if (!match) return undefined

  const amount = Number(match[0])
  if (!Number.isFinite(amount)) return undefined
  return String(Math.min(7, Math.max(-7, amount)))
}

function htmlToText(value: string) {
  if (!value.trim()) return ''

  const template = document.createElement('template')
  template.innerHTML = sanitizeHtml(value, {
    deferCidImageSrc: true,
  })
  const lines: string[] = []
  collectText(template.content, lines)
  return lines
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function hasMeaningfulEditorContent(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim()
  if (!(node instanceof HTMLElement || node instanceof DocumentFragment))
    return false

  if (node instanceof HTMLElement) {
    const tag = node.tagName.toUpperCase()
    if (tag === 'IMG' || tag === 'HR') return true
    if (tag === 'BR') return false
  }

  for (const child of Array.from(node.childNodes))
    if (hasMeaningfulEditorContent(child)) return true

  return false
}

function findWritingStartNode(root: HTMLElement): Node {
  for (const child of Array.from(root.childNodes)) {
    if (child instanceof HTMLElement && isEmptyWritingBlock(child)) return child
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim())
      return child
  }

  return root
}

function isVisibleForFocus(element: HTMLElement) {
  return element.isConnected && element.getClientRects().length > 0
}

function isEmptyWritingBlock(element: HTMLElement) {
  const tag = element.tagName.toUpperCase()
  if (tag !== 'P' && tag !== 'DIV') return false
  if (element.querySelector('img, table, hr')) return false
  return !element.textContent?.trim()
}

function collectText(node: Node, lines: string[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.replace(/\s+/g, ' ') ?? ''
    if (!text) return
    if (lines.length === 0) lines.push(text)
    else lines[lines.length - 1] += text
    return
  }
  if (!(node instanceof HTMLElement || node instanceof DocumentFragment)) return

  const isBlock =
    node instanceof HTMLElement &&
    [
      'ADDRESS',
      'BLOCKQUOTE',
      'CAPTION',
      'CENTER',
      'DD',
      'DIV',
      'DL',
      'DT',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'HR',
      'LI',
      'OL',
      'P',
      'PRE',
      'TABLE',
      'TBODY',
      'TD',
      'TFOOT',
      'TH',
      'THEAD',
      'TR',
      'UL',
    ].includes(node.tagName.toUpperCase())
  if (isBlock && lines[lines.length - 1]?.trim()) lines.push('')
  if (node instanceof HTMLElement && node.tagName.toUpperCase() === 'BR') {
    lines.push('')
    return
  }

  for (const child of Array.from(node.childNodes)) collectText(child, lines)
  if (isBlock && lines[lines.length - 1]?.trim()) lines.push('')
}

function plainTextToHtml(value: string) {
  const text = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!text) return ''

  return text
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p>${paragraph.split('\n').map(escapeHtml).join('<br>')}</p>`,
    )
    .join('')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeHtmlAttribute(value: string) {
  return escapeHtml(value).replaceAll('`', '&#96;')
}

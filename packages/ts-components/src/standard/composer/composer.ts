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
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'
import {
  copySafeEmailStyles,
  normalizeEmailCidUrl,
  sanitizePlainAttribute,
  toSafeEmailImageUrl,
} from './emailHtmlPolicy'

export type ComposerCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'removeFormat'

export interface Composer {
  html?: Ref<string> | SRef<string>
  text?: Ref<string> | SRef<string>
  label?: RefOrValue<string>
  placeholder?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  minHeight?: RefOrValue<number | string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  imagePreviewUrls?: RefOrValue<Record<string, string>>
  classes?: ComputedRef<string>
  editorStyle?: ComputedRef<Record<string, string>>
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
  handleSourceInput?: () => void
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
        class="composer__source"
        :style="editorStyle"
        :disabled="disabled"
        :placeholder="placeholder"
        :aria-label="label || placeholder || 'Message body source'"
        spellcheck="false"
        r-model="sourceHtml"
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
  readonly minHeight?: RefOrValue<number | string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  readonly imagePreviewUrls?: RefOrValue<Record<string, string>>
  readonly editorElement = sref<HTMLElement | null>(null)
  readonly sourceHtml = ref('')
  readonly sourceMode = ref(false)
  readonly classes: ComputedRef<string>
  readonly editorStyle: ComputedRef<Record<string, string>>
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
      minHeight: resolveCssSize(unref(props.minHeight), '220px'),
    }))
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

  handleSourceInput = () => {
    if (unref(this.disabled)) return
    this.writeModel(this.sourceHtml())
  }

  private syncFromEditor() {
    const element = this.editorElement()
    if (!element) return

    this.writeModel(this.sanitizeModelHtml(element.innerHTML))
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

  private focusEditor() {
    const element = this.editorElement()
    if (element) element.focus()
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
    return sanitizeHtml(value, {
      imageUrlResolver: (url) => this.toEditorImageUrl(url),
    })
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

function resolveComposer(head: ComponentHead<Composer>) {
  return new ComposerContext(head.props) as Composer
}

function resolveCssSize(value: number | string | undefined, fallback: string) {
  if (typeof value === 'number') return `${Math.max(0, value)}px`
  if (typeof value === 'string' && value.trim()) return value
  return fallback
}

const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BR',
  'DIV',
  'EM',
  'I',
  'IMG',
  'LI',
  'OL',
  'P',
  'SPAN',
  'STRONG',
  'TABLE',
  'TBODY',
  'TD',
  'TFOOT',
  'TH',
  'THEAD',
  'TR',
  'U',
  'UL',
])

const TRANSPARENT_IMAGE_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

interface SanitizeHtmlOptions {
  imageUrlResolver?: (url: string) => string | undefined
  deferCidImageSrc?: boolean
}

function sanitizeHtml(value: string | undefined, options: SanitizeHtmlOptions = {}) {
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
    if (options.deferCidImageSrc && imageSrc && normalizeEmailCidUrl(imageSrc)) {
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
  const normalized = value.trim().toLowerCase()
  return allowed.includes(normalized) ? normalized : undefined
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
    ['DIV', 'LI', 'OL', 'P', 'TABLE', 'TBODY', 'TD', 'TH', 'TR', 'UL'].includes(
      node.tagName.toUpperCase(),
    )
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

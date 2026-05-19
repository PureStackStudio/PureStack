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
  sref,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

export type ComposerCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'removeFormat'

export interface Composer {
  html?: Ref<string>
  text?: Ref<string>
  label?: RefOrValue<string>
  placeholder?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  minHeight?: RefOrValue<number | string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
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
  handleSourceInput?: () => void
  unmounted?: () => void
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
        @paste="handlePaste"></div>
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
  readonly html: Ref<string>
  readonly text: Ref<string>
  readonly label?: RefOrValue<string>
  readonly placeholder?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly minHeight?: RefOrValue<number | string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  readonly editorElement = sref<HTMLElement | null>(null)
  readonly sourceHtml = ref('')
  readonly sourceMode = ref(false)
  readonly classes: ComputedRef<string>
  readonly editorStyle: ComputedRef<Record<string, string>>
  private readonly stops: Array<() => void> = []
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
    this.sourceHtml(sanitizeHtml(this.html()))
    this.text(htmlToText(this.sourceHtml()))
    this.stops.push(
      observe(this.editorElement, () => {
        this.syncEditorFromModel()
      }),
      observe(this.html, (value) => {
        if (this.writingModel) return
        this.syncFromExternalHtml(value)
      }),
    )
  }

  unmounted = () => {
    for (const stop of this.stops) stop()
    this.stops.length = 0
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

    event.preventDefault()
    const htmlData = data.getData('text/html')
    const textData = data.getData('text/plain')
    const nextHtml = htmlData
      ? sanitizeHtml(htmlData)
      : plainTextToHtml(textData)
    if (!nextHtml) return

    this.focusEditor()
    document.execCommand('insertHTML', false, nextHtml)
    this.syncFromEditor()
  }

  handleSourceInput = () => {
    if (unref(this.disabled)) return
    this.writeModel(this.sourceHtml())
  }

  private syncFromEditor() {
    const element = this.editorElement()
    if (!element) return

    this.writeModel(element.innerHTML)
  }

  private syncFromExternalHtml(value: string) {
    const sanitized = sanitizeHtml(value)
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

    const sanitized = sanitizeHtml(this.html())
    if (element.innerHTML !== sanitized) element.innerHTML = sanitized
  }

  private writeModel(value: string) {
    const sanitized = sanitizeHtml(value)
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
  'LI',
  'OL',
  'P',
  'SPAN',
  'STRONG',
  'U',
  'UL',
])

function sanitizeHtml(value: string | undefined) {
  const raw = value ?? ''
  if (!raw.trim()) return ''
  if (typeof document === 'undefined') return escapeHtml(raw.trim())

  const template = document.createElement('template')
  template.innerHTML = raw
  const output = document.createDocumentFragment()
  for (const child of Array.from(template.content.childNodes)) {
    appendSanitizedNode(output, child)
  }
  const wrapper = document.createElement('div')
  wrapper.appendChild(output)
  return wrapper.innerHTML.trim()
}

function appendSanitizedNode(parent: Node, node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    parent.appendChild(document.createTextNode(node.textContent ?? ''))
    return
  }
  if (!(node instanceof HTMLElement)) return

  const tag = node.tagName.toUpperCase()
  if (!ALLOWED_TAGS.has(tag)) {
    for (const child of Array.from(node.childNodes)) appendSanitizedNode(parent, child)
    return
  }

  if (tag === 'A') {
    const href = sanitizeHref(node.getAttribute('href') ?? '')
    if (!href) {
      for (const child of Array.from(node.childNodes)) appendSanitizedNode(parent, child)
      return
    }
  }

  const element = document.createElement(tag.toLowerCase())
  if (tag === 'A') {
    element.setAttribute('href', sanitizeHref(node.getAttribute('href') ?? '') ?? '')
    element.setAttribute('target', '_blank')
    element.setAttribute('rel', 'noopener noreferrer')
  }

  for (const child of Array.from(node.childNodes)) appendSanitizedNode(element, child)
  parent.appendChild(element)
}

function sanitizeHref(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (typeof URL === 'undefined') return undefined

  try {
    const parsed = new URL(trimmed, globalThis.location?.href ?? 'https://localhost/')
    if (
      parsed.protocol !== 'http:' &&
      parsed.protocol !== 'https:' &&
      parsed.protocol !== 'mailto:'
    )
      return undefined

    if (parsed.protocol === 'mailto:') return parsed.href
    return parsed.toString()
  } catch {
    return undefined
  }
}

function htmlToText(value: string) {
  if (!value.trim()) return ''

  const template = document.createElement('template')
  template.innerHTML = sanitizeHtml(value)
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
    ['DIV', 'LI', 'OL', 'P', 'UL'].includes(node.tagName.toUpperCase())
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
    .map((paragraph) =>
      `<p>${paragraph
        .split('\n')
        .map(escapeHtml)
        .join('<br>')}</p>`,
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

import cssEscape from 'css.escape'
import { parseHTML } from 'linkedom'

type GlobalKey =
  | 'window'
  | 'document'
  | 'Node'
  | 'Element'
  | 'HTMLElement'
  | 'HTMLSlotElement'
  | 'DocumentFragment'
  | 'CustomEvent'
  | 'Event'
  | 'Comment'
  | 'Text'
  | 'HTMLTemplateElement'
  | 'CSS'

export function registerDomGlobals(
  window: unknown,
  document: unknown,
): () => void {
  const globals = globalThis as Record<string, unknown>
  const original: Partial<Record<GlobalKey, unknown>> = {}
  const keys: GlobalKey[] = [
    'window',
    'document',
    'Node',
    'Element',
    'HTMLElement',
    'HTMLSlotElement',
    'DocumentFragment',
    'CustomEvent',
    'Event',
    'Comment',
    'Text',
    'HTMLTemplateElement',
    'CSS',
  ]

  for (const key of keys) original[key] = globals[key]

  const win = window as Record<string, unknown>
  ensureDocumentCreateRange(document)
  globals.window = window
  globals.document = document
  globals.Node = win.Node
  globals.Element = win.Element
  globals.HTMLElement = win.HTMLElement
  globals.HTMLSlotElement = win.HTMLSlotElement
  globals.DocumentFragment = win.DocumentFragment
  globals.CustomEvent = win.CustomEvent
  globals.Event = win.Event
  globals.Comment = createCommentConstructor(document)
  globals.Text = win.Text
  globals.HTMLTemplateElement = win.HTMLTemplateElement

  const windowCss = win.CSS as { escape?: unknown } | undefined
  globals.CSS =
    windowCss && typeof windowCss.escape === 'function'
      ? windowCss
      : { escape: cssEscape }

  ensureInnerTextSetter(window)

  return () => {
    for (const key of keys) globals[key] = original[key]
  }
}

export function ensureDomGlobals(): () => void {
  const globals = globalThis as Record<string, unknown>
  if (globals.document && globals.window) return () => {}
  const { document, window } = parseHTML('<html><body></body></html>')
  return registerDomGlobals(window, document)
}

function ensureDocumentCreateRange(document: unknown): void {
  const doc = document as Record<string, unknown>
  if (typeof doc.createRange === 'function') return
  doc.createRange = () => {
    const range = {
      setStart() {},
      setEnd() {},
      collapse() {},
      selectNodeContents() {},
      createContextualFragment(html: string) {
        const doc = document as Document
        const container = doc.createElement('div')
        container.innerHTML = html
        const fragment = doc.createDocumentFragment()
        while (container.firstChild) {
          fragment.appendChild(container.firstChild)
        }
        return fragment
      },
    }
    return range as unknown as Range
  }
}

function createCommentConstructor(document: unknown): typeof Comment {
  const doc = document as Document
  const prototype = Object.getPrototypeOf(doc.createComment(''))
  const CommentShim = function Comment(this: Comment, data?: string) {
    return doc.createComment(data ?? '')
  } as unknown as typeof Comment
  CommentShim.prototype = prototype
  return CommentShim
}

function ensureInnerTextSetter(window: unknown): void {
  const win = window as Record<string, unknown>
  const elementProto = (win.HTMLElement as typeof HTMLElement | undefined)
    ?.prototype
  const nodeProto = (win.Node as typeof Node | undefined)?.prototype
  const setter = function (this: Node, value: unknown) {
    this.textContent = value == null ? '' : String(value)
  }
  const getter = function (this: Node) {
    return this.textContent ?? ''
  }

  for (const proto of [elementProto, nodeProto]) {
    if (!proto) continue
    const desc = Object.getOwnPropertyDescriptor(proto, 'innerText')
    if (desc?.set) continue
    Object.defineProperty(proto, 'innerText', {
      configurable: true,
      enumerable: true,
      get: getter,
      set: setter,
    })
  }
}

import cssEscape from 'css.escape'

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const RAW_TEXT_ELEMENTS = new Set(['script', 'style', 'textarea'])

export const enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_FRAGMENT_NODE = 11,
}

export type MiniWindow = {
  window: MiniWindow
  document: MiniDocument
  Node: typeof MiniNode
  Element: typeof MiniElement
  HTMLElement: typeof MiniHTMLElement
  HTMLSlotElement: typeof MiniHTMLSlotElement
  DocumentFragment: typeof MiniDocumentFragment
  HTMLTemplateElement: typeof MiniHTMLTemplateElement
  CustomEvent: typeof MiniCustomEvent
  Event: typeof MiniEvent
  Comment: typeof MiniComment
  Text: typeof MiniText
  CSS: { escape: (value: string) => string }
}

export function parseHtml(html: string) {
  const document = new MiniDocument()
  const fragment = parseFragment(html, document)
  document.appendChild(fragment)
  document.linkHtmlBody()
  const window = createWindow(document)
  return { document, window }
}

export function parseFragment(html: string, document?: MiniDocument) {
  const doc = document ?? new MiniDocument()
  const fragment = doc.createDocumentFragment()
  parseInto(html, doc, fragment)
  return fragment
}

function createWindow(document: MiniDocument): MiniWindow {
  const window: MiniWindow = {
    window: undefined as unknown as MiniWindow,
    document,
    Node: MiniNode,
    Element: MiniElement,
    HTMLElement: MiniHTMLElement,
    HTMLSlotElement: MiniHTMLSlotElement,
    DocumentFragment: MiniDocumentFragment,
    HTMLTemplateElement: MiniHTMLTemplateElement,
    CustomEvent: MiniCustomEvent,
    Event: MiniEvent,
    Comment: MiniComment,
    Text: MiniText,
    CSS: { escape: cssEscape },
  }
  window.window = window
  return window
}

class MiniNode {
  static ELEMENT_NODE = NodeType.ELEMENT_NODE
  static TEXT_NODE = NodeType.TEXT_NODE
  static COMMENT_NODE = NodeType.COMMENT_NODE
  static DOCUMENT_NODE = NodeType.DOCUMENT_NODE
  static DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE

  nodeType: NodeType
  parentNode: MiniNode | null = null
  _ownerDocument: MiniDocument | null = null
  childNodes: MiniNode[] = []

  constructor(type: NodeType) {
    this.nodeType = type
  }

  get nextSibling(): MiniNode | null {
    if (!this.parentNode) return null
    const siblings = this.parentNode.childNodes
    const index = siblings.indexOf(this)
    return index >= 0 ? siblings[index + 1] ?? null : null
  }

  get parentElement(): MiniElement | null {
    return this.parentNode instanceof MiniElement ? this.parentNode : null
  }

  get firstChild(): MiniNode | null {
    return this.childNodes[0] ?? null
  }

  get lastChild(): MiniNode | null {
    return this.childNodes[this.childNodes.length - 1] ?? null
  }

  get ownerDocument(): MiniDocument | null {
    if (this instanceof MiniDocument) return this
    if (this._ownerDocument) return this._ownerDocument
    let node: MiniNode | null = this.parentNode
    while (node) {
      if (node instanceof MiniDocument) return node
      if (node._ownerDocument) return node._ownerDocument
      node = node.parentNode
    }
    return null
  }

  get previousSibling(): MiniNode | null {
    if (!this.parentNode) return null
    const siblings = this.parentNode.childNodes
    const index = siblings.indexOf(this)
    return index > 0 ? siblings[index - 1] ?? null : null
  }

  appendChild(node: MiniNode): MiniNode {
    return insertNode(this, node, null)
  }

  insertBefore(node: MiniNode, ref: MiniNode | null): MiniNode {
    return insertNode(this, node, ref)
  }

  removeChild(node: MiniNode) {
    const index = this.childNodes.indexOf(node)
    if (index === -1) return node
    this.childNodes.splice(index, 1)
    node.parentNode = null
    return node
  }

  replaceChildren(...nodes: MiniNode[]) {
    for (const child of [...this.childNodes]) {
      this.removeChild(child)
    }
    for (const node of nodes) {
      this.appendChild(node)
    }
  }

  remove() {
    this.parentNode?.removeChild(this)
  }

  replaceWith(...nodes: MiniNode[]) {
    const parent = this.parentNode
    if (!parent) return
    const ref = this.nextSibling
    parent.removeChild(this)
    for (const node of nodes) {
      parent.insertBefore(node, ref)
    }
  }

  cloneNode(deep?: boolean): MiniNode {
    void deep
    return new MiniNode(this.nodeType)
  }

  get textContent(): string {
    return ''
  }

  set textContent(_value: string) {
    this.replaceChildren()
  }

  addEventListener(type: string, listener: (...args: unknown[]) => void): void {
    void type
    void listener
  }

  removeEventListener(
    type: string,
    listener: (...args: unknown[]) => void,
  ): void {
    void type
    void listener
  }

  dispatchEvent(event: MiniEvent): boolean {
    void event
    return true
  }

  get innerText(): string {
    return this.textContent
  }

  set innerText(value: string) {
    this.textContent = value
  }
}

class MiniDocument extends MiniNode {
  documentElement: MiniElement | null = null
  body: MiniElement | null = null

  constructor() {
    super(NodeType.DOCUMENT_NODE)
  }

  createElement(tagName: string) {
    const lower = tagName.toLowerCase()
    const el =
      lower === 'template'
        ? new MiniHTMLTemplateElement()
        : lower === 'slot'
          ? new MiniHTMLSlotElement()
          : new MiniHTMLElement(tagName)
    el._ownerDocument = this
    if (el instanceof MiniHTMLTemplateElement) {
      el.content._ownerDocument = this
    }
    return el
  }

  createElementNS(namespace: string, tagName: string) {
    const el = new MiniHTMLElement(tagName)
    el.namespaceURI = namespace
    el._ownerDocument = this
    return el
  }

  createTextNode(data: string) {
    const node = new MiniText(data)
    node._ownerDocument = this
    return node
  }

  createComment(data: string) {
    const node = new MiniComment(data)
    node._ownerDocument = this
    return node
  }

  createDocumentFragment() {
    const node = new MiniDocumentFragment()
    node._ownerDocument = this
    return node
  }

  createRange() {
    return {
      setStart() {},
      setEnd() {},
      collapse() {},
      selectNodeContents() {},
      createContextualFragment: (html: string) =>
        parseFragment(html, this),
    }
  }

  querySelector(selector: string): MiniElement | null {
    return querySelectorFrom(this, selector, true)
  }

  querySelectorAll(selector: string): MiniElement[] {
    return querySelectorAllFrom(this, selector)
  }

  linkHtmlBody() {
    const html = this.querySelector('html')
    if (html && html instanceof MiniElement) {
      this.documentElement = html
      const body = html.querySelector('body')
      if (body && body instanceof MiniElement) {
        this.body = body
      }
    }
    if (!this.body) {
      const body = this.querySelector('body')
      if (body && body instanceof MiniElement) {
        this.body = body
      }
    }
  }

  override cloneNode(deep?: boolean): MiniNode {
    const clone = new MiniDocument()
    if (deep) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(true))
      }
      clone.linkHtmlBody()
    }
    return clone
  }
}

class MiniDocumentFragment extends MiniNode {
  constructor() {
    super(NodeType.DOCUMENT_FRAGMENT_NODE)
  }

  querySelector(selector: string): MiniElement | null {
    return querySelectorFrom(this, selector, true)
  }

  querySelectorAll(selector: string): MiniElement[] {
    return querySelectorAllFrom(this, selector)
  }

  override cloneNode(deep?: boolean): MiniNode {
    const clone = new MiniDocumentFragment()
    if (deep) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(true))
      }
    }
    return clone
  }
}

class MiniElement extends MiniNode {
  tagName: string
  namespaceURI: string | null = null
  private attributes = new Map<string, string>()
  classList: ClassList
  style: StyleDeclaration
  value: string = ''

  constructor(tagName: string) {
    super(NodeType.ELEMENT_NODE)
    this.tagName = tagName.toUpperCase()
    this.classList = new ClassList(this)
    this.style = createStyleDeclaration()
  }

  getAttribute(name: string) {
    const key = name.toLowerCase()
    const value = this.attributes.get(key)
    return value === undefined ? null : value
  }

  setAttribute(name: string, value: string) {
    const key = name.toLowerCase()
    const normalized = value == null ? '' : String(value)
    this.attributes.set(key, normalized)
  }

  removeAttribute(name: string) {
    const key = name.toLowerCase()
    this.attributes.delete(key)
  }

  getAttributeNS(_ns: string, name: string) {
    return this.getAttribute(name)
  }

  setAttributeNS(_ns: string, name: string, value: string) {
    this.setAttribute(name, value)
  }

  removeAttributeNS(_ns: string, name: string) {
    this.removeAttribute(name)
  }

  hasAttribute(name: string) {
    return this.attributes.has(name.toLowerCase())
  }

  getAttributeNames() {
    return [...this.attributes.keys()]
  }

  get className() {
    return this.getAttribute('class') ?? ''
  }

  set className(value: string) {
    if (!value) {
      this.removeAttribute('class')
      return
    }
    this.setAttribute('class', String(value))
  }

  get nextElementSibling(): MiniElement | null {
    if (!this.parentNode) return null
    const siblings = this.parentNode.childNodes
    const index = siblings.indexOf(this)
    for (let i = index + 1; i < siblings.length; i += 1) {
      const node = siblings[i]
      if (node instanceof MiniElement) return node
    }
    return null
  }

  get previousElementSibling(): MiniElement | null {
    if (!this.parentNode) return null
    const siblings = this.parentNode.childNodes
    const index = siblings.indexOf(this)
    for (let i = index - 1; i >= 0; i -= 1) {
      const node = siblings[i]
      if (node instanceof MiniElement) return node
    }
    return null
  }

  get innerHTML(): string {
    return this.childNodes.map((node) => serializeNode(node)).join('')
  }

  set innerHTML(value: string) {
    const doc = this.ownerDocument ?? new MiniDocument()
    const fragment = parseFragment(value, doc)
    this.replaceChildren(...fragment.childNodes)
  }

  get outerHTML(): string {
    return serializeNode(this)
  }

  override get textContent(): string {
    return this.childNodes.map((node) => node.textContent).join('')
  }

  override set textContent(value: string) {
    this.replaceChildren()
    if (value != null && value !== '') {
      const doc = this.ownerDocument ?? new MiniDocument()
      this.appendChild(doc.createTextNode(String(value)))
    }
  }

  querySelector(selector: string): MiniElement | null {
    return querySelectorFrom(this, selector, true)
  }

  querySelectorAll(selector: string): MiniElement[] {
    return querySelectorAllFrom(this, selector)
  }

  matches(selector: string) {
    const compiledSelectors = getCompiledSelectors(selector)
    for (const compiled of compiledSelectors) {
      if (matchesCompiledSelector(this, compiled)) return true
    }
    return false
  }

  override cloneNode(deep?: boolean): MiniNode {
    if (this instanceof MiniHTMLTemplateElement) {
      const clone = new MiniHTMLTemplateElement()
      clone._ownerDocument = this.ownerDocument
      clone.content._ownerDocument = clone._ownerDocument
      for (const [key, value] of this.attributes.entries()) {
        clone.setAttribute(key, value)
      }
      if (deep) {
        for (const child of this.content.childNodes) {
          clone.content.appendChild(child.cloneNode(true))
        }
      }
      return clone
    }
    const clone =
      this.tagName.toLowerCase() === 'slot'
        ? new MiniHTMLSlotElement()
        : new MiniHTMLElement(this.tagName)
    clone.namespaceURI = this.namespaceURI
    clone._ownerDocument = this.ownerDocument
    for (const [key, value] of this.attributes.entries()) {
      clone.setAttribute(key, value)
    }
    if (deep) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(true))
      }
    }
    return clone
  }

}

class MiniHTMLElement extends MiniElement {}

class MiniHTMLTemplateElement extends MiniHTMLElement {
  content: MiniDocumentFragment

  constructor() {
    super('template')
    this.content = new MiniDocumentFragment()
    this.childNodes = this.content.childNodes
  }

  override cloneNode(deep?: boolean): MiniNode {
    const clone = new MiniHTMLTemplateElement()
    clone._ownerDocument = this.ownerDocument
    clone.content._ownerDocument = clone._ownerDocument
    for (const [key, value] of this.getAttributeNames().map((name) => [
      name,
      this.getAttribute(name) ?? '',
    ])) {
      clone.setAttribute(key, value)
    }
    if (deep) {
      for (const child of this.content.childNodes) {
        clone.content.appendChild(child.cloneNode(true))
      }
    }
    return clone
  }
}

class MiniHTMLSlotElement extends MiniHTMLElement {
  constructor() {
    super('slot')
  }

  get name(): string {
    return this.getAttribute('name') ?? ''
  }

  set name(value: string) {
    if (!value) {
      this.removeAttribute('name')
      return
    }
    this.setAttribute('name', value)
  }
}

class MiniText extends MiniNode {
  data: string

  constructor(data: string) {
    super(NodeType.TEXT_NODE)
    this.data = data
  }

  override get textContent(): string {
    return this.data
  }

  override set textContent(value: string) {
    this.data = value ?? ''
  }

  override cloneNode(): MiniNode {
    return new MiniText(this.data)
  }
}

class MiniComment extends MiniNode {
  data: string

  constructor(data: string) {
    super(NodeType.COMMENT_NODE)
    this.data = data
  }

  override get textContent(): string {
    return this.data
  }

  override set textContent(value: string) {
    this.data = value ?? ''
  }

  override cloneNode(): MiniNode {
    return new MiniComment(this.data)
  }
}

class MiniEvent {
  type: string
  constructor(type: string) {
    this.type = type
  }
}

class MiniCustomEvent extends MiniEvent {
  detail: unknown
  constructor(type: string, detail?: unknown) {
    super(type)
    this.detail = detail
  }
}

class ClassList {
  private el: MiniElement
  constructor(el: MiniElement) {
    this.el = el
  }

  private getTokens() {
    const raw = this.el.getAttribute('class') ?? ''
    return raw.split(/\s+/).filter(Boolean)
  }

  private setTokens(tokens: string[]) {
    if (tokens.length === 0) {
      this.el.removeAttribute('class')
      return
    }
    this.el.setAttribute('class', tokens.join(' '))
  }

  add(...tokens: string[]) {
    const current = new Set(this.getTokens())
    for (const token of tokens) {
      if (token) current.add(token)
    }
    this.setTokens([...current])
  }

  remove(...tokens: string[]) {
    const current = new Set(this.getTokens())
    for (const token of tokens) {
      current.delete(token)
    }
    this.setTokens([...current])
  }

  contains(token: string) {
    return this.getTokens().includes(token)
  }
}

type StyleMap = Record<string, string>

function createStyleDeclaration() {
  const state: StyleMap = {}
  const api = {
    get cssText() {
      return Object.entries(state)
        .map(([key, value]) => `${key}:${value}`)
        .join(';')
    },
    set cssText(value: string) {
      for (const key of Object.keys(state)) delete state[key]
      const parts = String(value ?? '').split(';')
      for (const part of parts) {
        const [prop, val] = part.split(':')
        if (!prop) continue
        state[prop.trim()] = (val ?? '').trim()
      }
    },
    setProperty(key: string, value: string, priority?: string) {
      void priority
      state[key] = String(value ?? '')
    },
    removeProperty(key: string) {
      delete state[key]
    },
    getPropertyValue(key: string) {
      return state[key] ?? ''
    },
  }

  return new Proxy(api, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in state) return state[prop]
      return (target as Record<string, unknown>)[prop as string]
    },
    set(target, prop, value) {
      if (typeof prop === 'string' && !(prop in target)) {
        state[prop] = String(value ?? '')
        return true
      }
      ;(target as Record<string, unknown>)[prop as string] = value
      return true
    },
  })
}

type StyleDeclaration = ReturnType<typeof createStyleDeclaration>

function insertNode(
  parent: MiniNode,
  node: MiniNode,
  ref: MiniNode | null,
): MiniNode {
  if (node instanceof MiniDocumentFragment) {
    const children = [...node.childNodes]
    node.replaceChildren()
    for (const child of children) {
      insertNode(parent, child, ref)
    }
    return node
  }

  if (node.childNodes.length > 0) {
    let cursor: MiniNode | null = parent
    while (cursor) {
      if (cursor === node) {
        throw new Error('Cannot insert an ancestor into its descendant')
      }
      cursor = cursor.parentNode
    }
  }

  if (node.parentNode) {
    node.parentNode.removeChild(node)
  }
  const index = ref ? parent.childNodes.indexOf(ref) : -1
  if (index === -1 || ref == null) {
    parent.childNodes.push(node)
  } else {
    parent.childNodes.splice(index, 0, node)
  }
  node.parentNode = parent
  if (!node._ownerDocument && parent instanceof MiniDocument) {
    node._ownerDocument = parent
  } else if (!node._ownerDocument && parent._ownerDocument) {
    node._ownerDocument = parent._ownerDocument
  }
  return node
}

function parseInto(
  html: string,
  document: MiniDocument,
  root: MiniNode,
  inRawText = false,
) {
  let index = 0
  const stack: Array<{ node: MiniNode; container: MiniNode }> = [
    { node: root, container: root },
  ]

  const current = () => stack[stack.length - 1]?.container ?? root

  while (index < html.length) {
    if (inRawText) {
      appendText(current(), html.slice(index), document)
      break
    }
    const lt = html.indexOf('<', index)
    if (lt === -1) {
      const text = html.slice(index)
      appendText(current(), text, document)
      break
    }
    if (lt > index) {
      appendText(current(), html.slice(index, lt), document)
      index = lt
    }

    if (html.startsWith('<!--', index)) {
      const end = html.indexOf('-->', index + 4)
      const content =
        end === -1 ? html.slice(index + 4) : html.slice(index + 4, end)
      current().appendChild(document.createComment(content))
      index = end === -1 ? html.length : end + 3
      continue
    }

    if (html.startsWith('<!DOCTYPE', index) || html.startsWith('<!doctype', index)) {
      const end = html.indexOf('>', index + 2)
      index = end === -1 ? html.length : end + 1
      continue
    }

    if (html[index + 1] === '/') {
      const closeEnd = html.indexOf('>', index + 2)
      const tagName = html
        .slice(index + 2, closeEnd === -1 ? html.length : closeEnd)
        .trim()
        .toLowerCase()
      for (let i = stack.length - 1; i > 0; i -= 1) {
        const node = stack[i].node
        if (node instanceof MiniElement) {
          const name = node.tagName.toLowerCase()
          stack.pop()
          if (name === tagName) break
        }
      }
      index = closeEnd === -1 ? html.length : closeEnd + 1
      continue
    }

    const tagMatch = /^<\s*([a-zA-Z0-9:_-]+)/.exec(html.slice(index))
    if (!tagMatch) {
      index += 1
      continue
    }
    const tagName = tagMatch[1].toLowerCase()
    const start = index + tagMatch[0].length
    const { attrs, end, selfClosing } = parseAttributes(html, start)
    const isVoid = VOID_ELEMENTS.has(tagName)
    const element = document.createElement(tagName)
    for (const [key, value] of attrs.entries()) {
      element.setAttribute(key, value)
    }
    current().appendChild(element)
    index = end

    if (selfClosing || isVoid) continue

    if (RAW_TEXT_ELEMENTS.has(tagName)) {
      const close = html.toLowerCase().indexOf(`</${tagName}`, index)
      const rawText =
        close === -1 ? html.slice(index) : html.slice(index, close)
      appendText(element, rawText, document)
      if (close !== -1) {
        const closeEnd = html.indexOf('>', close + tagName.length + 2)
        index = closeEnd === -1 ? html.length : closeEnd + 1
      } else {
        index = html.length
      }
      continue
    }

    if (element instanceof MiniHTMLTemplateElement) {
      stack.push({ node: element, container: element.content })
    } else {
      stack.push({ node: element, container: element })
    }
  }
}

function appendText(parent: MiniNode, text: string, document: MiniDocument) {
  if (!text) return
  if (RAW_TEXT_ELEMENTS.has((parent as MiniElement).tagName?.toLowerCase?.())) {
    parent.appendChild(document.createTextNode(text))
    return
  }
  const decoded = decodeEntities(text)
  parent.appendChild(document.createTextNode(decoded))
}

function parseAttributes(input: string, start: number) {
  const attrs = new Map<string, string>()
  let i = start
  let selfClosing = false
  while (i < input.length) {
    const ch = input[i]
    if (ch === '>') {
      i += 1
      break
    }
    if (ch === '/' && input[i + 1] === '>') {
      selfClosing = true
      i += 2
      break
    }
    if (/\s/.test(ch)) {
      i += 1
      continue
    }
    const nameStart = i
    while (i < input.length && /[^\s=/>]/.test(input[i])) i += 1
    const name = input.slice(nameStart, i).toLowerCase()
    while (i < input.length && /\s/.test(input[i])) i += 1
    let value = ''
    if (input[i] === '=') {
      i += 1
      while (i < input.length && /\s/.test(input[i])) i += 1
      const quote = input[i]
      if (quote === '"' || quote === "'") {
        i += 1
        const endQuote = input.indexOf(quote, i)
        const raw = input.slice(i, endQuote === -1 ? input.length : endQuote)
        value = decodeEntities(raw)
        i = endQuote === -1 ? input.length : endQuote + 1
      } else {
        const valueStart = i
        while (i < input.length && /[^\s>/]/.test(input[i])) i += 1
        value = decodeEntities(input.slice(valueStart, i))
        if (input[i] === '/' && input[i + 1] === '>') {
          selfClosing = true
          i += 2
          attrs.set(name, value)
          break
        }
      }
    }
    if (nameStart === i) {
      i += 1
      continue
    }
    attrs.set(name, value)
  }
  return { attrs, end: i, selfClosing }
}

function decodeEntities(value: string) {
  const safeCodePoint = (code: number) => {
    if (!Number.isFinite(code)) return '\uFFFD'
    if (code < 0 || code > 0x10ffff) return '\uFFFD'
    return String.fromCodePoint(code)
  }
  return value
    .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex: string) =>
      safeCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);?/g, (_, dec: string) =>
      safeCodePoint(Number.parseInt(dec, 10)),
    )
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function escapeText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value: string) {
  return escapeText(value).replace(/"/g, '&quot;')
}

function serializeNode(node: MiniNode, rawText = false): string {
  if (node instanceof MiniText) return rawText ? node.data : escapeText(node.data)
  if (node instanceof MiniComment) return `<!--${node.data}-->`
  if (node instanceof MiniDocumentFragment || node instanceof MiniDocument) {
    return node.childNodes.map((child) => serializeNode(child)).join('')
  }
  if (node instanceof MiniHTMLTemplateElement) {
    const attrs = serializeAttributes(node)
    const content = node.content.childNodes
      .map((child) => serializeNode(child))
      .join('')
    return `<template${attrs}>${content}</template>`
  }
  if (node instanceof MiniElement) {
    const tag = node.tagName.toLowerCase()
    const attrs = serializeAttributes(node)
    const isRaw = RAW_TEXT_ELEMENTS.has(tag)
    const children = node.childNodes
      .map((child) => serializeNode(child, isRaw))
      .join('')
    if (VOID_ELEMENTS.has(tag)) return `<${tag}${attrs}>`
    return `<${tag}${attrs}>${children}</${tag}>`
  }
  return ''
}

function serializeAttributes(el: MiniElement) {
  const names = el.getAttributeNames()
  if (names.length === 0) return ''
  return names
    .map((name) => {
      const value = el.getAttribute(name)
      if (value == null || value === '') return ` ${name}`
      return ` ${name}="${escapeAttribute(String(value))}"`
    })
    .join('')
}

type SelectorPart = {
  tag: string | null
  id: string | null
  classes: string[]
  attrs: Array<{ name: string; value?: string }>
  notParts: SelectorPart[]
}

type SelectorStep = {
  part: SelectorPart
  combinatorToPrev: ' ' | '>' | null
}

type FastSelector =
  | { kind: 'any' }
  | { kind: 'tag'; tag: string }
  | { kind: 'attr'; name: string; value?: string }
  | { kind: 'tagAttr'; tag: string; name: string; value?: string }

type CompiledSelector = {
  chain: SelectorStep[]
  fast: FastSelector | null
}

const selectorListCache = new Map<string, CompiledSelector[]>()

function getCompiledSelectors(selector: string) {
  const key = selector.trim()
  const cached = selectorListCache.get(key)
  if (cached) return cached
  const compiled = splitSelectorList(key)
    .map((sel) => {
      const chain = parseSelectorChain(sel)
      return {
        chain,
        fast: toFastSelector(chain),
      }
    })
    .filter((entry) => entry.chain.length > 0)
  selectorListCache.set(key, compiled)
  return compiled
}

function toFastSelector(chain: SelectorStep[]): FastSelector | null {
  if (chain.length !== 1) return null
  if (chain[0].combinatorToPrev !== null) return null
  const part = chain[0].part
  if (part.notParts.length > 0) return null
  if (part.id) return null
  if (part.classes.length > 0) return null
  if (part.attrs.length > 1) return null

  if (part.attrs.length === 0) {
    if (part.tag === '*') return { kind: 'any' }
    if (part.tag) return { kind: 'tag', tag: part.tag }
    return null
  }

  const attr = part.attrs[0]
  if (part.tag && part.tag !== '*') {
    return {
      kind: 'tagAttr',
      tag: part.tag,
      name: attr.name,
      value: attr.value,
    }
  }
  return {
    kind: 'attr',
    name: attr.name,
    value: attr.value,
  }
}

function matchesFastSelector(el: MiniElement, fast: FastSelector) {
  if (fast.kind === 'any') return true
  if (fast.kind === 'tag') return el.tagName.toLowerCase() === fast.tag
  if (fast.kind === 'attr') {
    if (!el.hasAttribute(fast.name)) return false
    if (fast.value === undefined) return true
    return el.getAttribute(fast.name) === fast.value
  }
  if (el.tagName.toLowerCase() !== fast.tag) return false
  if (!el.hasAttribute(fast.name)) return false
  if (fast.value === undefined) return true
  return el.getAttribute(fast.name) === fast.value
}

function matchesCompiledSelector(el: MiniElement, compiled: CompiledSelector) {
  if (compiled.fast) return matchesFastSelector(el, compiled.fast)
  return matchesSelectorChain(el, compiled.chain)
}

function findFirstMatchingElement(
  root: MiniNode,
  match: (el: MiniElement) => boolean,
) {
  const stack: MiniNode[] = []
  const pushChildren = (node: MiniNode) => {
    for (let i = node.childNodes.length - 1; i >= 0; i -= 1) {
      stack.push(node.childNodes[i])
    }
  }
  if (root instanceof MiniDocument || root instanceof MiniDocumentFragment) {
    pushChildren(root)
  } else if (root instanceof MiniElement) {
    pushChildren(root)
  }

  while (stack.length > 0) {
    const node = stack.pop()
    if (!(node instanceof MiniElement)) continue
    if (match(node)) return node
    if (!(node instanceof MiniHTMLTemplateElement)) {
      pushChildren(node)
    }
  }
  return null
}

function querySelectorFrom(
  root: MiniNode,
  selector: string,
  firstOnly: true,
): MiniElement | null
function querySelectorFrom(
  root: MiniNode,
  selector: string,
  firstOnly: false,
): MiniElement[]
function querySelectorFrom(
  root: MiniNode,
  selector: string,
  firstOnly: boolean,
): MiniElement | MiniElement[] | null {
  if (!firstOnly) return querySelectorAllFrom(root, selector, false)
  const compiledSelectors = getCompiledSelectors(selector)
  if (compiledSelectors.length === 0) return null
  return findFirstMatchingElement(root, (el) =>
    compiledSelectors.some((compiled) => matchesCompiledSelector(el, compiled)),
  )
}

function querySelectorAllFrom(
  root: MiniNode,
  selector: string,
  filterTemplates = true,
) {
  const rawSelector = selector.trim()
  const compiledSelectors = getCompiledSelectors(rawSelector)
  if (compiledSelectors.length === 0) return []
  const nodes = collectElements(root)
  const results: MiniElement[] = []
  if (compiledSelectors.length === 1) {
    const compiled = compiledSelectors[0]
    for (const el of nodes) {
      if (matchesCompiledSelector(el, compiled)) results.push(el)
    }
  } else {
    for (const el of nodes) {
      if (compiledSelectors.some((compiled) => matchesCompiledSelector(el, compiled))) {
        results.push(el)
      }
    }
  }
  if (filterTemplates && rawSelector === 'template') {
    return results.filter((el) => {
      if (el.tagName.toLowerCase() !== 'template') return true
      if (el.hasAttribute('name')) return false
      const hasNamedSlot = el
        .getAttributeNames()
        .some((name) => name.startsWith('#'))
      return !hasNamedSlot
    })
  }
  return results
}

function splitSelectorList(selector: string) {
  const result: string[] = []
  let start = 0
  let depth = 0
  for (let i = 0; i < selector.length; i += 1) {
    const ch = selector[i]
    if (ch === '[' || ch === '(') depth += 1
    else if (ch === ']' || ch === ')') depth = Math.max(0, depth - 1)
    else if (ch === ',' && depth === 0) {
      result.push(selector.slice(start, i).trim())
      start = i + 1
    }
  }
  const tail = selector.slice(start).trim()
  if (tail) result.push(tail)
  return result
}

function parseSelectorChain(selector: string) {
  const parts: SelectorStep[] = []
  let current = ''
  let depth = 0
  let pending: ' ' | '>' | null = null
  let i = 0

  const pushCurrent = () => {
    const trimmed = current.trim()
    if (!trimmed) return
    parts.push({
      part: parseSelectorPart(trimmed),
      combinatorToPrev: pending,
    })
    current = ''
    pending = ' '
  }

  while (i < selector.length) {
    const ch = selector[i]
    if (ch === '[' || ch === '(') depth += 1
    if (ch === ']' || ch === ')') depth = Math.max(0, depth - 1)

    if (depth === 0 && (ch === '+' || ch === '~')) {
      return []
    }

    if (depth === 0 && ch === '>') {
      pushCurrent()
      pending = '>'
      i += 1
      while (i < selector.length && /\s/.test(selector[i])) i += 1
      continue
    }

    if (depth === 0 && /\s/.test(ch)) {
      pushCurrent()
      pending = pending ?? ' '
      i += 1
      while (i < selector.length && /\s/.test(selector[i])) i += 1
      continue
    }

    current += ch
    i += 1
  }

  pushCurrent()
  if (parts.length > 0 && parts[0]?.combinatorToPrev) {
    parts[0].combinatorToPrev = null
  }
  return parts
}

function parseSelectorPart(part: string): SelectorPart {
  const notParts: SelectorPart[] = []
  let base = ''
  let i = 0

  while (i < part.length) {
    if (part.startsWith(':not(', i)) {
      const end = part.indexOf(')', i + 5)
      const raw = part.slice(i + 5, end === -1 ? part.length : end).trim()
      const parsed = parseSimpleSelectorPart(raw)
      if (parsed) notParts.push(parsed)
      i = end === -1 ? part.length : end + 1
      continue
    }
    base += part[i]
    i += 1
  }

  const basePart = parseSimpleSelectorPart(base.trim()) ?? {
    tag: null,
    id: null,
    classes: [],
    attrs: [],
    notParts: [],
  }
  basePart.notParts = notParts
  return basePart
}

function parseSimpleSelectorPart(part: string): SelectorPart | null {
  if (!part) {
    return {
      tag: null,
      id: null,
      classes: [],
      attrs: [],
      notParts: [],
    }
  }
  if (/[\s>+~,]/.test(part)) return null
  let tag: string | null = null
  let id: string | null = null
  const classes: string[] = []
  const attrs: Array<{ name: string; value?: string }> = []
  let i = 0

  if (part.startsWith('*')) {
    tag = '*'
    i += 1
  } else if (/[a-zA-Z]/.test(part[0])) {
    const start = i
    while (i < part.length && /[a-zA-Z0-9:_-]/.test(part[i])) i += 1
    tag = part.slice(start, i).toLowerCase()
  }

  while (i < part.length) {
    const ch = part[i]
    if (ch === '#') {
      i += 1
      const start = i
      while (i < part.length && /[a-zA-Z0-9_-]/.test(part[i])) i += 1
      id = part.slice(start, i)
      continue
    }
    if (ch === '.') {
      i += 1
      const start = i
      while (i < part.length && /[a-zA-Z0-9_-]/.test(part[i])) i += 1
      classes.push(part.slice(start, i))
      continue
    }
    if (ch === '[') {
      const end = part.indexOf(']', i + 1)
      const raw = part.slice(i + 1, end === -1 ? part.length : end)
      const attr = parseAttributeSelector(raw)
      if (attr) attrs.push(attr)
      i = end === -1 ? part.length : end + 1
      continue
    }
    i += 1
  }

  return {
    tag,
    id,
    classes,
    attrs,
    notParts: [],
  }
}

function parseAttributeSelector(raw: string) {
  let trimmed = raw.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    trimmed = trimmed.slice(1, -1).trim()
  }
  const eq = trimmed.indexOf('=')
  if (eq === -1) {
    return { name: unescapeSelector(trimmed) }
  }
  const name = unescapeSelector(trimmed.slice(0, eq).trim())
  let value = trimmed.slice(eq + 1).trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }
  return { name, value }
}

function unescapeSelector(value: string) {
  return value.replace(/\\(.)/g, '$1')
}

function collectElements(root: MiniNode) {
  const results: MiniElement[] = []
  const stack: MiniNode[] = []
  const pushChildren = (node: MiniNode) => {
    for (let i = node.childNodes.length - 1; i >= 0; i -= 1) {
      stack.push(node.childNodes[i])
    }
  }
  if (root instanceof MiniDocument) {
    pushChildren(root)
  } else if (root instanceof MiniDocumentFragment) {
    pushChildren(root)
  } else if (root instanceof MiniElement) {
    pushChildren(root)
  }

  while (stack.length > 0) {
    const node = stack.pop()
    if (!node) continue
    if (node instanceof MiniElement) {
      results.push(node)
      if (!(node instanceof MiniHTMLTemplateElement)) {
        pushChildren(node)
      }
    }
  }
  return results
}

function matchesSelectorChain(el: MiniElement, chain: SelectorStep[]) {
  const matchAt = (node: MiniNode | null, index: number): boolean => {
    if (!(node instanceof MiniElement)) return false
    const step = chain[index]
    if (!matchesSelectorPart(node, step.part)) return false
    if (index === 0) return true
    const combinator = step.combinatorToPrev ?? ' '
    if (combinator === '>') {
      return matchAt(node.parentNode, index - 1)
    }
    let parent = node.parentNode
    while (parent) {
      if (parent instanceof MiniElement && matchAt(parent, index - 1)) return true
      parent = parent.parentNode
    }
    return false
  }

  if (chain.length === 0) return false
  return matchAt(el, chain.length - 1)
}

function matchesSelectorPart(el: MiniElement, part: SelectorPart) {
  if (!matchesSelectorPartBasic(el, part)) return false
  for (const notPart of part.notParts) {
    if (matchesSelectorPartBasic(el, notPart)) return false
  }
  return true
}

function matchesSelectorPartBasic(el: MiniElement, part: SelectorPart) {
  const tag = part.tag
  if (tag && tag !== '*' && el.tagName.toLowerCase() !== tag) return false
  if (part.id) {
    const id = el.getAttribute('id')
    if (id !== part.id) return false
  }
  if (part.classes.length > 0) {
    const classAttr = el.getAttribute('class') ?? ''
    const tokens = classAttr.split(/\s+/).filter(Boolean)
    for (const cls of part.classes) {
      if (!tokens.includes(cls)) return false
    }
  }
  for (const attr of part.attrs) {
    if (!el.hasAttribute(attr.name)) return false
    if (attr.value !== undefined && el.getAttribute(attr.name) !== attr.value) {
      return false
    }
  }
  return true
}

export {
  MiniComment,
  MiniDocument,
  MiniDocumentFragment,
  MiniElement,
  MiniHTMLElement,
  MiniHTMLTemplateElement,
  MiniNode,
  MiniText,
}

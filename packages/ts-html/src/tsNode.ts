import { escapeHtml } from '@purestack/utils'
import prettier from 'prettier'

import {
  AriaAttributes,
  AttributesForTag,
  EventAttributes,
  GlobalAttributes,
  HtmlTag,
  SpecificAttributesForTag,
} from './html'

export type Attributes = Partial<Record<string, string>>

/**
 * Immutable builder node for constructing HTML-like trees in TypeScript.
 * Every mutating operation returns a new node to keep composition functional.
 */
export class TSNode<K extends HtmlTag> {
  /** Literal text content for this node, if any. */
  #text: string = ''

  /** Literal html content for this node, if any. */
  #raw: string = ''

  /** The tag name (e.g., 'div', 'span') this node represents. */
  #tag: string = ''

  /** Child TSNode instances nested under this node. */
  #children: TSNode<''>[] = []

  /** Attributes applied to this node. */
  #attributes: Attributes = {}

  /**
   * Creates a TSNode for a tag or fragment.
   * @param tag - A tag name; use empty string or omit for fragments.
   */
  constructor(tag?: string) {
    this.#tag = tag ?? ''
  }

  /**
   * Returns a shallow clone of this node.
   * The children array is copied, but child nodes are reused.
   */
  clone(): TSNode<K> {
    // Shallow clone to preserve immutability; children are re-used as nodes.
    const node = new TSNode<K>(this.#tag)
    node.#attributes = { ...this.#attributes }
    node.#children = [...this.#children]
    node.#text = this.#text
    node.#raw = this.#raw
    return node
  }

  /**
   * Appends a new text node under this node's tag context.
   * @param text - The string content for the new text node.
   * @param replace - If true current tag text is replaced, if false text content added to the children of the current tag.
   * @returns A ts wrapping the text node and linked in the chain.
   */
  text(text: string, replace = false): TSNode<K> {
    if (this.#tag && !replace) return this.push(h().text(text))
    const leaf = this.clone()
    leaf.#text = escapeHtml(text, false)
    return leaf
  }

  /**
   * Appends or replace a new raw html code under this node's tag context.
   * @param html - The raw html string for the new html node.
   * @param replace - If true current tag is replaced, if false raw content added to the children of the current tag.
   * @returns A ts wrapping the html node and linked in the chain.
   */
  raw(html: string, replace = false): TSNode<K> {
    if (this.#tag && !replace) return this.push(h().raw(html))
    const leaf = this.clone()
    leaf.#raw = html
    return leaf
  }

  /**
   * Sets the `id` attribute.
   */
  id(id: string | number) {
    return this.#withAttributes({ id: String(id) })
  }

  /**
   * Sets the `class` attribute by joining all values with spaces.
   */
  class(...args: string[]) {
    return this.#withAttributes({ class: args.join(' ') })
  }

  /**
   * Sets tag-specific attributes.
   */
  attr(
    attrs: Partial<Record<SpecificAttributesForTag<K> | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }

  /**
   * Sets any attributes allowed on the tag (global + specific + aria + events).
   */
  attrAll(
    attrs: Partial<Record<AttributesForTag<K> | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
  /**
   * Sets global HTML attributes (e.g. `id`, `class`, `title`).
   */
  attrGlobal(
    attrs: Partial<Record<GlobalAttributes | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
  /**
   * Sets ARIA attributes (e.g. `aria-label`).
   */
  attrAria(
    attrs: Partial<Record<AriaAttributes | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
  /**
   * Sets event-handler attributes (e.g. `onclick`).
   */
  attrEvents(
    attrs: Partial<Record<EventAttributes | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
  /**
   * Appends provided TSNode instances as children under this node's tag context.
   * @param args - One or more TSNode instances to include as children.
   * @returns A ts wrapping the group of children and linked in the chain.
   */
  push(...args: TSNode<''>[]): TSNode<K> {
    const container = this.clone()
    container.#children = [...this.#children, ...args]
    return container
  }

  /**
   * Selects the first matching tag in the subtree (including this node),
   * replaces it using the provided callback, and returns a new root.
   * @param tag - Tag name to find.
   * @param replace - Replacer callback for the matching node.
   */
  select<T extends HtmlTag, P extends HtmlTag = T>(
    tag: T,
    replace: (node: TSNode<T>) => TSNode<P>,
  ) {
    if (this.#tag == tag) return replace(this.clone() as TSNode<T>)
    const root = this.clone()
    const stack = [root]
    while (stack.length) {
      const cursor = stack.pop()!
      const children = cursor.#children
      const len = children.length
      for (let i = 0; i < len; ++i) {
        const child = children[i]
        if (child.#tag == tag) {
          cursor.#children = [
            ...children.slice(0, i),
            replace(child),
            ...children.slice(i + 1),
          ]
          return root
        }
      }
      const newChildren = children.map((c) => c.clone())
      cursor.#children = newChildren
      stack.push(...newChildren)
    }
    throw new Error('Cannot find child with tag name:' + tag)
  }

  /**
   * Serializes this node into an HTML string.
   * @returns The HTML string representing this node and its subtree.
   */
  toHtml() {
    const docType = this.#tag == 'html' ? '<!DOCTYPE html>\n' : ''
    const raw = this.#raw
    if (raw.length) return raw
    const code = TSNode.#serialize(this.#tag, this.#attributes, this.#children)
    return docType + code
  }

  /**
   * Serializes this node into a formatted HTML string using Prettier.
   * @param options - Prettier options to override defaults.
   * @returns The formatted HTML string.
   */
  async toPrettyHtml(options?: prettier.Options) {
    const fmt: prettier.Options = {
      parser: 'html',
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      endOfLine: 'lf',
      ...options,
    }
    const code = this.toHtml()
    return prettier.format(code, fmt)
  }
  /**
   * Creates a TSNode with merged attributes.
   * @param attrs - A map of attribute names to values.
   * @returns A new node containing the merged attributes.
   */
  #withAttributes(attrs: Attributes): TSNode<K> {
    const node = this.clone()
    node.#attributes = { ...this.#attributes, ...attrs }
    return node
  }

  /**
   * Recursively serializes a tag name, its attributes, and its TSNode children into HTML.
   * @param tag - The HTML tag name for this level.
   * @param attrs - A map of attribute names to values.
   * @param children - Child TSNode instances to render inside this tag.
   * @returns The HTML string for this tag and its subtree.
   */
  static #serialize(
    tag: string,
    attrs: Attributes,
    children: TSNode<''>[],
    text = '',
  ): string {
    let html = ''
    if (tag) {
      const attrString = Object.entries(attrs)
        .map(([key, val]) =>
          !val ? ` ${key}` : ` ${key}="${escapeHtml(val, true)}"`,
        )
        .join('')
      if (voidTags.has(tag)) {
        html += `<${tag}${attrString}/>`
        return html
      }
      html += `<${tag}${attrString}>`
    }
    if (text) html += text
    for (const child of children) {
      const text = child.#text
      const raw = child.#raw
      if (raw.length) {
        html += raw
        continue
      }
      const childTag = child.#tag
      html += TSNode.#serialize(
        childTag,
        child.#attributes,
        child.#children,
        text,
      )
    }
    if (tag) {
      html += `</${tag}>`
    }
    return html
  }
}

export function h<K extends HtmlTag>(tag?: K) {
  return new TSNode<K>((tag as K) ?? '')
}

const voidTags = new Set([
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

import { isString } from '@purestack/utils'
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

type Attributes = Partial<Record<string, string>>

/**
 * Represents an immutable builder node for constructing HTML-like trees in TypeScript.
 * Each method returns a fresh TSNode, retaining chain context via the #parent link.
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
   * Creates a ts.
   * @param tagOrParent - A tag name or a `TSNode` parent.
   */
  constructor(tagOrParent: string | TSNode<K>) {
    if (tagOrParent == null) {
      tagOrParent = ''
    }
    if (isString(tagOrParent)) {
      this.#tag = tagOrParent
    } else {
      const parent = tagOrParent as TSNode<K>
      this.#attributes = parent.#attributes
      this.#children = parent.#children
      this.#tag = parent.#tag
      this.#text = parent.#text
      this.#raw = parent.#raw
    }
  }

  /**
   * Appends a new text node under this node's tag context.
   * @param text - The string content for the new text node.
   * @param replace - If true current tag text is replaced, if false text content added to the children of the current tag.
   * @returns A ts wrapping the text node and linked in the chain.
   */
  text(text: string, replace = false): TSNode<K> {
    if (this.#tag && !replace) return this.push(h().text(text))
    const leaf = new TSNode(this)
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
    const leaf = new TSNode(this)
    leaf.#raw = html
    return leaf
  }

  id(id: string | number) {
    return this.#withAttributes({ id: String(id) })
  }

  class(...args: string[]) {
    return this.#withAttributes({ class: args.join(' ') })
  }

  attr(
    attrs: Partial<Record<SpecificAttributesForTag<K> | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }

  attrAll(
    attrs: Partial<Record<AttributesForTag<K> | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
  attrGlobal(
    attrs: Partial<Record<GlobalAttributes | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
  attrAria(
    attrs: Partial<Record<AriaAttributes | (string & {}), string>>,
  ): TSNode<K> {
    return this.#withAttributes(attrs)
  }
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
    const container = new TSNode(this)
    container.#children = [...this.#children, ...args]
    return container
  }

  /** Select tag by name in the subtree of current node, replace it with the callback and return a new node with replaced element.
   * @param tag     - tag name
   * @param replace - replacer
   */
  select<T extends HtmlTag, P extends HtmlTag = T>(
    tag: T,
    replace: (node: TSNode<T>) => TSNode<P>,
  ) {
    if (this.#tag == tag) return this
    const root = new TSNode<K>(this)
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
      const newChildren = children.map((c) => new TSNode(c))
      cursor.#children = newChildren
      stack.push(...newChildren)
    }
    throw new Error('Cannot find child with tag name:' + tag)
  }

  /**
   * Serializes this node into an HTML string, handling multiple grouped chains throughout the tree.
   * @param options - Prettier options
   * @returns The HTML string representing the combined root context and its subtree.
   */
  toHtml() {
    const docType = this.#tag == 'html' ? '<!DOCTYPE html>\n' : ''
    const raw = this.#raw
    if (raw.length) return raw
    const code = TSNode.#serialize(this.#tag, this.#attributes, this.#children)
    return docType + code
  }

  /**
   * Serializes this node into an HTML string, handling multiple grouped chains throughout the tree.
   * @param options - Prettier options
   * @returns The HTML string representing the combined root context and its subtree.
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
   * Creates a ts in the chain with added attributes.
   * @param attrs - A map of attribute names to values.
   * @returns A ts linked to this as parent and containing the merged attributes.
   */
  #withAttributes(attrs: Attributes): TSNode<K> {
    const node = new TSNode(this)
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
        .map(([key, val]) => ` ${key}="${escapeHtml(val ?? '', true)}"`)
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

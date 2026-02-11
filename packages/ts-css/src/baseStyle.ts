import prettier from 'prettier'

import { autoVar } from './autoVar'
import type { CSSProps } from './cssProps'
import { hyphenizeCss } from './hyphenize'

export abstract class RootStyle {
  static nextId = 1
  id: number
  selector: string
  constructor(selector?: string) {
    this.id = BaseStyle.nextId++
    this.selector = selector ?? ''
  }
  abstract toCSS(): string
}

export class BaseStyle<T extends RootStyle> extends RootStyle {
  children = new Map<string, T>()
  props = new Map<string, string | number>()
  #createT: (selector?: string) => T
  constructor(createT: (selector?: string) => T, selector?: string) {
    super(selector)
    this.#createT = createT
  }

  set(key: string, value: string | number) {
    this.props.set(hyphenizeCss(key), autoVar(value))
    return this
  }

  css(css: Partial<CSSProps>) {
    for (const [key, value] of Object.entries(css)) {
      this.set(key, value as string)
    }
    return this
  }

  /** Select a child element with the given selector.
   * ```
   * + (Next-sibling combinator)
   * > (Child combinator)
   * || (Column combinator)
   * ~ (Subsequent sibling combinator)
   * " " (Descendant combinator)
   * | (Namespace separator)
   * ```
   * Example:
   * ```ts
   * style.select('.container > .item').set('color', 'red')
   * ```
   */
  select(selector: string) {
    let child = this.children.get(selector)
    if (child) return child
    const selectors = new Set(['+', '>', '|', '~', ' ', '|', ':'])
    const separator =
      this.selector.length === 0 || selectors.has(selector[0]) ? '' : ' '
    child = this.#createT(this.selector + separator + selector)
    this.children.set(selector, child)
    return child
  }

  protected selectWithoutParentKey(selector: string) {
    let child = this.children.get(selector)
    if (child) return child
    child = this.#createT(selector)
    this.children.set(selector, child)
    return child
  }

  #asBaseStyle(val: T) {
    return val as unknown as BaseStyle<T>
  }

  use(css: T) {
    this.#asBaseStyle(css).props.forEach((value, key) => {
      this.props.set(key, value)
    })
    return this
  }

  media(query: string) {
    if (!query) return this
    const selector = query.startsWith('@media') ? query : `@media(${query})`
    let child = this.children.get(selector)
    if (child) {
      return this.#asBaseStyle(child).selectWithoutParentKey(this.selector)
    }
    child = this.#createT(selector)
    this.children.set(selector, child)
    child = this.#asBaseStyle(child).selectWithoutParentKey(this.selector)
    return child
  }

  toCSS() {
    let result = ''
    const children = [...this.children.entries()].sort((a, b) => {
      const isAMedia = a[1].selector.startsWith('@media')
      const isBMedia = b[1].selector.startsWith('@media')
      if (isAMedia && !isBMedia) return 1
      if (!isAMedia && isBMedia) return -1
      return a[1].id - b[1].id
    })
    const selector = this.selector
    if (selector.startsWith('@media')) {
      const mediaContent = children
        .map((x) => `\r\n${x[1].toCSS()}`)[0]
        .trimEnd()
      result = `${selector} {${mediaContent}
}

`
      return result
    }
    if (selector && this.props.size > 0) {
      const props = [...this.props.entries()]
        .filter((x) => (typeof x[1] as unknown) !== undefined)
        .map((x) => `  ${x[0]}: ${x[1]};`.replaceAll(';;', ';'))
        .join('\r\n')
      if (props.trim() !== '')
        result = `${selector} {
${props}
}

`
    }
    if (children.length === 0) return result
    for (const c of children) {
      result += c[1].toCSS()
    }
    return result
  }

  async toPrettyCSS(options?: prettier.Options) {
    const fmt: prettier.Options = {
      parser: 'css',
      tabWidth: 2,
      endOfLine: 'lf',
      ...options,
    }
    const code = this.toCSS()
    return prettier.format(code, fmt)
  }

  whiteSpace(
    value:
      | 'normal'
      | 'nowrap'
      | 'pre'
      | 'pre-wrap'
      | 'pre-line'
      | 'break-spaces'
      | 'collapse balance'
      | 'preserve nowrap'
      | 'inherit'
      | 'initial'
      | 'revert'
      | 'revert-layer'
      | 'unset'
      | (string & {}),
  ) {
    this.set('white-space', value)
    return this
  }
}

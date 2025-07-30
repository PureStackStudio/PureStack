/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Run: yarn tsx packages/ts-css/src/meta/generateStyle.ts
 */
import fs from 'fs'
import prettier from 'prettier'
import { fileURLToPath } from 'url'

import { cssProps } from './cssProps'

const camelize = (s: string) =>
  (s.startsWith('-') ? s.substring(1) : s).replace(/-./g, (x) =>
    x[1].toUpperCase(),
  )

type PropType = {
  $: {
    name: string
    restriction: string
    version: string
    browsers: string
    ref: string
    syntax: string
  }
  desc: string
  values: {
    value: {
      $: {
        name: string
        version: string
        browsers: string
      }
      desc: string
    }[]
  }
}

function createCode() {
  const methods = createMethods()
  const code = `
export class Style {
  static nextId = 1
  children = new Map<string, Style>()

  props = new Map<string, string | number>()

  id: number

  selector: string

  constructor(selector?: string) {
    this.id = Style.nextId++
    this.selector = selector ?? ''
  }

  select(selector: string) {
    let child = this.children.get(selector)
    if (child) return child
    const selectors = new Set(['+', '>', '|', '~', ' ', '|', ':'])
    const separator =
      this.selector.length == 0 || selectors.has(selector[0]) ? '' : ' '
    child = new Style(this.selector + separator + selector)
    this.children.set(selector, child)
    return child
  }

  private selectWithoutParentKey(selector: string) {
    let child = this.children.get(selector)
    if (child) return child
    child = new Style(selector)
    this.children.set(selector, child)
    return child
  }

  use(css: Style) {
    css.props.forEach((value, key) => this.props.set(key, value))
    return this
  }

  media(query: string) {
    const selector = \`@media(\${query})\`
    let child = this.children.get(selector)
    if (child) {
      return child.selectWithoutParentKey(this.selector)
    }
    child = new Style(selector)
    this.children.set(selector, child)
    child = child.selectWithoutParentKey(this.selector)
    return child
  }

  raw(key: string, value: string) {
    this.props.set(key, value)
    return this
  }

  toString() {
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
      result = \`\${selector} {\${children.map((x) => '\\r\\n' + x[1].toString())[0]
        .trimEnd()}
}

\`
      return result
    }
    if (selector && this.props.size > 0) {
      const props = [...this.props.entries()]
        .filter((x) => typeof x[1] as unknown != undefined)
        .map((x) => \`  \${x[0]}: \${x[1]};\`.replaceAll(';;', ';'))
        .join('\\r\\n')
      if (props.trim() != '')
      result = \`\${selector} {
\${props}
}

\`
    }
    if (children.length == 0) return result
    for (const c of children) {
      result += c[1].toString()
    }
    return result
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
      | (string & {})
  ) {
    this.props.set('white-space', value)
    return this
  }

  ${methods}
}`
  return code
}

function getValues(propType: PropType) {
  return (
    propType.values?.value
      ?.map?.((x) => '     * ' + x.$.name.replaceAll('"', '') + ': ' + x.desc)
      .join('\r\n\r\n') ?? ''
  )
}

function getEnumType(propType: PropType) {
  const stringType = ' | (string & {})'
  if (!propType.values.value.map)
    return `"${(propType.values.value as any).$.name}"` + stringType
  return (
    propType.values.value
      .map((x) => `"${x.$.name.replaceAll('"', '')}"`)
      .join(' | ') + stringType
  )
}

function getAnyType(propType: PropType) {
  const restriction = propType.$.restriction
  if (
    restriction == 'integer' ||
    restriction == 'number(0-1)' ||
    restriction == 'number'
  )
    return 'number'
  const stringType = ' | (string & {})'
  if (!propType?.values?.value) return 'string'
  if (!propType.values.value.map)
    return (
      `"${(propType.values.value as any).$.name.replaceAll('"', '')}"` +
      stringType
    )
  return (
    propType.values.value
      .map((x) => `"${x.$.name.replaceAll('"', '')}"`)
      .join(' | ') + stringType
  )
}

function createEnumMethod(propType: PropType) {
  const { name, restriction, browsers, ref, syntax } = propType.$
  const desc = propType.desc?.replace?.('@', '`@`')
  const cname = camelize(name)
  const values = createValuesTSDoc(getValues(propType))
  const enumType = getEnumType(propType)
  const code = `
    /**
     * ${desc}.
     * 
     * syntax:  \`${(syntax ?? ' ').replace('$(name)', name)}\`
     * 
     * restriction: ${restriction}
     * 
     * browsers: ${browsers}
     * 
     * ref: ${ref}
     * 
${values}
     * @param value - 
     */
    ${cname}(value: ${enumType}) {
      this.props.set('${name}', value)
      return this
    }
`
  return code
}

function createValuesTSDoc(values: string) {
  if (!values) return ''
  return `     * values:
     * \`\`\`
${values}
     * \`\`\`
     *`
}
function createMethod(propType: PropType) {
  if (propType.$.restriction == 'enum') return createEnumMethod(propType)
  const { name, restriction, browsers, ref, syntax } = propType.$
  const desc = propType.desc?.replace?.('@', '`@`')
  const cname = camelize(name)
  const values = createValuesTSDoc(getValues(propType))
  const anyType = getAnyType(propType)
  const code = `
    /**
     * ${desc}.
     * 
     * syntax:  \`${(syntax ?? ' ').replace('$(name)', name)}\`
     * 
     * restriction: ${restriction}
     * 
     * browsers: ${browsers}
     * 
     * ref: ${ref}
     * 
${values}
     * @param value -
     */
    ${cname}(value: ${anyType}) {
      this.props.set('${name}', value)
      return this
    }
`
  return code
}

function createMethods() {
  let result = ''
  for (const prop of cssProps) {
    result += createMethod(prop as PropType)
  }
  return result
}

const code = createCode()
const formatted = await prettier.format(code, {
  parser: 'typescript',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  endOfLine: 'lf',
})

const outTs = fileURLToPath(new URL('../style.ts', import.meta.url))
fs.writeFileSync(outTs, formatted)
console.log(`✅ Wrote ${outTs}`)

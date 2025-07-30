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
  const props = createProps()
  const code = `
import { BaseStyle } from './baseStyle'

export type CSSProps = {
  ${props}
} & Record<string, string | number>

export class Style extends BaseStyle<Style> {
  constructor(selector?: string) {
    super((s) => new Style(s), selector)
  }

  css(css: Partial<CSSProps>) {
      for (const [key, value] of Object.entries(css)) {
        this.props.set(key, value as string)
      }
      return this
  }

  ${methods}
}`
  return code
}

function getValues(propType: PropType) {
  return (
    propType.values?.value
      ?.map?.((x) => '   * ' + x.$.name.replaceAll('"', '') + ': ' + x.desc)
      .join('\r\n\r\n') ?? '   *'
  )
}

function getEnumType(propType: PropType) {
  const stringType = ' | (string & {})'
  if (!propType.values.value.map)
    return (
      `"${
        (
          propType.values.value as unknown as {
            $: {
              name: string
            }
          }
        ).$.name
      }"` + stringType
    )
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
      `"${(
        propType.values.value as unknown as {
          $: {
            name: string
          }
        }
      ).$.name.replaceAll('"', '')}"` + stringType
    )
  return (
    propType.values.value
      .map((x) => `"${x.$.name.replaceAll('"', '')}"`)
      .join(' | ') + stringType
  )
}

function createValuesTSDoc(values: string) {
  if (!values?.replace('*', '').trim()) return '   *'
  return `   *
   * values:
   * \`\`\`md
${values}
   * \`\`\``
}
function createMethod(propType: PropType) {
  const { name, restriction, browsers, ref, syntax } = propType.$
  const desc = propType.desc?.replace?.('@', '`@`')
  const cname = camelize(name)
  const values = createValuesTSDoc(getValues(propType))
  const anyType = `CSSProps['${name}']`
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

function createProps() {
  let result = ''
  for (const prop of cssProps) {
    result += createProp(prop as PropType)
  }
  return result
}
function createProp(propType: PropType) {
  const { name } = propType.$
  const anyType =
    propType.$.restriction == 'enum'
      ? getEnumType(propType)
      : getAnyType(propType)
  return `'${name}': ${anyType},\n`
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

import { type ColorOrColorizer, toColorizer } from '@logpot/printer'

interface ColorizeOptions {
  content?: ColorOrColorizer
  tag?: ColorOrColorizer
  attrKey?: ColorOrColorizer
  attrValue?: ColorOrColorizer
  attrEq?: ColorOrColorizer
}

export function colorizeHTML(
  html: string,
  options: ColorizeOptions = {},
): string {
  const {
    content: contentOption = '#b40657',
    tag: tagColorOption = '#106767',
    attrKey: attrKeyColorOption = 'cyan',
    attrValue: attrValueColorOption = 'yellow',
    attrEq: attrEqColorOption = 'gray',
  } = options
  const content = toColorizer(contentOption)
  const tagColor = toColorizer(tagColorOption)
  const attrKeyColor = toColorizer(attrKeyColorOption)
  const attrValueColor = toColorizer(attrValueColorOption)
  const attrEqColor = toColorizer(attrEqColorOption)
  return content(
    html
      // Color the opening delimiter, optional slash, and tag name together.
      .replace(/(&lt;|<)(\/?)([!a-zA-Z0-9:-]+)/g, (_, lt, slash, tag) => {
        // e.g., "<", "/", "div" -> we might want the "<" and "/" and tag name each colored; here we color them all with tagColor
        return tagColor(`${lt}${slash}${tag}`)
      })
      // Attribute key and equals
      .replace(/([a-zA-Z-]+)(=)/g, (_, attr, eq) => {
        return attrKeyColor(attr) + attrEqColor(eq)
      })
      // Attribute values, both single and double quoted
      .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, (m) => {
        return attrValueColor(m)
      })
      // Closing bracket or self-close
      .replace(/(\/?>)/g, (m) => tagColor(m)),
  )
}

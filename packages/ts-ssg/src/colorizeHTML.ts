import { type ColorOrColorizer, toColorizer } from '@logpot/printer'

export function colorizeHTML(
  html: string,
  options: Record<string, ColorOrColorizer> = {
    tagColor: '#106767',
    attrKeyColor: 'cyan',
    attrValueColor: 'yellow',
    attrEqColor: 'gray',
  },
) {
  const tagColor = toColorizer(options.tagColor)
  const attrKeyColor = toColorizer(options.attrKeyColor)
  const attrValueColor = toColorizer(options.attrValueColor)
  const attrEqColor = toColorizer(options.attrEqColor)
  return html
    .replace(/(&lt;|<)\/?([a-zA-Z0-9-]+)/g, (_, lt, tag) => lt + tagColor(tag))
    .replace(/(\/?<)/g, (m) => tagColor(m))
    .replace(
      /([a-zA-Z-]+)(=)/g,
      (_, attr, eq) => attrKeyColor(attr) + attrEqColor(eq),
    )
    .replace(/("[^"]*")/g, (m) => attrValueColor(m))
    .replace(/(\/?>)/g, tagColor('$1'))
}

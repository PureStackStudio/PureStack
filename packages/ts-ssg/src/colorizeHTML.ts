import { toColorizer } from '@logpot/printer'

export function colorizeHTML(html: string) {
  const tagColor = toColorizer('#106767')
  return html
    .replace(/(&lt;|<)\/?([a-zA-Z0-9-]+)/g, (_, lt, tag) => lt + tagColor(tag))
    .replace(/(\/?<)/g, tagColor('$1'))
    .replace(
      /([a-zA-Z-]+)(=)/g,
      (_, attr, eq) => toColorizer('cyan')(attr) + toColorizer('gray')(eq),
    )
    .replace(/("[^"]*")/g, toColorizer('yellow')('$1'))
    .replace(/(\/?>)/g, tagColor('$1'))
}

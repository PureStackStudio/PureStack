const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
export function graphemes(value: string) {
  return Array.from(segmenter.segment(value), (part) => part.segment)
}
export function safeText(value: string) {
  return Array.from(value.replace(/[\r\n\t]/g, ' '))
    .filter((character) => {
      const code = character.codePointAt(0) as number
      return (
        code >= 32 &&
        !(code >= 127 && code <= 159) &&
        !(code >= 0x202a && code <= 0x202e) &&
        !(code >= 0x2066 && code <= 0x2069)
      )
    })
    .join('')
}
function cellWidth(character: string) {
  const code = character.codePointAt(0) as number
  if (/^\p{Mark}+$/u.test(character)) return 0
  return code >= 0x1100 &&
    (code <= 0x115f ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe10 && code <= 0xfe6f) ||
      (code >= 0xff01 && code <= 0xff60) ||
      (code >= 0x1f300 && code <= 0x1faff) ||
      code >= 0x20000)
    ? 2
    : 1
}
export function width(value: string) {
  return graphemes(safeText(value)).reduce(
    (sum, character) => sum + cellWidth(character),
    0,
  )
}
export function clip(value: string, columns: number) {
  if (columns <= 0) return ''
  const clean = safeText(value)
  if (width(clean) <= columns) return clean
  let result = ''
  let used = 0
  for (const character of graphemes(clean)) {
    if (used + cellWidth(character) > columns - 1) break
    result += character
    used += cellWidth(character)
  }
  return `${result}…`
}
export function pad(value: string, columns: number) {
  const result = clip(value, columns)
  return result + ' '.repeat(Math.max(0, columns - width(result)))
}
export function wrap(value: string, columns: number): string[] {
  const words = safeText(value).split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (width(`${line} ${word}`.trim()) > columns && line) {
      lines.push(line)
      line = ''
    }
    if (width(word) > columns) {
      let fragment = ''
      for (const character of graphemes(word)) {
        if (width(fragment + character) > columns) {
          lines.push(fragment)
          fragment = ''
        }
        fragment += character
      }
      line = fragment
    } else line = line ? `${line} ${word}` : word
  }
  if (line) lines.push(line)
  return lines
}

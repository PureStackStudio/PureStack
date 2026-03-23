/**
 * Escapes &, `<`, `>`, and " (optionally)  in a string for safe insertion into HTML.
 */
export function escapeHtml(str: string, escapeQuot = false): string {
  let result = ''
  let last = 0

  for (let i = 0; i < str.length; i++) {
    let replacement: string | undefined
    switch (str.charCodeAt(i)) {
      case 38:
        replacement = '&amp;'
        break
      case 60:
        replacement = '&lt;'
        break
      case 62:
        replacement = '&gt;'
        break
      case 34:
        if (escapeQuot) replacement = '&quot;'
        break
    }

    if (replacement) {
      if (last < i) {
        result += str.slice(last, i)
      }
      result += replacement
      last = i + 1
    }
  }

  if (last === 0) {
    return str
  }

  if (last < str.length) {
    result += str.slice(last)
  }

  return result
}

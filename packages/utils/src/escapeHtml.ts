/**
 * Escapes &, `<`, `>`, and " (optionally)  in a string for safe insertion into HTML.
 */
export function escapeHtml(str: string, escapeQuot = false): string {
  let result = ''
  let last = 0 // index of start of next untouched substring

  for (let i = 0; i < str.length; i++) {
    let replacement: string | undefined
    switch (str.charCodeAt(i)) {
      case 38: // &
        replacement = '&amp;'
        break
      case 60: // <
        replacement = '&lt;'
        break
      case 62: // >
        replacement = '&gt;'
        break
      case 34: // "
        if (escapeQuot) replacement = '&quot;'
        break
    }

    if (replacement) {
      // append any plain text we’ve skipped over
      if (last < i) {
        result += str.slice(last, i)
      }
      // append escaped entity
      result += replacement
      last = i + 1
    }
  }

  // if nothing was replaced, return original
  if (last === 0) {
    return str
  }

  // append any remaining tail
  if (last < str.length) {
    result += str.slice(last)
  }

  return result
}

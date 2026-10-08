/**
 * Converts a JS-style CSS property name (camelCase / PascalCase / vendor prefixed) into
 * its kebab-case equivalent used in plain CSS. Handles:
 *   - Vendor prefixes (`Webkit`, `webkit`, `Moz`, `moz`, `O`, `o`, `Ms`, `ms`) → leading
 *     `-webkit-`, `-ms-`, etc.
 *   - Acronym boundaries like `XMLHttpRequest` → `xml-http-request`.
 *   - Standard camelCase / PascalCase splitting (`backgroundColor` → `background-color`).
 *   - Leaves already-hyphenated names (e.g., `font-size`) intact aside from lowercasing.
 *
 * @example
 * hyphenizeCss("backgroundColor");       // "background-color"
 * hyphenizeCss("WebkitTransition");      // "-webkit-transition"
 * hyphenizeCss("msTransition");          // "-ms-transition"
 * hyphenizeCss("XMLHttpRequest");        // "xml-http-request"
 * hyphenizeCss("font-size");             // "font-size"
 * hyphenizeCss("URLValue");             // "url-value"
 *
 * @param prop - The JS-style CSS property name.
 * @returns The kebab-case CSS equivalent.
 */
export function hyphenizeCss(prop: string): string {
  // Normalize vendor prefixes (case-insensitive) at the start, e.g. WebkitFoo / msBar → -webkit-foo / -ms-bar
  const withVendor = prop.replace(
    /^(webkit|moz|ms)(?=[A-Z])/i,
    (_, prefix) => `-${prefix.toLowerCase()}`,
  )
  const withOpera = withVendor.replace(/^o/i, (match, _offset, value) => {
    const next = value[match.length]
    const isUppercase =
      typeof next === 'string' &&
      next.toUpperCase() === next &&
      next.toLowerCase() !== next
    return isUppercase ? '-o' : match
  })

  // 1. Split acronym boundaries like "XMLHttp" → "XML-Http"
  // 2. Then split camelCase boundaries like "fooBar" → "foo-Bar"
  const withSeparators = withOpera
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')

  return withSeparators.toLowerCase()
}

export const GMAIL_SUPPORTED_CSS_PROPERTIES = new Set([
  'azimuth',
  'background',
  'background-blend-mode',
  'background-clip',
  'background-color',
  'background-image',
  'background-origin',
  'background-position',
  'background-repeat',
  'background-size',
  'border',
  'border-bottom',
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-style',
  'border-bottom-width',
  'border-collapse',
  'border-color',
  'border-left',
  'border-left-color',
  'border-left-style',
  'border-left-width',
  'border-radius',
  'border-right',
  'border-right-color',
  'border-right-style',
  'border-right-width',
  'border-spacing',
  'border-style',
  'border-top',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-style',
  'border-top-width',
  'border-width',
  'box-sizing',
  'break-after',
  'break-before',
  'break-inside',
  'caption-side',
  'clear',
  'color',
  'column-count',
  'column-fill',
  'column-gap',
  'column-rule',
  'column-rule-color',
  'column-rule-style',
  'column-rule-width',
  'column-span',
  'column-width',
  'columns',
  'direction',
  'display',
  'elevation',
  'empty-cells',
  'float',
  'font',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-synthesis',
  'font-variant',
  'font-variant-alternates',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-weight',
  'height',
  'image-orientation',
  'image-resolution',
  'ime-mode',
  'isolation',
  'layout-flow',
  'layout-grid',
  'layout-grid-char',
  'layout-grid-char-spacing',
  'layout-grid-line',
  'layout-grid-mode',
  'layout-grid-type',
  'letter-spacing',
  'line-break',
  'line-height',
  'list-style',
  'list-style-position',
  'list-style-type',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'marker-offset',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'mix-blend-mode',
  'object-fit',
  'object-position',
  'opacity',
  'outline',
  'outline-color',
  'outline-style',
  'outline-width',
  'overflow',
  'overflow-x',
  'overflow-y',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'page-break-after',
  'page-break-before',
  'page-break-inside',
  'pause',
  'pause-after',
  'pause-before',
  'pitch',
  'pitch-range',
  'quotes',
  'richness',
  'speak',
  'speak-header',
  'speak-numeral',
  'speak-punctuation',
  'speech-rate',
  'stress',
  'table-layout',
  'text-align',
  'text-align-last',
  'text-autospace',
  'text-combine-upright',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-line',
  'text-decoration-skip',
  'text-decoration-style',
  'text-emphasis',
  'text-emphasis-color',
  'text-emphasis-style',
  'text-indent',
  'text-justify',
  'text-kashida-space',
  'text-orientation',
  'text-overflow',
  'text-transform',
  'text-underline-position',
  'unicode-bidi',
  'vertical-align',
  'voice-family',
  'white-space',
  'width',
  'word-break',
  'word-spacing',
  'word-wrap',
  'writing-mode',
  'zoom',
])

const IMAGE_URL_CSS_PROPERTIES = new Set([
  'background',
  'background-image',
  'list-style',
])

const CSS_URL_PATTERN = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi

export interface EmailHtmlPolicyOptions {
  imageUrlResolver?: (url: string) => string | undefined
}

export function copySafeEmailStyles(source: HTMLElement, target: HTMLElement) {
  applySafeEmailStyles(source.getAttribute('style'), target)
}

export function applySafeEmailStyles(
  style: string | null | undefined,
  target: HTMLElement,
  options: EmailHtmlPolicyOptions = {},
) {
  if (!style) return
  for (const item of style.split(';')) {
    const separator = item.indexOf(':')
    if (separator <= 0) continue

    const property = item.slice(0, separator).trim().toLowerCase()
    const value = sanitizeEmailStyleValue(
      property,
      item.slice(separator + 1),
      options,
    )
    if (value) target.style.setProperty(property, value)
  }
}

export function sanitizeEmailStyleValue(
  property: string,
  value: string,
  options: EmailHtmlPolicyOptions = {},
) {
  if (!GMAIL_SUPPORTED_CSS_PROPERTIES.has(property)) return undefined

  const trimmed = stripImportant(value.trim())
  if (!isSafeCssValue(trimmed)) return undefined

  if (CSS_URL_PATTERN.test(trimmed)) {
    CSS_URL_PATTERN.lastIndex = 0
    if (!IMAGE_URL_CSS_PROPERTIES.has(property)) return undefined
    const rewritten = rewriteCssUrls(trimmed, options)
    CSS_URL_PATTERN.lastIndex = 0
    return rewritten
  }

  CSS_URL_PATTERN.lastIndex = 0
  return trimmed
}

export function sanitizePlainAttribute(value: string) {
  let text = ''
  for (let i = 0; i < value.length; ++i) {
    const code = value.charCodeAt(i)
    if (code >= 32 && code !== 127) text += value[i]
  }

  return text.replace(/\s+/g, ' ').trim()
}

export function toSafeEmailImageUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (trimmed.startsWith('cid:') || trimmed.startsWith('data:image/'))
    return trimmed

  try {
    const url = new URL(
      trimmed,
      globalThis.location?.href ?? 'https://localhost/',
    )
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined
    return url.href
  } catch {
    return undefined
  }
}

function stripImportant(value: string) {
  return value.replace(/\s*!important\s*$/i, '').trim()
}

function isSafeCssValue(value: string) {
  return (
    value.length > 0 &&
    value.length <= 512 &&
    !hasUnsafeCssCharacter(value) &&
    !/(?:expression|behavior|binding)\s*\(/i.test(value) &&
    !/(?:javascript|vbscript)\s*:/i.test(value) &&
    !/@import/i.test(value)
  )
}

function rewriteCssUrls(value: string, options: EmailHtmlPolicyOptions) {
  return value.replace(
    CSS_URL_PATTERN,
    (_match, doubleUrl, singleUrl, bareUrl) => {
      const rawUrl = doubleUrl ?? singleUrl ?? bareUrl ?? ''
      const proxiedUrl = options.imageUrlResolver
        ? options.imageUrlResolver(rawUrl.trim())
        : toSafeEmailImageUrl(rawUrl.trim())
      return proxiedUrl ? `url("${escapeCssUrl(proxiedUrl)}")` : ''
    },
  )
}

function hasUnsafeCssCharacter(value: string) {
  for (let i = 0; i < value.length; ++i) {
    const code = value.charCodeAt(i)
    if (code < 32 || code === 127 || value[i] === '<' || value[i] === '>')
      return true
  }

  return false
}

function escapeCssUrl(value: string) {
  return value.replace(/["\\\r\n]/g, '')
}

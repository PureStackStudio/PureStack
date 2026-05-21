export const GMAIL_COMPATIBLE_EMAIL_TAGS = new Set([
  'A',
  'ADDRESS',
  'B',
  'BLOCKQUOTE',
  'BODY',
  'BR',
  'CAPTION',
  'CENTER',
  'CITE',
  'CODE',
  'COL',
  'COLGROUP',
  'DD',
  'DEL',
  'DIV',
  'DL',
  'DT',
  'EM',
  'FONT',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HTML',
  'HR',
  'I',
  'IMG',
  'INS',
  'KBD',
  'LI',
  'OL',
  'P',
  'PRE',
  'S',
  'SAMP',
  'SMALL',
  'SPAN',
  'STRONG',
  'STYLE',
  'SUB',
  'SUP',
  'TABLE',
  'TBODY',
  'TD',
  'TFOOT',
  'TH',
  'THEAD',
  'TR',
  'TT',
  'U',
  'UL',
  'VAR',
])

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

export function copySafeEmailStyles(
  source: HTMLElement,
  target: HTMLElement,
  options: EmailHtmlPolicyOptions = {},
) {
  applySafeEmailStyles(source.getAttribute('style'), target, options)
}

export function applySafeEmailStyles(
  style: string | null | undefined,
  target: HTMLElement,
  options: EmailHtmlPolicyOptions = {},
) {
  if (!style) return
  for (const item of splitCssDeclarations(style)) {
    const separator = findCssDeclarationSeparator(item)
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

function splitCssDeclarations(style: string) {
  const declarations: string[] = []
  let start = 0
  let quote = ''
  let parenDepth = 0
  let escaped = false

  for (let i = 0; i < style.length; ++i) {
    const char = style[i]
    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (quote) {
      if (char === quote) quote = ''
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === '(') {
      ++parenDepth
      continue
    }

    if (char === ')') {
      if (parenDepth > 0) --parenDepth
      continue
    }

    if (char === ';' && parenDepth === 0) {
      declarations.push(style.slice(start, i))
      start = i + 1
    }
  }

  declarations.push(style.slice(start))
  return declarations
}

function findCssDeclarationSeparator(declaration: string) {
  let quote = ''
  let parenDepth = 0
  let escaped = false

  for (let i = 0; i < declaration.length; ++i) {
    const char = declaration[i]
    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (quote) {
      if (char === quote) quote = ''
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === '(') {
      ++parenDepth
      continue
    }

    if (char === ')') {
      if (parenDepth > 0) --parenDepth
      continue
    }

    if (char === ':' && parenDepth === 0) return i
  }

  return -1
}

export function sanitizeEmailStyleValue(
  property: string,
  value: string,
  options: EmailHtmlPolicyOptions = {},
) {
  if (!GMAIL_SUPPORTED_CSS_PROPERTIES.has(property)) return undefined

  const trimmed = stripImportant(value.trim())
  if (!isSafeCssValue(trimmed)) return undefined

  CSS_URL_PATTERN.lastIndex = 0
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

  const lower = trimmed.toLowerCase()
  if (lower.startsWith('cid:') || lower.startsWith('data:image/'))
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

export function normalizeEmailCidUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed.toLowerCase().startsWith('cid:')) return undefined

  const rawContentId = trimmed.slice(4)
  let decodedContentId = rawContentId
  try {
    decodedContentId = decodeURIComponent(rawContentId)
  } catch {
    decodedContentId = rawContentId
  }

  return normalizeEmailContentId(decodedContentId) || undefined
}

export function normalizeEmailContentId(value: string) {
  let contentId = value.trim()
  if (contentId.length >= 2 && contentId[0] === '<' && contentId.at(-1) === '>')
    contentId = contentId.slice(1, -1).trim()

  return contentId.toLowerCase()
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

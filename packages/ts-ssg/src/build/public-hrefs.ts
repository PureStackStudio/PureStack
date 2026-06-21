import { withBasePath } from '@purestack/ts-util'

const URL_ATTRIBUTE_PATTERN =
  /\s(href|src|action|poster|srcset)=(["'])([^"']*)\2/gi
const RAW_TEXT_ELEMENT_PATTERN = /<(script|style)\b[\s\S]*?<\/\1>/gi

export function applyPublicBasePath(html: string, basePath: string): string {
  if (!basePath) return html
  return rewriteOutsideRawTextElements(html, (chunk) =>
    rewriteUrlAttributes(chunk, basePath),
  )
}

function rewriteOutsideRawTextElements(
  html: string,
  rewrite: (chunk: string) => string,
): string {
  let output = ''
  let lastIndex = 0
  for (const match of html.matchAll(RAW_TEXT_ELEMENT_PATTERN)) {
    output += rewrite(html.slice(lastIndex, match.index))
    output += rewriteRawTextElementOpening(match[0], rewrite)
    lastIndex = (match.index ?? 0) + match[0].length
  }
  output += rewrite(html.slice(lastIndex))
  return output
}

function rewriteRawTextElementOpening(
  elementHtml: string,
  rewrite: (chunk: string) => string,
): string {
  const openingEnd = elementHtml.indexOf('>')
  if (openingEnd < 0) return elementHtml
  return (
    rewrite(elementHtml.slice(0, openingEnd + 1)) +
    elementHtml.slice(openingEnd + 1)
  )
}

function rewriteUrlAttributes(html: string, basePath: string): string {
  return html.replace(
    URL_ATTRIBUTE_PATTERN,
    (match, name: string, quote: string, value: string) => {
      const rewritten =
        name.toLowerCase() === 'srcset'
          ? rewriteSrcset(basePath, value)
          : withBasePath(basePath, value)
      if (rewritten === value) return match
      return ` ${name}=${quote}${rewritten}${quote}`
    },
  )
}

function rewriteSrcset(basePath: string, value: string): string {
  return value
    .split(',')
    .map((candidate) => rewriteSrcsetCandidate(basePath, candidate))
    .join(',')
}

function rewriteSrcsetCandidate(basePath: string, candidate: string): string {
  const leading = candidate.match(/^\s*/)?.[0] ?? ''
  const trailing = candidate.match(/\s*$/)?.[0] ?? ''
  const trimmed = candidate.trim()
  if (!trimmed) return candidate
  const [url = '', ...descriptors] = trimmed.split(/\s+/)
  const rewrittenUrl = withBasePath(basePath, url)
  return `${leading}${[rewrittenUrl, ...descriptors].join(' ')}${trailing}`
}

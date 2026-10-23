import htmlPlugin from 'prettier/plugins/html'
import postcssPlugin from 'prettier/plugins/postcss'
import prettier from 'prettier/standalone'

const RAW_TEXT_TAG =
  'script|style|textarea|title|xmp|iframe|noembed|noframes|plaintext'
const TAG_BODY = `(?:"[^"]*"|'[^']*'|[^"'>])*>`

/**
 * Skips comments, raw text and opening tags; captures closing tags broken before `>`.
 * Case-sensitive so PascalCase components such as `<Title>` are not raw text.
 */
const BROKEN_CLOSING_TAG = new RegExp(
  [
    String.raw`<!--[\s\S]*?-->`,
    String.raw`<(${RAW_TEXT_TAG})\b${TAG_BODY}[\s\S]*?</\1\s*>`,
    `<[A-Za-z]${TAG_BODY}`,
    String.raw`(</[^\s>]+)\s*\n\s*>`,
  ].join('|'),
  'g',
)

export interface HtmlFormattingOptions {
  printWidth: number
  tabSize: number
  useTabs: boolean
}

export async function formatHtmlFragment(
  source: string,
  options: HtmlFormattingOptions,
) {
  const formatted = await prettier.format(source, {
    htmlWhitespaceSensitivity: 'css',
    parser: 'html',
    plugins: [htmlPlugin, postcssPlugin],
    printWidth: options.printWidth,
    tabWidth: options.tabSize,
    useTabs: options.useTabs,
  })
  return normalizeClosingTagSpacing(formatted)
}

/** Keep closing tags readable without inserting whitespace into inline content. */
export function normalizeClosingTagSpacing(source: string) {
  return source.replace(
    BROKEN_CLOSING_TAG,
    (match, _rawTextTag: string, closingTag?: string) =>
      closingTag ? `${closingTag}>` : match,
  )
}

export function getLineIndent(line: string) {
  const match = /^\s*/.exec(line)
  return match?.[0] ?? ''
}

export function normalizeSelfClosingTagSpacing(formatted: string) {
  return formatted.replace(/\s+\/>/g, '/>')
}

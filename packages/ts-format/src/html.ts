import htmlPlugin from 'prettier/plugins/html'
import postcssPlugin from 'prettier/plugins/postcss'
import prettier from 'prettier/standalone'

export interface HtmlFormattingOptions {
  printWidth: number
  tabSize: number
  useTabs: boolean
}

export async function formatHtmlFragment(
  source: string,
  options: HtmlFormattingOptions,
) {
  return prettier.format(source, {
    htmlWhitespaceSensitivity: 'css',
    parser: 'html',
    plugins: [htmlPlugin, postcssPlugin],
    printWidth: options.printWidth,
    tabWidth: options.tabSize,
    useTabs: options.useTabs,
  })
}

export function getLineIndent(line: string) {
  const match = /^\s*/.exec(line)
  return match?.[0] ?? ''
}

export function normalizeSelfClosingTagSpacing(formatted: string) {
  return formatted.replace(/\s+\/>/g, '/>')
}

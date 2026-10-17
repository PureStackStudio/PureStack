/** Converts source code to highlighted pre/code HTML. */
export interface MdxCodeHighlighter {
  codeToHtml: (code: string, lang?: string) => string | Promise<string>
}

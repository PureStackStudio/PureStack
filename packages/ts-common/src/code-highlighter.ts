/** Converts source code to highlighted pre/code HTML. */
export interface MdxCodeHighlighter {
  codeToHtml: (code: string, lang?: string) => string | Promise<string>
  /** Persist buffered computation results after a render batch. Await producers before calling. */
  flush?: () => void | Promise<void>
}

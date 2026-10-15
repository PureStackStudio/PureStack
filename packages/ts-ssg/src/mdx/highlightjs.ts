import hljs, { type HLJSApi } from 'highlight.js'

import { normalizeCodeLanguage } from './codeLanguages'
import type { MdxCodeHighlighter } from './highlight'

// Use highlight.js names, or the closest grammar for Shiki-only languages.
const hljsLanguages = new Map([
  ['jsonc', 'json'],
  ['mdx', 'markdown'],
  ['objective-c', 'objectivec'],
  ['ts-tags', 'typescript'],
])

export function createHljsHighlighter(
  highlighter: HLJSApi = hljs,
): MdxCodeHighlighter {
  return {
    codeToHtml: (code: string, lang?: string) => {
      const normalizedLang = normalizeCodeLanguage(lang ?? '')
      const highlightLang = hljsLanguages.get(normalizedLang) ?? normalizedLang
      if (highlightLang && highlighter.getLanguage(highlightLang)) {
        const highlighted = highlighter.highlight(code, {
          language: highlightLang,
          ignoreIllegals: true,
        })
        return `<pre class="hljs"><code class="hljs language-${highlighted.language}">${highlighted.value}</code></pre>`
      }

      const escaped = escapeHtml(code)
      const langClass = normalizedLang ? ` language-${normalizedLang}` : ''
      return `<pre class="hljs"><code class="hljs${langClass}">${escaped}</code></pre>`
    },
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

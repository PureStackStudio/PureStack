import hljs from 'highlight.js'

import type { MdxCodeHighlighter } from './highlight'

const languageAliases: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
}

export function createHljsHighlighter(): MdxCodeHighlighter {
  return {
    codeToHtml: (code: string, lang?: string) => {
      const normalizedLang = normalizeLanguage(lang)
      if (normalizedLang && hljs.getLanguage(normalizedLang)) {
        const highlighted = hljs.highlight(code, {
          language: normalizedLang,
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

function normalizeLanguage(lang: string | undefined): string | undefined {
  if (!lang) return undefined
  const normalized = lang.trim().toLowerCase()
  if (!normalized) return undefined
  return languageAliases[normalized] ?? normalized
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

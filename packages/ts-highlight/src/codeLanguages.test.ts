import { LANGUAGE_BY_EXTENSION } from '@purestack/ts-common'
import {
  createHljsHighlighter,
  createMdxHighlighter,
  DEFAULT_MDX_CODE_LANGS,
} from '@purestack/ts-highlight'
import hljs from 'highlight.js'
import { describe, expect, it, vi } from 'vitest'

describe('MDX code languages', () => {
  it('renders every inferred language with the default Shiki grammars', async () => {
    const highlighter = await createMdxHighlighter()
    const languages = new Set([
      ...DEFAULT_MDX_CODE_LANGS,
      ...Object.values(LANGUAGE_BY_EXTENSION),
    ])
    for (const language of languages) {
      expect(await highlighter.codeToHtml('example', language)).toContain(
        '<pre',
      )
    }
  })

  it('uses a registered highlight.js grammar for every default language', () => {
    const engine = hljs.newInstance()
    for (const language of hljs.listLanguages()) {
      const grammar = hljs.getLanguage(language)
      if (grammar) engine.registerLanguage(language, () => grammar)
    }
    const highlight = vi.spyOn(engine, 'highlight')
    const highlighter = createHljsHighlighter(engine)
    for (const language of DEFAULT_MDX_CODE_LANGS) {
      highlight.mockClear()
      highlighter.codeToHtml('example', language)
      expect(highlight, language).toHaveBeenCalledOnce()
    }
  })

  it.each([
    [' PY3 ', 'python', 'print(42)'],
    ['cs', 'csharp', 'public class Example {}'],
    ['c++', 'cpp', 'int main() {}'],
    ['pwsh', 'powershell', 'Write-Host "Hello"'],
    ['yml', 'yaml', 'answer: 42'],
    ['shellscript', 'bash', 'echo "Hello"'],
    ['objectivec', 'objective-c', '@interface Example'],
    ['dos', 'bat', 'echo Hello'],
    ['gql', 'graphql', 'query { user { id } }'],
  ])('resolves %s with both highlighters', async (alias, language, code) => {
    // Loading by the alias must also work when defaults are overridden.
    const shiki = await createMdxHighlighter(undefined, [alias])
    expect(await shiki.codeToHtml(code, alias)).toBe(
      await shiki.codeToHtml(code, language),
    )
    const highlighter = createHljsHighlighter()
    const html = highlighter.codeToHtml(code, alias)
    expect(html).toBe(highlighter.codeToHtml(code, language))
    expect(html).toContain('<span')
  })
})

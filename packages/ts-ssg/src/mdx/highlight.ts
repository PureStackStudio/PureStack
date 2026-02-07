import { createHighlighter, type Highlighter } from 'shiki'

export interface MdxCodeHighlighter {
  codeToHtml: (code: string, lang?: string) => string
}

export interface MdxCodeThemes {
  light: string
  dark: string
}

export type MdxCodeLangs = string[]

export const DEFAULT_MDX_CODE_THEMES: MdxCodeThemes = {
  light: 'github-light',
  dark: 'github-dark',
}

export const DEFAULT_MDX_CODE_LANGS: MdxCodeLangs = [
  'bash',
  'sh',
  'shell',
  'javascript',
  'js',
  'typescript',
  'ts',
  'jsx',
  'tsx',
  'json',
  'html',
  'css',
  'markdown',
  'mdx',
  'yaml',
  'yml',
  'toml',
  'diff',
  'csharp',
  'cpp',
  'c',
  'java',
  'python',
  'ruby',
  'go',
  'rust',
  'xml',
]

export async function createMdxHighlighter(
  themes: MdxCodeThemes = DEFAULT_MDX_CODE_THEMES,
  langs: MdxCodeLangs = DEFAULT_MDX_CODE_LANGS,
): Promise<MdxCodeHighlighter> {
  const themeList = dedupe([themes.light, themes.dark])
  const langList = langs.length > 0 ? dedupe(langs) : []
  const highlighter: Highlighter = await createHighlighter({
    themes: themeList,
    langs: langList,
  })

  return {
    codeToHtml: (code: string, lang?: string) => {
      return highlighter.codeToHtml(code, {
        lang: lang ?? 'text',
        themes: { light: themes.light, dark: themes.dark },
        defaultColor: false,
      })
    },
  }
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.length > 0)))
}

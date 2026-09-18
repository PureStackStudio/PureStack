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
  'ts-tags',
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

const TYPESCRIPT_LANGS = new Set(['typescript', 'ts', 'cts', 'mts'])
const TYPESCRIPT_WITH_TAGS_LANG = 'ts-tags'

export async function createMdxHighlighter(
  themes: MdxCodeThemes = DEFAULT_MDX_CODE_THEMES,
  langs: MdxCodeLangs = DEFAULT_MDX_CODE_LANGS,
): Promise<MdxCodeHighlighter> {
  const themeList = dedupe([themes.light, themes.dark])
  const langList = resolveLoadedLanguages(langs)
  const highlighter: Highlighter = await createHighlighter({
    themes: themeList,
    langs: langList,
  })

  return {
    codeToHtml: (code: string, lang?: string) => {
      return highlighter.codeToHtml(code, {
        lang: resolveHighlightLanguage(lang),
        themes: { light: themes.light, dark: themes.dark },
        defaultColor: false,
      })
    },
  }
}

function resolveLoadedLanguages(langs: string[]) {
  const resolved = dedupe(langs.map(normalizeLanguageName))
  if (
    resolved.some((lang) => TYPESCRIPT_LANGS.has(lang)) &&
    !resolved.includes(TYPESCRIPT_WITH_TAGS_LANG) &&
    !resolved.includes('lit')
  ) {
    resolved.push(TYPESCRIPT_WITH_TAGS_LANG)
  }
  return resolved
}

function resolveHighlightLanguage(lang: string | undefined) {
  const normalized = normalizeLanguageName(lang ?? 'text')
  return TYPESCRIPT_LANGS.has(normalized)
    ? TYPESCRIPT_WITH_TAGS_LANG
    : normalized || 'text'
}

function normalizeLanguageName(value: string) {
  return value.trim().toLowerCase()
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.length > 0)))
}

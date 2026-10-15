import { createHighlighter, type Highlighter } from 'shiki'
import { DEFAULT_CODE_LANGUAGES, normalizeCodeLanguage } from './codeLanguages'

export interface MdxCodeHighlighter {
  codeToHtml: (code: string, lang?: string) => string | Promise<string>
}

export type MdxShikiFactory = (
  options: Parameters<typeof createHighlighter>[0],
) => Highlighter | Promise<Highlighter>

export interface MdxCodeThemes {
  light: string
  dark: string
}

export type MdxCodeLangs = string[]

export const DEFAULT_MDX_CODE_THEMES: MdxCodeThemes = {
  light: 'github-light',
  dark: 'github-dark',
}

export const DEFAULT_MDX_CODE_LANGS: MdxCodeLangs = DEFAULT_CODE_LANGUAGES

const TYPESCRIPT_WITH_TAGS_LANG = 'ts-tags'

export async function createMdxHighlighter(
  themes: MdxCodeThemes = DEFAULT_MDX_CODE_THEMES,
  langs: MdxCodeLangs = DEFAULT_MDX_CODE_LANGS,
  create: MdxShikiFactory = createHighlighter,
): Promise<MdxCodeHighlighter> {
  const themeList = dedupe([themes.light, themes.dark])
  const langList = resolveLoadedLanguages(langs)
  const highlighter = await create({
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
  const resolved = dedupe(langs.map(normalizeCodeLanguage))
  if (
    resolved.includes('typescript') &&
    !resolved.includes(TYPESCRIPT_WITH_TAGS_LANG)
  ) {
    resolved.push(TYPESCRIPT_WITH_TAGS_LANG)
  }
  return resolved
}

function resolveHighlightLanguage(lang: string | undefined) {
  const normalized = normalizeCodeLanguage(lang ?? 'text')
  return normalized === 'typescript'
    ? TYPESCRIPT_WITH_TAGS_LANG
    : normalized || 'text'
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.length > 0)))
}

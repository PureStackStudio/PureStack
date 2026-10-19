import {
  DEFAULT_CODE_LANGUAGES,
  type MdxCodeHighlighter,
  normalizeCodeLanguage,
} from '@purestack/ts-common'
import { createHighlighter, type Highlighter } from 'shiki'
import { openShikiCache } from './shikiCache'

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

export interface MdxHighlighterOptions {
  /** A custom factory; its grammars are unknown, so its output is never cached. */
  create?: MdxShikiFactory
  /** `false` disables the persistent cache for this run. Defaults to `true`. */
  cache?: boolean
}

export async function createMdxHighlighter(
  themes: MdxCodeThemes = DEFAULT_MDX_CODE_THEMES,
  langs: MdxCodeLangs = DEFAULT_MDX_CODE_LANGS,
  { create, cache: useCache = true }: MdxHighlighterOptions = {},
): Promise<MdxCodeHighlighter> {
  const options = {
    themes: dedupe([themes.light, themes.dark]),
    langs: resolveLoadedLanguages(langs),
  }
  const render = (highlighter: Highlighter, code: string, lang: string) =>
    highlighter.codeToHtml(code, {
      lang,
      themes: { light: themes.light, dark: themes.dark },
      defaultColor: false,
    })

  if (create || !useCache) {
    const highlighter = await (create ?? createHighlighter)(options)
    return {
      codeToHtml: (code: string, lang?: string) =>
        render(highlighter, code, resolveHighlightLanguage(lang)),
    }
  }

  // Bundled grammars and themes are identified by name and Shiki's version, so
  // their output is reused across builds. Shiki loads on the first cache miss.
  const cache = openShikiCache(themes, options.langs)
  let highlighter: Promise<Highlighter> | undefined
  return {
    flush: () => cache.flush(),
    async codeToHtml(code: string, lang?: string) {
      const resolved = resolveHighlightLanguage(lang)
      return cache.getOrSetAsync(`${resolved}\0${code}`, async () => {
        highlighter ??= createHighlighter(options)
        return render(await highlighter, code, resolved)
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

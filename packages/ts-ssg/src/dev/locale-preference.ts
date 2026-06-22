import type http from 'node:http'
import type { I18nConfig } from '@purestack/ts-common'

export type RequestLocalePreference = {
  locale?: string
  source: 'query' | 'cookie' | 'accept-language' | 'default' | 'none'
}

export function resolveRequestLocale(
  req: http.IncomingMessage,
  i18n: I18nConfig,
): RequestLocalePreference {
  if (!i18n.enabled) return { source: 'none' }
  const url = new URL(req.url ?? '/', 'http://localhost')
  const queryLocale = normalizeRequestedLocale(
    url.searchParams.get(i18n.queryParam),
    i18n,
  )
  if (queryLocale) return { locale: queryLocale, source: 'query' }
  const cookieLocale = normalizeRequestedLocale(
    readCookie(req.headers.cookie, i18n.cookieName),
    i18n,
  )
  if (cookieLocale) return { locale: cookieLocale, source: 'cookie' }
  const acceptLocale = resolveAcceptLanguageLocale(
    req.headers['accept-language'],
    i18n,
  )
  return {
    locale: acceptLocale,
    source: acceptLocale === i18n.defaultLocale ? 'default' : 'accept-language',
  }
}

export function buildLocalePreferenceCookie(
  cookieName: string,
  locale: string,
) {
  return `${cookieName}=${encodeURIComponent(locale)}; Path=/; SameSite=Lax`
}

function resolveAcceptLanguageLocale(
  header: string | string[] | undefined,
  i18n: I18nConfig,
) {
  const value = Array.isArray(header) ? header.join(',') : header
  if (!value) return i18n.defaultLocale
  const weighted = value
    .split(',')
    .map((entry) => parseAcceptLanguageEntry(entry))
    .filter((entry): entry is { locale: string; q: number } => Boolean(entry))
    .sort((left, right) => right.q - left.q)
  for (const entry of weighted) {
    const exact = normalizeRequestedLocale(entry.locale, i18n)
    if (exact) return exact
    const language = entry.locale.split('-')[0]
    const fallback = i18n.locales.find(
      (locale) => locale.split('-')[0] === language,
    )
    if (fallback) return fallback
  }
  return i18n.defaultLocale
}

function parseAcceptLanguageEntry(value: string) {
  const [localePart = '', ...params] = value.trim().split(';')
  const locale = localePart.trim()
  if (!locale || locale === '*') return undefined
  const qParam = params.find((entry) => entry.trim().startsWith('q='))
  const q = qParam ? Number(qParam.split('=')[1]) : 1
  return { locale, q: Number.isFinite(q) ? q : 1 }
}

function normalizeRequestedLocale(
  value: string | null | undefined,
  i18n: I18nConfig,
) {
  if (!value) return undefined
  return i18n.locales.includes(value) ? value : undefined
}

function readCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const [rawName = '', ...rawValue] = part.trim().split('=')
    if (rawName !== name) continue
    return decodeURIComponent(rawValue.join('='))
  }
  return undefined
}

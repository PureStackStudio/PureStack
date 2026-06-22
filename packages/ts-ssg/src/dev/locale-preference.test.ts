import type http from 'node:http'
import type { I18nConfig } from '@purestack/ts-common'
import { describe, expect, it } from 'vitest'
import {
  buildLocalePreferenceCookie,
  resolveRequestLocale,
} from './locale-preference'

const i18n: I18nConfig = {
  enabled: true,
  defaultLocale: 'en',
  locales: ['en', 'tr'],
  urlStrategy: 'hidden',
  queryParam: 'lang',
  cookieName: 'puregate.lang',
}

describe('dev server i18n locale preference', () => {
  it('prefers query locale over cookie and Accept-Language', () => {
    const preference = resolveRequestLocale(
      request('/?lang=tr', {
        cookie: 'puregate.lang=en',
        'accept-language': 'en-US,en;q=0.9',
      }),
      i18n,
    )

    expect(preference).toEqual({ locale: 'tr', source: 'query' })
  })

  it('falls back through cookie, Accept-Language, and default locale', () => {
    expect(
      resolveRequestLocale(request('/', { cookie: 'puregate.lang=tr' }), i18n),
    ).toEqual({ locale: 'tr', source: 'cookie' })

    expect(
      resolveRequestLocale(
        request('/', { 'accept-language': 'tr-TR,tr;q=0.9' }),
        i18n,
      ),
    ).toEqual({ locale: 'tr', source: 'accept-language' })

    expect(resolveRequestLocale(request('/'), i18n)).toEqual({
      locale: 'en',
      source: 'default',
    })
  })

  it('builds the hidden-strategy preference cookie from query locale', () => {
    expect(buildLocalePreferenceCookie('puregate.lang', 'tr')).toBe(
      'puregate.lang=tr; Path=/; SameSite=Lax',
    )
  })
})

function request(
  url: string,
  headers: http.IncomingHttpHeaders = {},
): http.IncomingMessage {
  return {
    url,
    headers,
  } as http.IncomingMessage
}

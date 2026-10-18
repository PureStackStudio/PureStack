import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { componentsPlugin } from '@purestack/ts-components'
import {
  analyticsPlugin,
  authStateHintPlugin,
  consentPlugin,
} from '@purestack/ts-page-scripts'
import { pagefindPlugin } from '@purestack/ts-pagefind'
import { seoPlugin } from '@purestack/ts-seo'
import { themePlugin } from '@purestack/ts-theme'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { resolveSiteConfig as resolveConfig } from '../config/config'
import { createDefaultPlugins } from './default-plugins'

describe('plugin-owned settings', () => {
  let root: string | undefined
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ssg-plugin-settings-'))
  })
  const resolveSiteConfig = (
    input: Parameters<typeof resolveConfig>[0] = {},
    options: Parameters<typeof resolveConfig>[1] = {},
  ) => resolveConfig({ contentDir: root, ...input }, options)
  afterEach(() => {
    if (root) fs.rmSync(root, { recursive: true, force: true })
  })

  it('omits unused settings and does not validate inputs owned by absent plugins', () => {
    if (!root) throw new Error('Expected fixture directory')
    fs.writeFileSync(
      path.join(root, 'siteConfig.json'),
      JSON.stringify({
        style: { theme: { skin: 'does-not-exist' } },
        analytics: { ga4: { measurementId: 'invalid' } },
        consent: { categories: [{ id: 'duplicate' }, { id: 'duplicate' }] },
      }),
    )
    const config = resolveSiteConfig(
      { contentDir: root },
      { defaultPlugins: false },
    )
    for (const key of [
      'style',
      'docLayout',
      'pageToc',
      'favicon',
      'logo',
      'auth',
      'consent',
      'analytics',
      'pagefind',
      'preview',
    ]) {
      expect(config).not.toHaveProperty(key)
    }
    expect(config.html.minify).toBe(false)
    expect(() =>
      resolveSiteConfig(
        { contentDir: root },
        { defaultPlugins: false, plugins: [themePlugin()] },
      ),
    ).toThrow(/purestack:theme.*config.resolve.*Unknown theme skin/)
    expect(() =>
      resolveSiteConfig(
        { contentDir: root },
        { defaultPlugins: false, plugins: [analyticsPlugin()] },
      ),
    ).toThrow(/purestack:analytics.*config.resolve.*measurementId/)
    expect(() =>
      resolveSiteConfig(
        { contentDir: root },
        { defaultPlugins: false, plugins: [consentPlugin()] },
      ),
    ).toThrow(/purestack:consent.*Duplicate consent category/)
  })

  it('does not retain theme guarantees when a default plugin is replaced', () => {
    const config = resolveSiteConfig(
      {},
      { plugins: [{ name: 'purestack:theme' }] },
    )
    expect(config).not.toHaveProperty('style')
    expect(config).not.toHaveProperty('docLayout')
    expect(config.logo).toBeDefined()
  })

  it('preserves custom backend identifiers without selecting an engine in core', () => {
    expect(
      resolveSiteConfig({}, { defaultPlugins: false }).mdx,
    ).not.toHaveProperty('highlighter')
    expect(
      resolveSiteConfig(
        { mdx: { highlighter: 'custom-engine' } },
        { defaultPlugins: false },
      ).mdx.highlighter,
    ).toBe('custom-engine')
    expect(
      resolveSiteConfig({ mdx: { highlighter: 'custom-engine' } }).mdx
        .highlighter,
    ).toBe('custom-engine')
    expect(resolveSiteConfig().mdx.highlighter).toBe('highlightjs')
  })

  it.each([
    [themePlugin, ['style', 'docLayout', 'pageToc']],
    [componentsPlugin, ['logo']],
    [authStateHintPlugin, ['auth']],
    [consentPlugin, ['consent']],
    [analyticsPlugin, ['analytics']],
    [pagefindPlugin, ['pagefind']],
    [seoPlugin, ['preview']],
  ] as const)('resolves only the settings supplied by %s', (factory, keys) => {
    const config = resolveSiteConfig(
      {},
      { defaultPlugins: false, plugins: [factory()] },
    )
    for (const key of [
      'style',
      'docLayout',
      'pageToc',
      'logo',
      'auth',
      'consent',
      'analytics',
      'pagefind',
      'preview',
    ]) {
      expect(config[key as keyof typeof config] !== undefined).toBe(
        (keys as readonly string[]).includes(key),
      )
    }
  })

  it('preserves standard configuration when standard plugin order is reversed', () => {
    const input = {
      consent: { enabled: true },
      analytics: { ga4: { measurementId: 'g-test1234' } },
      style: { theme: { skin: 'standard' } },
      pagefind: { excludePaths: ['docs', 'docs/', ''] },
      preview: { title: ' Preview ', imageWidth: 1200 },
    }
    const reversed = resolveSiteConfig(input, {
      defaultPlugins: false,
      plugins: createDefaultPlugins().reverse(),
    })
    const standard = resolveSiteConfig(input)
    // Skin factories create fresh callback closures in each resolution.
    expect(JSON.parse(JSON.stringify(reversed))).toEqual(
      JSON.parse(JSON.stringify(standard)),
    )
    expect(reversed.consent).toEqual(standard.consent)
  })

  it('normalizes late overrides before dependent factories and attributes invalid overrides', () => {
    const config = resolveSiteConfig(
      { analytics: { ga4: { measurementId: 'G-INITIAL' } } },
      {
        plugins: [
          {
            name: 'site',
            config: {
              resolve: () => ({
                analytics: { ga4: { measurementId: ' g-final ' } },
                pagefind: { excludePaths: ['guide', 'guide/', ''] },
                preview: { title: ' Final ', imageWidth: -1 },
              }),
            },
          },
        ],
      },
    )
    expect(config.analytics?.ga4.measurementId).toBe('G-FINAL')
    expect(config.pagefind?.excludePaths).toEqual(['/guide/'])
    expect(config.preview?.title).toBe('Final')
    expect(config.preview?.imageWidth).toBeUndefined()
    expect(() =>
      resolveSiteConfig(
        {},
        {
          plugins: [
            {
              name: 'site',
              config: {
                resolve: () => ({ analytics: { ga4: { enabled: true } } }),
              },
            },
          ],
        },
      ),
    ).toThrow(/purestack:analytics.*config.normalize.*measurementId/)
  })

  it.each([null, [], 42, Promise.resolve({})])(
    'attributes invalid normalizer results (%j)',
    (value) => {
      expect(() =>
        resolveSiteConfig(
          {},
          {
            defaultPlugins: false,
            plugins: [
              { name: 'invalid', config: { normalize: () => value } } as never,
            ],
          },
        ),
      ).toThrow(
        'Plugin "invalid" failed in config.normalize: config.normalize must return a configuration object synchronously.',
      )
    },
  )

  it('runs every normalizer before any finalizer', () => {
    const calls: string[] = []
    resolveSiteConfig(
      {},
      {
        defaultPlugins: false,
        plugins: [
          {
            name: 'first',
            config: {
              resolve: () => {
                calls.push('resolve:first')
                return {}
              },
              normalize: () => {
                calls.push('normalize:first')
                return {}
              },
              finalize: () => {
                calls.push('finalize:first')
                return {}
              },
            },
          },
          {
            name: 'second',
            config: {
              resolve: () => {
                calls.push('resolve:second')
                return {}
              },
              normalize: () => {
                calls.push('normalize:second')
                return {}
              },
              finalize: () => {
                calls.push('finalize:second')
                return {}
              },
            },
          },
        ],
      },
    )
    expect(calls).toEqual([
      'resolve:first',
      'resolve:second',
      'normalize:first',
      'normalize:second',
      'finalize:first',
      'finalize:second',
    ])
  })

  it('does not bypass configured consent when analytics is used without the consent runtime', () => {
    const config = resolveSiteConfig(
      {
        consent: { enabled: true },
        analytics: { ga4: { measurementId: 'G-TEST1234' } },
      },
      { defaultPlugins: false, plugins: [analyticsPlugin()] },
    )
    expect(config.consent?.services[0]?.ga4MeasurementId).toBe('G-TEST1234')
  })
})

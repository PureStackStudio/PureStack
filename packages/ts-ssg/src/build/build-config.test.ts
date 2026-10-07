import { resolveThemeFileName, resolveThemeHref } from '@purestack/ts-style'
import { describe, expect, it } from 'vitest'
import { resolveBuildSiteConfig } from './build-config'

describe('resolveBuildSiteConfig', () => {
  it.each([true, false])(
    'keeps configured stylesheet paths stable for manifest reuse (publish %s)',
    (publish) => {
      const input = {
        siteConfig: {
          rootDir: process.cwd(),
          style: {
            fileName: 'site.css',
            href: '/assets/site.css?custom=1#theme',
          },
        },
        publish: { enabled: publish },
      }
      const first = resolveBuildSiteConfig(input)
      const second = resolveBuildSiteConfig(input)
      expect(first.style.fileName).toBe('site.css')
      expect(second.style.fileName).toBe(first.style.fileName)
      expect(first.style.href).toBe(input.siteConfig.style.href)
      for (const theme of first.style.themes) {
        expect(resolveThemeHref(first.style.href, theme)).toBe(
          `/assets/${resolveThemeFileName(first.style.fileName, theme)}?custom=1#theme`,
        )
      }
    },
  )

  it('applies publish overrides above site config values', () => {
    const publishDir = `${process.cwd()}-publish`
    const config = resolveBuildSiteConfig({
      siteConfig: {
        rootDir: process.cwd(),
        outDir: `${process.cwd()}-dev`,
        publishDir,
        html: {
          minify: false,
        },
        style: {
          pretty: true,
        },
      },
      publish: {
        enabled: true,
      },
    })

    expect(config.outDir).toBe(publishDir)
    expect(config.html.minify).toBe(true)
    expect(config.style.pretty).toBe(false)
  })

  it('keeps regular build config values when publish is not enabled', () => {
    const config = resolveBuildSiteConfig({
      siteConfig: {
        rootDir: process.cwd(),
        html: {
          minify: false,
        },
        style: {
          pretty: true,
        },
      },
    })

    expect(config.html.minify).toBe(false)
    expect(config.style.pretty).toBe(true)
  })
})

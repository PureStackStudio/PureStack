import os from 'node:os'
import path from 'node:path'
import type { SiteConfigInput } from '@purestack/ts-common'
import { resolveThemeFileName, resolveThemeHref } from '@purestack/ts-style'
import { describe, expect, it } from 'vitest'
import { createDefaultPlugins } from '../plugins/default-plugins'
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
      const first = resolveBuildSiteConfig(input, createDefaultPlugins())
      const second = resolveBuildSiteConfig(input, createDefaultPlugins())
      if (!first.style || !second.style)
        throw new Error('Expected theme settings')
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
    const config = resolveBuildSiteConfig(
      {
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
      },
      createDefaultPlugins(),
    )

    expect(config.outDir).toBe(publishDir)
    expect(config.html.minify).toBe(true)
    expect(config.style?.pretty).toBe(false)
  })

  it('builds a named output beside outDir', () => {
    const outDir = path.join(process.cwd(), 'dist', 'site')
    const config = resolveBuildSiteConfig(
      {
        siteConfig: { rootDir: process.cwd(), outDir },
        options: { outName: 'preview-2' },
      },
      createDefaultPlugins(),
    )
    expect(config.outDir).toBe(`${outDir}-preview-2`)
  })

  it.each(['', 'Preview', '-2', '..', '../site', 'a/b', 'a\\b'])(
    'rejects the output name %j',
    (outName) => {
      expect(() =>
        resolveBuildSiteConfig(
          { siteConfig: { rootDir: process.cwd() }, options: { outName } },
          createDefaultPlugins(),
        ),
      ).toThrow('Output name')
    },
  )

  it('rejects an output name for publish', () => {
    expect(() =>
      resolveBuildSiteConfig(
        {
          siteConfig: { rootDir: process.cwd() },
          options: { outName: 'preview' },
          publish: { enabled: true },
        },
        createDefaultPlugins(),
      ),
    ).toThrow('publish always writes to publishDir')
  })

  describe('output safety', () => {
    const rootDir = path.join(process.cwd(), '.tmp-safety', 'project')
    const contentDir = path.join(process.cwd(), '.tmp-safety', 'content')
    const resolveWith = (siteConfig: SiteConfigInput) => () =>
      resolveBuildSiteConfig(
        { siteConfig: { rootDir, contentDir, ...siteConfig } },
        createDefaultPlugins(),
      )

    it.each([
      ['the content directory', contentDir],
      ['the content directory', path.dirname(contentDir)],
      ['the project root', rootDir],
    ])('rejects an outDir that is or holds %s (%s)', (label, outDir) => {
      expect(resolveWith({ outDir })).toThrow(
        `outDir "${outDir}" must not be or contain ${label}`,
      )
    })

    it.each([
      ['outDir', process.cwd()],
      ['outDir', os.homedir()],
      ['publishDir', process.cwd()],
      ['publishDir', os.homedir()],
    ])('rejects a %s of %s', (key, output) => {
      expect(resolveWith({ [key]: output })).toThrow(
        `${key} "${output}" must not be or contain`,
      )
    })

    it('rejects a filesystem root', () => {
      const root = path.parse(process.cwd()).root
      expect(resolveWith({ publishDir: root })).toThrow(
        `publishDir "${root}" must not be or contain the filesystem root`,
      )
    })

    it('accepts outputs beside the sources', () => {
      const outDir = path.join(path.dirname(rootDir), 'dist', 'site')
      expect(resolveWith({ outDir })().outDir).toBe(outDir)
    })
  })

  it('keeps regular build config values when publish is not enabled', () => {
    const config = resolveBuildSiteConfig(
      {
        siteConfig: {
          rootDir: process.cwd(),
          html: {
            minify: false,
          },
          style: {
            pretty: true,
          },
        },
      },
      createDefaultPlugins(),
    )

    expect(config.html.minify).toBe(false)
    expect(config.style?.pretty).toBe(true)
  })
})

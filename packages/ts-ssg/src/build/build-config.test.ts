import { describe, expect, it } from 'vitest'
import { resolveBuildSiteConfig } from './build-config'

describe('resolveBuildSiteConfig', () => {
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

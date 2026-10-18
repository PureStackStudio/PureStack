import fs from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { h } from '@purestack/ts-html'
import {
  type ImageDiagnostic,
  type ImagesPluginOptions,
  imagesPlugin,
} from '@purestack/ts-images'
import { runInDom } from '@purestack/ts-minidom'
import { build } from 'esbuild'
import { disableLogger, getLogger } from 'logpot'
import { defineComponent, html as markup } from 'regor'
import sharp from 'sharp'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createIncrementalBuilder } from '../build/incremental'
import { readManifest } from '../build/manifest'
import { type BuildInput, buildSite } from '../build/site'
import { resolveSiteConfig } from '../config/config'
import { type DevServerHandle, startDevServer } from '../dev/server'
import { makeRepoTempDir } from '../test/repoTempDir'

describe('optional images plugin', () => {
  let root: string | undefined
  let server: DevServerHandle | undefined
  beforeAll(() => disableLogger())
  afterAll(() => getLogger().close())
  afterEach(async () => {
    await server?.close()
    server = undefined
    if (root) await fs.rm(root, { recursive: true, force: true })
  })
  async function fixture(
    source = '![A dashboard](./photo.png)',
    options: ImagesPluginOptions = {},
  ) {
    root = await makeRepoTempDir('.tmp-images-')
    const contentDir = path.join(root, 'content'),
      outDir = path.join(root, 'out')
    await fs.mkdir(contentDir)
    await fs.writeFile(path.join(contentDir, 'index.md'), source)
    await writeImage(path.join(contentDir, 'photo.png'), 'red')
    const diagnostics: ImageDiagnostic[] = []
    const plugin = imagesPlugin({
      cacheDir: path.join(root, 'cache'),
      widths: [16, 32, 128],
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
      ...options,
    })
    const input: BuildInput = {
      siteConfig: {
        rootDir: root,
        contentDir,
        outDir,
        basePath: '/docs',
        navigation: { mode: 'none' },
        mdx: { disableHighlighter: true },
      },
      options: {
        defaultPlugins: false,
        plugins: [
          {
            name: 'layout',
            templates: {
              doc: ({ head, bodyHtml, headerHtml, footerHtml }) =>
                h('html').push(
                  head,
                  h('body').raw(
                    (headerHtml ?? '') + bodyHtml + (footerHtml ?? ''),
                  ),
                ),
            },
          },
          plugin,
        ],
      },
    }
    return { input, contentDir, outDir, diagnostics, plugin }
  }
  const html = (outDir: string, file = 'index.html') =>
    fs.readFile(path.join(outDir, file), 'utf8')
  async function generated(outDir: string) {
    return (
      await fs.readdir(path.join(outDir, '_assets', 'images')).catch(() => [])
    ).sort()
  }

  it('enables the named image export and disables defaults through JSON for build, publish, and lazy development without a TypeScript config', async () => {
    const { input, contentDir, outDir } = await fixture(undefined, {
      formats: ['webp'],
    })
    await buildSite(input)
    const expectedHtml = await html(outDir)
    const expectedFiles = await generated(outDir)
    const expectedBytes = await Promise.all(
      expectedFiles.map((file) =>
        fs.readFile(path.join(outDir, '_assets', 'images', file)),
      ),
    )
    // A site-only package exercises fallback resolution without competing with
    // the workspace's own image package. Its code is the real image integration.
    const packageDir = path.join(root ?? '', 'node_modules', 'example-images')
    await fs.mkdir(packageDir, { recursive: true })
    const bundled = await build({
      entryPoints: [
        fileURLToPath(
          new URL('../../../ts-images/src/index.ts', import.meta.url),
        ),
      ],
      bundle: true,
      write: false,
      format: 'esm',
      platform: 'node',
      packages: 'external',
      logLevel: 'silent',
    })
    await fs.writeFile(
      path.join(packageDir, 'index.mjs'),
      bundled.outputFiles[0].contents,
    )
    await fs.writeFile(
      path.join(packageDir, 'package.json'),
      JSON.stringify({
        name: 'example-images',
        type: 'module',
        exports: { '.': { import: './index.mjs' } },
      }),
    )
    const config = {
      defaultPlugins: false,
      plugins: ['example-images#imagesPlugin'],
      publishDir: '../publish',
      extensions: {
        images: {
          widths: [16, 32, 128],
          formats: ['webp'],
          cacheDir: path.join(root ?? '', 'cache'),
          enabled: true,
        },
      },
    }
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    input.options = {
      ...input.options,
      defaultPlugins: undefined,
      plugins: input.options?.plugins?.filter(
        (plugin) => plugin.name !== 'purestack:images',
      ),
    }
    await buildSite(input)
    expect(await html(outDir)).toBe(expectedHtml)
    expect(await generated(outDir)).toEqual(expectedFiles)
    expect(
      await Promise.all(
        expectedFiles.map((file) =>
          fs.readFile(path.join(outDir, '_assets', 'images', file)),
        ),
      ),
    ).toEqual(expectedBytes)
    await buildSite({ ...input, publish: { enabled: true } })
    expect(await generated(path.join(root ?? '', 'publish'))).toEqual(
      expectedFiles,
    )
    const port = await freePort()
    server = await startDevServer({
      host: '127.0.0.1',
      port,
      watch: false,
      liveReload: false,
      build: input,
    })
    const response = await fetch(`http://127.0.0.1:${port}/docs/`)
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('<picture>')
    expect(await generated(outDir)).toEqual(expectedFiles)
    await server.close()
    server = undefined
    config.extensions.images.enabled = false
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    await buildSite(input)
    expect(await html(outDir)).not.toContain('srcset=')
    expect(await generated(outDir)).toEqual([])
    expect(await fs.stat(path.join(outDir, 'photo.png'))).toBeDefined()
  })

  it('optimizes ordinary Markdown, emits real format bytes, reserves aspect ratio, and keeps the original', async () => {
    const { input, contentDir, outDir, diagnostics } = await fixture()
    const result = await buildSite(input)
    expect(await generated(outDir)).toHaveLength(9)
    expect(result.assets?.total).toBe(10)
    expect(await fs.readFile(path.join(outDir, 'photo.png'))).toEqual(
      await fs.readFile(path.join(contentDir, 'photo.png')),
    )
    await runInDom(await html(outDir), (document) => {
      const image = document.querySelector('picture > img')
      expect(image?.getAttribute('alt')).toBe('A dashboard')
      expect(image?.getAttribute('src')).toMatch(
        /^\/docs\/_assets\/images\/[a-f0-9]{64}\.64\.png$/,
      )
      expect(image?.getAttribute('width')).toBe('64')
      expect(image?.getAttribute('height')).toBe('32')
      expect(image?.getAttribute('loading')).toBe('lazy')
      expect(image?.getAttribute('decoding')).toBe('async')
      expect(
        document
          .querySelector('source[type="image/avif"]')
          ?.getAttribute('srcset'),
      ).toContain('32w')
      expect(
        document
          .querySelector('source[type="image/webp"]')
          ?.getAttribute('sizes'),
      ).toBe('100vw')
    })
    for (const file of await generated(outDir)) {
      const metadata = await sharp(
        await fs.readFile(path.join(outDir, '_assets', 'images', file)),
      ).metadata()
      expect(metadata.width).toBeLessThanOrEqual(64)
      expect(
        file.endsWith('.avif')
          ? ['heif', 'avif']
          : [path.extname(file).slice(1)],
      ).toContain(metadata.format)
    }
    expect(diagnostics[0]).toMatchObject({
      cache: 'miss',
      variants: 9,
      source: 'photo.png',
    })
    expect(
      (await readManifest(outDir))?.pageAssets?.['index.md'].dependencies,
    ).toEqual(['photo.png'])
  })

  it('optimizes unquoted HTML source URLs', async () => {
    const { input, outDir } = await fixture('<img src=./photo.png alt=Photo>')
    await buildSite(input)
    runInDom(
      await fs.readFile(path.join(outDir, 'index.html'), 'utf8'),
      (document) => {
        expect(
          document.querySelector('picture > img')?.getAttribute('alt'),
        ).toBe('Photo')
        expect(
          document.querySelector('picture > img')?.getAttribute('src'),
        ).toMatch(/^\/docs\/_assets\/images\//)
      },
    )
  })

  it('honors author attributes and explicit presets and priority', async () => {
    const { input, outDir } = await fixture(
      '<a href="./photo.png"><img id="hero" class="cover" src="./photo.png?version=1#preview" alt="A" width="40" sizes="50vw" loading="eager" decoding="sync" data-image-preset="hero"></a>',
      { formats: ['webp'] },
    )
    await buildSite(input)
    await runInDom(await html(outDir), (document) => {
      const image = document.querySelector('#hero')
      expect(image?.getAttribute('class')).toBe('cover')
      expect(image?.getAttribute('width')).toBe('40')
      expect(image?.getAttribute('height')).toBe('20')
      expect(image?.getAttribute('sizes')).toBe('50vw')
      expect(image?.getAttribute('loading')).toBe('eager')
      expect(image?.getAttribute('decoding')).toBe('sync')
      expect(image?.getAttribute('fetchpriority')).toBe('high')
      expect(image?.getAttribute('src')).toContain('?version=1#preview')
      expect(document.querySelector('a')?.getAttribute('href')).toBe(
        '/docs/photo.png',
      )
      expect(image?.hasAttribute('data-image-preset')).toBe(false)
    })
  })

  it('preserves existing picture/srcset markup, external URLs, SVG, and opt-outs', async () => {
    const { input, contentDir, outDir } = await fixture(
      [
        '<picture><source srcset="./photo.png 64w"><img src="./photo.png" alt="Authored"></picture>',
        '<img src="./photo.png" srcset="./photo.png 1x" alt="Set">',
        '<img src="https://example.com/image.png" alt="Remote">',
        '<img src="./logo.svg" alt="SVG">',
        '<img src="./photo.png" data-image-optimize="false" alt="Original">',
      ].join('\n\n'),
    )
    await fs.writeFile(
      path.join(contentDir, 'logo.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg"/>',
    )
    await buildSite(input)
    expect(await generated(outDir)).toHaveLength(0)
    await runInDom(await html(outDir), (document) => {
      expect(document.querySelectorAll('picture')).toHaveLength(1)
      expect(document.querySelectorAll('img[width]')).toHaveLength(0)
      expect(
        document.querySelector('img[alt="Remote"]')?.getAttribute('src'),
      ).toBe('https://example.com/image.png')
    })
  })

  it('resolves shared partial and template images from their own content directories', async () => {
    const { input, contentDir, outDir } = await fixture('# Nested page', {
      formats: ['webp'],
    })
    await fs.mkdir(path.join(contentDir, 'guides'))
    await fs.writeFile(path.join(contentDir, 'guides', 'index.md'), '# Guide')
    await fs.writeFile(
      path.join(contentDir, 'header.mdx'),
      '<img alt="Header" src="./photo.png">\n\n<template><img alt="Template" src="./photo.png"></template>',
    )
    await buildSite(input)
    const manifest = await readManifest(outDir)
    expect(
      manifest?.pageAssets?.[path.join('guides', 'index.md')]?.dependencies,
    ).toEqual(['photo.png'])
    const output = await html(outDir, 'guides/index.html')
    expect(output).toContain('alt="Template"')
    expect(output).not.toContain('src="./photo.png"')
    await runInDom(output, (document) => {
      expect(
        document.querySelector('img[alt="Header"]')?.getAttribute('src'),
      ).toContain('/docs/_assets/images/')
      expect(
        (
          document.querySelector('template') as HTMLTemplateElement
        )?.content.querySelector('picture'),
      ).not.toBeNull()
    })
  })

  it('uses locale fallback and invalidates it when a localized image appears', async () => {
    const { input, contentDir, outDir } = await fixture('# Home', {
      formats: ['webp'],
    })
    await fs.mkdir(path.join(contentDir, 'en'))
    await fs.mkdir(path.join(contentDir, 'de'))
    await writeImage(path.join(contentDir, 'en', 'photo.png'), 'blue')
    await fs.writeFile(
      path.join(contentDir, 'de', 'index.md'),
      '![Localized](./photo.png)',
    )
    input.siteConfig = {
      ...input.siteConfig,
      i18n: { defaultLocale: 'en', locales: ['en', 'de'] },
    }
    const builder = await createIncrementalBuilder(input)
    await builder.buildAll('localized')
    expect(
      (await readManifest(outDir))?.pageAssets?.[path.join('de', 'index.md')]
        ?.dependencies,
    ).toEqual(['de/photo.png', 'en/photo.png'])
    const first = await html(outDir, 'de/index.html')
    await writeImage(path.join(contentDir, 'de', 'photo.png'), 'green')
    await builder.applyChange(path.join(contentDir, 'de', 'photo.png'))
    await builder.renderIfDirtyByOutPath(path.join(outDir, 'de', 'index.html'))
    expect(await html(outDir, 'de/index.html')).not.toBe(first)
  })

  it('regenerates clean output from persistent cache and responds to image-only edits without rebuilding unrelated pages', async () => {
    const { input, contentDir, outDir, diagnostics } = await fixture(
      undefined,
      { formats: ['webp'] },
    )
    await fs.writeFile(path.join(contentDir, 'other.md'), '# Unrelated')
    input.options = { ...input.options, cleanOutDir: true }
    const builder = await createIncrementalBuilder(input)
    await builder.buildAll('first')
    const files = await generated(outDir)
    await builder.buildAll('cached')
    expect(await generated(outDir)).toEqual(files)
    expect(diagnostics.at(-1)?.cache).toBe('hit')
    const unrelated = await fs.stat(path.join(outDir, 'other', 'index.html'))
    await writeImage(path.join(contentDir, 'photo.png'), 'blue')
    expect(
      (await builder.applyChange(path.join(contentDir, 'photo.png')))
        .changedPages,
    ).toBe(1)
    expect(await generated(outDir)).not.toEqual(files)
    expect(
      (await fs.stat(path.join(outDir, 'other', 'index.html'))).mtimeMs,
    ).toBe(unrelated.mtimeMs)
  })

  it('generates only requested pages in lazy mode, survives deletion, and recovers when a missing image returns', async () => {
    const { input, contentDir, outDir } = await fixture(undefined, {
      formats: ['webp'],
    })
    await fs.writeFile(
      path.join(contentDir, 'unused.md'),
      '![Unused](./photo.png)',
    )
    input.options = { ...input.options, writeErrorPages: true }
    const builder = await createIncrementalBuilder(input)
    await builder.prepareForRequests()
    expect(await generated(outDir)).toHaveLength(0)
    await builder.renderByUrlPath('/')
    expect(await generated(outDir)).toHaveLength(6)
    await expect(
      fs.stat(path.join(outDir, 'unused', 'index.html')),
    ).rejects.toMatchObject({ code: 'ENOENT' })
    await fs.rm(path.join(contentDir, 'photo.png'))
    await builder.applyChange(path.join(contentDir, 'photo.png'))
    await builder.renderByUrlPath('/')
    expect(await html(outDir)).toContain('missing file')
    expect(
      (await readManifest(outDir))?.pageAssets?.['index.md'].dependencies,
    ).toEqual(['photo.png'])
    await writeImage(path.join(contentDir, 'photo.png'), 'green')
    await builder.applyChange(path.join(contentDir, 'photo.png'))
    await builder.renderByUrlPath('/')
    expect(await html(outDir)).toContain('<picture>')
    expect(await html(outDir)).not.toContain('Render Error')
  })

  it('selects images using include/exclude rules and supports fallback-only output', async () => {
    const { input, contentDir, outDir } = await fixture(
      '![Keep](./photo.png)\n\n![Selected](./selected.png)',
      { exclude: ['photo.png'], formats: [] },
    )
    await writeImage(path.join(contentDir, 'selected.png'), 'blue')
    await buildSite(input)
    expect(await generated(outDir)).toHaveLength(3)
    await runInDom(await html(outDir), (document) => {
      expect(document.querySelector('picture')).toBeNull()
      expect(
        document.querySelector('img[alt="Keep"]')?.getAttribute('src'),
      ).toBe('/docs/photo.png')
      expect(
        document.querySelector('img[alt="Selected"]')?.getAttribute('srcset'),
      ).toContain('32w')
    })
  })

  it('has no output effect when disabled, and no configuration effect when omitted', async () => {
    const { input, contentDir, outDir } = await fixture(undefined, {
      enabled: false,
    })
    await buildSite(input)
    expect(await generated(outDir)).toHaveLength(0)
    expect(await html(outDir)).not.toContain('<picture>')
    expect(
      resolveSiteConfig(
        { contentDir, extensions: { images: { widths: [] } } },
        { defaultPlugins: false },
      ).extensions.images,
    ).toEqual({ widths: [] })
  })

  it('processes server-rendered components and images added by later document hooks', async () => {
    const { input, outDir } = await fixture('<PreviewImage/>', { formats: [] })
    input.options?.plugins?.push({
      name: 'site-images',
      components: () => ({
        PreviewImage: defineComponent(
          markup`<img src="./photo.png" alt="Component"/>`,
        ),
      }),
      hooks: {
        onPageDocument(_context, page) {
          const image = page.document.createElement('img')
          image.setAttribute('src', './photo.png')
          image.setAttribute('alt', 'Hook')
          page.document.body.appendChild(image)
        },
      },
    })
    await buildSite(input)
    expect(await generated(outDir)).toHaveLength(3)
    await runInDom(await html(outDir), (document) => {
      expect(document.querySelectorAll('img[srcset]')).toHaveLength(2)
      expect(
        document.querySelector('img[alt="Hook"]')?.getAttribute('src'),
      ).toContain('/docs/_assets/images/')
    })
  })

  it('isolates simultaneous sites that reuse the same plugin instance', async () => {
    const { input, contentDir, outDir } = await fixture(undefined, {
      formats: [],
    })
    const secondContent = path.join(path.dirname(contentDir), 'second-content')
    const secondOutput = path.join(path.dirname(outDir), 'second-out')
    await fs.mkdir(secondContent)
    await fs.writeFile(
      path.join(secondContent, 'index.md'),
      '![Other](./photo.png)',
    )
    await writeImage(path.join(secondContent, 'photo.png'), 'blue')
    const second = {
      ...input,
      siteConfig: {
        ...input.siteConfig,
        contentDir: secondContent,
        outDir: secondOutput,
        extensions: { images: { widths: [24] } },
      },
    }
    await Promise.all([buildSite(input), buildSite(second)])
    expect(await generated(outDir)).toHaveLength(3)
    expect(await generated(secondOutput)).toHaveLength(1)
    const file = (await generated(secondOutput))[0]
    expect(
      (
        await sharp(
          await fs.readFile(path.join(secondOutput, '_assets', 'images', file)),
        ).metadata()
      ).width,
    ).toBe(24)
    expect((await readManifest(outDir))?.config.outDir).toBe(outDir)
    expect((await readManifest(secondOutput))?.config.outDir).toBe(secondOutput)
  })

  it('reports corrupt image failures and supports an explicit warning fallback', async () => {
    const { input, contentDir, outDir } = await fixture(undefined, {
      formats: [],
    })
    await fs.writeFile(path.join(contentDir, 'photo.png'), 'Not an image')
    await expect(buildSite(input)).rejects.toThrow(
      /purestack:images.*assets.processPage.*photo.png/,
    )
    input.siteConfig = {
      ...input.siteConfig,
      extensions: { images: { onError: 'warn' } },
    }
    await buildSite(input)
    expect(await html(outDir)).not.toContain('srcset=')
    expect(await generated(outDir)).toHaveLength(0)
  })

  it('rejects caches inside watched content or cleaned output directories', async () => {
    const { input, contentDir, outDir } = await fixture()
    for (const cacheDir of [
      path.join(contentDir, 'cache'),
      path.join(outDir, 'cache'),
    ]) {
      input.siteConfig = {
        ...input.siteConfig,
        extensions: { images: { cacheDir } },
      }
      await expect(buildSite(input)).rejects.toThrow(/cacheDir must be outside/)
    }
  })

  it.each([
    { widths: [] },
    { quality: { webp: 0 } },
    { concurrency: 0 },
    { cacheMaxAgeDays: -1 },
    { cacheMaxAgeDays: 1.5 },
    { formats: ['jpeg'] },
    { maxInputPixels: 0 },
    { extra: true },
  ])('attributes invalid settings to the plugin (%j)', async (settings) => {
    const { input } = await fixture(undefined, settings as ImagesPluginOptions)
    await expect(buildSite(input)).rejects.toThrow(
      /Plugin "purestack:images" failed in config.normalize/,
    )
  })

  it('merges typed extension input above factory and file settings and computes preset defaults after late overrides', async () => {
    const { input, contentDir } = await fixture(undefined, {
      widths: [16],
      quality: { webp: 20 },
    })
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify({
        extensions: { images: { widths: [24], quality: { webp: 30 } } },
      }),
    )
    const config = resolveSiteConfig(
      { ...input.siteConfig, extensions: { images: { widths: [32] } } },
      {
        defaultPlugins: false,
        plugins: [
          ...(input.options?.plugins ?? []),
          {
            name: 'late',
            config: {
              resolve: () => ({
                extensions: { images: { quality: { webp: 70 } } },
              }),
            },
          },
        ],
      },
    )
    expect(config.extensions.images?.widths).toEqual([32])
    expect(config.extensions.images?.quality.webp).toBe(70)
    expect(config.extensions.images?.presets.content.quality.webp).toBe(70)
  })

  it('serves generated AVIF and WebP with correct MIME types through the real lazy dev server', async () => {
    const { input } = await fixture()
    const port = await freePort()
    server = await startDevServer({
      host: '127.0.0.1',
      port,
      watch: false,
      liveReload: false,
      build: input,
    })
    const origin = `http://127.0.0.1:${port}`
    const response = await fetch(`${origin}/docs/`)
    expect(response.status).toBe(200)
    const output = await response.text()
    const urls =
      output.match(/\/docs\/_assets\/images\/[a-f0-9]+\.\d+\.(?:avif|webp)/g) ??
      []
    expect(urls.length).toBeGreaterThan(0)
    for (const extension of ['avif', 'webp']) {
      const url = urls.find((url) => url.endsWith(`.${extension}`))
      if (!url) throw new Error(`Expected ${extension} URL`)
      const asset = await fetch(origin + url)
      expect(asset.status).toBe(200)
      expect(asset.headers.get('content-type')).toBe(`image/${extension}`)
      expect((await asset.arrayBuffer()).byteLength).toBeGreaterThan(0)
    }
  })
})

async function writeImage(file: string, background: string) {
  await sharp({ create: { width: 64, height: 32, channels: 4, background } })
    .png()
    .toFile(file)
}
async function freePort() {
  const server = net.createServer()
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Expected port')
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
  return address.port
}

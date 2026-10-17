import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { imagePreset, resolveImagesConfig } from './config'
import { ImageProcessor } from './processor'

describe('image processor and persistent cache', () => {
  let root: string
  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'purestack-image-test-'))
  })
  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })
  const config = (options = {}) =>
    resolveImagesConfig(
      {
        widths: [32, 64, 128],
        formats: ['webp'],
        cacheDir: path.join(root, 'cache'),
        ...options,
      },
      {
        rootDir: root,
        contentDir: path.join(root, 'content'),
        outDir: path.join(root, 'out'),
        publishDir: path.join(root, 'publish'),
      },
    )
  const source = () => ({
    relPath: 'image.png',
    publicPath: '/image.png',
    absPath: path.join(root, 'image.png'),
  })

  it('generates bounded widths with transparent lossless fallback and reuses verified cache bytes', async () => {
    const original = await sharp({
      create: {
        width: 80,
        height: 40,
        channels: 4,
        background: { r: 20, g: 40, b: 60, alpha: 0.4 },
      },
    })
      .png()
      .toBuffer()
    await fs.writeFile(source().absPath, original)
    const settings = config({ lossless: true })
    const processor = new ImageProcessor(settings)
    const first = await processor.process(source(), settings)
    expect(first?.variants.map((variant) => variant.width)).toEqual([
      32, 32, 64, 64, 80, 80,
    ])
    expect(first?.cache).toBe('miss')
    const fallback = first?.variants.find(
      (variant) => variant.width === 80 && variant.format === 'png',
    )
    if (!fallback) throw new Error('Expected PNG fallback')
    expect((await sharp(fallback.data).metadata()).hasAlpha).toBe(true)
    expect(await sharp(fallback.data).raw().toBuffer()).toEqual(
      await sharp(original).raw().toBuffer(),
    )
    const cached = await new ImageProcessor(settings).process(
      source(),
      settings,
    )
    expect(cached?.cache).toBe('hit')
    expect(cached?.variants.map((variant) => variant.hash)).toEqual(
      first?.variants.map((variant) => variant.hash),
    )
    const file = path.join(settings.cacheDir, first?.key ?? '', fallback.file)
    await fs.writeFile(file, 'Corrupt cache')
    expect(
      (await new ImageProcessor(settings).process(source(), settings))?.cache,
    ).toBe('miss')
  })

  it('rotates before stripping EXIF and derives oriented dimensions', async () => {
    await sharp({
      create: { width: 80, height: 40, channels: 3, background: '#123456' },
    })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toFile(source().absPath)
    const settings = config({ widths: [32], metadata: 'strip' })
    const result = await new ImageProcessor(settings).process(
      source(),
      settings,
    )
    expect([result?.width, result?.height]).toEqual([40, 80])
    for (const variant of result?.variants ?? []) {
      const metadata = await sharp(variant.data).metadata()
      expect([metadata.width, metadata.height]).toEqual([32, 64])
      expect(metadata.orientation).toBeUndefined()
      expect(metadata.exif).toBeUndefined()
    }
  })

  it('keeps animation intact rather than silently taking its first frame', async () => {
    const frames = Buffer.alloc(16 * 32 * 4, 255)
    frames.fill(0, 0, 16 * 16 * 4)
    await sharp(frames, {
      raw: { width: 16, height: 32, pageHeight: 16, channels: 4 },
    })
      .gif({ delay: [100, 200], loop: 0 })
      .toFile(source().absPath)
    expect(
      (await sharp(await fs.readFile(source().absPath)).metadata()).pages,
    ).toBe(2)
    const settings = config()
    expect(
      await new ImageProcessor(settings).process(source(), settings),
    ).toBeUndefined()
  })

  it('detects APNG before libvips can flatten it', async () => {
    const png = await sharp({
      create: { width: 10, height: 10, channels: 3, background: 'red' },
    })
      .png()
      .toBuffer()
    const animationChunk = Buffer.alloc(20)
    animationChunk.writeUInt32BE(8, 0)
    animationChunk.write('acTL', 4)
    animationChunk.writeUInt32BE(2, 8)
    const ihdrEnd = 8 + 12 + png.readUInt32BE(8)
    await fs.writeFile(
      source().absPath,
      Buffer.concat([
        png.subarray(0, ihdrEnd),
        animationChunk,
        png.subarray(ihdrEnd),
      ]),
    )
    const settings = config()
    expect(
      await new ImageProcessor(settings).process(source(), settings),
    ).toBeUndefined()
  })

  it('limits concurrent encoding and emission work, and releases slots after errors', async () => {
    await sharp({
      create: { width: 32, height: 16, channels: 3, background: 'blue' },
    })
      .png()
      .toFile(source().absPath)
    const settings = config({ concurrency: 2, formats: [], widths: [16] })
    const processor = new ImageProcessor(settings)
    let active = 0,
      peak = 0
    let release: (() => void) | undefined
    const barrier = new Promise<void>((resolve) => {
      release = resolve
    })
    let began: (() => void) | undefined
    const started = new Promise<void>((resolve) => {
      began = resolve
    })
    const work = Array.from({ length: 4 }, () =>
      processor.process(source(), settings, async () => {
        active++
        peak = Math.max(peak, active)
        if (active === 2) began?.()
        await barrier
        active--
      }),
    )
    await started
    expect(peak).toBe(2)
    release?.()
    await Promise.all(work)
    await expect(
      processor.process(source(), settings, async () => {
        throw new Error('Consumer failed')
      }),
    ).rejects.toThrow('Consumer failed')
    expect((await processor.process(source(), settings))?.cache).toBe('hit')
  })

  it('uses pixel settings for cache keys while allowing markup-only changes to reuse results', async () => {
    await sharp({
      create: { width: 64, height: 32, channels: 3, background: 'green' },
    })
      .png()
      .toFile(source().absPath)
    const settings = config()
    const first = await new ImageProcessor(settings).process(source(), settings)
    const markup = { ...settings, sizes: '50vw', loading: 'eager' as const }
    expect(
      (await new ImageProcessor(markup).process(source(), markup))?.key,
    ).toBe(first?.key)
    const pixels = { ...settings, quality: { ...settings.quality, webp: 30 } }
    expect(
      (await new ImageProcessor(pixels).process(source(), pixels))?.key,
    ).not.toBe(first?.key)
    expect(imagePreset(settings, 'screenshot').lossless).toBe(true)
  })

  it('rejects input byte and pixel limits with the source path', async () => {
    await sharp({
      create: { width: 64, height: 32, channels: 3, background: 'green' },
    })
      .png()
      .toFile(source().absPath)
    const bytes = config({ maxSourceBytes: 10 })
    await expect(
      new ImageProcessor(bytes).process(source(), bytes),
    ).rejects.toThrow(/image.png.*maxSourceBytes/)
    const pixels = config({ maxInputPixels: 16 })
    await expect(
      new ImageProcessor(pixels).process(source(), pixels),
    ).rejects.toThrow(/image.png/)
  })

  it('rejects a cache alias into content before writing any cache entries', async () => {
    const content = path.join(root, 'content')
    const alias = path.join(root, 'cache-alias')
    await fs.mkdir(content)
    await fs.symlink(
      content,
      alias,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    await sharp({
      create: { width: 8, height: 8, channels: 3, background: 'red' },
    })
      .png()
      .toFile(source().absPath)
    const settings = config({ cacheDir: path.join(alias, 'images') })
    await expect(
      new ImageProcessor(settings, [content]).process(source(), settings),
    ).rejects.toThrow('including symlink targets')
    expect(await fs.readdir(content)).toEqual([])
  })
})

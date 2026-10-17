import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import type { AssetSource } from '@purestack/ts-common'
import { isPlainObject } from '@purestack/ts-util'
import type sharpType from 'sharp'
import { pruneImageCache, retireCacheEntry } from './cache'
import type { ImagesConfig, ResolvedImagePreset } from './config'

type OutputFormat = 'avif' | 'webp' | 'jpeg' | 'png'
export interface ImageVariant {
  file: string
  format: OutputFormat
  width: number
  height: number
  data: Buffer
  hash: string
}
export interface ProcessedImage {
  key: string
  width: number
  height: number
  fallback: OutputFormat
  variants: ImageVariant[]
  sourceBytes: number
  cache: 'hit' | 'miss' | 'shared'
}
interface CachedVariant {
  file: string
  format: OutputFormat
  width: number
  height: number
  hash: string
  bytes: number
}
interface CacheManifest {
  version: number
  key: string
  variants: CachedVariant[]
}

class WorkQueue {
  private active = 0
  private readonly waiting: Array<() => void> = []
  constructor(private readonly limit: number) {}
  async run<T>(work: () => Promise<T>): Promise<T> {
    if (this.active >= this.limit)
      await new Promise<void>((resolve) => this.waiting.push(resolve))
    else this.active++
    try {
      return await work()
    } finally {
      const next = this.waiting.shift()
      if (next) next()
      else this.active--
    }
  }
}

/** Per-site work limits and promises; cache entries are portable pixel results. */
export class ImageProcessor {
  private readonly queue: WorkQueue
  private readonly inFlight = new Map<string, Promise<ProcessedImage>>()
  private backend: Promise<typeof sharpType> | undefined
  private cacheRoot: Promise<string> | undefined
  private cacheMaintenance: Promise<void> | undefined
  private nextCacheMaintenance = 0

  constructor(
    private readonly config: ImagesConfig,
    private readonly protectedDirectories: readonly string[] = [],
  ) {
    this.queue = new WorkQueue(config.concurrency)
  }

  process(
    source: AssetSource,
    preset: ResolvedImagePreset,
    consume?: (image: ProcessedImage) => Promise<void>,
  ): Promise<ProcessedImage | undefined> {
    return this.queue
      .run(async () => {
        const result = await this.read(source, preset)
        if (result && consume) await consume(result)
        return result
      })
      .catch((error) => {
        throw new Error(
          `Image "${source.relPath}": ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        )
      })
  }

  private async read(
    source: AssetSource,
    preset: ResolvedImagePreset,
  ): Promise<ProcessedImage | undefined> {
    const stat = await fs.stat(source.absPath)
    if (!stat.isFile() || stat.size > this.config.maxSourceBytes)
      throw new Error(
        `Image "${source.relPath}" exceeds images.maxSourceBytes or is not a file.`,
      )
    const data = await fs.readFile(source.absPath)
    if (data.length > this.config.maxSourceBytes)
      throw new Error(
        `Image "${source.relPath}" exceeds images.maxSourceBytes.`,
      )
    if (animatedPng(data)) return undefined
    this.backend ??= import('sharp').then((module) => module.default)
    const sharp = await this.backend
    const metadata = await sharp(data, {
      limitInputPixels: this.config.maxInputPixels,
      failOn: 'warning',
    }).metadata()
    if (
      (metadata.pages ?? 1) > 1 ||
      !['jpeg', 'png', 'webp', 'avif', 'heif', 'gif', 'tiff'].includes(
        metadata.format,
      )
    )
      return undefined
    const { width, height } = metadata.autoOrient
    if (!width || !height)
      throw new Error(`Could not read dimensions for "${source.relPath}".`)
    const fallback: OutputFormat =
      preset.lossless ||
      metadata.hasAlpha ||
      metadata.format === 'png' ||
      metadata.format === 'gif'
        ? 'png'
        : 'jpeg'
    const maxWidth = Math.min(width, preset.widths[preset.widths.length - 1])
    const widths = [
      ...preset.widths.filter((value) => value < maxWidth),
      maxWidth,
    ]
    const formats: OutputFormat[] = [...preset.formats, fallback]
    const pixels = {
      widths,
      formats,
      quality: preset.quality,
      lossless: preset.lossless,
      metadata: preset.metadata,
    }
    const key = digest(
      Buffer.concat([
        data,
        Buffer.from(
          JSON.stringify({ schema: 1, pixels, versions: sharp.versions }),
        ),
      ]),
    )
    const existing = this.inFlight.get(key)
    if (existing) return { ...(await existing), cache: 'shared' }
    const task = this.produce(
      sharp,
      data,
      key,
      width,
      height,
      widths,
      formats,
      fallback,
      preset,
    )
    this.inFlight.set(key, task)
    try {
      return await task
    } finally {
      this.inFlight.delete(key)
    }
  }

  private async produce(
    sharp: typeof sharpType,
    data: Buffer,
    key: string,
    width: number,
    height: number,
    widths: number[],
    formats: OutputFormat[],
    fallback: OutputFormat,
    preset: ResolvedImagePreset,
  ): Promise<ProcessedImage> {
    this.cacheRoot ??= this.prepareCache().catch((error) => {
      this.cacheRoot = undefined
      throw error
    })
    const root = await this.cacheRoot
    if (!this.cacheMaintenance && Date.now() >= this.nextCacheMaintenance) {
      this.nextCacheMaintenance = Date.now() + 3_600_000
      this.cacheMaintenance = pruneImageCache(
        root,
        this.config.cacheMaxAgeDays,
        new Set([...this.inFlight.keys(), key]),
      )
        .catch((error) => {
          this.nextCacheMaintenance = 0
          throw error
        })
        .finally(() => {
          this.cacheMaintenance = undefined
        })
    }
    await this.cacheMaintenance
    const directory = path.join(root, key)
    const directoryStat = await optionalStat(directory)
    if (directoryStat?.isSymbolicLink())
      throw new Error('Image cache entries must not be symlinks.')
    const expected = widths.flatMap((outputWidth) =>
      formats.map((format) => ({
        width: outputWidth,
        height: Math.max(1, Math.round((height * outputWidth) / width)),
        format,
        file: fileName(outputWidth, format),
      })),
    )
    const cached = await readCache(directory, key, expected)
    if (cached) {
      const now = new Date()
      await fs
        .utimes(path.join(directory, 'manifest.json'), now, now)
        .catch((error) => {
          if (error.code !== 'ENOENT') throw error
        })
      return {
        key,
        width,
        height,
        fallback,
        variants: cached,
        sourceBytes: data.length,
        cache: 'hit',
      }
    }
    const variants: ImageVariant[] = []
    for (const item of expected) {
      let pipeline = sharp(data, {
        limitInputPixels: this.config.maxInputPixels,
        failOn: 'warning',
      })
        .autoOrient()
        .resize({ width: item.width, withoutEnlargement: true })
        .toColorspace('srgb')
      if (preset.metadata === 'preserve')
        pipeline = pipeline.withMetadata({ orientation: 1 })
      if (item.format === 'avif')
        pipeline = pipeline.avif({
          quality: preset.quality.avif,
          lossless: preset.lossless,
          effort: 4,
        })
      else if (item.format === 'webp')
        pipeline = pipeline.webp({
          quality: preset.quality.webp,
          lossless: preset.lossless,
          effort: 4,
        })
      else if (item.format === 'jpeg')
        pipeline = pipeline.jpeg({
          quality: preset.quality.jpeg,
          mozjpeg: true,
        })
      else pipeline = pipeline.png({ compressionLevel: 9, palette: false })
      const result = await pipeline
        .timeout({ seconds: 30 })
        .toBuffer({ resolveWithObject: true })
      variants.push({
        file: item.file,
        format: item.format,
        width: result.info.width,
        height: result.info.height,
        data: result.data,
        hash: digest(result.data),
      })
    }
    const manifest: CacheManifest = {
      version: 1,
      key,
      variants: variants.map((variant) => ({
        file: variant.file,
        format: variant.format,
        width: variant.width,
        height: variant.height,
        bytes: variant.data.length,
        hash: variant.hash,
      })),
    }
    // Encoding happens outside the cache. Publish only a complete immutable entry,
    // so pruning and other builds cannot interrupt individual variant writes.
    const temporary = path.join(root, `.purestack-images-${randomUUID()}.tmp`)
    await fs.mkdir(temporary)
    try {
      for (const variant of variants)
        await fs.writeFile(path.join(temporary, variant.file), variant.data)
      await fs.writeFile(
        path.join(temporary, 'manifest.json'),
        JSON.stringify(manifest),
      )
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await fs.rename(temporary, directory)
          break
        } catch (error) {
          if (
            !['EEXIST', 'ENOTEMPTY', 'EPERM'].includes(
              (error as NodeJS.ErrnoException).code ?? '',
            )
          )
            throw error
          // Another build may have published the same key while we encoded.
          if (await readCache(directory, key, expected)) break
          const stat = await optionalStat(directory)
          if (stat?.isSymbolicLink())
            throw new Error('Image cache entries must not be symlinks.')
          try {
            await retireCacheEntry(root, key)
          } catch (error) {
            if (
              !['EPERM', 'EACCES', 'EBUSY'].includes(
                (error as NodeJS.ErrnoException).code ?? '',
              )
            )
              throw error
            // Windows readers can briefly hold the old directory open. Cache
            // publication is best effort; the encoded output is already complete.
            await setTimeout(10 * (attempt + 1))
          }
        }
      }
    } finally {
      await fs.rm(temporary, { recursive: true, force: true })
    }
    return {
      key,
      width,
      height,
      fallback,
      variants,
      sourceBytes: data.length,
      cache: 'miss',
    }
  }

  private async prepareCache() {
    const directory = await canonicalPath(this.config.cacheDir)
    for (const protectedDirectory of this.protectedDirectories) {
      const root = await canonicalPath(protectedDirectory)
      const relative = path.relative(root, directory)
      if (
        relative === '' ||
        (relative !== '..' &&
          !relative.startsWith(`..${path.sep}`) &&
          !path.isAbsolute(relative))
      )
        throw new Error(
          'images.cacheDir must be outside the content and output directories, including symlink targets.',
        )
    }
    await fs.mkdir(directory, { recursive: true })
    return directory
  }
}

async function canonicalPath(directory: string): Promise<string> {
  try {
    return await fs.realpath(directory)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    const parent = path.dirname(directory)
    if (parent === directory) throw error
    return path.join(await canonicalPath(parent), path.basename(directory))
  }
}

async function optionalStat(file: string) {
  return fs.lstat(file).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined
    throw error
  })
}

function fileName(width: number, format: OutputFormat) {
  return `${width}.${format === 'jpeg' ? 'jpg' : format}`
}
function digest(data: Uint8Array) {
  return createHash('sha256').update(data).digest('hex')
}

async function readCache(
  directory: string,
  key: string,
  expected: Array<{
    file: string
    width: number
    height: number
    format: OutputFormat
  }>,
): Promise<ImageVariant[] | undefined> {
  try {
    const manifestStat = await optionalStat(
      path.join(directory, 'manifest.json'),
    )
    if (!manifestStat?.isFile() || manifestStat.size > 64 * 1024)
      return undefined
    const raw: unknown = JSON.parse(
      await fs.readFile(path.join(directory, 'manifest.json'), 'utf8'),
    )
    if (
      !isPlainObject(raw) ||
      raw.version !== 1 ||
      raw.key !== key ||
      !Array.isArray(raw.variants) ||
      raw.variants.length !== expected.length
    )
      return undefined
    const variants: ImageVariant[] = []
    for (const [index, item] of expected.entries()) {
      const entry: unknown = raw.variants[index]
      if (
        !isPlainObject(entry) ||
        entry.file !== item.file ||
        entry.format !== item.format ||
        entry.width !== item.width ||
        entry.height !== item.height ||
        typeof entry.hash !== 'string'
      )
        return undefined
      // Use computed names, never paths supplied by a cache manifest.
      const file = path.join(directory, item.file)
      const stat = await optionalStat(file)
      if (!stat?.isFile() || stat.size !== entry.bytes) return undefined
      const data = await fs.readFile(file)
      if (data.length !== entry.bytes || digest(data) !== entry.hash)
        return undefined
      variants.push({ ...item, height: entry.height, data, hash: entry.hash })
    }
    return variants
  } catch (error) {
    if (
      error instanceof SyntaxError ||
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    )
      return undefined
    throw error
  }
}

/** libvips treats APNG as a still PNG; detect its animation control chunk first. */
function animatedPng(data: Buffer) {
  if (
    !data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return false
  for (let offset = 8; offset + 12 <= data.length; ) {
    const length = data.readUInt32BE(offset)
    const type = data.toString('ascii', offset + 4, offset + 8)
    if (type === 'acTL') return true
    if (type === 'IDAT' || length > data.length - offset - 12) return false
    offset += length + 12
  }
  return false
}

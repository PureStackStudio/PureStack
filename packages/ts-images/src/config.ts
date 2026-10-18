import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { isPlainObject, merge } from '@purestack/ts-util'

export type ImageFormat = 'avif' | 'webp'
export interface ImageQuality {
  avif: number
  webp: number
  jpeg: number
}
export interface ImagePreset {
  widths?: number[]
  formats?: ImageFormat[]
  quality?: Partial<ImageQuality>
  sizes?: string
  loading?: 'lazy' | 'eager' | false
  decoding?: 'async' | 'sync' | 'auto' | false
  priority?: boolean
  lossless?: boolean
  metadata?: 'strip' | 'preserve'
}
export interface ResolvedImagePreset
  extends Required<Omit<ImagePreset, 'quality'>> {
  quality: ImageQuality
}
export interface ImagesOptions extends ImagePreset {
  enabled?: boolean
  include?: string[]
  exclude?: string[]
  cacheDir?: string
  /** Remove entries unused for this many days; zero disables automatic cleanup. */
  cacheMaxAgeDays?: number
  concurrency?: number
  maxInputPixels?: number
  maxSourceBytes?: number
  onError?: 'error' | 'warn'
  presets?: Record<string, ImagePreset>
}
export interface ImagesConfig extends ResolvedImagePreset {
  enabled: boolean
  include: string[]
  exclude: string[]
  cacheDir: string
  cacheMaxAgeDays: number
  concurrency: number
  maxInputPixels: number
  maxSourceBytes: number
  onError: 'error' | 'warn'
  presets: Record<string, ResolvedImagePreset>
}

declare module '@purestack/ts-common' {
  interface SiteExtensions {
    images?: ImagesConfig
  }
}

const defaults: ResolvedImagePreset = {
  widths: [480, 960, 1440],
  formats: ['avif', 'webp'],
  quality: { avif: 50, webp: 80, jpeg: 82 },
  sizes: '100vw',
  loading: 'lazy',
  decoding: 'async',
  priority: false,
  lossless: false,
  metadata: 'strip',
}
const builtInPresets: Record<string, ImagePreset> = {
  content: {},
  hero: { widths: [960, 1440, 1920], priority: true, loading: 'eager' },
  thumbnail: {
    widths: [160, 320, 640],
    sizes: '(max-width: 640px) 50vw, 320px',
  },
  screenshot: { lossless: true, formats: ['webp'] },
}
const presetFields = [
  'widths',
  'formats',
  'quality',
  'sizes',
  'loading',
  'decoding',
  'priority',
  'lossless',
  'metadata',
]

export function resolveImagesConfig(
  value: unknown,
  site: Pick<SiteConfig, 'rootDir' | 'contentDir' | 'outDir' | 'publishDir'>,
): ImagesConfig {
  const input = object(value ?? {}, 'images')
  fields(
    input,
    [
      ...presetFields,
      'enabled',
      'include',
      'exclude',
      'cacheDir',
      'cacheMaxAgeDays',
      'concurrency',
      'maxInputPixels',
      'maxSourceBytes',
      'onError',
      'presets',
    ],
    'images',
  )
  const preset = resolvePreset(input, defaults)
  const rawPresets = object(input.presets ?? {}, 'images.presets')
  for (const name of Object.keys(rawPresets)) {
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name))
      throw new Error(`Invalid images preset name "${name}".`)
  }
  const presets: Record<string, ResolvedImagePreset> = {}
  for (const [name, options] of Object.entries(
    merge(builtInPresets, rawPresets),
  )) {
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name))
      throw new Error(`Invalid images preset name "${name}".`)
    const optionsObject = object(options, `images.presets.${name}`)
    fields(optionsObject, presetFields, `images.presets.${name}`)
    presets[name] = resolvePreset(optionsObject, preset)
  }
  const cacheDir =
    input.cacheDir === undefined
      ? path.join(
          os.tmpdir(),
          'purestack-images',
          createHash('sha256')
            .update(path.resolve(site.contentDir))
            .digest('hex')
            .slice(0, 24),
        )
      : path.resolve(site.rootDir, string(input.cacheDir, 'images.cacheDir'))
  if (
    within(site.contentDir, cacheDir) ||
    within(site.outDir, cacheDir) ||
    within(site.publishDir, cacheDir)
  ) {
    throw new Error(
      'images.cacheDir must be outside the content and output directories.',
    )
  }
  return {
    ...preset,
    enabled: boolean(input.enabled, true, 'images.enabled'),
    include: patterns(input.include, ['**/*'], 'images.include'),
    exclude: patterns(input.exclude, [], 'images.exclude'),
    cacheDir,
    cacheMaxAgeDays: integer(
      input.cacheMaxAgeDays,
      30,
      0,
      36500,
      'images.cacheMaxAgeDays',
    ),
    concurrency: integer(input.concurrency, 2, 1, 16, 'images.concurrency'),
    maxInputPixels: integer(
      input.maxInputPixels,
      40_000_000,
      1,
      268_402_689,
      'images.maxInputPixels',
    ),
    maxSourceBytes: integer(
      input.maxSourceBytes,
      50 * 1024 * 1024,
      1,
      Number.MAX_SAFE_INTEGER,
      'images.maxSourceBytes',
    ),
    onError: choice(
      input.onError,
      ['error', 'warn'],
      'error',
      'images.onError',
    ),
    presets,
  }
}

function resolvePreset(
  input: Record<string, unknown>,
  base: ResolvedImagePreset,
): ResolvedImagePreset {
  const widths = input.widths ?? base.widths
  if (
    !Array.isArray(widths) ||
    widths.length === 0 ||
    widths.length > 16 ||
    widths.some(
      (value) => !Number.isInteger(value) || value < 1 || value > 16384,
    )
  ) {
    throw new Error(
      'images.widths must contain 1 to 16 integer widths between 1 and 16384.',
    )
  }
  const formats = input.formats ?? base.formats
  if (
    !Array.isArray(formats) ||
    formats.some((format) => format !== 'avif' && format !== 'webp')
  )
    throw new Error(
      'images.formats supports avif and webp; fallback formats are generated automatically.',
    )
  const quality = object(input.quality ?? {}, 'images.quality')
  fields(quality, ['avif', 'webp', 'jpeg'], 'images.quality')
  return {
    widths: [...new Set<number>(widths)].sort((a, b) => a - b),
    formats: [...new Set<ImageFormat>(formats)],
    quality: {
      avif: integer(
        quality.avif,
        base.quality.avif,
        1,
        100,
        'images.quality.avif',
      ),
      webp: integer(
        quality.webp,
        base.quality.webp,
        1,
        100,
        'images.quality.webp',
      ),
      jpeg: integer(
        quality.jpeg,
        base.quality.jpeg,
        1,
        100,
        'images.quality.jpeg',
      ),
    },
    sizes:
      input.sizes === undefined
        ? base.sizes
        : string(input.sizes, 'images.sizes'),
    loading: choice(
      input.loading,
      ['lazy', 'eager', false],
      base.loading,
      'images.loading',
    ),
    decoding: choice(
      input.decoding,
      ['async', 'sync', 'auto', false],
      base.decoding,
      'images.decoding',
    ),
    priority: boolean(input.priority, base.priority, 'images.priority'),
    lossless: boolean(input.lossless, base.lossless, 'images.lossless'),
    metadata: choice(
      input.metadata,
      ['strip', 'preserve'],
      base.metadata,
      'images.metadata',
    ),
  }
}

export function imagePreset(
  config: ImagesConfig,
  name: string | null,
): ResolvedImagePreset {
  if (!name) return config
  const preset = Object.hasOwn(config.presets, name)
    ? config.presets[name]
    : undefined
  if (!preset) throw new Error(`Unknown image preset "${name}".`)
  return preset
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!isPlainObject(value)) throw new Error(`${label} must be an object.`)
  return value
}
function fields(
  input: Record<string, unknown>,
  allowed: string[],
  label: string,
) {
  for (const name of Object.keys(input))
    if (!allowed.includes(name))
      throw new Error(`Unknown ${label} setting "${name}".`)
}
function integer(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
  label: string,
) {
  if (value === undefined) return fallback
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < min ||
    value > max
  )
    throw new Error(`${label} must be an integer between ${min} and ${max}.`)
  return value
}
function boolean(value: unknown, fallback: boolean, label: string) {
  if (value === undefined) return fallback
  if (typeof value !== 'boolean') throw new Error(`${label} must be a boolean.`)
  return value
}
function string(value: unknown, label: string) {
  if (typeof value !== 'string' || !value.trim())
    throw new Error(`${label} must be a non-empty string.`)
  return value.trim()
}
function choice<T extends string | boolean>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
  label: string,
): T {
  if (value === undefined) return fallback
  if (!allowed.includes(value as T))
    throw new Error(`${label} must be one of ${allowed.join(', ')}.`)
  return value as T
}
function patterns(value: unknown, fallback: string[], label: string) {
  if (value === undefined) return [...fallback]
  if (!Array.isArray(value))
    throw new Error(`${label} must be a list of glob patterns.`)
  return value.map((value) => string(value, label).replaceAll('\\', '/'))
}
function within(root: string, candidate: string) {
  const relative = path.relative(path.resolve(root), candidate)
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== '..' &&
      !path.isAbsolute(relative))
  )
}

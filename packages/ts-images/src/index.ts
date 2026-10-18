import path from 'node:path'
import type {
  AssetSource,
  PageAssetInput,
  SiteAssets,
  SiteConfig,
  SiteConfigResolution,
} from '@purestack/ts-common'
import { isPlainObject, merge, urlNormalizer } from '@purestack/ts-util'
import { getLogger } from 'logpot'
import { type ImagesOptions, imagePreset, resolveImagesConfig } from './config'
import { ImageProcessor, type ProcessedImage } from './processor'

export type {
  ImageFormat,
  ImagePreset,
  ImageQuality,
  ImagesConfig,
  ImagesOptions,
  ResolvedImagePreset,
} from './config'

export interface ImageDiagnostic {
  source: string
  page: string
  cache: 'hit' | 'miss' | 'shared' | 'skipped'
  sourceBytes: number
  outputBytes: number
  variants: number
  durationMs: number
}
export interface ImagesPluginOptions extends ImagesOptions {
  onDiagnostic?: (diagnostic: ImageDiagnostic) => void
}

/** Optional local raster optimization. No renderer, theme, or browser runtime dependency. */
export function imagesPlugin(options: ImagesPluginOptions = {}) {
  const { onDiagnostic, ...settings } = options
  if (onDiagnostic !== undefined && typeof onDiagnostic !== 'function')
    throw new Error('images.onDiagnostic must be a function.')
  return {
    name: 'purestack:images',
    config: {
      resolve({ config }: SiteConfigResolution) {
        if (
          config.extensions.images !== undefined &&
          !isPlainObject(config.extensions.images)
        )
          throw new Error('extensions.images must be an object.')
        return {
          extensions: { images: merge(settings, config.extensions.images) },
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return {
          extensions: {
            images: resolveImagesConfig(config.extensions.images, config),
          },
        }
      },
    },
    assets(site: SiteConfig): SiteAssets | undefined {
      const config = site.extensions.images
      if (!config)
        throw new Error('Images requires resolved extensions.images settings.')
      if (!config.enabled) return undefined
      const processor = new ImageProcessor(config, [
        site.contentDir,
        site.outDir,
        site.publishDir,
      ])
      return {
        namespace: 'images',
        async processPage(input) {
          const results = await Promise.allSettled(
            imageElements(input.document).map(async (image) => {
              const url = image.getAttribute('src')
              if (
                !url ||
                insidePicture(image) ||
                image.hasAttribute('srcset') ||
                !selectedUrl(url) ||
                disabled(image)
              )
                return
              let source: AssetSource | undefined
              try {
                source = await input.resolveSource(image, url)
                if (!source) return
                const relPath = source.relPath
                if (
                  !config.include.some((pattern) =>
                    path.posix.matchesGlob(relPath, pattern),
                  ) ||
                  config.exclude.some((pattern) =>
                    path.posix.matchesGlob(relPath, pattern),
                  )
                )
                  return
                const preset = imagePreset(
                  config,
                  image.getAttribute('data-image-preset'),
                )
                const started = performance.now()
                const result = await processor.process(
                  source,
                  preset,
                  (result) =>
                    presentImage(
                      image,
                      input,
                      result,
                      preset,
                      urlNormalizer.splitSuffix(url).suffix,
                    ),
                )
                if (!result) {
                  onDiagnostic?.({
                    source: source.relPath,
                    page: input.sourceRelPath,
                    cache: 'skipped',
                    sourceBytes: 0,
                    outputBytes: 0,
                    variants: 0,
                    durationMs: performance.now() - started,
                  })
                  return
                }
                const diagnostic: ImageDiagnostic = {
                  source: source.relPath,
                  page: input.sourceRelPath,
                  cache: result.cache,
                  sourceBytes: result.sourceBytes,
                  outputBytes: result.variants.reduce(
                    (sum, variant) => sum + variant.data.length,
                    0,
                  ),
                  variants: result.variants.length,
                  durationMs: Math.round(performance.now() - started),
                }
                if (onDiagnostic) onDiagnostic(diagnostic)
                else getLogger().info('image optimized', { ...diagnostic })
              } catch (error) {
                if (config.onError === 'error') throw error
                getLogger().warn('image optimization skipped', {
                  page: input.sourceRelPath,
                  source: source?.relPath ?? url,
                  error: error instanceof Error ? error.message : String(error),
                })
              }
            }),
          )
          const failure = results.find((result) => result.status === 'rejected')
          if (failure?.status === 'rejected') throw failure.reason
        },
      }
    },
  }
}

function selectedUrl(url: string) {
  if (urlNormalizer.isSpecialHref(url)) return false
  return /\.(?:jpe?g|png|webp|avif|gif|tiff?)$/i.test(
    urlNormalizer.splitSuffix(url).base,
  )
}

function insidePicture(image: Element) {
  for (let parent = image.parentElement; parent; parent = parent.parentElement)
    if (parent.tagName === 'PICTURE') return true
  return false
}

function imageElements(parent: ParentNode): Element[] {
  const images: Element[] = []
  for (const node of parent.childNodes) {
    if (node.nodeType !== 1) continue
    const element = node as Element
    if (element.tagName === 'IMG') images.push(element)
    images.push(
      ...imageElements(
        element.tagName === 'TEMPLATE'
          ? (element as HTMLTemplateElement).content
          : element,
      ),
    )
  }
  return images
}
function disabled(image: Element) {
  const value = image.getAttribute('data-image-optimize')
  if (value !== null && value !== '' && value !== 'true' && value !== 'false')
    throw new Error('data-image-optimize must be true or false.')
  return value === 'false'
}

async function presentImage(
  image: Element,
  input: PageAssetInput,
  result: ProcessedImage,
  preset: ReturnType<typeof imagePreset>,
  suffix: string,
) {
  const priorityValue = image.getAttribute('data-image-priority')
  if (priorityValue !== null && !['', 'true', 'false'].includes(priorityValue))
    throw new Error('data-image-priority must be true or false.')
  const emitted: Array<ProcessedImage['variants'][number] & { url: string }> =
    []
  for (const variant of result.variants)
    emitted.push({
      ...variant,
      url:
        (await input.emit(`${variant.hash}.${variant.file}`, variant.data)) +
        suffix,
    })
  const fallback = emitted.filter(
    (variant) => variant.format === result.fallback,
  )
  const largest = fallback[fallback.length - 1]
  const sizes = image.getAttribute('sizes') ?? preset.sizes
  const srcset = (variants: typeof emitted) =>
    variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ')
  const picture = input.document.createElement('picture')
  for (const format of preset.formats) {
    const source = input.document.createElement('source')
    source.setAttribute('type', `image/${format}`)
    source.setAttribute(
      'srcset',
      srcset(emitted.filter((variant) => variant.format === format)),
    )
    source.setAttribute('sizes', sizes)
    picture.appendChild(source)
  }
  image.setAttribute('src', largest.url)
  image.setAttribute('srcset', srcset(fallback))
  image.setAttribute('sizes', sizes)
  const hasWidth = image.hasAttribute('width'),
    hasHeight = image.hasAttribute('height')
  if (!hasWidth && !hasHeight) {
    image.setAttribute('width', String(result.width))
    image.setAttribute('height', String(result.height))
  } else if (hasWidth && !hasHeight) {
    const width = Number(image.getAttribute('width'))
    if (Number.isFinite(width) && width > 0)
      image.setAttribute(
        'height',
        String(Math.max(1, Math.round((width * result.height) / result.width))),
      )
  } else if (!hasWidth && hasHeight) {
    const height = Number(image.getAttribute('height'))
    if (Number.isFinite(height) && height > 0)
      image.setAttribute(
        'width',
        String(
          Math.max(1, Math.round((height * result.width) / result.height)),
        ),
      )
  }
  const priority =
    priorityValue === null
      ? preset.priority || image.getAttribute('fetchpriority') === 'high'
      : priorityValue !== 'false'
  if (!image.hasAttribute('loading') && (priority || preset.loading))
    image.setAttribute('loading', priority ? 'eager' : String(preset.loading))
  if (!image.hasAttribute('decoding') && preset.decoding)
    image.setAttribute('decoding', preset.decoding)
  if (!image.hasAttribute('fetchpriority') && priority)
    image.setAttribute('fetchpriority', 'high')
  if (preset.formats.length > 0 && image.parentNode) {
    image.parentNode.insertBefore(picture, image)
    picture.appendChild(image)
  }
  image.removeAttribute('data-image-preset')
  image.removeAttribute('data-image-priority')
  image.removeAttribute('data-image-optimize')
}

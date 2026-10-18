import type { PreviewConfig } from '@purestack/ts-common'
import type { DeepPartial } from '@purestack/ts-util'
import { resolveOptionalString } from '@purestack/ts-util'

export function resolvePreviewOptions(
  input?: DeepPartial<PreviewConfig>,
  file?: DeepPartial<PreviewConfig>,
): PreviewConfig {
  return {
    title: resolveOptionalString(input?.title ?? file?.title),
    description: resolveOptionalString(input?.description ?? file?.description),
    image: resolveOptionalString(input?.image ?? file?.image),
    imageAlt: resolveOptionalString(input?.imageAlt ?? file?.imageAlt),
    imageWidth: normalizePreviewImageDimension(
      input?.imageWidth ?? file?.imageWidth,
    ),
    imageHeight: normalizePreviewImageDimension(
      input?.imageHeight ?? file?.imageHeight,
    ),
    siteName: resolveOptionalString(input?.siteName ?? file?.siteName),
    type: resolveOptionalString(input?.type ?? file?.type),
    locale: resolveOptionalString(input?.locale ?? file?.locale),
    twitterCard: resolveOptionalString(input?.twitterCard ?? file?.twitterCard),
    twitterSite: resolveOptionalString(input?.twitterSite ?? file?.twitterSite),
    twitterCreator: resolveOptionalString(
      input?.twitterCreator ?? file?.twitterCreator,
    ),
  }
}

function normalizePreviewImageDimension(value: unknown) {
  if (typeof value !== 'number' || !Number.isInteger(value)) return undefined
  return value > 0 ? value : undefined
}

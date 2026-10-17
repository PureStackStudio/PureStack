import type { SiteLogoConfig } from '@purestack/ts-common'
import { pickSemanticTone } from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'
import {
  resolveConfigUrl,
  resolveOptionalString,
  resolveString,
} from '@purestack/ts-util'

export function resolveSiteLogoConfig(
  input?: DeepPartial<SiteLogoConfig>,
  file?: DeepPartial<SiteLogoConfig>,
): SiteLogoConfig {
  const href = input?.href !== undefined ? input.href : file?.href
  return {
    brand: resolveString(input?.brand, file?.brand, 'Pure Stack'),
    letterColors: resolveOptionalString(
      input?.letterColors ?? file?.letterColors,
    ),
    subtitleLetterColors: resolveOptionalString(
      input?.subtitleLetterColors ?? file?.subtitleLetterColors,
    ),
    brandSizeSm: resolveOptionalString(input?.brandSizeSm ?? file?.brandSizeSm),
    brandSizeMd: resolveOptionalString(input?.brandSizeMd ?? file?.brandSizeMd),
    brandSizeLg: resolveOptionalString(input?.brandSizeLg ?? file?.brandSizeLg),
    brandSizeXl: resolveOptionalString(input?.brandSizeXl ?? file?.brandSizeXl),
    subtitleSizeSm: resolveOptionalString(
      input?.subtitleSizeSm ?? file?.subtitleSizeSm,
    ),
    subtitleSizeMd: resolveOptionalString(
      input?.subtitleSizeMd ?? file?.subtitleSizeMd,
    ),
    subtitleSizeLg: resolveOptionalString(
      input?.subtitleSizeLg ?? file?.subtitleSizeLg,
    ),
    subtitleSizeXl: resolveOptionalString(
      input?.subtitleSizeXl ?? file?.subtitleSizeXl,
    ),
    iconSize: resolveOptionalString(input?.iconSize ?? file?.iconSize),
    iconSizeSm: resolveOptionalString(input?.iconSizeSm ?? file?.iconSizeSm),
    iconSizeMd: resolveOptionalString(input?.iconSizeMd ?? file?.iconSizeMd),
    iconSizeLg: resolveOptionalString(input?.iconSizeLg ?? file?.iconSizeLg),
    iconSizeXl: resolveOptionalString(input?.iconSizeXl ?? file?.iconSizeXl),
    subtitleInset: resolveOptionalString(
      input?.subtitleInset ?? file?.subtitleInset,
    ),
    subtitleInsetSm: resolveOptionalString(
      input?.subtitleInsetSm ?? file?.subtitleInsetSm,
    ),
    subtitleInsetMd: resolveOptionalString(
      input?.subtitleInsetMd ?? file?.subtitleInsetMd,
    ),
    subtitleInsetLg: resolveOptionalString(
      input?.subtitleInsetLg ?? file?.subtitleInsetLg,
    ),
    subtitleInsetXl: resolveOptionalString(
      input?.subtitleInsetXl ?? file?.subtitleInsetXl,
    ),
    component: resolveOptionalString(input?.component ?? file?.component),
    colors: (input?.colors ?? file?.colors)?.filter(
      (color): color is string => typeof color === 'string',
    ),
    logoBackground: input?.logoBackground ?? file?.logoBackground,
    logoForeground: input?.logoForeground ?? file?.logoForeground,
    href:
      href === null || href === ''
        ? href
        : resolveConfigUrl(resolveString(href, '/')),
    subtitle: resolveOptionalString(input?.subtitle ?? file?.subtitle),
    suffix: resolveOptionalString(input?.suffix ?? file?.suffix),
    ariaLabel: resolveOptionalString(input?.ariaLabel ?? file?.ariaLabel),
    icon: resolveOptionalString(input?.icon ?? file?.icon),
    imageSrc: resolveConfigUrl(
      resolveOptionalString(input?.imageSrc ?? file?.imageSrc),
    ),
    imageSrcDark: resolveConfigUrl(
      resolveOptionalString(input?.imageSrcDark ?? file?.imageSrcDark),
    ),
    monogram: resolveOptionalString(input?.monogram ?? file?.monogram),
    brandColor: resolveOptionalString(input?.brandColor ?? file?.brandColor),
    accentColor: resolveOptionalString(input?.accentColor ?? file?.accentColor),
    markBackground: resolveOptionalString(
      input?.markBackground ?? file?.markBackground,
    ),
    markColor: resolveOptionalString(input?.markColor ?? file?.markColor),
    brandSize: resolveOptionalString(input?.brandSize ?? file?.brandSize),
    subtitleSize: resolveOptionalString(
      input?.subtitleSize ?? file?.subtitleSize,
    ),
    markSize: resolveOptionalString(input?.markSize ?? file?.markSize),
    gap: resolveOptionalString(input?.gap ?? file?.gap),
    layout: resolveLogoChoice(input?.layout ?? file?.layout, [
      'horizontal',
      'stacked',
      'wordmark',
      'mark',
    ] as const),
    size: resolveLogoChoice(input?.size ?? file?.size, [
      'sm',
      'md',
      'lg',
      'xl',
    ] as const),
    appearance: resolveLogoChoice(input?.appearance ?? file?.appearance, [
      'plain',
      'badge',
      'outline',
    ] as const),
    markStyle: resolveLogoChoice(input?.markStyle ?? file?.markStyle, [
      'plain',
      'soft',
      'solid',
      'outline',
    ] as const),
    wordmarkStyle: resolveLogoChoice(
      input?.wordmarkStyle ?? file?.wordmarkStyle,
      ['plain', 'accent', 'gradient'] as const,
    ),
    shape: resolveLogoChoice(input?.shape ?? file?.shape, [
      'rounded',
      'square',
      'circle',
    ] as const),
    tone: pickSemanticTone(input?.tone, file?.tone),
  }
}

function resolveLogoChoice<T extends string>(
  value: unknown,
  choices: readonly T[],
): T | undefined {
  return typeof value === 'string' && choices.includes(value as T)
    ? (value as T)
    : undefined
}

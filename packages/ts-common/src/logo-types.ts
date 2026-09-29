import type { SemanticTone } from '@purestack/ts-style'

export type LogoLayout = 'horizontal' | 'stacked' | 'wordmark' | 'mark'
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'
export type LogoAppearance = 'plain' | 'badge' | 'outline'
export type LogoMarkStyle = 'plain' | 'soft' | 'solid' | 'outline'
export type LogoWordmarkStyle = 'plain' | 'accent' | 'gradient'
export type LogoShape = 'rounded' | 'square' | 'circle'

export interface LogoConfig {
  brand: string
  subtitle?: string
  suffix?: string
  href?: string | null
  ariaLabel?: string
  icon?: string
  imageSrc?: string
  imageSrcDark?: string
  monogram?: string
  layout?: LogoLayout
  size?: LogoSize
  appearance?: LogoAppearance
  markStyle?: LogoMarkStyle
  wordmarkStyle?: LogoWordmarkStyle
  shape?: LogoShape
  tone?: SemanticTone
  brandColor?: string
  accentColor?: string
  markBackground?: string
  markColor?: string
  brandSize?: string
  subtitleSize?: string
  markSize?: string
  gap?: string
}

/** The original uppercase, letter-colored logo. */
export interface ClassicLogoConfig {
  brand: string
  letterColors?: string
  subtitleLetterColors?: string
  colors?: string[]
  logoBackground?: number
  logoForeground?: number
  subtitle?: string
  brandSize?: string
  brandSizeSm?: string
  brandSizeMd?: string
  brandSizeLg?: string
  brandSizeXl?: string
  subtitleSize?: string
  subtitleSizeSm?: string
  subtitleSizeMd?: string
  subtitleSizeLg?: string
  subtitleSizeXl?: string
  iconSize?: string
  iconSizeSm?: string
  iconSizeMd?: string
  iconSizeLg?: string
  iconSizeXl?: string
  subtitleInset?: string
  subtitleInsetSm?: string
  subtitleInsetMd?: string
  subtitleInsetLg?: string
  subtitleInsetXl?: string
  href?: string | null
  icon?: string
  ariaLabel?: string
}

/** Shared header configuration; each component reads its own presentation fields. */
export interface SiteLogoConfig extends LogoConfig, ClassicLogoConfig {
  component?: string
}

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

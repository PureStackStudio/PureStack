import type { ThemePalette } from '@purestack/ts-style'
import {
  mediaMin,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

const LOGO_DEFAULTS = {
  brandSize: {
    base: '1.5rem',
    sm: '1.5rem',
    md: '1.75rem',
    lg: '2rem',
    xl: '2rem',
  },
  subtitleSize: {
    base: '0.7rem',
    sm: '0.7rem',
    md: '0.74rem',
    lg: '0.77rem',
    xl: '0.77rem',
  },
  iconSize: {
    base: '2rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '2.85rem',
    xl: '2.85rem',
  },
  subtitleInset: {
    base: '0.5px',
    sm: '0.5px',
    md: '1px',
    lg: '1px',
    xl: '1px',
  },
} as const

type LogoResponsiveToken =
  | 'brand-size'
  | 'subtitle-size'
  | 'icon-size'
  | 'subtitle-inset'

type LogoBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

export function registerLogoStyles() {
  themes.forEach((theme, palette, options) => {
    registerLogoShellStyles(theme, palette, options)
    registerLogoTextStyles(theme, palette)
    registerLogoResponsiveStyles(theme)
    registerLogoInteractiveStyles(theme, palette)
  })
}

export function registerLogoShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-logo', theme)
    .display('inline-block')
    .width('fit-content')

  styleBuilder
    .select('.site-logo__link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('0.25rem')
    .padding('0.25rem 0.5rem')
    .borderRadius(options.radii.sm)
    .border(`1px solid ${palette.current.border.subtle}`)
    .textDecoration('none')
    .maxWidth('100%')
    .background(palette.semanticTone.neutral.surface.rest.background)

  styleBuilder
    .select('.site-logo__link:hover', theme)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.site-logo__glyph', theme)
    .width(resolveLogoVar('icon-size'))
    .height(resolveLogoVar('icon-size'))
    .minWidth(resolveLogoVar('icon-size'))
    .minHeight(resolveLogoVar('icon-size'))
    .borderRadius(options.radii.md)
    .display('grid')
    .placeItems('center')
    .position('relative')
    .background(
      `var(--ps-logo-glyph-background, ${palette.semanticTone.accent.icon.background})`,
    )
    .backgroundColor(
      `var(--ps-logo-glyph-background, ${palette.semanticTone.accent.icon.background})`,
    )
    .border(`1px solid ${palette.semanticTone.accent.icon.border}`)
    .color(
      `var(--ps-logo-glyph-foreground, ${palette.semanticTone.accent.icon.color})`,
    )

  styleBuilder
    .select('.site-logo__glyph > .icon', theme)
    .width('80%')
    .height('80%')

  styleBuilder
    .select('.site-logo__glyph-mark', theme)
    .position('absolute')
    .inset('30%')
    .borderRadius('4px')
    .backgroundColor('currentColor')
}

export function registerLogoTextStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-logo__stack', theme)
    .display('inline-grid')
    .justifyItems('stretch')
    .gap('0')
    .minWidth('0')
    .textTransform('uppercase')
    .letterSpacing('0')
    .lineHeight('1')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.site-logo__brand', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .fontSize(resolveLogoVar('brand-size'))
    .fontWeight('800')

  styleBuilder
    .select('.site-logo__brand-letter', theme)
    .whiteSpace('nowrap')
    .backgroundClip('text')
    .webkitBackgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .display('flex')
    .justifyContent('space-between')
    .fontSize(resolveLogoVar('subtitle-size'))
    .fontWeight('700')
    .color(palette.current.text.subtle)
    .marginLeft(resolveLogoVar('subtitle-inset'))
    .marginRight(resolveLogoVar('subtitle-inset'))

  styleBuilder
    .select('.site-logo__subtitle-letter', theme)
    .backgroundClip('text')
    .webkitBackgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')
}

export function registerLogoResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-logo__glyph', theme)
    .media(mediaMin('sm'))
    .width(resolveLogoVar('icon-size', 'sm'))
    .height(resolveLogoVar('icon-size', 'sm'))
    .minWidth(resolveLogoVar('icon-size', 'sm'))
    .minHeight(resolveLogoVar('icon-size', 'sm'))

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media(mediaMin('md'))
    .width(resolveLogoVar('icon-size', 'md'))
    .height(resolveLogoVar('icon-size', 'md'))
    .minWidth(resolveLogoVar('icon-size', 'md'))
    .minHeight(resolveLogoVar('icon-size', 'md'))

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media(mediaMin('lg'))
    .width(resolveLogoVar('icon-size', 'lg'))
    .height(resolveLogoVar('icon-size', 'lg'))
    .minWidth(resolveLogoVar('icon-size', 'lg'))
    .minHeight(resolveLogoVar('icon-size', 'lg'))

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media(mediaMin('xl'))
    .width(resolveLogoVar('icon-size', 'xl'))
    .height(resolveLogoVar('icon-size', 'xl'))
    .minWidth(resolveLogoVar('icon-size', 'xl'))
    .minHeight(resolveLogoVar('icon-size', 'xl'))

  styleBuilder
    .select('.site-logo__brand', theme)
    .media(mediaMin('sm'))
    .fontSize(resolveLogoVar('brand-size', 'sm'))

  styleBuilder
    .select('.site-logo__brand', theme)
    .media(mediaMin('md'))
    .fontSize(resolveLogoVar('brand-size', 'md'))

  styleBuilder
    .select('.site-logo__brand', theme)
    .media(mediaMin('lg'))
    .fontSize(resolveLogoVar('brand-size', 'lg'))

  styleBuilder
    .select('.site-logo__brand', theme)
    .media(mediaMin('xl'))
    .fontSize(resolveLogoVar('brand-size', 'xl'))

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media(mediaMin('sm'))
    .fontSize(resolveLogoVar('subtitle-size', 'sm'))
    .marginLeft(resolveLogoVar('subtitle-inset', 'sm'))
    .marginRight(resolveLogoVar('subtitle-inset', 'sm'))

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media(mediaMin('md'))
    .fontSize(resolveLogoVar('subtitle-size', 'md'))
    .marginLeft(resolveLogoVar('subtitle-inset', 'md'))
    .marginRight(resolveLogoVar('subtitle-inset', 'md'))

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media(mediaMin('lg'))
    .fontSize(resolveLogoVar('subtitle-size', 'lg'))
    .marginLeft(resolveLogoVar('subtitle-inset', 'lg'))
    .marginRight(resolveLogoVar('subtitle-inset', 'lg'))

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media(mediaMin('xl'))
    .fontSize(resolveLogoVar('subtitle-size', 'xl'))
    .marginLeft(resolveLogoVar('subtitle-inset', 'xl'))
    .marginRight(resolveLogoVar('subtitle-inset', 'xl'))
}

function resolveLogoVar(
  token: LogoResponsiveToken,
  breakpoint?: LogoBreakpoint,
): string {
  if (!breakpoint) {
    return `var(--ps-logo-${token}, ${getLogoDefaultValue(token, 'base')})`
  }

  return `var(--ps-logo-${token}-${breakpoint}, ${getLogoDefaultValue(token, breakpoint)})`
}

function getLogoDefaultValue(
  token: LogoResponsiveToken,
  breakpoint: 'base' | LogoBreakpoint,
): string {
  switch (token) {
    case 'brand-size':
      return LOGO_DEFAULTS.brandSize[breakpoint]
    case 'subtitle-size':
      return LOGO_DEFAULTS.subtitleSize[breakpoint]
    case 'icon-size':
      return LOGO_DEFAULTS.iconSize[breakpoint]
    case 'subtitle-inset':
      return LOGO_DEFAULTS.subtitleInset[breakpoint]
  }
}

export function registerLogoInteractiveStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-logo__link[href]', theme)
    .cursor('pointer')
    .transition('border-color 180ms ease')

  styleBuilder
    .select('.site-logo__link[href]:hover', theme)
    .borderColor(palette.semanticTone.accent.border.default)

  styleBuilder
    .select('.site-logo__link[href]:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('0')
}

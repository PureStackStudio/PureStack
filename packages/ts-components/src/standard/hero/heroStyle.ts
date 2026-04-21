import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  getBreakpoint,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerHeroStyles() {
  themes.forEach((theme, palette, options) => {
    registerHeroShellStyles(theme, palette, options)
    registerHeroContentStyles(theme, palette)
    registerHeroCtaStyles(theme, options)
    registerHeroMediaStyles(theme, palette, options)
    registerHeroResponsiveStyles(theme)
  })
}

function registerHeroShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.hero', theme)
    .position('relative')
    .overflow('hidden')
    .padding('28px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.current.border.subtle}`)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .boxShadow(options.shadows.soft)
    .margin('0 0 32px')
    .color(palette.current.text.default)

  styleBuilder
    .select('.hero::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.35')
    .background(palette.effect.glowPrimary)
    .pointerEvents('none')

  styleBuilder
    .select('.hero__inner', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1.1fr) minmax(0, 0.9fr)')
    .alignItems('center')
    .position('relative')
    .zIndex('1')
}

function registerHeroContentStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.hero__content', theme)
    .display('grid')
    .gap('16px')
    .maxWidth(getBreakpoint(BREAKPOINTS.sm))

  styleBuilder
    .select('.hero__eyebrow', theme)
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .fontSize('11px')
    .fontWeight('700')
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.hero__title', theme)
    .margin('0')
    .fontSize('clamp(36px, 5vw, 60px)')
    .lineHeight('1.05')
    .letterSpacing('-0.02em')
    .fontWeight('700')
    .color(palette.current.text.default)

  styleBuilder.select('.hero__title:empty', theme).display('none')

  styleBuilder
    .select('.hero__tagline', theme)
    .margin('0')
    .fontSize('17px')
    .lineHeight('1.6')
    .whiteSpace('pre-line')
    .color(palette.current.text.subtle)

  styleBuilder.select('.hero__tagline:empty', theme).display('none')
  styleBuilder.select('.hero__eyebrow:empty', theme).display('none')
}

function registerHeroCtaStyles(theme: ThemeMode, options: ThemeOptions) {
  styleBuilder
    .select('.hero__actions', theme)
    .display('flex')
    .flexWrap('wrap')
    .gap('16px')
    .alignItems('center')

  styleBuilder.select('.hero__actions:empty', theme).display('none')

  styleBuilder
    .select('.hero__actions .btn', theme)
    .borderRadius(options.radii.pill)
}

function registerHeroMediaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.hero__media', theme)
    .display('flex')
    .justifyContent('center')
    .alignItems('center')

  styleBuilder.select('.hero__media:empty', theme).display('none')

  styleBuilder
    .select('.hero__logo-frame', theme)
    .padding('18px 22px')
    .borderRadius(options.radii.lg)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .border(`1px solid ${palette.current.border.subtle}`)
    .boxShadow(palette.effect.floatingShadow)

  styleBuilder
    .select('.hero__logo', theme)
    .width('100%')
    .height('auto')
    .display('block')
}

function registerHeroResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.hero__inner', theme)
    .media(mediaMax(BREAKPOINTS.lg))
    .gridTemplateColumns('1fr')
    .gap('24px')

  styleBuilder
    .select('.hero__content', theme)
    .media(mediaMax(BREAKPOINTS.lg))
    .maxWidth('100%')

  styleBuilder
    .select('.hero__actions', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .flexDirection('column')
    .alignItems('stretch')

  styleBuilder
    .select('.hero__actions .btn', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .justifyContent('center')
}

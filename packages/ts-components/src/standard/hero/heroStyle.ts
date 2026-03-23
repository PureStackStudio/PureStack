import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, type ThemeOptions, themes } from '@purestack/ts-style'

export function registerHeroStyles() {
  themes.forEach((theme, palette, options) => {
    applyHeroShellStyles(theme, palette, options)
    applyHeroContentStyles(theme, palette)
    applyHeroActionStyles(theme, palette, options)
    applyHeroMediaStyles(theme, palette, options)
    applyHeroResponsiveStyles(theme)
  })
}

export function applyHeroShellStyles(
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
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.showcase)
    .boxShadow(options.shadows.soft)
    .margin('0 0 32px')
    .color(palette.text.default)

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

export function applyHeroContentStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.hero__content', theme)
    .display('grid')
    .gap('16px')
    .maxWidth('640px')

  styleBuilder
    .select('.hero__eyebrow', theme)
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .fontSize('11px')
    .fontWeight('700')
    .color(palette.text.subtle)

  styleBuilder
    .select('.hero__title', theme)
    .margin('0')
    .fontSize('clamp(36px, 5vw, 60px)')
    .lineHeight('1.05')
    .letterSpacing('-0.02em')
    .fontWeight('700')
    .color(palette.text.default)

  styleBuilder.select('.hero__title:empty', theme).display('none')

  styleBuilder
    .select('.hero__tagline', theme)
    .margin('0')
    .fontSize('17px')
    .lineHeight('1.6')
    .whiteSpace('pre-line')
    .color(palette.text.subtle)

  styleBuilder.select('.hero__tagline:empty', theme).display('none')
  styleBuilder.select('.hero__eyebrow:empty', theme).display('none')
}

export function applyHeroActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyHeroActionShellStyles(theme, palette, options)
  applyHeroActionVariantStyles(theme, palette)
  applyHeroActionIconStyles(theme)
}

export function applyHeroActionShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.hero__actions', theme)
    .display('flex')
    .flexWrap('wrap')
    .gap('16px')
    .alignItems('center')

  styleBuilder.select('.hero__actions:empty', theme).display('none')

  styleBuilder
    .select('.hero__action', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('8px')
    .padding('12px 22px')
    .borderRadius(options.radii.pill)
    .border('1px solid transparent')
    .fontWeight('600')
    .textDecoration('none')
    .cursor('pointer')
    .transition(
      'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease',
    )

  styleBuilder
    .select('.hero__action:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

export function applyHeroActionVariantStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.hero__action--primary', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .boxShadow(palette.effect.accentShadow)

  styleBuilder
    .select('.hero__action--primary:hover', theme)
    .background(palette.action.accent.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.hero__action--minimal', theme)
    .color(palette.action.neutral.text)
    .borderColor(palette.border.strong)

  styleBuilder
    .select('.hero__action--minimal:hover', theme)
    .background(palette.action.neutral.hover)
}

export function applyHeroActionIconStyles(theme: ThemeMode) {
  styleBuilder
    .select('.hero__action[data-icon="right-arrow"]::after', theme)
    .content('""')
    .display('inline-block')
    .width('10px')
    .height('10px')
    .marginLeft('6px')
    .borderTop('2px solid currentColor')
    .borderRight('2px solid currentColor')
    .transform('rotate(45deg)')

  styleBuilder
    .select('.hero__action[data-icon="external"]::after', theme)
    .content('""')
    .display('inline-block')
    .width('10px')
    .height('10px')
    .marginLeft('8px')
    .borderTop('2px solid currentColor')
    .borderRight('2px solid currentColor')
    .transform('translateY(-1px)')
}

export function applyHeroMediaStyles(
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
    .background(palette.background.panel)
    .border(`1px solid ${palette.border.subtle}`)
    .boxShadow(palette.effect.floatingShadow)

  styleBuilder
    .select('.hero__logo', theme)
    .width('100%')
    .height('auto')
    .display('block')
}

export function applyHeroResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.hero__inner', theme)
    .media('max-width: 980px')
    .gridTemplateColumns('1fr')
    .gap('24px')

  styleBuilder
    .select('.hero__content', theme)
    .media('max-width: 980px')
    .maxWidth('100%')

  styleBuilder
    .select('.hero__actions', theme)
    .media('max-width: 600px')
    .flexDirection('column')
    .alignItems('stretch')

  styleBuilder
    .select('.hero__action', theme)
    .media('max-width: 600px')
    .justifyContent('center')
}

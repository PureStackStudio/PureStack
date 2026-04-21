import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export function registerPricingStyles() {
  themes.forEach((theme, palette) => {
    applyPricingShellStyles(theme, palette)
    applyPricingPlanStyles(theme, palette)
    applyPricingFeatureStyles(theme, palette)
    applyPricingFeaturedStyles(theme, palette)
    applyPricingResponsiveStyles(theme)
  })
}

export function applyPricingShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing.panel', theme)
    .position('relative')
    .overflow('hidden')
    .margin('0 0 32px')

  styleBuilder.select('.pricing .panel__body', theme).padding('28px')

  styleBuilder
    .select('.pricing::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.4')
    .background(palette.effect.glowSecondary)
    .pointerEvents('none')

  styleBuilder
    .select('.pricing__stack, .pricing__grid', theme)
    .position('relative')
    .zIndex('1')
}

export function applyPricingPlanStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder.select('.pricing-plan.panel', theme).margin('0').height('100%')

  styleBuilder
    .select('.pricing-plan .panel__body', theme)
    .display('flex')
    .flexDirection('column')
    .height('100%')
    .padding('18px')

  styleBuilder
    .select('.pricing-plan__meta', theme)
    .width('100%')

  styleBuilder
    .select('.pricing-plan__icon', theme)
    .width('44px')
    .height('44px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius('12px')
    .background(palette.current.icon.gradient)
    .backgroundColor(palette.current.icon.background)
    .border(`1px solid ${palette.current.icon.border}`)
    .color(palette.current.icon.color)
    .boxShadow(palette.effect.accentShadow)

  styleBuilder
    .select('.pricing-plan__icon svg', theme)
    .width('24px')
    .height('24px')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .strokeWidth('2.2')

  styleBuilder
    .select('.pricing-plan__title', theme)
    .color(palette.current.text.default)

  styleBuilder
    .select('.pricing-plan__price', theme)
    .minHeight('38px')

  styleBuilder
    .select('.pricing-plan__amount', theme)
    .fontSize('24px')
    .fontWeight('700')
    .letterSpacing('-0.02em')
    .color(palette.current.text.default)

  styleBuilder
    .select('.pricing-plan__period', theme)
    .fontSize('11px')
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .fontWeight('600')
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.pricing-plan__features', theme)
    .listStyle('none')
    .padding('0')
    .margin('0')
    .display('grid')
    .gap('0.5em')
}

export function applyPricingFeatureStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-feature', theme)
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.current.text.default)

  styleBuilder
    .select('.pricing-feature__icon', theme)
    .width('22px')
    .height('22px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .flex('0 0 auto')
    .borderRadius('7px')
    .background(palette.current.icon.gradient)
    .backgroundColor(palette.current.icon.background)
    .border(`1px solid ${palette.current.icon.border}`)
    .color(palette.current.icon.color)
    .boxShadow(palette.effect.interactiveShadow)
    .marginTop('0.1em')

  styleBuilder
    .select('.pricing-feature__icon svg', theme)
    .width('14px')
    .height('14px')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .strokeWidth('2.2')
}

export function applyPricingFeaturedStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-plan--featured', theme)
    .position('relative')
    .transform('translateY(-4px)')
    .boxShadow(palette.effect.panelShadowStrong)
}

export function applyPricingResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.pricing', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .padding('0')

  styleBuilder
    .select('.pricing .panel__body', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .padding('22px')

  styleBuilder
    .select('.pricing-plan--featured', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .transform('translateY(0)')
}

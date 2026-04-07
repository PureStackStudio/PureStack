import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerPricingStyles() {
  themes.forEach((theme, palette, options) => {
    applyPricingShellStyles(theme, palette, options)
    applyPricingHeaderStyles(theme, palette)
    applyPricingPlanStyles(theme, palette, options)
    applyPricingFeatureStyles(theme, palette)
    applyPricingFeaturedStyles(theme, palette, options)
    applyPricingResponsiveStyles(theme)
  })
}

export function applyPricingShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing', theme)
    .position('relative')
    .overflow('hidden')
    .padding('28px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.showcaseAlt)
    .boxShadow(options.shadows.soft)
    .margin('0 0 32px')

  styleBuilder
    .select('.pricing::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.4')
    .background(palette.effect.glowSecondary)
    .pointerEvents('none')

  styleBuilder
    .select('.pricing__grid', theme)
    .position('relative')
    .zIndex('1')
    .display('grid')
    .gridTemplateColumns('1fr')
    .gap('16px')
    .alignItems('stretch')
}

export function applyPricingHeaderStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing__header', theme)
    .position('relative')
    .zIndex('1')
    .display('grid')
    .gap('6px')
    .margin('0 0 20px')

  styleBuilder
    .select('.pricing__eyebrow', theme)
    .textTransform('uppercase')
    .letterSpacing('0.18em')
    .fontSize('11px')
    .fontWeight('700')
    .margin('0')
    .color(palette.text.subtle)

  styleBuilder
    .select('.pricing__title', theme)
    .margin('0 !important')
    .fontSize('clamp(24px, 3.2vw, 34px)')
    .fontWeight('700')
    .letterSpacing('-0.02em')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing__subtitle', theme)
    .margin('0')
    .fontSize('14px')
    .lineHeight('1.6')
    .maxWidth('680px')
    .color(palette.text.subtle)

  styleBuilder
    .select('.pricing__footnote', theme)
    .position('relative')
    .zIndex('1')
    .margin('5px 0 0 !important;')
    .fontSize('12px')
    .color(palette.text.subtle)
}

export function applyPricingPlanStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyPricingPlanShellStyles(theme, palette, options)
  applyPricingPlanHeaderStyles(theme, palette, options)
  applyPricingPlanPriceStyles(theme, palette)
  applyPricingPlanCtaStyles(theme, palette, options)
  applyPricingPlanNoteStyles(theme, palette)
}

export function applyPricingPlanShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing-plan', theme)
    .display('flex')
    .flexDirection('column')
    .gap('12px')
    .padding('18px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.panel)
    .boxShadow(palette.effect.panelShadow)
    .height('100%')

  styleBuilder.select('.pricing-plan__head', theme).display('grid').gap('6px')
}

export function applyPricingPlanHeaderStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyPricingPlanMetaStyles(theme, palette)
  applyPricingPlanIconStyles(theme, palette)
  applyPricingPlanTitleStyles(theme, palette, options)
}

export function applyPricingPlanMetaStyles(
  theme: ThemeMode,
  _palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-plan__meta', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('12px')
}

export function applyPricingPlanIconStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-plan__icon', theme)
    .width('44px')
    .height('44px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius('12px')
    .background(palette.semanticTone.accent.icon.gradient)
    .backgroundColor(palette.semanticTone.accent.icon.background)
    .border(`1px solid ${palette.semanticTone.accent.icon.ring}`)
    .color(palette.semanticTone.accent.icon.color)
    .boxShadow(palette.effect.accentShadow)
    .marginBottom('4px')

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
}

export function applyPricingPlanTitleStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing-plan__title-row', theme)
    .display('flex')
    .flexWrap('wrap')
    .gap('10px')
    .alignItems('center')
    .justifyContent('flex-start')

  styleBuilder
    .select('.pricing-plan__title', theme)
    .margin('0')
    .fontSize('18px')
    .fontWeight('700')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing-plan__badge', theme)
    .padding('4px 10px')
    .borderRadius(options.radii.pill)
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.1em')
    .background(palette.semanticTone.accent.background)
    .color(palette.semanticTone.accent.text)

  styleBuilder
    .select('.pricing-plan__summary', theme)
    .margin('0')
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

export function applyPricingPlanPriceStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-plan__price', theme)
    .display('flex')
    .gap('10px')
    .alignItems('baseline')
    .minHeight('38px')

  styleBuilder
    .select('.pricing-plan__amount', theme)
    .fontSize('24px')
    .fontWeight('700')
    .letterSpacing('-0.02em')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing-plan__period', theme)
    .fontSize('11px')
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .fontWeight('600')
    .color(palette.text.subtle)
}

export function applyPricingPlanCtaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.pricing-plan__cta', theme).margin('0')

  styleBuilder
    .select('.pricing-plan__cta-link', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('8px')
    .padding('9px 14px')
    .borderRadius(options.radii.pill)
    .fontWeight('600')
    .fontSize('13px')
    .textDecoration('none')
    .border(`1px solid ${palette.border.default}`)
    .background(palette.semanticTone.neutral.background)
    .color(palette.semanticTone.neutral.text)
    .boxShadow(palette.effect.interactiveShadow)
    .transition(
      'transform 180ms ease, box-shadow 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.pricing-plan__cta-link:hover', theme)
    .background(palette.semanticTone.neutral.hover)

  styleBuilder
    .select('.pricing-plan__cta-link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

export function applyPricingPlanNoteStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-plan__note', theme)
    .margin('0')
    .fontSize('11px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

export function applyPricingFeatureStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.pricing-plan__features', theme)
    .listStyle('none')
    .padding('0')
    .margin('0')
    .display('block')
    .columnGap('18px')
    .columnCount('1')

  styleBuilder
    .select('.pricing-feature', theme)
    .breakInside('avoid')
    .display('grid')
    .gridTemplateColumns('18px minmax(0, 1fr)')
    .gap('8px')
    .alignItems('start')
    .fontSize('13px')
    .lineHeight('1.5')
    .marginBottom('8px')
    .color(palette.text.default)

  styleBuilder
    .select('.pricing-feature__icon', theme)
    .width('22px')
    .height('22px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius('7px')
    .background(palette.semanticTone.neutral.icon.gradient)
    .backgroundColor(palette.semanticTone.neutral.icon.background)
    .border(`1px solid ${palette.semanticTone.neutral.icon.ring}`)
    .color(palette.semanticTone.neutral.icon.color)
    .boxShadow(palette.effect.interactiveShadow)
    .marginTop('0')

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

  styleBuilder.select('.pricing-feature__text', theme).display('block')
}

export function applyPricingFeaturedStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.pricing-plan--featured', theme)
    .position('relative')
    .transform('translateY(-4px)')
    .background(palette.background.feature)
    .border(`1px solid ${palette.border.accent}`)
    .boxShadow(palette.effect.panelShadowStrong)

  styleBuilder
    .select('.pricing-plan--featured::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.accent}`)
    .opacity('0.5')
    .pointerEvents('none')

  styleBuilder
    .select('.pricing-plan--featured .pricing-plan__cta-link', theme)
    .background(palette.semanticTone.accent.background)
    .color(palette.semanticTone.accent.text)
    .borderColor('transparent')

  styleBuilder
    .select('.pricing-plan--featured .pricing-plan__cta-link:hover', theme)
    .background(palette.semanticTone.accent.hover)
}

export function applyPricingResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.pricing__grid', theme)
    .media('min-width: 900px')
    .gridTemplateColumns('repeat(2, minmax(0, 1fr))')

  styleBuilder
    .select('.pricing__grid', theme)
    .media('min-width: 1400px')
    .gridTemplateColumns('repeat(4, minmax(0, 1fr))')

  styleBuilder
    .select('.pricing', theme)
    .media('max-width: 720px')
    .padding('22px')

  styleBuilder
    .select('.pricing-plan--featured', theme)
    .media('max-width: 720px')
    .transform('translateY(0)')
}

import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerFooterStyles() {
  themes.forEach((theme, palette, options) => {
    applyFooterShellStyles(theme, palette, options)
    applyFooterContentStyles(theme, palette, options)
    applyFooterActionStyles(theme, palette, options)
    applyFooterColumnStyles(theme, palette, options)
    applyFooterBottomStyles(theme, palette, options)
    applyFooterToneStyles(theme, palette)
    applyFooterResponsiveStyles(theme)
  })
}

export function applyFooterShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer', theme)
    .position('relative')
    .overflow('hidden')
    .margin('36px 0 0')
    .padding('1px')
    .borderRadius(options.radii.lg)
    .background(palette.background.showcaseAlt)
    .boxShadow(palette.effect.panelShadowStrong)

  styleBuilder
    .select('.site-footer__inner', theme)
    .position('relative')
    .zIndex('1')
    .display('grid')
    .gap('28px')
    .padding('28px')
    .borderRadius(`calc(${options.radii.lg} - 1px)`)
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.subtle}`)

  styleBuilder
    .select('.site-footer__top', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gap('16px')
    .alignItems('end')

  styleBuilder
    .select('.site-footer__brand', theme)
    .display('grid')
    .gap('10px')
    .maxWidth('760px')

  styleBuilder
    .select('.site-footer__top-actions', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('flex-end')
    .gap('10px')
    .flexWrap('wrap')

  styleBuilder.select('.site-footer__top-actions:empty', theme).display('none')

  styleBuilder
    .select('.site-footer__main', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 0.95fr)')
    .gap('20px')
}

export function applyFooterContentStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterHeadingStyles(theme, palette)
  applyFooterPrimaryStyles(theme, palette)
  applyFooterStatusStyles(theme, palette, options)
}

export function applyFooterHeadingStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer__eyebrow', theme)
    .margin('0')
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.14em')
    .color(palette.text.subtle)
  styleBuilder
    .select('.site-footer__title', theme)
    .margin('0')
    .fontSize('clamp(24px, 3.4vw, 34px)')
    .lineHeight('1.12')
    .letterSpacing('-0.02em')
    .color(palette.text.strong)
  styleBuilder
    .select('.site-footer__tagline', theme)
    .margin('0')
    .fontSize('16px')
    .lineHeight('1.6')
    .whiteSpace('pre-line')
    .color(palette.text.subtle)
}

export function applyFooterPrimaryStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer__primary', theme)
    .display('grid')
    .gap('14px')
  styleBuilder
    .select('.site-footer__primary-content', theme)
    .display('grid')
    .gap('10px')
  styleBuilder
    .select('.site-footer__primary-content :where(p)', theme)
    .margin('0')
    .lineHeight('1.7')
    .color(palette.text.muted)
  styleBuilder
    .select('.site-footer__primary-content :where(a)', theme)
    .color(palette.text.accent)
    .fontWeight('600')
}

export function applyFooterStatusStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__status', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flexWrap('wrap')
  styleBuilder.select('.site-footer__status:empty', theme).display('none')
  styleBuilder
    .select('.site-footer__status :where(span, a, strong)', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('5px 10px')
    .borderRadius(options.radii.pill)
    .background(palette.badge.muted.background)
    .color(palette.badge.muted.text)
    .fontSize('11px')
    .fontWeight('700')
    .letterSpacing('0.06em')
    .textTransform('uppercase')
    .textDecoration('none')
}

export function applyFooterActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterCtaStyles(theme, palette, options)
  applyFooterNewsletterStyles(theme, palette, options)
}

export function applyFooterCtaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__cta', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('8px')
    .padding('10px 18px')
    .borderRadius(options.radii.pill)
    .textDecoration('none')
    .fontWeight('700')
    .border(`1px solid ${palette.border.accent}`)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .transition(
      'background 170ms ease, border-color 170ms ease, transform 170ms ease',
    )

  styleBuilder
    .select('.site-footer__cta:hover', theme)
    .background(palette.action.accent.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.site-footer__cta:focus-visible', theme)
    .outline(`2px solid ${palette.action.accent.focusRing}`)
    .outlineOffset('2px')
}

export function applyFooterNewsletterStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterNewsletterShellStyles(theme, palette, options)
  applyFooterNewsletterFieldStyles(theme, palette, options)
  applyFooterNewsletterMetaStyles(theme, palette)
}

export function applyFooterNewsletterShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__columns', theme)
    .display('grid')
    .gridTemplateColumns('repeat(2, minmax(0, 1fr))')
    .gap('16px')
  styleBuilder
    .select('.site-footer__newsletter', theme)
    .display('grid')
    .gap('10px')
    .padding('14px')
    .borderRadius(options.radii.md)
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.default}`)
  styleBuilder
    .select('.site-footer__newsletter-title', theme)
    .margin('0')
    .fontSize('16px')
    .fontWeight('700')
    .letterSpacing('-0.01em')
    .color(palette.text.strong)
  styleBuilder
    .select('.site-footer__newsletter-body', theme)
    .margin('0')
    .fontSize('14px')
    .lineHeight('1.6')
    .color(palette.text.muted)
  styleBuilder
    .select('.site-footer__newsletter-form', theme)
    .display('grid')
    .gap('8px')
}

export function applyFooterNewsletterFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__newsletter-label', theme)
    .fontSize('12px')
    .fontWeight('600')
    .color(palette.text.subtle)
  styleBuilder
    .select('.site-footer__newsletter-row', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gap('8px')
  styleBuilder
    .select('.site-footer__newsletter-input', theme)
    .width('100%')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .color(palette.text.default)
  styleBuilder
    .select('.site-footer__newsletter-input::placeholder', theme)
    .color(palette.text.soft)
  styleBuilder
    .select('.site-footer__newsletter-input:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderColor(palette.border.focus)
}

export function applyFooterNewsletterMetaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer__newsletter-extra:empty', theme)
    .display('none')
  styleBuilder
    .select('.site-footer__newsletter-extra', theme)
    .fontSize('12px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

export function applyFooterColumnStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterColumnShellStyles(theme, palette, options)
  applyFooterColumnListStyles(theme)
  applyFooterLinkStyles(theme, palette, options)
}

export function applyFooterColumnShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.footer-column', theme)
    .display('grid')
    .gap('9px')
    .padding('12px')
    .borderRadius(options.radii.md)
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.subtle}`)
  styleBuilder
    .select('.footer-column--compact', theme)
    .gap('6px')
    .padding('10px')
  styleBuilder
    .select('.footer-column__title', theme)
    .margin('0')
    .fontSize('13px')
    .fontWeight('800')
    .textTransform('uppercase')
    .letterSpacing('0.08em')
    .color(palette.text.subtle)
  styleBuilder
    .select('.footer-column__description', theme)
    .margin('0')
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.soft)
}

export function applyFooterColumnListStyles(theme: ThemeMode) {
  styleBuilder
    .select('.footer-column__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('4px')
  styleBuilder.select('.footer-link-item', theme).listStyle('none')
}

export function applyFooterLinkStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.footer-link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('6px')
    .textDecoration('none')
    .fontSize('14px')
    .lineHeight('1.6')
    .color(palette.text.default)
    .transition('color 150ms ease')
  styleBuilder.select('.footer-link--muted', theme).color(palette.text.subtle)
  styleBuilder.select('.footer-link--strong', theme).fontWeight('700')
  styleBuilder.select('.footer-link:hover', theme).color(palette.text.accent)
  styleBuilder
    .select('.footer-link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderRadius(options.radii.sm)
  styleBuilder
    .select('.footer-link[data-icon="external"]::after', theme)
    .content('""')
    .width('8px')
    .height('8px')
    .borderTop('2px solid currentColor')
    .borderRight('2px solid currentColor')
    .transform('translateY(-1px)')
  styleBuilder
    .select('.footer-link[data-icon="arrow"]::after', theme)
    .content('"->"')
    .fontSize('12px')
}

export function applyFooterBottomStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterBottomShellStyles(theme, palette)
  applyFooterBottomLegalStyles(theme, palette, options)
  applyFooterBottomSocialStyles(theme, palette, options)
}

export function applyFooterBottomShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer__bottom', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto auto')
    .gap('12px')
    .alignItems('center')
    .paddingTop('8px')
    .borderTop(`1px solid ${palette.border.subtle}`)
  styleBuilder
    .select('.site-footer__copyright', theme)
    .margin('0')
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.soft)
}

export function applyFooterBottomLegalStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__legal', theme)
    .display('flex')
    .alignItems('center')
    .gap('12px')
    .flexWrap('wrap')
  styleBuilder
    .select('.site-footer__legal :where(a)', theme)
    .fontSize('13px')
    .fontWeight('600')
    .textDecoration('none')
    .color(palette.text.subtle)
  styleBuilder
    .select('.site-footer__legal :where(a:hover)', theme)
    .color(palette.text.accent)
  styleBuilder
    .select('.site-footer__legal :where(a:focus-visible)', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderRadius(options.radii.sm)
}

export function applyFooterBottomSocialStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__social', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .justifyContent('flex-end')
    .flexWrap('wrap')
  styleBuilder
    .select('.footer-social', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('8px')
    .padding('7px 10px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .textDecoration('none')
    .fontSize('13px')
    .fontWeight('700')
    .color(palette.text.default)
    .transition(
      'background 160ms ease, border-color 160ms ease, transform 160ms ease',
    )
  styleBuilder
    .select('.footer-social:hover', theme)
    .background(palette.background.accentMuted)
    .borderColor(palette.border.accent)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.footer-social:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.footer-social__icon', theme)
    .width('16px')
    .height('16px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
  styleBuilder
    .select('.footer-social__icon svg', theme)
    .width('16px')
    .height('16px')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .strokeWidth('2')
}

export function applyFooterToneStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.site-footer--tone-accent', theme)
    .background(palette.background.showcase)

  styleBuilder
    .select('.site-footer--tone-accent .site-footer__inner', theme)
    .background(palette.background.feature)
    .borderColor(palette.border.accent)

  styleBuilder
    .select('.site-footer--tone-neutral .site-footer__inner', theme)
    .background(palette.background.surface)

  styleBuilder
    .select('.site-footer--variant-minimal', theme)
    .background('transparent')
    .boxShadow('none')

  styleBuilder
    .select('.site-footer--variant-minimal .site-footer__inner', theme)
    .background('transparent')
}

export function applyFooterResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-footer__main', theme)
    .media('max-width: 980px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__columns', theme)
    .media('max-width: 640px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__top', theme)
    .media('max-width: 840px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__top-actions', theme)
    .media('max-width: 840px')
    .justifyContent('flex-start')

  styleBuilder
    .select('.site-footer__newsletter-row', theme)
    .media('max-width: 480px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__bottom', theme)
    .media('max-width: 840px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__social', theme)
    .media('max-width: 840px')
    .justifyContent('flex-start')
}

import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerSearchBoxStyles() {
  themes.forEach((theme, palette, options) => {
    registerSearchBoxShellStyles(theme, palette, options)
    registerSearchBoxResultStyles(theme, palette, options)
    registerSearchBoxResponsiveStyles(theme)
  })
}

export function registerSearchBoxShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  registerSearchBoxShellContainerStyles(theme)
  registerSearchBoxShellIconStyles(theme)
  registerSearchBoxShellAccessibilityStyles(theme)
  registerSearchBoxShellInputStyles(theme, palette, options)
}

function registerSearchBoxShellContainerStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search', theme)
    .position('relative')
    .width('clamp(170px, 28vw, 340px)')
    .maxWidth('100%')

  styleBuilder.select('.site-search__field', theme).display('block')
}

function registerSearchBoxShellIconStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search__icon', theme)
    .position('absolute')
    .left('12px')
    .top('50%')
    .width('18px')
    .height('18px')
    .transform('translateY(-50%)')
    .color('currentColor')
    .pointerEvents('none')

  styleBuilder
    .select('.site-search__icon svg', theme)
    .width('100%')
    .height('100%')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .strokeWidth('2')
    .strokeLinecap('round')
    .strokeLinejoin('round')
}

function registerSearchBoxShellAccessibilityStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search__sr-only', theme)
    .position('absolute')
    .width('1px')
    .height('1px')
    .padding('0')
    .margin('-1px')
    .overflow('hidden')
    .clip('rect(0, 0, 0, 0)')
    .whiteSpace('nowrap')
    .border('0')
}

function registerSearchBoxShellInputStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search__input', theme)
    .width('100%')
    .height('42px')
    .padding('0 14px 0 42px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .background('transparent')
    .color('currentColor')
    .fontSize('14px')
    .lineHeight('1.3')
    .boxSizing('border-box')
    .boxShadow(palette.effect.interactiveShadow)
    .transition('border-color 160ms ease, box-shadow 160ms ease')
    .appearance('none')

  styleBuilder
    .select('.site-search__input::placeholder', theme)
    .color(palette.semanticTone.neutral.text.subtle)

  styleBuilder
    .select('.site-search__input:focus-visible', theme)
    .outline(`2px solid ${palette.semanticTone.neutral.border.focus}`)
    .borderColor(palette.semanticTone.accent.border.default)

  styleBuilder
    .select('.site-search__input::-webkit-search-cancel-button', theme)
    .cursor('pointer')
}

export function registerSearchBoxResultStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  registerSearchBoxResultContainerStyles(theme, palette, options)
  registerSearchBoxResultTopBarOverlayStyles(theme)
  registerSearchBoxResultListStyles(theme, palette, options)
  registerSearchBoxResultContentStyles(theme, palette, options)
}

function registerSearchBoxResultContainerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search__results', theme)
    .position('absolute')
    .top('calc(100% + 8px)')
    .right('0')
    .width('min(560px, calc(100vw - 32px))')
    .maxHeight('420px')
    .overflow('auto')
    .padding('8px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .background(palette.semanticTone.neutral.background.surface)
    .boxShadow(options.shadows.strong)
    .zIndex('60')
}

function registerSearchBoxResultTopBarOverlayStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar .site-search__results', theme)
    .media('min-width: 721px')
    .position('fixed')
    .top('76px')
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .width('min(720px, calc(100vw - 32px))')
    .zIndex('120')
}

function registerSearchBoxResultListStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search__results ul.site-search__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('8px')

  styleBuilder
    .select('.site-search__results .site-search__item', theme)
    .margin('0')
    .padding('0')

  styleBuilder
    .select('.site-search__results .site-search__link', theme)
    .display('grid')
    .gap('6px')
    .padding('12px 14px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.semanticTone.neutral.border.subtle}`)
    .background(palette.semanticTone.neutral.background.surface)
    .textDecoration('none')
    .color(palette.semanticTone.neutral.text.default)
    .boxShadow(palette.effect.interactiveShadow)
    .transition(
      'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
    )

  styleBuilder
    .select('.site-search__results .site-search__link:hover', theme)
    .background(palette.semanticTone.neutral.background.surfaceAlt)
    .borderColor(palette.semanticTone.neutral.border.default)

  styleBuilder
    .select('.site-search__results .site-search__link:focus-visible', theme)
    .outline(`2px solid ${palette.semanticTone.neutral.border.focus}`)
}

function registerSearchBoxResultContentStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search__results .site-search__title', theme)
    .display('block')
    .fontWeight('700')
    .fontSize('0.98rem')
    .lineHeight('1.35')
    .letterSpacing('-0.01em')
    .color(palette.semanticTone.neutral.text.strong)
    .wordBreak('break-word')

  styleBuilder
    .select('.site-search__results .site-search__excerpt', theme)
    .display('block')
    .margin('0')
    .fontSize('0.9rem')
    .lineHeight('1.5')
    .color(palette.semanticTone.neutral.text.subtle)
    .wordBreak('break-word')
    .display('-webkit-box')
    .lineClamp('3')
    .webkitBoxOrient('vertical')
    .overflow('hidden')

  styleBuilder
    .select('.site-search__results mark.site-search__highlight', theme)
    .padding('0 3px')
    .borderRadius('5px')
    .background(palette.semanticTone.accent.background.canvas)
    .color(palette.semanticTone.accent.text.default)

  styleBuilder
    .select('.site-search__results .site-search__message', theme)
    .margin('0')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px dashed ${palette.semanticTone.neutral.border.default}`)
    .background(palette.semanticTone.neutral.background.surface)
    .color(palette.semanticTone.neutral.text.subtle)

  styleBuilder
    .select('.site-search__results .site-search__message--error', theme)
    .border(`1px solid ${palette.semanticTone.danger.border.default}`)
    .background(palette.semanticTone.danger.background.canvas)
    .color(palette.semanticTone.danger.text.default)
}

export function registerSearchBoxResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search', theme)
    .media('max-width: 600px')
    .width('min(100%, 220px)')

  styleBuilder
    .select('.site-search__results', theme)
    .media('max-width: 600px')
    .left('0')
    .right('auto')
    .width('min(100vw - 32px, 520px)')
}

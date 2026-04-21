import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  getBreakpoint,
  mediaAbove,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerSearchBoxStyles() {
  themes.forEach((theme, palette, options) => {
    registerSearchBoxShellStyles(theme)
    registerSearchBoxResultStyles(theme, palette, options)
  })
}

export function registerSearchBoxShellStyles(theme: ThemeMode) {
  registerSearchBoxShellContainerStyles(theme)
  registerSearchBoxShellAccessibilityStyles(theme)
}

function registerSearchBoxShellContainerStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search', theme)
    .position('relative')
    .maxWidth('100%')

  styleBuilder.select('.site-search__field', theme).display('block')
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
    .border(`1px solid ${palette.current.border.default}`)
    .background(palette.current.surface.rest.background)
    .boxShadow(options.shadows.strong)
    .zIndex('60')
}

function registerSearchBoxResultTopBarOverlayStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar .site-search__results', theme)
    .media(mediaAbove(BREAKPOINTS.sm))
    .position('fixed')
    .top('76px')
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .width(`min(${getBreakpoint(BREAKPOINTS.sm)}, calc(100vw - 32px))`)
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
    .gap('0.5em')

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
    .border(`1px solid ${palette.current.border.subtle}`)
    .background(palette.current.surface.rest.background)
    .textDecoration('none')
    .color(palette.current.text.default)
    .transition(
      'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
    )

  styleBuilder
    .select('.site-search__results .site-search__link:hover', theme)
    .background(palette.current.surfaceAlt.rest.background)
    .borderColor(palette.current.border.default)

  styleBuilder
    .select('.site-search__results .site-search__link:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
}

function registerSearchBoxResultContentStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search__results .site-search__title', theme)
    .display('block')
    .apply(palette.applyFont(palette.font.size.body, palette.font.weight.w700))
    .color(palette.current.text.default)
    .wordBreak('break-word')

  styleBuilder
    .select('.site-search__results .site-search__excerpt', theme)
    .display('block')
    .margin('0')
    .apply(palette.applyFont(palette.font.size.sm))
    .color(palette.current.text.subtle)
    .wordBreak('break-word')
    .display('-webkit-box')
    .lineClamp('3')
    .webkitBoxOrient('vertical')
    .overflow('hidden')

  styleBuilder
    .select('.site-search__results mark.site-search__highlight', theme)
    .padding('0 3px')
    .borderRadius('5px')
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.site-search__results .site-search__message', theme)
    .margin('0')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px dashed ${palette.current.border.default}`)
    .background(palette.current.surface.rest.background)
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.site-search__results .site-search__message--error', theme)
    .border(`1px solid ${palette.semanticTone.danger.surface.rest.border}`)
    .background(palette.semanticTone.danger.surface.rest.background)
    .color(palette.semanticTone.danger.surface.rest.text)

  styleBuilder
    .select('.site-search__results .site-search__message--empty', theme)
    .border(`1px solid ${palette.semanticTone.warning.surface.rest.border}`)
    .background(palette.semanticTone.warning.surface.rest.background)
    .color(palette.semanticTone.warning.surface.rest.text)
}

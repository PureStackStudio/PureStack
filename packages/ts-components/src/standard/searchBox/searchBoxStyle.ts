import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  getBreakpoint,
  mediaAbove,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export function registerSearchBoxStyles() {
  themes.forEach((theme, palette) => {
    registerSearchBoxShellStyles(theme)
    registerSearchBoxResultStyles(theme, palette)
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
) {
  registerSearchBoxResultContainerStyles(theme, palette)
  registerSearchBoxResultTopBarOverlayStyles(theme)
  registerSearchBoxResultListStyles(theme, palette)
  registerSearchBoxResultContentStyles(theme, palette)
}

function registerSearchBoxResultContainerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-search__results', theme)
    .position('absolute')
    .top('calc(100% + 0.5rem)')
    .right('0')
    .width('min(35rem, calc(100vw - 2rem))')
    .maxHeight('26.25rem')
    .overflow('auto')
    .padding('0.5rem')
    .borderRadius(palette.radii.lg)
    .border(`1px solid ${palette.current.border.default}`)
    .background(palette.current.surface.rest.background)
    .boxShadow(palette.effect.strongShadow)
    .zIndex('60')
}

function registerSearchBoxResultTopBarOverlayStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar .site-search__results', theme)
    .media(mediaAbove(BREAKPOINTS.sm))
    .position('fixed')
    .top('4.75rem')
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .width(`min(${getBreakpoint(BREAKPOINTS.sm)}, calc(100vw - 2rem))`)
    .zIndex('120')
}

function registerSearchBoxResultListStyles(
  theme: ThemeMode,
  palette: ThemePalette,
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
    .gap('0.375rem')
    .padding('0.75rem 0.875rem')
    .borderRadius(palette.radii.md)
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
    .padding('0 0.1875rem')
    .borderRadius('0.3125rem')
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.site-search__results .site-search__message', theme)
    .margin('0')
    .padding('0.625rem 0.75rem')
    .borderRadius(palette.radii.md)
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

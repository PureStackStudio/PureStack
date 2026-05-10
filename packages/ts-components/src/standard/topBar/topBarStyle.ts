import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaBelow,
  mediaMax,
  mediaMin,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerTopBarStyles() {
  themes.forEach((theme, palette, options) => {
    registerTopBarShellStyles(theme, palette, options)
    registerTopBarToggleStyles(theme, palette)
  })
}

export function getTopBarToggleVisibleSelectors(targetSelector: string) {
  return [
    { selector: `.template-doc--nav-drawer ${targetSelector}` },
    {
      selector: `.template-doc--has-nav ${targetSelector}`,
      media: mediaBelow(BREAKPOINTS.lg),
    },
  ]
}

export function getTopBarToggleHiddenSelectors(targetSelector: string) {
  return [
    {
      selector: `body:not(.template-doc--nav-drawer):not(.template-doc--has-nav) ${targetSelector}`,
    },
    {
      selector: `.template-doc--has-nav:not(.template-doc--nav-drawer) ${targetSelector}`,
      media: mediaMin(BREAKPOINTS.lg),
    },
  ]
}

export function registerTopBarShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.topbar', theme)
    .padding('1rem')
    .position('sticky')
    .top('0')
    .overflowX('clip')
    .zIndex(40)
    .backdropFilter('blur(10px)')
    .borderTopWidth('0 !important')
    .borderRightWidth('0 !important')
    .borderBottomWidth('1px !important')
    .borderBottomStyle('solid !important')
    .borderLeftWidth('0 !important')
    .borderRadius('0 !important')

  styleBuilder.select('.topbar__controls', theme).marginLeft('auto')
  registerTopBarAccountVisibilityStyles(theme)

  styleBuilder
    .select('.topbar__icon', theme)
    .width('42px')
    .height('42px')
    .borderRadius(options.radii.pill)
    .display('grid')
    .placeItems('center')
    .border('1px solid transparent')
    .background('transparent')
    .cursor('pointer')
    .position('relative')
    .padding('0')
    .color(palette.current.text.subtle)
}

function registerTopBarAccountVisibilityStyles(theme: ThemeMode) {
  styleBuilder.select('.topbar__account', theme).display('none')
  for (const rule of getTopBarToggleHiddenSelectors('.topbar__account')) {
    let selector = styleBuilder.select(rule.selector, theme)
    if (rule.media) selector = selector.media(rule.media)
    selector.display('inline-block')
  }
}

export function registerTopBarToggleStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  registerTopBarToggleVisibilityStyles(theme, palette)
  registerTopBarToggleGlyphStyles(theme)
  registerTopBarToggleCheckedStateStyles(theme)
  registerTopBarResponsiveSearchStyles(theme)
}

function registerTopBarToggleVisibilityStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.topbar__toggle', theme)
    .background(palette.current.surface.rest.background)
    .borderColor(palette.current.border.default)
    .color(palette.current.text.subtle)
    .display('none')
  styleBuilder
    .select('.template-doc--nav-drawer .topbar__toggle', theme)
    .display('grid')
  styleBuilder
    .select('.template-doc--has-nav .topbar__toggle', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .display('grid')
  styleBuilder
    .select('.topbar__toggle:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
}

function registerTopBarToggleGlyphStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar__toggle::before', theme)
    .content('""')
    .width('18px')
    .height('2px')
    .background('currentColor')
    .position('absolute')
    .top('14px')
    .left('12px')
    .transition('transform 200ms ease, top 200ms ease')
    .boxShadow('0 6px 0 0 currentColor')
  styleBuilder
    .select('.topbar__toggle::after', theme)
    .content('""')
    .width('18px')
    .height('2px')
    .background('currentColor')
    .position('absolute')
    .top('26px')
    .left('12px')
    .transition('transform 200ms ease, top 200ms ease')
}

function registerTopBarToggleCheckedStateStyles(theme: ThemeMode) {
  styleBuilder.select('.doc-nav-toggle', theme).display('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::before', theme)
    .top('20px')
    .transform('rotate(45deg)')
    .boxShadow('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::after', theme)
    .top('20px')
    .transform('rotate(-45deg)')
}

function registerTopBarResponsiveSearchStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar__search', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .display('none')
}

import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

const THEME_SWITCHER_THUMB_OFFSET = '2.125rem'

export function registerThemeSwitcherStyles() {
  themes.forEach((theme, palette, options) => {
    registerThemeSwitcherShellStyles(theme, palette, options)
    registerThemeSwitcherTrackStyles(theme, palette, options)
    registerThemeSwitcherIconStyles(theme, palette)
    registerThemeSwitcherActiveStateStyles(theme)
  })
}

export function registerThemeSwitcherShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.theme-switcher', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('0')
    .height('2.625rem')
    .minWidth('5.625rem')
    .padding('0')
    .borderRadius(options.radii.pill)
    .border('1px solid transparent')
    .background(palette.current.button.rest.background)
    .borderColor(palette.current.button.rest.text)
    .color(palette.current.button.rest.text)
    .cursor('pointer')
    .fontSize('0')
    .position('relative')
    .overflow('hidden')

  styleBuilder
    .select('.theme-switcher:hover', theme)
    .background(palette.current.button.hover.background)
  styleBuilder
    .select('.theme-switcher:focus-visible', theme)
    .outline(`2px solid ${palette.current.button.hover.text}`)
}

export function registerThemeSwitcherTrackStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.theme-switcher__track', theme)
    .position('absolute')
    .borderRadius(options.radii.pill)
    .background(palette.current.button.hover.background)
    .boxShadow(palette.effect.trackShadow)
    .transition('opacity 180ms ease, transform 220ms ease')

  styleBuilder
    .select('.theme-switcher__thumb', theme)
    .position('absolute')
    .top('50%')
    .left('0.625rem')
    .width('2.25rem')
    .height('2.25rem')
    .borderRadius('50%')
    .background(palette.current.surface.rest.background)
    .boxShadow(palette.effect.thumbShadow)
    .backdropFilter('blur(0.5rem)')
    .transform('translateY(-50%) translateX(0)')
    .display('grid')
    .placeItems('center')
    .transition(
      'transform 260ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease, box-shadow 200ms ease',
    )

  styleBuilder
    .select(
      '.theme-switcher:not([data-theme-switcher-ready="true"]) .theme-switcher__thumb',
      theme,
    )
    .transition('none')

  styleBuilder
    .select('.theme-switcher__track-icon', theme)
    .position('absolute')
    .top('50%')
    .width('1.125rem')
    .height('1.125rem')
    .display('grid')
    .placeItems('center')
    .opacity(0.55)
    .transform('translateY(-50%)')

  styleBuilder
    .select('.theme-switcher__track-icon--sun', theme)
    .left('1.125rem')
    .color(palette.current.button.hover.text)
  styleBuilder
    .select('.theme-switcher__track-icon--moon', theme)
    .right('1.125rem')
    .color(palette.current.button.hover.text)
}

export function registerThemeSwitcherIconStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.theme-switcher__track-icon svg', theme)
    .width('1.125rem')
    .height('1.125rem')
    .stroke('currentColor')
    .fill('none')
    .strokeWidth('2')
    .strokeLinecap('round')
    .strokeLinejoin('round')
  styleBuilder
    .select('.theme-switcher__track-icon--moon svg', theme)
    .fill('currentColor')
    .stroke('none')

  styleBuilder
    .select('.theme-switcher__icon', theme)
    .display('grid')
    .placeItems('center')
    .width('1.125rem')
    .height('1.125rem')
    .position('relative')
    .zIndex(2)
    .gridArea('1 / 1')
    .transition('transform 160ms ease, opacity 160ms ease')
  styleBuilder
    .select('.theme-switcher__icon svg', theme)
    .width('1.125rem')
    .height('1.125rem')
    .stroke('currentColor')
    .fill('none')
    .strokeWidth('2')
    .strokeLinecap('round')
    .strokeLinejoin('round')
  styleBuilder
    .select('.theme-switcher__icon--moon svg', theme)
    .fill('currentColor')
    .stroke('none')

  styleBuilder
    .select('.theme-switcher__icon--sun', theme)
    .color(palette.current.button.hover.text)
    .opacity(0)
    .transform('scale(0.6)')
  styleBuilder
    .select('.theme-switcher__icon--moon', theme)
    .color(palette.current.button.hover.text)
    .opacity(0)
    .transform('scale(0.6)')
}

export function registerThemeSwitcherActiveStateStyles(theme: ThemeMode) {
  styleBuilder
    .select(
      `html[data-theme="${theme}"] .theme-switcher .theme-switcher__track`,
      theme,
    )
    .opacity(0.85)

  styleBuilder
    .select(
      `html[data-theme="${theme}"] .theme-switcher .theme-switcher__thumb`,
      theme,
    )
    .transform(
      theme === 'dark'
        ? `translateY(-50%) translateX(${THEME_SWITCHER_THUMB_OFFSET})`
        : 'translateY(-50%) translateX(0)',
    )

  const activeIcon = theme === 'dark' ? 'moon' : 'sun'
  const inactiveIcon = theme === 'dark' ? 'sun' : 'moon'
  styleBuilder
    .select(
      `html[data-theme="${theme}"] .theme-switcher .theme-switcher__icon--${activeIcon}`,
      theme,
    )
    .opacity(1)
    .transform('scale(1)')
  styleBuilder
    .select(
      `html[data-theme="${theme}"] .theme-switcher .theme-switcher__icon--${inactiveIcon}`,
      theme,
    )
    .opacity(0)
    .transform('scale(0.6)')
}

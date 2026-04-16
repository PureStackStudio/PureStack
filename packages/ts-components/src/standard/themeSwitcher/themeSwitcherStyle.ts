import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

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
    .height('42px')
    .minWidth('90px')
    .padding('0')
    .borderRadius(options.radii.pill)
    .border('1px solid transparent')
    .background(palette.semanticTone.accent.button.rest.background)
    .borderColor(palette.semanticTone.accent.button.rest.text)
    .color(palette.semanticTone.accent.button.rest.text)
    .cursor('pointer')
    .fontSize('0')
    .position('relative')
    .overflow('hidden')

  styleBuilder
    .select('.theme-switcher:hover', theme)
    .background(palette.semanticTone.accent.button.hover.background)
  styleBuilder
    .select('.theme-switcher:focus-visible', theme)
    .outline(`2px solid ${palette.semanticTone.accent.button.hover.text}`)
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
    .background(palette.semanticTone.accent.button.hover.background)
    .boxShadow(palette.effect.trackShadow)
    .transition('opacity 180ms ease, transform 220ms ease')

  styleBuilder
    .select('.theme-switcher__thumb', theme)
    .position('absolute')
    .top('50%')
    .left('10px')
    .width('36px')
    .height('36px')
    .borderRadius('50%')
    .background(palette.semanticTone.accent.surface.rest.background)
    .boxShadow(palette.effect.thumbShadow)
    .backdropFilter('blur(8px)')
    .transform('translateY(-50%) translateX(0)')
    .display('grid')
    .placeItems('center')
    .transition(
      'transform 260ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease, box-shadow 200ms ease',
    )
    .willChange('transform')

  styleBuilder
    .select('.theme-switcher__track-icon', theme)
    .position('absolute')
    .top('50%')
    .width('18px')
    .height('18px')
    .display('grid')
    .placeItems('center')
    .opacity(0.55)
    .transform('translateY(-50%)')

  styleBuilder
    .select('.theme-switcher__track-icon--sun', theme)
    .left('18px')
    .color(palette.semanticTone.accent.button.hover.text)
  styleBuilder
    .select('.theme-switcher__track-icon--moon', theme)
    .right('18px')
    .color(palette.semanticTone.accent.button.hover.text)
}

export function registerThemeSwitcherIconStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.theme-switcher__track-icon svg', theme)
    .width('18px')
    .height('18px')
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
    .width('18px')
    .height('18px')
    .position('relative')
    .zIndex(2)
    .gridArea('1 / 1')
    .transition('transform 160ms ease, opacity 160ms ease')
  styleBuilder
    .select('.theme-switcher__icon svg', theme)
    .width('18px')
    .height('18px')
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
    .color(palette.semanticTone.accent.button.hover.text)
    .opacity(0)
    .transform('scale(0.6)')
  styleBuilder
    .select('.theme-switcher__icon--moon', theme)
    .color(palette.semanticTone.accent.button.hover.text)
    .opacity(0)
    .transform('scale(0.6)')
}

export function registerThemeSwitcherActiveStateStyles(theme: ThemeMode) {
  styleBuilder
    .select(
      `.theme-switcher[data-theme="${theme}"] .theme-switcher__track`,
      theme,
    )
    .opacity(0.85)

  const activeIcon = theme === 'dark' ? 'moon' : 'sun'
  const inactiveIcon = theme === 'dark' ? 'sun' : 'moon'
  styleBuilder
    .select(
      `.theme-switcher[data-theme="${theme}"] .theme-switcher__icon--${activeIcon}`,
      theme,
    )
    .opacity(1)
    .transform('scale(1)')
  styleBuilder
    .select(
      `.theme-switcher[data-theme="${theme}"] .theme-switcher__icon--${inactiveIcon}`,
      theme,
    )
    .opacity(0)
    .transform('scale(0.6)')
}

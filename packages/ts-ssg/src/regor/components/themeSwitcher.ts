import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { themes } from '../../style/themeOptions'

export interface ThemeSwitcherColors {
  background: string
  border: string
  text: string
  hoverBackground: string
  trackBackground: string
  trackShadow: string
  thumbBackground: string
  thumbShadow: string
  trackSun: string
  trackMoon: string
  thumbIcon: string
}

const themeSwitcherTemplate = html`<button
  class="theme-switcher"
  type="button"
  aria-label="Switch theme"
>
  <span class="theme-switcher__track" aria-hidden="true"></span>
  <span
    class="theme-switcher__track-icon theme-switcher__track-icon--sun"
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  </span>
  <span
    class="theme-switcher__track-icon theme-switcher__track-icon--moon"
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </span>
  <span class="theme-switcher__thumb" aria-hidden="true">
    <span
      class="theme-switcher__icon theme-switcher__icon--sun"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </span>
    <span
      class="theme-switcher__icon theme-switcher__icon--moon"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </span>
  </span>
</button>`

function registerThemeSwitcherStyles() {
  themes.forEach((theme, palette, options) => {
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
      .background(palette.themeSwitcher.background)
      .borderColor(palette.themeSwitcher.border)
      .color(palette.themeSwitcher.text)
      .cursor('pointer')
      .fontSize('0')
      .position('relative')
      .overflow('hidden')

    styleBuilder
      .select('.theme-switcher:hover', theme)
      .background(palette.themeSwitcher.hoverBackground)

    styleBuilder
      .select('.theme-switcher:focus-visible', theme)
      .outline(`2px solid ${palette.nav.focusRing}`)
      .outlineOffset('2px')

    styleBuilder
      .select('.theme-switcher__track', theme)
      .position('absolute')
      .inset('6px')
      .borderRadius(options.radii.pill)
      .background(palette.themeSwitcher.trackBackground)
      .boxShadow(palette.themeSwitcher.trackShadow)
      .transition('opacity 180ms ease, transform 220ms ease')

    styleBuilder
      .select('.theme-switcher__thumb', theme)
      .position('absolute')
      .top('50%')
      .left('10px')
      .width('36px')
      .height('36px')
      .borderRadius('50%')
      .background(palette.themeSwitcher.thumbBackground)
      .boxShadow(palette.themeSwitcher.thumbShadow)
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
      .color(palette.themeSwitcher.trackSun)

    styleBuilder
      .select('.theme-switcher__track-icon--moon', theme)
      .right('18px')
      .color(palette.themeSwitcher.trackMoon)

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
      .color(palette.themeSwitcher.thumbIcon)
      .opacity(0)
      .transform('scale(0.6)')

    styleBuilder
      .select('.theme-switcher__icon--moon', theme)
      .color(palette.themeSwitcher.thumbIcon)
      .opacity(0)
      .transform('scale(0.6)')

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
  })
}

function createThemeSwitcherComponent() {
  return createComponent(themeSwitcherTemplate)
}

export function createThemeSwitcherComponents() {
  registerThemeSwitcherStyles()
  return { themeSwitcher: createThemeSwitcherComponent() }
}

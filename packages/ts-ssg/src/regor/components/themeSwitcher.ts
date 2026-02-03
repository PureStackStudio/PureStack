import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'

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
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseSwitcher = (theme: string) =>
    styleBuilder
      .select('.theme-switcher', theme)
      .set('display', 'inline-flex')
      .set('align-items', 'center')
      .set('justify-content', 'center')
      .set('gap', '0')
      .set('height', '42px')
      .set('min-width', '90px')
      .set('padding', '0')
      .set('border-radius', themeOptions.radii.pill)
      .set('border', '1px solid transparent')
      .set('background', 'transparent')
      .set('cursor', 'pointer')
      .set('font-size', '0')
      .set('position', 'relative')
      .set('overflow', 'hidden')

  baseSwitcher('light')
    .set('background', palette('light').themeSwitcher.background)
    .set('border-color', palette('light').themeSwitcher.border)
    .set('color', palette('light').themeSwitcher.text)
  baseSwitcher('dark')
    .set('background', palette('dark').themeSwitcher.background)
    .set('border-color', palette('dark').themeSwitcher.border)
    .set('color', palette('dark').themeSwitcher.text)

  styleBuilder
    .select('.theme-switcher:hover', 'light')
    .set('background', palette('light').themeSwitcher.hoverBackground)
  styleBuilder
    .select('.theme-switcher:hover', 'dark')
    .set('background', palette('dark').themeSwitcher.hoverBackground)

  styleBuilder
    .select('.theme-switcher:focus-visible', 'light')
    .set('outline', `2px solid ${palette('light').nav.focusRing}`)
    .set('outline-offset', '2px')
  styleBuilder
    .select('.theme-switcher:focus-visible', 'dark')
    .set('outline', `2px solid ${palette('dark').nav.focusRing}`)
    .set('outline-offset', '2px')

  const baseTrack = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__track', theme)
      .set('position', 'absolute')
      .set('inset', '6px')
      .set('border-radius', themeOptions.radii.pill)
      .set('background', palette(theme).themeSwitcher.trackBackground)
      .set('box-shadow', palette(theme).themeSwitcher.trackShadow)
      .set('transition', 'opacity 180ms ease, transform 220ms ease')

  baseTrack('light')
  baseTrack('dark')

  styleBuilder
    .select('.theme-switcher__track', 'dark')
    .set('background', palette('dark').themeSwitcher.trackBackground)
    .set('box-shadow', palette('dark').themeSwitcher.trackShadow)

  const baseThumb = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__thumb', theme)
      .set('position', 'absolute')
      .set('top', '50%')
      .set('left', '10px')
      .set('width', '36px')
      .set('height', '36px')
      .set('border-radius', '50%')
      .set('background', palette(theme).themeSwitcher.thumbBackground)
      .set('box-shadow', palette(theme).themeSwitcher.thumbShadow)
      .set('backdrop-filter', 'blur(8px)')
      .set('transform', 'translateY(-50%) translateX(0)')
      .set('display', 'grid')
      .set('place-items', 'center')
      .set(
        'transition',
        'transform 260ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease, box-shadow 200ms ease',
      )
      .set('will-change', 'transform')

  baseThumb('light')
  baseThumb('dark')

  styleBuilder
    .select('.theme-switcher__thumb', 'dark')
    .set('background', palette('dark').themeSwitcher.thumbBackground)
    .set('box-shadow', palette('dark').themeSwitcher.thumbShadow)

  const baseTrackIcon = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__track-icon', theme)
      .set('position', 'absolute')
      .set('top', '50%')
      .set('width', '18px')
      .set('height', '18px')
      .set('display', 'grid')
      .set('place-items', 'center')
      .set('opacity', '0.55')
      .set('transform', 'translateY(-50%)')

  baseTrackIcon('light')
  baseTrackIcon('dark')

  styleBuilder
    .select('.theme-switcher__track-icon--sun', 'light')
    .set('left', '18px')
    .set('color', palette('light').themeSwitcher.trackSun)
  styleBuilder
    .select('.theme-switcher__track-icon--moon', 'light')
    .set('right', '18px')
    .set('color', palette('light').themeSwitcher.trackMoon)
  styleBuilder
    .select('.theme-switcher__track-icon--sun', 'dark')
    .set('left', '18px')
    .set('color', palette('dark').themeSwitcher.trackSun)
  styleBuilder
    .select('.theme-switcher__track-icon--moon', 'dark')
    .set('right', '18px')
    .set('color', palette('dark').themeSwitcher.trackMoon)

  const baseTrackSvg = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__track-icon svg', theme)
      .set('width', '18px')
      .set('height', '18px')
      .set('stroke', 'currentColor')
      .set('fill', 'none')
      .set('stroke-width', '2')
      .set('stroke-linecap', 'round')
      .set('stroke-linejoin', 'round')

  baseTrackSvg('light')
  baseTrackSvg('dark')

  styleBuilder
    .select('.theme-switcher__track-icon--moon svg', 'light')
    .set('fill', 'currentColor')
    .set('stroke', 'none')
  styleBuilder
    .select('.theme-switcher__track-icon--moon svg', 'dark')
    .set('fill', 'currentColor')
    .set('stroke', 'none')

  const baseIcon = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__icon', theme)
      .set('display', 'grid')
      .set('place-items', 'center')
      .set('width', '18px')
      .set('height', '18px')
      .set('position', 'relative')
      .set('z-index', '2')
      .set('grid-area', '1 / 1')

  baseIcon('light')
  baseIcon('dark')

  const baseSvg = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__icon svg', theme)
      .set('width', '18px')
      .set('height', '18px')
      .set('stroke', 'currentColor')
      .set('fill', 'none')
      .set('stroke-width', '2')
      .set('stroke-linecap', 'round')
      .set('stroke-linejoin', 'round')

  baseSvg('light')
  baseSvg('dark')

  styleBuilder
    .select('.theme-switcher__icon--moon svg', 'light')
    .set('fill', 'currentColor')
    .set('stroke', 'none')
  styleBuilder
    .select('.theme-switcher__icon--moon svg', 'dark')
    .set('fill', 'currentColor')
    .set('stroke', 'none')

  styleBuilder
    .select('.theme-switcher__icon--sun', 'light')
    .set('color', palette('light').themeSwitcher.thumbIcon)
  styleBuilder
    .select('.theme-switcher__icon--sun', 'dark')
    .set('color', palette('dark').themeSwitcher.thumbIcon)
  styleBuilder
    .select('.theme-switcher__icon--moon', 'light')
    .set('color', palette('light').themeSwitcher.thumbIcon)
  styleBuilder
    .select('.theme-switcher__icon--moon', 'dark')
    .set('color', palette('dark').themeSwitcher.thumbIcon)

  styleBuilder
    .select('.theme-switcher__icon', 'light')
    .set('transition', 'transform 160ms ease, opacity 160ms ease')
  styleBuilder
    .select('.theme-switcher__icon', 'dark')
    .set('transition', 'transform 160ms ease, opacity 160ms ease')

  styleBuilder
    .select('.theme-switcher[data-theme="dark"] .theme-switcher__track', 'dark')
    .set('opacity', '0.85')
  styleBuilder
    .select(
      '.theme-switcher[data-theme="light"] .theme-switcher__track',
      'light',
    )
    .set('opacity', '0.85')

  styleBuilder
    .select('.theme-switcher__icon--sun', 'light')
    .set('opacity', '0')
    .set('transform', 'scale(0.6)')
  styleBuilder
    .select('.theme-switcher__icon--moon', 'light')
    .set('opacity', '0')
    .set('transform', 'scale(0.6)')
  styleBuilder
    .select('.theme-switcher__icon--sun', 'dark')
    .set('opacity', '0')
    .set('transform', 'scale(0.6)')
  styleBuilder
    .select('.theme-switcher__icon--moon', 'dark')
    .set('opacity', '0')
    .set('transform', 'scale(0.6)')

  styleBuilder
    .select(
      '.theme-switcher[data-theme="light"] .theme-switcher__icon--sun',
      'light',
    )
    .set('opacity', '1')
    .set('transform', 'scale(1)')
  styleBuilder
    .select(
      '.theme-switcher[data-theme="light"] .theme-switcher__icon--moon',
      'light',
    )
    .set('opacity', '0')
    .set('transform', 'scale(0.6)')
  styleBuilder
    .select(
      '.theme-switcher[data-theme="dark"] .theme-switcher__icon--moon',
      'dark',
    )
    .set('opacity', '1')
    .set('transform', 'scale(1)')
  styleBuilder
    .select(
      '.theme-switcher[data-theme="dark"] .theme-switcher__icon--sun',
      'dark',
    )
    .set('opacity', '0')
    .set('transform', 'scale(0.6)')
}

function createThemeSwitcherComponent() {
  return createComponent(themeSwitcherTemplate)
}

export function createThemeSwitcherComponents() {
  registerThemeSwitcherStyles()
  return { themeSwitcher: createThemeSwitcherComponent() }
}

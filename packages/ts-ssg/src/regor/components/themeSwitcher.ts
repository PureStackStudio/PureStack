import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'

const themeSwitcherTemplate = html`<button
  class="theme-switcher"
  type="button"
  aria-label="Switch theme"
>
  <span class="theme-switcher__icon theme-switcher__icon--sun" aria-hidden="true">
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
  <span class="theme-switcher__divider" aria-hidden="true"></span>
  <span
    class="theme-switcher__icon theme-switcher__icon--moon"
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      ></path>
    </svg>
  </span>
</button>`

function registerThemeSwitcherStyles() {
  const baseSwitcher = (theme: string) =>
    styleBuilder
      .select('.theme-switcher', theme)
      .set('display', 'inline-flex')
      .set('align-items', 'center')
      .set('gap', '8px')
      .set('height', '40px')
      .set('padding', '0 12px')
      .set('border-radius', '999px')
      .set('border', '1px solid transparent')
      .set('background', 'transparent')
      .set('cursor', 'pointer')
      .set('font-size', '0')

  baseSwitcher('light')
    .set('background', '#ffffff')
    .set('border-color', '#d8deee')
    .set('color', '#3c4250')
  baseSwitcher('dark')
    .set('background', '#1f2430')
    .set('border-color', '#2d3340')
    .set('color', '#d8deee')

  styleBuilder
    .select('.theme-switcher:hover', 'light')
    .set('background', '#f1f4fb')
  styleBuilder
    .select('.theme-switcher:hover', 'dark')
    .set('background', '#252b38')

  styleBuilder
    .select('.theme-switcher:focus-visible', 'light')
    .set('outline', '2px solid #9ab3ff')
    .set('outline-offset', '2px')
  styleBuilder
    .select('.theme-switcher:focus-visible', 'dark')
    .set('outline', '2px solid #91a7ff')
    .set('outline-offset', '2px')

  const baseIcon = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__icon', theme)
      .set('display', 'inline-flex')
      .set('align-items', 'center')
      .set('justify-content', 'center')
      .set('width', '18px')
      .set('height', '18px')

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

  const baseDivider = (theme: string) =>
    styleBuilder
      .select('.theme-switcher__divider', theme)
      .set('width', '1px')
      .set('height', '18px')
      .set('background', 'currentColor')
      .set('opacity', '0.3')

  baseDivider('light')
  baseDivider('dark')
}

function createThemeSwitcherComponent() {
  return createComponent(themeSwitcherTemplate)
}

export function createThemeSwitcherComponents() {
  registerThemeSwitcherStyles()
  return { themeSwitcher: createThemeSwitcherComponent() }
}

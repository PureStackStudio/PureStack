import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'
import type { TsSsgContext } from '../../ts-ssg-context'
import { resolveTsSsgContext } from './resolveTsSsgContext'

function resolveBrandLabel(context: TsSsgContext): string {
  const label = context?.site?.siteTitle
  if (typeof label !== 'string') return 'Docs'
  const trimmed = label.trim()
  return trimmed.length > 0 ? trimmed : 'Docs'
}

const topBarTemplate = html`<input
    class="doc-nav-toggle"
    id="doc-nav-toggle"
    type="checkbox"
    aria-hidden="true"
  />
  <header class="topbar">
    <a class="topbar__logo" href="/">{{ brandLabel }}</a>
    <div class="topbar__actions">
      <theme-switcher></theme-switcher>
      <button
        class="topbar__icon topbar__search"
        type="button"
        aria-label="Search"
      ></button>
      <label
        class="topbar__icon topbar__toggle"
        for="doc-nav-toggle"
        role="button"
        aria-label="Toggle navigation"
      ></label>
    </div>
  </header>`

function registerTopBarStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseBar = (theme: string) =>
    styleBuilder
      .select('.topbar', theme)
      .set('display', 'flex')
      .set('align-items', 'center')
      .set('justify-content', 'space-between')
      .set('gap', '16px')
      .set('padding', '16px')
      .set('position', 'sticky')
      .set('top', '0')
      .set('z-index', '40')
      .set('backdrop-filter', 'blur(10px)')
      .set('border-bottom', '1px solid transparent')

  baseBar('light')
    .set('background', palette('light').topBarBackground)
    .set('border-bottom-color', palette('light').topBarBorder)
  baseBar('dark')
    .set('background', palette('dark').topBarBackground)
    .set('border-bottom-color', palette('dark').topBarBorder)

  const baseLogo = (theme: string) =>
    styleBuilder
      .select('.topbar__logo', theme)
      .set('font-size', '22px')
      .set('font-weight', 700)
      .set('text-decoration', 'none')

  baseLogo('light').set('color', palette('light').topBarLogo)
  baseLogo('dark').set('color', palette('dark').topBarLogo)

  const baseActions = (theme: string) =>
    styleBuilder
      .select('.topbar__actions', theme)
      .set('display', 'flex')
      .set('align-items', 'center')
      .set('gap', '10px')

  baseActions('light')
  baseActions('dark')

  const baseIcon = (theme: string) =>
    styleBuilder
      .select('.topbar__icon', theme)
      .set('width', '42px')
      .set('height', '42px')
      .set('border-radius', themeOptions.radii.pill)
      .set('display', 'grid')
      .set('place-items', 'center')
      .set('border', '1px solid transparent')
      .set('background', 'transparent')
      .set('cursor', 'pointer')
      .set('position', 'relative')
      .set('padding', '0')

  baseIcon('light').set('color', palette('light').topBarIcon)
  baseIcon('dark').set('color', palette('dark').topBarIcon)

  styleBuilder
    .select('.topbar__toggle', 'light')
    .set('background', palette('light').topBarToggleBackground)
    .set('border-color', palette('light').topBarToggleBorder)
  styleBuilder
    .select('.topbar__toggle', 'dark')
    .set('background', palette('dark').topBarToggleBackground)
    .set('border-color', palette('dark').topBarToggleBorder)
    .set('color', palette('dark').topBarToggleIcon)

  styleBuilder
    .select('.topbar__search', 'light')
    .set('border', '0')
    .set('background', 'transparent')
  styleBuilder
    .select('.topbar__search', 'dark')
    .set('border', '0')
    .set('background', 'transparent')

  const baseSearchBefore = (theme: string) =>
    styleBuilder
      .select('.topbar__search::before', theme)
      .set('content', '""')
      .set('width', '16px')
      .set('height', '16px')
      .set('border', '2px solid currentColor')
      .set('border-radius', '50%')
      .set('position', 'absolute')
      .set('top', '11px')
      .set('left', '11px')

  baseSearchBefore('light')
  baseSearchBefore('dark')

  const baseSearchAfter = (theme: string) =>
    styleBuilder
      .select('.topbar__search::after', theme)
      .set('content', '""')
      .set('width', '10px')
      .set('height', '2px')
      .set('background', 'currentColor')
      .set('position', 'absolute')
      .set('right', '9px')
      .set('bottom', '12px')
      .set('transform', 'rotate(45deg)')

  baseSearchAfter('light')
  baseSearchAfter('dark')

  const baseToggleBefore = (theme: string) =>
    styleBuilder
      .select('.topbar__toggle::before', theme)
      .set('content', '""')
      .set('width', '18px')
      .set('height', '2px')
      .set('background', 'currentColor')
      .set('position', 'absolute')
      .set('top', '14px')
      .set('left', '12px')
      .set('transition', 'transform 200ms ease, top 200ms ease')
      .set('box-shadow', '0 6px 0 0 currentColor')

  baseToggleBefore('light')
  baseToggleBefore('dark')

  const baseToggleAfter = (theme: string) =>
    styleBuilder
      .select('.topbar__toggle::after', theme)
      .set('content', '""')
      .set('width', '18px')
      .set('height', '2px')
      .set('background', 'currentColor')
      .set('position', 'absolute')
      .set('top', '26px')
      .set('left', '12px')
      .set('transition', 'transform 200ms ease, top 200ms ease')

  baseToggleAfter('light')
  baseToggleAfter('dark')

  styleBuilder.select('.doc-nav-toggle', 'light').set('display', 'none')
  styleBuilder.select('.doc-nav-toggle', 'dark').set('display', 'none')

  styleBuilder
    .select(
      '.doc-nav-toggle:checked ~ .topbar .topbar__toggle::before',
      'light',
    )
    .set('top', '20px')
    .set('transform', 'rotate(45deg)')
    .set('box-shadow', 'none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::before', 'dark')
    .set('top', '20px')
    .set('transform', 'rotate(45deg)')
    .set('box-shadow', 'none')

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::after', 'light')
    .set('top', '20px')
    .set('transform', 'rotate(-45deg)')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::after', 'dark')
    .set('top', '20px')
    .set('transform', 'rotate(-45deg)')
}

function createTopBarComponent() {
  return createComponent(topBarTemplate, {
    context: (head) => ({
      brandLabel: resolveBrandLabel(resolveTsSsgContext(head)),
    }),
  })
}

export function createTopBarComponents() {
  registerTopBarStyles()
  return { topBar: createTopBarComponent() }
}

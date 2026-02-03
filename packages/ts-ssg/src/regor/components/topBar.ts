import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'
import type { TsSsgContext } from '../ts-ssg-context'
import { resolveTsSsgContext } from '../resolveTsSsgContext'

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
      .display('flex')
      .alignItems('center')
      .justifyContent('space-between')
      .gap('16px')
      .padding('16px')
      .position('sticky')
      .top('0')
      .zIndex(40)
      .backdropFilter('blur(10px)')
      .borderBottom('1px solid transparent')

  baseBar('light')
    .background(palette('light').topBar.background)
    .borderBottomColor(palette('light').topBar.border)
  baseBar('dark')
    .background(palette('dark').topBar.background)
    .borderBottomColor(palette('dark').topBar.border)

  const baseLogo = (theme: string) =>
    styleBuilder
      .select('.topbar__logo', theme)
      .fontSize('22px')
      .fontWeight('700')
      .textDecoration('none')

  baseLogo('light').color(palette('light').topBar.logo)
  baseLogo('dark').color(palette('dark').topBar.logo)

  const baseActions = (theme: string) =>
    styleBuilder
      .select('.topbar__actions', theme)
      .display('flex')
      .alignItems('center')
      .gap('10px')

  baseActions('light')
  baseActions('dark')

  const baseIcon = (theme: string) =>
    styleBuilder
      .select('.topbar__icon', theme)
      .width('42px')
      .height('42px')
      .borderRadius(themeOptions.radii.pill)
      .display('grid')
      .placeItems('center')
      .border('1px solid transparent')
      .background('transparent')
      .cursor('pointer')
      .position('relative')
      .padding('0')

  baseIcon('light').color(palette('light').topBar.icon)
  baseIcon('dark').color(palette('dark').topBar.icon)

  styleBuilder
    .select('.topbar__toggle', 'light')
    .background(palette('light').topBar.toggleBackground)
    .borderColor(palette('light').topBar.toggleBorder)
  styleBuilder
    .select('.topbar__toggle', 'dark')
    .background(palette('dark').topBar.toggleBackground)
    .borderColor(palette('dark').topBar.toggleBorder)
    .color(palette('dark').topBar.toggleIcon)

  styleBuilder
    .select('.topbar__search', 'light')
    .border('0')
    .background('transparent')
  styleBuilder
    .select('.topbar__search', 'dark')
    .border('0')
    .background('transparent')

  const baseSearchBefore = (theme: string) =>
    styleBuilder
      .select('.topbar__search::before', theme)
      .content('""')
      .width('16px')
      .height('16px')
      .border('2px solid currentColor')
      .borderRadius('50%')
      .position('absolute')
      .top('11px')
      .left('11px')

  baseSearchBefore('light')
  baseSearchBefore('dark')

  const baseSearchAfter = (theme: string) =>
    styleBuilder
      .select('.topbar__search::after', theme)
      .content('""')
      .width('10px')
      .height('2px')
      .background('currentColor')
      .position('absolute')
      .right('9px')
      .bottom('12px')
      .transform('rotate(45deg)')

  baseSearchAfter('light')
  baseSearchAfter('dark')

  const baseToggleBefore = (theme: string) =>
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

  baseToggleBefore('light')
  baseToggleBefore('dark')

  const baseToggleAfter = (theme: string) =>
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

  baseToggleAfter('light')
  baseToggleAfter('dark')

  styleBuilder.select('.doc-nav-toggle', 'light').display('none')
  styleBuilder.select('.doc-nav-toggle', 'dark').display('none')

  styleBuilder
    .select(
      '.doc-nav-toggle:checked ~ .topbar .topbar__toggle::before',
      'light',
    )
    .top('20px')
    .transform('rotate(45deg)')
    .boxShadow('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::before', 'dark')
    .top('20px')
    .transform('rotate(45deg)')
    .boxShadow('none')

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::after', 'light')
    .top('20px')
    .transform('rotate(-45deg)')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::after', 'dark')
    .top('20px')
    .transform('rotate(-45deg)')
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

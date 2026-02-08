import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { themes } from '../../style/themeOptions'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

export interface ThemeTopBarColors {
  background: string
  border: string
  logo: string
  icon: string
  toggleBackground: string
  toggleBorder: string
  toggleIcon: string
}

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
  themes.forEach((theme, palette, options) => {
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
      .background(palette.topBar.background)
      .borderBottomColor(palette.topBar.border)

    styleBuilder
      .select('.topbar__logo', theme)
      .fontSize('22px')
      .fontWeight('700')
      .textDecoration('none')
      .color(palette.topBar.logo)

    styleBuilder
      .select('.topbar__actions', theme)
      .display('flex')
      .alignItems('center')
      .gap('10px')

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
      .color(palette.topBar.icon)

    styleBuilder
      .select('.topbar__toggle', theme)
      .background(palette.topBar.toggleBackground)
      .borderColor(palette.topBar.toggleBorder)
      .color(palette.topBar.toggleIcon)
      .display('none')

    styleBuilder
      .select('.template-doc--nav-drawer .topbar__toggle', theme)
      .display('grid')

    styleBuilder
      .select('.topbar__toggle:focus-visible', theme)
      .outline(`2px solid ${palette.nav.focusRing}`)
      .outlineOffset('2px')

    styleBuilder.select('.topbar__search', theme).border('0').background('transparent')

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
  })
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

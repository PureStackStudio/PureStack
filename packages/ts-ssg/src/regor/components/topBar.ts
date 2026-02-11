import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { type ThemeMode, type ThemeOptions,themes } from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

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
    <site-search class="topbar__search"></site-search>
    <div class="topbar__controls">
      <theme-switcher></theme-switcher>
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
    registerTopBarShellStyles(theme, palette, options)
    registerTopBarSearchStyles(theme)
    registerTopBarToggleStyles(theme, palette)
  })
}

function registerTopBarShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.topbar', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) minmax(220px, 420px) minmax(0, 1fr)')
    .alignItems('center')
    .gap('16px')
    .padding('16px')
    .position('sticky')
    .top('0')
    .zIndex(40)
    .backdropFilter('blur(10px)')
    .borderBottom('1px solid transparent')
    .background(palette.background.surfaceAlt)
    .borderBottomColor(palette.border.subtle)
  styleBuilder
    .select('.topbar__logo', theme)
    .fontSize('22px')
    .fontWeight('700')
    .textDecoration('none')
    .justifySelf('start')
    .color(palette.text.accent)
  styleBuilder
    .select('.topbar__controls', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifySelf('end')
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
    .color(palette.text.subtle)
}

function registerTopBarSearchStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar__search', theme)
    .display('block')
    .width('100%')
    .justifySelf('center')
  styleBuilder
    .select('.topbar__search .site-search', theme)
    .width('100%')
    .maxWidth('none')
}

function registerTopBarToggleStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.topbar__toggle', theme)
    .background(palette.background.surface)
    .borderColor(palette.border.default)
    .color(palette.text.subtle)
    .display('none')
  styleBuilder
    .select('.template-doc--nav-drawer .topbar__toggle', theme)
    .display('grid')
  styleBuilder
    .select('.topbar__toggle:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

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

  styleBuilder
    .select('.topbar', theme)
    .media('max-width: 900px')
    .gridTemplateColumns('auto minmax(160px, 1fr) auto')
  styleBuilder
    .select('.topbar', theme)
    .media('max-width: 720px')
    .gap('10px')
  styleBuilder
    .select('.topbar__search .site-search', theme)
    .media('max-width: 720px')
    .width('min(100%, 240px)')
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

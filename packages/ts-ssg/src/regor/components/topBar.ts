import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

interface TopBarBrandContext {
  brandWordOne: string
  brandWordTwo: string
  brandSubtitle?: string
  brandSubtitleAlign?: 'start' | 'center' | 'end' | 'justify'
  brandHref: string
  brandIconSvg?: string
  brandIconSize?: string
  brandWordFontSize?: string
  brandSubtitleFontSize?: string
}

function resolveTopBarBrand(context: TsSsgContext): TopBarBrandContext {
  return {
    brandWordOne: context.site.logo.wordOne ?? 'Pure',
    brandWordTwo: context.site.logo.wordTwo ?? 'Stack',
    brandSubtitle: context.site.logo.subtitle,
    brandSubtitleAlign: context.site.logo.subtitleAlign,
    brandHref: context.site.logo.href ?? '/',
    brandIconSvg: context.site.logo.iconSvg,
    brandIconSize: context.site.logo.iconSize,
    brandWordFontSize: context.site.logo.wordFontSize,
    brandSubtitleFontSize: context.site.logo.subtitleFontSize,
  }
}

const topBarTemplate = html`<input
    class="doc-nav-toggle"
    id="doc-nav-toggle"
    type="checkbox"
    aria-hidden="true"
  />
  <header class="topbar">
    <SiteLogo
      class="topbar__logo"
      :word-one="brandWordOne"
      :word-two="brandWordTwo"
      :subtitle="brandSubtitle"
      :subtitle-align="brandSubtitleAlign"
      :href="brandHref"
      :icon-svg="brandIconSvg"
      :icon-size="brandIconSize"
      :word-font-size="brandWordFontSize"
      :subtitle-font-size="brandSubtitleFontSize"
    />
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
    .gridTemplateColumns('minmax(0, 1fr) minmax(220px, 420px) auto')
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
    .display('inline-flex')
    .justifySelf('start')
    .set('min-width', '0')
  styleBuilder
    .select('.topbar__logo .site-logo__link', theme)
    .padding('8px 12px')
    .set('max-width', '100%')
  styleBuilder
    .select('.topbar__logo .site-logo__glyph', theme)
    .width('30px')
    .height('30px')
  styleBuilder.select('.topbar__logo .site-logo__word', theme).fontSize('20px')
  styleBuilder
    .select('.topbar__logo .site-logo__subtitle', theme)
    .fontSize('8px')
  styleBuilder
    .select('.topbar__controls', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifySelf('end')
    .gap('10px')
    .set('min-width', '0')
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
    .set('min-width', '0')
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
    .gridTemplateColumns('minmax(0, 1fr) minmax(0, 1fr) auto')
  styleBuilder
    .select('.topbar', theme)
    .media('max-width: 720px')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gap('10px')
  styleBuilder
    .select('.topbar__search', theme)
    .media('max-width: 720px')
    .display('none')
  styleBuilder
    .select('.topbar__logo .site-logo__link', theme)
    .media('max-width: 720px')
    .width('100%')
    .padding('8px 10px')
    .gap('8px')
  styleBuilder
    .select('.topbar__logo .site-logo__stack', theme)
    .media('max-width: 720px')
    .set('min-width', '0')
  styleBuilder
    .select('.topbar__logo .site-logo__brand', theme)
    .media('max-width: 720px')
    .overflow('hidden')
    .set('text-overflow', 'ellipsis')
  styleBuilder
    .select('.topbar__logo .site-logo__glyph', theme)
    .media('max-width: 720px')
    .width('28px')
    .height('28px')
  styleBuilder
    .select('.topbar__logo .site-logo__word', theme)
    .media('max-width: 720px')
    .fontSize('clamp(14px, 4vw, 17px)')
  styleBuilder
    .select('.topbar__logo .site-logo__subtitle', theme)
    .media('max-width: 720px')
    .display('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__search', theme)
    .media('max-width: 720px')
    .display('block')
    .position('absolute')
    .top('calc(100% + 8px)')
    .left('16px')
    .right('16px')
    .zIndex('80')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar', theme)
    .media('max-width: 720px')
    .zIndex(90)
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__search .site-search', theme)
    .media('max-width: 720px')
    .width('min(560px, calc(100vw - 24px))')
    .margin('0 auto')
  styleBuilder
    .select(
      '.doc-nav-toggle:checked ~ .topbar .topbar__search .site-search__results',
      theme,
    )
    .media('max-width: 720px')
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .width('min(560px, calc(100vw - 24px))')
    .zIndex('120')
}

function createTopBarComponent() {
  return createComponent<TopBarBrandContext>(topBarTemplate, {
    context: (head) => resolveTopBarBrand(resolveTsSsgContext(head)),
  })
}

export function createTopBarComponents() {
  registerTopBarStyles()
  return { topBar: createTopBarComponent() }
}

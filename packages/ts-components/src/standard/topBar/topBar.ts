import type { TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface TopBar {
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

function resolveTopBar(context: TsSsgContext): TopBar {
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
    autocomplete="off"
    aria-hidden="true"
  />
  <header class="topbar">
    <SiteLogo
      class="topbar__logo"
      :wordOne="brandWordOne"
      :wordTwo="brandWordTwo"
      :subtitle="brandSubtitle"
      :subtitleAlign="brandSubtitleAlign"
      :href="brandHref"
      :iconSvg="brandIconSvg"
      :iconSize="brandIconSize"
      :wordFontSize="brandWordFontSize"
      :subtitleFontSize="brandSubtitleFontSize"
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

function defineTopBarComponent() {
  return defineComponent<TopBar>(topBarTemplate, {
    context: (head) => resolveTopBar(resolveTsSsgContext(head)),
  })
}

export function defineTopBarComponents() {
  return { topBar: defineTopBarComponent() }
}

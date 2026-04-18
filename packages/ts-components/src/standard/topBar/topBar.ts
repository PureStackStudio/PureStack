import type { TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface TopBar {
  brand: string
  brandLetterColors?: string
  brandSubtitleLetterColors?: string
  brandColors?: string[]
  brandLogoBackground?: number
  brandLogoForeground?: number
  brandSubtitle?: string
  brandHref: string
  brandIcon?: string
}

function resolveTopBar(context: TsSsgContext): TopBar {
  return {
    brand: context.site.logo.brand ?? 'Pure Stack',
    brandLetterColors: context.site.logo.letterColors,
    brandSubtitleLetterColors: context.site.logo.subtitleLetterColors,
    brandColors: context.site.logo.colors,
    brandLogoBackground: context.site.logo.logoBackground,
    brandLogoForeground: context.site.logo.logoForeground,
    brandSubtitle: context.site.logo.subtitle,
    brandHref: context.site.logo.href ?? '/',
    brandIcon: context.site.logo.icon,
  }
}

const topBarTemplate = html`<input
  class="doc-nav-toggle"
  id="doc-nav-toggle"
  type="checkbox"
  autocomplete="off"
  aria-hidden="true"/>
<header class="topbar">
  <SiteLogo
    :brand="brand"
    :letterColors="brandLetterColors"
    :subtitleLetterColors="brandSubtitleLetterColors"
    :colors="brandColors"
    :logoBackground="brandLogoBackground"
    :logoForeground="brandLogoForeground"
    :subtitle="brandSubtitle"
    :href="brandHref"
    :icon="brandIcon"/>
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

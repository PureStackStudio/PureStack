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
  brandSize?: string
  brandSizeSm?: string
  brandSizeMd?: string
  brandSizeLg?: string
  brandSizeXl?: string
  brandSubtitleSize?: string
  brandSubtitleSizeSm?: string
  brandSubtitleSizeMd?: string
  brandSubtitleSizeLg?: string
  brandSubtitleSizeXl?: string
  brandIconSize?: string
  brandIconSizeSm?: string
  brandIconSizeMd?: string
  brandIconSizeLg?: string
  brandIconSizeXl?: string
  brandSubtitleInset?: string
  brandSubtitleInsetSm?: string
  brandSubtitleInsetMd?: string
  brandSubtitleInsetLg?: string
  brandSubtitleInsetXl?: string
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
    brandSize: context.site.logo.brandSize,
    brandSizeSm: context.site.logo.brandSizeSm,
    brandSizeMd: context.site.logo.brandSizeMd,
    brandSizeLg: context.site.logo.brandSizeLg,
    brandSizeXl: context.site.logo.brandSizeXl,
    brandSubtitleSize: context.site.logo.subtitleSize,
    brandSubtitleSizeSm: context.site.logo.subtitleSizeSm,
    brandSubtitleSizeMd: context.site.logo.subtitleSizeMd,
    brandSubtitleSizeLg: context.site.logo.subtitleSizeLg,
    brandSubtitleSizeXl: context.site.logo.subtitleSizeXl,
    brandIconSize: context.site.logo.iconSize,
    brandIconSizeSm: context.site.logo.iconSizeSm,
    brandIconSizeMd: context.site.logo.iconSizeMd,
    brandIconSizeLg: context.site.logo.iconSizeLg,
    brandIconSizeXl: context.site.logo.iconSizeXl,
    brandSubtitleInset: context.site.logo.subtitleInset,
    brandSubtitleInsetSm: context.site.logo.subtitleInsetSm,
    brandSubtitleInsetMd: context.site.logo.subtitleInsetMd,
    brandSubtitleInsetLg: context.site.logo.subtitleInsetLg,
    brandSubtitleInsetXl: context.site.logo.subtitleInsetXl,
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
  <Flex align="center">
    <SiteLogo
      class="flex-none"
      :brand="brand"
      :letterColors="brandLetterColors"
      :subtitleLetterColors="brandSubtitleLetterColors"
      :colors="brandColors"
      :logoBackground="brandLogoBackground"
      :logoForeground="brandLogoForeground"
      :brandSize="brandSize"
      :brandSizeSm="brandSizeSm"
      :brandSizeMd="brandSizeMd"
      :brandSizeLg="brandSizeLg"
      :brandSizeXl="brandSizeXl"
      :subtitleSize="brandSubtitleSize"
      :subtitleSizeSm="brandSubtitleSizeSm"
      :subtitleSizeMd="brandSubtitleSizeMd"
      :subtitleSizeLg="brandSubtitleSizeLg"
      :subtitleSizeXl="brandSubtitleSizeXl"
      :iconSize="brandIconSize"
      :iconSizeSm="brandIconSizeSm"
      :iconSizeMd="brandIconSizeMd"
      :iconSizeLg="brandIconSizeLg"
      :iconSizeXl="brandIconSizeXl"
      :subtitleInset="brandSubtitleInset"
      :subtitleInsetSm="brandSubtitleInsetSm"
      :subtitleInsetMd="brandSubtitleInsetMd"
      :subtitleInsetLg="brandSubtitleInsetLg"
      :subtitleInsetXl="brandSubtitleInsetXl"
      :subtitle="brandSubtitle"
      :href="brandHref"
      :icon="brandIcon"/>
    <site-search class="topbar__search flex-auto"></site-search>
    <Flex class="topbar__controls flex-none" align="center" justify="end">
      <theme-switcher></theme-switcher>
      <label
        class="topbar__icon topbar__toggle"
        for="doc-nav-toggle"
        role="button"
        aria-label="Toggle navigation"
      ></label>
    </Flex>
  </Flex>
</header>`

function defineTopBarComponent() {
  return defineComponent<TopBar>(topBarTemplate, {
    context: (head) => resolveTopBar(resolveTsSsgContext(head)),
  })
}

export function defineTopBarComponents() {
  return { topBar: defineTopBarComponent() }
}

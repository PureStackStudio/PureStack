import type { LogoConfig, TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface TopBar {
  siteLogo: LogoConfig
}

function resolveTopBar(context: TsSsgContext): TopBar {
  return {
    siteLogo: context.site.logo,
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
      :brand="siteLogo.brand"
      :letterColors="siteLogo.letterColors"
      :subtitleLetterColors="siteLogo.subtitleLetterColors"
      :colors="siteLogo.colors"
      :logoBackground="siteLogo.logoBackground"
      :logoForeground="siteLogo.logoForeground"
      :brandSize="siteLogo.brandSize"
      :brandSizeSm="siteLogo.brandSizeSm"
      :brandSizeMd="siteLogo.brandSizeMd"
      :brandSizeLg="siteLogo.brandSizeLg"
      :brandSizeXl="siteLogo.brandSizeXl"
      :subtitleSize="siteLogo.subtitleSize"
      :subtitleSizeSm="siteLogo.subtitleSizeSm"
      :subtitleSizeMd="siteLogo.subtitleSizeMd"
      :subtitleSizeLg="siteLogo.subtitleSizeLg"
      :subtitleSizeXl="siteLogo.subtitleSizeXl"
      :iconSize="siteLogo.iconSize"
      :iconSizeSm="siteLogo.iconSizeSm"
      :iconSizeMd="siteLogo.iconSizeMd"
      :iconSizeLg="siteLogo.iconSizeLg"
      :iconSizeXl="siteLogo.iconSizeXl"
      :subtitleInset="siteLogo.subtitleInset"
      :subtitleInsetSm="siteLogo.subtitleInsetSm"
      :subtitleInsetMd="siteLogo.subtitleInsetMd"
      :subtitleInsetLg="siteLogo.subtitleInsetLg"
      :subtitleInsetXl="siteLogo.subtitleInsetXl"
      :subtitle="siteLogo.subtitle"
      :href="siteLogo.href"
      :icon="siteLogo.icon"/>
    <Searchbox class="topbar__search flex-auto"></Searchbox>
    <Flex class="topbar__controls flex-none" align="center" justify="end">
      <ThemeSwitcher></ThemeSwitcher>
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

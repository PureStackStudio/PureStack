import type { TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface TopBar {
  brandWordOne: string
  brandWordTwo: string
  brandSubtitle?: string
  brandHref: string
  brandIcon?: string
}

function resolveTopBar(context: TsSsgContext): TopBar {
  return {
    brandWordOne: context.site.logo.wordOne ?? 'Pure',
    brandWordTwo: context.site.logo.wordTwo ?? 'Stack',
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
    :wordOne="brandWordOne"
    :wordTwo="brandWordTwo"
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

import type { LogoConfig, TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
} from 'regor'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export interface TopBar {
  siteLogo: LogoConfig
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  signInAvatarSrc?: RefOrValue<string>
  signInAvatarAlt?: RefOrValue<string>
  classes?: ComputedRef<string>
  searchEnabled?: boolean
  signInEnabled?: boolean
}

const DEFAULT_TOP_BAR_VARIANT: ComponentVariant = 'surfaceAlt'
const DEFAULT_TOP_BAR_VARIANT_MODE: ComponentVariantMode = 'stateless'

function resolveTopBar(context: TsSsgContext, props: TopBar): TopBar {
  return {
    ...props,
    siteLogo: context.site.logo,
    searchEnabled: context.site.pagefind?.enabled === true,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_TOP_BAR_VARIANT,
        defaultVariantMode: DEFAULT_TOP_BAR_VARIANT_MODE,
      }),
    ),
  }
}

const topBarTemplate = html`<input
  class="doc-nav-toggle"
  id="doc-nav-toggle"
  type="checkbox"
  autocomplete="off"
  aria-hidden="true"/>
<header class="topbar" :class="classes">
  <Flex align="center">
    <SiteLogo
      class="flex-none tone--neutral"
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
    <SearchBox
      r-if="searchEnabled"
      class="topbar__search flex-auto rounded-md tone-text-surface"
      variant="none"/>
    <Flex class="topbar__controls flex-none" align="center" justify="end">
      <ThemeSwitcher/>
      <SignIn
        r-if="signInEnabled"
        class="topbar__account"
        :avatarSrc="signInAvatarSrc"
        :avatarAlt="signInAvatarAlt"/>
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
    props: [
      'tone',
      'variant',
      'signInAvatarSrc',
      'signInAvatarAlt',
      'signInEnabled',
      'searchEnabled',
    ],
    context: (head) => resolveTopBar(resolveTsSsgContext(head), head.props),
  })
}

export function defineTopBarComponents() {
  return { topBar: defineTopBarComponent() }
}

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
    <SiteLogo class="flex-none" :config="siteLogo"/>
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

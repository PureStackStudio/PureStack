import type { SiteLogoConfig, TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export interface TopBar {
  siteLogo: SiteLogoConfig
  logoComponent?: RefOrValue<string>
  resolvedLogoComponent?: ComputedRef<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  signInSignedIn?: RefOrValue<boolean>
  signInAvatarSrc?: RefOrValue<string>
  signInAvatarAlt?: RefOrValue<string>
  classes?: ComputedRef<string>
  search?: RefOrValue<boolean>
  searchEnabled?: ComputedRef<boolean>
  signInEnabled?: RefOrValue<boolean>
  resolvedSignInEnabled?: ComputedRef<boolean>
}

const DEFAULT_TOP_BAR_VARIANT: ComponentVariant = 'surfaceAlt'
const DEFAULT_TOP_BAR_VARIANT_MODE: ComponentVariantMode = 'stateless'

function resolveTopBar(context: TsSsgContext, props: TopBar): TopBar {
  return {
    ...props,
    siteLogo: context.site.logo,
    resolvedLogoComponent: computed(
      () =>
        unref(props.logoComponent) ?? context.site.logo.component ?? 'SiteLogo',
    ),
    searchEnabled: computed(
      () => unref(props.search) ?? context.site.pagefind?.enabled === true,
    ),
    resolvedSignInEnabled: computed(
      () => unref(props.signInEnabled) ?? context.site.auth?.enabled === true,
    ),
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
<header class="topbar" :class="classes" r-inherit>
  <Flex align="center">
    <div :is="resolvedLogoComponent" class="flex-none" :config="siteLogo"></div>
    <SearchBox
      r-if="searchEnabled"
      class="topbar__search flex-auto rounded-md tone-text-surface"
      variant="none"/>
    <Flex class="topbar__controls flex-none" align="center" justify="end">
      <div class="topbar__actions">
        <ThemeToggle/>
        <slot name="actions"></slot>
        <SignIn
          r-if="resolvedSignInEnabled"
          class="topbar__account"
          :enabled="resolvedSignInEnabled"
          :signedIn="signInSignedIn"
          :avatarSrc="signInAvatarSrc"
          :avatarAlt="signInAvatarAlt"/>
        <label
          class="topbar__icon topbar__toggle"
          for="doc-nav-toggle"
          role="button"
          aria-label="Toggle navigation"
        ></label>
      </div>
    </Flex>
  </Flex>
</header>`

function defineTopBarComponent() {
  return defineComponent<TopBar>(topBarTemplate, {
    props: [
      'class',
      'logoComponent',
      'tone',
      'variant',
      'signInSignedIn',
      'signInAvatarSrc',
      'signInAvatarAlt',
      'signInEnabled',
      'search',
    ],
    context: (head) => resolveTopBar(resolveTsSsgContext(head), head.props),
  })
}

export function defineTopBarComponents() {
  return { topBar: defineTopBarComponent() }
}

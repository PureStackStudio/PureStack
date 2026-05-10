import { tryResolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'

export interface SignIn {
  avatarSrc?: RefOrValue<string>
  avatarAlt?: RefOrValue<string>
  icon?: RefOrValue<string>
  accountIcon?: RefOrValue<string>
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  authEnabled?: boolean
  signUpEnabled?: boolean
  resolvedIcon?: ComputedRef<string>
  resolvedAccountIcon?: ComputedRef<string>
  resolvedLabel?: ComputedRef<string>
  resolvedAvatarAlt?: ComputedRef<string>
}

const DEFAULT_SIGN_IN_ICON = 'lucide:log-in'
const DEFAULT_ACCOUNT_ICON = 'tabler:user-filled'
const DEFAULT_SIGN_IN_LABEL = 'Account'

const signInTemplate = html`<details r-if="authEnabled" class="sign-in position-relative" data-menu-runtime>
  <summary
    class="sign-in__trigger topbar__icon rounded-pill cursor-pointer overflow-hidden"
    aria-label="Account menu"
  >
    <span class="sign-in__signed-out-view" aria-hidden="true">
      <Icon :name="resolvedIcon"/>
    </span>
    <span class="sign-in__signed-in-view" aria-hidden="true">
      <slot name="avatar">
        <img
          r-if="avatarSrc"
          class="sign-in__avatar w-full h-full rounded-pill"
          :src="avatarSrc"
          :alt="resolvedAvatarAlt"/>
        <Icon r-else :name="resolvedAccountIcon"/>
      </slot>
    </span>
    <span class="hidden">{{ resolvedLabel }}</span>
  </summary>
  <Panel
    class="sign-in__panel mt-2 p-1"
    :tone="tone || 'neutral'"
    :variant="variant || 'surface'"
    :variantMode="variantMode || 'stateless'"
  >
    <slot>
      <Flex
        container="nav"
        direction="column"
        align="stretch"
        class="gap-1"
        aria-label="Account"
      >
        <BtnLink
          class="sign-in__signed-out-action justify-start w-full text-start"
          href="/signin/"
          :tone="tone || 'neutral'"
          variant="subtleBtn"
          icon="lucide:log-in"
        >
          Sign in
        </BtnLink>
        <BtnLink
          r-if="signUpEnabled"
          class="sign-in__signed-out-action justify-start w-full text-start"
          href="/signup/"
          :tone="tone || 'neutral'"
          variant="subtleBtn"
          icon="lucide:user-plus"
        >
          Sign up
        </BtnLink>
        <BtnLink
          class="sign-in__signed-in-action justify-start w-full text-start"
          href="/account/"
          :tone="tone || 'neutral'"
          variant="subtleBtn"
          icon="lucide:user-round"
        >
          Account
        </BtnLink>
        <BtnLink
          class="sign-in__signed-in-action justify-start w-full text-start"
          href="/settings/"
          :tone="tone || 'neutral'"
          variant="subtleBtn"
          icon="lucide:settings"
        >
          Settings
        </BtnLink>
        <BtnLink
          class="sign-in__signed-in-action justify-start w-full text-start"
          href="/signout/"
          :tone="tone || 'neutral'"
          variant="subtleBtn"
          icon="lucide:log-out"
        >
          Sign out
        </BtnLink>
      </Flex>
    </slot>
  </Panel>
</details>`

function defineSignInComponent() {
  return defineComponent<SignIn>(signInTemplate, {
    props: [
      'avatarSrc',
      'avatarAlt',
      'icon',
      'accountIcon',
      'label',
      'tone',
      'variant',
      'variantMode',
    ],
    context: (head) => resolveSignIn(head.props, head),
  })
}

export function defineSignInComponents() {
  return { signIn: defineSignInComponent() }
}

function resolveSignIn(props: SignIn, head: unknown): SignIn {
  const auth = tryResolveTsSsgContext(head)?.site?.auth
  return {
    ...props,
    authEnabled: auth?.enabled === true,
    signUpEnabled: auth?.signUp !== false,
    resolvedIcon: computed(() => unref(props.icon) || DEFAULT_SIGN_IN_ICON),
    resolvedAccountIcon: computed(
      () => unref(props.accountIcon) || DEFAULT_ACCOUNT_ICON,
    ),
    resolvedLabel: computed(() => unref(props.label) || DEFAULT_SIGN_IN_LABEL),
    resolvedAvatarAlt: computed(() => unref(props.avatarAlt) || ''),
  }
}

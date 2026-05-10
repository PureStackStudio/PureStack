import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface SignIn {
  avatarSrc?: RefOrValue<string>
  avatarAlt?: RefOrValue<string>
  icon?: RefOrValue<string>
  accountIcon?: RefOrValue<string>
  label?: RefOrValue<string>
  resolvedIcon?: ComputedRef<string>
  resolvedAccountIcon?: ComputedRef<string>
  resolvedLabel?: ComputedRef<string>
  resolvedAvatarAlt?: ComputedRef<string>
}

const DEFAULT_SIGN_IN_ICON = 'lucide:log-in'
const DEFAULT_ACCOUNT_ICON = 'tabler:user-filled'
const DEFAULT_SIGN_IN_LABEL = 'Account'

const signInTemplate = html`<details class="sign-in" data-menu-runtime>
  <summary class="sign-in__trigger topbar__icon" aria-label="Account menu">
    <span class="sign-in__signed-out-view" aria-hidden="true">
      <Icon class="sign-in__icon" :name="resolvedIcon"/>
    </span>
    <span class="sign-in__signed-in-view" aria-hidden="true">
      <slot name="avatar">
        <img
          r-if="avatarSrc"
          class="sign-in__avatar"
          :src="avatarSrc"
          :alt="resolvedAvatarAlt"/>
        <Icon
          r-else
          class="sign-in__icon"
          :name="resolvedAccountIcon"/>
      </slot>
    </span>
    <span class="sign-in__trigger-label">{{ resolvedLabel }}</span>
  </summary>
  <div
    class="sign-in__panel tone-fill-surface tone-border-surface tone-text-surface tone--neutral"
  >
    <slot>
      <nav class="sign-in__nav" aria-label="Account">
        <BtnLink
          class="sign-in__item sign-in__signed-out-action justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/signin/"
          variant="none"
          icon="lucide:log-in"
        >
          Sign in
        </BtnLink>
        <BtnLink
          class="sign-in__item sign-in__signed-out-action justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/signup/"
          variant="none"
          icon="lucide:user-plus"
        >
          Sign up
        </BtnLink>
        <BtnLink
          class="sign-in__item sign-in__signed-in-action justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/account/"
          variant="none"
          icon="lucide:user-round"
        >
          Account
        </BtnLink>
        <BtnLink
          class="sign-in__item sign-in__signed-in-action justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/settings/"
          variant="none"
          icon="lucide:settings"
        >
          Settings
        </BtnLink>
        <BtnLink
          class="sign-in__item sign-in__signed-in-action justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/signout/"
          variant="none"
          icon="lucide:log-out"
        >
          Sign out
        </BtnLink>
      </nav>
    </slot>
  </div>
</details>`

function defineSignInComponent() {
  return defineComponent<SignIn>(signInTemplate, {
    props: ['avatarSrc', 'avatarAlt', 'icon', 'accountIcon', 'label'],
    context: (head) => resolveSignIn(head.props),
  })
}

export function defineSignInComponents() {
  return { signIn: defineSignInComponent() }
}

function resolveSignIn(props: SignIn): SignIn {
  return {
    ...props,
    resolvedIcon: computed(() => unref(props.icon) || DEFAULT_SIGN_IN_ICON),
    resolvedAccountIcon: computed(
      () => unref(props.accountIcon) || DEFAULT_ACCOUNT_ICON,
    ),
    resolvedLabel: computed(() => unref(props.label) || DEFAULT_SIGN_IN_LABEL),
    resolvedAvatarAlt: computed(() => unref(props.avatarAlt) || ''),
  }
}

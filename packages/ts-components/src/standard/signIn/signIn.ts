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
  label?: RefOrValue<string>
  resolvedIcon?: ComputedRef<string>
  resolvedLabel?: ComputedRef<string>
  resolvedAvatarAlt?: ComputedRef<string>
}

const DEFAULT_SIGN_IN_ICON = 'tabler:user-filled'
const DEFAULT_SIGN_IN_LABEL = 'Account'

const signInTemplate = html`<details class="sign-in">
  <summary class="sign-in__trigger topbar__icon" aria-label="Account menu">
    <slot name="avatar">
      <img
        r-if="avatarSrc"
        class="sign-in__avatar"
        :src="avatarSrc"
        :alt="resolvedAvatarAlt"/>
      <Icon
        r-else
        class="sign-in__icon"
        :name="resolvedIcon"
        aria-hidden="true"/>
    </slot>
    <span class="sign-in__trigger-label">{{ resolvedLabel }}</span>
  </summary>
  <div
    class="sign-in__panel tone-fill-surface tone-border-surface tone-text-surface tone--neutral"
  >
    <slot>
      <nav class="sign-in__nav" aria-label="Account">
        <BtnLink
          class="sign-in__item justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/account/"
          variant="none"
          icon="lucide:user-round"
        >
          Account
        </BtnLink>
        <BtnLink
          class="sign-in__item justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/account/settings/"
          variant="none"
          icon="lucide:user-cog"
        >
          Settings
        </BtnLink>
        <BtnLink
          class="sign-in__item justify-start w-full rounded-sm tone-fill-surface-hover tone-fill-surface-active"
          href="/sign-out/"
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
    props: ['avatarSrc', 'avatarAlt', 'icon', 'label'],
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
    resolvedLabel: computed(() => unref(props.label) || DEFAULT_SIGN_IN_LABEL),
    resolvedAvatarAlt: computed(() => unref(props.avatarAlt) || ''),
  }
}

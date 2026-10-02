import {
  type NavItem,
  type TsSsgContext,
  tryResolveTsSsgContext,
} from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import { urlNormalizer } from '@purestack/ts-util'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  type SRef,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export interface NavMenu {
  items?: NavItem[] | SRef<NavItem[]>
  currentUrl?: RefOrValue<string>
  navItems?: ComputedRef<NavItemState[]>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  signInAvatarSrc?: RefOrValue<string>
  signInAvatarAlt?: RefOrValue<string>
  classes?: ComputedRef<string>
  searchEnabled?: boolean
  navRoot?: string
}

export interface NavList {
  items?: NavItemState[]
  tone?: SemanticTone
}

export interface NavItemState extends NavItem {
  isActive: boolean
  isOpen: boolean
  stateKey: string
  linkClass?: string[]
  ariaCurrent?: string
}

const navItemTemplate = html`<li class="nav__item">
  <details
    r-if="item.children && item.children.length > 0"
    class="nav__group"
    :open="item.isOpen"
    :data-nav-group-key="item.stateKey"
    :data-nav-default-open="item.isOpen ? 'true' : undefined"
  >
    <summary class="nav__summary w-full">
      <BtnLink
        variant="none"
        :icon="item.icon"
        :tone="item.tone"
        :class="item.linkClass"
        :aria-current="item.ariaCurrent"
      >
        {{ item.title }}
      </BtnLink>
      <Icon
        class="nav__chevron fs-xxs"
        name="tabler:chevron-down"
        aria-hidden="true"/>
    </summary>
    <NavList :items="item.children" :tone="item.tone"></NavList>
  </details>
  <BtnLink
    r-else
    variant="none"
    :icon="item.icon"
    :href="item.url"
    :tone="item.tone"
    :class="item.linkClass"
    :aria-current="item.ariaCurrent"
  >
    {{ item.title }}
  </BtnLink>
</li>`

const navListTemplate = html`<ul class="nav__list">
  <NavItem r-for="item in items"/>
</ul>`

const DEFAULT_NAV_MENU_TONE: SemanticTone = 'neutral'
const DEFAULT_NAV_MENU_VARIANT: ComponentVariant = 'flat'
const DEFAULT_NAV_MENU_VARIANT_MODE: ComponentVariantMode = 'stateless'

const navMenuTemplate = html`<nav
  class="nav__menu"
  :class="classes"
  :data-nav-root="navRoot"
  aria-label="Site navigation"
>
  <div class="nav__header-row">
    <div class="nav__header">Navigation</div>
    <SignIn
      class="nav__account"
      :avatarSrc="signInAvatarSrc"
      :avatarAlt="signInAvatarAlt"/>
    <button
      class="nav__panel-toggle tone-fill-surface-all tone-text-surface-all tone-border-surface-all"
      type="button"
      title="Navigation"
      aria-label="Toggle navigation panel"
      data-nav-menu-toggle
    >
      <span class="nav__panel-toggle-icon" aria-hidden="true">
        <Icon name="iconoir:pin"/>
      </span>
      <span class="nav__panel-toggle-label">navigation</span>
    </button>
    <button
      class="nav__collapse-toggle tone-text-surface-all tone-fill-surface-hover tone-fill-surface-active tone-border-surface-hover tone-border-surface-active opacity-25 opacity-1-hover"
      type="button"
      title="Collapse navigation"
      aria-label="Collapse navigation"
      data-nav-menu-collapse
    >
      <span
        class="nav__collapse-toggle-icon nav__collapse-toggle-icon--collapse p-1"
        aria-hidden="true"
      >
        <Icon name="iconoir:pin-slash"/>
      </span>
      <span
        class="nav__collapse-toggle-icon nav__collapse-toggle-icon--open p-1"
        aria-hidden="true"
      >
        <Icon name="iconoir:pin"/>
      </span>
    </button>
  </div>
  <NavList :items="navItems"></NavList>
  <SearchBox r-if="searchEnabled" class="nav__search mt-1"/>
  <script>
    window.tsSsgNavMenu?.hydrate(document.currentScript?.parentElement)
  </script>
</nav>`

function resolveNavItems(context?: TsSsgContext): NavItem[] {
  const items = context?.navigation?.items ?? []
  if (items.length > 0) return items
  return context?.navigation?.global ?? []
}

function resolveCurrentPath(
  currentUrl: string | undefined,
  context?: TsSsgContext,
): string | undefined {
  const fromProp = urlNormalizer.normalizeInternalPath(currentUrl)
  if (fromProp) return fromProp
  const fromContext = urlNormalizer.normalizeInternalPath(
    context?.pageInfo?.urlPath,
  )
  if (fromContext) return fromContext
  if (typeof window !== 'undefined' && window.location?.pathname) {
    return urlNormalizer.normalizeInternalPath(window.location.pathname)
  }
  return undefined
}

function buildNavState(
  items: NavItem[],
  currentPath: string | undefined,
  parentKey = '',
): NavItemState[] {
  return unref(items).map((item) => {
    const stateKey = resolveNavItemStateKey(item, parentKey)
    const childStates = item.children
      ? buildNavState(item.children, currentPath, stateKey)
      : []
    const itemPath = urlNormalizer.normalizeInternalPath(item.url)
    const isActive = Boolean(
      itemPath && currentPath && itemPath === currentPath,
    )
    const hasActiveChild = childStates.some(
      (child) => child.isActive || child.isOpen,
    )
    return {
      ...item,
      tone: isActive ? 'accent' : 'neutral',
      ...(childStates.length > 0 ? { children: childStates } : {}),
      isActive,
      isOpen: isActive || hasActiveChild,
      stateKey,
      linkClass: [
        'fs-body ws-normal justify-start w-full tone-fill-surface-hover tone-fill-surface-active rounded-sm',
        isActive ? 'active tone-text-surface-active' : 'tone-text',
      ],
      ariaCurrent: isActive ? 'page' : undefined,
    }
  })
}

function resolveNavItemStateKey(item: NavItem, parentKey: string) {
  const segment = normalizeNavStateKeyPart(item.id ?? item.url ?? item.title)
  return parentKey ? `${parentKey}/${segment}` : segment
}

function normalizeNavStateKeyPart(value: string) {
  const normalized = value
    .trim()
    .replaceAll('\\', '/')
    .replace(/^\/+|\/+$/g, '')
  return normalized || 'item'
}

function defineNavItemComponent() {
  return defineComponent<{ item: NavItemState }>(navItemTemplate, {})
}

function defineNavListComponent() {
  return defineComponent<NavList>(navListTemplate, {
    props: ['items', 'tone'],
    context: (head) => ({
      ...head.props,
      items: head.props.items,
      tone: head.props.tone,
    }),
  })
}

function defineNavMenuComponent() {
  return defineComponent<NavMenu>(navMenuTemplate, {
    props: [
      'items',
      'currentUrl',
      'tone',
      'variant',
      'variantMode',
      'signInAvatarSrc',
      'signInAvatarAlt',
    ],
    context: (head) => {
      const context = tryResolveTsSsgContext(head)
      const props = head.props
      return {
        ...props,
        classes: computed(() =>
          resolveComponentClasses(
            { ...props, tone: unref(props.tone) || DEFAULT_NAV_MENU_TONE },
            {
              defaultVariant: DEFAULT_NAV_MENU_VARIANT,
              defaultVariantMode: DEFAULT_NAV_MENU_VARIANT_MODE,
            },
          ),
        ),
        searchEnabled: context?.site.pagefind?.enabled === true,
        navRoot: normalizeNavStateKeyPart(context?.navigation?.root ?? ''),
        navItems: computed(() =>
          buildNavState(
            unref(props.items) ?? resolveNavItems(context),
            resolveCurrentPath(unref(props.currentUrl), context),
          ),
        ),
      }
    },
  })
}

export function defineNavigationComponents() {
  const navItem = defineNavItemComponent()
  const navList = defineNavListComponent()
  const navMenu = defineNavMenuComponent()
  return {
    navItem,
    navList,
    navMenu,
  }
}

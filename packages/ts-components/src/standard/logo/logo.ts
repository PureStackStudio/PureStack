import {
  type LogoConfig,
  type TsSsgContext,
  tryResolveTsSsgContext,
} from '@purestack/ts-common'
import {
  getSemanticToneClass,
  normalizeThemeVariableReference,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  flatten,
  html,
  type RefOrValue,
  unref,
} from 'regor'

type ReactiveLogoOptions = {
  [K in keyof LogoConfig]?: RefOrValue<LogoConfig[K]>
}

export interface SiteLogo extends ReactiveLogoOptions {
  config?: RefOrValue<Partial<LogoConfig>>
  options?: ComputedRef<LogoConfig>
  classes?: ComputedRef<string>
  logoStyle?: ComputedRef<Record<string, string>>
  resolvedHref?: ComputedRef<string | undefined>
  resolvedImage?: ComputedRef<string | undefined>
  resolvedDarkImage?: ComputedRef<string | undefined>
  accessibleName?: ComputedRef<string>
  initials?: ComputedRef<string>
}

const logoTemplate = html`<a class="site-logo" :class="classes" :style="logoStyle"
  :href="resolvedHref" :role="resolvedHref ? undefined : 'img'" :aria-label="accessibleName">
  <span class="site-logo__mark" r-if="options.layout !== 'wordmark'" aria-hidden="true">
    <slot name="mark">
      <span class="site-logo__images" r-if="resolvedImage">
        <img class="site-logo__image" :class="{ 'site-logo__image--light': resolvedDarkImage }" :src="resolvedImage" alt="" decoding="async"/>
        <img class="site-logo__image site-logo__image--dark" r-if="resolvedDarkImage" :src="resolvedDarkImage" alt="" decoding="async"/>
      </span>
      <Icon r-else-if="options.icon" :name="options.icon"/>
      <span class="site-logo__monogram" r-else>{{ initials }}</span>
    </slot>
  </span>
  <span class="site-logo__copy" r-if="options.layout !== 'mark'" aria-hidden="true">
    <span class="site-logo__name"><span class="site-logo__brand">{{ options.brand }}</span><span class="site-logo__suffix" r-if="options.suffix">{{ options.suffix }}</span></span>
    <span class="site-logo__subtitle" r-if="options.subtitle">{{ options.subtitle }}</span>
  </span>
</a>`

const logoProps = [
  'brand',
  'subtitle',
  'suffix',
  'href',
  'ariaLabel',
  'icon',
  'imageSrc',
  'imageSrcDark',
  'monogram',
  'layout',
  'size',
  'appearance',
  'markStyle',
  'wordmarkStyle',
  'shape',
  'tone',
  'brandColor',
  'accentColor',
  'markBackground',
  'markColor',
  'brandSize',
  'subtitleSize',
  'markSize',
  'gap',
] as const satisfies readonly (keyof LogoConfig)[]

function resolveSiteLogo(props: SiteLogo, context?: TsSsgContext): SiteLogo {
  const options = computed<LogoConfig>(() => {
    const config = flatten(unref(props.config) ?? {}) as Partial<LogoConfig>
    const read = <K extends keyof LogoConfig>(
      key: K,
    ): LogoConfig[K] | undefined => {
      const value = unref(props[key]) as LogoConfig[K] | undefined
      return value === undefined ? config[key] : value
    }
    return {
      brand: read('brand') ?? '',
      subtitle: read('subtitle'),
      suffix: read('suffix'),
      href: read('href'),
      ariaLabel: read('ariaLabel'),
      icon: read('icon'),
      imageSrc: read('imageSrc'),
      imageSrcDark: read('imageSrcDark'),
      monogram: read('monogram'),
      layout: read('layout') ?? 'horizontal',
      size: read('size') ?? 'md',
      appearance: read('appearance') ?? 'plain',
      markStyle: read('markStyle') ?? 'plain',
      wordmarkStyle: read('wordmarkStyle') ?? 'plain',
      shape: read('shape') ?? 'rounded',
      tone: read('tone') ?? 'accent',
      brandColor: read('brandColor'),
      accentColor: read('accentColor'),
      markBackground: read('markBackground'),
      markColor: read('markColor'),
      brandSize: read('brandSize'),
      subtitleSize: read('subtitleSize'),
      markSize: read('markSize'),
      gap: read('gap'),
    }
  })
  const resolveUrl = (value: string | undefined) =>
    value ? (context?.resolvePublicHref(value) ?? value) : undefined
  return {
    options,
    classes: computed(() => {
      const logo = options()
      return [
        `site-logo--${logo.layout}`,
        `site-logo--${logo.size}`,
        `site-logo--${logo.appearance}`,
        `site-logo--mark-${logo.markStyle}`,
        `site-logo--wordmark-${logo.wordmarkStyle}`,
        `site-logo--${logo.shape}`,
        getSemanticToneClass(logo.tone),
      ].join(' ')
    }),
    logoStyle: computed(() => {
      const logo = options()
      const style: Record<string, string> = {}
      const colors = {
        '--ps-logo-brand-color': logo.brandColor,
        '--ps-logo-accent-color': logo.accentColor,
        '--ps-logo-mark-background': logo.markBackground,
        '--ps-logo-mark-color': logo.markColor,
      }
      for (const [key, value] of Object.entries(colors)) {
        if (value?.trim())
          style[key] = normalizeThemeVariableReference(value.trim())
      }
      const lengths = {
        '--ps-logo-brand-size': logo.brandSize,
        '--ps-logo-subtitle-size': logo.subtitleSize,
        '--ps-logo-mark-size': logo.markSize,
        '--ps-logo-gap': logo.gap,
      }
      for (const [key, value] of Object.entries(lengths)) {
        if (value?.trim()) style[key] = value.trim()
      }
      return style
    }),
    resolvedHref: computed(() => {
      const href = options().href
      return href === null || href === '' ? undefined : resolveUrl(href ?? '/')
    }),
    resolvedImage: computed(() => resolveUrl(options().imageSrc)),
    resolvedDarkImage: computed(() => resolveUrl(options().imageSrcDark)),
    accessibleName: computed(
      () =>
        options().ariaLabel?.trim() ||
        options().brand.trim() ||
        options().monogram?.trim() ||
        'Home',
    ),
    initials: computed(() => {
      const logo = options()
      if (logo.monogram) return logo.monogram
      return logo.brand
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => Array.from(word)[0] ?? '')
        .join('')
        .toLocaleUpperCase()
    }),
  }
}

export function defineLogoComponents() {
  return {
    siteLogo: defineComponent<SiteLogo>(logoTemplate, {
      props: ['config', ...logoProps],
      context: (head) =>
        resolveSiteLogo(head.props, tryResolveTsSsgContext(head)),
    }),
  }
}

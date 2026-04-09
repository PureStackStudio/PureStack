import { urlNormalizer } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export type HeroActionVariant = 'primary' | 'minimal'

const heroTemplate = html`<section class="hero">
  <div class="hero__inner">
    <div class="hero__content">
      <p class="hero__eyebrow"><slot name="eyebrow"></slot></p>
      <h1 class="hero__title"><slot name="title"></slot></h1>
      <p class="hero__tagline"><slot name="tagline"></slot></p>
      <div class="hero__actions"><slot name="actions"></slot></div>
    </div>
    <div class="hero__media"><slot name="media"></slot></div>
  </div>
</section>`

const heroActionTemplate = html`<a
  class="hero__action"
  :class="className"
  :href="href"
  r-if="href"
  :data-icon="icon"
  :target="target"
  :rel="rel"
>
  <slot></slot>
</a>`

const heroMediaTemplate = html`<div class="hero__logo-frame" r-if="src">
  <img class="hero__logo" :src="src" :alt="alt" />
</div>`

export interface HeroAction {
  href?: string
  variant?: HeroActionVariant
  icon?: string
  target?: string
  rel?: string
  className?: string
}

export interface HeroMedia {
  src?: string
  alt?: string
}

function createHeroBannerComponent() {
  return defineComponent<Record<string, never>>(heroTemplate, {})
}

function createHeroActionComponent() {
  return defineComponent<HeroAction>(heroActionTemplate, {
    props: ['href', 'variant', 'icon', 'target', 'rel'],
    context: (head) => resolveHeroAction(head.props),
  })
}

function createHeroMediaComponent() {
  return defineComponent<HeroMedia>(heroMediaTemplate, {
    props: ['src', 'alt'],
    context: (head) => resolveHeroMedia(head.props),
  })
}

export function createHeroComponents() {
  return {
    heroBanner: createHeroBannerComponent(),
    heroAction: createHeroActionComponent(),
    heroMedia: createHeroMediaComponent(),
  }
}

function resolveHeroAction(props: HeroAction): HeroAction {
  const normalizedVariant = props.variant?.toLowerCase()
  const className =
    normalizedVariant === 'primary'
      ? 'hero__action--primary'
      : 'hero__action--minimal'
  const href = urlNormalizer.normalizeHref(props.href)
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    ...props,
    href,
    className,
    rel,
  }
}

function resolveHeroMedia(props: HeroMedia): HeroMedia {
  return {
    ...props,
    alt: props.alt || 'Hero image',
  }
}

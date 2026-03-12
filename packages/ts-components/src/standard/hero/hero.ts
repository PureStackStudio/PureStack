import { urlNormalizer } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'
import { registerHeroStyles } from './heroStyle'

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
  r-if="hasHref"
  :data-icon="hasIcon ? icon : null"
  :target="hasTarget ? target : null"
  :rel="hasRel ? rel : null"
>
  <slot></slot>
</a>`

const heroMediaTemplate = html`<div class="hero__logo-frame" r-if="hasMedia">
  <img class="hero__logo" :src="src" :alt="alt" />
</div>`

interface HeroActionContext {
  href?: string
  variant?: string
  icon?: string
  target?: string
  rel?: string
  className?: string
  hasHref?: boolean
  hasIcon?: boolean
  hasTarget?: boolean
  hasRel?: boolean
}

interface HeroMediaContext {
  src?: string
  alt?: string
  hasMedia?: boolean
}

function createHeroBannerComponent() {
  return defineComponent<Record<string, never>>(heroTemplate, {})
}

function createHeroActionComponent() {
  return defineComponent<HeroActionContext>(heroActionTemplate, {
    props: ['href', 'variant', 'icon', 'target', 'rel'],
    context: (head) => resolveHeroActionContext(head.props),
  })
}

function createHeroMediaComponent() {
  return defineComponent<HeroMediaContext>(heroMediaTemplate, {
    props: ['src', 'alt'],
    context: (head) => resolveHeroMediaContext(head.props),
  })
}

export function createHeroComponents() {
  registerHeroStyles()
  return {
    heroBanner: createHeroBannerComponent(),
    heroAction: createHeroActionComponent(),
    heroMedia: createHeroMediaComponent(),
  }
}

function resolveHeroActionContext(props: HeroActionContext): HeroActionContext {
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
    hasHref: Boolean(href),
    hasIcon: Boolean(props.icon),
    hasTarget: Boolean(props.target),
    hasRel: Boolean(rel),
  }
}

function resolveHeroMediaContext(props: HeroMediaContext): HeroMediaContext {
  return {
    ...props,
    alt: props.alt || 'Hero image',
    hasMedia: Boolean(props.src),
  }
}

import { defineComponent, html } from 'regor'

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

const heroMediaTemplate = html`<div class="hero__logo-frame" r-if="src">
  <img class="hero__logo" :src="src" :alt="alt" />
</div>`

export interface HeroMedia {
  src?: string
  alt?: string
}

function defineHeroBannerComponent() {
  return defineComponent<Record<string, never>>(heroTemplate, {})
}

function defineHeroMediaComponent() {
  return defineComponent<HeroMedia>(heroMediaTemplate, {
    props: ['src', 'alt'],
    context: (head) => resolveHeroMedia(head.props),
  })
}

export function defineHeroComponents() {
  return {
    heroBanner: defineHeroBannerComponent(),
    heroMedia: defineHeroMediaComponent(),
  }
}

function resolveHeroMedia(props: HeroMedia): HeroMedia {
  return {
    ...props,
    alt: props.alt || 'Hero image',
  }
}

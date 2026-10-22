import { defineComponent, html, type RefOrValue } from 'regor'
import type { landingContent } from '../../../content/landing'
import { LandingPage } from '../page'

export interface LandingHeroIntro {
  headingId: RefOrValue<string>
  hero: typeof landingContent.hero
}

const introTemplate = html`<div class="landing-hero-copy">
  <p class="landing-eyebrow landing-eyebrow--accent">{{ hero.eyebrow }}</p>
  <h1 :id="headingId" class="landing-hero-title">
    <span>{{ hero.title }}</span>
    <span>{{ hero.continuation }} <span class="landing-accent">{{ hero.accent }}</span></span>
  </h1>
  <p class="landing-hero-description">{{ hero.description }}</p>
  <Flex wrap="true" class="landing-actions">
    <BtnLink :href="hero.primary.href" tone="accent" icon="lucide:arrow-up-right" iconPosition="end" class="landing-button">{{ hero.primary.label }}</BtnLink>
    <BtnLink :href="hero.secondary.href" variant="link" icon="lucide:arrow-right" iconPosition="end" class="landing-button">{{ hero.secondary.label }}</BtnLink>
  </Flex>
  <p class="landing-note">{{ hero.note }}</p>
</div>`

export function defineLandingHeroIntroComponent() {
  return defineComponent<LandingHeroIntro>(introTemplate, {
    props: ['headingId'],
    context: (head) => ({
      ...head.props,
      hero: head.requireContext(LandingPage).content.hero,
    }),
  })
}

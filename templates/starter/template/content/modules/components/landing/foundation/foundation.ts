import { defineComponent, html } from 'regor'
import type { landingContent } from '../../../content/landing'
import { LandingPage } from '../page'

export interface LandingFoundation {
  foundation: typeof landingContent.foundation
}

const foundationTemplate = html`<section class="landing-foundation" aria-labelledby="foundation-title">
  <Grid columns="1" columnsLg="minmax(0, 1.25fr) minmax(0, 0.75fr)" alignItems="end" class="landing-section-heading">
    <div>
      <p class="landing-eyebrow">{{ foundation.eyebrow }}</p>
      <h2 id="foundation-title" class="landing-section-title">{{ foundation.title }}</h2>
    </div>
    <p class="landing-body">{{ foundation.description }}</p>
  </Grid>
  <Grid columns="1" columnsMd="3" class="landing-features">
    <LandingFeatureCard r-for="card in foundation.cards" :card="card"/>
  </Grid>
</section>`

export function defineLandingFoundationComponent() {
  return defineComponent<LandingFoundation>(foundationTemplate, {
    context: (head) => ({
      foundation: head.requireContext(LandingPage).content.foundation,
    }),
  })
}

import { defineComponent, html, type RefOrValue } from 'regor'
import type { LandingFeature } from '../../../content/landing'

export interface LandingFeatureCard {
  card: RefOrValue<LandingFeature>
}

const featureTemplate = html`<Panel
  variant="surface"
  class="landing-feature-card p-0 lift-1 transition"
  bodyClass="landing-feature-body"
>
  <Flex justify="between" align="center" class="landing-feature-heading">
    <IconFrame :name="card.icon" tone="accent" variant="surface"/>
    <span class="landing-feature-number" aria-hidden="true"
      >{{ card.number }}</span>
  </Flex>
  <h3>{{ card.title }}</h3>
  <p class="landing-body">{{ card.description }}</p>
  <BtnLink
    :href="card.link.href"
    variant="link"
    icon="lucide:arrow-up-right"
    iconPosition="end"
    class="landing-card-link"
    >{{ card.link.label }}</BtnLink>
</Panel>`

export function defineLandingFeatureCardComponent() {
  return defineComponent<LandingFeatureCard>(featureTemplate, {
    props: ['card'],
  })
}

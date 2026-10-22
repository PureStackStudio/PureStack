import { defineComponent, html } from 'regor'

export interface LandingHero {
  headingId: string
}

const heroTemplate = html`<Grid container="section" columns="1" columnsLg="minmax(0, 1.08fr) minmax(0, 0.92fr)"
  alignItems="center" class="landing-hero" :aria-labelledby="headingId">
  <LandingHeroIntro :headingId="headingId"/>
  <LandingHeroCanvas/>
</Grid>`

export function defineLandingHeroComponent() {
  return defineComponent<LandingHero>(heroTemplate, {
    context: () => ({ headingId: 'home-title' }),
  })
}

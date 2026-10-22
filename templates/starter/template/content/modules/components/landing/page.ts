import { defineComponent, html } from 'regor'
import { landingContent } from '../../content/landing'

export class LandingPage {
  readonly content = landingContent
}

const pageTemplate = html`<div class="landing-page">
  <LandingHero/>
  <LandingFoundation/>
  <LandingNextStep/>
</div>`

export function defineLandingPageComponent() {
  return defineComponent<LandingPage>(pageTemplate, {
    context: () => new LandingPage(),
  })
}

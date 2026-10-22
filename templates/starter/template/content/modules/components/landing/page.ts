import { defineComponent, html } from 'regor'
import { LandingPage } from './context'

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

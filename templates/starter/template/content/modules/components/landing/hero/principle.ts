import { defineComponent, html, type RefOrValue } from 'regor'
import type { LandingPrinciple } from '../../../content/landing'

export interface LandingPrincipleCard {
  principle: RefOrValue<LandingPrinciple>
}

const principleTemplate = html`<Panel variant="surfaceAlt" class="landing-principle p-0" bodyClass="p-4">
  <Icon :name="principle.icon" class="landing-accent" aria-hidden="true"/>
  <h3>{{ principle.title }}</h3>
  <p>{{ principle.description }}</p>
</Panel>`

export function defineLandingPrincipleComponent() {
  return defineComponent<LandingPrincipleCard>(principleTemplate, {
    props: ['principle'],
  })
}

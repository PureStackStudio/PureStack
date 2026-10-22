import { defineLandingFeatureCardComponent } from './foundation/feature-card'
import { defineLandingFoundationComponent } from './foundation/foundation'
import { defineLandingHeroCanvasComponent } from './hero/canvas'
import { defineLandingHeroComponent } from './hero/hero'
import { defineLandingHeroIntroComponent } from './hero/intro'
import { defineLandingCanvasMessageComponent } from './hero/message'
import { defineLandingPrincipleComponent } from './hero/principle'
import { defineLandingNextStepComponent } from './next-step'
import { defineLandingPageComponent } from './page'

export function defineLandingComponents() {
  return {
    landingPage: defineLandingPageComponent(),
    landingHero: defineLandingHeroComponent(),
    landingHeroIntro: defineLandingHeroIntroComponent(),
    landingHeroCanvas: defineLandingHeroCanvasComponent(),
    landingCanvasMessage: defineLandingCanvasMessageComponent(),
    landingPrinciple: defineLandingPrincipleComponent(),
    landingFoundation: defineLandingFoundationComponent(),
    landingFeatureCard: defineLandingFeatureCardComponent(),
    landingNextStep: defineLandingNextStepComponent(),
  }
}

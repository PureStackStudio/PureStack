import { defineComponent, html } from 'regor'
import type { landingContent } from '../../../content/landing'
import { LandingPage } from '../page'

export interface LandingHeroCanvas {
  canvas: typeof landingContent.canvas
}

const canvasTemplate = html`<div class="landing-canvas-scene">
  <div class="landing-canvas-backdrop" aria-hidden="true"></div>
  <Panel variant="surface" class="landing-canvas p-0" bodyClass="p-0">
    <Flex align="center" justify="between" class="landing-canvas-toolbar">
      <Flex class="landing-window-dots" aria-hidden="true"><span></span><span></span><span></span></Flex>
      <span class="landing-canvas-label">{{ canvas.label }}</span>
      <Icon name="lucide:layout-template" aria-hidden="true"/>
    </Flex>
    <div class="landing-canvas-content">
      <LandingCanvasMessage/>
      <Grid columns="1" columnsSm="2" class="landing-principles">
        <LandingPrinciple r-for="principle in canvas.principles" :principle="principle"/>
      </Grid>
    </div>
    <Flex justify="between" align="center" class="landing-canvas-status">
      <span><Icon name="lucide:check" aria-hidden="true"/> A thoughtful starting point</span>
      <span>01 / YOUR SITE</span>
    </Flex>
  </Panel>
</div>`

export function defineLandingHeroCanvasComponent() {
  return defineComponent<LandingHeroCanvas>(canvasTemplate, {
    context: (head) => ({
      canvas: head.requireContext(LandingPage).content.canvas,
    }),
  })
}

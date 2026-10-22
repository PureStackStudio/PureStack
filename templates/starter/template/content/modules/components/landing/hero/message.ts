import { defineComponent, html } from 'regor'
import type { landingContent } from '../../../content/landing'
import { LandingPage } from '../page'

export interface LandingCanvasMessage {
  canvas: typeof landingContent.canvas
}

const messageTemplate = html`<div class="landing-canvas-message">
  <IconFrame name="lucide:sparkles" tone="accent" variant="surface"/>
  <h2 class="landing-canvas-title"><span>{{ canvas.firstLine }}</span> <span>{{ canvas.secondLine }}</span></h2>
  <p class="landing-body">{{ canvas.description }}</p>
</div>`

export function defineLandingCanvasMessageComponent() {
  return defineComponent<LandingCanvasMessage>(messageTemplate, {
    context: (head) => ({
      canvas: head.requireContext(LandingPage).content.canvas,
    }),
  })
}

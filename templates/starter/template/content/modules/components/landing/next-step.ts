import { defineComponent, html } from 'regor'
import type { landingContent } from '../../content/landing'
import { LandingPage } from './page'

export interface LandingNextStep {
  next: typeof landingContent.next
}

const nextTemplate = html`<Panel
  variant="spotlight"
  class="landing-next p-0 spotlight-from-top-right"
  bodyClass="landing-next-body"
>
  <Grid
    columns="1"
    columnsLg="minmax(0, 1fr) auto"
    alignItems="center"
    class="landing-next-layout"
  >
    <div>
      <p class="landing-eyebrow">{{ next.eyebrow }}</p>
      <h2 class="landing-next-title">{{ next.title }}</h2>
      <p class="landing-body">{{ next.description }}</p>
    </div>
    <BtnLink
      :href="next.link.href"
      tone="accent"
      icon="lucide:arrow-right"
      iconPosition="end"
      class="landing-button"
      >{{ next.link.label }}</BtnLink>
  </Grid>
</Panel>`

export function defineLandingNextStepComponent() {
  return defineComponent<LandingNextStep>(nextTemplate, {
    context: (head) => ({
      next: head.requireContext(LandingPage).content.next,
    }),
  })
}

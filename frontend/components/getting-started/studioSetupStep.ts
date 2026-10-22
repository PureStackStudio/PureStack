import { defineComponent, html } from 'regor'

export interface StudioSetupStep {
  heading: string
  description: string
}

const setupStepTemplate = html`<Panel tone="accent" variant="surface" class="p-0 mb-5" bodyClass="p-4">
  <Flex align="center" class="gap-3 mb-3">
    <IconFrame name="tabler:browser" tone="accent" variant="surface"/>
    <strong>{{ heading }}</strong>
  </Flex>
  <p class="mt-0 mb-3 fs-sm">{{ description }}</p>
  <ol class="m-0 pl-4 fs-sm">
    <li>Choose your template, colors, and features.</li>
    <li>Review your choices and create your site.</li>
    <li>Browse it live, then finish Studio when you’re ready.</li>
  </ol>
</Panel>`

export function defineStudioSetupStepComponent() {
  return defineComponent<StudioSetupStep>(setupStepTemplate, {
    context: () => ({
      heading: 'Configure your site in your browser',
      description:
        'init starts a local PureStack setup website. Open the URL printed in your terminal to get started.',
    }),
  })
}

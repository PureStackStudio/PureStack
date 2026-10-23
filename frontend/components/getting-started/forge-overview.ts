import { defineComponent, html } from 'regor'

export interface ForgeOverview {
  heading: string
  description: string
}

const setupStepTemplate = html`<Panel tone="accent" variant="solid" class="p-0 mb-5" bodyClass="p-4">
  <Flex align="center" class="gap-3 mb-3">
    <IconFrame name="tabler:browser" tone="accent" variant="solid"/>
    <strong>{{ heading }}</strong>
  </Flex>
  <p class="mt-0 mb-3 fs-sm">{{ description }}</p>
  <ol class="m-0 pl-4 fs-sm">
    <li>Choose a template and configure your project.</li>
    <li>Review your choices and create your site.</li>
    <li>Browse it live, then finish Forge when you’re ready.</li>
  </ol>
</Panel>`

export function defineForgeOverviewComponent() {
  return defineComponent<ForgeOverview>(setupStepTemplate, {
    context: () => ({
      heading: 'Make it yours with PureStack Forge',
      description:
        'Open the link in your terminal to launch PureStack Forge, your website builder. Start with a template and shape your site in the browser.',
    }),
  })
}

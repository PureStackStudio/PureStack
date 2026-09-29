import {
  defineBadgeComponents,
  defineFlexComponents,
  defineIconComponents,
  defineTabsComponents,
} from '@purestack/ts-components'
import { tabler_code, tabler_rocket } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface TabsComposition {
  resource: Ref<string>
  environment: Ref<string>
}

const tabsCompositionTemplate = html`<Flex direction="column">
  <Tabs id="resource-tabs" group="resource-tabs" :selectedTab="resource" tone="neutral" variant="outline" tabVariant="underline" ariaLabel="Project resources">
    <template #header><Flex class="tabs__header" justify="between" align="center" wrap="true">
      <h3 class="m-0">Project resources</h3><Badge tone="accent" variant="surface">Header slot</Badge>
    </Flex></template>
    <TabPane id="resource-code" label="Source" icon="tabler:code" class="p-3">
      <h3 class="mt-0">A home for the implementation.</h3><p class="mb-0">Components, theme styles and content live together in the project.</p>
    </TabPane>
    <TabPane id="resource-deploy" label="Environments" icon="tabler:rocket" tone="info" variant="surfaceAlt" tabVariant="solid" class="p-3">
      <p class="mt-0">This pane overrides its tone, surface and control treatment. Its inner tabs have their own selection.</p>
      <Tabs id="environment-tabs" group="environment-tabs" :selectedTab="environment" tone="neutral" variant="surface" tabVariant="outline" ariaLabel="Deployment environment">
        <TabPane id="environment-preview" label="Preview" class="p-3"><Badge tone="warning" variant="surface">Review in progress</Badge><p class="mb-0">Share the preview with your team before publishing.</p></TabPane>
        <TabPane id="environment-production" label="Production" class="p-3"><Badge tone="success" variant="surface">Published</Badge><p class="mb-0">The approved release is available to everyone.</p></TabPane>
      </Tabs>
    </TabPane>
  </Tabs>
  <p class="text-muted m-0" role="status">Resource: <code id="resource-selected">{{ resource }}</code> · Environment: <code id="environment-selected">{{ environment }}</code></p>
</Flex>`

const tabsComposition = defineComponent<TabsComposition>(
  tabsCompositionTemplate,
  {
    context: () => ({
      resource: ref('resource-deploy'),
      environment: ref('environment-preview'),
    }),
  },
)
const icons: Record<string, string> = {
  'tabler:code': tabler_code,
  'tabler:rocket': tabler_rocket,
}
createApp(
  {
    components: {
      TabsComposition: tabsComposition,
      ...defineTabsComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#tabs-composition', template: html`<TabsComposition/>` },
)
window.tsSsgTabs?.refresh('#resource-tabs, #environment-tabs')

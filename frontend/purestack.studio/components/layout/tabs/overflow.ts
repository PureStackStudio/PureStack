import {
  defineBadgeComponents,
  defineFlexComponents,
  defineFormSelectField,
  defineIconComponents,
  defineTabsComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface TabsOverflow {
  width: Ref<string>
  selected: Ref<string>
  widths: FormSelectOption[]
  topics: {
    id: string
    label: string
    eyebrow: string
    title: string
    description: string
    disabled?: boolean
  }[]
}

const tabsOverflowTemplate = html`<Flex direction="column">
  <FormSelectField id="tabs-overflow-width" label="Available container width" :model="width" :options="widths"/>
  <div class="max-w-full" :style="{ width }">
    <Tabs id="tabs-overflow-preview" group="tabs-overflow-topics" :selectedTab="selected" tone="neutral" variant="surface" tabVariant="outline" ariaLabel="Project sections">
      <TabPane r-for="topic in topics" :id="topic.id" :label="topic.label" :disabled="topic.disabled" class="p-3">
        <p class="text-eyebrow mt-0">{{ topic.eyebrow }}</p><h3 class="mt-0">{{ topic.title }}</h3>
        <p class="mb-0">{{ topic.description }}</p>
      </TabPane>
    </Tabs>
  </div>
  <Flex wrap="true" align="center"><Badge variant="surface">{{ width }} container</Badge><span class="text-muted">Selected: <code id="overflow-selected">{{ selected }}</code></span></Flex>
  <p class="text-muted m-0">On a desktop viewport, narrow the container and use More tabs. At 640px viewport width or below, the native selector replaces the row. Billing remains disabled in either control.</p>
</Flex>`

const tabsOverflow = defineComponent<TabsOverflow>(tabsOverflowTemplate, {
  context: () => ({
    width: ref('360px'),
    selected: ref('overflow-configuration'),
    widths: ['280px', '360px', '520px', '100%'].map((value) => ({
      label: value === '100%' ? 'Full available width' : value,
      value,
    })),
    topics: [
      {
        id: 'overflow-configuration',
        label: 'Configuration',
        eyebrow: 'Project foundation',
        title: 'One shared configuration.',
        description:
          'Define the site identity, content roots and output paths together.',
      },
      {
        id: 'overflow-content',
        label: 'Content library',
        eyebrow: 'Editorial workflow',
        title: 'Pages with a clear home.',
        description:
          'Organize guides into folders and keep each example beside its page.',
      },
      {
        id: 'overflow-components',
        label: 'Components',
        eyebrow: 'Reusable interfaces',
        title: 'Compose the page.',
        description:
          'Build panels, forms and navigation from typed components.',
      },
      {
        id: 'overflow-themes',
        label: 'Theme settings',
        eyebrow: 'Visual system',
        title: 'Two themes. One identity.',
        description:
          'Semantic tones keep controls and surfaces consistent in light and dark.',
      },
      {
        id: 'overflow-build',
        label: 'Build history',
        eyebrow: 'Publishing',
        title: 'A repeatable release.',
        description:
          'Render content, bundle the browser apps and index the finished pages.',
      },
      {
        id: 'overflow-members',
        label: 'Team members',
        eyebrow: 'Collaboration',
        title: 'Give every contributor a place.',
        description: 'Keep ownership and project resources close to the work.',
      },
      {
        id: 'overflow-billing',
        label: 'Billing',
        eyebrow: 'Unavailable',
        title: 'Billing',
        description: 'This pane is disabled in the demonstration.',
        disabled: true,
      },
    ],
  }),
})
createApp(
  {
    components: {
      TabsOverflow: tabsOverflow,
      ...defineTabsComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) =>
        name === 'lucide:chevron-down' ? lucide_chevron_down : '',
      ),
    },
  },
  { selector: 'app#tabs-overflow', template: html`<TabsOverflow/>` },
)
window.tsSsgTabs?.refresh('#tabs-overflow-preview')

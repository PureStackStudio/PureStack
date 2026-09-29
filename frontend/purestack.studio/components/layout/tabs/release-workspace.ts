import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormInputField,
  defineFormSelectField,
  defineIconComponents,
  definePanelComponents,
  defineTabsComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface ReleaseWorkspace {
  selected: Ref<string>
  name: Ref<string>
  channel: Ref<string>
  saved: SRef<string[]>
  canSave: ComputedRef<boolean>
  channels: FormSelectOption[]
  edit: () => void
  review: () => void
  save: () => void
}

const releaseWorkspaceTemplate = html`<Flex direction="column">
  <Tabs id="release-workspace-tabs" group="release-workspace" :selectedTab="selected" tone="neutral" variant="surface" ariaLabel="Release workspace">
    <template #header><Flex class="tabs__header" justify="between" align="center" wrap="true">
      <div><p class="text-eyebrow m-0">Local release draft</p><h3 class="mt-1 mb-0">Prepare your next release</h3></div>
      <Badge tone="accent" variant="surface">{{ saved.length }} saved</Badge>
    </Flex></template>
    <TabPane id="release-details" label="Details" class="p-3">
      <Flex direction="column">
        <FormInputField id="release-name" label="Release name" :model="name" placeholder="Give the release a name"/>
        <FormSelectField id="release-channel" label="Release channel" :model="channel" :options="channels"/>
        <p class="text-muted m-0">Your draft stays mounted when you switch panes. Changes are stored in this demo until the page reloads.</p>
        <Flex><Btn @click="review" :disabled="!canSave">Review draft</Btn></Flex>
      </Flex>
    </TabPane>
    <TabPane id="release-review" label="Review" class="p-3">
      <Panel variant="surfaceAlt" bodyClass="p-4">
        <p class="text-eyebrow mt-0">Ready for review</p><h3 id="release-summary" class="mt-0">{{ name.trim() || 'Untitled release' }}</h3>
        <p>Channel: <strong>{{ channel }}</strong></p>
        <Flex wrap="true"><Btn @click="save" :disabled="!canSave">Save draft locally</Btn><Btn variant="outline" @click="edit">Back to details</Btn></Flex>
      </Panel>
    </TabPane>
    <TabPane id="release-history" label="Saved drafts" class="p-3">
      <p class="text-muted" r-if="saved.length === 0">No saved drafts yet. Name a release, review it, then save it here.</p>
      <ul r-else id="release-history-list"><li r-for="entry in saved">{{ entry }}</li></ul>
      <Btn variant="outline" @click="edit">Continue editing</Btn>
    </TabPane>
  </Tabs>
  <p class="text-muted m-0" role="status">Shared selection: <code id="release-selected">{{ selected }}</code></p>
</Flex>`

const releaseWorkspace = defineComponent<ReleaseWorkspace>(
  releaseWorkspaceTemplate,
  {
    context: () => {
      const selected = ref('release-details')
      const name = ref('Studio component library')
      const channel = ref('Preview')
      const saved = sref<string[]>([])
      const canSave = computed(() => name().trim().length > 0)
      const select = (id: string) => {
        selected(id)
        requestAnimationFrame(() =>
          window.tsSsgTabs?.refresh('#release-workspace-tabs'),
        )
      }
      return {
        selected,
        name,
        channel,
        saved,
        canSave,
        channels: ['Preview', 'Stable', 'Internal'].map((value) => ({
          label: value,
          value,
        })),
        edit: () => select('release-details'),
        review: () => {
          if (canSave()) select('release-review')
        },
        save: () => {
          if (!canSave()) return
          saved([`${name().trim()} · ${channel()}`, ...saved()])
          select('release-history')
        },
      }
    },
  },
)
createApp(
  {
    components: {
      ReleaseWorkspace: releaseWorkspace,
      ...defineTabsComponents(),
      ...defineFlexComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...definePanelComponents(),
      ...defineIconComponents((name) =>
        name === 'lucide:chevron-down' ? lucide_chevron_down : '',
      ),
    },
  },
  { selector: 'app#release-workspace', template: html`<ReleaseWorkspace/>` },
)
window.tsSsgTabs?.refresh('#release-workspace-tabs')

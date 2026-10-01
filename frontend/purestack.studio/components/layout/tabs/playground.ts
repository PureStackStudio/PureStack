import {
  type ComponentVariant,
  type ComponentVariantMode,
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
  defineTabsComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import type { SemanticTone } from '@purestack/ts-style'
import {
  lucide_chevron_down,
  tabler_code,
  tabler_layout_grid,
  tabler_users,
} from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface TabsPlayground {
  selected: Ref<string>
  tone: Ref<SemanticTone>
  shell: Ref<ComponentVariant>
  controls: Ref<ComponentVariant>
  panel: Ref<ComponentVariant>
  mode: Ref<ComponentVariantMode>
  icons: Ref<boolean>
  header: Ref<boolean>
  teamDisabled: Ref<boolean>
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  modes: FormSelectOption[]
  selectionOptions: ComputedRef<FormSelectOption[]>
  configuration: ComputedRef<string>
  refresh: () => void
  reset: () => void
}

const tabsPlaygroundTemplate = html`<Flex direction="column">
  <Flex justify="between" align="center" wrap="true">
    <p class="text-eyebrow m-0">One component, three styling surfaces</p>
    <Badge tone="accent" variant="surface">Live playground</Badge>
  </Flex>
  <Tabs id="tabs-playground-preview" group="tabs-playground-views" :selectedTab="selected"
    :tone="tone" :variant="shell" :tabVariant="controls" :variantMode="mode" ariaLabel="Project workspace">
    <template #header>
      <Flex r-if="header" class="tabs__header" justify="between" align="center" wrap="true">
        <div><p class="text-eyebrow m-0">PureStack Studio</p><h3 class="mt-1 mb-0">Project workspace</h3></div>
        <Badge tone="success" variant="surface">Preview ready</Badge>
      </Flex>
    </template>
    <TabPane id="tabs-lab-overview" label="Overview" :icon="icons ? 'tabler:layout-grid' : ''" :variant="panel" class="p-4">
      <p class="text-eyebrow mt-0">Release overview</p><h3 class="mt-0">Everything your next release needs.</h3>
      <p>Content, components and a shared theme, ready to publish together.</p>
      <Grid columns="1" columnsSm="3">
        <Panel variant="outline" bodyClass="p-3"><strong>12 pages</strong><p class="text-muted mb-0">Ready to publish</p></Panel>
        <Panel variant="outline" bodyClass="p-3"><strong>2 themes</strong><p class="text-muted mb-0">Light and dark</p></Panel>
        <Panel variant="outline" bodyClass="p-3"><strong>0 warnings</strong><p class="text-muted mb-0">Content checks</p></Panel>
      </Grid>
    </TabPane>
    <TabPane id="tabs-lab-source" label="Build" :icon="icons ? 'tabler:code' : ''" :variant="panel" class="p-4">
      <p class="text-eyebrow mt-0">Build pipeline</p><h3 class="mt-0">From typed source to a static site.</h3>
      <ol class="mb-0"><li>Resolve content and shared configuration.</li><li>Render pages, components and theme styles.</li><li>Bundle browser apps and generate the search index.</li></ol>
    </TabPane>
    <TabPane id="tabs-lab-team" label="Team" :icon="icons ? 'tabler:users' : ''" :disabled="teamDisabled" :variant="panel" class="p-4">
      <p class="text-eyebrow mt-0">Project access</p><h3 class="mt-0">A shared place to build.</h3>
      <p class="mb-0">Designers review the preview. Developers own the components. Editors keep the content current.</p>
    </TabPane>
  </Tabs>
  <div @change="refresh">
    <Grid columns="1" columnsMd="3">
      <FormSelectField id="tabs-tone" label="Tone" :model="tone" :options="tones"/>
      <FormSelectField id="tabs-shell" label="Container variant" :model="shell" :options="variants"/>
      <FormSelectField id="tabs-controls" label="Tab control variant" :model="controls" :options="variants"/>
      <FormSelectField id="tabs-panel" label="Panel variant" :model="panel" :options="variants"/>
      <FormSelectField id="tabs-mode" label="Container / panel mode" :model="mode" :options="modes"/>
      <FormSelectField id="tabs-selection" label="Selected pane" :model="selected" :options="selectionOptions"/>
    </Grid>
    <Flex wrap="true" class="mt-3">
      <FormCheck id="tabs-icons" label="Show icons" :checked="icons"/>
      <FormCheck id="tabs-header" label="Show header slot" :checked="header"/>
      <FormCheck id="tabs-disabled" label="Disable Team" :checked="teamDisabled"/>
    </Flex>
  </div>
  <Flex justify="between" align="center" wrap="true">
    <p class="text-muted m-0" role="status">Selected: <code id="tabs-selected">{{ selected }}</code></p>
    <Btn variant="outline" size="sm" @click="reset">Reset playground</Btn>
  </Flex>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <p class="text-eyebrow mt-0">Current settings</p>
    <pre class="overflow-auto max-h-inspector m-0"><code id="tabs-configuration">{{ configuration }}</code></pre>
  </Panel>
</Flex>`

const tabsPlayground = defineComponent<TabsPlayground>(tabsPlaygroundTemplate, {
  context: () => {
    const selected = ref('tabs-lab-overview')
    const tone = ref<SemanticTone>('neutral')
    const shell = ref<ComponentVariant>('surface')
    const controls = ref<ComponentVariant>('underline')
    const panel = ref<ComponentVariant>('none')
    const mode = ref<ComponentVariantMode>('stateless')
    const icons = ref(true)
    const header = ref(true)
    const teamDisabled = ref(true)
    const refresh = () => {
      if (teamDisabled() && selected() === 'tabs-lab-team')
        selected('tabs-lab-overview')
      requestAnimationFrame(() =>
        window.tsSsgTabs?.refresh('#tabs-playground-preview'),
      )
    }
    return {
      selected,
      tone,
      shell,
      controls,
      panel,
      mode,
      icons,
      header,
      teamDisabled,
      refresh,
      tones: [
        'neutral',
        'accent',
        'secondary',
        'info',
        'success',
        'warning',
        'danger',
        'feature',
        'custom',
        'ghost',
      ].map((value) => ({ label: value, value })),
      variants: [
        'none',
        'solid',
        'surface',
        'surfaceAlt',
        'spotlight',
        'glass',
        'flat',
        'flatAlt',
        'flatSolid',
        'outlineFill',
        'outline',
        'subtle',
        'subtleBtn',
        'link',
        'sheen',
        'underline',
        'rail',
        'bracket',
      ].map((value) => ({ label: value, value })),
      modes: ['stateless', 'stateful'].map((value) => ({
        label: value,
        value,
      })),
      selectionOptions: computed<FormSelectOption[]>(() => [
        { label: 'Overview', value: 'tabs-lab-overview' },
        { label: 'Build', value: 'tabs-lab-source' },
        { label: 'Team', value: 'tabs-lab-team', disabled: teamDisabled() },
      ]),
      configuration: computed(() =>
        JSON.stringify(
          {
            Tabs: {
              group: 'tabs-playground-views',
              selectedTab: selected(),
              tone: tone(),
              variant: shell(),
              tabVariant: controls(),
              variantMode: mode(),
              ariaLabel: 'Project workspace',
            },
            TabPane: { variant: panel(), disabled: teamDisabled() },
            showIcons: icons(),
            showHeader: header(),
          },
          null,
          2,
        ),
      ),
      reset: () => {
        selected('tabs-lab-overview')
        tone('neutral')
        shell('surface')
        controls('underline')
        panel('none')
        mode('stateless')
        icons(true)
        header(true)
        teamDisabled(true)
        refresh()
      },
    }
  },
})
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'tabler:layout-grid': tabler_layout_grid,
  'tabler:code': tabler_code,
  'tabler:users': tabler_users,
}
createApp(
  {
    components: {
      TabsPlayground: tabsPlayground,
      ...defineTabsComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...definePanelComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFormComponents(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#tabs-playground', template: html`<TabsPlayground/>` },
)
window.tsSsgTabs?.refresh('#tabs-playground-preview')

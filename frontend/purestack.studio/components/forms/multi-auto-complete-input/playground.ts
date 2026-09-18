import {
  type AutoCompleteOption,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
  defineMultiAutoCompleteInputComponents,
  type MultiAutoCompleteItem,
} from '@purestack/ts-components'
import {
  lucide_chevron_down,
  lucide_loader_circle,
  lucide_x,
} from '@purestack/ts-svg-icons'
import {
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface MultiAutoCompleteInputExample {
  selectedTags: SRef<MultiAutoCompleteItem[]>
  tagQuery: Ref<string>
  tagOptions: AutoCompleteOption[]
  customAllowed: Ref<boolean>
  duplicatesAllowed: Ref<boolean>
  pending: Ref<boolean>
  locked: Ref<boolean>
  clear: () => void
}

const multiAutoCompleteInputExampleTemplate = html`<Flex direction="column">
  <MultiAutoCompleteInput
    id="multi-tags"
    label="Release tags"
    placeholder="Choose or type a tag"
    name="tags"
    :items="selectedTags"
    :model="tagQuery"
    :options="tagOptions"
    :allowCustomValues="customAllowed"
    :allowDuplicates="duplicatesAllowed"
    :loading="pending"
    :disabled="locked"
    separators=",;"
  />
  <Flex wrap="true">
    <FormCheck id="multi-custom" label="Allow new tags" :checked="customAllowed" />
    <FormCheck
      id="multi-duplicates"
      label="Allow duplicates"
      :checked="duplicatesAllowed"
    />
    <FormCheck id="multi-loading" label="Loading state" :checked="pending" />
    <FormCheck id="multi-disabled" label="Disabled" :checked="locked" />
  </Flex>
  <Btn variant="link" @click="clear">Clear editable tags</Btn>
  <FormStatus>
    {{ selectedTags.length }} tags selected. Query: {{ tagQuery || 'Empty' }}
  </FormStatus>
  <ul>
    <li r-for="tag in selectedTags">{{ tag.label }} · {{ tag.value }}</li>
  </ul>
</Flex>`

function createMultiAutoCompleteInputExample(): MultiAutoCompleteInputExample {
  const requiredTag: MultiAutoCompleteItem = {
    label: 'Documentation',
    value: 'docs',
    disabled: true,
  }
  const selectedTags = sref<MultiAutoCompleteItem[]>([
    requiredTag,
    { label: 'Needs review', value: 'review', tone: 'warning' },
  ])
  return {
    selectedTags,
    tagQuery: ref(''),
    tagOptions: [
      { label: 'TypeScript', value: 'ts', keywords: ['typed'] },
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Performance', value: 'perf' },
      { label: 'Internal · unavailable', value: 'internal', disabled: true },
    ],
    customAllowed: ref(true),
    duplicatesAllowed: ref(false),
    pending: ref(false),
    locked: ref(false),
    clear: () => selectedTags([requiredTag]),
  }
}

const component = defineComponent<MultiAutoCompleteInputExample>(
  multiAutoCompleteInputExampleTemplate,
  {
    context: createMultiAutoCompleteInputExample,
  },
)
const icons: Record<string, string> = {
  'lucide:loader-circle': lucide_loader_circle,
  'lucide:x': lucide_x,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      MultiAutoCompleteInputExample: component,

      ...defineMultiAutoCompleteInputComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#multi-auto-complete-input-demo',
    template: html`<MultiAutoCompleteInputExample />`,
  },
)

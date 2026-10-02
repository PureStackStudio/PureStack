import {
  type AutoCompleteOption,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineIconComponents,
  defineMultiAutoCompleteInputComponents,
  type MultiAutoCompleteItem,
  type ResolvedAutoCompleteOption,
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
  type RefOrValue,
  ref,
  type SRef,
  sref,
} from 'regor'
import { mountFormAppearanceGalleries } from '../appearance'

export interface MultiAutoCompleteInputExample {
  selectedTags: SRef<MultiAutoCompleteItem[]>
  tagQuery: Ref<string>
  tagOptions: AutoCompleteOption[]
  customAllowed: Ref<boolean>
  duplicatesAllowed: Ref<boolean>
  pending: Ref<boolean>
  locked: Ref<boolean>
  minimum: Ref<number>
  limit: Ref<number>
  focusOpens: Ref<boolean>
  customItems: SRef<MultiAutoCompleteItem[]>
  activity: Ref<string>
  createTag: (query: string) => MultiAutoCompleteItem
  mapTag: (option: ResolvedAutoCompleteOption) => MultiAutoCompleteItem
  splitTags: (value: string) => string[]
  itemsChanged: (items: MultiAutoCompleteItem[]) => void
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
    :minLength="minimum"
    :maxResults="limit"
    :openOnFocus="focusOpens"
    separators=",;"
  />
  <Flex wrap="true">
    <FormInputField id="multi-minimum" label="Minimum query length" type="number" min="0" :model="minimum" />
    <FormInputField id="multi-limit" label="Maximum results" type="number" min="1" :model="limit" />
  </Flex>
  <Flex wrap="true">
    <FormCheck id="multi-focus" label="Open on focus" :checked="focusOpens" />
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
  <h3>Callback transforms and a custom row</h3>
  <p>Choose a suggestion to give it a success tone. New tags use lowercase values and a feature tone. Paste tags separated by commas, semicolons, pipes, or newlines.</p>
  <MultiAutoCompleteInput id="multi-customized" label="Normalized tags" :items="customItems"
    :options="tagOptions" rowComponent="TagSuggestion" :onCreateItem="createTag"
    :onOptionToItem="mapTag" :onSplitInput="splitTags" :onItemsChange="itemsChanged"
    placeholder="Try Design | Research"/>
  <FormStatus>{{ activity }}</FormStatus>
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
  const activity = ref('Add a tag to inspect onItemsChange.')
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
    minimum: ref(0),
    limit: ref(3),
    focusOpens: ref(true),
    customItems: sref<MultiAutoCompleteItem[]>([]),
    activity,
    createTag: (query) => ({
      label: query.trim(),
      value: query.trim().toLowerCase(),
      tone: 'feature',
    }),
    mapTag: (option) => ({
      label: option.label,
      value: option.value,
      tone: 'success',
    }),
    splitTags: (value) => value.split(/[;,|\n]/),
    itemsChanged: (items) =>
      activity(
        `onItemsChange: ${items.map((item) => item.value).join(', ') || '(empty)'}`,
      ),
    clear: () => selectedTags([requiredTag]),
  }
}

const component = defineComponent<MultiAutoCompleteInputExample>(
  multiAutoCompleteInputExampleTemplate,
  {
    context: createMultiAutoCompleteInputExample,
  },
)
const tagSuggestion = defineComponent<{
  option: RefOrValue<ResolvedAutoCompleteOption | null>
  active?: RefOrValue<boolean>
  query?: RefOrValue<string>
}>(
  html`<Flex direction="column" r-if="option"><strong>{{ option.label }}</strong><span class="text-muted">{{ option.value }} · {{ active ? 'Active suggestion' : 'Available suggestion' }}{{ query ? ' · query: ' + query : '' }}</span></Flex>`,
  {
    props: ['option', 'active', 'query'],
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
      TagSuggestion: tagSuggestion,

      ...defineMultiAutoCompleteInputComponents(),
      ...defineFormInputField(),
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

mountFormAppearanceGalleries()

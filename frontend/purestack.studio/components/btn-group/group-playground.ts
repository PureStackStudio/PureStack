import {
  type BtnGroupAlign,
  defineBtnGroupComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import {
  batch,
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface GroupPlayground {
  groupAlign: Ref<BtnGroupAlign>
  allowWrap: Ref<boolean>
  width: Ref<string>
  previewStyle: ComputedRef<{ width: string; maxWidth: string }>
  message: Ref<string>
  alignments: FormSelectOption[]
  widths: FormSelectOption[]
  choose: (action: string) => void
  reset: () => void
}

const groupPlaygroundTemplate = html`<Flex direction="column">
  <Grid columns="1" columnsSm="2">
    <FormSelectField id="group-align" label="Alignment" :model="groupAlign" :options="alignments"/>
    <FormSelectField id="group-width" label="Preview width" :model="width" :options="widths"/>
  </Grid>
  <FormCheck id="group-wrap" label="Allow wrapping" :checked="allowWrap"/>
  <div class="overflow-x-auto p-2" :style="previewStyle" tabindex="0" role="region" aria-label="Button group preview">
    <BtnGroup :align="groupAlign" :wrap="allowWrap" class="w-full" role="group" aria-label="Draft actions">
      <Btn tone="accent" @click="choose('Save draft')">Save draft</Btn>
      <Btn variant="surface" @click="choose('Preview')">Preview</Btn>
      <Btn variant="surface" @click="choose('Duplicate')">Duplicate</Btn>
      <Btn variant="link" @click="choose('Discard')">Discard</Btn>
    </BtnGroup>
  </div>
  <p class="m-0" role="status">{{ message }}</p>
  <Btn variant="link" @click="reset">Reset playground</Btn>
</Flex>`

function createGroupPlayground(): GroupPlayground {
  const groupAlign = ref<BtnGroupAlign>('start')
  const allowWrap = ref(true)
  const width = ref('100%')
  const message = ref('Choose an action to test the group.')
  const previewStyle = computed(() => ({ width: '100%', maxWidth: width() }))
  return {
    groupAlign,
    allowWrap,
    width,
    message,
    previewStyle,
    alignments: ['start', 'center', 'end'].map((value) => ({
      label: value,
      value,
    })),
    widths: [
      { label: 'Full width', value: '100%' },
      { label: 'Compact (18rem)', value: '18rem' },
    ],
    choose: (action) => message(`${action} selected.`),
    reset: () =>
      batch(() => {
        groupAlign('start')
        allowWrap(true)
        width('100%')
        message('Choose an action to test the group.')
      }),
  }
}

const component = defineComponent<GroupPlayground>(groupPlaygroundTemplate, {
  context: createGroupPlayground,
})

createApp(
  {
    components: {
      GroupPlayground: component,
      ...defineBtnGroupComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormComponents(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => {
        if (name !== 'lucide:chevron-down')
          throw new Error(`Icon is not registered: ${name}`)
        return lucide_chevron_down
      }),
    },
  },
  { selector: 'app#group-playground', template: html`<GroupPlayground/>` },
)

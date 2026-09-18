import {
  type BtnIconPosition,
  type BtnSize,
  type ComponentVariant,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { SEMANTIC_TONES, type SemanticTone } from '@purestack/ts-style'
import {
  lucide_chevron_down,
  tabler_arrow_right,
  tabler_check,
  tabler_plus,
  tabler_refresh,
} from '@purestack/ts-svg-icons'
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

export interface ButtonPlayground {
  tone: Ref<SemanticTone>
  variant: Ref<ComponentVariant>
  size: Ref<BtnSize>
  icon: Ref<string>
  position: Ref<BtnIconPosition>
  iconOnly: Ref<boolean>
  disabled: Ref<boolean>
  resolvedIcon: ComputedRef<string>
  resolvedIconOnly: ComputedRef<boolean>
  feedback: Ref<string>
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  sizes: FormSelectOption[]
  icons: FormSelectOption[]
  positions: FormSelectOption[]
  activate: () => void
  reset: () => void
}

const variants: ComponentVariant[] = [
  'solid',
  'surface',
  'surfaceAlt',
  'outlineFill',
  'outline',
  'subtle',
  'subtleBtn',
  'link',
  'sheen',
  'underline',
  'rail',
  'bracket',
  'none',
]
const options = (values: string[]) =>
  values.map((value) => ({ label: value, value }))

const buttonPlaygroundTemplate = html`<Grid columns="1" columnsMd="2" alignItems="center">
  <Flex direction="column" align="center">
    <Btn
      :tone="tone"
      :variant="variant"
      :size="size"
      :icon="resolvedIcon"
      :iconPosition="position"
      :iconOnly="resolvedIconOnly"
      :disabled="disabled"
      ariaLabel="Create project"
      @click="activate"
    >
      Create project
    </Btn>
    <p role="status">{{ feedback }}</p>
  </Flex>
  <Grid columns="2">
    <FormSelectField
      id="button-tone"
      label="Tone"
      :model="tone"
      :options="tones"/>
    <FormSelectField
      id="button-variant"
      label="Variant"
      :model="variant"
      :options="variants"/>
    <FormSelectField
      id="button-size"
      label="Size"
      :model="size"
      :options="sizes"/>
    <FormSelectField
      id="button-icon"
      label="Icon"
      :model="icon"
      :options="icons"/>
    <FormSelectField
      id="button-position"
      label="Icon position"
      :model="position"
      :options="positions"/>
    <Flex direction="column" justify="center">
      <FormCheck id="button-disabled" label="Disabled" :checked="disabled"/>
      <FormCheck id="button-icon-only" label="Icon only" :checked="iconOnly"/>
    </Flex>
    <Btn variant="link" tone="neutral" icon="tabler:refresh" @click="reset">
      Reset
    </Btn>
  </Grid>
</Grid>`

function createButtonPlayground(): ButtonPlayground {
  const tone = ref<SemanticTone>('accent')
  const variant = ref<ComponentVariant>('solid')
  const size = ref<BtnSize>('md')
  const icon = ref('tabler:plus')
  const position = ref<BtnIconPosition>('start')
  const iconOnly = ref(false)
  const disabled = ref(false)
  const feedback = ref('Click the button to try it.')
  const count = ref(0)
  const resolvedIcon = computed(() => (icon() === 'none' ? '' : icon()))
  const resolvedIconOnly = computed(() => iconOnly() && resolvedIcon() !== '')
  const reset = () =>
    batch(() => {
      tone('accent')
      variant('solid')
      size('md')
      iconOnly(false)
      position('start')
      icon('tabler:plus')
      disabled(false)
      count(0)
      feedback('Click the button to try it.')
    })
  const activate = () => {
    count(count() + 1)
    feedback(`Action triggered ${count()} ${count() === 1 ? 'time' : 'times'}.`)
  }
  return {
    tone,
    variant,
    size,
    icon,
    position,
    iconOnly,
    resolvedIcon,
    resolvedIconOnly,
    disabled,
    feedback,
    activate,
    reset,
    tones: options(SEMANTIC_TONES),
    variants: options(variants),
    sizes: options(['sm', 'md', 'lg']),
    icons: options([
      'none',
      'tabler:plus',
      'tabler:check',
      'tabler:arrow-right',
    ]),
    positions: options(['start', 'end']),
  }
}

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'tabler:arrow-right': tabler_arrow_right,
  'tabler:check': tabler_check,
  'tabler:plus': tabler_plus,
  'tabler:refresh': tabler_refresh,
}

const component = defineComponent<ButtonPlayground>(buttonPlaygroundTemplate, {
  context: createButtonPlayground,
})

createApp(
  {
    components: {
      ButtonPlayground: component,
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...defineIconComponents((name) => {
        if (!icons[name]) throw new Error(`Icon is not registered: ${name}`)
        return icons[name]
      }),
    },
  },
  {
    selector: 'app#button-playground',
    template: html`<ButtonPlayground/>`,
  },
)

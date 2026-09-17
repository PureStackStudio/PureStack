import type {
  BtnIconPosition,
  BtnSize,
  ComponentVariant,
  FormSelectOption,
} from '@purestack/ts-components'
import { SEMANTIC_TONES, type SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface DocsButtonPlayground {
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
      >Create project</Btn
    >
    <p role="status" r-text="feedback"></p>
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
    <Btn variant="link" tone="neutral" icon="tabler:refresh" @click="reset"
      >Reset</Btn
    >
  </Grid>
</Grid>`

export function defineButtonsExampleComponents() {
  return {
    DocsButtonPlayground: defineComponent<DocsButtonPlayground>(
      buttonPlaygroundTemplate,
      { context: createButtonPlayground },
    ),
  }
}

function createButtonPlayground(): DocsButtonPlayground {
  const tone = ref<SemanticTone>('accent'),
    variant = ref<ComponentVariant>('solid'),
    size = ref<BtnSize>('md'),
    icon = ref('tabler:plus'),
    position = ref<BtnIconPosition>('start'),
    iconOnly = ref(false),
    disabled = ref(false),
    feedback = ref('Click the button to try it.'),
    count = ref(0)
  // Component props need refs to retain updates after the component is created.
  const resolvedIcon = computed(() => (icon() === 'none' ? '' : icon()))
  const resolvedIconOnly = computed(() => iconOnly() && resolvedIcon() !== '')
  const reset = () => {
    tone('accent')
    variant('solid')
    size('md')
    icon('tabler:plus')
    position('start')
    iconOnly(false)
    disabled(false)
    count(0)
    feedback('Click the button to try it.')
  }
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

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
  type SRef,
  sref,
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

export interface DocsButtonEvents {
  items: SRef<string[]>
  limit: number
  summary: ComputedRef<string>
  isEmpty: ComputedRef<boolean>
  isFull: ComputedRef<boolean>
  addItem: () => void
  removeItem: () => void
  reset: () => void
}

export interface DocsButtonForm {
  project: Ref<string>
  message: Ref<string>
  submit: () => void
  resetForm: () => void
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

const buttonEventsTemplate = html`<Flex direction="column" align="start">
  <strong>Build a collection</strong>
  <p>Add up to {{ limit }} items. Remove one or start over.</p>
  <p role="status" r-text="summary"></p>
  <ul r-if="!isEmpty" aria-label="Collection items">
    <li r-for="item in items" r-text="item"></li>
  </ul>
  <Flex wrap="true">
    <Btn tone="accent" :disabled="isFull" @click="addItem">Add item</Btn>
    <Btn tone="neutral" variant="surface" :disabled="isEmpty" @click="removeItem">Remove item</Btn>
    <Btn tone="neutral" variant="link" :disabled="isEmpty" @click="reset">Reset</Btn>
  </Flex>
</Flex>`

const buttonFormTemplate = html`<form @submit.prevent="submit" @reset.prevent="resetForm">
  <FormInputField
    id="demo-project-name"
    label="Project name"
    :model="project"
    name="project"
    :required="true"/>
  <Flex
    ><Btn type="submit" tone="accent">Save project</Btn
    ><Btn type="reset" variant="surface" tone="neutral">Reset</Btn></Flex
  >
  <p role="status" r-text="message"></p>
</form>`

export function defineButtonsExampleComponents() {
  return {
    DocsButtonPlayground: defineComponent<DocsButtonPlayground>(
      buttonPlaygroundTemplate,
      { context: createButtonPlayground },
    ),
    DocsButtonEvents: defineComponent<DocsButtonEvents>(buttonEventsTemplate, {
      context: createButtonEvents,
    }),
    DocsButtonForm: defineComponent<DocsButtonForm>(buttonFormTemplate, {
      context: createButtonForm,
    }),
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

function createButtonEvents(): DocsButtonEvents {
  const items = sref<string[]>([])
  const limit = 5
  let nextItem = 1
  const isEmpty = computed(() => items().length === 0)
  const isFull = computed(() => items().length === limit)
  const summary = computed(() =>
    isFull()
      ? `Collection full: ${limit} items.`
      : `${items().length} ${items().length === 1 ? 'item' : 'items'} in your collection.`,
  )
  return {
    items,
    limit,
    summary,
    isEmpty,
    isFull,
    addItem: () => {
      if (!isFull()) items([...items(), `Item ${nextItem++}`])
    },
    removeItem: () => {
      if (!isEmpty()) items(items().slice(0, -1))
    },
    reset: () => {
      items([])
      nextItem = 1
    },
  }
}

function createButtonForm(): DocsButtonForm {
  const project = ref('My next idea')
  const message = ref('Changes stay in this demo.')
  return {
    project,
    message,
    submit: () => message(`Saved “${project()}”.`),
    resetForm: () => {
      project('My next idea')
      message('Form reset.')
    },
  }
}

import {
  type ComponentVariant,
  defineBtnGroupComponents,
  defineButtonComponents,
  defineFlexComponents,
} from '@purestack/ts-components'
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

export interface FormattingControls {
  bold: Ref<boolean>
  italic: Ref<boolean>
  boldVariant: ComputedRef<ComponentVariant>
  italicVariant: ComputedRef<ComponentVariant>
  textStyle: ComputedRef<{ fontWeight: string; fontStyle: string }>
  summary: ComputedRef<string>
  toggleBold: () => void
  toggleItalic: () => void
  reset: () => void
}

const formattingControlsTemplate = html`<Flex direction="column" align="start">
  <BtnGroup :wrap="true" role="group" aria-label="Text formatting">
    <Btn :variant="boldVariant" tone="accent" :aria-pressed="bold" @click="toggleBold">Bold</Btn>
    <Btn :variant="italicVariant" tone="accent" :aria-pressed="italic" @click="toggleItalic">Italic</Btn>
    <Btn variant="link" @click="reset">Reset</Btn>
  </BtnGroup>
  <p :style="textStyle">Build something worth sharing.</p>
  <p role="status" class="m-0">{{ summary }}</p>
</Flex>`

function createFormattingControls(): FormattingControls {
  const bold = ref(false)
  const italic = ref(false)
  const boldVariant = computed<ComponentVariant>(() =>
    bold() ? 'solid' : 'surface',
  )
  const italicVariant = computed<ComponentVariant>(() =>
    italic() ? 'solid' : 'surface',
  )
  const textStyle = computed(() => ({
    fontWeight: bold() ? '700' : '400',
    fontStyle: italic() ? 'italic' : 'normal',
  }))
  const summary = computed(() => {
    const active = [bold() ? 'bold' : '', italic() ? 'italic' : ''].filter(
      Boolean,
    )
    return active.length
      ? `Formatting: ${active.join(' and ')}.`
      : 'Formatting: normal.'
  })
  return {
    bold,
    italic,
    boldVariant,
    italicVariant,
    textStyle,
    summary,
    toggleBold: () => bold(!bold()),
    toggleItalic: () => italic(!italic()),
    reset: () =>
      batch(() => {
        bold(false)
        italic(false)
      }),
  }
}

const component = defineComponent<FormattingControls>(
  formattingControlsTemplate,
  { context: createFormattingControls },
)

createApp(
  {
    components: {
      FormattingControls: component,
      ...defineBtnGroupComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
    },
  },
  {
    selector: 'app#formatting-controls-demo',
    template: html`<FormattingControls/>`,
  },
)

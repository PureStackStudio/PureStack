import {
  type BtnGroupDropDownAlign,
  type BtnIconPosition,
  type BtnSize,
  type ComponentVariant,
  type ComponentVariantMode,
  defineBadgeComponents,
  defineBtnGroupComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { SEMANTIC_TONES, type SemanticTone } from '@purestack/ts-style'
import {
  iconoir_calendar,
  iconoir_more_horiz,
  lucide_chevron_down,
} from '@purestack/ts-svg-icons'
import { batch, createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface DropdownPlayground {
  triggerLabel: Ref<string>
  triggerAriaLabel: Ref<string>
  triggerIcon: Ref<string>
  triggerPosition: Ref<BtnIconPosition>
  triggerIconOnly: Ref<boolean>
  triggerTone: Ref<SemanticTone>
  triggerSize: Ref<BtnSize>
  triggerVariant: Ref<ComponentVariant>
  triggerMode: Ref<ComponentVariantMode>
  panelTone: Ref<SemanticTone>
  panelVariant: Ref<ComponentVariant>
  panelMode: Ref<ComponentVariantMode>
  panelAlign: Ref<BtnGroupDropDownAlign>
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  sizes: FormSelectOption[]
  modes: FormSelectOption[]
  positions: FormSelectOption[]
  alignments: FormSelectOption[]
  icons: FormSelectOption[]
  reset: () => void
}

const dropdownPlaygroundTemplate = html`<Flex direction="column">
  <Flex justify="center" align="center" class="p-4">
    <BtnGroupDropDown
      :label="triggerLabel"
      :ariaLabel="triggerAriaLabel"
      :icon="triggerIcon"
      :iconPosition="triggerPosition"
      :iconOnly="triggerIconOnly"
      :tone="triggerTone"
      :size="triggerSize"
      :variant="triggerVariant"
      :variantMode="triggerMode"
      :menuTone="panelTone"
      :menuVariant="panelVariant"
      :menuVariantMode="panelMode"
      :align="panelAlign"
    >
      <div class="p-2 fs-xs tone-text-muted">Component guides <Badge>3</Badge></div>
      <BtnLink href="/components/actions/buttons/" variant="subtle">Buttons</BtnLink>
      <BtnLink href="/components/actions/btn-link/" variant="subtle">BtnLink</BtnLink>
      <BtnLink href="/components/actions/badge/" variant="subtle">Badge</BtnLink>
    </BtnGroupDropDown>
  </Flex>
  <Grid columns="1" columnsSm="2" columnsLg="3">
    <FormInputField id="dropdown-label" label="Trigger label" :model="triggerLabel"/>
    <FormInputField id="dropdown-aria-label" label="Accessible name" :model="triggerAriaLabel"/>
    <FormSelectField id="dropdown-icon" label="Icon" :model="triggerIcon" :options="icons"/>
    <FormSelectField id="dropdown-position" label="Icon position" :model="triggerPosition" :options="positions"/>
    <FormSelectField id="dropdown-tone" label="Trigger tone" :model="triggerTone" :options="tones"/>
    <FormSelectField id="dropdown-size" label="Trigger size" :model="triggerSize" :options="sizes"/>
    <FormSelectField id="dropdown-variant" label="Trigger variant" :model="triggerVariant" :options="variants"/>
    <FormSelectField id="dropdown-mode" label="Trigger variant mode" :model="triggerMode" :options="modes"/>
    <FormSelectField id="dropdown-menu-tone" label="Menu tone" :model="panelTone" :options="tones"/>
    <FormSelectField id="dropdown-menu-variant" label="Menu variant" :model="panelVariant" :options="variants"/>
    <FormSelectField id="dropdown-menu-mode" label="Menu variant mode" :model="panelMode" :options="modes"/>
    <FormSelectField id="dropdown-align" label="Menu alignment" :model="panelAlign" :options="alignments"/>
  </Grid>
  <Flex wrap="true" align="center">
    <FormCheck id="dropdown-icon-only" label="Icon-only trigger" :checked="triggerIconOnly"/>
    <Btn variant="link" @click="reset">Reset playground</Btn>
  </Flex>
</Flex>`

function createDropdownPlayground(): DropdownPlayground {
  const triggerLabel = ref('Explore')
  const triggerAriaLabel = ref('')
  const triggerIcon = ref('lucide:chevron-down')
  const triggerPosition = ref<BtnIconPosition>('end')
  const triggerIconOnly = ref(false)
  const triggerTone = ref<SemanticTone>('accent')
  const triggerSize = ref<BtnSize>('md')
  const triggerVariant = ref<ComponentVariant>('solid')
  const triggerMode = ref<ComponentVariantMode>('stateful')
  const panelTone = ref<SemanticTone>('neutral')
  const panelVariant = ref<ComponentVariant>('surfaceAlt')
  const panelMode = ref<ComponentVariantMode>('stateless')
  const panelAlign = ref<BtnGroupDropDownAlign>('end')
  const options = (values: string[]): FormSelectOption[] =>
    values.map((value) => ({ label: value, value }))
  return {
    triggerLabel,
    triggerAriaLabel,
    triggerIcon,
    triggerPosition,
    triggerIconOnly,
    triggerTone,
    triggerSize,
    triggerVariant,
    triggerMode,
    panelTone,
    panelVariant,
    panelMode,
    panelAlign,
    tones: options(SEMANTIC_TONES),
    variants: options([
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
      'none',
    ]),
    sizes: options(['sm', 'md', 'lg']),
    modes: options(['stateful', 'stateless']),
    positions: options(['start', 'end']),
    alignments: options(['start', 'end']),
    icons: options([
      'lucide:chevron-down',
      'iconoir:more-horiz',
      'iconoir:calendar',
    ]),
    reset: () =>
      batch(() => {
        triggerLabel('Explore')
        triggerAriaLabel('')
        triggerIcon('lucide:chevron-down')
        triggerPosition('end')
        triggerIconOnly(false)
        triggerTone('accent')
        triggerSize('md')
        triggerVariant('solid')
        triggerMode('stateful')
        panelTone('neutral')
        panelVariant('surfaceAlt')
        panelMode('stateless')
        panelAlign('end')
      }),
  }
}

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'iconoir:more-horiz': iconoir_more_horiz,
  'iconoir:calendar': iconoir_calendar,
}
const component = defineComponent<DropdownPlayground>(
  dropdownPlaygroundTemplate,
  { context: createDropdownPlayground },
)

createApp(
  {
    components: {
      DropdownPlayground: component,
      ...defineBadgeComponents(),
      ...defineBtnGroupComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => {
        if (!icons[name]) throw new Error(`Icon is not registered: ${name}`)
        return icons[name]
      }),
    },
  },
  {
    selector: 'app#dropdown-playground',
    template: html`<DropdownPlayground/>`,
  },
)

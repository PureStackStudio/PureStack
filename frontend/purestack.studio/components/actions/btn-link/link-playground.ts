import {
  type BtnIconPosition,
  type BtnSize,
  type ComponentVariant,
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
  lucide_chevron_down,
  tabler_arrow_right,
  tabler_arrow_up_right,
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

export interface LinkPlayground {
  tone: Ref<SemanticTone>
  variant: Ref<ComponentVariant>
  size: Ref<BtnSize>
  href: Ref<string>
  target: Ref<string>
  rel: Ref<string>
  icon: Ref<string>
  position: Ref<BtnIconPosition>
  iconOnly: Ref<boolean>
  linkLabel: Ref<string>
  resolvedIcon: ComputedRef<string>
  resolvedIconOnly: ComputedRef<boolean>
  effectiveRel: ComputedRef<string>
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  sizes: FormSelectOption[]
  destinations: FormSelectOption[]
  targets: FormSelectOption[]
  relationships: FormSelectOption[]
  icons: FormSelectOption[]
  positions: FormSelectOption[]
  reset: () => void
}

const linkPlaygroundTemplate = html`<Flex direction="column">
  <Flex align="center" justify="center" class="p-4">
    <BtnLink
      :href="href"
      :target="target"
      :rel="rel"
      :tone="tone"
      :variant="variant"
      :size="size"
      :icon="resolvedIcon"
      :iconPosition="position"
      :iconOnly="resolvedIconOnly"
      :ariaLabel="linkLabel"
    >{{ linkLabel }}</BtnLink>
  </Flex>
  <p role="status" class="m-0">Destination: <code>{{ href }}</code> · Target: <code>{{ target }}</code> · Rel: <code>{{ effectiveRel }}</code></p>
  <Grid columns="1" columnsSm="2" columnsLg="3">
    <FormInputField id="link-label" label="Label / accessible name" :model="linkLabel"/>
    <FormSelectField id="link-href" label="Destination" :model="href" :options="destinations"/>
    <FormSelectField id="link-target" label="Target" :model="target" :options="targets"/>
    <FormSelectField id="link-rel" label="Relationship" :model="rel" :options="relationships"/>
    <FormSelectField id="link-tone" label="Tone" :model="tone" :options="tones"/>
    <FormSelectField id="link-variant" label="Variant" :model="variant" :options="variants"/>
    <FormSelectField id="link-size" label="Size" :model="size" :options="sizes"/>
    <FormSelectField id="link-icon" label="Icon" :model="icon" :options="icons"/>
    <FormSelectField id="link-position" label="Icon position" :model="position" :options="positions"/>
  </Grid>
  <Flex align="center" wrap="true">
    <FormCheck id="link-icon-only" label="Icon only" :checked="iconOnly"/>
    <Btn variant="link" @click="reset">Reset playground</Btn>
  </Flex>
</Flex>`

function createLinkPlayground(): LinkPlayground {
  const tone = ref<SemanticTone>('accent')
  const variant = ref<ComponentVariant>('solid')
  const size = ref<BtnSize>('md')
  const href = ref('#link-destination')
  const target = ref('_self')
  const rel = ref('')
  const icon = ref('tabler:arrow-right')
  const position = ref<BtnIconPosition>('end')
  const iconOnly = ref(false)
  const linkLabel = ref('Explore the destination')
  const resolvedIcon = computed(() => (icon() === 'none' ? '' : icon()))
  const resolvedIconOnly = computed(() => iconOnly() && resolvedIcon() !== '')
  const effectiveRel = computed(
    () => rel() || (target() === '_blank' ? 'noopener noreferrer' : 'not set'),
  )
  const options = (values: string[]): FormSelectOption[] =>
    values.map((value) => ({ label: value, value }))
  return {
    tone,
    variant,
    size,
    href,
    target,
    rel,
    icon,
    position,
    iconOnly,
    linkLabel,
    resolvedIcon,
    resolvedIconOnly,
    effectiveRel,
    tones: options(SEMANTIC_TONES),
    variants: options([
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
    ]),
    sizes: options(['sm', 'md', 'lg']),
    destinations: [
      { label: 'This page’s destination', value: '#link-destination' },
      { label: 'Buttons documentation', value: '/components/actions/buttons/' },
      { label: 'Badge documentation', value: '/components/actions/badge/' },
    ],
    targets: [
      { label: 'Current tab (_self)', value: '_self' },
      { label: 'New tab (_blank)', value: '_blank' },
    ],
    relationships: [
      { label: 'Automatic', value: '' },
      {
        label: 'nofollow + noopener + noreferrer',
        value: 'nofollow noopener noreferrer',
      },
    ],
    icons: options(['none', 'tabler:arrow-right', 'tabler:arrow-up-right']),
    positions: options(['start', 'end']),
    reset: () => {
      icon('tabler:arrow-right')
      iconOnly(false)
      position('end')
      tone('accent')
      variant('solid')
      size('md')
      href('#link-destination')
      target('_self')
      rel('')
      linkLabel('Explore the destination')
    },
  }
}

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'tabler:arrow-right': tabler_arrow_right,
  'tabler:arrow-up-right': tabler_arrow_up_right,
}
const component = defineComponent<LinkPlayground>(linkPlaygroundTemplate, {
  context: createLinkPlayground,
})

createApp(
  {
    components: {
      LinkPlayground: component,
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
  { selector: 'app#link-playground', template: html`<LinkPlayground/>` },
)

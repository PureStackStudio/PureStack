import {
  type ComponentVariant,
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import { SEMANTIC_TONES, type SemanticTone } from '@purestack/ts-style'
import { lucide_chevron_down } from '@purestack/ts-svg-icons'
import { batch, createApp, defineComponent, html, type Ref, ref } from 'regor'

export interface BadgePlayground {
  badgeLabel: Ref<string>
  tone: Ref<SemanticTone>
  variant: Ref<ComponentVariant>
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  reset: () => void
}

const badgePlaygroundTemplate = html`<Flex direction="column">
  <Flex align="center" justify="center" class="p-4">
    <Badge :tone="tone" :variant="variant">{{ badgeLabel }}</Badge>
  </Flex>
  <Grid columns="1" columnsSm="2" columnsLg="3">
    <FormInputField id="badge-label" label="Label" :model="badgeLabel"/>
    <FormSelectField id="badge-tone" label="Tone" :model="tone" :options="tones"/>
    <FormSelectField id="badge-variant" label="Variant" :model="variant" :options="variants"/>
  </Grid>
  <Btn variant="link" @click="reset">Reset playground</Btn>
</Flex>`

function createBadgePlayground(): BadgePlayground {
  const badgeLabel = ref('Stable')
  const tone = ref<SemanticTone>('success')
  const variant = ref<ComponentVariant>('surface')
  return {
    badgeLabel,
    tone,
    variant,
    tones: SEMANTIC_TONES.map((value) => ({ label: value, value })),
    variants: [
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
    ].map((value) => ({ label: value, value })),
    reset: () =>
      batch(() => {
        badgeLabel('Stable')
        tone('success')
        variant('surface')
      }),
  }
}

const component = defineComponent<BadgePlayground>(badgePlaygroundTemplate, {
  context: createBadgePlayground,
})

createApp(
  {
    components: {
      BadgePlayground: component,
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => {
        if (name !== 'lucide:chevron-down')
          throw new Error(`Icon is not registered: ${name}`)
        return lucide_chevron_down
      }),
    },
  },
  { selector: 'app#badge-playground', template: html`<BadgePlayground/>` },
)

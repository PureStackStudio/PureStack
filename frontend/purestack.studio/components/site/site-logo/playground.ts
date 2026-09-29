import {
  defineBadgeComponents,
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  defineLogoComponents,
  definePanelComponents,
  type FormSelectOption,
  type LogoConfig,
} from '@purestack/ts-components'
import { lucide_chevron_down, tabler_stack_2 } from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'

export interface LogoPlayground {
  brandName: Ref<string>
  tagline: Ref<string>
  punctuation: Ref<string>
  logoLayout: Ref<NonNullable<LogoConfig['layout']>>
  logoSize: Ref<NonNullable<LogoConfig['size']>>
  treatment: Ref<NonNullable<LogoConfig['appearance']>>
  markTreatment: Ref<NonNullable<LogoConfig['markStyle']>>
  wordmarkTreatment: Ref<NonNullable<LogoConfig['wordmarkStyle']>>
  markShape: Ref<NonNullable<LogoConfig['shape']>>
  logoTone: Ref<NonNullable<LogoConfig['tone']>>
  markSource: Ref<string>
  customAccent: Ref<string>
  spacing: Ref<string>
  linked: Ref<boolean>
  previewConfig: ComputedRef<LogoConfig>
  configSource: ComputedRef<string>
  layouts: FormSelectOption[]
  sizes: FormSelectOption[]
  spacings: FormSelectOption[]
  treatments: FormSelectOption[]
  marks: FormSelectOption[]
  wordmarks: FormSelectOption[]
  shapes: FormSelectOption[]
  tones: FormSelectOption[]
  sources: FormSelectOption[]
  reset: () => void
}

const logoPlaygroundTemplate = html`<Flex direction="column">
  <Panel variant="surfaceAlt" bodyClass="p-4 min-w-0">
    <Flex justify="between" align="center" wrap="true">
      <p class="text-eyebrow m-0">Your brand, your presentation</p>
      <Badge tone="accent" variant="surface">Live preview</Badge>
    </Flex>
    <Flex align="center" justify="center" class="py-5">
      <SiteLogo id="logo-preview" :config="previewConfig"/>
    </Flex>
    <p class="text-muted m-0">Switch the site theme to see the same logo in light and dark.</p>
  </Panel>
  <Grid columns="1" columnsMd="3">
    <FormInputField id="logo-brand" label="Brand name" :model="brandName"/>
    <FormInputField id="logo-subtitle" label="Subtitle" :model="tagline" placeholder="Optional tagline"/>
    <FormInputField id="logo-suffix" label="Accented suffix" :model="punctuation"/>
    <FormSelectField id="logo-layout" label="Layout" :model="logoLayout" :options="layouts"/>
    <FormSelectField id="logo-size" label="Size" :model="logoSize" :options="sizes"/>
    <FormSelectField id="logo-gap" label="Mark-to-title spacing" :model="spacing" :options="spacings" :disabled="logoLayout === 'mark' || logoLayout === 'wordmark'"/>
    <FormSelectField id="logo-appearance" label="Appearance" :model="treatment" :options="treatments"/>
    <FormSelectField id="logo-mark" label="Mark treatment" :model="markTreatment" :options="marks"/>
    <FormSelectField id="logo-wordmark" label="Wordmark treatment" :model="wordmarkTreatment" :options="wordmarks"/>
    <FormSelectField id="logo-shape" label="Mark shape" :model="markShape" :options="shapes"/>
    <FormSelectField id="logo-tone" label="Tone" :model="logoTone" :options="tones"/>
    <FormSelectField id="logo-source" label="Mark source" :model="markSource" :options="sources"/>
    <FormInputField id="logo-accent" label="Custom accent color" :model="customAccent" placeholder="Theme default, or #58a6ff"/>
  </Grid>
  <Flex justify="between" align="center" wrap="true">
    <FormCheck id="logo-linked" label="Link the preview to the home page" :checked="linked"/>
    <Btn variant="outline" @click="reset">Reset playground</Btn>
  </Flex>
  <Panel variant="outline" bodyClass="p-3 min-w-0">
    <p class="text-eyebrow mt-0">Live configuration</p>
    <pre class="overflow-auto max-h-inspector m-0"><code id="logo-config-output">{{ configSource }}</code></pre>
  </Panel>
</Flex>`

function createLogoPlayground(): LogoPlayground {
  const brandName = ref('PureStack')
  const tagline = ref('')
  const punctuation = ref('.')
  const logoLayout = ref<NonNullable<LogoConfig['layout']>>('horizontal')
  const logoSize = ref<NonNullable<LogoConfig['size']>>('md')
  const treatment = ref<NonNullable<LogoConfig['appearance']>>('plain')
  const markTreatment = ref<NonNullable<LogoConfig['markStyle']>>('plain')
  const wordmarkTreatment =
    ref<NonNullable<LogoConfig['wordmarkStyle']>>('plain')
  const markShape = ref<NonNullable<LogoConfig['shape']>>('rounded')
  const logoTone = ref<NonNullable<LogoConfig['tone']>>('accent')
  const markSource = ref('icon')
  const customAccent = ref('')
  const spacing = ref('')
  const linked = ref(false)
  const previewConfig = computed<LogoConfig>(() => ({
    brand: brandName(),
    subtitle: tagline(),
    suffix: punctuation(),
    href: linked() ? '/' : null,
    layout: logoLayout(),
    size: logoSize(),
    appearance: treatment(),
    markStyle: markTreatment(),
    wordmarkStyle: wordmarkTreatment(),
    shape: markShape(),
    tone: logoTone(),
    icon: markSource() === 'icon' ? 'tabler:stack-2' : undefined,
    imageSrc:
      markSource() === 'image' ? '/assets/pure-stack-logo.png' : undefined,
    accentColor: customAccent() || undefined,
    gap: spacing() || undefined,
  }))
  return {
    brandName,
    tagline,
    punctuation,
    logoLayout,
    logoSize,
    treatment,
    markTreatment,
    wordmarkTreatment,
    markShape,
    logoTone,
    markSource,
    customAccent,
    spacing,
    linked,
    previewConfig,
    configSource: computed(() => JSON.stringify(previewConfig(), null, 2)),
    layouts: ['horizontal', 'stacked', 'wordmark', 'mark'].map((value) => ({
      label: value,
      value,
    })),
    sizes: ['sm', 'md', 'lg', 'xl'].map((value) => ({ label: value, value })),
    spacings: [
      { label: 'Default (compact)', value: '' },
      { label: 'None · 0px', value: '0px' },
      { label: 'Tight · 4px', value: '0.25rem' },
      { label: 'Compact · 6px', value: '0.375rem' },
      { label: 'Comfortable · 8px', value: '0.5rem' },
      { label: 'Relaxed · 12px', value: '0.75rem' },
      { label: 'Wide · 16px', value: '1rem' },
    ],
    treatments: ['plain', 'badge', 'outline'].map((value) => ({
      label: value,
      value,
    })),
    marks: ['plain', 'soft', 'solid', 'outline'].map((value) => ({
      label: value,
      value,
    })),
    wordmarks: ['plain', 'accent', 'gradient'].map((value) => ({
      label: value,
      value,
    })),
    shapes: ['rounded', 'square', 'circle'].map((value) => ({
      label: value,
      value,
    })),
    tones: [
      'accent',
      'neutral',
      'secondary',
      'info',
      'success',
      'warning',
      'danger',
      'feature',
    ].map((value) => ({ label: value, value })),
    sources: [
      { label: 'Registered icon', value: 'icon' },
      { label: 'Image', value: 'image' },
      { label: 'Monogram', value: 'monogram' },
    ],
    reset: () => {
      brandName('PureStack')
      tagline('')
      punctuation('.')
      logoLayout('horizontal')
      logoSize('md')
      treatment('plain')
      markTreatment('plain')
      wordmarkTreatment('plain')
      markShape('rounded')
      logoTone('accent')
      markSource('icon')
      customAccent('')
      spacing('')
      linked(false)
    },
  }
}

const logoPlayground = defineComponent<LogoPlayground>(logoPlaygroundTemplate, {
  context: createLogoPlayground,
})
const icons: Record<string, string> = {
  'tabler:stack-2': tabler_stack_2,
  'lucide:chevron-down': lucide_chevron_down,
}
createApp(
  {
    components: {
      LogoPlayground: logoPlayground,
      ...defineLogoComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...definePanelComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#logo-playground', template: html`<LogoPlayground/>` },
)

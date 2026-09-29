import {
  type ClassicLogoConfig,
  defineButtonComponents,
  defineClassicLogoComponents,
  defineFlexComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  defineLogoComponents,
  definePanelComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import {
  lucide_chevron_down,
  tabler_device_desktop_analytics,
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

export interface ClassicLogoPlayground {
  brand: Ref<string>
  subtitle: Ref<string>
  letterColors: Ref<string>
  subtitleLetterColors: Ref<string>
  accent: Ref<string>
  component: Ref<string>
  componentOptions: FormSelectOption[]
  config: ComputedRef<ClassicLogoConfig>
  source: ComputedRef<string>
  reset: () => void
}

const classicLogoPlaygroundTemplate = html`<Flex direction="column">
  <Panel variant="surfaceAlt" bodyClass="p-4 min-w-0 overflow-auto">
    <p class="text-eyebrow mt-0">Original Studio identity</p>
    <div id="classic-preview" class="py-4"><div :is="component" :config="config"></div></div>
    <p class="text-muted mb-0">The original container, letter spacing, icon and responsive sizes. Switch the site theme to compare both skins.</p>
  </Panel>
  <Grid columns="1" columnsMd="2">
    <FormSelectField id="classic-component" label="Logo component" :model="component" :options="componentOptions"/>
    <FormInputField id="classic-brand" label="Brand" :model="brand"/>
    <FormInputField id="classic-subtitle" label="Subtitle" :model="subtitle"/>
    <FormInputField id="classic-colors" label="Brand color map" :model="letterColors" :disabled="component !== 'ClassicLogo'"/>
    <FormInputField id="classic-subtitle-colors" label="Subtitle color map" :model="subtitleLetterColors" :disabled="component !== 'ClassicLogo'"/>
    <FormInputField id="classic-accent" label="Palette color 2" :model="accent" :disabled="component !== 'ClassicLogo'"/>
  </Grid>
  <p class="text-muted m-0">Palette: 0 = subtle text, 1 = normal text, 2 = accent, 3 = white. Each digit colors one non-space character; the final digit repeats.</p>
  <Flex><Btn variant="outline" @click="reset">Restore original</Btn></Flex>
  <Panel variant="outline" bodyClass="p-3 min-w-0">
    <p class="text-eyebrow mt-0">siteConfig.json · logo</p>
    <pre class="overflow-auto max-h-inspector m-0"><code id="classic-config">{{ source }}</code></pre>
  </Panel>
</Flex>`

const classicLogoPlayground = defineComponent<ClassicLogoPlayground>(
  classicLogoPlaygroundTemplate,
  {
    context: () => {
      const brand = ref('PureStack')
      const subtitle = ref('AI-Native Frontend')
      const letterColors = ref('111122')
      const subtitleLetterColors = ref('0')
      const accent = ref(
        'var(--ps-semantic-tone-accent-button-rest-background)',
      )
      const component = ref('ClassicLogo')
      const config = computed<ClassicLogoConfig>(() => ({
        brand: brand(),
        subtitle: subtitle(),
        letterColors: letterColors(),
        subtitleLetterColors: subtitleLetterColors(),
        colors: [
          'var(--ps-current-text-subtle)',
          'var(--ps-current-text-default)',
          accent(),
          '#fdfdfd',
        ],
        logoBackground: 2,
        logoForeground: 3,
        icon: 'tabler:device-desktop-analytics',
        href: '/',
      }))
      return {
        brand,
        subtitle,
        letterColors,
        subtitleLetterColors,
        accent,
        component,
        config,
        componentOptions: ['ClassicLogo', 'SiteLogo'].map((value) => ({
          label: value,
          value,
        })),
        source: computed(() =>
          JSON.stringify({ component: component(), ...config() }, null, 2),
        ),
        reset: () => {
          brand('PureStack')
          subtitle('AI-Native Frontend')
          letterColors('111122')
          subtitleLetterColors('0')
          accent('var(--ps-semantic-tone-accent-button-rest-background)')
          component('ClassicLogo')
        },
      }
    },
  },
)

const icons: Record<string, string> = {
  'tabler:device-desktop-analytics': tabler_device_desktop_analytics,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      ClassicLogoPlayground: classicLogoPlayground,
      ...defineClassicLogoComponents(),
      ...defineLogoComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...definePanelComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#classic-logo-playground',
    template: html`<ClassicLogoPlayground/>`,
  },
)

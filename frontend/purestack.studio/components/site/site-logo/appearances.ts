import {
  defineFlexComponents,
  defineGridComponents,
  defineIconComponents,
  defineLogoComponents,
  definePanelComponents,
  type LogoConfig,
} from '@purestack/ts-components'
import { tabler_stack_2 } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html } from 'regor'

export interface LogoAppearances {
  identity: LogoConfig
}

const logoAppearancesTemplate = html`<Grid columns="1" columnsMd="2">
  <Panel variant="outline" bodyClass="p-4 min-w-0">
    <p class="text-eyebrow mt-0">Navigation</p>
    <SiteLogo :config="identity"/>
    <p class="text-muted mb-0">A quiet horizontal signature.</p>
  </Panel>
  <Panel variant="outline" bodyClass="p-4 min-w-0">
    <p class="text-eyebrow mt-0">Brand badge</p>
    <SiteLogo :config="identity" appearance="badge" markStyle="soft" size="sm"/>
    <p class="text-muted mb-0">A contained identity for cards and embeds.</p>
  </Panel>
  <Panel variant="outline" bodyClass="p-4 min-w-0">
    <p class="text-eyebrow mt-0">Centered signature</p>
    <Flex justify="center"><SiteLogo :config="identity" layout="stacked" subtitle="Pure frontend infrastructure" size="lg" markStyle="solid"/></Flex>
  </Panel>
  <Panel variant="outline" bodyClass="p-4 min-w-0">
    <p class="text-eyebrow mt-0">Wordmark</p>
    <SiteLogo :config="identity" layout="wordmark" wordmarkStyle="gradient" size="lg"/>
    <p class="text-muted mb-0">Typography with a theme-aware accent.</p>
  </Panel>
  <Panel variant="outline" bodyClass="p-4 min-w-0">
    <p class="text-eyebrow mt-0">Compact marks</p>
    <Flex align="center" wrap="true">
      <SiteLogo :config="identity" layout="mark" markStyle="solid" shape="circle" size="lg"/>
      <SiteLogo :config="identity" layout="mark" markStyle="outline" shape="square" size="lg"/>
      <SiteLogo brand="North Star" monogram="NS" :href="null" layout="mark" markStyle="soft" size="lg" tone="info"/>
    </Flex>
    <p class="text-muted mb-0">Full accessible names, even without a wordmark.</p>
  </Panel>
  <Panel variant="outline" bodyClass="p-4 min-w-0">
    <p class="text-eyebrow mt-0">Custom artwork</p>
    <SiteLogo brand="Orbit" subtitle="A mark slot for your own vector" :href="null" size="lg" appearance="outline" tone="info">
      <template #mark><svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="5" fill="currentColor"/>
        <ellipse cx="16" cy="16" rx="14" ry="7" stroke="currentColor" stroke-width="2" transform="rotate(-35 16 16)"/>
      </svg></template>
    </SiteLogo>
  </Panel>
</Grid>`

const logoAppearances = defineComponent<LogoAppearances>(
  logoAppearancesTemplate,
  {
    context: () => ({
      identity: {
        brand: 'PureStack',
        suffix: '.',
        icon: 'tabler:stack-2',
        href: null,
      },
    }),
  },
)
createApp(
  {
    components: {
      LogoAppearances: logoAppearances,
      ...defineLogoComponents(),
      ...defineFlexComponents(),
      ...defineGridComponents(),
      ...definePanelComponents(),
      ...defineIconComponents((name) =>
        name === 'tabler:stack-2' ? tabler_stack_2 : '',
      ),
    },
  },
  { selector: 'app#logo-appearances', template: html`<LogoAppearances/>` },
)

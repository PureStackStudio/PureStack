import { getThemePaletteVar } from '@purestack/ts-style'
import {
  defineComponent,
  html,
  type IRegorContext,
  type RefOrValue,
} from 'regor'

interface StudioFeature extends IRegorContext {
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  icon?: RefOrValue<string>
  href?: RefOrValue<string>
  linkLabel?: RefOrValue<string>
}

interface StudioPackage extends IRegorContext {
  number?: RefOrValue<string>
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  packageName?: RefOrValue<string>
  href?: RefOrValue<string>
}

interface StudioCopy extends IRegorContext {
  target?: RefOrValue<string>
  label?: RefOrValue<string>
  iconOnly?: RefOrValue<boolean>
}

interface StudioFaq extends IRegorContext {
  title?: RefOrValue<string>
}

interface StudioCommand extends StudioCopy {
  description?: RefOrValue<string>
  command?: RefOrValue<string>
}

export function defineStudioComponents() {
  return {
    studioBrand:
      defineComponent(html`<a class="wordmark" href="/" aria-label="PureStack home">
      <span class="brand-mark" aria-hidden="true"><Icon name="tabler:stack-2"/></span>
      <span>PureStack<span class="brand-period">.</span></span>
    </a>`),
    studioFeature: defineComponent<StudioFeature>(
      html`<Panel
      class="feature-card" bodyClass="feature-card__body" tone="neutral" variant="surface"
    >
      <IconFrame class="feature-icon" :name="icon" tone="accent" variant="surface"/>
      <SectionHeader :title="title" :subtitle="summary" titleTag="h3" titleClass="feature-title" subtitleClass="feature-summary">
        <slot></slot>
      </SectionHeader>
      <BtnLink r-if="href" class="text-link" :href="href" tone="accent" variant="link" icon="tabler:arrow-up-right" iconPosition="end">{{ linkLabel }}</BtnLink>
    </Panel>`,
      { props: ['title', 'summary', 'icon', 'href', 'linkLabel'] },
    ),
    studioPackage: defineComponent<StudioPackage>(
      html`<a class="package-card" :href="href">
      <span class="package-number">{{ number }}</span>
      <SectionHeader :title="title" :subtitle="summary" titleTag="h3">
        <code>{{ packageName }}</code>
      </SectionHeader>
      <Icon name="tabler:arrow-up-right" aria-hidden="true"/>
    </a>`,
      { props: ['number', 'title', 'summary', 'packageName', 'href'] },
    ),
    studioCopy: defineComponent<StudioCopy>(
      html`<Btn
      class="copy-button" :class="iconOnly ? 'icon-only' : ''"
      :data-copy="target" :ariaLabel="label" :iconOnly="iconOnly"
      tone="neutral" variant="subtle" icon="tabler:copy"
    >Copy</Btn>`,
      { props: ['target', 'label', 'iconOnly'] },
    ),
    studioFaq: defineComponent<StudioFaq>(
      html`<ExpandablePanel :title="title" tone="neutral" variant="none" summaryVariant="none">
      <p><slot></slot></p>
    </ExpandablePanel>`,
      { props: ['title'] },
    ),
    studioCommand: defineComponent<StudioCommand>(
      html`<div class="terminal-command">
      <span class="syntax-muted">{{ description }}</span>
      <pre><code :id="target">{{ command }}</code></pre>
      <StudioCopy :target="target" :label="label" :iconOnly="true"/>
    </div>`,
      { props: ['target', 'label', 'description', 'command'] },
    ),
    studioActivityChart: defineComponent(
      html`<BarChart
      ariaLabel="Example activity across twelve days; illustrative data"
      :items="items" :minValue="0" :maxValue="100" :animated="false"
      :showValues="false" :showLabels="false" :showAxis="false"
      width="100%" height="90" preserveAspectRatio="none" variant="none"
    />`,
      {
        context: () => ({
          items: [25, 42, 32, 57, 46, 64, 52, 71, 61, 85, 72, 98].map(
            (value, index) => ({
              label: String(index + 1).padStart(2, '0'),
              value,
              color: getThemePaletteVar(
                index === 11
                  ? 'semanticTone.accent.text.default'
                  : index % 2 === 0
                    ? 'semanticTone.success.surface.rest.border'
                    : 'semanticTone.accent.surface.hover.border',
              ),
            }),
          ),
        }),
      },
    ),
    studioWorkbench:
      defineComponent(html`<Panel class="workbench" bodyClass="workbench__body" variant="surface" tone="neutral">
      <Flex class="workbench-toolbar" align="center">
        <Flex class="window-dots" aria-hidden="true"><i></i><i></i><i></i></Flex>
        <span class="workbench-title">a little source. a lot of possibility.</span>
        <span class="workbench-language">TypeScript + MDX</span>
      </Flex>
      <Tabs class="studio-tabs" group="workbench" selectedTab="content" ariaLabel="Explore PureStack examples" tone="neutral" variant="none" tabVariant="none">
        <TabPane id="content" label="index.mdx" icon="tabler:file-code"><slot name="content"></slot></TabPane>
        <TabPane id="interactive" label="counter.ts" icon="tabler:braces"><slot name="interactive"></slot></TabPane>
        <TabPane id="style" label="styles.ts" icon="tabler:palette"><slot name="style"></slot></TabPane>
      </Tabs>
      <Flex class="workbench-status" align="center" justify="between">
        <span><Icon name="tabler:check"/>Same source. Connected workflow.</span>
        <span>Made with PureStack <Icon name="tabler:stack-2"/></span>
      </Flex>
    </Panel>`),
  }
}

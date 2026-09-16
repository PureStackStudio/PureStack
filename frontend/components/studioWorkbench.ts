import { defineComponent, html } from 'regor'

export interface StudioWorkbench {}

const studioWorkbenchTemplate = html`<Panel
  class="workbench"
  bodyClass="workbench__body"
  variant="surface"
  tone="neutral"
>
  <Flex class="workbench-toolbar" align="center">
    <Flex class="window-dots" aria-hidden="true"><i></i><i></i><i></i></Flex>
    <span class="workbench-title">a little source. a lot of possibility.</span>
    <span class="workbench-language">TypeScript + MDX</span>
  </Flex>
  <Tabs
    class="studio-tabs"
    group="workbench"
    selectedTab="content"
    ariaLabel="Explore PureStack examples"
    tone="neutral"
    variant="none"
    tabVariant="none"
  >
    <TabPane id="content" label="index.mdx" icon="tabler:file-code"
      ><slot name="content"></slot
    ></TabPane>
    <TabPane id="interactive" label="counter.ts" icon="tabler:braces"
      ><slot name="interactive"></slot
    ></TabPane>
    <TabPane id="style" label="styles.ts" icon="tabler:palette"
      ><slot name="style"></slot
    ></TabPane>
  </Tabs>
  <Flex class="workbench-status" align="center" justify="between">
    <span><Icon name="tabler:check"/>Same source. Connected workflow.</span>
    <span>Made with PureStack <Icon name="tabler:stack-2"/></span>
  </Flex>
</Panel>`

export function defineStudioWorkbenchComponent() {
  return defineComponent<StudioWorkbench>(studioWorkbenchTemplate)
}

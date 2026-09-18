import { defineComponent, html, type Ref, ref } from 'regor'

export interface DocsTabsState {
  selected: Ref<string>
  showSettings: () => void
}

const tabsStateTemplate = html`<Flex direction="column">
  <Tabs
    group="controlled-demo"
    :selectedTab="selected"
    ariaLabel="Controlled tabs"
  >
    <TabPane id="controlled-preview" label="Preview"
      ><p>Preview your changes here.</p></TabPane
    >
    <TabPane id="controlled-settings" label="Settings"
      ><p>Configure the project here.</p></TabPane
    >
  </Tabs>
  <p role="status">Selected pane: <code>{{ selected }}</code></p>
  <Btn variant="surface" tone="accent" @click="showSettings"
    >Go to settings</Btn
  >
</Flex>`

export function defineTabsExampleComponents() {
  return {
    DocsTabsState: defineComponent<DocsTabsState>(tabsStateTemplate, {
      context: createTabsState,
    }),
  }
}

function createTabsState(): DocsTabsState {
  const selected = ref('controlled-preview')
  return { selected, showSettings: () => selected('controlled-settings') }
}

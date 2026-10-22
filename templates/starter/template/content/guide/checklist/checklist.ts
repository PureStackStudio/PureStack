import { createApp, html } from 'regor'
import { defineLaunchChecklistComponent } from './checklist-component'

createApp(
  { components: { launchChecklist: defineLaunchChecklistComponent() } },
  { selector: '#launch-checklist', template: html`<LaunchChecklist/>` },
)

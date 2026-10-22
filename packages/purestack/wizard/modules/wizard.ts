import { createApp, html } from 'regor'
import { defineWizardComponents } from './components'

createApp(
  { components: defineWizardComponents() },
  { selector: '#wizard-app', template: html`<WizardDashboard/>` },
)

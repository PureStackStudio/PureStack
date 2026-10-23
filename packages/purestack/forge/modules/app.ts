import { createApp, html } from 'regor'
import { defineComponents } from './components'

createApp(
  { components: defineComponents() },
  { selector: '#forge-app', template: html`<Dashboard/>` },
)

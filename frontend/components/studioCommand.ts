import { defineComponent, html, type RefOrValue } from 'regor'

export interface StudioCommand {
  target?: RefOrValue<string>
  label?: RefOrValue<string>
  description?: RefOrValue<string>
  command?: RefOrValue<string>
}

const studioCommandTemplate = html`<div class="terminal-command">
  <span class="syntax-muted">{{ description }}</span>
  <pre><code :id="target">{{ command }}</code></pre>
  <StudioCopy :target="target" :label="label" :iconOnly="true"/>
</div>`

export function defineStudioCommandComponent() {
  return defineComponent<StudioCommand>(studioCommandTemplate, {
    props: ['target', 'label', 'description', 'command'],
  })
}

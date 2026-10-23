import { defineComponent, html, type RefOrValue } from 'regor'

export interface CommandBlock {
  target?: RefOrValue<string>
  label?: RefOrValue<string>
  description?: RefOrValue<string>
  command?: RefOrValue<string>
}

const commandBlockTemplate = html`<div class="terminal-command">
  <span class="syntax-muted">{{ description }}</span>
  <pre><code :id="target">{{ command }}</code></pre>
  <CopyButton :target="target" :label="label" :iconOnly="true"/>
</div>`

export function defineCommandBlockComponent() {
  return defineComponent<CommandBlock>(commandBlockTemplate, {
    props: ['target', 'label', 'description', 'command'],
  })
}

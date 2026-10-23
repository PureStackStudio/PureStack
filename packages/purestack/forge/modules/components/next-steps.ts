import { defineComponent, html } from 'regor'

export interface NextSteps {
  commands: string[]
}

const nextStepsTemplate = html`<Panel tone="neutral" variant="surfaceAlt" bodyClass="p-4">
  <h3 class="fs-h5 mt-0 mb-2">Keep building from your terminal</h3>
  <p class="text-subtle fs-sm mt-0 mb-3">After finishing Forge, run these commands to start the site again.</p>
  <pre class="forge-next-commands m-0"><code>{{ commands.join('\n') }}</code></pre>
  <p class="text-subtle fs-xs mt-3 mb-0">README.md and AGENTS.md guide your next changes.</p>
</Panel>`

export function defineNextStepsComponent() {
  return defineComponent<NextSteps>(nextStepsTemplate, {
    props: ['commands'],
  })
}

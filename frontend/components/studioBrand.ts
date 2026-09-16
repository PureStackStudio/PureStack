import { defineComponent, html } from 'regor'

export interface StudioBrand {}

const studioBrandTemplate = html`<a class="wordmark" href="/" aria-label="PureStack home">
  <span class="brand-mark" aria-hidden="true"
    ><Icon name="tabler:stack-2"/></span>
  <span>PureStack<span class="brand-period">.</span></span>
</a>`

export function defineStudioBrandComponent() {
  return defineComponent<StudioBrand>(studioBrandTemplate)
}

import { defineComponent, html, type RefOrValue } from 'regor'

export interface ApiProperty {
  anchor: RefOrValue<string>
  name: RefOrValue<string>
  valueType: RefOrValue<string>
  defaultValue: RefOrValue<string>
}

const apiPropertyTemplate = html`<section class="api-property" :id="anchor" :aria-label="name">
  <header class="api-property__header">
    <h4>
      <a :href="'#' + anchor"
        ><code>{{ name }}</code><span aria-hidden="true"> #</span></a
      >
    </h4>
    <code class="api-property__type">{{ valueType }}</code>
    <dl class="api-property__default">
      <dt>Default</dt>
      <dd><code>{{ defaultValue }}</code></dd>
    </dl>
  </header>
  <div class="api-property__content"><slot></slot></div>
</section>`

export function defineApiPropertyComponent() {
  return defineComponent<ApiProperty>(apiPropertyTemplate, {
    props: ['anchor', 'name', 'valueType', 'defaultValue'],
  })
}

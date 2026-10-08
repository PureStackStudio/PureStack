import { defineComponent, html } from 'regor'

export interface StudioRegorConnection {
  uiCaption: string
  docsCaption: string
}

const studioRegorConnectionTemplate = html`<figure class="regor-connection">
  <div class="regor-loop">
    <svg class="regor-loop-path" viewBox="0 0 360 220" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path class="regor-loop-ui" d="M80 62 V60 Q80 35 105 35 H255 Q280 35 280 54"/>
      <path class="regor-loop-ui" d="M275 48 L280 55 L285 48"/>
      <path class="regor-loop-docs" d="M280 160 Q280 185 255 185 H105 Q80 185 80 166"/>
      <path class="regor-loop-docs" d="M75 172 L80 165 L85 172"/>
    </svg>
    <span class="regor-loop-label regor-loop-label--ui">Reactive UI <Icon name="lucide:arrow-right"/></span>
    <div class="regor-loop-node regor-loop-node--regor">
      <span class="regor-loop-mark"><Icon name="lucide:orbit"/></span>
      <strong>Regor</strong>
    </div>
    <div class="regor-loop-node regor-loop-node--purestack">
      <span class="regor-loop-mark"><Icon name="tabler:stack-2"/></span>
      <strong>PureStack</strong>
    </div>
    <span class="regor-loop-label regor-loop-label--docs"><Icon name="lucide:arrow-left"/>Documentation</span>
  </div>
  <figcaption>{{ uiCaption }}<br/>{{ docsCaption }}</figcaption>
</figure>`

export function defineStudioRegorConnectionComponent() {
  return defineComponent<StudioRegorConnection>(studioRegorConnectionTemplate, {
    context: () => ({
      uiCaption: "Regor powers PureStack's UI.",
      docsCaption: "PureStack builds Regor's docs.",
    }),
  })
}

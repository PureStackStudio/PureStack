import { defineComponent, html, type RefOrValue } from 'regor'

export interface StudioCopy {
  target?: RefOrValue<string>
  label?: RefOrValue<string>
  iconOnly?: RefOrValue<boolean>
}

const studioCopyTemplate = html`<Btn
  class="copy-button"
  :class="iconOnly ? 'icon-only' : ''"
  :data-copy="target"
  :ariaLabel="label"
  :iconOnly="iconOnly"
  tone="neutral"
  variant="subtle"
  icon="tabler:copy"
  >Copy</Btn
>`

export function defineStudioCopyComponent() {
  return defineComponent<StudioCopy>(studioCopyTemplate, {
    props: ['target', 'label', 'iconOnly'],
  })
}

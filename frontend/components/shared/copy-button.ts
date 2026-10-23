import { defineComponent, html, type RefOrValue } from 'regor'

export interface CopyButton {
  target?: RefOrValue<string>
  label?: RefOrValue<string>
  iconOnly?: RefOrValue<boolean>
}

const copyButtonTemplate = html`<Btn
  class="copy-button"
  :class="iconOnly ? 'icon-only' : ''"
  :data-copy="target"
  :ariaLabel="label"
  :iconOnly="iconOnly"
  tone="neutral"
  variant="subtle"
  icon="tabler:copy"
  >Copy</Btn>`

export function defineCopyButtonComponent() {
  return defineComponent<CopyButton>(copyButtonTemplate, {
    props: ['target', 'label', 'iconOnly'],
  })
}

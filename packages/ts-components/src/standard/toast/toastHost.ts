import { defineComponent, html, type SRef } from 'regor'
import type { ToastItem, ToastStore } from './toastStore'

export interface ToastHost {
  items: SRef<ToastItem[]>
  dismiss: ToastStore['dismiss']
}

export const toastHostTemplate = html`<Flex
  direction="column"
  align="center"
  r-if="items.length > 0"
  style="position: fixed; top: 1rem; left: 50%; z-index: 1200; max-width: calc(100vw - 2rem); transform: translateX(-50%); pointer-events: none;"
>
  <Panel
    class="py-0"
    r-for="toast in items"
    :tone="toast.tone"
    variant="surface"
    style="max-width: calc(100vw - 2rem); pointer-events: auto;"
  >
    <Flex align="center" justify="between" wrap="true">
      <span>{{ toast.message }}</span>
      <Btn
        size="sm"
        variant="subtleBtn"
        icon="iconoir:xmark"
        @click="dismiss(toast.id)"
      >
        Dismiss
      </Btn>
    </Flex>
  </Panel>
</Flex>`

export function defineToastComponents() {
  return {
    toastHost: defineComponent<ToastHost>(toastHostTemplate, {
      props: ['items', 'dismiss'],
    }),
  }
}

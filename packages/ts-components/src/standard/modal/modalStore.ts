import { Base } from '@purestack/ts-util'
import { defineComponent, html, type RefOrValue, ref, sref, unref } from 'regor'

import type { Btn } from '../btn/btn'
import type { Modal } from './modal'

let nextModalId = 1
let modalStoreSingleton: ModalStore | undefined

export interface ModalActionContract extends Btn {
  id?: string
  label?: RefOrValue<string>
  closeOnClick?: RefOrValue<boolean>
  onClick?: (modal: ModalItem, store: ModalStore) => void | Promise<void>
}

export interface ModalContract extends Modal {
  body?: RefOrValue<string>
  note?: RefOrValue<string>
  actions?: ModalActionContract[]
}

class ModalAction extends Base<ModalActionContract>() {
  override readonly id: string
  readonly running = ref(false)
  constructor(opts: ModalActionContract) {
    super(opts)
    this.id = opts.id ?? `action-${nextModalId++}`
  }
}
class ModalItem extends Base<ModalContract>() {
  override readonly id: string
  constructor(opts: ModalContract) {
    super(opts)
    this.id = opts.id || `modal-store-${nextModalId}`
    nextModalId += 1
    Object.assign(this, opts)
    this.actions = opts.actions?.map?.((x) => new ModalAction(x))
  }
}

export class ModalStore {
  readonly modals = sref<ModalItem[]>([])

  openModal = (options: ModalContract) => {
    const modal = this.createModal(options)
    const id = modal.id

    setTimeout(() => {
      window.tsSsgModal?.refresh()
      window.tsSsgModal?.open(id)
    }, 1)
    return modal
  }

  closeModal = (id: string) => {
    window.tsSsgModal?.close(id)
  }

  private findModal = (id: string) => {
    return this.modals().find((modal) => modal.id === id)
  }

  runAction = (modal: ModalItem, action: ModalAction) => {
    void this.runActionAsync(modal, action)
  }

  removeModal = (id: string) => {
    this.modals(this.modals().filter((modal) => modal.id !== id))
  }

  private createModal(options: ModalContract) {
    if (options.id && this.findModal(options.id)) {
      this.closeModal(options.id)
    }

    const created = new ModalItem(options)
    this.modals([...this.modals(), created])
    return created
  }

  private async runActionAsync(modal: ModalItem, action: ModalAction) {
    modal = unref(modal)
    if (action.running()) return

    action.running(true)
    try {
      await action.onClick?.(modal, this)
      if ((unref(action.closeOnClick) ?? true) === true) {
        this.closeModal(modal.id)
      }
    } catch (err) {
      console.warn(err)
    } finally {
      action.running(false)
    }
  }
}

function ensureModalStore() {
  if (!modalStoreSingleton) {
    modalStoreSingleton = new ModalStore()
  }
  return modalStoreSingleton
}

export function useModalStore() {
  if (!modalStoreSingleton) {
    throw new Error(
      'ModalStore is not mounted. Render <ModalStore> once first.',
    )
  }
  return modalStoreSingleton
}

const modalStoreTemplate = html`<template r-for="modal in modals">
  <Modal
    :id="modal.id"
    :title="modal.title"
    :tone="modal.tone"
    :variant="modal.variant"
    :variantMode="modal.variantMode"
    :size="modal.size"
    :fade="modal.fade"
    :slideFrom="modal.slideFrom"
    :showClose="modal.showClose"
    @close="removeModal(modal.id)"
  >
    <p class="modal-store__body" r-if="modal.body">{{ modal.body }}</p>
    <p class="modal-store__note" r-if="modal.note">{{ modal.note }}</p>
    <template name="footer">
      <Flex r-if="modal.actions.length > 0">
        <Btn
          r-for="action in modal.actions"
          :tone="action.tone"
          :variant="action.variant"
          :icon="action.icon"
          :disabled="action.disabled"
          @click="runAction(modal, action)"
        >
          {{ action.label }}
        </Btn>
      </Flex>
    </template>
  </Modal>
</template>`

export function defineModalStoreComponent() {
  return {
    modalStore: defineComponent<ModalStore>(modalStoreTemplate, {
      context: () => ensureModalStore(),
    }),
  }
}

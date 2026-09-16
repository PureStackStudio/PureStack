import { useModalStore } from '@purestack/ts-components'
import { defineComponent, html, type IRegorContext, type Ref, ref } from 'regor'

export interface DocsModalApi extends IRegorContext {
  status: Ref<string>
  open: () => void
  close: () => void
  closed: () => void
  cancelled: () => void
}

export interface DocsModalStore extends IRegorContext {
  result: Ref<string>
  review: () => void
}

const modalApiTemplate = html`<Flex direction="column" align="start">
  <Btn tone="accent" @click="open">Open with the browser API</Btn>
  <p role="status" r-text="status"></p>
  <Modal id="api-dialog" title="A programmatic dialog" :showClose="true" @close="closed" @cancel="cancelled">
    <p>This dialog was opened by a Regor event handler.</p>
    <template #footer><Btn tone="accent" @click="close">Close with the API</Btn></template>
  </Modal>
</Flex>`

const modalStoreTemplate = html`<Flex direction="column" align="start">
  <ModalStore/>
  <Btn tone="accent" variant="surface" @click="review">Review a saved draft</Btn>
  <p role="status" r-text="result"></p>
</Flex>`

export function defineModalExampleComponents() {
  return {
    DocsModalApi: defineComponent<DocsModalApi>(modalApiTemplate, {
      context: createModalApi,
    }),
    DocsModalStore: defineComponent<DocsModalStore>(modalStoreTemplate, {
      context: createModalStore,
    }),
  }
}

function createModalApi(): DocsModalApi {
  const status = ref('Ready to open.')
  return {
    status,
    open: () => {
      status('Dialog opened.')
      window.tsSsgModal?.open('api-dialog')
    },
    close: () => window.tsSsgModal?.close('api-dialog'),
    closed: () => status('Dialog closed.'),
    cancelled: () => status('Dismissed with Escape.'),
  }
}

function createModalStore(): DocsModalStore {
  const result = ref('Your draft is ready for review.')
  const review = () => {
    useModalStore().openModal({
      title: 'Save this draft?',
      body: 'This example updates local demo state.',
      note: 'No data is sent to a server.',
      tone: 'neutral',
      showClose: true,
      actions: [
        { label: 'Keep editing', variant: 'surface' },
        {
          label: 'Save draft',
          tone: 'accent',
          onClick: () => {
            result('Draft saved in this demo.')
          },
        },
      ],
    })
  }
  return { result, review }
}

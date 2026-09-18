import {
  defineButtonComponents,
  defineFlexComponents,
} from '@purestack/ts-components'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type SRef,
  sref,
} from 'regor'

export interface Collection {
  items: SRef<string[]>
  limit: number
  summary: ComputedRef<string>
  isEmpty: ComputedRef<boolean>
  isFull: ComputedRef<boolean>
  addItem: () => void
  removeItem: () => void
  reset: () => void
}

const collectionTemplate = html`<Flex direction="column" align="start">
  <strong>Build a collection</strong>
  <p>Add up to {{ limit }} items. Remove one or start over.</p>
  <p role="status">{{ summary }}</p>
  <ul r-if="!isEmpty" aria-label="Collection items">
    <li r-for="item in items">{{ item }}</li>
  </ul>
  <Flex wrap="true">
    <Btn tone="accent" :disabled="isFull" @click="addItem">Add item</Btn>
    <Btn tone="neutral" variant="surface" :disabled="isEmpty" @click="removeItem">Remove item</Btn>
    <Btn tone="neutral" variant="link" :disabled="isEmpty" @click="reset">Reset</Btn>
  </Flex>
</Flex>`

function createCollection(): Collection {
  const items = sref<string[]>([])
  const limit = 5
  let nextItem = 1
  const isEmpty = computed(() => items().length === 0)
  const isFull = computed(() => items().length === limit)
  const summary = computed(() =>
    isFull()
      ? `Collection full: ${limit} items.`
      : `${items().length} ${items().length === 1 ? 'item' : 'items'} in your collection.`,
  )
  return {
    items,
    limit,
    summary,
    isEmpty,
    isFull,
    addItem: () => {
      if (!isFull()) items([...items(), `Item ${nextItem++}`])
    },
    removeItem: () => {
      if (!isEmpty()) items(items().slice(0, -1))
    },
    reset: () => {
      items([])
      nextItem = 1
    },
  }
}

const component = defineComponent<Collection>(collectionTemplate, {
  context: createCollection,
})

createApp(
  {
    components: {
      Collection: component,
      ...defineButtonComponents(),
      ...defineFlexComponents(),
    },
  },
  {
    selector: 'app#collection',
    template: html`<Collection/>`,
  },
)

import { defineVirtualListComponents } from '@purestack/ts-components'
import { createApp, defineComponent, html, type RefOrValue } from 'regor'

export interface Note {
  title: string
  body: string
}
export interface NoteRow {
  item: RefOrValue<Note>
  index: RefOrValue<number>
}
const noteRowTemplate = html`<article class="p-3 bb-1 b-subtle" role="listitem" :aria-posinset="index + 1" aria-setsize="200">
  <strong>{{ item.title }}</strong>
  <p class="mb-0">{{ item.body }}</p>
</article>`
const noteRow = defineComponent<NoteRow>(noteRowTemplate, {
  props: ['item', 'index'],
})

export interface NotesExample {
  notes: Note[]
}
const notesTemplate = html`<VariableVirtualList
  :items="notes" height="300" estimateHeight="100" overscan="3"
  rowComponent="NoteRow" role="list" tabindex="0" aria-label="Release notes"
  class="b-1 b-subtle rounded-md"
/>`
const notesExample = defineComponent<NotesExample>(notesTemplate, {
  context: () => ({
    notes: Array.from({ length: 200 }, (_, index) => ({
      title: `Note ${index + 1}`,
      body:
        index % 2
          ? 'A focused documentation update.'
          : 'This update adds clearer examples for keyboard navigation, empty results and responsive layouts. The paragraph wraps naturally, and the virtual list measures the resulting row height.',
    })),
  }),
})
createApp(
  {
    components: {
      NotesExample: notesExample,
      NoteRow: noteRow,
      ...defineVirtualListComponents(),
    },
  },
  {
    selector: 'app#variable-list-basic-demo',
    template: html`<NotesExample />`,
  },
)

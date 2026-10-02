import type { ComponentVariant } from '@purestack/ts-components'
import { SEMANTIC_TONES } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue, ref, sref, unref } from 'regor'

export interface FormAppearanceGallery {
  component: RefOrValue<string>
  axis: RefOrValue<'tone' | 'variant' | 'type'>
  prefix: RefOrValue<string>
}

const variants: ComponentVariant[] = [
  'solid',
  'surface',
  'surfaceAlt',
  'spotlight',
  'glass',
  'flat',
  'flatAlt',
  'flatSolid',
  'outlineFill',
  'outline',
  'subtle',
  'subtleBtn',
  'link',
  'sheen',
  'underline',
  'rail',
  'bracket',
  'none',
]
const inputTypes = [
  'color',
  'text',
  'email',
  'password',
  'number',
  'tel',
  'url',
  'search',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
]

const template = html`<div class="component-appearance-grid forms-appearance-grid" :class="{ 'forms-appearance-grid--composer': component === 'Composer' }">
  <div class="component-appearance-cell" r-for="sample in samples">
    <code>{{ sample.label }}</code>
    <AppForm r-if="component === 'AppForm'" class="p-3" :tone="sample.tone" :variant="sample.variant" @submit.prevent="sample.submit($event)">
      <FormInputField :id="sample.id" label="Project name" name="project" :model="sample.model" :required="true"/>
      <FormSubmit label="Preview save" :tone="sample.tone"/>
      <FormStatus :hidden="!sample.receipt">{{ sample.receipt }}</FormStatus>
    </AppForm>
    <FormInputField r-if="component === 'FormInputField'" :id="sample.id" :label="axis === 'type' ? sample.label : 'Project name'" :type="axis === 'type' ? sample.label : 'text'" :model="sample.model" :tone="sample.tone" :variant="sample.variant" placeholder="Your next idea"/>
    <FormSelectField r-if="component === 'FormSelectField'" :id="sample.id" label="Region" :model="sample.model" :options="options" :tone="sample.tone" :variant="sample.variant"/>
    <FormCheck r-if="component === 'FormCheck'" :id="sample.id" label="Release updates" :checked="sample.checked" :tone="sample.tone"/>
    <form r-if="component === 'FormSubmit'" @submit.prevent="sample.submit($event)">
      <FormSubmit :label="sample.label" :tone="sample.tone" :variant="sample.variant"/>
      <FormStatus :hidden="!sample.receipt">{{ sample.receipt }}</FormStatus>
    </form>
    <FormStatus r-if="component === 'FormStatus'" :tone="sample.tone" :variant="sample.variant">Your draft is ready for review.</FormStatus>
    <AutoCompleteInput r-if="component === 'AutoCompleteInput'" :id="sample.id" label="Region" :model="sample.query" :selectedValue="sample.selected" :options="options" :tone="sample.tone" :variant="sample.variant" placeholder="Search a region"/>
    <MultiAutoCompleteInput r-if="component === 'MultiAutoCompleteInput'" :id="sample.id" label="Release tags" :items="sample.items" :model="sample.query" :options="tags" :tone="sample.tone" :variant="sample.variant" placeholder="Add a tag" :allowCustomValues="true"/>
    <Composer r-if="component === 'Composer'" :html="sample.content" :label="sample.label + ' editor'" :tone="sample.tone" :variant="sample.variant" minHeight="8rem"/>
    <DropFiles r-if="component === 'DropFiles'" :files="sample.files" label="Attachments" hint="Choose files, drop, or paste." :tone="sample.tone" :variant="sample.variant"/>
  </div>
</div>`

export function defineFormAppearanceGallery() {
  return defineComponent<FormAppearanceGallery>(template, {
    props: ['component', 'axis', 'prefix'],
    context: (head) => {
      const axis = unref(head.props.axis)
      const component = unref(head.props.component)
      const values =
        axis === 'tone'
          ? SEMANTIC_TONES
          : axis === 'type'
            ? inputTypes
            : variants
      return {
        ...head.props,
        samples: values.map((value) => {
          const receipt = ref('')
          return {
            id: `${unref(head.props.prefix)}-${value}`,
            label: value,
            tone: axis === 'tone' ? value : 'accent',
            variant:
              axis === 'variant'
                ? value
                : component === 'FormSubmit'
                  ? 'solid'
                  : 'surface',
            model: ref(
              axis === 'type'
                ? inputValue(value)
                : component === 'FormSelectField'
                  ? 'eu'
                  : 'Studio docs',
            ),
            query: ref(''),
            selected: ref<string | number | null>(null),
            checked: ref(true),
            items: sref([{ label: 'Documentation', value: 'docs' }]),
            files: sref([]),
            content: ref('<p>A place for your <strong>next idea</strong>.</p>'),
            receipt,
            submit: (event: Event) => {
              const form = event.target as HTMLFormElement
              if (form.reportValidity())
                receipt('Preview complete. Nothing was sent.')
            },
          }
        }),
        options: [
          { label: 'Europe Central', value: 'eu', keywords: ['Frankfurt'] },
          { label: 'US East', value: 'us', keywords: ['Virginia'] },
          {
            label: 'Private region · unavailable',
            value: 'private',
            disabled: true,
          },
        ],
        tags: [
          { label: 'Documentation', value: 'docs' },
          { label: 'Accessibility', value: 'a11y' },
          { label: 'Performance', value: 'perf' },
        ],
      }
    },
  })
}

function inputValue(type: string): string {
  const values: Record<string, string> = {
    color: '#2563eb',
    text: 'Studio docs',
    email: 'you@example.com',
    password: 'example-password',
    number: '3',
    tel: '+49 30 123456',
    url: 'https://purestack.studio',
    search: 'components',
    date: '2026-10-03',
    time: '09:30',
    'datetime-local': '2026-10-03T09:30',
    month: '2026-10',
    week: '2026-W40',
  }
  return values[type] ?? ''
}

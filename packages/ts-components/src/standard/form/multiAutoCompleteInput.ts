import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  type Emits,
  html,
  isRef,
  type Ref,
  type RefOrValue,
  ref,
  type SRef,
  sref,
  unref,
} from 'regor'
import { createAutoId } from '../autoId'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'
import type {
  AutoCompleteOption,
  AutoCompleteValue,
  ResolvedAutoCompleteOption,
} from './autoCompleteInput'

const resolveMultiAutoCompleteInputId = createAutoId(
  'multi-auto-complete-input',
)

export interface MultiAutoCompleteItem {
  label: RefOrValue<string>
  value?: RefOrValue<AutoCompleteValue>
  disabled?: RefOrValue<boolean>
  invalid?: RefOrValue<boolean>
  tone?: RefOrValue<SemanticTone>
  keywords?: RefOrValue<string | string[]>
}

export interface ResolvedMultiAutoCompleteItem {
  label: string
  value: AutoCompleteValue
  disabled?: boolean
  invalid?: boolean
  tone?: SemanticTone
  keywords: string[]
}

export type MultiAutoCompleteCreateItem = (
  query: string,
) => MultiAutoCompleteItem | null | undefined

export type MultiAutoCompleteOptionToItem = (
  option: ResolvedAutoCompleteOption,
) => MultiAutoCompleteItem | null | undefined

export type MultiAutoCompleteSplitInput = (value: string) => string[]

export type MultiAutoCompleteItemsChange = (
  items: MultiAutoCompleteItem[],
) => void

export type MultiAutoCompleteSelect = (
  option: ResolvedAutoCompleteOption,
  item: MultiAutoCompleteItem,
) => void

export type MultiAutoCompleteSearch = (query: string) => void

export interface MultiAutoCompleteSelectedRow {
  id: string
  index: number
  item: ResolvedMultiAutoCompleteItem
  classes: string
}

export interface MultiAutoCompleteOptionRow {
  id: string
  index: number
  option: ResolvedAutoCompleteOption
  active: boolean
  disabled?: boolean
  classes: string
}

export interface MultiAutoCompleteInput {
  id?: RefOrValue<string>
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  items?: SRef<MultiAutoCompleteItem[]>
  model?: Ref<string>
  name?: RefOrValue<string>
  required?: RefOrValue<boolean>
  autocomplete?: RefOrValue<string>
  placeholder?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  icon?: RefOrValue<string>
  iconEnd?: RefOrValue<string>
  removeIcon?: RefOrValue<string>
  options?: RefOrValue<AutoCompleteOption[]>
  rowComponent?: RefOrValue<string>
  minLength?: RefOrValue<number | string>
  maxResults?: RefOrValue<number | string>
  openOnFocus?: RefOrValue<boolean>
  allowCustomValues?: RefOrValue<boolean>
  allowDuplicates?: RefOrValue<boolean>
  separators?: RefOrValue<string>
  loading?: RefOrValue<boolean>
  emptyText?: RefOrValue<string>
  loadingText?: RefOrValue<string>
  onCreateItem?: RefOrValue<MultiAutoCompleteCreateItem>
  onOptionToItem?: RefOrValue<MultiAutoCompleteOptionToItem>
  onSplitInput?: RefOrValue<MultiAutoCompleteSplitInput>
  onItemsChange?: RefOrValue<MultiAutoCompleteItemsChange>
  onSelect?: RefOrValue<MultiAutoCompleteSelect>
  onSearch?: RefOrValue<MultiAutoCompleteSearch>
  emits?: Emits<
    'itemschange' | 'itemremove' | 'itemcreate' | 'optionselect' | 'querychange'
  >
  inputId?: string
  listboxId?: string
  inputElement?: SRef<HTMLInputElement | null>
  isOpen?: Ref<boolean>
  activeIndex?: Ref<number>
  query?: ComputedRef<string>
  classes?: ComputedRef<string>
  resolvedItems?: ComputedRef<ResolvedMultiAutoCompleteItem[]>
  selectedRows?: ComputedRef<MultiAutoCompleteSelectedRow[]>
  resolvedOptions?: ComputedRef<ResolvedAutoCompleteOption[]>
  filteredOptions?: ComputedRef<ResolvedAutoCompleteOption[]>
  optionRows?: ComputedRef<MultiAutoCompleteOptionRow[]>
  activeOptionId?: ComputedRef<string | undefined>
  shouldRenderPopup?: ComputedRef<boolean>
  showLoading?: ComputedRef<boolean>
  showEmpty?: ComputedRef<boolean>
  resolvedRowComponent?: ComputedRef<string>
  resolvedIconEnd?: ComputedRef<string | undefined>
  resolvedRemoveIcon?: ComputedRef<string>
  focusInput?: () => void
  handleFocusIn?: () => void
  handleFocusOut?: () => void
  handleInput?: () => void
  handlePaste?: (event: ClipboardEvent) => void
  handleKeydown?: (event: KeyboardEvent) => void
  handleOptionMouseDown?: (event: MouseEvent) => void
  selectOptionRow?: (row: MultiAutoCompleteOptionRow) => void
  removeSelectedRow?: (row: MultiAutoCompleteSelectedRow) => void
  removeItemLabel?: (row: MultiAutoCompleteSelectedRow) => string
}

export interface MultiAutoCompleteDefaultOptionRow {
  option: RefOrValue<ResolvedAutoCompleteOption | null>
  active?: RefOrValue<boolean>
}

const multiAutoCompleteInputTemplate = html`<label
  class="multi-auto-complete-input form-block__field"
  :for="inputId"
  @focusin="handleFocusIn"
  @focusout="handleFocusOut"
>
  <span class="form-block__label" r-if="label">{{ label }}</span>
  <div
    class="multi-auto-complete-input__shell form-block__input-shell"
    :class="classes"
    @click="focusInput"
  >
    <Icon class="form-block__input-icon" :name="icon" r-if="icon"/>
    <div class="multi-auto-complete-input__control">
      <span
        class="multi-auto-complete-input__item"
        :class="row.classes"
        r-for="row in selectedRows"
      >
        <span class="multi-auto-complete-input__item-label">
          {{ row.item.label }}
        </span>
        <button
          class="multi-auto-complete-input__remove"
          type="button"
          :title="removeItemLabel(row)"
          :aria-label="removeItemLabel(row)"
          :disabled="disabled || row.item.disabled"
          @click="removeSelectedRow(row)"
        >
          <Icon :name="resolvedRemoveIcon"/>
        </button>
        <input
          r-if="name"
          type="hidden"
          :name="name"
          :value="row.item.value"/>
      </span>
      <input
        :id="inputId"
        :ref="inputElement"
        class="multi-auto-complete-input__query form-block__input"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        :aria-controls="listboxId"
        :aria-expanded="isOpen"
        :aria-activedescendant="activeOptionId"
        :required="required && selectedRows.length === 0"
        :autocomplete="autocomplete || 'off'"
        :placeholder="selectedRows.length === 0 ? placeholder : ''"
        :disabled="disabled"
        r-model="model"
        @input="handleInput"
        @paste="handlePaste"
        @keydown="handleKeydown"/>
    </div>
    <Icon
      class="form-block__input-icon"
      :name="resolvedIconEnd"
      r-if="resolvedIconEnd"/>
  </div>
  <div
    class="multi-auto-complete-input__popup"
    r-if="shouldRenderPopup"
  >
    <div
      class="multi-auto-complete-input__message"
      r-if="showLoading"
      role="status"
      aria-live="polite"
    >
      {{ loadingText || 'Loading suggestions' }}
    </div>
    <div
      class="multi-auto-complete-input__message"
      r-if="showEmpty"
      role="status"
      aria-live="polite"
    >
      {{ emptyText || 'No suggestions' }}
    </div>
    <div
      class="multi-auto-complete-input__listbox"
      :id="listboxId"
      role="listbox"
      r-if="!showLoading && !showEmpty"
    >
      <div
        class="multi-auto-complete-input__option"
        :class="row.classes"
        role="option"
        :id="row.id"
        :aria-selected="row.active"
        :aria-disabled="row.disabled"
        r-for="row in optionRows"
        @mousedown="handleOptionMouseDown"
        @click="selectOptionRow(row)"
      >
        <div
          :is="resolvedRowComponent"
          :option="row.option"
          :item="row.option"
          :index="row.index"
          :query="query"
          :active="row.active"
          :selected="false"
          :disabled="row.disabled"
        ></div>
      </div>
    </div>
  </div>
</label>`

const multiAutoCompleteOptionRowTemplate = html`<div class="multi-auto-complete-input__default-row">
  <span class="multi-auto-complete-input__default-label">
    {{ option?.label }}
  </span>
</div>`

function defineMultiAutoCompleteInputComponent() {
  return defineComponent<MultiAutoCompleteInput>(
    multiAutoCompleteInputTemplate,
    {
      props: [
        'id',
        'label',
        'tone',
        'variant',
        'items',
        'model',
        'name',
        'required',
        'autocomplete',
        'placeholder',
        'disabled',
        'icon',
        'iconEnd',
        'removeIcon',
        'options',
        'rowComponent',
        'minLength',
        'maxResults',
        'openOnFocus',
        'allowCustomValues',
        'allowDuplicates',
        'separators',
        'loading',
        'emptyText',
        'loadingText',
        'onCreateItem',
        'onOptionToItem',
        'onSplitInput',
        'onItemsChange',
        'onSelect',
        'onSearch',
      ],
      context: (head) => new MultiAutoCompleteInputContext(head),
    },
  )
}

function defineMultiAutoCompleteOptionRowComponent() {
  return defineComponent<MultiAutoCompleteDefaultOptionRow>(
    multiAutoCompleteOptionRowTemplate,
    {
      props: ['option', 'active', 'selected', 'query'],
      context: (head) => head.props,
    },
  )
}

export function defineMultiAutoCompleteInputComponents() {
  return {
    multiAutoCompleteInput: defineMultiAutoCompleteInputComponent(),
    multiAutoCompleteOptionRow: defineMultiAutoCompleteOptionRowComponent(),
  }
}

class MultiAutoCompleteInputContext implements MultiAutoCompleteInput {
  readonly id: string
  readonly label?: RefOrValue<string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  readonly items: SRef<MultiAutoCompleteItem[]>
  readonly model: Ref<string>
  readonly name?: RefOrValue<string>
  readonly required?: RefOrValue<boolean>
  readonly autocomplete?: RefOrValue<string>
  readonly placeholder?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly icon?: RefOrValue<string>
  readonly iconEnd?: RefOrValue<string>
  readonly removeIcon?: RefOrValue<string>
  readonly options?: RefOrValue<AutoCompleteOption[]>
  readonly rowComponent?: RefOrValue<string>
  readonly minLength?: RefOrValue<number | string>
  readonly maxResults?: RefOrValue<number | string>
  readonly openOnFocus?: RefOrValue<boolean>
  readonly allowCustomValues?: RefOrValue<boolean>
  readonly allowDuplicates?: RefOrValue<boolean>
  readonly separators?: RefOrValue<string>
  readonly loading?: RefOrValue<boolean>
  readonly emptyText?: RefOrValue<string>
  readonly loadingText?: RefOrValue<string>
  readonly onCreateItem?: RefOrValue<MultiAutoCompleteCreateItem>
  readonly onOptionToItem?: RefOrValue<MultiAutoCompleteOptionToItem>
  readonly onSplitInput?: RefOrValue<MultiAutoCompleteSplitInput>
  readonly onItemsChange?: RefOrValue<MultiAutoCompleteItemsChange>
  readonly onSelect?: RefOrValue<MultiAutoCompleteSelect>
  readonly onSearch?: RefOrValue<MultiAutoCompleteSearch>
  readonly inputId: string
  readonly listboxId: string
  readonly inputElement = sref<HTMLInputElement | null>(null)
  readonly isOpen = ref(false)
  readonly activeIndex = ref(-1)
  readonly query: ComputedRef<string>
  readonly classes: ComputedRef<string>
  readonly resolvedItems: ComputedRef<ResolvedMultiAutoCompleteItem[]>
  readonly selectedRows: ComputedRef<MultiAutoCompleteSelectedRow[]>
  readonly resolvedOptions: ComputedRef<ResolvedAutoCompleteOption[]>
  readonly filteredOptions: ComputedRef<ResolvedAutoCompleteOption[]>
  readonly optionRows: ComputedRef<MultiAutoCompleteOptionRow[]>
  readonly activeOptionId: ComputedRef<string | undefined>
  readonly shouldRenderPopup: ComputedRef<boolean>
  readonly showLoading: ComputedRef<boolean>
  readonly showEmpty: ComputedRef<boolean>
  readonly resolvedRowComponent: ComputedRef<string>
  readonly resolvedIconEnd: ComputedRef<string | undefined>
  readonly resolvedRemoveIcon: ComputedRef<string>
  private readonly emit: ComponentHead<MultiAutoCompleteInput>['emit']
  private closingTimer: ReturnType<typeof setTimeout> | undefined

  constructor(head: ComponentHead<MultiAutoCompleteInput>) {
    const props = head.props
    Object.assign(this, props)
    this.emit = head.emit
    this.id = resolveMultiAutoCompleteInputId(props.id)
    this.inputId = `${this.id}-query`
    this.listboxId = `${this.id}-listbox`
    this.items = isRef(props.items)
      ? props.items
      : sref<MultiAutoCompleteItem[]>([])
    this.model = isRef(props.model) ? props.model : ref('')
    this.query = computed(() => String(unref(this.model) ?? ''))
    this.classes = computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'surfaceAlt',
        classes: [
          unref(this.disabled)
            ? 'multi-auto-complete-input__shell--disabled'
            : '',
        ],
      }),
    )
    this.resolvedItems = computed(() =>
      this.items().map(resolveMultiAutoCompleteItem),
    )
    this.selectedRows = computed(() => this.resolveSelectedRows())
    this.resolvedOptions = computed(() => {
      const options = unref(props.options)
      return Array.isArray(options)
        ? options.map(resolveAutoCompleteOption)
        : []
    })
    this.filteredOptions = computed(() => this.resolveFilteredOptions())
    this.optionRows = computed(() => this.resolveOptionRows())
    this.activeOptionId = computed(
      () => this.optionRows()[this.activeIndex()]?.id,
    )
    this.showLoading = computed(() => this.isOpen() && !!unref(this.loading))
    this.showEmpty = computed(
      () =>
        this.isOpen() &&
        !this.showLoading() &&
        this.meetsMinimumQueryLength() &&
        this.filteredOptions().length === 0,
    )
    this.shouldRenderPopup = computed(
      () =>
        this.isOpen() &&
        (this.showLoading() ||
          this.showEmpty() ||
          this.filteredOptions().length > 0),
    )
    this.resolvedRowComponent = computed(() => {
      const component = unref(props.rowComponent)
      return typeof component === 'string' && component.trim()
        ? component
        : 'MultiAutoCompleteOptionRow'
    })
    this.resolvedIconEnd = computed(
      () =>
        unref(props.iconEnd) ||
        (unref(props.loading) ? 'lucide:loader-circle' : 'lucide:chevron-down'),
    )
    this.resolvedRemoveIcon = computed(
      () => unref(props.removeIcon) || 'lucide:x',
    )
  }

  focusInput = () => {
    if (unref(this.disabled)) return
    this.inputElement()?.focus()
  }

  handleFocusIn = () => {
    this.clearClosingTimer()
    if (!this.shouldOpenOnFocus()) return

    this.open()
  }

  handleFocusOut = () => {
    this.clearClosingTimer()
    this.closingTimer = setTimeout(() => {
      this.close()
    }, 0)
  }

  handleInput = () => {
    const query = this.query()
    unref(this.onSearch)?.(query)
    this.emit('querychange', { query })
    if (this.meetsMinimumQueryLength()) this.open()
    else this.close()
  }

  handlePaste = (event: ClipboardEvent) => {
    if (unref(this.disabled) || !this.canCreateCustomValues()) return

    const text = event.clipboardData?.getData('text') ?? ''
    const values = this.splitValues(text)
    if (values.length <= 1) return

    event.preventDefault()
    this.addCreatedValues(values)
  }

  handleKeydown = (event: KeyboardEvent) => {
    if (unref(this.disabled)) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!this.isOpen()) {
        this.open()
        return
      }
      this.open()
      this.moveActive(1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!this.isOpen()) {
        this.open()
        this.activateLast()
        return
      }
      this.open()
      this.moveActive(-1)
      return
    }
    if (event.key === 'Home' && this.isOpen()) {
      event.preventDefault()
      this.activateFirst()
      return
    }
    if (event.key === 'End' && this.isOpen()) {
      event.preventDefault()
      this.activateLast()
      return
    }
    if (event.key === 'Enter') {
      const row = this.isOpen() ? this.optionRows()[this.activeIndex()] : null
      if (row) {
        event.preventDefault()
        this.selectOptionRow(row)
        return
      }

      if (this.commitQuery()) event.preventDefault()
      return
    }
    if (event.key === 'Backspace' && !this.query()) {
      const rows = this.selectedRows()
      const row = rows[rows.length - 1]
      if (!row) return

      event.preventDefault()
      this.removeSelectedRow(row)
      return
    }
    if (event.key === 'Escape') {
      this.close()
      return
    }
    if (
      event.key.length === 1 &&
      this.resolvedSeparators().includes(event.key)
    ) {
      if (this.commitQuery()) event.preventDefault()
    }
  }

  handleOptionMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    this.clearClosingTimer()
  }

  selectOptionRow = (row: MultiAutoCompleteOptionRow) => {
    if (row.disabled || unref(this.disabled)) return

    const item = unref(this.onOptionToItem)?.(row.option) ?? {
      label: row.option.label,
      value: row.option.value,
    }
    if (!this.addItem(item)) return

    this.model('')
    unref(this.onSelect)?.(row.option, item)
    this.emit('optionselect', { option: row.option, item })
    this.close()
  }

  removeSelectedRow = (row: MultiAutoCompleteSelectedRow) => {
    if (unref(this.disabled) || row.item.disabled) return

    const next = this.items().filter((_, index) => index !== row.index)
    this.writeItems(next)
    this.emit('itemremove', { item: row.item, index: row.index })
  }

  removeItemLabel = (row: MultiAutoCompleteSelectedRow) =>
    `Remove ${row.item.label}`

  private commitQuery() {
    if (!this.canCreateCustomValues()) return false

    const values = this.splitValues(this.query())
    if (values.length === 0) return false

    const added = this.addCreatedValues(values)
    if (added > 0) this.model('')
    return added > 0
  }

  private addCreatedValues(values: string[]) {
    const created: MultiAutoCompleteItem[] = []
    for (const value of values) {
      const item = unref(this.onCreateItem)?.(value) ?? {
        label: value,
        value,
      }
      if (!item || this.hasItemValue(item)) continue
      created.push(item)
    }
    if (created.length === 0) return 0

    const next = [...this.items(), ...created]
    this.writeItems(next)
    for (const item of created) this.emit('itemcreate', { item })
    this.close()
    return created.length
  }

  private addItem(item: MultiAutoCompleteItem) {
    if (!item || this.hasItemValue(item)) return false

    this.writeItems([...this.items(), item])
    return true
  }

  private writeItems(items: MultiAutoCompleteItem[]) {
    this.items(items)
    unref(this.onItemsChange)?.(items)
    this.emit('itemschange', { items })
  }

  private resolveSelectedRows() {
    return this.resolvedItems().map(
      (item, index): MultiAutoCompleteSelectedRow => ({
        id: `${this.id}-item-${index}`,
        index,
        item,
        classes: [
          item.invalid ? 'multi-auto-complete-input__item--invalid' : '',
          item.disabled ? 'multi-auto-complete-input__item--disabled' : '',
          item.tone ? `tone-${item.tone}` : '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    )
  }

  private resolveFilteredOptions() {
    const query = normalizeSearchText(this.query())
    if (!this.meetsMinimumQueryLength()) return []

    const options = this.resolvedOptions().filter(
      (option) =>
        !this.hasOptionValue(option) &&
        (!query ||
          option.keywords.some((keyword) =>
            normalizeSearchText(keyword).includes(query),
          )),
    )
    return options.slice(0, this.readPositiveInteger(this.maxResults, 10))
  }

  private resolveOptionRows() {
    const activeIndex = this.activeIndex()
    return this.filteredOptions().map(
      (option, index): MultiAutoCompleteOptionRow => ({
        id: `${this.listboxId}-option-${index}`,
        index,
        option,
        active: index === activeIndex,
        disabled: option.disabled,
        classes: [
          index === activeIndex
            ? 'multi-auto-complete-input__option--active'
            : '',
          option.disabled ? 'multi-auto-complete-input__option--disabled' : '',
        ]
          .filter(Boolean)
          .join(' '),
      }),
    )
  }

  private open() {
    if (unref(this.disabled) || !this.meetsMinimumQueryLength()) return

    this.isOpen(true)
    this.ensureActiveIndex()
  }

  private close() {
    this.isOpen(false)
    this.activeIndex(-1)
  }

  private moveActive(direction: 1 | -1) {
    const rows = this.optionRows()
    if (rows.length === 0) {
      this.activeIndex(-1)
      return
    }

    const current = this.activeIndex()
    for (let offset = 1; offset <= rows.length; offset += 1) {
      const next = wrapIndex(current + direction * offset, rows.length)
      if (!rows[next]?.disabled) {
        this.activeIndex(next)
        return
      }
    }
  }

  private activateFirst() {
    const index = this.optionRows().findIndex((row) => !row.disabled)
    this.activeIndex(index)
  }

  private activateLast() {
    const rows = this.optionRows()
    for (let index = rows.length - 1; index >= 0; index -= 1) {
      if (rows[index]?.disabled) continue

      this.activeIndex(index)
      return
    }
    this.activeIndex(-1)
  }

  private ensureActiveIndex() {
    const rows = this.optionRows()
    const current = this.activeIndex()
    if (current >= 0 && current < rows.length && !rows[current]?.disabled)
      return

    this.activateFirst()
  }

  private shouldOpenOnFocus() {
    return unref(this.openOnFocus) !== false && this.meetsMinimumQueryLength()
  }

  private meetsMinimumQueryLength() {
    return (
      this.query().trim().length >= this.readPositiveInteger(this.minLength, 0)
    )
  }

  private canCreateCustomValues() {
    return unref(this.allowCustomValues) !== false
  }

  private hasOptionValue(option: ResolvedAutoCompleteOption) {
    if (unref(this.allowDuplicates)) return false

    const key = normalizeItemValue(option.value)
    return this.resolvedItems().some(
      (item) => normalizeItemValue(item.value) === key,
    )
  }

  private hasItemValue(itemInput: MultiAutoCompleteItem) {
    if (unref(this.allowDuplicates)) return false

    const item = resolveMultiAutoCompleteItem(itemInput)
    const key = normalizeItemValue(item.value)
    return this.resolvedItems().some(
      (existing) => normalizeItemValue(existing.value) === key,
    )
  }

  private splitValues(value: string) {
    const values =
      unref(this.onSplitInput)?.(value) ??
      splitBySeparators(value, this.resolvedSeparators())
    return values.map((item) => item.trim()).filter(Boolean)
  }

  private resolvedSeparators() {
    const value = unref(this.separators)
    return typeof value === 'string' ? value : ',;'
  }

  private readPositiveInteger(
    value: RefOrValue<number | string> | undefined,
    fallback: number,
  ) {
    const raw = unref(value)
    const parsed =
      typeof raw === 'number' ? raw : Number.parseFloat(String(raw))
    return Number.isFinite(parsed) && parsed >= 0
      ? Math.trunc(parsed)
      : fallback
  }

  private clearClosingTimer() {
    if (this.closingTimer === undefined) return

    clearTimeout(this.closingTimer)
    this.closingTimer = undefined
  }
}

function resolveMultiAutoCompleteItem(
  itemInput: RefOrValue<MultiAutoCompleteItem>,
): ResolvedMultiAutoCompleteItem {
  const item = unref(itemInput)
  const label = String(unref(item.label) ?? '')
  const value = unref(item.value) ?? label
  return {
    label,
    value,
    disabled: unref(item.disabled),
    invalid: unref(item.invalid),
    tone: unref(item.tone),
    keywords: resolveKeywords(item, label, value),
  }
}

function resolveAutoCompleteOption(
  optionInput: RefOrValue<AutoCompleteOption>,
): ResolvedAutoCompleteOption {
  const option = unref(optionInput)
  const label = String(unref(option.label) ?? '')
  const value = unref(option.value) ?? label
  return {
    label,
    value,
    disabled: unref(option.disabled),
    keywords: resolveKeywords(option, label, value),
  }
}

function resolveKeywords(
  item: Pick<AutoCompleteOption, 'keywords'>,
  label: string,
  value: AutoCompleteValue,
) {
  const keywords = unref(item.keywords)
  const source: string[] = Array.isArray(keywords)
    ? keywords.map((keyword) => String(unref(keyword) ?? ''))
    : typeof keywords === 'string'
      ? keywords.split(/\s+/)
      : []
  return [label, String(value), ...source].filter(Boolean)
}

function splitBySeparators(value: string, separators: string) {
  const values: string[] = []
  let current = ''
  for (const char of value) {
    if (char === '\n' || separators.includes(char)) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase()
}

function normalizeItemValue(value: AutoCompleteValue) {
  return String(value).trim().toLocaleLowerCase()
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length
}

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
  unref,
} from 'regor'
import { createAutoId } from '../autoId'
import type { ComponentVariant } from '../componentVariant'
import type { FormInputFieldType } from './formInputField'

const resolveAutoCompleteInputId = createAutoId('auto-complete-input')

export type AutoCompleteValue = string | number

export interface AutoCompleteOption {
  label: RefOrValue<string>
  value?: RefOrValue<AutoCompleteValue>
  disabled?: RefOrValue<boolean>
  keywords?: RefOrValue<string | string[]>
}

export interface ResolvedAutoCompleteOption {
  label: string
  value: AutoCompleteValue
  disabled?: boolean
  keywords: string[]
}

export interface AutoCompleteRow {
  id: string
  index: number
  option: ResolvedAutoCompleteOption
  active: boolean
  selected: boolean
  disabled?: boolean
  classes: string
}

export interface AutoCompleteInput {
  id?: RefOrValue<string>
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  model?: Ref<string>
  selectedValue?: Ref<AutoCompleteValue | null>
  type?: RefOrValue<FormInputFieldType>
  name?: RefOrValue<string>
  required?: RefOrValue<boolean>
  autocomplete?: RefOrValue<string>
  placeholder?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  icon?: RefOrValue<string>
  iconEnd?: RefOrValue<string>
  options?: RefOrValue<AutoCompleteOption[]>
  rowComponent?: RefOrValue<string>
  minLength?: RefOrValue<number | string>
  maxResults?: RefOrValue<number | string>
  openOnFocus?: RefOrValue<boolean>
  loading?: RefOrValue<boolean>
  emptyText?: RefOrValue<string>
  loadingText?: RefOrValue<string>
  onSelect?: (option: ResolvedAutoCompleteOption) => void
  onSearch?: (query: string) => void
  emits?: Emits<'optionselect' | 'querychange'>
  listboxId?: string
  isOpen?: Ref<boolean>
  activeIndex?: Ref<number>
  query?: ComputedRef<string>
  resolvedOptions?: ComputedRef<ResolvedAutoCompleteOption[]>
  filteredOptions?: ComputedRef<ResolvedAutoCompleteOption[]>
  rows?: ComputedRef<AutoCompleteRow[]>
  activeOptionId?: ComputedRef<string | undefined>
  shouldRenderPopup?: ComputedRef<boolean>
  showLoading?: ComputedRef<boolean>
  showEmpty?: ComputedRef<boolean>
  resolvedRowComponent?: ComputedRef<string>
  resolvedIconEnd?: ComputedRef<string | undefined>
  handleFocusIn?: () => void
  handleFocusOut?: () => void
  handleInput?: () => void
  handleKeydown?: (event: KeyboardEvent) => void
  handleOptionMouseDown?: (event: MouseEvent) => void
  selectRow?: (row: AutoCompleteRow) => void
}

export interface AutoCompleteOptionRow {
  option: RefOrValue<ResolvedAutoCompleteOption | null>
  active?: RefOrValue<boolean>
  selected?: RefOrValue<boolean>
  query?: RefOrValue<string>
}

const autoCompleteInputTemplate = html`<div
  class="auto-complete-input"
  @focusin="handleFocusIn"
  @focusout="handleFocusOut"
>
  <FormInputField
    :id="id"
    :label="label"
    :tone="tone"
    :variant="variant"
    :model="model"
    :type="type || 'search'"
    :name="name"
    :required="required"
    :autocomplete="autocomplete || 'off'"
    :placeholder="placeholder"
    :disabled="disabled"
    :icon="icon"
    :iconEnd="resolvedIconEnd"
    role="combobox"
    aria-autocomplete="list"
    :aria-controls="listboxId"
    :aria-expanded="isOpen"
    :aria-activedescendant="activeOptionId"
    @input="handleInput"
    @keydown="handleKeydown"
  />
  <div
    class="auto-complete-input__popup"
    r-if="shouldRenderPopup"
  >
    <div
      class="auto-complete-input__message"
      r-if="showLoading"
      role="status"
      aria-live="polite"
    >
      {{ loadingText || 'Loading suggestions' }}
    </div>
    <div
      class="auto-complete-input__message"
      r-if="showEmpty"
      role="status"
      aria-live="polite"
    >
      {{ emptyText || 'No suggestions' }}
    </div>
    <div
      class="auto-complete-input__listbox"
      :id="listboxId"
      role="listbox"
      r-if="!showLoading && !showEmpty"
    >
      <div
        class="auto-complete-input__option"
        :class="row.classes"
        role="option"
        :id="row.id"
        :aria-selected="row.active"
        :aria-disabled="row.disabled"
        r-for="row in rows"
        @mousedown="handleOptionMouseDown"
        @click="selectRow(row)"
      >
        <div
          :is="resolvedRowComponent"
          :option="row.option"
          :item="row.option"
          :index="row.index"
          :query="query"
          :active="row.active"
          :selected="row.selected"
          :disabled="row.disabled"
        ></div>
      </div>
    </div>
  </div>
</div>`

const autoCompleteOptionRowTemplate = html`<div class="auto-complete-input__default-row">
  <span class="auto-complete-input__default-label">{{ option?.label }}</span>
  <Icon
    class="auto-complete-input__default-check"
    name="lucide:check"
    r-if="selected"
  />
</div>`

function defineAutoCompleteInputComponent() {
  return defineComponent<AutoCompleteInput>(autoCompleteInputTemplate, {
    props: [
      'id',
      'label',
      'tone',
      'variant',
      'model',
      'selectedValue',
      'type',
      'name',
      'required',
      'autocomplete',
      'placeholder',
      'disabled',
      'icon',
      'iconEnd',
      'options',
      'rowComponent',
      'minLength',
      'maxResults',
      'openOnFocus',
      'loading',
      'emptyText',
      'loadingText',
      'onSelect',
      'onSearch',
    ],
    context: (head) => new AutoCompleteInputContext(head),
  })
}

function defineAutoCompleteOptionRowComponent() {
  return defineComponent<AutoCompleteOptionRow>(autoCompleteOptionRowTemplate, {
    props: ['option', 'active', 'selected', 'query'],
    context: (head) => head.props,
  })
}

export function defineAutoCompleteInputComponents() {
  return {
    autoCompleteInput: defineAutoCompleteInputComponent(),
    autoCompleteOptionRow: defineAutoCompleteOptionRowComponent(),
  }
}

class AutoCompleteInputContext implements AutoCompleteInput {
  readonly id: string
  readonly label?: RefOrValue<string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  readonly model: Ref<string>
  readonly selectedValue: Ref<AutoCompleteValue | null>
  readonly type?: RefOrValue<FormInputFieldType>
  readonly name?: RefOrValue<string>
  readonly required?: RefOrValue<boolean>
  readonly autocomplete?: RefOrValue<string>
  readonly placeholder?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly icon?: RefOrValue<string>
  readonly iconEnd?: RefOrValue<string>
  readonly options?: RefOrValue<AutoCompleteOption[]>
  readonly rowComponent?: RefOrValue<string>
  readonly minLength?: RefOrValue<number | string>
  readonly maxResults?: RefOrValue<number | string>
  readonly openOnFocus?: RefOrValue<boolean>
  readonly loading?: RefOrValue<boolean>
  readonly emptyText?: RefOrValue<string>
  readonly loadingText?: RefOrValue<string>
  readonly onSelect?: (option: ResolvedAutoCompleteOption) => void
  readonly onSearch?: (query: string) => void
  readonly emits?: Emits<'optionselect' | 'querychange'>
  readonly listboxId: string
  readonly isOpen = ref(false)
  readonly activeIndex = ref(-1)
  readonly query: ComputedRef<string>
  readonly resolvedOptions: ComputedRef<ResolvedAutoCompleteOption[]>
  readonly filteredOptions: ComputedRef<ResolvedAutoCompleteOption[]>
  readonly rows: ComputedRef<AutoCompleteRow[]>
  readonly activeOptionId: ComputedRef<string | undefined>
  readonly shouldRenderPopup: ComputedRef<boolean>
  readonly showLoading: ComputedRef<boolean>
  readonly showEmpty: ComputedRef<boolean>
  readonly resolvedRowComponent: ComputedRef<string>
  readonly resolvedIconEnd: ComputedRef<string | undefined>
  private readonly emit: ComponentHead<AutoCompleteInput>['emit']
  private closingTimer: ReturnType<typeof setTimeout> | undefined

  constructor(head: ComponentHead<AutoCompleteInput>) {
    const props = head.props
    Object.assign(this, props)
    this.emit = head.emit
    this.id = resolveAutoCompleteInputId(props.id)
    this.listboxId = `${this.id}-listbox`
    this.model = isRef(props.model) ? props.model : ref('')
    this.selectedValue = isRef(props.selectedValue)
      ? props.selectedValue
      : ref<AutoCompleteValue | null>(null)
    this.query = computed(() => String(unref(this.model) ?? ''))
    this.resolvedOptions = computed(() => {
      const options = unref(props.options)
      return Array.isArray(options)
        ? options.map(resolveAutoCompleteOption)
        : []
    })
    this.filteredOptions = computed(() => this.resolveFilteredOptions())
    this.rows = computed(() => this.resolveRows())
    this.activeOptionId = computed(() => this.rows()[this.activeIndex()]?.id)
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
        : 'AutoCompleteOptionRow'
    })
    this.resolvedIconEnd = computed(
      () =>
        unref(props.iconEnd) ||
        (unref(props.loading) ? 'lucide:loader-circle' : 'lucide:chevron-down'),
    )
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
    this.onSearch?.(query)
    this.emit('querychange', { query })
    this.selectedValue(null)
    if (this.meetsMinimumQueryLength()) this.open()
    else this.close()
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
    if (event.key === 'Enter' && this.isOpen()) {
      const row = this.rows()[this.activeIndex()]
      if (!row) return

      event.preventDefault()
      this.selectRow(row)
      return
    }
    if (event.key === 'Escape') {
      this.close()
    }
  }

  handleOptionMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    this.clearClosingTimer()
  }

  selectRow = (row: AutoCompleteRow) => {
    if (row.disabled || unref(this.disabled)) return

    const option = row.option
    this.model(option.label)
    this.selectedValue(option.value)
    this.onSelect?.(option)
    this.emit('optionselect', { option })
    this.close()
  }

  private resolveFilteredOptions() {
    const query = normalizeSearchText(this.query())
    if (!this.meetsMinimumQueryLength()) return []

    const options = this.resolvedOptions().filter(
      (option) =>
        !query ||
        option.keywords.some((keyword) =>
          normalizeSearchText(keyword).includes(query),
        ),
    )
    return options.slice(0, this.readPositiveInteger(this.maxResults, 10))
  }

  private resolveRows() {
    const activeIndex = this.activeIndex()
    const selectedValue = this.selectedValue()
    return this.filteredOptions().map(
      (option, index): AutoCompleteRow => ({
        id: `${this.listboxId}-option-${index}`,
        index,
        option,
        active: index === activeIndex,
        selected: selectedValue !== null && option.value === selectedValue,
        disabled: option.disabled,
        classes: [
          index === activeIndex ? 'auto-complete-input__option--active' : '',
          selectedValue !== null && option.value === selectedValue
            ? 'auto-complete-input__option--selected'
            : '',
          option.disabled ? 'auto-complete-input__option--disabled' : '',
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
    const rows = this.rows()
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
    const index = this.rows().findIndex((row) => !row.disabled)
    this.activeIndex(index)
  }

  private activateLast() {
    const rows = this.rows()
    for (let index = rows.length - 1; index >= 0; index -= 1) {
      if (rows[index]?.disabled) continue

      this.activeIndex(index)
      return
    }
    this.activeIndex(-1)
  }

  private ensureActiveIndex() {
    const rows = this.rows()
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
  option: AutoCompleteOption,
  label: string,
  value: AutoCompleteValue,
) {
  const keywords = unref(option.keywords)
  const source: string[] = Array.isArray(keywords)
    ? keywords.map((keyword) => String(unref(keyword) ?? ''))
    : typeof keywords === 'string'
      ? keywords.split(/\s+/)
      : []
  return [label, String(value), ...source].filter(Boolean)
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase()
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length
}

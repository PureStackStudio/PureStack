import {
  type AutoCompleteOption,
  defineBadgeComponents,
  defineFormComponents,
  defineGridComponents,
  defineIconComponents,
  defineMultiAutoCompleteInputComponents,
  definePanelComponents,
  type MultiAutoCompleteItem,
  type ResolvedAutoCompleteOption,
} from '@purestack/ts-components'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  flatten,
  html,
  type RefOrValue,
  ref,
  sref,
} from 'regor'

interface Recipient {
  name: string
  address: string
  team: string
  region: string
}

interface RecipientSuggestionRow {
  option: RefOrValue<ResolvedAutoCompleteOption | null>
  recipient?: ComputedRef<Recipient | null>
}

const RECIPIENTS: Recipient[] = [
  {
    name: 'Ada Lovelace',
    address: 'ada@example.com',
    team: 'Compiler systems',
    region: 'EU',
  },
  {
    name: 'Grace Hopper',
    address: 'grace@example.com',
    team: 'Developer tooling',
    region: 'US',
  },
  {
    name: 'Katherine Johnson',
    address: 'katherine@example.com',
    team: 'Mission control',
    region: 'US',
  },
  {
    name: 'Radia Perlman',
    address: 'radia@example.com',
    team: 'Edge routing',
    region: 'Global',
  },
]

const recipientOptions: AutoCompleteOption[] = RECIPIENTS.map((recipient) => ({
  label: `${recipient.name} <${recipient.address}>`,
  value: recipient.address,
  keywords: [
    recipient.name,
    recipient.address,
    recipient.team,
    recipient.region,
  ],
}))

const recipientSuggestionRowTemplate = html`<div class="multi-autocomplete-guide__recipient-row">
  <span class="multi-autocomplete-guide__avatar">
    {{ recipientInitials(recipient) }}
  </span>
  <span class="multi-autocomplete-guide__recipient-main">
    <strong>{{ recipient?.name || option?.label }}</strong>
    <span>{{ recipient?.address || option?.value }}</span>
  </span>
  <Badge tone="info" variant="surface">{{ recipient?.region }}</Badge>
</div>`

const guideMultiAutoCompleteTemplate = html`<Panel class="overflow-visible" tone="accent" variant="surface">
  <div class="multi-autocomplete-guide__shell">
    <h2>Recipient picker</h2>
    <Grid columns="1" columnsLg="2" alignItems="start">
      <MultiAutoCompleteInput
        label="Recipients"
        placeholder="Add a recipient"
        icon="lucide:mail"
        rowComponent="RecipientSuggestionRow"
        :items="recipients"
        :model="recipientQuery"
        :options="recipientOptions"
        :onCreateItem="createRecipientItem"
        :onOptionToItem="recipientOptionToItem"
        :onSplitInput="splitRecipients"
        emptyText="No recipient matches"/>
      <Panel tone="neutral" variant="surfaceAlt">
        <h3>Selection state</h3>
        <ul class="multi-autocomplete-guide__summary">
          <li r-for="recipient in recipients">
            <strong>{{ recipient.label }}</strong>
            <span>{{ recipient.value }}</span>
          </li>
        </ul>
        <FormStatus tone="accent">{{ recipientSummary }}</FormStatus>
      </Panel>
    </Grid>
  </div>
</Panel>`

class GuideMultiAutoComplete {
  readonly recipients = sref<MultiAutoCompleteItem[]>([
    { label: 'Ada Lovelace <ada@example.com>', value: 'ada@example.com' },
  ])
  readonly recipientQuery = ref('')
  readonly recipientOptions = recipientOptions
  readonly recipientSummary = computed(() => {
    const count = this.recipients().length
    return count === 1
      ? '1 recipient selected.'
      : `${count} recipients selected.`
  })

  createRecipientItem = (value: string): MultiAutoCompleteItem | null => {
    const label = value.trim()
    if (!label) return null

    const address = extractEmailAddress(label)
    return {
      label,
      value: address || label.toLocaleLowerCase(),
      invalid: !address,
    }
  }

  recipientOptionToItem = (option: ResolvedAutoCompleteOption) =>
    this.createRecipientItem(option.label)

  splitRecipients = (value: string) =>
    value
      .split(/[;,\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)
}

function defineRecipientSuggestionRow() {
  return defineComponent<RecipientSuggestionRow>(
    recipientSuggestionRowTemplate,
    {
      props: ['option', 'active', 'selected', 'disabled', 'query', 'index'],
      context: (head) => {
        const option = computed(() => flatten(head.props.option ?? null))
        return {
          ...head.props,
          option,
          recipient: computed(() => findRecipient(option())),
          recipientInitials,
        }
      },
    },
  )
}

function defineGuideMultiAutoComplete() {
  return defineComponent<GuideMultiAutoComplete>(
    guideMultiAutoCompleteTemplate,
    {
      context: () => new GuideMultiAutoComplete(),
    },
  )
}

function findRecipient(option: ResolvedAutoCompleteOption | null) {
  if (!option) return null
  return (
    RECIPIENTS.find((recipient) => recipient.address === option.value) ?? null
  )
}

function recipientInitials(recipient: Recipient | null) {
  if (!recipient) return ''
  return recipient.name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
}

function extractEmailAddress(value: string) {
  const match = /<([^<>@\s]+@[^<>\s]+)>/.exec(value)
  const address = (match?.[1] ?? value).trim().toLocaleLowerCase()
  return /^[^@\s<>]+@[^@\s<>]+$/.test(address) ? address : ''
}

const components = {
  ...defineBadgeComponents(),
  ...defineFormComponents(),
  ...defineGridComponents(),
  ...defineIconComponents(getSvgIcon),
  ...defineMultiAutoCompleteInputComponents(),
  ...definePanelComponents(),
  guideMultiAutoComplete: defineGuideMultiAutoComplete(),
  recipientSuggestionRow: defineRecipientSuggestionRow(),
}

const mount = document.querySelector('app#multi-auto-complete-input')
if (mount instanceof HTMLElement) {
  createApp(
    { components },
    {
      element: mount,
      template: html`<GuideMultiAutoComplete></GuideMultiAutoComplete>`,
    },
  )
  mount.setAttribute('data-multi-autocomplete-sample', 'runtime')
} else {
  console.error(
    '[multi-auto-complete-input-sample] mount element not found: expected `app#multi-auto-complete-input`.',
  )
}

import type {} from '@purestack/ts-page-scripts'
import {
  batch,
  computed,
  defineComponent,
  html,
  observe,
  onMounted,
  type RefOrValue,
  ref,
  sref,
  unref,
} from 'regor'
import type { Section } from './section'

export class TocPlayground {
  readonly title = ref('Client section 1')
  readonly automatic = ref(true)
  readonly status = ref(
    "Add a section, then find it in this page's table of contents.",
  )
  readonly sections = sref<Section[]>([])
  readonly hasSections = computed(() => this.sections().length > 0)
  readonly lastExcluded = computed(
    () => this.sections().at(-1)?.excluded() ?? false,
  )
  private nextKey = 0

  constructor(readonly prefix: RefOrValue<string>) {
    observe(this.automatic, (enabled) => {
      if (enabled) this.refresh()
      else
        this.status(
          'Automatic refresh is off. Change a heading, then press Refresh TOC.',
        )
    })
    onMounted(this.refresh)
  }

  refresh = () => {
    const toc = window.tsSsgPageToc
    if (!toc?.refresh) {
      this.status(
        'Live refresh is unavailable in this preview. Reload the page to try again.',
      )
      return
    }
    toc.refresh()
    batch(() => {
      for (const section of this.sections())
        section.id(section.heading()?.id ?? '')
      const included = this.sections().filter(
        (section) => !section.excluded(),
      ).length
      this.status(
        this.sections().length
          ? `TOC refreshed. ${included} of ${this.sections().length} playground sections included. Follow a TOC link to jump to its heading.`
          : 'TOC refreshed. Add a section to begin.',
      )
    })
  }

  add = () => {
    const value = this.readTitle()
    if (!value) return
    const section: Section = {
      key: ++this.nextKey,
      title: ref(value),
      excluded: ref(false),
      id: ref(''),
      heading: sref<HTMLHeadingElement | null>(null),
    }
    this.update(() => {
      this.sections([...this.sections(), section])
      this.title(
        /\d+$/.test(value)
          ? value.replace(/\d+$/, (number) => String(Number(number) + 1))
          : `${value} 1`,
      )
    })
  }

  rename = () => {
    const last = this.sections().at(-1)
    const value = this.readTitle()
    if (last && value) this.update(() => last.title(value))
  }

  reorder = () => {
    const last = this.sections().at(-1)
    if (!last || this.sections().length < 2) return
    this.update(() => this.sections([last, ...this.sections().slice(0, -1)]))
  }

  toggleExcluded = () => {
    const last = this.sections().at(-1)
    if (last) this.update(() => last.excluded(!last.excluded()))
  }

  remove = () => this.update(() => this.sections(this.sections().slice(0, -1)))
  clear = () => this.update(() => this.sections([]))

  private update(change: () => void) {
    // Regor flushes DOM bindings when batch returns, before refreshing the TOC.
    batch(change)
    if (this.automatic()) this.refresh()
    else this.status('Headings changed. Press Refresh TOC to update the links.')
  }

  private readTitle() {
    const value = this.title().trim()
    if (!value) {
      this.status('Enter a heading before adding or renaming a section.')
      document.getElementById(`${unref(this.prefix)}-title`)?.focus()
    }
    return value
  }
}

const playgroundTemplate = html`<Flex direction="column" class="gap-4">
  <TocPlaygroundControls/>
  <p class="text-muted m-0" r-if="!hasSections" data-toc-empty>
    No client headings yet. Add your first section above.
  </p>
  <Flex direction="column" class="gap-4" data-toc-sections>
    <TocPlaygroundSection
      r-for="section in sections"
      :key="section.key"
      :section="section"/>
  </Flex>
</Flex>`

export function defineTocPlayground() {
  return defineComponent<TocPlayground>(playgroundTemplate, {
    props: ['prefix'],
    context: (head) => new TocPlayground(head.props.prefix),
  })
}

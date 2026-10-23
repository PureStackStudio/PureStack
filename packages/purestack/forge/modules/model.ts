import { computed, ref, type SRef, sref } from 'regor'
import type {
  OptionValue,
  TemplateCategory,
  TemplateField,
} from '../../src/init/template-ui'
import { Connection, type ConnectionState } from './connection'
import type {
  CreationTask,
  ProjectResult,
  SessionCommand,
  SessionSnapshot,
  TemplateInfo,
} from './shared/protocol'

export type SectionId = 'site' | 'templates' | 'options' | 'setup' | 'review'
export type Navigate = (section: SectionId) => void

export interface NavigationEntry {
  id: SectionId
  number: string
  label: string
}

export interface TemplateEntry {
  id: string
  marker: string
  title: string
  description: string
}

export interface SummaryEntry {
  label: string
  value: string
}

export interface OptionState {
  field: TemplateField
  value: SRef<OptionValue>
}

export interface OptionGroup {
  id: string
  label: string
  description: string
  fields: OptionState[]
  categories: OptionGroup[]
}

export class ProjectModel {
  readonly section = ref<SectionId>('site')
  readonly title = ref('My Site')
  readonly directory = ref('my-site')
  readonly template = ref('starter')
  readonly install = ref(false)
  readonly git = ref(false)
  readonly error = ref('')
  readonly cwd = ref('')
  readonly connection = ref<ConnectionState>('connecting')
  readonly status = ref<SessionSnapshot['status']>('idle')
  readonly tasks = sref<CreationTask[]>([])
  readonly result = sref<ProjectResult | null>(null)
  readonly templateDetails = sref<TemplateInfo | null>(null)
  readonly templateLoading = ref(false)
  readonly categories = sref<OptionGroup[]>([])
  readonly templateSource = ref('')
  readonly busy = computed(
    () =>
      this.status() === 'creating' ||
      this.tasks().some((task) => task.state === 'running'),
  )
  readonly showCreation = computed(
    () =>
      this.status() === 'creating' ||
      this.status() === 'closing' ||
      Boolean(this.result()),
  )
  readonly canCreate = computed(
    () =>
      this.connection() === 'connected' &&
      !this.templateLoading() &&
      !this.busy(),
  )
  private client?: Connection
  private initialized = false
  /** Sent by this tab, not yet acknowledged by a server loading snapshot. */
  private requestedTemplate?: string
  private serverLoadingTemplate = false
  readonly sections: readonly NavigationEntry[] = [
    { id: 'site', number: '01', label: 'Site details' },
    { id: 'templates', number: '02', label: 'Starting template' },
    { id: 'options', number: '03', label: 'Template options' },
    { id: 'setup', number: '04', label: 'Project setup' },
    { id: 'review', number: '05', label: 'Review' },
  ]
  readonly templates = sref<TemplateEntry[]>([
    {
      id: 'starter',
      marker: 'S',
      title: 'Starter',
      description:
        'A polished website with light and dark themes, a customization guide, and an interactive launch checklist.',
    },
  ])
  readonly summary = computed<SummaryEntry[]>(() => [
    { label: 'Title', value: this.title() },
    { label: 'Folder', value: this.directory() },
    {
      label: 'Template',
      value:
        this.templates().find((entry) => entry.id === this.template())?.title ??
        this.template(),
    },
    {
      label: 'Dependencies',
      value: this.install() ? 'Install dependencies' : 'Install later',
    },
    {
      label: 'Git',
      value: this.git() ? 'Initialize or reuse' : 'Set up later',
    },
  ])

  chooseTemplate = (id: string) => {
    if (this.busy() || !this.client) return
    this.error('')
    this.requestedTemplate = this.send({ type: 'template', source: id })
      ? id
      : undefined
    this.updateTemplateLoading()
  }

  loadTemplate = () => {
    if (!this.templateSource().trim()) {
      this.error('Enter a template package, archive, or local folder.')
      return
    }
    this.chooseTemplate(this.templateSource().trim())
  }

  connect = () => {
    if (typeof location === 'undefined') return
    this.client = new Connection(
      (event) => {
        if (event.type === 'error') {
          this.error(event.message)
          // A rejected request never reaches the server's loading state.
          this.requestedTemplate = undefined
          this.updateTemplateLoading()
        } else this.applySnapshot(event.snapshot)
      },
      (state) => {
        this.connection(state)
        // The reconnect snapshot reports any load the server did receive.
        if (state !== 'connected') {
          this.requestedTemplate = undefined
          this.updateTemplateLoading()
        }
      },
    )
    this.client.connect(location)
  }

  dispose = () => this.client?.close()

  create = () => {
    this.select('review')
    if (this.section() !== 'review' || !this.canCreate()) return
    const values: Record<string, OptionValue> = {}
    const collect = (categories: OptionGroup[]) => {
      for (const category of categories) {
        for (const option of category.fields) {
          const input = option.value()
          values[option.field.id] =
            option.field.type === 'select'
              ? (option.field.choices?.find(
                  (choice) => String(choice.value) === String(input),
                )?.value ?? input)
              : input
        }
        collect(category.categories)
      }
    }
    collect(this.categories())
    this.send({
      type: 'create',
      configuration: {
        title: this.title(),
        directory: this.directory(),
        template: this.template(),
        install: this.install(),
        git: this.git(),
        values,
      },
    })
  }

  restartPreview = () => this.send({ type: 'preview' })
  finish = () => this.send({ type: 'finish' })

  private send(command: SessionCommand) {
    if (this.client?.send(command)) return true
    this.error(
      'Forge is reconnecting. Your choices are preserved; try again when connected.',
    )
    return false
  }

  /** Loading lasts until the server acknowledges the request and finishes the latest one. */
  private updateTemplateLoading() {
    this.templateLoading(
      this.requestedTemplate !== undefined || this.serverLoadingTemplate,
    )
  }

  private applySnapshot(snapshot: SessionSnapshot) {
    this.cwd(snapshot.cwd)
    this.templates(snapshot.templates)
    if (!this.initialized) {
      const config = snapshot.configuration
      this.title(config.title)
      this.directory(config.directory)
      this.install(config.install)
      this.git(config.git)
      this.template(config.template)
      this.initialized = true
    }
    if (snapshot.loadingTemplate === this.requestedTemplate)
      this.requestedTemplate = undefined
    this.serverLoadingTemplate = snapshot.loadingTemplate !== undefined
    this.updateTemplateLoading()
    // Only a confirmed template change replaces the options, keeping edits otherwise.
    if (this.templateDetails()?.source !== snapshot.template.source) {
      this.templateDetails(snapshot.template)
      this.template(snapshot.template.source)
      const category = (entry: TemplateCategory): OptionGroup => ({
        id: entry.id,
        label: entry.label,
        description: entry.description,
        fields: entry.fields.map((field) => ({
          field,
          value: sref<OptionValue>(
            snapshot.configuration.values[field.id] ?? field.default,
          ),
        })),
        categories: entry.categories.map(category),
      })
      this.categories(snapshot.template.ui.categories.map(category))
    }
    this.status(snapshot.status)
    this.tasks(snapshot.tasks)
    this.result(snapshot.result ?? null)
    if (snapshot.error) this.error(snapshot.error)
  }

  select: Navigate = (section) => {
    if (this.showCreation()) return
    this.error('')
    if (
      section === 'review' &&
      (!this.title().trim() || !this.directory().trim())
    ) {
      this.section('site')
      this.error('Enter a site title and project folder before reviewing.')
      return
    }
    this.section(section)
  }
}

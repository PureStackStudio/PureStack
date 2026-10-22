import path from 'node:path'
import type { DevWebSocketConnection } from '@purestack/ts-ssg'
import type {
  StudioEvent,
  StudioSnapshot,
  StudioTemplate,
} from '../../../wizard/modules/shared/protocol'
import { type CreateSiteResult, createSite } from '../../init/create-site'
import type { TaskRunner } from '../../init/tasks'
import { assertEmptyDestination } from '../../init/template'
import {
  type LoadedTemplate,
  officialTemplates,
  type TemplateEnvironment,
  type TemplateSourceStore,
} from '../../init/template-store'
import { resolveTemplateValues } from '../../init/template-ui'
import { type InitArguments, parseTemplateOverrides } from '../arguments'
import { nextCommands, progressTasks } from '../creation'
import { type CreationOutput, CreationView } from '../terminal/creation-view'
import { parseStudioCommand } from './commands'
import type { SitePreview } from './preview'

export interface StudioServices {
  store: TemplateSourceStore
  create?: typeof createSite
  preview(
    directory: string,
    signal: AbortSignal,
    stopped: () => void,
  ): Promise<SitePreview>
  output: CreationOutput
  finish(): void
}

function describe(template: LoadedTemplate): StudioTemplate {
  const { source, name, version, description, ui } = template
  return { source, name, version, description, ui }
}

/** Owns a single project creation; browser reconnects observe the same operation. */
export class StudioSession {
  private readonly peers = new Set<DevWebSocketConnection>()
  private readonly abort = new AbortController()
  private readonly pending = new Set<Promise<unknown>>()
  private selection = 0
  private live?: SitePreview
  private previewStarting = false
  private disposed = false
  private closing?: Promise<void>
  declare readonly snapshot: StudioSnapshot

  constructor(
    private readonly environment: TemplateEnvironment,
    private readonly services: StudioServices,
  ) {}

  async initialize(input: InitArguments) {
    const template = await this.services.store.load(input.template)
    const directory = input.directory ?? 'my-site'
    const configuration = {
      directory,
      title:
        input.title ??
        (input.directory
          ? path.basename(path.resolve(this.environment.cwd, directory))
          : 'My Site'),
      template: input.template,
      install: input.install,
      git: input.git,
      values: resolveTemplateValues(
        template.ui,
        parseTemplateOverrides(template.ui, input.sets),
      ),
    }
    const templates = officialTemplates.map((entry) => ({
      id: entry.id,
      title: entry.label,
      description: entry.description,
      marker: entry.label[0],
    }))
    if (!templates.some((entry) => entry.id === input.template))
      templates.push({
        id: input.template,
        title: template.name,
        description: template.description,
        marker: template.name[0],
      })
    Object.assign(this, {
      snapshot: {
        cwd: this.environment.cwd,
        version: this.environment.version,
        configuration,
        template: describe(template),
        templates,
        status: 'idle',
        tasks: [],
      } satisfies StudioSnapshot,
    })
  }

  connect(peer: DevWebSocketConnection) {
    if (this.disposed || this.peers.size >= 8) {
      peer.close(1008, 'Session unavailable.')
      return
    }
    this.peers.add(peer)
    this.send(peer, { type: 'snapshot', snapshot: this.snapshot })
    const unsubscribe = peer.onMessage((message) => {
      if (typeof message !== 'string') {
        peer.close(1003, 'Text messages required.')
        return
      }
      const task = this.handle(message).catch((error) => {
        this.send(peer, {
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        })
      })
      this.pending.add(task)
      void task.finally(() => this.pending.delete(task))
    })
    peer.onClose(() => {
      unsubscribe()
      this.peers.delete(peer)
    })
  }

  private async handle(message: string) {
    if (this.disposed || this.snapshot.status === 'closing') return
    const command = parseStudioCommand(message)
    if (this.snapshot.status === 'creating' || this.previewStarting)
      throw new Error('Wait for the current operation to finish.')
    if (command.type === 'finish') {
      this.snapshot.status = 'closing'
      this.publish()
      setImmediate(() => this.services.finish())
    } else if (command.type === 'preview') {
      if (!this.snapshot.result) throw new Error('Create your site first.')
      await this.startPreview()
    } else if (command.type === 'template') {
      if (this.snapshot.result)
        throw new Error('This project is already created.')
      const selection = ++this.selection
      this.snapshot.loadingTemplate = command.source
      this.publish()
      // A newer selection owns the loading state, so older outcomes are dropped.
      const current = () => selection === this.selection && !this.disposed
      let template: LoadedTemplate
      try {
        template = await this.services.store.load(command.source)
      } catch (error) {
        if (!current()) return
        this.snapshot.loadingTemplate = undefined
        this.publish()
        throw error
      }
      if (!current()) return
      this.snapshot.loadingTemplate = undefined
      this.snapshot.template = describe(template)
      this.snapshot.configuration.template = command.source
      this.snapshot.configuration.values = resolveTemplateValues(template.ui)
      if (!this.snapshot.templates.some((entry) => entry.id === command.source))
        this.snapshot.templates.push({
          id: command.source,
          title: template.name,
          description: template.description,
          marker: template.name[0],
        })
      this.publish()
    } else {
      if (this.snapshot.result)
        throw new Error(
          'This project is already created. Browse the live site or finish Studio.',
        )
      if (command.configuration.template !== this.snapshot.template.source)
        throw new Error('Wait for the selected template to load.')
      const plan = command.configuration
      plan.title = plan.title.trim()
      plan.values = resolveTemplateValues(
        this.snapshot.template.ui,
        plan.values,
      )
      // Lock before any async work so repeated clicks cannot create twice.
      ++this.selection
      this.snapshot.loadingTemplate = undefined
      this.snapshot.status = 'creating'
      this.snapshot.error = undefined
      this.snapshot.configuration = plan
      this.snapshot.tasks = [
        'Prepare selected template',
        'Validate project and compatibility',
        'Create project files',
        ...(plan.install ? ['Install dependencies'] : []),
        ...(plan.git ? ['Set up Git'] : []),
        'Start live site',
      ].map((label) => ({ label, state: 'pending' }))
      this.publish()
      try {
        await assertEmptyDestination(
          path.resolve(this.environment.cwd, plan.directory),
        )
        const template = await this.services.store.load(plan.template)
        const output = this.services.output
        output.write(
          new CreationView(output).start(
            plan.title,
            path.resolve(this.environment.cwd, plan.directory),
            this.environment.version,
          ),
        )
        const result = await (this.services.create ?? createSite)(
          plan,
          this.environment.version,
          this.environment.cwd,
          this.tasks(),
          { templateRoot: template.root, signal: this.abort.signal },
        )
        this.snapshot.result = {
          ...result,
          commands: nextCommands(result, this.environment.cwd),
        }
        await this.startPreview()
        this.snapshot.status = 'ready'
        this.printResult(result)
      } catch (error) {
        this.snapshot.status = this.snapshot.result ? 'ready' : 'failed'
        this.snapshot.error =
          error instanceof Error ? error.message : String(error)
      }
      this.publish()
    }
  }

  private tasks(): TaskRunner {
    const terminal = progressTasks(this.services.output)
    return async (label, action) => {
      let task = this.snapshot.tasks.find((entry) => entry.label === label)
      if (!task) {
        task = { label, state: 'pending' }
        const next = this.snapshot.tasks.findIndex(
          (entry) => entry.state === 'pending',
        )
        if (next === -1) this.snapshot.tasks.push(task)
        else this.snapshot.tasks.splice(next, 0, task)
      }
      task.state = 'running'
      this.publish()
      try {
        const value = await terminal(label, action)
        task.state = 'done'
        return value
      } catch (error) {
        task.state = 'failed'
        throw error
      } finally {
        this.publish()
      }
    }
  }

  private async startPreview() {
    const result = this.snapshot.result
    if (!result || this.previewStarting) return
    this.previewStarting = true
    result.previewError = undefined
    this.publish()
    try {
      await this.tasks()('Start live site', async () => {
        await this.live?.close()
        this.abort.signal.throwIfAborted()
        this.live = await this.services.preview(
          result.directory,
          this.abort.signal,
          () => {
            result.previewUrl = undefined
            result.previewError =
              'The live server stopped. You can start it again.'
            this.publish()
          },
        )
        result.previewUrl = this.live.url
      })
    } catch (error) {
      result.previewUrl = undefined
      result.previewError =
        error instanceof Error ? error.message : String(error)
    } finally {
      this.previewStarting = false
      this.publish()
    }
  }

  private printResult(result: CreateSiteResult) {
    const output = this.services.output
    output.write(
      new CreationView(output).complete(
        result,
        nextCommands(result, this.environment.cwd),
      ),
    )
    if (this.snapshot.result?.previewUrl)
      output.write(
        `\n  Live site: ${this.snapshot.result.previewUrl}\n  Studio remains open. Finish in the browser or press Ctrl+C here.\n`,
      )
  }

  private send(peer: DevWebSocketConnection, event: StudioEvent) {
    if (peer.open) peer.send(JSON.stringify(event))
  }

  private publish() {
    if (this.disposed) return
    for (const peer of this.peers)
      this.send(peer, { type: 'snapshot', snapshot: this.snapshot })
  }

  dispose() {
    this.closing ??= this.shutdown()
    return this.closing
  }

  private async shutdown() {
    if (this.snapshot) {
      this.snapshot.status = 'closing'
      this.publish()
    }
    this.disposed = true
    this.abort.abort()
    await Promise.allSettled(this.pending)
    await this.live?.close()
    await this.services.store.dispose()
  }
}

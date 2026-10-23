import type {
  CreateSitePlan,
  CreateSiteResult,
} from '../../../src/init/create-site'
import type { OptionValue, TemplateUi } from '../../../src/init/template-ui'

export const FORGE_SOCKET_PATH = '/__purestack/forge'
export type ProjectConfiguration = CreateSitePlan
export interface TemplateInfo {
  source: string
  name: string
  version: string
  description: string
  ui: TemplateUi
}
export interface TemplateChoice {
  id: string
  title: string
  description: string
  marker: string
}
export interface CreationTask {
  label: string
  state: 'pending' | 'running' | 'done' | 'failed'
}
export interface ProjectResult extends CreateSiteResult {
  commands: string[]
  previewUrl?: string
  previewError?: string
}
export interface SessionSnapshot {
  cwd: string
  version: string
  configuration: ProjectConfiguration
  templates: TemplateChoice[]
  template: TemplateInfo
  /** Source of the latest template selection while the server loads it. */
  loadingTemplate?: string
  status: 'idle' | 'creating' | 'ready' | 'failed' | 'closing'
  tasks: CreationTask[]
  result?: ProjectResult
  error?: string
}
export type SessionCommand =
  | { type: 'template'; source: string }
  | { type: 'create'; configuration: ProjectConfiguration }
  | { type: 'preview' }
  | { type: 'finish' }
export type SessionEvent =
  | { type: 'snapshot'; snapshot: SessionSnapshot }
  | { type: 'error'; message: string }

export type { OptionValue, TemplateUi }

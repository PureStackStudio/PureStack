import type {
  CreateSitePlan,
  CreateSiteResult,
} from '../../../src/init/create-site'
import type { OptionValue, TemplateUi } from '../../../src/init/template-ui'

export const STUDIO_SOCKET_PATH = '/__purestack/studio'
export type StudioConfiguration = CreateSitePlan
export interface StudioTemplate {
  source: string
  name: string
  version: string
  description: string
  ui: TemplateUi
}
export interface StudioTemplateChoice {
  id: string
  title: string
  description: string
  marker: string
}
export interface StudioTask {
  label: string
  state: 'pending' | 'running' | 'done' | 'failed'
}
export interface StudioResult extends CreateSiteResult {
  commands: string[]
  previewUrl?: string
  previewError?: string
}
export interface StudioSnapshot {
  cwd: string
  version: string
  configuration: StudioConfiguration
  templates: StudioTemplateChoice[]
  template: StudioTemplate
  /** Source of the latest template selection while the server loads it. */
  loadingTemplate?: string
  status: 'idle' | 'creating' | 'ready' | 'failed' | 'closing'
  tasks: StudioTask[]
  result?: StudioResult
  error?: string
}
export type StudioCommand =
  | { type: 'template'; source: string }
  | { type: 'create'; configuration: StudioConfiguration }
  | { type: 'preview' }
  | { type: 'finish' }
export type StudioEvent =
  | { type: 'snapshot'; snapshot: StudioSnapshot }
  | { type: 'error'; message: string }

export type { OptionValue, TemplateUi }

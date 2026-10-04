import type { BuildResult } from '../site'

export interface IncrementalBuildResult {
  fullRebuild: boolean
  changedPages: number
  changedAssets: number
  deletedPages: number
  deletedAssets: number
  /** Pages marked to render again on their next request. */
  markedPages: number
  reason: string
}

export interface IncrementalBuilder {
  buildAll: (reason: string) => Promise<BuildResult>
  applyChange: (filePath: string) => Promise<IncrementalBuildResult>
  renderIfDirtyByOutPath: (outPath: string) => Promise<boolean>
  renderByUrlPath: (urlPath: string) => Promise<boolean>
}

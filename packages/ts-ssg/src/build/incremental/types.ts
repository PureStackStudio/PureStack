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
  /** Prepares shared state without rendering pages or copying static assets. */
  prepareForRequests: () => Promise<void>
  buildAll: (reason: string) => Promise<BuildResult>
  applyChange: (filePath: string) => Promise<IncrementalBuildResult>
  /** Shares discovery/navigation across a burst; stops before the next file on abort. */
  applyChanges: (
    filePaths: readonly string[],
    signal?: AbortSignal,
  ) => Promise<IncrementalBuildResult[]>
  renderIfDirtyByOutPath: (outPath: string) => Promise<boolean>
  renderByUrlPath: (urlPath: string, locale?: string) => Promise<boolean>
  /** Writes styles and discovered scripts before a dev response is served. */
  preparePageAssets: () => Promise<void>
  /** Returns true when the URL belongs to a discovered asset or dev search. */
  prepareAssetByUrlPath: (urlPath: string) => Promise<boolean>
}

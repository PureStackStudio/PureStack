import type { SiteConfigInput, WriteStylesResult } from '@purestack/ts-common'
import { OutputDirectoryLocks } from '@purestack/ts-util-node'
import type { ResolvedContentFile } from '../i18n/content'
import type { NavigationTree } from '../navigation/navigation'
import type { PureStackPlugin } from '../plugins/plugin'
import type { PublishOptions } from './build-config'
import { createIncrementalBuildSession } from './incremental'
import { ensureLogger } from './logger'
import type { BuildContext, PageDocument, PageRenderResult } from './page'

export type { PublishOptions } from './build-config'

export interface BuildResult {
  outDir: string
  pages: number
  content?: BuildCountSummary
  assets?: BuildCountSummary
}

export interface BuildCountSummary {
  total: number
  byExt: Record<string, number>
}

export interface BuildHooks {
  onConfigResolved?: (context: BuildContext) => void | Promise<void>
  onContentDiscovered?: (
    context: BuildContext,
    files: ResolvedContentFile[],
  ) => void | Promise<void>
  onNavigationBuilt?: (
    context: BuildContext,
    navigation: NavigationTree | undefined,
  ) => void | Promise<void>
  onPageStart?: (
    context: BuildContext,
    file: ResolvedContentFile,
  ) => void | Promise<void>
  /**
   * Runs on a page's rendered document, before it becomes HTML and before its
   * links resolve, so links it adds resolve like written ones.
   */
  onPageDocument?: (
    context: BuildContext,
    page: PageDocument,
  ) => void | Promise<void>
  onPageRendered?: (
    context: BuildContext,
    page: PageRenderResult,
  ) => void | Promise<void>
  onPageWritten?: (
    context: BuildContext,
    page: PageRenderResult,
  ) => void | Promise<void>
  onStylesWritten?: (
    context: BuildContext,
    result: WriteStylesResult,
  ) => void | Promise<void>
  onBuildComplete?: (
    context: BuildContext,
    result: BuildResult,
  ) => void | Promise<void>
}

export interface BuildOptions {
  cleanOutDir?: boolean
  /**
   * Builds into `<outDir>-<outName>`, so a second build or dev server can run
   * beside the default output. Lowercase letters, digits, and hyphens.
   */
  outName?: string
  /** `false` skips persistent plugin caches outside the output directory. Defaults to `true`. */
  cache?: boolean
  writeErrorPages?: boolean
  /** Include the standard component, theme, browser-runtime, highlighting, and search plugins. */
  defaultPlugins?: boolean
  /** Extensions to apply, in order. See {@link PureStackPlugin}. */
  plugins?: PureStackPlugin[]
}

export interface BuildInput {
  siteConfig?: SiteConfigInput
  options?: BuildOptions
  publish?: PublishOptions
}

export async function buildSite(input: BuildInput = {}): Promise<BuildResult> {
  await ensureLogger()
  const outputLocks = new OutputDirectoryLocks()
  try {
    const { builder } = await createIncrementalBuildSession(input, outputLocks)
    return await builder.buildAll('full build')
  } finally {
    await outputLocks.release()
  }
}

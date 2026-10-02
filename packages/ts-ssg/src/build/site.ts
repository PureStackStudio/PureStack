import type { PageTemplateMap, SiteConfigInput } from '@purestack/ts-common'
import type { ResolvedContentFile } from '../i18n/content'
import type { NavigationTree } from '../navigation/navigation'
import type { PublishOptions } from './build-config'
import { createIncrementalBuilder } from './incremental'
import type { BuildContext, PageRenderResult } from './page'
import type { WriteStylesResult } from './styles'

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
  writeErrorPages?: boolean
  hooks?: BuildHooks
  components?: Record<string, object>
  templates?: PageTemplateMap
}

export interface BuildInput {
  siteConfig?: SiteConfigInput
  options?: BuildOptions
  publish?: PublishOptions
}

export async function buildSite(input: BuildInput = {}): Promise<BuildResult> {
  const builder = await createIncrementalBuilder(input)
  return builder.buildAll('full build')
}

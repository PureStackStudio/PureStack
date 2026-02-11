import type { Component } from 'regor'

import type { PartialSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import type {
  MdxCodeHighlighter,
  MdxCodeLangs,
  MdxCodeThemes,
} from '../mdx/highlight'
import type { NavigationConfig, NavigationTree } from '../navigation/navigation'
import type { PageTemplateMap } from '../templates/page-templates'
import { createIncrementalBuilder } from './incremental'
import type { BuildContext, PageRenderResult } from './page'
import type { WriteStylesResult } from './styles'

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
    files: ContentFile[],
  ) => void | Promise<void>
  onNavigationBuilt?: (
    context: BuildContext,
    navigation: NavigationTree | undefined,
  ) => void | Promise<void>
  onPageStart?: (
    context: BuildContext,
    file: ContentFile,
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
  concurrency?: number
  hooks?: BuildHooks
  components?: Record<string, Component<unknown>>
  templates?: PageTemplateMap
  navigation?: NavigationConfig
  mdx?: MdxOptions
}

export type BuildInput = PartialSiteConfig & BuildOptions

export interface MdxOptions {
  highlighter?: MdxCodeHighlighter
  themes?: MdxCodeThemes
  langs?: MdxCodeLangs
  disableHighlighter?: boolean
}

export async function buildSite(input: BuildInput = {}): Promise<BuildResult> {
  const builder = await createIncrementalBuilder(input)
  return builder.buildAll('full build')
}

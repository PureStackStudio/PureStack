import { getLogger } from 'logpot'
import type { Component } from 'regor'

import { type PartialSiteConfig, resolveSiteConfig } from '../config/config'
import { type ContentFile, discoverContent } from '../discover/content'
import { copyStaticAssets } from './assets'
import { prepareOutDir } from './io'
import {
  type BuildContext,
  type PageRenderResult,
  renderPageFromFile,
  writePage,
} from './page'
import { writeStyles, type WriteStylesResult } from './styles'

export interface BuildResult {
  outDir: string
  pages: number
}

export interface BuildHooks {
  onConfigResolved?: (context: BuildContext) => void | Promise<void>
  onContentDiscovered?: (
    context: BuildContext,
    files: ContentFile[],
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
}

export type BuildInput = PartialSiteConfig & BuildOptions

export async function buildSite(input: BuildInput = {}): Promise<BuildResult> {
  const config = resolveSiteConfig(input)
  const log = getLogger()
  const hooks = input.hooks ?? {}
  const context: BuildContext = {
    config,
    components: input.components,
  }

  await hooks.onConfigResolved?.(context)

  log.info('build config resolved', {
    contentDir: config.contentDir,
    outDir: config.outDir,
  })

  await prepareOutDir(config.outDir, { clean: input.cleanOutDir })

  await copyStaticAssets(config.contentDir, config.outDir)

  const files = await discoverContent(config.contentDir)
  await hooks.onContentDiscovered?.(context, files)

  const concurrency = normalizeConcurrency(input.concurrency)
  let pages = 0

  await runWithConcurrency(files, concurrency, async (file) => {
    await hooks.onPageStart?.(context, file)
    const page = await renderPageFromFile(context, file)
    await hooks.onPageRendered?.(context, page)
    await writePage(page)
    await hooks.onPageWritten?.(context, page)
    pages += 1
  })

  const styleResult = await writeStyles(config.outDir, config.styleFileName)
  await hooks.onStylesWritten?.(context, styleResult)

  const result = { outDir: config.outDir, pages }
  await hooks.onBuildComplete?.(context, result)
  return result
}

function normalizeConcurrency(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.max(1, Math.floor(value))
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  if (items.length === 0) return
  const limit = Math.min(concurrency, items.length)
  let index = 0
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const current = index
      index += 1
      if (current >= items.length) return
      await worker(items[current])
    }
  })
  await Promise.all(workers)
}

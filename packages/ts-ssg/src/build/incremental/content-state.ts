import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import type { Logger } from 'logpot'
import {
  buildTranslationsByKey,
  type ResolvedContentFile,
  resolveContentFile,
} from '../../i18n/content'
import { buildNavigation } from '../../navigation/navigation'
import type { ContentRouteIndex } from '../content-urls'
import {
  type BuildManifest,
  type FileSignature,
  readSignature,
} from '../manifest'
import { resolveOutPath } from '../out-path'
import {
  type BuildContext,
  buildPage,
  renderPageFromFile,
  resolveHeaderFooterHtml,
  resolvePagePartials,
  writePage,
  writePageError,
} from '../page'
import type { BuildHooks } from '../site'
import {
  discoverSiteContent,
  ManifestContentIndex,
  normalizeUrlPath,
  removeFile,
  toContentFile,
} from './support'
import type { IncrementalBuildResult } from './types'

interface IncrementalContentStateInput {
  config: SiteConfig
  context: BuildContext
  log: Logger
  onPageBuilt: (relPath: string, scriptEntrypoints: string[]) => void
  persistManifest: () => Promise<void>
  getManifest: () => BuildManifest
}

interface RebuildNavigatedContentInput {
  contentFiles: ResolvedContentFile[]
  relPath: string
  ext: string
  signature: FileSignature
  result: IncrementalBuildResult
}

interface RebuildSingleContentInput {
  relPath: string
  ext: string
  signature: FileSignature
  result: IncrementalBuildResult
}

export class IncrementalContentState {
  private readonly dirtyPages = new Set<string>()
  private markedPages = 0
  private readonly renderInFlight = new Map<string, Promise<boolean>>()
  private readonly contentIndex: ManifestContentIndex

  constructor(private readonly input: IncrementalContentStateInput) {
    this.contentIndex = new ManifestContentIndex(
      input.config.contentDir,
      input.config,
    )
    this.contentIndex.rebuildFromManifest(input.getManifest())
  }

  rebuildIndexFromManifest() {
    this.contentIndex.rebuildFromManifest(this.input.getManifest())
  }

  clearDirtyPages() {
    this.dirtyPages.clear()
  }

  /** Pages marked to render on their next request since the last call. */
  takeMarkedPageCount() {
    const count = this.markedPages
    this.markedPages = 0
    return count
  }

  async renderAllPages(contentFiles: ResolvedContentFile[], hooks: BuildHooks) {
    let pages = 0
    for (const file of contentFiles) {
      try {
        await hooks.onPageStart?.(this.input.context, file)
        const page = await renderPageFromFile(this.input.context, file)
        this.input.onPageBuilt(file.relPath, page.scriptEntrypoints)
        await hooks.onPageRendered?.(this.input.context, page)
        await writePage(page, this.input.config.html.minify)
        await hooks.onPageWritten?.(this.input.context, page)
        pages += 1
      } catch (error) {
        if (this.input.context.writeErrorPages !== true) {
          throw error
        }
        this.input.log.error('page build failed', {
          relPath: file.relPath,
          error: error instanceof Error ? error.message : String(error),
        })
        const page = await writePageError(this.input.context, file, error)
        this.input.onPageBuilt(file.relPath, page.scriptEntrypoints)
      }
    }
    return pages
  }

  async renderIfDirtyByOutPath(outPath: string) {
    const relPath = this.contentIndex.getRelPathByOutPath(outPath)
    if (!relPath) return false
    return this.renderPageByRelPath(relPath, true)
  }

  async renderByUrlPath(urlPath: string) {
    const normalized = normalizeUrlPath(urlPath)
    let relPath = this.contentIndex.getRelPathByUrlPath(normalized)
    if (!relPath) {
      const contentFiles = await this.refreshContent()
      this.contentIndex.updateUrlPathMapFromFiles(contentFiles)
      relPath = this.contentIndex.getRelPathByUrlPath(normalized)
      if (!relPath) return false
    }
    return this.renderPageByRelPath(relPath, false)
  }

  /**
   * Re-reads the site's pages. Adding or removing a page can change where
   * any content URL resolves, so every page becomes dirty; edits that keep
   * the same pages cost nothing beyond discovery.
   */
  async refreshContent() {
    const { config, context } = this.input
    const contentFiles = await discoverSiteContent(config)
    this.updateContentRoutes(context.contentRoutes.withPages(contentFiles))
    context.translationsByKey = buildTranslationsByKey(contentFiles)
    return contentFiles
  }

  /** Picks up added or removed assets from the manifest. */
  refreshAssets() {
    const { context, getManifest } = this.input
    this.updateContentRoutes(
      context.contentRoutes.withAssets(Object.keys(getManifest().assets)),
    )
  }

  private updateContentRoutes(contentRoutes: ContentRouteIndex) {
    const { context } = this.input
    const filesChanged = !contentRoutes.hasSameFiles(context.contentRoutes)
    context.contentRoutes = contentRoutes
    if (filesChanged) this.markAllPagesDirty(contentRoutes.pages)
  }

  /**
   * Rebuilds navigation. Every page shows it, so all pages become dirty when
   * it changes; an edit that leaves it alone touches no other page.
   */
  async refreshNavigation() {
    const { config, context } = this.input
    const contentFiles = await this.refreshContent()
    const navigation = await buildNavigation(
      config.contentDir,
      contentFiles,
      config.navigation,
    )
    if (JSON.stringify(navigation) !== JSON.stringify(context.navigation)) {
      context.navigation = navigation
      this.markAllPagesDirty(contentFiles)
    }
    return contentFiles
  }

  /**
   * Compiles the header and footer partials again. Only pages whose nearest
   * header or footer changed become dirty, so an edit in one folder leaves
   * pages elsewhere alone.
   */
  async refreshPartials() {
    const { context } = this.input
    const pages = context.contentRoutes.pages
    const before = pages.map((page) => resolvePagePartials(context, page))
    await resolveHeaderFooterHtml(context)
    this.markPagesDirty(
      pages
        .filter((page, index) => {
          const after = resolvePagePartials(context, page)
          return (
            after.headerHtml !== before[index].headerHtml ||
            after.footerHtml !== before[index].footerHtml
          )
        })
        .map((page) => page.relPath),
    )
  }

  async removeContentEntryForDeletedSource(
    relPath: string,
    result: IncrementalBuildResult,
  ) {
    const contentEntry = this.input.getManifest().content[relPath]
    if (!contentEntry) return
    await removeFile(contentEntry.outPath)
    delete this.input.getManifest().content[relPath]
    this.contentIndex.remove(relPath)
    this.dirtyPages.delete(relPath)
    result.deletedPages += 1
  }

  async rebuildNavigatedContent(input: RebuildNavigatedContentInput) {
    const { contentFiles, relPath, ext, signature, result } = input
    const contentFile =
      contentFiles.find((file) => file.relPath === relPath) ??
      this.toResolvedContentFile(relPath, ext)
    const page = await buildPage(this.input.context, contentFile)
    this.input.onPageBuilt(contentFile.relPath, page.scriptEntrypoints)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    result.changedPages += 1
    this.dirtyPages.delete(relPath)
  }

  async rebuildSingleContent(input: RebuildSingleContentInput) {
    const { relPath, ext, signature, result } = input
    const contentFile = this.toResolvedContentFile(relPath, ext)
    const page = await buildPage(this.input.context, contentFile)
    this.input.onPageBuilt(contentFile.relPath, page.scriptEntrypoints)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    result.changedPages += 1
  }

  async renderAndPersistRelPath(relPath: string, signature: FileSignature) {
    const ext = this.resolveContentExt(relPath)
    const contentFile = this.toResolvedContentFile(relPath, ext)
    const page = await buildPage(this.input.context, contentFile)
    this.input.onPageBuilt(contentFile.relPath, page.scriptEntrypoints)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    this.dirtyPages.delete(relPath)
    await this.input.persistManifest()
    return true
  }

  async rebuildContentRelPaths(
    relPaths: string[],
    result: IncrementalBuildResult,
  ) {
    const uniqueRelPaths = [...new Set(relPaths)]
    for (const relPath of uniqueRelPaths) {
      const signature = await this.readRelPathSignature(relPath)
      if (!signature) {
        await this.handleMissingRelPathSource(relPath)
        continue
      }
      const rendered = await this.renderAndPersistRelPath(relPath, signature)
      if (rendered) result.changedPages += 1
    }
  }

  async handleMissingRelPathSource(relPath: string) {
    const entry = this.input.getManifest().content[relPath]
    if (entry) {
      await removeFile(entry.outPath)
      delete this.input.getManifest().content[relPath]
      this.contentIndex.remove(relPath)
      await this.input.persistManifest()
    }
    this.dirtyPages.delete(relPath)
    return false
  }

  upsertContentManifestEntry(
    relPath: string,
    ext: string,
    signature: FileSignature,
  ) {
    const contentFile = this.toResolvedContentFile(relPath, ext)
    const outPath = resolveOutPath(this.input.config.outDir, contentFile)
    this.input.getManifest().content[relPath] = {
      relPath,
      ext,
      outPath,
      ...signature,
    }
    this.contentIndex.set(relPath, outPath, ext)
  }

  private toResolvedContentFile(relPath: string, ext: string) {
    const file = toContentFile(this.input.config.contentDir, relPath, ext)
    return resolveContentFile(this.input.config, file)
  }

  private resolveContentExt(relPath: string) {
    return (
      this.input.getManifest().content[relPath]?.ext ?? path.extname(relPath)
    )
  }

  private markAllPagesDirty(contentFiles: readonly ResolvedContentFile[]) {
    this.dirtyPages.clear()
    this.markPagesDirty(contentFiles.map((file) => file.relPath))
  }

  private markPagesDirty(relPaths: readonly string[]) {
    for (const relPath of relPaths) this.dirtyPages.add(relPath)
    this.markedPages += relPaths.length
  }

  private async renderPageByRelPath(relPath: string, onlyIfDirty: boolean) {
    if (onlyIfDirty && !this.dirtyPages.has(relPath)) return false
    const inFlight = this.renderInFlight.get(relPath)
    if (inFlight) return inFlight

    const task = (async () => {
      try {
        const signature = await this.readRelPathSignature(relPath)
        if (!signature) {
          return this.handleMissingRelPathSource(relPath)
        }
        return this.renderAndPersistRelPath(relPath, signature)
      } catch (error) {
        this.input.log.error('incremental render failed', {
          relPath,
          error: error instanceof Error ? error.message : String(error),
        })
        return false
      } finally {
        this.renderInFlight.delete(relPath)
      }
    })()
    this.renderInFlight.set(relPath, task)
    return task
  }

  private async readRelPathSignature(relPath: string) {
    const absPath = path.join(this.input.config.contentDir, relPath)
    return readSignature(absPath)
  }
}

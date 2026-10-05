import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { toPosixPath } from '@purestack/ts-util'
import type { Logger } from 'logpot'
import {
  buildTranslationsByKey,
  type ResolvedContentFile,
  resolveContentFile,
} from '../../i18n/content'
import { buildNavigation } from '../../navigation/navigation'
import type { PureStackPlugin } from '../../plugins/plugin'
import type { ContentRouteIndex } from '../content-urls'
import {
  type BuildManifest,
  type FileSignature,
  readContentSignature,
  readSignature,
} from '../manifest'
import { resolveOutPath } from '../out-path'
import {
  type BuildContext,
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
  hooks: BuildHooks
  plugins: readonly PureStackPlugin[]
  log: Logger
  onPageBuilt: (relPath: string, scriptEntrypoints: string[]) => void
  onPageRemoved: (relPath: string) => void
  renderOnRequest: () => boolean
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
  private readonly dirtyPages = new Map<string, number>()
  private dirtyVersion = 0
  private markedPages = 0
  private generatedPages = new Map<string, ResolvedContentFile>()
  /** The files each page imports, by page. */
  private importedFilesByPage = new Map<string, ReadonlySet<string>>()
  /** Output paths of the pages whose frontmatter sets index: false. */
  private unindexedPages = new Map<string, string>()
  private readonly renderInFlight = new Map<string, Promise<boolean>>()
  private readonly contentIndex: ManifestContentIndex

  constructor(private readonly input: IncrementalContentStateInput) {
    this.contentIndex = new ManifestContentIndex(
      input.config.contentDir,
      input.config,
    )
    this.contentIndex.rebuildFromManifest(input.getManifest())
    for (const entry of Object.values(input.getManifest().content)) {
      if (entry.index === false)
        this.unindexedPages.set(entry.relPath, entry.outPath)
    }
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

  async renderAllPages(contentFiles: ResolvedContentFile[]) {
    this.importedFilesByPage.clear()
    this.unindexedPages.clear()
    let pages = 0
    for (const file of contentFiles) {
      if (await this.writePageWithHooks(file)) pages += 1
    }
    return pages
  }

  /**
   * Renders and writes one page inside its page hooks. Full builds and
   * incremental renders both come through here, so `build` and `serve`
   * produce the same output. Returns false when an error page was written.
   */
  private async writePageWithHooks(file: ResolvedContentFile) {
    const { context, hooks, config } = this.input
    try {
      await hooks.onPageStart?.(context, file)
      const page = await renderPageFromFile(context, file, hooks)
      this.importedFilesByPage.set(file.relPath, new Set(page.importedFiles))
      if (page.frontmatter.index === false) {
        this.unindexedPages.set(file.relPath, page.outPath)
      } else {
        this.unindexedPages.delete(file.relPath)
      }
      await hooks.onPageRendered?.(context, page)
      await writePage(page, config.html.minify)
      await hooks.onPageWritten?.(context, page)
      this.input.onPageBuilt(file.relPath, page.scriptEntrypoints)
      return true
    } catch (error) {
      if (context.writeErrorPages !== true) throw error
      this.input.log.error('page build failed', {
        relPath: file.relPath,
        error: error instanceof Error ? error.message : String(error),
      })
      const page = await writePageError(context, file, error)
      this.input.onPageBuilt(file.relPath, page.scriptEntrypoints)
      return false
    }
  }

  async renderIfDirtyByOutPath(outPath: string) {
    const relPath = this.contentIndex.getRelPathByOutPath(outPath)
    if (!relPath) return false
    return this.renderPageByRelPath(relPath, true)
  }

  async renderByUrlPath(urlPath: string, locale?: string) {
    const normalized = normalizeUrlPath(urlPath)
    const outputRelPath = urlPath.endsWith('/index.html')
      ? this.contentIndex.getRelPathByOutPath(
          path.resolve(this.input.config.outDir, `.${urlPath}`),
        )
      : undefined
    let relPath =
      outputRelPath ?? this.contentIndex.getRelPathByUrlPath(normalized)
    if (
      !outputRelPath &&
      locale &&
      this.input.config.i18n.urlStrategy === 'hidden'
    ) {
      relPath =
        this.input.context.contentRoutes.pages.find(
          (file) => file.urlPath === normalized && file.locale === locale,
        )?.relPath ?? relPath
    }
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
    const { config, context, plugins } = this.input
    const contentFiles = await discoverSiteContent(config, plugins)
    const generated = this.trackGeneratedPages(contentFiles)
    for (const relPath of generated.removed) {
      await this.handleMissingRelPathSource(relPath)
      this.input.onPageRemoved(relPath)
    }
    this.updateContentRoutes(context.contentRoutes.withPages(contentFiles))
    this.indexContentFiles(contentFiles)
    this.markPagesDirty(generated.changed)
    context.translationsByKey = buildTranslationsByKey(contentFiles)
    return contentFiles
  }

  /**
   * Maps the URLs of freshly discovered pages, so a request finds a new page
   * before the build that discovered it writes the manifest.
   */
  indexContentFiles(contentFiles: ResolvedContentFile[]) {
    this.contentIndex.clear()
    this.contentIndex.updateUrlPathMapFromFiles(contentFiles)
    for (const file of contentFiles) {
      this.contentIndex.setOutPath(
        file.relPath,
        resolveOutPath(this.input.config.outDir, file),
      )
    }
  }

  /** Generators may read data files, so an asset change runs them again. */
  async refreshGeneratedPages() {
    if (this.input.plugins.some((plugin) => plugin.pages)) {
      await this.refreshContent()
    }
  }

  /**
   * Remembers the generated pages among `contentFiles` and reports which
   * ones changed their source or stopped being generated.
   */
  trackGeneratedPages(contentFiles: readonly ResolvedContentFile[]) {
    const previous = this.generatedPages
    const changed: string[] = []
    this.generatedPages = new Map()
    for (const file of contentFiles) {
      if (file.source === undefined) continue
      const before = previous.get(file.relPath)
      // A source function's text is never kept, so it counts as changed on
      // every regeneration; its page renders again when next requested.
      const sourceChanged =
        typeof file.source === 'function' || before?.source !== file.source
      if (before && sourceChanged) changed.push(file.relPath)
      this.generatedPages.set(file.relPath, file)
    }
    const removed = [...previous.keys()].filter(
      (relPath) => !this.generatedPages.has(relPath),
    )
    return { changed, removed }
  }

  /** Picks up added or removed assets from the manifest. */
  refreshAssets(assetRelPaths = Object.keys(this.input.getManifest().assets)) {
    const { context } = this.input
    this.updateContentRoutes(context.contentRoutes.withAssets(assetRelPaths))
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
   * Marks the pages that import a changed file, and refreshes the headers and
   * footers when one of them imports it.
   */
  async refreshImporters(relPath: string) {
    const changed = toPosixPath(relPath)
    if (this.input.context.partialImportedFiles?.has(changed)) {
      await this.refreshPartials()
    }
    const importers: string[] = []
    for (const [page, imports] of this.importedFilesByPage) {
      if (imports.has(changed)) importers.push(page)
    }
    this.markPagesDirty(importers)
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
    this.importedFilesByPage.delete(relPath)
    this.unindexedPages.delete(relPath)
    this.input.onPageRemoved(relPath)
    result.deletedPages += 1
  }

  async rebuildNavigatedContent(input: RebuildNavigatedContentInput) {
    const { contentFiles, relPath, ext, signature, result } = input
    const contentFile =
      contentFiles.find((file) => file.relPath === relPath) ??
      this.toResolvedContentFile(relPath, ext)
    await this.writePageWithHooks(contentFile)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    result.changedPages += 1
    this.dirtyPages.delete(relPath)
  }

  async rebuildSingleContent(input: RebuildSingleContentInput) {
    const { relPath, ext, signature, result } = input
    const contentFile = this.toResolvedContentFile(relPath, ext)
    await this.writePageWithHooks(contentFile)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    result.changedPages += 1
  }

  async renderAndPersistRelPath(relPath: string, signature: FileSignature) {
    const dirtyVersion = this.dirtyPages.get(relPath)
    const ext = this.resolveContentExt(relPath)
    const contentFile = this.toResolvedContentFile(relPath, ext)
    await this.writePageWithHooks(contentFile)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    // An edit received while this render was running still needs a new render.
    if (this.dirtyPages.get(relPath) === dirtyVersion) {
      this.dirtyPages.delete(relPath)
    }
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
      this.input.onPageRemoved(relPath)
      await this.input.persistManifest()
    }
    this.dirtyPages.delete(relPath)
    this.importedFilesByPage.delete(relPath)
    this.unindexedPages.delete(relPath)
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
      ...(this.unindexedPages.has(relPath) ? { index: false as const } : {}),
    }
    this.contentIndex.set(relPath, outPath, ext)
  }

  /** Output paths of the pages whose frontmatter sets index: false. */
  unindexedOutPaths() {
    return [...this.unindexedPages.values()]
  }

  /** Marks the manifest entries of pages whose frontmatter sets index: false. */
  markUnindexedEntries(manifest: BuildManifest) {
    for (const relPath of this.unindexedPages.keys()) {
      const entry = manifest.content[relPath]
      if (entry) entry.index = false
    }
  }

  private toResolvedContentFile(relPath: string, ext: string) {
    const generated = this.generatedPages.get(relPath)
    if (generated) return generated
    const file = toContentFile(this.input.config.contentDir, relPath, ext)
    return resolveContentFile(this.input.config, file)
  }

  private resolveContentExt(relPath: string) {
    return (
      this.input.getManifest().content[relPath]?.ext ?? path.extname(relPath)
    )
  }

  markAllPagesDirty(contentFiles: readonly ResolvedContentFile[]) {
    this.dirtyPages.clear()
    this.markPagesDirty(contentFiles.map((file) => file.relPath))
  }

  markPagesDirty(relPaths: readonly string[]) {
    for (const relPath of relPaths)
      this.dirtyPages.set(relPath, ++this.dirtyVersion)
    this.markedPages += relPaths.length
  }

  private async renderPageByRelPath(relPath: string, onlyIfDirty: boolean) {
    if (
      this.input.renderOnRequest() &&
      this.input.getManifest().content[relPath] &&
      !this.dirtyPages.has(relPath)
    ) {
      return true
    }
    if (onlyIfDirty && !this.dirtyPages.has(relPath)) return false
    const inFlight = this.renderInFlight.get(relPath)
    if (inFlight) return inFlight

    const task = (async () => {
      try {
        const signature = await this.readRelPathSignature(relPath)
        if (!signature) {
          return this.handleMissingRelPathSource(relPath)
        }
        return await this.renderAndPersistRelPath(relPath, signature)
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
    const generated = this.generatedPages.get(relPath)
    if (generated) return readContentSignature(generated)
    const absPath = path.join(this.input.config.contentDir, relPath)
    return readSignature(absPath)
  }
}

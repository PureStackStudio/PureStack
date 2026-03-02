import path from 'node:path'

import type { Logger } from 'logpot'

import type { SiteConfig } from '../../config/config'
import { type ContentFile, discoverContent } from '../../discover/content'
import { buildNavigation } from '../../navigation/navigation'
import {
  type BuildContext,
  buildPage,
  renderPageFromFile,
  writePage,
} from '../page'
import { resolveOutPath } from '../out-path'
import type { BuildHooks } from '../site'
import { readSignature, type BuildManifest, type FileSignature } from '../manifest'
import {
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
  contentFiles: ContentFile[]
  relPath: string
  ext: string
  signature: FileSignature
  result: IncrementalBuildResult
}

export class IncrementalContentState {
  private readonly dirtyPages = new Set<string>()
  private readonly renderInFlight = new Map<string, Promise<boolean>>()
  private readonly contentIndex: ManifestContentIndex

  constructor(private readonly input: IncrementalContentStateInput) {
    this.contentIndex = new ManifestContentIndex(input.config.contentDir)
    this.contentIndex.rebuildFromManifest(input.getManifest())
  }

  rebuildIndexFromManifest() {
    this.contentIndex.rebuildFromManifest(this.input.getManifest())
  }

  clearDirtyPages() {
    this.dirtyPages.clear()
  }

  async renderAllPages(contentFiles: ContentFile[], hooks: BuildHooks) {
    let pages = 0
    for (const file of contentFiles) {
      await hooks.onPageStart?.(this.input.context, file)
      const page = await renderPageFromFile(this.input.context, file)
      this.input.onPageBuilt(file.relPath, page.scriptEntrypoints)
      await hooks.onPageRendered?.(this.input.context, page)
      await writePage(page, this.input.config.html.minify)
      await hooks.onPageWritten?.(this.input.context, page)
      pages += 1
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
      const contentFiles = await discoverContent(this.input.config.contentDir)
      this.contentIndex.updateUrlPathMapFromFiles(contentFiles)
      relPath = this.contentIndex.getRelPathByUrlPath(normalized)
      if (!relPath) return false
    }
    return this.renderPageByRelPath(relPath, false)
  }

  async refreshNavigationAndMarkDirty() {
    const contentFiles = await discoverContent(this.input.config.contentDir)
    this.input.context.navigation = await buildNavigation(
      this.input.config.contentDir,
      contentFiles,
      this.input.config.navigation,
    )
    this.markAllPagesDirty(contentFiles)
    return contentFiles
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
      toContentFile(this.input.config.contentDir, relPath, ext)
    const page = await buildPage(this.input.context, contentFile)
    this.input.onPageBuilt(contentFile.relPath, page.scriptEntrypoints)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    result.changedPages += 1
    this.dirtyPages.delete(relPath)
  }

  async renderAndPersistRelPath(relPath: string, signature: FileSignature) {
    const ext = this.resolveContentExt(relPath)
    const contentFile = toContentFile(this.input.config.contentDir, relPath, ext)
    const page = await buildPage(this.input.context, contentFile)
    this.input.onPageBuilt(contentFile.relPath, page.scriptEntrypoints)
    this.upsertContentManifestEntry(relPath, contentFile.ext, signature)
    this.dirtyPages.delete(relPath)
    await this.input.persistManifest()
    return true
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
    const contentFile = toContentFile(this.input.config.contentDir, relPath, ext)
    const outPath = resolveOutPath(this.input.config.outDir, contentFile)
    this.input.getManifest().content[relPath] = {
      relPath,
      ext,
      outPath,
      ...signature,
    }
    this.contentIndex.set(relPath, outPath, ext)
  }

  removeContentForDeletedRelPath(relPath: string) {
    this.contentIndex.remove(relPath)
    this.dirtyPages.delete(relPath)
  }

  private resolveContentExt(relPath: string) {
    return this.input.getManifest().content[relPath]?.ext ?? path.extname(relPath)
  }

  private markAllPagesDirty(contentFiles: ContentFile[]) {
    this.dirtyPages.clear()
    for (const file of contentFiles) {
      this.dirtyPages.add(file.relPath)
    }
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

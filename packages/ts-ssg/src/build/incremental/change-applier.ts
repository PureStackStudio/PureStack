import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { DEFAULT_NAV_FILENAME, isContentFile } from '../../discover/content'
import { copyStaticAsset } from '../assets'
import {
  type AssetManifestEntry,
  type BuildManifest,
  type ContentManifestEntry,
  type FileSignature,
  readSignature,
  signatureEqual,
} from '../manifest'
import type { BuildContext } from '../page'
import type { IncrementalContentState } from './content-state'
import type { ScriptEntrypointManager } from './script-entry-manager'
import { removeFile, toAssetFile } from './support'
import type { IncrementalBuildResult } from './types'

type ChangeState = {
  relPath: string
  ext: string
  signature: FileSignature | null
  result: IncrementalBuildResult
  contentEntry: ContentManifestEntry | undefined
  assetEntry: AssetManifestEntry | undefined
}

interface IncrementalChangeApplierInput {
  config: SiteConfig
  context: BuildContext
  getManifest: () => BuildManifest
  contentState: IncrementalContentState
  scriptEntrypoints: ScriptEntrypointManager
  persistManifest: () => Promise<void>
}

export class IncrementalChangeApplier {
  constructor(private readonly input: IncrementalChangeApplierInput) {}

  createResult(reason: string): IncrementalBuildResult {
    return {
      fullRebuild: false,
      changedPages: 0,
      changedAssets: 0,
      deletedPages: 0,
      deletedAssets: 0,
      markedPages: 0,
      reason,
    }
  }

  async applyFileChange(
    filePath: string,
    relPath: string,
    result: IncrementalBuildResult,
  ) {
    const state = await this.readChangeState(filePath, relPath, result)
    await this.applyChangeState(state)
    if (isContentFile(relPath, state.ext) || state.ext === '.ts') {
      await this.input.scriptEntrypoints.syncState({
        result,
        persist: true,
        rebuildAll: false,
      })
    }
  }

  private async readChangeState(
    filePath: string,
    relPath: string,
    result: IncrementalBuildResult,
  ): Promise<ChangeState> {
    const ext = path.extname(relPath).toLowerCase()
    const signature = await readSignature(filePath)
    const manifest = this.input.getManifest()
    return {
      relPath,
      ext,
      signature,
      result,
      contentEntry: manifest.content[relPath],
      assetEntry: manifest.assets[relPath],
    }
  }

  private async applyChangeState(state: ChangeState): Promise<void> {
    if (this.isNavigationFileChange(state.relPath)) {
      await this.handleNavigationFileChange(state)
      return
    }
    if (!state.signature) {
      await this.handleMissingSignatureChange(state)
      return
    }
    if (this.isContentChange(state)) {
      await this.handleContentChange({
        relPath: state.relPath,
        ext: state.ext,
        signature: state.signature,
        contentEntry: state.contentEntry,
        result: state.result,
      })
      return
    }
    await this.handleAssetChange({
      relPath: state.relPath,
      ext: state.ext,
      signature: state.signature,
      assetEntry: state.assetEntry,
      result: state.result,
    })
  }

  private isContentChange(state: ChangeState): boolean {
    return (
      Boolean(state.contentEntry) || isContentFile(state.relPath, state.ext)
    )
  }

  private isNavigationFileChange(relPath: string) {
    const basename = path.basename(relPath).toUpperCase()
    return basename === DEFAULT_NAV_FILENAME.toUpperCase()
  }

  private async handleNavigationFileChange(state: ChangeState) {
    if (state.assetEntry) {
      await this.removeStaticAssetManifestEntry(state)
    }

    if (this.input.config.navigation.mode !== 'none') {
      await this.input.contentState.refreshNavigation()
    }

    if (state.assetEntry) {
      await this.input.persistManifest()
    }
  }

  private async removeStaticAssetManifestEntry(state: ChangeState) {
    if (!state.assetEntry) return
    const manifest = this.input.getManifest()
    await removeFile(state.assetEntry.outPath)
    delete manifest.assets[state.relPath]
    this.input.scriptEntrypoints.removeTrackedEntrypoint(state.relPath)
    state.result.deletedAssets += 1
  }

  private async rebuildNavigationForChange(
    relPath: string,
    ext: string,
    result: IncrementalBuildResult,
    signature: FileSignature | null,
  ) {
    if (!signature) {
      await this.input.contentState.refreshNavigation()
      await this.input.contentState.removeContentEntryForDeletedSource(
        relPath,
        result,
      )
      return
    }

    const contentFiles = await this.input.contentState.refreshNavigation()
    await this.input.contentState.rebuildNavigatedContent({
      contentFiles,
      relPath,
      ext,
      signature,
      result,
    })
  }

  private async handleMissingSignatureChange(input: {
    relPath: string
    ext: string
    result: IncrementalBuildResult
    contentEntry: ContentManifestEntry | undefined
    assetEntry: AssetManifestEntry | undefined
  }) {
    const { relPath, ext, result, contentEntry, assetEntry } = input
    if (contentEntry && this.input.config.navigation.mode !== 'none') {
      await this.rebuildNavigationForChange(relPath, ext, result, null)
      this.input.scriptEntrypoints.removePage(relPath)
      await this.input.persistManifest()
      return
    }
    const manifest = this.input.getManifest()
    if (contentEntry) {
      await this.input.contentState.removeContentEntryForDeletedSource(
        relPath,
        result,
      )
      this.input.scriptEntrypoints.removePage(relPath)
      await this.input.contentState.refreshContent()
    }
    if (assetEntry) {
      await removeFile(assetEntry.outPath)
      delete manifest.assets[relPath]
      this.input.scriptEntrypoints.removeTrackedEntrypoint(relPath)
      this.input.contentState.refreshAssets()
      await this.input.contentState.refreshGeneratedPages()
      result.deletedAssets += 1
    }
    if (ext === '.ts') await this.handleScriptAssetChange(relPath, result)
    if (contentEntry || assetEntry) {
      await this.input.persistManifest()
    }
  }

  private async handleContentChange(input: {
    relPath: string
    ext: string
    signature: FileSignature
    contentEntry: ContentManifestEntry | undefined
    result: IncrementalBuildResult
  }) {
    const { relPath, ext, signature, contentEntry, result } = input
    if (signatureEqual(contentEntry, signature)) return

    if (this.input.config.navigation.mode !== 'none') {
      await this.rebuildNavigationForChange(relPath, ext, result, signature)
      await this.input.persistManifest()
      return
    }

    await this.input.contentState.refreshContent()
    await this.input.contentState.rebuildSingleContent({
      relPath,
      ext,
      signature,
      result,
    })
    await this.input.persistManifest()
  }

  private async handleAssetChange(input: {
    relPath: string
    ext: string
    signature: FileSignature
    assetEntry: AssetManifestEntry | undefined
    result: IncrementalBuildResult
  }) {
    const { relPath, ext, signature, assetEntry, result } = input
    if (signatureEqual(assetEntry, signature)) return

    if (ext === '.ts') {
      await this.handleScriptAssetChange(relPath, result)
      await this.input.persistManifest()
      return
    }

    const assetFile = toAssetFile(this.input.config.contentDir, relPath, ext)
    const assetCopy = await copyStaticAsset(
      this.input.config.contentDir,
      this.input.config.outDir,
      assetFile,
    )
    if (!assetCopy.copied) return

    this.input.getManifest().assets[relPath] = {
      relPath,
      ext,
      outPath: assetCopy.outPath,
      ...signature,
    }
    this.input.contentState.refreshAssets()
    await this.input.contentState.refreshGeneratedPages()
    result.changedAssets += 1
    await this.input.persistManifest()
  }

  private async handleScriptAssetChange(
    relPath: string,
    result: IncrementalBuildResult,
  ) {
    const impactedEntries =
      this.input.scriptEntrypoints.resolveImpactedEntryRelPaths(relPath)
    if (impactedEntries.size === 0) return

    const rebuiltEntries =
      await this.input.scriptEntrypoints.rebuildEntrypoints(
        impactedEntries,
        result,
        { bumpCacheKeys: true },
      )
    if (rebuiltEntries.size === 0) return
    if (!this.input.scriptEntrypoints.usesCacheBusting()) return
    await this.input.contentState.rebuildContentRelPaths(
      this.input.scriptEntrypoints.getPageRelPathsForEntrypoints(
        rebuiltEntries,
      ),
      result,
    )
  }
}

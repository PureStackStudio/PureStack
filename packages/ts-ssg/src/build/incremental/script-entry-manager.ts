import path from 'node:path'

import type { SiteConfig } from '@purestack/ts-common'
import type { StaticAssetFile } from '../../discover/content'
import { copyStaticAsset } from '../assets'
import type { AssetManifestEntry } from '../manifest'
import { readSignature } from '../manifest'
import { removeFile, toAssetFile } from './support'
import type { IncrementalBuildResult } from './types'

interface ScriptEntrypointManagerInput {
  config: Pick<SiteConfig, 'contentDir' | 'outDir'>
  assets: Record<string, AssetManifestEntry>
  persistManifest: () => Promise<void>
}

export class ScriptEntrypointManager {
  private readonly pageEntrypoints = new Map<string, Set<string>>()
  private readonly entryDependencies = new Map<string, Set<string>>()
  private readonly dependentsByRelPath = new Map<string, Set<string>>()

  constructor(private readonly input: ScriptEntrypointManagerInput) {}

  rebuildDependencyIndex(index: Record<string, string[]>) {
    this.entryDependencies.clear()
    this.dependentsByRelPath.clear()
    for (const [entryRelPath, deps] of Object.entries(index)) {
      this.setEntrypointDependencies(entryRelPath, deps)
    }
  }

  clearPageEntrypoints() {
    this.pageEntrypoints.clear()
  }

  setPageEntrypoints(pageRelPath: string, scriptEntrypoints: string[]) {
    this.pageEntrypoints.set(
      this.normalizeRelPath(pageRelPath),
      new Set(scriptEntrypoints.map((entry) => this.normalizeRelPath(entry))),
    )
  }

  removePage(pageRelPath: string) {
    this.pageEntrypoints.delete(this.normalizeRelPath(pageRelPath))
  }

  async rebuildAssetGraph(
    changedRelPath: string,
    result: IncrementalBuildResult,
  ) {
    const entries = this.resolveImpactedEntrypoints(changedRelPath)
    if (entries.size === 0) return
    for (const entryRelPath of entries) {
      await this.rebuildSingleEntrypoint(entryRelPath, result)
    }
  }

  async rebuildDependents(
    changedRelPath: string,
    result: IncrementalBuildResult,
  ) {
    const dependents = this.dependentsByRelPath.get(
      this.normalizeRelPath(changedRelPath),
    )
    if (!dependents || dependents.size === 0) return
    for (const entryRelPath of dependents) {
      if (entryRelPath === changedRelPath) continue
      await this.rebuildSingleEntrypoint(entryRelPath, result)
    }
  }

  removeTrackedEntrypoint(entryRelPath: string) {
    this.removeEntrypoint(entryRelPath)
  }

  async syncState(input: {
    result: IncrementalBuildResult
    persist: boolean
    rebuildAll: boolean
  }): Promise<StaticAssetFile[]> {
    const { result, persist, rebuildAll } = input
    const nextEntries = this.collectDesiredEntrypoints()
    const currentEntries = new Set(this.entryDependencies.keys())

    for (const entryRelPath of currentEntries) {
      if (nextEntries.has(entryRelPath)) continue
      const priorEntry = this.input.assets[entryRelPath]
      if (priorEntry) {
        await removeFile(priorEntry.outPath)
        delete this.input.assets[entryRelPath]
        result.deletedAssets += 1
      }
      this.removeEntrypoint(entryRelPath)
    }

    for (const entryRelPath of nextEntries) {
      if (!rebuildAll && currentEntries.has(entryRelPath)) continue
      await this.rebuildSingleEntrypoint(entryRelPath, result)
    }

    if (persist && (result.changedAssets > 0 || result.deletedAssets > 0)) {
      await this.input.persistManifest()
    }

    return this.getEntrypointAssetFiles()
  }

  private async rebuildSingleEntrypoint(
    entryRelPath: string,
    result: IncrementalBuildResult,
  ) {
    const ext = path.extname(entryRelPath).toLowerCase() || '.ts'
    const assetFile = toAssetFile(
      this.input.config.contentDir,
      entryRelPath,
      ext,
    )
    const signature = await readSignature(assetFile.absPath)
    if (!signature) {
      const priorEntry = this.input.assets[entryRelPath]
      if (priorEntry) {
        await removeFile(priorEntry.outPath)
        delete this.input.assets[entryRelPath]
        result.deletedAssets += 1
      }
      this.removeEntrypoint(entryRelPath)
      return
    }

    const assetCopy = await copyStaticAsset(
      this.input.config.contentDir,
      this.input.config.outDir,
      assetFile,
    )
    if (!assetCopy.copied) return

    this.input.assets[entryRelPath] = {
      relPath: entryRelPath,
      ext,
      outPath: assetCopy.outPath,
      ...signature,
    }
    result.changedAssets += 1
    this.setEntrypointDependencies(
      entryRelPath,
      assetCopy.dependencyRelPaths.length > 0
        ? assetCopy.dependencyRelPaths
        : [entryRelPath],
    )
  }

  private resolveImpactedEntrypoints(changedRelPath: string) {
    const normalized = this.normalizeRelPath(changedRelPath)
    const impacted = new Set<string>()
    if (this.entryDependencies.has(normalized)) {
      impacted.add(normalized)
    }
    const dependents = this.dependentsByRelPath.get(normalized)
    if (!dependents) return impacted
    for (const entryRelPath of dependents) {
      impacted.add(entryRelPath)
    }
    return impacted
  }

  private collectDesiredEntrypoints() {
    const entries = new Set<string>()
    for (const scriptEntrypoints of this.pageEntrypoints.values()) {
      for (const relPath of scriptEntrypoints) {
        entries.add(this.normalizeRelPath(relPath))
      }
    }
    return entries
  }

  private getEntrypointAssetFiles(): StaticAssetFile[] {
    const files: StaticAssetFile[] = []
    for (const entryRelPath of this.entryDependencies.keys()) {
      files.push(
        toAssetFile(
          this.input.config.contentDir,
          entryRelPath,
          path.extname(entryRelPath),
        ),
      )
    }
    return files
  }

  private setEntrypointDependencies(entryRelPath: string, deps: string[]) {
    this.removeEntrypoint(entryRelPath)
    const nextDeps = new Set<string>(
      (deps.length > 0 ? deps : [entryRelPath]).map((depRelPath) =>
        this.normalizeRelPath(depRelPath),
      ),
    )
    this.entryDependencies.set(entryRelPath, nextDeps)
    for (const depRelPath of nextDeps) {
      const dependents = this.dependentsByRelPath.get(depRelPath) ?? new Set()
      dependents.add(entryRelPath)
      this.dependentsByRelPath.set(depRelPath, dependents)
    }
  }

  private removeEntrypoint(entryRelPath: string) {
    const prevDeps = this.entryDependencies.get(entryRelPath)
    if (!prevDeps) return
    for (const depRelPath of prevDeps) {
      const dependents = this.dependentsByRelPath.get(depRelPath)
      if (!dependents) continue
      dependents.delete(entryRelPath)
      if (dependents.size === 0) {
        this.dependentsByRelPath.delete(depRelPath)
      }
    }
    this.entryDependencies.delete(entryRelPath)
  }

  private normalizeRelPath(relPath: string) {
    return relPath.replaceAll('\\', '/')
  }
}

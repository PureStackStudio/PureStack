import { createHash, randomUUID } from 'node:crypto'
import type { BigIntStats } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { PageAssetInput, SiteAssets } from '@purestack/ts-common'
import { isPlainObject } from '@purestack/ts-util'
import type { GeneratedAssetReference, PageAssetReceipt } from './asset-receipt'
import { resolveContentAsset } from './content-urls'
import { resolveOutPath } from './out-path'
import { isInside, lstatOutput, statOutputPath } from './output-guard'
import type { BuildContext, PageRenderResult } from './page'
import { elementSourceRelPath, visitSourceElements } from './page-urls'

const fileKey = (value: string) =>
  process.platform === 'win32' ? value.toLowerCase() : value

const validNamespace = (value: string) => /^[a-z0-9][a-z0-9_-]*$/.test(value)

// Core state is associated with a build without exposing it to public hooks.
const managers = new WeakMap<BuildContext, PageAssetManager>()
export const getPageAssets = (context: BuildContext) => managers.get(context)
export function setPageAssets(
  context: BuildContext,
  manager: PageAssetManager,
) {
  managers.set(context, manager)
}

function relativeFile(value: string) {
  const normalized = value.replaceAll('\\', '/')
  if (
    !normalized ||
    path.posix.isAbsolute(normalized) ||
    /^[a-zA-Z]:/.test(normalized) ||
    normalized
      .split('/')
      .some((part) => part === '..' || part === '' || part === '.')
  ) {
    throw new Error(`Expected a content-relative file path, got "${value}".`)
  }
  return normalized
}

function reference(value: GeneratedAssetReference): GeneratedAssetReference {
  if (!validNamespace(value.namespace))
    throw new Error('Invalid generated asset namespace.')
  const relPath = relativeFile(value.path)
  if (!relPath.startsWith(`assets/${value.namespace}/`))
    throw new Error('Generated output escapes its namespace.')
  return { namespace: value.namespace, path: relPath }
}

function receipt(value: unknown): PageAssetReceipt {
  if (
    !isPlainObject(value) ||
    !Array.isArray(value.dependencies) ||
    !Array.isArray(value.outputs)
  )
    throw new Error('Invalid page asset receipt.')
  return {
    dependencies: value.dependencies.map((value) => relativeFile(value)),
    outputs: value.outputs.map((value) => reference(value)),
  }
}

export interface PageAssetSession {
  receipt: PageAssetReceipt
  process: (document: Document) => Promise<void>
  abort: () => Promise<void>
}

/** Owns generated files independently of any particular asset integration. */
export class PageAssetManager {
  private processors: readonly SiteAssets[] = []
  private readonly receipts = new WeakMap<
    PageRenderResult,
    { source: string; value: PageAssetReceipt }
  >()
  private readonly sourceOutputs = new Set<string>()
  private readonly pages = new Map<string, PageAssetReceipt>()
  private readonly pending = new Map<PageAssetReceipt, string>()
  private readonly writing = new Map<
    string,
    { hash: string; task: Promise<void> }
  >()
  private readonly reservedHashes = new Map<string, string>()
  // Separate successful verification from hashes reserved for collision checks.
  private readonly verifiedOutputs = new Map<
    string,
    { hash: string; stat: BigIntStats }
  >()
  private contentRoot: Promise<string> | undefined
  private work: Promise<unknown> = Promise.resolve()
  private reservedFor: BuildContext['contentRoutes'] | undefined
  private reserved = new Set<string>()

  private sourceOwns(relPath: string) {
    const routes = this.context.contentRoutes
    if (this.reservedFor !== routes) {
      this.reservedFor = routes
      this.reserved = new Set(routes.assets.map(fileKey))
      for (const page of routes.pages) {
        const outPath = path
          .relative(
            this.context.config.outDir,
            resolveOutPath(this.context.config.outDir, page),
          )
          .replaceAll('\\', '/')
        this.reserved.add(fileKey(outPath))
      }
    }
    return (
      this.reserved.has(fileKey(relPath)) ||
      this.sourceOutputs.has(fileKey(relPath))
    )
  }

  /** Receives actual output paths from core producers, never inferred filenames. */
  reserveSourceOutput(relPath: string) {
    const key = fileKey(relativeFile(relPath))
    this.sourceOutputs.add(key)
    const owned = [...this.pages.values(), ...this.pending.keys()].some(
      (value) => value.outputs.some((output) => fileKey(output.path) === key),
    )
    if (owned)
      throw new Error(
        `Source output "${relPath}" conflicts with a generated asset.`,
      )
  }

  setProcessors(processors: readonly SiteAssets[]) {
    this.processors = [...processors]
  }

  trackPage(page: PageRenderResult, value: PageAssetReceipt) {
    this.receipts.set(page, { source: page.file.relPath, value })
  }

  async commitPage(page: PageRenderResult) {
    const value = this.receipts.get(page)
    if (value) await this.commit(value.source, value.value)
    this.receipts.delete(page)
  }

  async abortPage(
    page: PageRenderResult,
    options: { errorPage?: boolean } = {},
  ) {
    const value = this.receipts.get(page)
    this.receipts.delete(page)
    if (!value) return
    await this.abort(value.value)
    if (options.errorPage)
      await this.commit(value.source, {
        dependencies: value.value.dependencies,
        outputs: [],
      })
  }

  constructor(
    private readonly context: BuildContext,
    previous?: Record<string, PageAssetReceipt>,
  ) {
    if (!isPlainObject(previous)) return
    for (const [page, value] of Object.entries(previous)) {
      try {
        relativeFile(page)
        this.pages.set(page, receipt(value))
      } catch {
        /* Never trust paths loaded from a build cache. */
      }
    }
  }

  resetWrites() {
    this.reservedHashes.clear()
    this.verifiedOutputs.clear()
    this.sourceOutputs.clear()
    this.contentRoot = undefined
  }

  session(sourceRelPath: string): PageAssetSession | undefined {
    const processors = this.processors
    if (processors.length === 0) return undefined
    const collected: PageAssetReceipt = { dependencies: [], outputs: [] }
    this.pending.set(collected, sourceRelPath)
    const dependencies = new Set<string>()
    const dependOn = (value: string) => {
      const relPath = relativeFile(value)
      if (dependencies.has(relPath)) return
      dependencies.add(relPath)
      collected.dependencies.push(relPath)
    }
    return {
      receipt: collected,
      process: async (document) => {
        for (const processor of processors) {
          const sources = new WeakMap<Element, string>()
          visitSourceElements(document, sourceRelPath, (element, source) =>
            sources.set(element, source),
          )
          const scope = assetInputScope(processor.namespace, {
            document,
            sourceRelPath,
            dependOn,
            resolveSource: async (element, url) => {
              const resolved = resolveContentAsset(
                url,
                sources.get(element) ??
                  elementSourceRelPath(element, sourceRelPath),
                this.context.contentRoutes,
                this.context.config,
                dependOn,
              )
              if (!resolved) return undefined
              this.contentRoot ??= fs
                .realpath(this.context.config.contentDir)
                .catch((error) => {
                  this.contentRoot = undefined
                  throw error
                })
              const root = await this.contentRoot
              const absPath = await fs.realpath(
                path.resolve(root, resolved.relPath),
              )
              if (!isInside(root, absPath))
                throw new Error(
                  `Asset "${resolved.relPath}" resolves outside the content root.`,
                )
              return { ...resolved, absPath }
            },
            emit: async (name, data) => {
              const file = reference({
                namespace: processor.namespace,
                path: `assets/${processor.namespace}/${relativeFile(name)}`,
              })
              if (
                !collected.outputs.some((output) => output.path === file.path)
              )
                collected.outputs.push(file)
              await this.emit(file, data)
              return `/${file.path.split('/').map(encodeURIComponent).join('/')}`
            },
          })
          try {
            await processor.processPage(scope.input)
            scope.assertDrained()
          } finally {
            await scope.close()
          }
        }
      },
      abort: () => this.abort(collected),
    }
  }

  dependents(relPath: string) {
    const key = fileKey(relPath.replaceAll('\\', '/'))
    const dependsOn = (value: PageAssetReceipt) =>
      value.dependencies.some((dependency) => fileKey(dependency) === key)
    return [
      ...new Set([
        ...[...this.pages]
          .filter(([, value]) => dependsOn(value))
          .map(([page]) => page),
        ...[...this.pending]
          .filter(([value]) => dependsOn(value))
          .map(([, page]) => page),
      ]),
    ]
  }

  private commit(page: string, value: PageAssetReceipt) {
    return this.queue(async () => {
      const next = receipt(value)
      const previous = this.pages.get(page)
      if (next.dependencies.length > 0 || next.outputs.length > 0)
        this.pages.set(page, next)
      else this.pages.delete(page)
      this.pending.delete(value)
      await this.prune(previous?.outputs ?? [])
    })
  }

  removePage(page: string) {
    return this.queue(async () => {
      const previous = this.pages.get(page)
      this.pages.delete(page)
      await this.prune(previous?.outputs ?? [])
    })
  }

  retainPages(pages: readonly string[]) {
    return this.queue(async () => {
      const retained = new Set(pages)
      const namespaces = new Set(
        this.processors.map((processor) => processor.namespace),
      )
      const unused: GeneratedAssetReference[] = []
      for (const [page, value] of this.pages) {
        if (!retained.has(page)) {
          this.pages.delete(page)
          unused.push(...value.outputs)
        } else {
          unused.push(
            ...value.outputs.filter(
              (output) => !namespaces.has(output.namespace),
            ),
          )
          value.outputs = value.outputs.filter((output) =>
            namespaces.has(output.namespace),
          )
          if (namespaces.size === 0) this.pages.delete(page)
        }
      }
      await this.prune(unused)
    })
  }

  snapshot(): Record<string, PageAssetReceipt> | undefined {
    return this.pages.size > 0
      ? Object.fromEntries(
          [...this.pages].map(([page, value]) => [page, receipt(value)]),
        )
      : undefined
  }

  private abort(value: PageAssetReceipt) {
    return this.queue(async () => {
      this.pending.delete(value)
      await this.prune(value.outputs)
    })
  }

  private async emit(file: GeneratedAssetReference, data: Uint8Array) {
    if (!(data instanceof Uint8Array))
      throw new Error('Generated asset contents must be a Uint8Array.')
    if (this.sourceOwns(file.path))
      throw new Error(
        `Generated asset "${file.path}" conflicts with a source output.`,
      )
    const key = fileKey(file.path)
    const hash = createHash('sha256').update(data).digest('hex')
    const pending = this.writing.get(key)
    if (pending) {
      if (pending.hash !== hash)
        throw new Error(
          `Generated asset "${file.path}" was emitted with different contents. Use content-addressed names.`,
        )
      return pending.task
    }
    const task = this.queue(async () => {
      const previous = this.reservedHashes.get(key)
      if (previous && previous !== hash)
        throw new Error(
          `Generated asset "${file.path}" was emitted with different contents. Use content-addressed names.`,
        )
      this.reservedHashes.set(key, hash)
      await this.write(file.path, data, hash)
    })
    this.writing.set(key, { hash, task })
    try {
      await task
    } finally {
      this.writing.delete(key)
    }
  }

  private async write(relPath: string, data: Uint8Array, hash: string) {
    const key = fileKey(relPath)
    const { output, stat } = await this.outputPath(relPath)
    const verified = this.verifiedOutputs.get(key)
    if (
      verified?.hash === hash &&
      verified.stat.ino !== 0n &&
      verified.stat.ctimeNs !== 0n &&
      sameFileState(verified.stat, stat)
    )
      return
    this.verifiedOutputs.delete(key)
    // Size only rules out equality. Equal-sized files still require a hash check
    // unless this build already confirmed their unchanged filesystem identity.
    if (stat?.isFile() && stat.size === BigInt(data.byteLength)) {
      const existing = await fs.readFile(output).catch((error) => {
        if (error.code === 'ENOENT') return undefined
        throw error
      })
      if (
        existing &&
        createHash('sha256').update(existing).digest('hex') === hash
      ) {
        const after = await lstatOutput(output)
        if (after && sameFileState(stat, after)) {
          this.verifiedOutputs.set(key, { hash, stat: after })
          return
        }
      }
    }
    await fs.mkdir(path.dirname(output), { recursive: true })
    const temporary = `${output}.${randomUUID()}.tmp`
    try {
      await fs.writeFile(temporary, data)
      await fs.rename(temporary, output)
      const after = await lstatOutput(output)
      if (after?.isFile() && after.size === BigInt(data.byteLength))
        this.verifiedOutputs.set(key, { hash, stat: after })
    } finally {
      await fs.rm(temporary, { force: true })
    }
  }

  private async outputPath(relPath: string) {
    const { outDir } = this.context.config
    const output = path.resolve(outDir, relativeFile(relPath))
    return { output, stat: await statOutputPath(outDir, output) }
  }

  private async prune(candidates: GeneratedAssetReference[]) {
    const used = new Set(
      [...this.pages.values(), ...this.pending.keys()].flatMap((value) =>
        value.outputs.map((output) => fileKey(output.path)),
      ),
    )
    for (const candidate of candidates) {
      const file = reference(candidate)
      if (used.has(fileKey(file.path)) || this.sourceOwns(file.path)) continue
      const { output } = await this.outputPath(file.path)
      await fs.rm(output, { force: true })
      this.reservedHashes.delete(fileKey(file.path))
      this.verifiedOutputs.delete(fileKey(file.path))
    }
  }

  private queue<T>(run: () => Promise<T>): Promise<T> {
    const task = this.work.then(run)
    this.work = task.catch(() => undefined)
    return task
  }
}

function sameFileState(before: BigIntStats, after: BigIntStats | undefined) {
  return (
    after?.isFile() === true &&
    before.dev === after.dev &&
    before.ino === after.ino &&
    before.size === after.size &&
    before.mtimeNs === after.mtimeNs &&
    before.ctimeNs === after.ctimeNs &&
    before.birthtimeNs === after.birthtimeNs
  )
}

/** Every asynchronous input operation must settle before the page can commit or abort. */
function assetInputScope(namespace: string, input: PageAssetInput) {
  let open = true
  const pending = new Set<Promise<unknown>>()
  const assertOpen = () => {
    if (!open)
      throw new Error(`Asset processor "${namespace}" input is closed.`)
  }
  const track = <T>(work: () => Promise<T>): Promise<T> => {
    assertOpen()
    const task = work()
    pending.add(task)
    void task.then(
      () => pending.delete(task),
      () => pending.delete(task),
    )
    return task
  }
  return {
    input: {
      ...input,
      dependOn: (relPath) => {
        assertOpen()
        input.dependOn(relPath)
      },
      resolveSource: (element, url) =>
        track(() => input.resolveSource(element, url)),
      emit: (name, bytes) => track(() => input.emit(name, bytes)),
    } satisfies PageAssetInput,
    assertDrained() {
      if (pending.size > 0)
        throw new Error(
          `Asset processor "${namespace}" must await all source resolution and emission work before returning.`,
        )
    },
    async close() {
      open = false
      await Promise.allSettled([...pending])
    },
  }
}

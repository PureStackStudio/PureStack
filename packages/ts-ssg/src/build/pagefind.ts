import fs from 'node:fs/promises'
import path from 'node:path'
import type { PagefindConfig } from '@purestack/ts-common'
import { getLogger, type Logger } from 'logpot'
import * as pagefind from 'pagefind'

export interface BuildPagefindResult {
  indexedPages: number
  indexedBytes: number
  outputPath: string
  errors: string[]
  durationMs: number
}

const PAGEFIND_DIRNAME = 'pagefind'

export async function buildPagefindIndex(
  outDir: string,
  config: PagefindConfig,
): Promise<BuildPagefindResult> {
  const log = getLogger()
  const state = createPagefindBuildState(outDir, config)
  if (!config.enabled) {
    await removePagefindOutput(state.outputPath)
    log.info('pagefind indexing disabled', {
      outDir: state.outDir,
      outputPath: state.outputPath,
      durationMs: elapsedSince(state.startedAt),
    })
    return toBuildPagefindResult(state)
  }

  try {
    await runPagefindBuild(state)

    logBuildPagefindOutcome(log, {
      outDir: state.outDir,
      outputPath: state.outputPath,
      indexedPages: state.indexedPages,
      indexedBytes: state.indexedBytes,
      errors: state.errors,
      durationMs: elapsedSince(state.startedAt),
    })
  } catch (error) {
    const message = registerPagefindBuildError(state, error)
    logPagefindSkipped(
      log,
      state.outDir,
      state.outputPath,
      message,
      elapsedSince(state.startedAt),
    )
  } finally {
    await cleanupPagefind(state.index)
  }

  return toBuildPagefindResult(state)
}

type CreatedPagefindIndex = {
  errors: string[]
  index: pagefind.PagefindIndex
}

type PagefindBuildState = {
  startedAt: number
  outDir: string
  outputPath: string
  index: pagefind.PagefindIndex | undefined
  indexedPages: number
  indexedBytes: number
  errors: string[]
  excludePaths: string[]
}

function createPagefindBuildState(
  outDir: string,
  config: PagefindConfig,
): PagefindBuildState {
  return {
    startedAt: now(),
    outDir,
    outputPath: path.join(outDir, PAGEFIND_DIRNAME),
    index: undefined,
    indexedPages: 0,
    indexedBytes: 0,
    errors: [],
    excludePaths: config.excludePaths,
  }
}

async function runPagefindBuild(state: PagefindBuildState): Promise<void> {
  const created = await createPagefindIndex()
  state.errors.push(...created.errors)
  state.index = created.index
  const indexed = await populateAndWritePagefindIndex(
    created.index,
    state.outDir,
    state.outputPath,
    state.excludePaths,
  )
  state.indexedPages = indexed.indexedPages
  state.indexedBytes = indexed.indexedBytes
  state.errors.push(...indexed.errors)
  await created.index.deleteIndex()
  state.index = undefined
}

function registerPagefindBuildError(
  state: PagefindBuildState,
  error: unknown,
): string {
  const message = toErrorMessage(error)
  state.errors.push(message)
  return message
}

function toBuildPagefindResult(state: PagefindBuildState): BuildPagefindResult {
  return {
    indexedPages: state.indexedPages,
    indexedBytes: state.indexedBytes,
    outputPath: state.outputPath,
    errors: state.errors,
    durationMs: elapsedSince(state.startedAt),
  }
}

async function createPagefindIndex(): Promise<CreatedPagefindIndex> {
  const created = await pagefind.createIndex()
  if (!created.index) {
    throw new Error('Pagefind failed to create an index instance.')
  }
  return {
    errors: created.errors,
    index: created.index,
  }
}

async function populateAndWritePagefindIndex(
  index: pagefind.PagefindIndex,
  outDir: string,
  outputPath: string,
  excludePaths: string[],
) {
  const htmlFiles = await collectHtmlFiles(outDir)
  const errors: string[] = []
  let indexedPages = 0
  let indexedBytes = 0
  for (const filePath of htmlFiles) {
    const relPath = toPosixPath(path.relative(outDir, filePath))
    if (shouldSkipPagefindPath(relPath, excludePaths)) continue
    const content = await fs.readFile(filePath, 'utf8')
    const response = await index.addHTMLFile({
      sourcePath: relPath,
      content,
    })
    errors.push(...response.errors)
    if (response.file) {
      indexedPages += 1
      indexedBytes += Buffer.byteLength(content, 'utf8')
    }
  }
  const writeResult = await index.writeFiles({ outputPath })
  return {
    indexedPages,
    indexedBytes,
    errors: [...errors, ...writeResult.errors],
  }
}

async function collectHtmlFiles(rootDir: string): Promise<string[]> {
  const files: string[] = []
  await walkDir(rootDir, files)
  return files
}

async function walkDir(dirPath: string, output: string[]): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const absPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === PAGEFIND_DIRNAME || entry.name === '.ts-ssg') continue
      await walkDir(absPath, output)
      continue
    }
    if (entry.isFile() && absPath.toLowerCase().endsWith('.html')) {
      output.push(absPath)
    }
  }
}

function shouldSkipPagefindPath(
  relPath: string,
  excludePaths: string[],
): boolean {
  const urlPath = toUrlPathFromOutputRelPath(relPath)
  for (const excludePath of excludePaths) {
    if (urlPath.startsWith(excludePath)) return true
  }
  return false
}

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/')
}

function toUrlPathFromOutputRelPath(relPath: string): string {
  const normalized = toPosixPath(relPath)
  if (normalized === 'index.html') return '/'
  if (normalized.endsWith('/index.html')) {
    return `/${normalized.slice(0, -'index.html'.length)}`
  }
  return `/${normalized}`
}

function logBuildPagefindOutcome(
  log: Logger,
  input: {
    outDir: string
    outputPath: string
    indexedPages: number
    indexedBytes: number
    errors: string[]
    durationMs: number
  },
) {
  const { outDir, outputPath, indexedPages, indexedBytes, errors, durationMs } =
    input
  if (errors.length > 0) {
    log.warn('pagefind index built with warnings', {
      outDir,
      outputPath,
      warnings: errors,
      indexedPages,
      indexedBytes,
      indexedSizeMb: formatMegabytes(indexedBytes),
      durationMs,
    })
    return
  }
  log.info('pagefind index built', {
    outDir,
    outputPath,
    indexedPages,
    indexedBytes,
    indexedSizeMb: formatMegabytes(indexedBytes),
    durationMs,
  })
}

function logPagefindSkipped(
  log: Logger,
  outDir: string,
  outputPath: string,
  error: string,
  durationMs: number,
) {
  log.warn('pagefind indexing skipped', {
    outDir,
    outputPath,
    error,
    durationMs,
  })
}

async function cleanupPagefind(index: pagefind.PagefindIndex | undefined) {
  if (index) {
    await index.deleteIndex().catch(() => undefined)
  }
  await pagefind.close().catch(() => undefined)
}

async function removePagefindOutput(outputPath: string) {
  await fs.rm(outputPath, { recursive: true, force: true })
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function now() {
  return Date.now()
}

function elapsedSince(startedAt: number) {
  return Date.now() - startedAt
}

function formatMegabytes(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

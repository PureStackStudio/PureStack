import path from 'node:path'

import { getLogger, type Logger } from 'logpot'
import * as pagefind from 'pagefind'

export interface BuildPagefindResult {
  indexedPages: number
  outputPath: string
  errors: string[]
  durationMs: number
}

const PAGEFIND_DIRNAME = 'pagefind'

export async function buildPagefindIndex(
  outDir: string,
): Promise<BuildPagefindResult> {
  const log = getLogger()
  const state = createPagefindBuildState(outDir)

  try {
    await runPagefindBuild(state)

    logBuildPagefindOutcome(log, {
      outDir: state.outDir,
      outputPath: state.outputPath,
      indexedPages: state.indexedPages,
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
  errors: string[]
}

function createPagefindBuildState(outDir: string): PagefindBuildState {
  return {
    startedAt: now(),
    outDir,
    outputPath: path.join(outDir, PAGEFIND_DIRNAME),
    index: undefined,
    indexedPages: 0,
    errors: [],
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
  )
  state.indexedPages = indexed.indexedPages
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
) {
  const addResult = await index.addDirectory({ path: outDir })
  const writeResult = await index.writeFiles({ outputPath })
  return {
    indexedPages: addResult.page_count,
    errors: [...addResult.errors, ...writeResult.errors],
  }
}

function logBuildPagefindOutcome(
  log: Logger,
  input: {
    outDir: string
    outputPath: string
    indexedPages: number
    errors: string[]
    durationMs: number
  },
) {
  const { outDir, outputPath, indexedPages, errors, durationMs } = input
  if (errors.length > 0) {
    log.warn('pagefind index built with warnings', {
      outDir,
      outputPath,
      warnings: errors,
      indexedPages,
      durationMs,
    })
    return
  }
  log.info('pagefind index built', {
    outDir,
    outputPath,
    indexedPages,
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

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function now() {
  return Date.now()
}

function elapsedSince(startedAt: number) {
  return Date.now() - startedAt
}

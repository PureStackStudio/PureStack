import path from 'node:path'

import { getLogger } from 'logpot'
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
  const startedAt = Date.now()
  const outputPath = path.join(outDir, PAGEFIND_DIRNAME)

  let index: pagefind.PagefindIndex | undefined
  const errors: string[] = []
  let indexedPages = 0

  try {
    const created = await pagefind.createIndex()
    errors.push(...created.errors)
    if (!created.index) {
      throw new Error('Pagefind failed to create an index instance.')
    }
    index = created.index

    const addResult = await index.addDirectory({ path: outDir })
    indexedPages = addResult.page_count
    errors.push(...addResult.errors)

    const writeResult = await index.writeFiles({ outputPath })
    errors.push(...writeResult.errors)

    await index.deleteIndex()
    index = undefined

    const durationMs = Date.now() - startedAt
    if (errors.length > 0) {
      log.warn('pagefind index built with warnings', {
        outDir,
        outputPath,
        warnings: errors,
        indexedPages,
        durationMs,
      })
    } else {
      log.info('pagefind index built', {
        outDir,
        outputPath,
        indexedPages,
        durationMs,
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(message)
    log.warn('pagefind indexing skipped', {
      outDir,
      outputPath,
      error: message,
      durationMs: Date.now() - startedAt,
    })
  } finally {
    if (index) {
      await index.deleteIndex().catch(() => undefined)
    }
    await pagefind.close().catch(() => undefined)
  }

  return {
    indexedPages,
    outputPath,
    errors,
    durationMs: Date.now() - startedAt,
  }
}

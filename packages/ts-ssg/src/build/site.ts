import { getLogger } from 'logpot'

import { type PartialConfig, resolveConfig } from '../config'
import { discoverContent } from '../content'
import { buildPage } from './page'

export interface BuildResult {
  outDir: string
  pages: number
}

export async function buildSite(
  input: PartialConfig = {},
): Promise<BuildResult> {
  const config = resolveConfig(input)
  const log = getLogger()
  log.info('build config resolved', {
    contentDir: config.contentDir,
    outDir: config.outDir,
  })
  const files = await discoverContent(config.contentDir)
  let pages = 0
  for (const file of files) {
    await buildPage(config, file)
    pages += 1
  }

  return { outDir: config.outDir, pages }
}

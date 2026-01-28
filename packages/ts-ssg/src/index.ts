import { pathToFileURL } from 'node:url'

import { createLogger, getLogger } from 'logpot'

import { buildSite } from './build'
import { logError } from './logging'

export { buildSite } from './build'
export { type PartialConfig, resolveConfig, type SiteConfig } from './config'

const entryUrl = process.argv[1]
const isDirectRun =
  typeof entryUrl === 'string' &&
  import.meta.url === pathToFileURL(entryUrl).href
if (isDirectRun) {
  runCli().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}

async function runCli() {
  const logger = await createLogger({ runAsWorker: false })
  const log = getLogger()
  try {
    const result = await buildSite()
    log.info('build completed', { ...result })
  } catch (error) {
    logError(log, error, 'build failed')
    throw error
  } finally {
    await logger.close()
  }
}

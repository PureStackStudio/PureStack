import { pathToFileURL } from 'node:url'

import { buildSite } from './build'

export { buildSite } from './build'
export { type PartialConfig, resolveConfig, type SiteConfig } from './config'

const entryUrl = process.argv[1]
if (entryUrl && import.meta.url === pathToFileURL(entryUrl).href) {
  buildSite().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}

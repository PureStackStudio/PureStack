import type { SiteConfig, SiteSearch } from '@purestack/ts-common'
import { buildPagefindIndex } from './pagefind'

export { type BuildPagefindResult, buildPagefindIndex } from './pagefind'

/** The default search index; indexing schedules remain owned by the builder. */
export function pagefindPlugin() {
  return {
    name: 'purestack:pagefind',
    search(config: SiteConfig): SiteSearch {
      return {
        ownsPath: (pathname) => pathname.startsWith('/pagefind/'),
        async write({ outDir, excludeFiles, onlyFiles }) {
          await buildPagefindIndex(
            outDir,
            config.pagefind,
            excludeFiles,
            onlyFiles,
          )
        },
      }
    },
  }
}

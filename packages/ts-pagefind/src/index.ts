import type {
  SiteConfig,
  SiteConfigResolution,
  SiteSearch,
} from '@purestack/ts-common'
import { merge } from '@purestack/ts-util'
import { resolvePagefindConfig } from './config'
import { buildPagefindIndex } from './pagefind'

export { type BuildPagefindResult, buildPagefindIndex } from './pagefind'

/** The default search index; indexing schedules remain owned by the builder. */
export function pagefindPlugin() {
  return {
    name: 'purestack:pagefind',
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          pagefind: merge(
            resolvePagefindConfig(input.pagefind, file.pagefind),
            config.pagefind,
          ),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return { pagefind: resolvePagefindConfig(config.pagefind) }
      },
    },
    search(config: SiteConfig): SiteSearch {
      const pagefind = config.pagefind
      if (!pagefind)
        throw new Error('Pagefind requires resolved search settings.')
      return {
        ownsPath: (pathname) => pathname.startsWith('/pagefind/'),
        async write({ outDir, excludeFiles, onlyFiles }) {
          await buildPagefindIndex(outDir, pagefind, excludeFiles, onlyFiles)
        },
      }
    },
  }
}

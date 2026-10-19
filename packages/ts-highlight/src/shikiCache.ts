import { createRequire } from 'node:module'
import { PersistentCache } from '@purestack/ts-util-node'

// Bump when the highlighter's rendering options change cached output.
const CACHE_SCHEMA = 1
const SHIKI_VERSION: string = createRequire(import.meta.url)(
  'shiki/package.json',
).version

export function openShikiCache(
  themes: Record<'light' | 'dark', string>,
  languages: readonly string[],
) {
  return new PersistentCache<string>({
    namespace: 'shiki',
    version: JSON.stringify([CACHE_SCHEMA, SHIKI_VERSION, themes, languages]),
    codec: {
      encode: (html) => html,
      decode: (data) => data.toString('utf8'),
    },
  })
}

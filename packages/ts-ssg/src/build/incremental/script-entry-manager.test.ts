import { describe, expect, it } from 'vitest'
import { ScriptCacheKeyStore } from '../script-cache-key'
import { ScriptEntrypointManager } from './script-entry-manager'

describe('script entrypoint page identities', () => {
  it.each(['schema\\schema.mdx', 'schema/schema.mdx'])(
    'preserves the content cache key %s when invalidating and removing pages',
    (pageRelPath) => {
      const scripts = new ScriptEntrypointManager({
        config: { contentDir: '/content', outDir: '/output' },
        reserveOutput: () => {},
        minifyScripts: false,
        failOnAssetError: true,
        cacheBusting: true,
        sharedLibraries: [],
        getAssets: () => ({}),
        scriptCacheKeys: new ScriptCacheKeyStore(),
        persistManifest: async () => {},
      })
      scripts.setPageEntrypoints(pageRelPath, ['schema\\schema.ts'])
      expect(
        scripts.getPageRelPathsForEntrypoints(['schema/schema.ts']),
      ).toEqual([pageRelPath])
      scripts.removePage(pageRelPath)
      expect(
        scripts.getPageRelPathsForEntrypoints(['schema/schema.ts']),
      ).toEqual([])
    },
  )
})

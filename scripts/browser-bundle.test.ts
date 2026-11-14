import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, type Plugin } from 'esbuild'
import { build as bundlePackage } from 'tsdown'
import { beforeAll, describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('../', import.meta.url))
const packageEntries = {
  '@purestack/ts-style': 'packages/ts-style/src/index.ts',
  '@purestack/ts-style/runtime': 'packages/ts-style/src/runtime.ts',
  '@purestack/ts-components': 'packages/ts-components/src/index.ts',
}
const published = new Map<string, string>()

// Published packages flatten their source into one module. Test that boundary:
// source-only tests can hide eager initializers behind module tree shaking.
beforeAll(async () => {
  await Promise.all(
    Object.entries(packageEntries).map(async ([name, entry]) => {
      const result = await bundlePackage({
        config: false,
        cwd: root,
        entry: [entry],
        tsconfig: './tsconfig.json',
        write: false,
        clean: false,
        outDir: path.join(root, '.tmp/browser-bundle'),
        platform: 'node',
        target: 'esnext',
        format: 'esm',
        minify: false,
        dts: false,
        logLevel: 'silent',
        deps: {
          neverBundle: (id) => id.startsWith('@purestack/') || id === 'regor',
        },
        outputOptions: { codeSplitting: false },
        plugins: [
          {
            name: 'inline-static-regor-templates',
            transform(code, id) {
              if (!id.replaceAll('\\', '/').includes('/ts-components/src/')) {
                return null
              }
              return code.replace(/(?<![\w$.])(?:html|svg)\s*`/g, '`')
            },
          },
        ],
      })
      const chunks = result.bundles.flatMap((bundle) => bundle.chunks)
      const entryChunk = chunks.find(
        (chunk) => chunk.type === 'chunk' && chunk.isEntry,
      )
      if (entryChunk?.type !== 'chunk')
        throw new Error(`Missing ${name} bundle`)
      published.set(name, entryChunk.code)
    }),
  )
})

const publishedPackages: Plugin = {
  name: 'published-packages',
  setup(builder) {
    builder.onResolve(
      { filter: /^@purestack\/(ts-style(?:\/runtime)?|ts-components)$/ },
      ({ path }) => ({ path, namespace: 'published', sideEffects: false }),
    )
    builder.onLoad({ filter: /.*/, namespace: 'published' }, ({ path }) => ({
      contents: published.get(path),
      resolveDir: root,
    }))
  },
}

describe.each(['source', 'published'] as const)(
  '%s browser bundles',
  (mode) => {
    it.each([
      ['tone helper', '@purestack/ts-style/runtime', 'getSemanticToneClass'],
      [
        'sign-in controls',
        '@purestack/ts-components',
        'defineButtonComponents, defineFormComponents, defineFormInputField, defineIconComponents, defineSignInComponents',
      ],
      ['all components', '@purestack/ts-components', 'defineComponents'],
    ])('keeps style generation out of %s', async (name, entry, exports) => {
      const result = await build({
        absWorkingDir: root,
        stdin: {
          contents: `export { ${exports} } from '${entry}'`,
          resolveDir: root,
          loader: 'ts',
        },
        bundle: true,
        write: false,
        minify: true,
        metafile: true,
        platform: 'browser',
        format: 'esm',
        plugins: mode === 'published' ? [publishedPackages] : [],
      })

      const retained = Object.values(result.metafile.outputs).flatMap(
        (output) =>
          Object.entries(output.inputs)
            .filter(([, input]) => input.bytesInOutput > 0)
            .map(([file]) => file.split(path.sep).join('/')),
      )
      expect(retained).not.toContain('published:@purestack/ts-style')
      expect(
        retained.filter((file) =>
          /packages\/ts-(?:css\/|style\/src\/(?:skins\/|styles\.|styleContext\.|themeOptions\.|semanticPresets\.|semanticTone\.))/.test(
            file,
          ),
        ),
      ).toEqual([])
      if (name === 'tone helper') {
        expect(result.outputFiles[0].contents.length).toBeLessThan(1024)
      }
    })
  },
)

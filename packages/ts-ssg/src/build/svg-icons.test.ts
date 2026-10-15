import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { describe, expect, it } from 'vitest'
import {
  getSvgIcon,
  iconoir_cube,
  lucide_chevron_down,
  phosphor_acorn,
  tabler_world,
} from '../../../ts-svg-icons/src/index'

describe('SVG icon exports', () => {
  it('resolves server lookup names to the direct export for each provider', () => {
    expect(getSvgIcon('iconoir:cube')).toBe(iconoir_cube)
    expect(getSvgIcon('lucide:chevron-down')).toBe(lucide_chevron_down)
    expect(getSvgIcon('phosphor:acorn')).toBe(phosphor_acorn)
    expect(getSvgIcon('tabler:world')).toBe(tabler_world)
  })

  it('passes inline SVG through unchanged', () => {
    expect(getSvgIcon(tabler_world)).toBe(tabler_world)
  })

  it('reports unknown icon names', () => {
    expect(() => getSvgIcon('missing:icon')).toThrow(
      'Unknown icon: missing:icon',
    )
  })

  it('tree-shakes named imports after the package exports are bundled together', async () => {
    // Reproduce a package build followed by a browser build. The catalog lookup
    // remains exported in the first stage, but must disappear in the second.
    const published = await build({
      entryPoints: [
        fileURLToPath(
          new URL('../../../ts-svg-icons/src/index.ts', import.meta.url),
        ),
      ],
      bundle: true,
      format: 'esm',
      platform: 'node',
      treeShaking: true,
      write: false,
    })
    const browser = await build({
      stdin: {
        contents: `import { iconoir_cube, lucide_chevron_down, phosphor_acorn, tabler_world } from 'published-icons';
export const icons = [iconoir_cube, lucide_chevron_down, phosphor_acorn, tabler_world];`,
      },
      bundle: true,
      format: 'esm',
      platform: 'browser',
      treeShaking: true,
      write: false,
      plugins: [
        {
          name: 'published-icon-package',
          setup(builder) {
            builder.onResolve({ filter: /^published-icons$/ }, () => ({
              path: 'published-icons',
              namespace: 'icon-package',
            }))
            builder.onLoad({ filter: /.*/, namespace: 'icon-package' }, () => ({
              contents: published.outputFiles[0].text,
              loader: 'js',
            }))
          },
        },
      ],
    })
    const output = browser.outputFiles[0]
    expect(output.contents.byteLength).toBeLessThan(20_000)
    expect(output.text).not.toContain('SVG_ICONS')
    expect(output.text).not.toContain('iconoir_accessibility')
    const result = await import(
      /* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(output.contents).toString('base64')}`
    )
    expect(result.icons).toEqual([
      iconoir_cube,
      lucide_chevron_down,
      phosphor_acorn,
      tabler_world,
    ])
  })
})

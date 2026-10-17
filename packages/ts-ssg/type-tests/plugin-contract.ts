import type { SiteConfig } from '@purestack/ts-common'
import { definePlugin, resolveSiteConfig } from '../src/index'

declare module '@purestack/ts-common' {
  interface SiteExtensions {
    contractExample?: { quality: number; preset: { widths: number[] } }
  }
}

/** Compiled by the package build; never executed or included in distributable entrypoints. */
export function checkPluginContractTypes() {
  const defaults = resolveSiteConfig()
  const accent: string = defaults.style.theme.palette.light.accent
  const replaced = resolveSiteConfig(
    {},
    { plugins: [{ name: 'purestack:theme' }] },
  )
  // @ts-expect-error Replacing a default plugin may remove its settings.
  const absent: string = replaced.style.theme.palette.light.accent
  const custom: SiteConfig = resolveSiteConfig({}, { defaultPlugins: false })
  // @ts-expect-error Explicit plugin lists cannot guarantee default settings.
  const missing: string = custom.docLayout.sidebarTop

  definePlugin({
    name: 'typed-contract',
    config: {
      resolve({ config }) {
        const root: string = config.rootDir
        const partial: number | undefined =
          config.extensions.contractExample?.quality
        const settings = config.extensions.contractExample
        if (settings) {
          // @ts-expect-error Plugin settings have not been normalized yet.
          const _quality: number = settings.quality
        }
        return {
          extensions: { contractExample: { quality: partial ?? root.length } },
        }
      },
      normalize({ config }) {
        const preset = config.extensions.contractExample?.preset
        if (preset) {
          // @ts-expect-error Nested plugin settings may still be partial.
          const _widths: number[] = preset.widths
        }
        return {
          extensions: {
            contractExample: { quality: 80, preset: { widths: [480] } },
          },
        }
      },
      finalize({ config }) {
        const quality: number | undefined =
          config.extensions.contractExample?.quality
        const widths: number[] | undefined =
          config.extensions.contractExample?.preset.widths
        return { extensions: { finalQuality: quality, finalWidths: widths } }
      },
    },
    hooks: {
      onConfigResolved(context) {
        // @ts-expect-error Asset lifecycle state is private to the builder.
        context.assets.resetWrites()
        // @ts-expect-error Processors are installed through contributions, not mutable hook state.
        context.assetProcessors = []
      },
      onPageRendered(_context, page) {
        // @ts-expect-error Ownership receipts are private to the builder.
        page.assetReceipt.outputs = []
      },
    },
  })
  return { accent, absent, missing }
}

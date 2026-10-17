import type {
  FrontmatterEmbedOptions,
  RuntimeEmbeds,
} from '@purestack/ts-common'
import { buildModalScript } from './embed/modal.embed'
import { buildTabsScript } from './embed/tabs.embed'

/** Adds component runtimes after rendering; recorded placement overrides frontmatter. */
export function appendRuntimeScripts(
  document: Document,
  runtimeEmbeds: RuntimeEmbeds,
  defaults: FrontmatterEmbedOptions = {},
) {
  for (const [name, build] of [
    ['tabs', buildTabsScript],
    ['modal', buildModalScript],
  ] as const) {
    const position = runtimeEmbeds.get(name) ?? defaults[name]
    if (!position) continue
    const parent = position === 'body' ? document.body : document.head
    if (!parent) continue
    const script = document.createElement('script')
    script.textContent = build()
    parent.appendChild(script)
  }
}

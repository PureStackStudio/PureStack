import { createComponent, html } from 'regor'

import type { TsSsgContext } from '../../ts-ssg-context'

function resolveContext(): TsSsgContext | undefined {
  return globalThis.tsSsgContext
}

function resolveBrandLabel(): string {
  const label = resolveContext()?.site?.siteTitle
  if (typeof label !== 'string') return 'Docs'
  const trimmed = label.trim()
  return trimmed.length > 0 ? trimmed : 'Docs'
}

const topBarTemplate = html`<input
    class="doc-nav-toggle"
    id="doc-nav-toggle"
    type="checkbox"
    aria-hidden="true"
  />
  <header class="topbar">
    <a class="topbar__logo" href="/">{{ brandLabel }}</a>
    <div class="topbar__actions">
      <button
        class="topbar__icon topbar__search"
        type="button"
        aria-label="Search"
      ></button>
      <label
        class="topbar__icon topbar__toggle"
        for="doc-nav-toggle"
        role="button"
        aria-label="Toggle navigation"
      ></label>
    </div>
  </header>`

function createTopBarComponent() {
  return createComponent(topBarTemplate, {
    context: () => ({
      brandLabel: resolveBrandLabel(),
    }),
  })
}

export function createTopBarComponents() {
  return { topBar: createTopBarComponent() }
}

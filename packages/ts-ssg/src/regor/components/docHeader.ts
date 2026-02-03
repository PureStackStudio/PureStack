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

const docHeaderTemplate = html`<input
    class="doc-nav-toggle"
    id="doc-nav-toggle"
    type="checkbox"
    aria-hidden="true"
  />
  <header class="doc-header">
    <a class="doc-header__logo" href="/">{{ brandLabel }}</a>
    <div class="doc-header__actions">
      <button
        class="doc-header__icon doc-header__search"
        type="button"
        aria-label="Search"
      ></button>
      <label
        class="doc-header__icon doc-header__toggle"
        for="doc-nav-toggle"
        role="button"
        aria-label="Toggle navigation"
      ></label>
    </div>
  </header>`

function createDocHeaderComponent() {
  return createComponent(docHeaderTemplate, {
    context: () => ({
      brandLabel: resolveBrandLabel(),
    }),
  })
}

export function createDocHeaderComponents() {
  return { docHeader: createDocHeaderComponent() }
}

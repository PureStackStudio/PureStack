import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

interface SearchBoxContext {
  placeholder: string
}

const searchBoxTemplate = html`<div class="site-search" data-pagefind-search>
  <label class="site-search__field">
    <span class="site-search__sr-only">Search site</span>
    <span class="site-search__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="11" cy="11" r="6.5"></circle>
        <path d="M16 16l4.25 4.25"></path>
      </svg>
    </span>
    <input
      class="site-search__input"
      type="search"
      name="q"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      data-pagefind-input
      aria-label="Search site content"
    />
  </label>
  <div
    class="site-search__results doc-content"
    data-pagefind-results
    hidden
  ></div>
</div>`

function registerSearchBoxStyles() {
  themes.forEach((theme, palette, options) => {
    registerSearchBoxShellStyles(theme, palette, options)
    registerSearchBoxResultStyles(theme, palette, options)
    registerSearchBoxResponsiveStyles(theme)
  })
}

function registerSearchBoxShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search', theme)
    .position('relative')
    .width('clamp(170px, 28vw, 340px)')
    .maxWidth('100%')

  styleBuilder.select('.site-search__field', theme).display('block')

  styleBuilder
    .select('.site-search__icon', theme)
    .position('absolute')
    .left('12px')
    .top('50%')
    .width('18px')
    .height('18px')
    .transform('translateY(-50%)')
    .color(palette.text.soft)
    .pointerEvents('none')

  styleBuilder
    .select('.site-search__icon svg', theme)
    .width('100%')
    .height('100%')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .set('stroke-width', '2')
    .set('stroke-linecap', 'round')
    .set('stroke-linejoin', 'round')

  styleBuilder
    .select('.site-search__sr-only', theme)
    .position('absolute')
    .width('1px')
    .height('1px')
    .padding('0')
    .margin('-1px')
    .overflow('hidden')
    .set('clip', 'rect(0, 0, 0, 0)')
    .set('white-space', 'nowrap')
    .border('0')

  styleBuilder
    .select('.site-search__input', theme)
    .width('100%')
    .height('42px')
    .padding('0 14px 0 42px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surface)
    .color(palette.text.default)
    .fontSize('14px')
    .lineHeight('1.3')
    .boxSizing('border-box')
    .boxShadow(palette.effect.interactiveShadow)
    .transition('border-color 160ms ease, box-shadow 160ms ease')
    .set('appearance', 'none')

  styleBuilder
    .select('.site-search__input::placeholder', theme)
    .color(palette.text.subtle)

  styleBuilder
    .select('.site-search__input:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderColor(palette.border.accent)

  styleBuilder
    .select('.site-search__input::-webkit-search-cancel-button', theme)
    .cursor('pointer')
}

function registerSearchBoxResultStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-search__results', theme)
    .position('absolute')
    .top('calc(100% + 8px)')
    .right('0')
    .width('min(560px, calc(100vw - 32px))')
    .maxHeight('420px')
    .overflow('auto')
    .padding('8px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.raised)
    .boxShadow(options.shadows.strong)
    .zIndex('60')

  styleBuilder
    .select('.topbar .site-search__results', theme)
    .media('min-width: 721px')
    .position('fixed')
    .top('76px')
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .width('min(720px, calc(100vw - 32px))')
    .zIndex('120')

  styleBuilder
    .select('.site-search__results ul.site-search__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('8px')

  styleBuilder
    .select('.site-search__results .site-search__item', theme)
    .margin('0')
    .padding('0')

  styleBuilder
    .select('.site-search__results .site-search__link', theme)
    .display('grid')
    .gap('6px')
    .padding('12px 14px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.surface)
    .textDecoration('none')
    .color(palette.text.default)
    .boxShadow(palette.effect.interactiveShadow)
    .transition(
      'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
    )

  styleBuilder
    .select('.site-search__results .site-search__link:hover', theme)
    .background(palette.background.surfaceAlt)
    .borderColor(palette.border.default)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.site-search__results .site-search__link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.site-search__results .site-search__title', theme)
    .display('block')
    .fontWeight('700')
    .fontSize('0.98rem')
    .lineHeight('1.35')
    .letterSpacing('-0.01em')
    .color(palette.text.strong)
    .set('word-break', 'break-word')

  styleBuilder
    .select('.site-search__results .site-search__excerpt', theme)
    .display('block')
    .margin('0')
    .fontSize('0.9rem')
    .lineHeight('1.5')
    .color(palette.text.subtle)
    .set('word-break', 'break-word')
    .set('display', '-webkit-box')
    .set('line-clamp', '3')
    .set('-webkit-box-orient', 'vertical')
    .overflow('hidden')

  styleBuilder
    .select('.site-search__results mark.site-search__highlight', theme)
    .padding('0 3px')
    .borderRadius('5px')
    .background(palette.badge.accent.background)
    .color(palette.badge.accent.text)

  styleBuilder
    .select('.site-search__results .site-search__message', theme)
    .margin('0')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px dashed ${palette.border.default}`)
    .background(palette.background.surface)
    .color(palette.text.subtle)

  styleBuilder
    .select('.site-search__results .site-search__message--error', theme)
    .border(`1px solid ${palette.status.danger.border}`)
    .background(palette.status.danger.background)
    .color(palette.status.danger.text)
}

function registerSearchBoxResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search', theme)
    .media('max-width: 720px')
    .width('min(100%, 220px)')

  styleBuilder
    .select('.site-search__results', theme)
    .media('max-width: 720px')
    .left('0')
    .right('auto')
    .width('min(100vw - 32px, 520px)')
}

function createSearchBoxComponent() {
  return createComponent<SearchBoxContext>(searchBoxTemplate, {
    context: (head) => ({
      placeholder: resolveSearchPlaceholder(resolveTsSsgContext(head)),
    }),
  })
}

export function createSearchComponents() {
  registerSearchBoxStyles()
  return { siteSearch: createSearchBoxComponent() }
}

function resolveSearchPlaceholder(context: TsSsgContext): string {
  const title = context?.site?.siteTitle
  if (typeof title !== 'string') return 'Search'
  const trimmed = title.trim()
  if (trimmed.length === 0) return 'Search'
  return `Search ${trimmed}`
}

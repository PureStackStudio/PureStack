import { type BasicHeadConfig, h, type TSNode } from '@purestack/ts-html'

import type { PageNavigation } from './navigation/navigation'
import type { ThemeStylesheetLink } from './style/themes'

export interface PageTemplatePage {
  relPath: string
  urlPath: string
  frontmatter: Record<string, unknown>
}

export interface PageTemplateInput {
  head: TSNode<'head'>
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  templateName: string
  navigation?: PageNavigation
  page?: PageTemplatePage
  siteTitle?: string
}

export type PageTemplate = (
  input: PageTemplateInput,
) => TSNode<'html'> | Promise<TSNode<'html'>>

export type PageTemplateMap = Record<string, PageTemplate>

export const defaultTemplates: PageTemplateMap = {
  doc: renderDocTemplate,
  splash: renderSplashTemplate,
}

export function resolvePageTemplate(
  name: string | undefined,
  templates?: PageTemplateMap,
) {
  const registry = { ...defaultTemplates, ...(templates ?? {}) }
  const templateName = normalizeTemplateName(name)
  const pageTemplate = registry[templateName]
  if (!pageTemplate) {
    const known = Object.keys(registry).sort().join(', ')
    throw new Error(
      `Unknown page template "${templateName}". Known templates: ${known || 'none'}`,
    )
  }
  return { pageTemplate, templateName }
}

function normalizeTemplateName(name: string | undefined) {
  if (typeof name !== 'string') return 'doc'
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed : 'doc'
}

function renderDocTemplate({
  head,
  bodyHtml,
  navigation,
}: PageTemplateInput) {
  const navNode = renderDocNav(navigation)
  const hasNav = Boolean(navNode)
  return h('html').push(
    head,
    h('body')
      .attr({ class: 'template-doc' })
      .push(
        ...(hasNav
          ? [
              h('doc-header'),
            ]
          : []),
        h('div')
          .attr({
            class: hasNav ? 'doc-shell' : 'doc-shell doc-shell--single',
          })
          .push(
            ...(hasNav
              ? [
                  h('aside')
                    .attr({ class: 'doc-sidebar', id: 'doc-sidebar' })
                    .push(navNode!),
                ]
              : []),
            h('main')
              .attr({ class: 'doc-main' })
              .push(h('article').attr({ class: 'doc-content' }).raw(bodyHtml)),
          ),
      ),
  )
}

function renderSplashTemplate({ head, bodyHtml }: PageTemplateInput) {
  return h('html').push(
    head,
    h('body')
      .attr({ class: 'template-splash' })
      .push(
        h('main').push(h('section').attr({ class: 'splash' }).raw(bodyHtml)),
      ),
  )
}

function renderDocNav(navigation?: PageTemplateInput['navigation']) {
  const items =
    navigation?.items && navigation.items.length > 0
      ? navigation.items
      : (navigation?.global ?? [])
  if (items.length === 0) return undefined
  return h('nav')
    .attr({ class: 'doc-nav', 'aria-label': 'Page navigation' })
    .push(renderNavList(items))
}

function renderNavList(
  items: NonNullable<PageTemplateInput['navigation']>['items'],
) {
  const list = h('ul').attr({ class: 'doc-nav__list' })
  for (const item of items) {
    const content = item.url
      ? h('a').attr({ href: item.url }).text(item.title)
      : h('span').text(item.title)
    const li = h('li').attr({ class: 'doc-nav__item' }).push(content)
    if (item.children && item.children.length > 0) {
      li.push(renderNavList(item.children))
    }
    list.push(li)
  }
  return list
}

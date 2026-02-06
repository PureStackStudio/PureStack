import { type BasicHeadConfig, h, type TSNode } from '@purestack/ts-html'

import type { PageNavigation } from '../navigation/navigation'
import type { ThemeStylesheetLink } from '../style/themes'

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

type NavMode = 'sidebar' | 'drawer'

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
  page,
}: PageTemplateInput) {
  const layout = resolveDocLayout(page?.frontmatter, navigation)
  return h('html').push(
    head,
    h('body')
      .attr({ class: layout.bodyClass })
      .push(
        h('top-bar'),
        h('div')
          .attr({ class: layout.shellClass })
          .push(
            ...(layout.showNav
              ? [
                  h('aside')
                    .attr({ class: 'doc-sidebar', id: 'doc-sidebar' })
                    .push(h('nav-menu')),
                ]
              : []),
            h('main')
              .attr({ class: 'doc-main' })
              .push(h('article').attr({ class: 'doc-content' }).raw(bodyHtml)),
            ...(layout.showToc
              ? [
                  h('aside')
                    .attr({ class: 'doc-toc', id: 'doc-toc' })
                    .push(h('page-toc')),
                ]
              : []),
          ),
      ),
  )
}

type DocLayout = {
  bodyClass: string
  shellClass: string
  showNav: boolean
  showToc: boolean
}

function resolveDocLayout(
  frontmatter: Record<string, unknown> | undefined,
  navigation: PageNavigation | undefined,
): DocLayout {
  const navMode = resolveNavMode(frontmatter)
  const layoutClass = resolveDocLayoutClass(frontmatter)
  const showNav = hasNavItems(navigation)
  const showToc = resolveTocEnabled(frontmatter)
  const bodyClass = buildDocBodyClass(navMode, layoutClass)
  const shellClass = buildDocShellClass(showNav, showToc, navMode)
  return { bodyClass, shellClass, showNav, showToc }
}

function hasNavItems(navigation: PageNavigation | undefined) {
  const itemCount = navigation?.items?.length ?? 0
  const globalCount = navigation?.global?.length ?? 0
  return itemCount + globalCount > 0
}

function buildDocBodyClass(navMode: NavMode, layoutClass: string) {
  const navClass = navMode === 'drawer' ? 'template-doc--nav-drawer' : ''
  return ['template-doc', navClass, layoutClass].filter(Boolean).join(' ')
}

function buildDocShellClass(
  showNav: boolean,
  showToc: boolean,
  navMode: NavMode,
) {
  const classes = ['doc-shell']
  if (!showNav && !showToc) classes.push('doc-shell--single')
  if (navMode === 'drawer') classes.push('doc-shell--nav-drawer')
  if (showToc) {
    classes.push(showNav ? 'doc-shell--toc' : 'doc-shell--toc-only')
  }
  return classes.join(' ')
}

function resolveNavMode(
  frontmatter: Record<string, unknown> | undefined,
): NavMode {
  if (!isPlainObject(frontmatter)) return 'sidebar'
  const layout = isPlainObject(frontmatter.layout)
    ? frontmatter.layout
    : undefined
  const navMode = layout?.navMode
  return navMode === 'drawer' ? 'drawer' : 'sidebar'
}

function resolveDocLayoutClass(
  frontmatter: Record<string, unknown> | undefined,
) {
  if (!isPlainObject(frontmatter)) return ''
  const layout = isPlainObject(frontmatter.layout)
    ? frontmatter.layout
    : undefined
  const fullWidth = layout?.fullWidthMain
  return fullWidth === true ? 'template-doc--full-main' : ''
}

function resolveTocEnabled(frontmatter: Record<string, unknown> | undefined) {
  if (!isPlainObject(frontmatter)) return false
  const layout = isPlainObject(frontmatter.layout)
    ? frontmatter.layout
    : undefined
  return layout?.showToc === true
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
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

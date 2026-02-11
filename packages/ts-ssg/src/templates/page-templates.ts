import { type BasicHeadConfig, h, type TSNode } from '@purestack/ts-html'

import type { PageNavigation } from '../navigation/navigation'
import type { ThemeStylesheetLink } from '../style/themeAssets'

export interface PageInfo {
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
  pageInfo?: PageInfo
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
  pageInfo: page,
  siteTitle,
}: PageTemplateInput) {
  const layout = resolveDocLayout(page?.frontmatter, navigation)
  const showFooter = resolveFooterEnabled(page?.frontmatter)
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
        ...(showFooter ? [buildDefaultFooter(siteTitle)] : []),
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

function resolveFooterEnabled(frontmatter: Record<string, unknown> | undefined) {
  if (!isPlainObject(frontmatter)) return true
  const layout = isPlainObject(frontmatter.layout)
    ? frontmatter.layout
    : undefined
  if (typeof layout?.showFooter === 'boolean') return layout.showFooter
  return true
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function renderSplashTemplate({ head, bodyHtml, pageInfo }: PageTemplateInput) {
  const showFooter = resolveFooterEnabled(pageInfo?.frontmatter)
  return h('html').push(
    head,
    h('body')
      .attr({ class: 'template-splash' })
      .push(
        h('main').push(h('section').attr({ class: 'splash' }).raw(bodyHtml)),
        ...(showFooter ? [buildDefaultFooter()] : []),
      ),
  )
}

function buildDefaultFooter(siteTitle?: string) {
  const title = `${siteTitle || 'Your Site'} keeps shipping after launch`
  return h('site-footer')
    .attr({
      title,
      ctaLabel: 'Get Started',
      ctaHref: '/',
      newsletterTitle: 'Stay in the loop',
    })
    .push(
      h('p').raw(
        'Ship docs, marketing pages, changelogs, and product hubs with one reusable architecture.',
      ),
      buildDefaultFooterStatusSlot(),
      buildDefaultFooterColumnsSlot(),
      buildDefaultFooterLegalSlot(),
      buildDefaultFooterSocialSlot(),
    )
}

function buildDefaultFooterStatusSlot() {
  return h('template')
    .attr({ name: 'status' })
    .push(
      h('span').raw('Performance-first'),
      h('span').raw('Accessible by default'),
      h('span').raw('SEO-ready output'),
    )
}

function buildDefaultFooterColumnsSlot() {
  return h('template')
    .attr({ name: 'columns' })
    .push(buildDefaultFooterProductColumn(), buildDefaultFooterCompanyColumn())
}

function buildDefaultFooterProductColumn() {
  return h('footer-column')
    .attr({ title: 'Product' })
    .push(
      h('footer-link').attr({ href: '/', label: 'Overview' }),
      h('footer-link').attr({
        href: '/guide/',
        label: 'Documentation',
      }),
      h('footer-link').attr({
        href: '/features/',
        label: 'Features',
      }),
    )
}

function buildDefaultFooterCompanyColumn() {
  return h('footer-column')
    .attr({ title: 'Company' })
    .push(
      h('footer-link').attr({ href: '/about/', label: 'About' }),
      h('footer-link').attr({ href: '/blog/', label: 'Blog' }),
      h('footer-link').attr({
        href: '/contact/',
        label: 'Contact',
      }),
    )
}

function buildDefaultFooterLegalSlot() {
  return h('template')
    .attr({ name: 'legal' })
    .push(
      h('a').attr({ href: '/privacy/' }).raw('Privacy'),
      h('a').attr({ href: '/terms/' }).raw('Terms'),
    )
}

function buildDefaultFooterSocialSlot() {
  return h('template')
    .attr({ name: 'social' })
    .push(
      h('footer-social').attr({
        href: 'https://github.com',
        label: 'GitHub',
        target: '_blank',
      }),
    )
}

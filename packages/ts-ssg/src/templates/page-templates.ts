import { type BasicHeadConfig, h, type TSNode } from '@purestack/ts-html'

import type { PageFrontmatter } from '../frontmatter/frontmatter'
import type { PageNavigation } from '../navigation/navigation'
import type { ThemeStylesheetLink } from '../style/themeAssets'

export interface PageInfo {
  relPath: string
  urlPath: string
  frontmatter: PageFrontmatter
}

export interface PageTemplateInput {
  head: TSNode<'head'>
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  templateName: string
  navigation?: PageNavigation
  pageInfo: PageInfo
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
  pageInfo,
  siteTitle,
}: PageTemplateInput) {
  const frontmatter = pageInfo.frontmatter
  const layout = resolveDocLayout(frontmatter, navigation)
  const showFooter = frontmatter.layout.showFooter
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
        h('consent'),
        ...(showFooter ? [buildDefaultFooter(siteTitle)] : []),
      ),
  )
}

type DocLayout = {
  bodyClass: string
  shellClass: string
  showNav: boolean
  showToc: boolean
  tocCollapsed: boolean
}

function resolveDocLayout(
  frontmatter: PageFrontmatter,
  navigation: PageNavigation | undefined,
): DocLayout {
  const navMode = frontmatter.layout.navMode
  const layoutClass = resolveDocLayoutClass(frontmatter)
  const showNav = hasNavItems(navigation)
  const showToc = frontmatter.layout.showToc
  const tocCollapsed = frontmatter.layout.tocCollapsed === true
  const bodyClass = buildDocBodyClass(
    navMode,
    layoutClass,
    showNav,
    showToc,
    tocCollapsed,
  )
  const shellClass = buildDocShellClass(showNav, showToc, navMode)
  return { bodyClass, shellClass, showNav, showToc, tocCollapsed }
}

function hasNavItems(navigation: PageNavigation | undefined) {
  const itemCount = navigation?.items?.length ?? 0
  const globalCount = navigation?.global?.length ?? 0
  return itemCount + globalCount > 0
}

function buildDocBodyClass(
  navMode: PageFrontmatter['layout']['navMode'],
  layoutClass: string,
  showNav: boolean,
  showToc: boolean,
  tocCollapsed: boolean,
) {
  const navClass = navMode === 'drawer' ? 'template-doc--nav-drawer' : ''
  const hasNavClass = showNav ? 'template-doc--has-nav' : ''
  const tocCollapsedClass =
    showToc && tocCollapsed ? 'template-doc--toc-collapsed' : ''
  return ['template-doc', navClass, hasNavClass, tocCollapsedClass, layoutClass]
    .filter(Boolean)
    .join(' ')
}

function buildDocShellClass(
  showNav: boolean,
  showToc: boolean,
  navMode: PageFrontmatter['layout']['navMode'],
) {
  const classes = ['doc-shell']
  if (!showNav && !showToc) classes.push('doc-shell--single')
  if (navMode === 'drawer') classes.push('doc-shell--nav-drawer')
  if (showToc) {
    classes.push(showNav ? 'doc-shell--toc' : 'doc-shell--toc-only')
  }
  return classes.join(' ')
}

function resolveDocLayoutClass(frontmatter: PageFrontmatter) {
  return frontmatter.layout.fullWidthMain ? 'template-doc--full-main' : ''
}

function renderSplashTemplate({ head, bodyHtml, pageInfo }: PageTemplateInput) {
  const showFooter = pageInfo.frontmatter.layout.showFooter
  return h('html').push(
    head,
    h('body')
      .attr({ class: 'template-splash' })
      .push(
        h('main').push(h('section').attr({ class: 'splash' }).raw(bodyHtml)),
        h('consent'),
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
      h('a').attr({ href: '/imprint/' }).raw('Imprint'),
      h('a').attr({ href: '/imprint/de/' }).raw('Impressum'),
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

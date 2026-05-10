import type {
  PageFrontmatter,
  PageNavigation,
  PageOutlineItem,
  PageTemplateInput,
  PageTemplateMap,
} from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { isTocEnabled } from '../toc/isTocEnabled'

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
  site,
  navigation,
  outline,
  pageInfo,
  headerHtml,
  footerHtml,
}: PageTemplateInput) {
  const frontmatter = pageInfo.frontmatter
  const layout = resolveDocLayout(frontmatter, navigation, outline)
  const showFooter = frontmatter.layout.showFooter
  return h('html').push(
    head,
    h('body')
      .attr({ class: layout.bodyClass })
      .push(
        buildTopBar(headerHtml),
        h('div')
          .attr({ class: layout.shellClass })
          .push(
            ...(layout.showNav
              ? [
                  h('aside')
                    .attr({ class: 'doc-sidebar', id: 'doc-sidebar' })
                    .push(h('nav-menu').attr({ tone: navigation?.tone })),
                ]
              : []),
            h('main')
              .attr({ class: 'doc-main' })
              .push(h('article').attr({ class: 'doc-content' }).raw(bodyHtml)),
            ...(layout.showToc
              ? [
                  h('aside')
                    .attr({ class: 'doc-toc', id: 'doc-toc' })
                    .push(
                      h('page-toc').attr({
                        tone: frontmatter.layout.tocTone ?? site.pageToc.tone,
                      }),
                    ),
                ]
              : []),
          ),
        h('consent'),
        buildFooter(showFooter, footerHtml),
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
  outline: PageOutlineItem[] | undefined,
): DocLayout {
  const navMode = frontmatter.layout.navMode
  const layoutClass = resolveDocLayoutClass(frontmatter)
  const showNav = frontmatter.layout.showNav && hasNavItems(navigation)
  const showToc = isTocEnabled(frontmatter, outline)
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
  const navClass =
    showNav && navMode === 'drawer' ? 'template-doc--nav-drawer' : ''
  const hasNavClass = showNav ? 'template-doc--has-nav' : ''
  const hasTocClass = showToc ? 'template-doc--has-toc' : ''
  const tocCollapsedClass =
    showToc && tocCollapsed ? 'template-doc--toc-collapsed' : ''
  return [
    'template-doc',
    navClass,
    hasNavClass,
    hasTocClass,
    tocCollapsedClass,
    layoutClass,
  ]
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
  return frontmatter.layout.fullWidth ? 'template-doc--full-main' : ''
}

function renderSplashTemplate({
  head,
  bodyHtml,
  pageInfo,
  headerHtml,
  footerHtml,
}: PageTemplateInput) {
  const showFooter = pageInfo.frontmatter.layout.showFooter
  return h('html').push(
    head,
    h('body')
      .attr({ class: 'template-splash' })
      .push(
        buildTopBar(headerHtml),
        h('main').push(h('section').attr({ class: 'splash' }).raw(bodyHtml)),
        h('consent'),
        buildFooter(showFooter, footerHtml),
      ),
  )
}

function buildTopBar(headerHtml?: string) {
  if (hasHeaderHtml(headerHtml)) {
    return h('').raw(headerHtml)
  }
  return h('')
}

function buildFooter(showFooter: boolean, footerHtml?: string) {
  if (showFooter && hasFooterHtml(footerHtml)) {
    return h('').raw(footerHtml)
  }
  return h('')
}

function hasHeaderHtml(headerHtml?: string): headerHtml is string {
  return typeof headerHtml === 'string' && headerHtml.trim().length > 0
}

function hasFooterHtml(footerHtml?: string): footerHtml is string {
  return typeof footerHtml === 'string' && footerHtml.trim().length > 0
}

import type {
  PageHeadTemplate,
  PageInfo,
  PageNavigation,
  PageOutlineItem,
  PageTemplateMap,
  SiteConfig,
} from '@purestack/ts-common'
import type { BasicHeadConfig } from '@purestack/ts-html'
import type { ThemeStylesheetLink } from '@purestack/ts-style'
import { getHead } from '../config/head'
import { resolvePageTemplate } from '../templates/page-templates'

export interface RenderPageInput {
  bodyHtml: string
  headConfig?: BasicHeadConfig
  styleLinks?: ThemeStylesheetLink[]
  template?: string
  templates?: PageTemplateMap
  headTemplates?: readonly PageHeadTemplate[]
  site: SiteConfig
  navigation?: PageNavigation
  outline?: PageOutlineItem[]
  pageInfo: PageInfo
  headerHtml?: string
  footerHtml?: string
}

export async function renderPage(input: RenderPageInput): Promise<string> {
  const { bodyHtml, headConfig, styleLinks, template, templates } = input
  let head = getHead(headConfig)
  const { pageTemplate, templateName } = resolvePageTemplate(
    template,
    templates,
  )
  const templateInput = {
    head,
    bodyHtml,
    headConfig,
    styleLinks,
    templateName,
    site: input.site,
    navigation: input.navigation,
    outline: input.outline,
    pageInfo: input.pageInfo,
    headerHtml: input.headerHtml,
    footerHtml: input.footerHtml,
  }
  for (const renderHead of input.headTemplates ?? []) {
    head = await renderHead({ ...templateInput, head })
  }
  const html = await pageTemplate({ ...templateInput, head })
  return html.toHtml()
}

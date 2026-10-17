import { merge } from '@purestack/ts-util'
import { ContentRouteIndex } from '../build/content-urls'
import { resolveHeadConfig } from '../build/head-config'
import { type BuildContext, renderPageFromFile } from '../build/page'
import { type RenderPageInput, renderPage } from '../build/renderer'
import type { BuildHooks } from '../build/site'
import { applyConfigResolvers } from '../config/core-config'
import type { ResolvedContentFile } from '../i18n/content'
import { resolvePluginConfigResolvers } from '../plugins/contributions'
import {
  initializePluginContext,
  resolveBuildPlugins,
} from '../plugins/default-plugins'
import {
  composePluginHooks,
  resolvePluginContentProcessor,
} from '../plugins/plugin'
import { initRenderer } from '../regor/initRenderer'

async function initialize(context: BuildContext) {
  initRenderer()
  const components = context.components
  const templates = context.templates
  const plugins = resolveBuildPlugins()
  context.config = applyConfigResolvers(
    context.config,
    resolvePluginConfigResolvers(plugins),
  )
  await initializePluginContext(context, plugins)
  context.mdx = {
    ...context.mdx,
    contentProcessor:
      context.mdx?.contentProcessor ?? resolvePluginContentProcessor(plugins),
  }
  context.components = { ...context.components, ...components }
  context.templates = { ...context.templates, ...templates }
  return plugins
}

/** Exercises the same default plugins as buildSite for low-level page tests. */
export async function renderDefaultPage(
  context: BuildContext,
  file: ResolvedContentFile,
  hooks: Pick<BuildHooks, 'onPageDocument'> = {},
) {
  const plugins = await initialize(context)
  return renderPageFromFile(
    context,
    file,
    composePluginHooks([...plugins, { name: 'test', hooks }]),
  )
}

export async function renderDefaultShell(input: RenderPageInput) {
  const context: BuildContext = {
    config: input.site,
    contentRoutes: new ContentRouteIndex([]),
    templates: input.templates,
  }
  await initialize(context)
  const headConfig = merge(
    await resolveHeadConfig(
      { site: context.config, pageInfo: input.pageInfo },
      context.headConfigTemplates,
    ),
    input.headConfig,
  )
  return renderPage({
    ...input,
    site: context.config,
    headConfig,
    templates: context.templates,
    headTemplates: context.headTemplates,
    styleLinks: context.styles?.links(),
  })
}

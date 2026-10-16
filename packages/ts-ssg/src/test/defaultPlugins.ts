import { ContentRouteIndex } from '../build/content-urls'
import { type BuildContext, renderPageFromFile } from '../build/page'
import { type RenderPageInput, renderPage } from '../build/renderer'
import type { BuildHooks } from '../build/site'
import type { ResolvedContentFile } from '../i18n/content'
import {
  initializePluginContext,
  resolveBuildPlugins,
} from '../plugins/default-plugins'
import { composePluginHooks } from '../plugins/plugin'
import { initRenderer } from '../regor/initRenderer'

async function initialize(context: BuildContext) {
  initRenderer()
  const components = context.components
  const templates = context.templates
  const plugins = resolveBuildPlugins()
  await initializePluginContext(context, plugins)
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
  return renderPage({
    ...input,
    templates: context.templates,
    headTemplates: context.headTemplates,
    styleLinks: context.styles?.links(),
  })
}

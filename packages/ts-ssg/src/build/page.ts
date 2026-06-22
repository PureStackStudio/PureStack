import path from 'node:path'
import type {
  PageFrontmatter,
  PageInfo,
  PageNavigation,
  PageOutlineItem,
  PageTemplateMap,
  PageTranslationInfo,
  SiteConfig,
} from '@purestack/ts-common'
import type { BasicHeadConfig } from '@purestack/ts-html'
import { renderApp } from '@purestack/ts-render'
import { resolveThemeStyleLinks } from '@purestack/ts-style'
import { isError, toOutputAssetRelPath, withBasePath } from '@purestack/ts-util'
import { getLogger } from 'logpot'
import type { Component } from 'regor'
import {
  type ContentFile,
  discoverDefaultFooters,
  discoverDefaultHeaders,
} from '../discover/content'
import {
  normalizeFrontmatter,
  parseFrontmatterSource,
} from '../frontmatter/frontmatter'
import {
  type ContentTranslationsByKey,
  type ResolvedContentFile,
  resolveContentFile,
  resolvePlainContentFile,
} from '../i18n/content'
import { compileMarkdown } from '../mdx/md'
import { compileMdx, type MdxRenderOptions } from '../mdx/mdx'
import {
  type NavigationTree,
  resolvePageNavigation,
} from '../navigation/navigation'
import { resolveRouteInfo } from '../routing/route'
import { resolvePageContentHref } from './content-hrefs'
import { resolveHeadConfig } from './head-config'
import { readSource, writeHtml } from './io'
import { resolveOutPath } from './out-path'
import { applyPublicBasePath } from './public-hrefs'
import { renderPage } from './renderer'

export interface BuildContext {
  config: SiteConfig
  headerHtmlByDir?: Map<string, string>
  footerHtmlByDir?: Map<string, string>
  writeErrorPages?: boolean
  components?: Record<string, Component>
  templates?: PageTemplateMap
  navigation?: NavigationTree
  translationsByKey?: ContentTranslationsByKey
  mdx?: MdxRenderOptions
  resolveScriptPublicPath?: (sourceRelPath: string) => string
}

export interface PageRenderResult {
  file: ResolvedContentFile
  frontmatter: PageFrontmatter
  body: string
  headConfig: BasicHeadConfig
  bodyHtml: string
  html: string
  template?: string
  outPath: string
  urlPath: string
  renderTimeMs: number
  navigation?: PageNavigation
  pageInfo: PageInfo
  outline?: PageOutlineItem[]
  scriptEntrypoints: string[]
}

export async function buildPage(
  context: BuildContext,
  file: ResolvedContentFile,
): Promise<PageRenderResult> {
  const page = await renderPageFromFile(context, file)
  await writePage(page, context.config.html.minify)
  return page
}

export async function writePage(
  page: PageRenderResult,
  minify: boolean,
): Promise<void> {
  await writeHtml({
    outPath: page.outPath,
    html: page.html,
    minify,
  })
  const log = getLogger()
  const renderTimeMs = Math.round(page.renderTimeMs)
  log.info('page written', {
    outPath: page.outPath,
    urlPath: page.urlPath,
    renderTimeMs,
  })
  if (renderTimeMs > 2000) {
    log.warn('page render slow', {
      outPath: page.outPath,
      urlPath: page.urlPath,
      renderTimeMs,
      thresholdMs: 2000,
    })
  }
}

export async function renderPageFromFile(
  context: BuildContext,
  file: ResolvedContentFile,
): Promise<PageRenderResult> {
  const renderStart = process.hrtime.bigint()
  const { urlPath } = resolveRouteInfo(file)
  const outPath = resolveOutPath(context.config.outDir, file)
  try {
    const source = await readSource(file.absPath)
    const parsedContent = parseFrontmatterSource(source, file.relPath, {
      defaultShowToc: context.config.pageToc.enabled,
    })
    const navigation = resolvePageNavigation(
      context.navigation,
      file,
      parsedContent.frontmatter,
    )
    const pageInfo = createPageTemplateInfo(
      file,
      urlPath,
      parsedContent.frontmatter,
      context.translationsByKey,
    )
    const headConfig = resolveHeadConfig(parsedContent.frontmatter, {
      siteTitle: context.config.siteTitle,
      sitePreview: context.config.preview,
      basePath: context.config.basePath,
      baseUrl: context.config.sitemap.baseUrl,
      urlPath,
      translations: pageInfo.translations,
    })
    const compiled = compilePageContent(
      file,
      parsedContent.body,
      context.mdx,
      context.config.mdx.compileMdAsMdx,
      context.config,
    )
    const template = parsedContent.frontmatter.template
    const scriptEntrypoints = new Set<string>()
    const htmlShell = await renderPageShell({
      context,
      bodyHtml: compiled.bodyHtml,
      headConfig,
      template,
      navigation,
      outline: compiled.outline,
      pageInfo,
    })
    const html = applyPublicBasePath(
      renderPageApp(context, htmlShell, {
        pageInfo,
        navigation,
        outline: compiled.outline,
        scriptEntrypoints,
      }),
      context.config.basePath,
    )
    const renderTimeMs =
      Number(process.hrtime.bigint() - renderStart) / 1_000_000
    return {
      file,
      ...parsedContent,
      headConfig,
      ...compiled,
      html,
      template,
      outPath,
      urlPath,
      renderTimeMs,
      navigation,
      pageInfo,
      scriptEntrypoints: [...scriptEntrypoints].sort((a, b) =>
        a.localeCompare(b),
      ),
    }
  } catch (error) {
    if (isError(error)) getLogger().warn(error as Error)
    const errorWithContext = attachPageContext(error, {
      relPath: file.relPath,
      urlPath,
      outPath,
    })
    if (context.writeErrorPages) {
      return await writePageError(context, file, errorWithContext, {
        outPath,
        urlPath,
        renderStart,
      })
    }
    throw errorWithContext
  }
}

export async function resolveFooterHtmlByDirectory(
  config: SiteConfig,
  mdxOptions: MdxRenderOptions | undefined,
): Promise<Map<string, string>> {
  const footers = await discoverDefaultFooters(config.contentDir)
  return await resolveSpecialHtmlByDirectory(config, footers, mdxOptions)
}

export async function resolveHeaderHtmlByDirectory(
  config: SiteConfig,
  mdxOptions: MdxRenderOptions | undefined,
): Promise<Map<string, string>> {
  const headers = await discoverDefaultHeaders(config.contentDir)
  return await resolveSpecialHtmlByDirectory(config, headers, mdxOptions)
}

async function resolveSpecialHtmlByDirectory(
  config: SiteConfig,
  files: ContentFile[],
  mdxOptions: MdxRenderOptions | undefined,
): Promise<Map<string, string>> {
  const htmlByDir = new Map<string, string>()
  for (const file of files) {
    const localizedFile = resolveSpecialContentFile(config, file)
    const source = await readSource(localizedFile.absPath)
    const parsedContent = parseFrontmatterSource(source, localizedFile.relPath)
    const compiled = compilePageContent(
      localizedFile,
      parsedContent.body,
      mdxOptions,
      config.mdx.compileMdAsMdx,
      config,
    )
    const dirKey = toDirKey(localizedFile.relPath)
    htmlByDir.set(dirKey, compiled.bodyHtml)
  }
  return htmlByDir
}

function resolveSpecialContentFile(config: SiteConfig, file: ContentFile) {
  if (!config.i18n.enabled) return resolvePlainContentFile(file)
  const locale = file.relPath.replaceAll('\\', '/').split('/')[0]
  return locale && config.i18n.locales.includes(locale)
    ? resolveContentFile(config, file)
    : resolvePlainContentFile(file)
}

function createPageTemplateInfo(
  file: ResolvedContentFile,
  urlPath: string,
  frontmatter: PageFrontmatter,
  translationsByKey?: ContentTranslationsByKey,
): PageInfo {
  return {
    relPath: toTemplateRelPath(file.relPath),
    urlPath,
    frontmatter,
    ...(file.locale ? { locale: file.locale } : {}),
    ...(file.translationKey ? { translationKey: file.translationKey } : {}),
    ...resolvePageTranslations(file, translationsByKey),
  }
}

function resolvePageTranslations(
  file: ResolvedContentFile,
  translationsByKey: ContentTranslationsByKey | undefined,
): { translations?: PageTranslationInfo[] } {
  if (!file.translationKey || !translationsByKey) return {}
  const translations = (translationsByKey.get(file.translationKey) ?? [])
    .filter((entry) => entry.locale && entry.urlPath)
    .map((entry) => ({
      locale: entry.locale as string,
      urlPath: entry.urlPath as string,
      relPath: toTemplateRelPath(entry.relPath),
    }))
    .sort((left, right) => left.locale.localeCompare(right.locale))
  return translations.length > 0 ? { translations } : {}
}

function compilePageContent(
  file: ResolvedContentFile,
  sourceBody: string,
  mdxOptions: MdxRenderOptions | undefined,
  compileMdAsMdx: boolean,
  config: SiteConfig,
) {
  const shouldCompileMdAsMdx = mdxOptions?.compileMdAsMdx ?? compileMdAsMdx
  if (file.ext === '.mdx' || shouldCompileMdAsMdx) {
    return compileMdx(sourceBody, {
      ...(mdxOptions ?? {}),
      sourceRelPath: file.relPath,
      resolveContentHref: (href, sourceRelPath) =>
        resolvePageContentHref(href, sourceRelPath, config),
    })
  }
  return compileMarkdown(sourceBody, {
    ...(mdxOptions ?? {}),
    sourceRelPath: file.relPath,
    resolveContentHref: (href, sourceRelPath) =>
      resolvePageContentHref(href, sourceRelPath, config),
  })
}

type RenderPageShellInput = {
  context: BuildContext
  bodyHtml: string
  headConfig: BasicHeadConfig
  template: string | undefined
  navigation: PageNavigation | undefined
  outline: PageOutlineItem[]
  pageInfo: PageInfo
}

async function renderPageShell(input: RenderPageShellInput): Promise<string> {
  const {
    context,
    bodyHtml,
    headConfig,
    template,
    navigation,
    outline,
    pageInfo,
  } = input
  return await renderPage({
    bodyHtml,
    headConfig,
    styleLinks: resolveThemeStyleLinks(
      context.config.style.href,
      context.config.style.themes,
    ),
    template,
    templates: context.templates,
    site: context.config,
    navigation,
    outline,
    pageInfo,
    headerHtml: resolveSpecialHtmlForPage(
      pageInfo.relPath,
      context.headerHtmlByDir,
    ),
    footerHtml: resolveFooterHtmlForPage(
      pageInfo.relPath,
      context.footerHtmlByDir,
    ),
    consent: context.config.consent,
    analytics: context.config.analytics,
  })
}

function resolveFooterHtmlForPage(
  pageRelPath: string,
  footerHtmlByDir: Map<string, string> | undefined,
): string | undefined {
  return resolveSpecialHtmlForPage(pageRelPath, footerHtmlByDir)
}

function resolveSpecialHtmlForPage(
  pageRelPath: string,
  htmlByDir: Map<string, string> | undefined,
): string | undefined {
  if (!htmlByDir || htmlByDir.size === 0) return undefined
  let dir = toDirKey(pageRelPath)
  while (true) {
    const html = htmlByDir.get(dir)
    if (typeof html === 'string' && html.trim().length > 0) {
      return html
    }
    if (dir.length === 0) {
      return undefined
    }
    dir = toParentDirKey(dir)
  }
}

function toDirKey(relPath: string) {
  const dir = path.dirname(relPath)
  if (dir === '.') return ''
  return dir.replaceAll('\\', '/')
}

function toParentDirKey(dirKey: string) {
  const slashIndex = dirKey.lastIndexOf('/')
  if (slashIndex < 0) return ''
  return dirKey.slice(0, slashIndex)
}

function toTemplateRelPath(relPath: string) {
  return relPath.replaceAll('\\', '/')
}

type RenderAppContextInput = {
  pageInfo: PageInfo
  navigation: PageNavigation | undefined
  outline: PageOutlineItem[]
  scriptEntrypoints: Set<string>
}

function renderPageApp(
  context: BuildContext,
  htmlShell: string,
  appContext: RenderAppContextInput,
) {
  const { scriptEntrypoints, ...baseContext } = appContext
  return renderApp(htmlShell, {
    components: context.components,
    context: {
      site: context.config,
      ...baseContext,
      theme: context.config.style.theme,
      basePath: context.config.basePath,
      locale: baseContext.pageInfo.locale,
      locales: context.config.i18n.locales,
      defaultLocale: context.config.i18n.defaultLocale || undefined,
      resolveLocaleHref: (locale: string) =>
        baseContext.pageInfo.translations?.find(
          (entry) => entry.locale === locale,
        )?.urlPath,
      resolvePublicHref: (href: string) =>
        withBasePath(context.config.basePath, href),
      recordScriptEntrypoint: (sourceRelPath: string) => {
        if (path.extname(sourceRelPath).toLowerCase() !== '.ts') return
        scriptEntrypoints.add(sourceRelPath.replaceAll('\\', '/'))
      },
      resolveScriptPublicPath: (sourceRelPath: string) =>
        withBasePath(
          context.config.basePath,
          context.resolveScriptPublicPath?.(sourceRelPath) ??
            `/${toOutputAssetRelPath(sourceRelPath)}`,
        ),
      recordRuntimeEmbed: () => {},
    },
  })
}

type PageErrorContext = {
  relPath: string
  urlPath: string
  outPath: string
}

function attachPageContext(error: unknown, context: PageErrorContext): unknown {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    if (!err.file) {
      err.file = context.relPath
    }
    if (!err.page || typeof err.page !== 'object') {
      err.page = {
        relPath: context.relPath,
        urlPath: context.urlPath,
        outPath: context.outPath,
      }
    }
    return error
  }
  const message = `Page build failed (${context.relPath}): ${String(error)}`
  const wrapped = new Error(message)
  const extended = wrapped as unknown as Record<string, unknown>
  extended.file = context.relPath
  extended.page = {
    relPath: context.relPath,
    urlPath: context.urlPath,
    outPath: context.outPath,
  }
  return wrapped
}

type ErrorRenderContext = {
  outPath: string
  urlPath: string
  renderStart: bigint
}

export async function writePageError(
  context: BuildContext,
  file: ResolvedContentFile,
  error: unknown,
  renderContext?: ErrorRenderContext,
): Promise<PageRenderResult> {
  const route = resolveRouteInfo(file)
  const outPath =
    renderContext?.outPath ?? resolveOutPath(context.config.outDir, file)
  const urlPath = renderContext?.urlPath ?? route.urlPath
  const renderStart = renderContext?.renderStart ?? process.hrtime.bigint()
  const message = toErrorMessage(error)
  const stack = toErrorStack(error)
  const html = buildRenderErrorHtml({
    relPath: file.relPath,
    outPath,
    urlPath,
    message,
    stack,
  })
  await writeHtml({
    outPath,
    html,
    minify: false,
  })
  await writeRenderErrorLog(context.config.outDir, file.relPath, html)
  getLogger().error('page render error written', {
    file: file.relPath,
    outPath,
    urlPath,
    message,
  })
  const frontmatter = normalizeFrontmatter({
    title: 'Render Error',
    description: message,
    layout: {
      navMode: 'sidebar',
      showToc: false,
      showFooter: true,
    },
  })
  const renderTimeMs = Number(process.hrtime.bigint() - renderStart) / 1_000_000
  return {
    file,
    frontmatter,
    body: '',
    headConfig: {
      title: `Render Error | ${context.config.siteTitle}`,
      description: message,
    },
    bodyHtml: '',
    html,
    template: frontmatter.template,
    outPath,
    urlPath,
    renderTimeMs,
    navigation: resolvePageNavigation(context.navigation, file, frontmatter),
    pageInfo: {
      relPath: file.relPath,
      urlPath,
      frontmatter,
    },
    outline: [],
    scriptEntrypoints: [],
  }
}

type RenderErrorHtmlInput = {
  relPath: string
  outPath: string
  urlPath: string
  message: string
  stack: string
}

function buildRenderErrorHtml(input: RenderErrorHtmlInput): string {
  const { relPath, outPath, urlPath, message, stack } = input
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Render Error</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        padding: 24px;
        font: 14px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background: #0f172a;
        color: #e2e8f0;
      }
      .card {
        max-width: 1100px;
        margin: 0 auto;
        border: 1px solid #334155;
        border-radius: 12px;
        background: #111827;
        padding: 18px;
      }
      h1 { margin: 0 0 12px; font-size: 20px; }
      .meta { margin: 0 0 14px; color: #94a3b8; }
      pre {
        margin: 0;
        padding: 14px;
        border-radius: 10px;
        background: #020617;
        border: 1px solid #334155;
        overflow: auto;
        white-space: pre-wrap;
      }
      code { color: #f8fafc; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Page Render Error</h1>
      <p class="meta">File: <code>${escapeHtml(relPath)}</code></p>
      <p class="meta">URL: <code>${escapeHtml(urlPath)}</code></p>
      <p class="meta">Output: <code>${escapeHtml(outPath)}</code></p>
      <h2>Message</h2>
      <pre><code>${escapeHtml(message)}</code></pre>
      <h2>Stack</h2>
      <pre><code>${escapeHtml(stack)}</code></pre>
    </main>
  </body>
</html>`
}

async function writeRenderErrorLog(
  outDir: string,
  relPath: string,
  html: string,
): Promise<void> {
  const fileName = `${Date.now()}-${toSafeFilePart(relPath)}.html`
  const targetPath = path.join(outDir, '.ts-ssg', 'errors', fileName)
  const latestPath = path.join(outDir, '.ts-ssg', 'errors', 'latest.html')
  await writeHtml({
    outPath: targetPath,
    html,
    minify: false,
  })
  await writeHtml({
    outPath: latestPath,
    html,
    minify: false,
  })
}

function toSafeFilePart(value: string): string {
  return value.replaceAll(/[^\w.-]+/g, '_')
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function toErrorStack(error: unknown): string {
  if (error instanceof Error && typeof error.stack === 'string') {
    return error.stack
  }
  return String(error)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

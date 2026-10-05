import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { isPlainObject } from '@purestack/ts-util'
import {
  type ContentFile,
  isDefaultFooterFile,
  isDefaultHeaderFile,
  isSharedContentFile,
} from '../discover/content'
import { isContentExt } from '../discover/contentExtensions'
import type { ResolvedContentFile } from '../i18n/content'
import type { GeneratedPage, PureStackPlugin } from './plugin'

const GENERATED_PAGE_FIELDS = ['path', 'source']

/**
 * Runs every plugin's page generator. Each page becomes a content file that
 * carries its source, so the rest of the build treats it like a file. The
 * checks guard plugins written without types.
 */
export async function generatePluginPages(
  plugins: readonly PureStackPlugin[],
  config: SiteConfig,
  files: readonly ResolvedContentFile[],
): Promise<ContentFile[]> {
  const owners = new Map<string, string | undefined>(
    files.map((file) => [toPosixPath(file.relPath), undefined]),
  )
  const generated: ContentFile[] = []
  for (const plugin of plugins) {
    if (!plugin.pages) continue
    let pages: GeneratedPage[]
    try {
      pages = await plugin.pages({ config, files })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Plugin "${plugin.name}" failed in pages: ${message}`, {
        cause: error,
      })
    }
    if (!Array.isArray(pages)) {
      throw new Error(
        `Plugin "${plugin.name}" needs \`pages\` to return a list of pages.`,
      )
    }
    for (const page of pages) {
      const { relPath, source } = readGeneratedPage(plugin.name, page)
      if (owners.has(relPath)) {
        const owner = owners.get(relPath)
        throw new Error(
          owner
            ? `Plugins "${owner}" and "${plugin.name}" both generate "${relPath}".`
            : `Plugin "${plugin.name}" generates "${relPath}", which is already a content file.`,
        )
      }
      owners.set(relPath, plugin.name)
      const osRelPath = relPath.split('/').join(path.sep)
      generated.push({
        absPath: path.join(config.contentDir, osRelPath),
        relPath: osRelPath,
        ext: path.posix.extname(relPath),
        source:
          typeof source === 'function'
            ? readPluginSource(plugin.name, relPath, source)
            : source,
      })
    }
  }
  return generated
}

/** Calls a page's source function, naming the plugin when it fails. */
function readPluginSource(
  pluginName: string,
  relPath: string,
  source: () => string | Promise<string>,
) {
  return async () => {
    let text: string
    try {
      text = await source()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(
        `Plugin "${pluginName}" failed in the source of "${relPath}": ${message}`,
        { cause: error },
      )
    }
    if (typeof text !== 'string') {
      throw new Error(
        `Plugin "${pluginName}" needs the source of "${relPath}" to return a string.`,
      )
    }
    return text
  }
}

function readGeneratedPage(pluginName: string, page: GeneratedPage) {
  const fail = (problem: string): never => {
    throw new Error(`Plugin "${pluginName}" ${problem}`)
  }
  if (!isPlainObject(page)) {
    return fail(
      'needs each generated page to be an object with path and source.',
    )
  }
  for (const field of Object.keys(page)) {
    if (!GENERATED_PAGE_FIELDS.includes(field)) {
      fail(
        `has an unknown generated page field "${field}". Page fields: ${GENERATED_PAGE_FIELDS.join(', ')}.`,
      )
    }
  }
  const { path: pagePath, source } = page
  if (typeof pagePath !== 'string' || !pagePath.trim()) {
    return fail('needs each generated page to have a path.')
  }
  if (typeof source !== 'string' && typeof source !== 'function') {
    return fail(
      `needs the generated page "${pagePath}" to have a source: its text, or a function that returns it.`,
    )
  }
  const relPath = path.posix.normalize(toPosixPath(pagePath))
  if (
    path.posix.isAbsolute(relPath) ||
    path.win32.isAbsolute(pagePath) ||
    relPath === '..' ||
    relPath.startsWith('../')
  ) {
    fail(
      `needs the generated page "${pagePath}" to stay inside the content folder.`,
    )
  }
  if (!isContentExt(path.posix.extname(relPath))) {
    fail(
      `needs the generated page "${pagePath}" to end in .md, .mdx, or .rmdx.`,
    )
  }
  if (isSharedContentFile(relPath)) {
    fail(
      `cannot generate "${pagePath}"; a name starting with _ marks shared content, not a page.`,
    )
  }
  if (isDefaultHeaderFile(relPath) || isDefaultFooterFile(relPath)) {
    fail(
      `cannot generate "${pagePath}"; headers and footers are written as files.`,
    )
  }
  return { relPath, source }
}

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/')
}

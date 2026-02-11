import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { createLogger, getLogger } from 'logpot'

import { buildSite } from './build/site'
import { type DevServerInput, startDevServer } from './dev/server'
import { logError } from './util/logging'

export {
  type BuildHooks,
  type BuildInput,
  type BuildOptions,
  type BuildResult,
  buildSite,
  type MdxOptions,
} from './build/site'
export {
  type PartialSiteConfig as PartialConfig,
  resolveSiteConfig as resolveConfig,
  type SiteConfig,
} from './config/config'
export {
  type DevServerHandle,
  type DevServerInput,
  type DevServerOptions,
  startDevServer,
} from './dev/server'
export {
  createMdxHighlighter,
  DEFAULT_MDX_CODE_LANGS,
  DEFAULT_MDX_CODE_THEMES,
  type MdxCodeHighlighter,
  type MdxCodeLangs,
  type MdxCodeThemes,
} from './mdx/highlight'
export {
  buildNavigation,
  type NavigationConfig,
  type NavigationMode,
  type NavigationSort,
  type NavigationTree,
  type NavItem,
  type PageNavigation,
  resolveNavigationConfig,
  resolvePageNavigation,
} from './navigation/navigation'
export { componentRegistry } from './regor/registry'
export type { TsSsgContext } from './regor/ts-ssg-context'
export {
  type BuiltInSkinName,
  type BuiltInSkinPair,
  type BuiltInSkins,
  builtInSkins,
} from './style/skins'
export { styleBuilder } from './style/styles'
export {
  DEFAULT_THEME_OPTIONS,
  THEME_MODES,
  type ThemeMode,
  type ThemeOptions,
  type ThemeOptionsInput,
  type Themes,
  themes,
} from './style/themeOptions'
export type { ThemePalette } from './style/themePalette'
export {
  defaultTemplates,
  type PageInfo,
  type PageTemplate,
  type PageTemplateInput,
  type PageTemplateMap,
  resolvePageTemplate,
} from './templates/page-templates'

const entryUrl = process.argv[1]
const isDirectRun =
  typeof entryUrl === 'string' &&
  import.meta.url === pathToFileURL(entryUrl).href
if (isDirectRun) {
  runCli().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}

async function runCli() {
  let logger: Awaited<ReturnType<typeof createLogger>> | undefined
  try {
    const cli = parseCliArgs(process.argv.slice(2))
    if (cli.command === 'serve') {
      await startDevServer(cli.input)
      return
    }
    logger = await createLogger()
    await buildSite(cli.input)
  } catch (error) {
    const log = getLogger()
    logError(log, error, 'build failed')
    throw error
  } finally {
    if (logger) {
      await logger.close()
    }
  }
}

type CliCommand = 'build' | 'serve'

interface CliState {
  command: CliCommand
  input: DevServerInput
}

function parseCliArgs(args: string[]): CliState {
  const state: CliState = { command: 'build', input: {} }
  for (const arg of args) {
    if (arg === '--serve' || arg === 'serve' || arg === 'dev') {
      state.command = 'serve'
      continue
    }
  }

  const readValue = (name: string) => {
    const direct = args.find((arg) => arg.startsWith(`${name}=`))
    if (direct) return direct.slice(name.length + 1)
    const index = args.indexOf(name)
    if (index !== -1 && args[index + 1]) return args[index + 1]
    return undefined
  }

  const portRaw = readValue('--port')
  if (portRaw) {
    const port = Number(portRaw)
    if (!Number.isNaN(port)) {
      state.input.port = port
    }
  }

  const host = readValue('--host')
  if (host) {
    state.input.host = host
  }
  const contentDir = readValue('--content')
  if (contentDir) {
    state.input.contentDir = path.resolve(contentDir)
  }

  if (args.includes('--no-watch')) {
    state.input.watch = false
  }
  if (args.includes('--no-reload')) {
    state.input.liveReload = false
  }
  if (args.includes('--clean')) {
    state.input.cleanOutDir = true
  }

  return state
}

import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { componentRegistry, type TsSsgContext } from '@purestack/ts-render'
import {
  type BuiltInSkinName,
  type BuiltInSkinPair,
  type BuiltInSkins,
  builtInSkins,
  DEFAULT_THEME_OPTIONS,
  styleBuilder,
  THEME_MODES,
  type ThemeMode,
  type ThemeOptions,
  type ThemeOptionsInput,
  type ThemePalette,
  type Themes,
  themes,
} from '@purestack/ts-style'
import { logError } from '@purestack/ts-util'
import { createLogger, getLogger } from 'logpot'
import { buildSite } from './build/site'
import { type DevServerInput, startDevServer } from './dev/server'

export {
  builtInSkins,
  componentRegistry,
  DEFAULT_THEME_OPTIONS,
  styleBuilder,
  THEME_MODES,
  themes,
}
export type {
  BuiltInSkinName,
  BuiltInSkinPair,
  BuiltInSkins,
  ThemeMode,
  ThemeOptions,
  ThemeOptionsInput,
  ThemePalette,
  Themes,
  TsSsgContext,
}
export {
  type BuildHooks,
  type BuildInput,
  type BuildResult,
  buildSite,
} from './build/site'
export {
  type AnalyticsConfig,
  type ConsentCategory,
  type ConsentConfig,
  type ConsentScript,
  type ConsentService,
  type Ga4Config,
  type PagefindConfig,
  resolveSiteConfig,
  type SiteConfig,
  type SiteConfigInput,
  type SiteMdxConfig,
} from './config/config'
export {
  type DevServerHandle,
  type DevServerInput,
  type DevServerOptions,
  startDevServer,
} from './dev/server'
export {
  type FrontmatterLayoutOptions,
  type FrontmatterNavOptions,
  normalizeFrontmatter,
  type PageFrontmatter,
  type ParsedFrontmatterSource,
  parseFrontmatterSource,
} from './frontmatter/frontmatter'
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
  type NavItem,
  type NavigationConfig,
  type NavigationMode,
  type NavigationSort,
  type NavigationTree,
  type PageNavigation,
  resolveNavigationConfig,
  resolvePageNavigation,
} from './navigation/navigation'
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
  let keepLoggerOpen = false
  try {
    await createLogger()
    const cli = parseCliArgs(process.argv.slice(2))
    if (cli.command === 'serve') {
      keepLoggerOpen = true
      await startDevServer(cli.input)
      return
    }
    await buildSite(cli.input.build)
  } catch (error) {
    logError(getLogger(), error, 'build failed')
    throw error
  } finally {
    if (!keepLoggerOpen) {
      const logger = getLogger()
      if (logger) {
        await logger.close()
      }
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
    state.input.build ??= {}
    state.input.build.siteConfig ??= {}
    state.input.build.siteConfig.contentDir = path.resolve(contentDir)
  }

  if (args.includes('--no-watch')) {
    state.input.watch = false
  }
  if (args.includes('--no-reload')) {
    state.input.liveReload = false
  }
  if (args.includes('--clean')) {
    state.input.build ??= {}
    state.input.build.options ??= {}
    state.input.build.options.cleanOutDir = true
  }

  return state
}

import fs from 'node:fs'
import path from 'node:path'
import { logError } from '@purestack/ts-util'
import { OutputDirectoryInUseError } from '@purestack/ts-util-node'
import { createLogger, getLogger } from 'logpot'
import { buildSite } from './build/site'
import { SITE_CONFIG_FILENAME } from './config/config'
import {
  findProjectConfig,
  loadProjectConfig,
  withProjectConfig,
} from './config/project-config'
import { type DevServerInput, startDevServer } from './dev/server'

export async function runCli(args: string[]) {
  let loggerCreated = false
  let keepLoggerOpen = false
  try {
    const cli = parseCliArgs(args)
    if (cli.command === 'help') {
      console.log(USAGE)
      return
    }

    await createLogger()
    loggerCreated = true
    if (cli.command === 'serve') {
      await startDevServer({ ...cli.input, configFile: cli.configFile })
      keepLoggerOpen = true
      return
    }
    const loaded = cli.configFile
      ? await loadProjectConfig(cli.configFile)
      : undefined
    await buildSite(withProjectConfig(cli.input.build ?? {}, loaded))
  } catch (error) {
    if (error instanceof CliUsageError) {
      console.error(error.message)
      process.exitCode = error.exitCode
      return
    }
    const hint = SEPARATE_OUTPUT_HINTS[args[0]]
    if (error instanceof OutputDirectoryInUseError && hint) {
      console.error(`${error.message}\n${hint}`)
      process.exitCode = 1
      return
    }
    logError(getLogger(), error, 'build failed')
    throw error
  } finally {
    if (loggerCreated && !keepLoggerOpen) {
      const logger = getLogger()
      if (logger) {
        await logger.close()
      }
    }
  }
}

type CliCommand = 'build' | 'serve' | 'publish' | 'help'

export interface CliState {
  command: CliCommand
  input: DevServerInput
  contentDir?: string
  configFile?: string
}

export function parseCliArgs(args: string[], cwd = process.cwd()): CliState {
  const command = args[0]
  if (
    !command ||
    command === '--help' ||
    command === '-h' ||
    command === 'help'
  ) {
    return { command: 'help', input: {} }
  }
  if (!isCliCommand(command)) {
    throw new CliUsageError(`Unknown command: ${command}\n\n${USAGE}`)
  }

  const options = args.slice(1)
  assertKnownOptions(command, options)

  const state: CliState = { command, input: {} }

  // The last occurrence wins, so arguments appended to a script override it.
  // assertKnownOptions already ensured every value option has a value.
  const readValue = (name: string) => {
    for (let index = options.length - 1; index >= 0; index -= 1) {
      const arg = options[index]
      if (arg.startsWith(`${name}=`)) return arg.slice(name.length + 1)
      if (arg === name) return options[index + 1]
    }
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
    state.contentDir = path.resolve(cwd, contentDir)
    state.input.build ??= {}
    state.input.build.siteConfig ??= {}
    state.input.build.siteConfig.contentDir = state.contentDir
  }

  if (options.includes('--no-watch')) {
    state.input.watch = false
  }
  if (options.includes('--no-reload')) {
    state.input.liveReload = false
  }
  if (options.includes('--full-render')) {
    state.input.fullRender = true
  }
  const buildOptions = () => {
    state.input.build ??= {}
    state.input.build.options ??= {}
    return state.input.build.options
  }
  const outName = readValue('--out')
  if (outName) buildOptions().outName = outName
  if (options.includes('--clean')) buildOptions().cleanOutDir = true
  if (options.includes('--no-cache')) buildOptions().cache = false
  if (command === 'publish') {
    state.input.build ??= {}
    state.input.build.publish = { enabled: true }
  }

  assertContentConfig(state.contentDir)
  state.configFile = findProjectConfig(state.contentDir)
  return state
}

function isCliCommand(command: string): command is Exclude<CliCommand, 'help'> {
  return command === 'build' || command === 'serve' || command === 'publish'
}

function assertKnownOptions(
  command: Exclude<CliCommand, 'help'>,
  args: string[],
) {
  const valueOptions = new Set(resolveValueOptions(command))
  const flagOptions = new Set(resolveFlagOptions(command))
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (!arg.startsWith('--')) {
      throw new CliUsageError(`Unexpected argument: ${arg}\n\n${USAGE}`)
    }

    const [name] = arg.split('=', 1)
    if (valueOptions.has(name)) {
      // An empty `--out=` must not fall back to the default output.
      const value = arg.includes('=')
        ? arg.slice(name.length + 1)
        : args[++index]
      if (!value || value.startsWith('--')) {
        throw new CliUsageError(`${name} requires a value.\n\n${USAGE}`)
      }
      continue
    }

    if (flagOptions.has(name)) continue
    throw new CliUsageError(`Unknown option: ${name}\n\n${USAGE}`)
  }
}

function resolveFlagOptions(command: Exclude<CliCommand, 'help'>) {
  if (command === 'build') return ['--clean', '--no-cache']
  if (command === 'serve')
    return [
      '--clean',
      '--no-cache',
      '--no-watch',
      '--no-reload',
      '--full-render',
    ]
  return ['--no-cache']
}

function resolveValueOptions(command: Exclude<CliCommand, 'help'>) {
  if (command === 'build') return ['--content', '--out']
  if (command === 'serve') return ['--content', '--out', '--host', '--port']
  return ['--content']
}

function assertContentConfig(
  contentDir: string | undefined,
): asserts contentDir is string {
  if (!contentDir) {
    throw new CliUsageError(
      `Missing required --content <dir> option.\n\n${USAGE}`,
    )
  }
  const configPath = path.join(contentDir, SITE_CONFIG_FILENAME)
  if (!fs.existsSync(configPath)) {
    throw new CliUsageError(
      `Missing required ${SITE_CONFIG_FILENAME}: ${configPath}`,
    )
  }
}

class CliUsageError extends Error {
  constructor(
    message: string,
    readonly exitCode = 1,
  ) {
    super(message)
  }
}

const SEPARATE_OUTPUT_HINTS: Partial<Record<string, string>> = {
  build: 'To build beside it, add --out <name>, such as --out 2.',
  serve:
    'To run a second server beside it, add --out <name> and a free --port, such as --out 2 --port 4174.',
}

const USAGE = `Usage:
  purestack --version
  purestack build --content <dir> [--out <name>] [--clean] [--no-cache]
  purestack serve --content <dir> [--out <name>] [--host <host>] [--port <port>] [--clean] [--no-cache] [--no-watch] [--no-reload] [--full-render]
  purestack publish --content <dir> [--no-cache]

Commands:
  build     Build a content directory into its configured outDir.
  serve     Start the dev server; --full-render builds all pages once at startup.
  publish   Clean and build a publish artifact using the configured publishDir.

Options:
  --out <name>    Use <outDir>-<name> instead of outDir, such as dist/site-2 for a second server.
  --clean         Empty the output directory and ignore its incremental manifest.
  --no-cache      Skip persistent plugin caches outside the output directory.
  --help, -h      Print this usage summary.
  --version, -v   Print the installed PureStack version.`

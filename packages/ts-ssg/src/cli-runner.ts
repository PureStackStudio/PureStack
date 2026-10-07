import fs from 'node:fs'
import path from 'node:path'
import { logError } from '@purestack/ts-util'
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
      keepLoggerOpen = true
      await startDevServer({ ...cli.input, configFile: cli.configFile })
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

interface CliState {
  command: CliCommand
  input: DevServerInput
  contentDir?: string
  configFile?: string
}

function parseCliArgs(args: string[]): CliState {
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

  const readValue = (name: string) => {
    const direct = options.find((arg) => arg.startsWith(`${name}=`))
    if (direct) return direct.slice(name.length + 1)
    const index = options.indexOf(name)
    if (
      index !== -1 &&
      options[index + 1] &&
      !options[index + 1].startsWith('--')
    ) {
      return options[index + 1]
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
    state.contentDir = path.resolve(contentDir)
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
  if (options.includes('--clean')) {
    state.input.build ??= {}
    state.input.build.options ??= {}
    state.input.build.options.cleanOutDir = true
  }
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
      if (!arg.includes('=')) {
        index += 1
        if (!args[index] || args[index].startsWith('--')) {
          throw new CliUsageError(`${name} requires a value.\n\n${USAGE}`)
        }
      }
      continue
    }

    if (flagOptions.has(name)) continue
    throw new CliUsageError(`Unknown option: ${name}\n\n${USAGE}`)
  }
}

function resolveFlagOptions(command: Exclude<CliCommand, 'help'>) {
  if (command === 'build') return ['--clean']
  if (command === 'serve')
    return ['--clean', '--no-watch', '--no-reload', '--full-render']
  return []
}

function resolveValueOptions(command: Exclude<CliCommand, 'help'>) {
  if (command === 'serve') return ['--content', '--host', '--port']
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

const USAGE = `Usage:
  purestack --version
  purestack build --content <dir> [--clean]
  purestack serve --content <dir> [--host <host>] [--port <port>] [--clean] [--no-watch] [--no-reload] [--full-render]
  purestack publish --content <dir>

Commands:
  build     Build a content directory into its configured outDir.
  serve     Start the dev server; --full-render builds all pages once at startup.
  publish   Clean and build a publish artifact using the configured publishDir.

Options:
  --help, -h      Print this usage summary.
  --version, -v   Print the installed PureStack version.`

#!/usr/bin/env node
import path from 'node:path'
import { logError } from '@purestack/ts-util'
import { createLogger, getLogger } from 'logpot'
import { buildSite } from './build/site'
import { type DevServerInput, startDevServer } from './dev/server'

runCli(process.argv.slice(2)).catch((error) => {
  console.error(error)
  process.exitCode = 1
})

async function runCli(args: string[]) {
  let keepLoggerOpen = false
  try {
    await createLogger()
    const cli = parseCliArgs(args)
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

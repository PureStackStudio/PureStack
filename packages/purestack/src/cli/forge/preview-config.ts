import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { type DevServerInput, parseCliArgs } from '@purestack/ts-ssg'

/** Reuse the site's dev command while Forge owns output and process lifetime. */
export async function readPreviewConfig(
  directory: string,
  outDir: string,
): Promise<DevServerInput> {
  const manifest: unknown = JSON.parse(
    await readFile(path.join(directory, 'package.json'), 'utf8'),
  )
  if (
    !manifest ||
    typeof manifest !== 'object' ||
    !('scripts' in manifest) ||
    !manifest.scripts ||
    typeof manifest.scripts !== 'object' ||
    !('dev' in manifest.scripts) ||
    typeof manifest.scripts.dev !== 'string'
  )
    throw new Error(
      'The generated project must provide a dev script for live preview.',
    )

  const [executable, ...args] = splitDevCommand(manifest.scripts.dev)
  if (executable !== 'purestack' || args[0] !== 'serve')
    throw new Error(
      'Live preview requires a dev script starting with purestack serve.',
    )
  const cli = parseCliArgs(args, directory)
  return {
    ...cli.input,
    logLevel: 'WARN',
    handleSignals: false,
    failOnInitialBuildError: true,
    configFile: cli.configFile,
    build: {
      ...cli.input.build,
      siteConfig: {
        ...cli.input.build?.siteConfig,
        rootDir: directory,
        outDir,
      },
      options: { ...cli.input.build?.options, cache: false },
    },
  }
}

/** Read literal arguments only; do not execute shell expressions from scripts. */
function splitDevCommand(command: string): string[] {
  const args: string[] = []
  let value = ''
  let quote = ''
  let started = false
  for (const character of command) {
    if (quote) {
      if (character === quote) quote = ''
      else value += character
    } else if (character === '"' || character === "'") {
      quote = character
      started = true
    } else if (/\s/.test(character)) {
      if (started) args.push(value)
      value = ''
      started = false
    } else {
      if (/[&|;<>`$]/.test(character))
        throw new Error(
          'Live preview requires a literal purestack serve command without shell expressions.',
        )
      value += character
      started = true
    }
  }
  if (quote) throw new Error('The dev script contains an unclosed quote.')
  if (started) args.push(value)
  return args
}

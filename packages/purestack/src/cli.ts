#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { runApplication } from './cli/application'
import { invocationDirectory } from './cli/invocation'

async function main() {
  if (process.send && process.argv[2] === '__forge-preview') {
    const { runPreviewProcess } = await import('./cli/forge/preview-process')
    await runPreviewProcess(process.argv[3], process.argv[4])
    return
  }
  process.chdir(invocationDirectory(process.cwd(), process.env))
  const { version } = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
  )
  const status = await runApplication(process.argv.slice(2), {
    version,
    cwd: process.cwd(),
    packageRoot: fileURLToPath(new URL('..', import.meta.url)).replace(
      /[\\/]$/,
      '',
    ),
  })
  if (status) process.exitCode = status
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

#!/usr/bin/env node
import { readFileSync } from 'node:fs'

async function main() {
  const args = process.argv.slice(2)
  if (args[0] === '--version' || args[0] === '-v') {
    const { version } = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    )
    console.log(version)
    return
  }

  const { runCli } = await import('@purestack/ts-ssg')
  await runCli(args)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

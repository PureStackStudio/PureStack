#!/usr/bin/env node
import { runCli } from '@purestack/ts-ssg'

runCli(process.argv.slice(2)).catch((error) => {
  console.error(error)
  process.exitCode = 1
})

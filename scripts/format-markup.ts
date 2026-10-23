import { runFormatCli } from '../packages/purestack/src/cli/format'

try {
  process.exitCode = await runFormatCli(process.argv.slice(2), process.cwd(), {
    exclude: [
      'packages/ts-page-scripts/src/embed',
      'packages/ts-svg-icons/src',
    ],
  })
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}

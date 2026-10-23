import path from 'node:path'
import { parseArgs } from 'node:util'
import {
  type FormatFilesOptions,
  formatFiles,
} from '@purestack/ts-format/files'

export const formatHelp = `Usage: purestack format [files or directories] [options]

Format PureStack component markup in .mdx/.rmdx and html/svg templates in TypeScript.
Markdown prose, frontmatter, and TypeScript outside those templates stay untouched.
Defaults to checking the current folder. Git-ignored and generated directories are skipped.

  --write       Save formatted files
  --check       Check without writing (default); exit with 1 if changes are needed
  -h, --help    Show help

Examples:
  purestack format content --write
  purestack format content --check`

export async function runFormatCli(
  args: string[],
  cwd: string,
  options: FormatFilesOptions = {},
) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      write: { type: 'boolean', default: false },
      check: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })
  if (values.help) {
    console.log(formatHelp)
    return 0
  }
  if (values.write && values.check)
    throw new Error('Choose either --write or --check.')
  const result = await formatFiles(positionals.length ? positionals : ['.'], {
    ...options,
    cwd,
    write: values.write,
  })
  for (const file of result.changed) {
    console.log(
      `${values.write ? 'Formatted' : 'Needs formatting:'} ${path.relative(cwd, file)}`,
    )
  }
  console.log(
    `Checked ${result.checked} files; ${result.changed.length} ${values.write ? 'formatted' : 'need formatting'}.`,
  )
  if (result.errors.length) {
    console.error(
      `\nFormatting failed for ${new Set(result.errors.map((error) => error.filePath)).size} files:`,
    )
    for (const error of result.errors)
      console.error(`${path.relative(cwd, error.filePath)}: ${error.message}`)
  }
  return result.errors.length || (!values.write && result.changed.length)
    ? 1
    : 0
}

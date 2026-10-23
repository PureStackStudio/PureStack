import { execFile } from 'node:child_process'
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { formatSource } from './index'
import type { FormatOptions } from './source'

const exec = promisify(execFile)
const extensions = /\.(?:[cm]?ts|mdx|rmdx)$/i
const ignoredDirectories = new Set([
  '.git',
  '.yarn',
  '.tmp',
  '.ts-ssg',
  '.cache',
  'node_modules',
  'dist',
  'out',
  'coverage',
  'artifacts',
])

export interface FormatFilesOptions
  extends Omit<FormatOptions, 'filePath' | 'language' | 'onlyWithinRange'> {
  cwd?: string
  write?: boolean
  /** Files or directories to omit, relative to cwd. */
  exclude?: readonly string[]
}

export interface FormatFileError {
  filePath: string
  message: string
}

/** Discover source files, honor Git ignores in repositories, and collect all failures. */
export async function formatFiles(
  inputs: readonly string[] = ['.'],
  options: FormatFilesOptions = {},
) {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const excluded = (options.exclude ?? []).map((entry) =>
    path.resolve(cwd, entry),
  )
  const files = new Set<string>()
  const errors: FormatFileError[] = []
  const changed: string[] = []

  function isExcluded(file: string) {
    return (
      path
        .relative(cwd, file)
        .split(path.sep)
        .some((part) => ignoredDirectories.has(part)) ||
      excluded.some(
        (entry) => file === entry || file.startsWith(`${entry}${path.sep}`),
      )
    )
  }

  function addFile(file: string) {
    if (extensions.test(file) && !isExcluded(file)) files.add(file)
  }

  async function walk(directory: string) {
    if (isExcluded(directory)) return
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) await walk(file)
      else if (entry.isFile()) addFile(file)
    }
  }

  for (const input of inputs) {
    const target = path.resolve(cwd, input)
    try {
      const entry = await lstat(target)
      if (entry.isSymbolicLink()) continue
      if (entry.isFile()) {
        addFile(target)
        continue
      }
      if (!entry.isDirectory() || isExcluded(target)) continue
      let gitFiles: string[] | undefined
      try {
        const { stdout: root } = await exec('git', [
          '-C',
          target,
          'rev-parse',
          '--show-toplevel',
        ])
        const repository = root.trim()
        const relative =
          path.relative(repository, target).split(path.sep).join('/') || '.'
        const { stdout } = await exec(
          'git',
          [
            '-C',
            repository,
            'ls-files',
            '--cached',
            '--others',
            '--exclude-standard',
            '-z',
            '--',
            relative,
          ],
          { maxBuffer: 32 * 1024 * 1024 },
        )
        gitFiles = stdout
          .split('\0')
          .filter(Boolean)
          .map((file) => path.resolve(repository, file))
      } catch {
        // Git is optional; a standalone project still has a formatter.
      }
      if (gitFiles) {
        for (const file of gitFiles) addFile(file)
      } else await walk(target)
    } catch (error) {
      errors.push({
        filePath: target,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const filePath of [...files].sort()) {
    try {
      // Git may still list deleted files and symlinks. Never follow those into another directory.
      const entry = await lstat(filePath).catch(() => undefined)
      if (!entry?.isFile() || entry.isSymbolicLink()) continue
      const text = await readFile(filePath, 'utf8')
      const result = await formatSource(text, { ...options, filePath })
      if (result.diagnostics.length) {
        for (const diagnostic of result.diagnostics)
          errors.push({ filePath, message: diagnostic.message })
        continue
      }
      if (!result.changed) continue
      if (options.write) {
        if ((await readFile(filePath, 'utf8')) !== text)
          throw new Error(
            'File changed during formatting; skipped to preserve your edits.',
          )
        await writeFile(filePath, result.code, 'utf8')
      }
      changed.push(filePath)
    } catch (error) {
      errors.push({
        filePath,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return { checked: files.size, changed, errors }
}

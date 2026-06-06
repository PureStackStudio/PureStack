import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const ignoredDirectories = new Set([
  '.git',
  '.pnp',
  '.puregate',
  '.vs',
  '.yarn',
  'artifacts',
  'bin',
  'coverage',
  'dist',
  'node_modules',
  'obj',
])
const crlf = Buffer.from('\r\n')

function isGitRepository(directory) {
  return readdirSync(directory, { withFileTypes: true }).some(
    (entry) => entry.name === '.git' && (entry.isDirectory() || entry.isFile()),
  )
}

function isTextContent(content) {
  for (const byte of content.subarray(0, 8000)) {
    if (byte === 0) {
      return false
    }
  }

  return true
}

function* findGitRepositories(directory) {
  if (isGitRepository(directory)) {
    yield directory
  }

  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        yield* findGitRepositories(fullPath)
      }
    }
  }
}

function listTrackedFiles(repository) {
  return execFileSync('git', ['-C', repository, 'ls-files', '-z'], {
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
    .map((file) => path.join(repository, file))
}

const files = [...findGitRepositories(root)].flatMap(listTrackedFiles)
let checkedFileCount = 0

for (const file of files) {
  const content = readFileSync(file)

  if (!isTextContent(content)) {
    continue
  }

  checkedFileCount += 1

  const crlfIndex = content.indexOf(crlf)

  if (crlfIndex !== -1) {
    const line = content.subarray(0, crlfIndex).reduce((count, byte) => {
      return byte === 0x0a ? count + 1 : count
    }, 1)

    console.error(`CRLF found in ${path.relative(root, file)}:${line}`)
    process.exit(1)
  }
}

console.log(`Checked ${checkedFileCount} text files. All use LF line endings.`)

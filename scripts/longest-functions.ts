import fs from 'node:fs/promises'
import path from 'node:path'

interface CliArgs {
  root: string
  limit: number
  includeStyles: boolean
  json: boolean
}

interface FunctionEntry {
  name: string
  rowCount: number
  file: string
  startLine: number
  endLine: number
}

interface FunctionSpan {
  startLine: number
  endLine: number
}

const CONTROL_FLOW_NAMES = new Set([
  'if',
  'for',
  'while',
  'switch',
  'catch',
  'constructor',
])

const FUNCTION_START_PATTERNS: RegExp[] = [
  /^\s*export\s+async\s+function\s+([A-Za-z0-9_]+)\s*\(/,
  /^\s*export\s+function\s+([A-Za-z0-9_]+)\s*\(/,
  /^\s*async\s+function\s+([A-Za-z0-9_]+)\s*\(/,
  /^\s*function\s+([A-Za-z0-9_]+)\s*\(/,
  /^\s*(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/,
  /^\s*([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*:\s*[^=]+=>\s*\{/,
  /^\s*([A-Za-z0-9_]+)\s*\([^)]*\)\s*:\s*[^{]+\{/,
  /^\s*([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/,
]

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const cwd = process.cwd()
  const rootDir = path.resolve(cwd, args.root)
  const files = await findTsFiles(rootDir)
  const functions: FunctionEntry[] = []

  for (const filePath of files) {
    const text = await fs.readFile(filePath, 'utf8')
    const lines = text.split(/\r?\n/)
    functions.push(...extractFunctions(lines, filePath, cwd))
  }

  const filtered = functions
    .filter((entry) => shouldKeepEntry(entry, args.includeStyles))
    .sort(
      (left, right) =>
        right.rowCount - left.rowCount || left.name.localeCompare(right.name),
    )
    .slice(0, args.limit)

  if (args.json) {
    process.stdout.write(`${JSON.stringify(filtered, null, 2)}\n`)
    return
  }

  process.stdout.write(
    'rows  function                               file:row\n',
  )
  process.stdout.write(
    '----  ------------------------------------   ------------------------------\n',
  )
  for (const entry of filtered) {
    const line = String(entry.rowCount).padStart(4, ' ')
    const name = entry.name.padEnd(36, ' ')
    process.stdout.write(`${line}  ${name}  ${entry.file}:${entry.startLine}\n`)
  }
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    root: 'packages/ts-ssg/src',
    limit: 40,
    includeStyles: false,
    json: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--root' && argv[i + 1]) {
      args.root = argv[i + 1]
      i += 1
      continue
    }
    if (token === '--limit' && argv[i + 1]) {
      const parsed = Number(argv[i + 1])
      if (Number.isFinite(parsed) && parsed > 0) {
        args.limit = Math.floor(parsed)
      }
      i += 1
      continue
    }
    if (token === '--include-styles') {
      args.includeStyles = true
      continue
    }
    if (token === '--json') {
      args.json = true
    }
  }

  return args
}

async function findTsFiles(rootDir: string): Promise<string[]> {
  const found: string[] = []
  const queue: string[] = [rootDir]

  while (queue.length > 0) {
    const current = queue.pop()
    if (!current) break
    const entries = await fs.readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      const absPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        queue.push(absPath)
        continue
      }
      if (!entry.isFile()) continue
      if (!absPath.endsWith('.ts')) continue
      if (absPath.endsWith('.d.ts')) continue
      found.push(absPath)
    }
  }

  return found
}

function extractFunctions(
  lines: string[],
  filePath: string,
  cwd: string,
): FunctionEntry[] {
  const items: FunctionEntry[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const name = matchFunctionName(line)
    if (!name || CONTROL_FLOW_NAMES.has(name)) {
      i += 1
      continue
    }

    const span = findFunctionSpan(lines, i)
    if (!span) {
      i += 1
      continue
    }

    items.push({
      name,
      rowCount: span.endLine - span.startLine + 1,
      file: path.relative(cwd, filePath).replaceAll('\\', '/'),
      startLine: span.startLine,
      endLine: span.endLine,
    })
    i = span.endLine
  }

  return items
}

function matchFunctionName(line: string): string | null {
  for (const pattern of FUNCTION_START_PATTERNS) {
    const match = line.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

function findFunctionSpan(
  lines: string[],
  startIndex: number,
): FunctionSpan | null {
  let depth = 0
  let foundOpen = false
  let endIndex = startIndex

  for (let lineIndex = startIndex; lineIndex < lines.length; lineIndex += 1) {
    const text = lines[lineIndex]
    for (const ch of text) {
      if (ch === '{') {
        depth += 1
        foundOpen = true
      } else if (ch === '}') {
        if (!foundOpen) continue
        depth -= 1
        if (depth === 0) {
          endIndex = lineIndex
          return {
            startLine: startIndex + 1,
            endLine: endIndex + 1,
          }
        }
      }
    }
  }

  return foundOpen
    ? {
        startLine: startIndex + 1,
        endLine: endIndex + 1,
      }
    : null
}

function shouldKeepEntry(
  _entry: FunctionEntry,
  includeStyles: boolean,
): boolean {
  if (includeStyles) return true
  // const name = entry.name.toLowerCase()
  //if (name.includes('styles')) return false
  return true
}

void main()

import { spawn } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import path from 'node:path'

export interface ProcessOptions {
  /** Collect stdout and stderr instead of streaming them to the terminal. */
  capture?: boolean
  signal?: AbortSignal
}
export interface RunProcessOptions extends ProcessOptions {
  /** Names the command in failures, e.g. `npm install` rather than the Node launcher. */
  label?: string
}

export async function runProcess(
  command: string,
  args: string[],
  cwd: string,
  {
    capture = false,
    signal,
    label = [path.basename(command), args[0]].filter(Boolean).join(' '),
  }: RunProcessOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      shell: false,
      signal,
    })
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString()
    })
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })
    child.once('error', reject)
    child.once('close', (code, signal) => {
      if (code === 0) resolve(stdout)
      else
        reject(
          new Error(
            `${label} failed (${signal ?? code}).${stderr ? `\n${stderr.trim()}` : ''}`,
          ),
        )
    })
  })
}

export function findNpmCli(): string | undefined {
  // npm_execpath may point to Yarn or pnpm. Only reuse it when it is npm's CLI.
  const npmExecPath = process.env.npm_execpath
  const nodeDirectory = path.dirname(process.execPath)
  const candidates = [
    npmExecPath && /npm-cli\.js$/i.test(npmExecPath) ? npmExecPath : undefined,
    path.join(nodeDirectory, 'node_modules/npm/bin/npm-cli.js'),
    path.resolve(nodeDirectory, '../lib/node_modules/npm/bin/npm-cli.js'),
  ]
  const npmCli = candidates.find((file) => file && existsSync(file))
  if (npmCli) return npmCli
  if (process.platform !== 'win32') {
    for (const directory of (process.env.PATH ?? '').split(path.delimiter)) {
      if (!directory) continue
      const executable = path.join(directory, 'npm')
      if (!existsSync(executable)) continue
      const target = realpathSync(executable)
      if (/npm-cli\.js$/i.test(target)) return target
    }
  }
  return undefined
}

export function runNpm(
  args: string[],
  cwd: string,
  options: ProcessOptions = {},
) {
  const run = { ...options, label: ['npm', args[0]].filter(Boolean).join(' ') }
  const npmCli = findNpmCli()
  if (npmCli) return runProcess(process.execPath, [npmCli, ...args], cwd, run)
  if (process.platform === 'win32')
    throw new Error('Cannot locate npm. Install Node.js with npm, then retry.')
  return runProcess('npm', args, cwd, run)
}

import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CreateSiteResult } from '../init/create-site'
import { nextCommands, progressTasks } from './creation'
import { CreationView } from './terminal/creation-view'
import { width } from './terminal/layout'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('creation output', () => {
  it('prints progress and failures without terminal escapes when redirected', async () => {
    let text = ''
    const task = progressTasks({ write: (chunk) => (text += chunk) })
    expect(await task('Create project files', async () => 42)).toBe(42)
    await expect(
      task('Install dependencies', async () => {
        throw new Error('Installation failed')
      }),
    ).rejects.toThrow('Installation failed')
    expect(text).toContain('→ Create project files\n')
    expect(text).toContain('✓ Create project files\n')
    expect(text).toContain('✗ Install dependencies\n')
    expect(text).not.toContain(String.fromCharCode(27))
  })

  it('animates slow terminal tasks and stops the animation on completion', async () => {
    vi.useFakeTimers()
    vi.stubEnv('TERM', 'xterm-256color')
    try {
      let text = ''
      let finish!: () => void
      const task = progressTasks({
        isTTY: true,
        columns: 80,
        write: (chunk) => (text += chunk),
      })
      const running = task(
        'Install dependencies',
        () => new Promise<void>((resolve) => (finish = resolve)),
      )
      const initial = text
      await vi.advanceTimersByTimeAsync(180)
      expect(text.length).toBeGreaterThan(initial.length)
      finish()
      await running
      expect(stripVTControlCharacters(text)).toContain(
        '✓ Install dependencies\n',
      )
      const completed = text
      await vi.advanceTimersByTimeAsync(180)
      expect(text).toBe(completed)
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it('uses colored frames while leaving complete commands on their own lines', () => {
    vi.stubEnv('NO_COLOR', undefined)
    vi.stubEnv('FORCE_COLOR', '1')
    vi.stubEnv('TERM', 'xterm-256color')
    const view = new CreationView({ isTTY: true, columns: 80 })
    const commands = ['cd "my site"', 'npm install', 'npm run dev']
    const text = view.complete(
      {
        directory: path.resolve('sites/my site'),
        template: '@purestack/template-starter@1.0.0',
        version: '1.1.19',
        packageManager: 'npm',
        installed: false,
        git: 'skipped',
        failures: [],
      },
      commands,
    )
    expect(text).toContain(`${String.fromCharCode(27)}[1;38;2;119;224;169m`)
    const plain = stripVTControlCharacters(text)
    expect(plain).toContain('╭──')
    expect(plain).toContain('✓ YOUR PURESTACK SITE IS READY')
    expect(plain).toContain('┌─ NEXT STEPS')
    for (const command of commands)
      expect(plain.split('\n')).toContain(`  ${command}`)
  })

  it('wraps frame contents to fit narrow terminals and honors NO_COLOR', () => {
    vi.stubEnv('NO_COLOR', '')
    vi.stubEnv('TERM', 'xterm-256color')
    const view = new CreationView({ isTTY: true, columns: 32 })
    const text = view.start(
      'A long website title with 中文 characters',
      path.resolve('sites/a-very-long-directory-name'),
      '1.1.19',
    )
    expect(text).not.toContain(String.fromCharCode(27))
    for (const line of text.split('\n')) expect(width(line)).toBeLessThan(32)
    expect(text).toContain('╰──')
    const redirected = new CreationView({ isTTY: false })
    vi.stubEnv('NO_COLOR', undefined)
    expect(redirected.progress('Create files', '✓', 'success')).not.toContain(
      String.fromCharCode(27),
    )
  })

  it('gives commands relative to the caller and includes only necessary setup', () => {
    const cwd = path.resolve('sites')
    const result: CreateSiteResult = {
      directory: path.join(cwd, 'my-site'),
      template: 'starter@1.0.0',
      version: '1.1.19',
      packageManager: 'npm',
      installed: false,
      git: 'skipped',
      failures: [],
    }
    expect(nextCommands(result, cwd)).toEqual([
      'cd my-site',
      'npm install',
      'npm run dev',
    ])
    expect(
      nextCommands(
        { ...result, directory: path.join(cwd, 'my site'), installed: true },
        cwd,
      ),
    ).toEqual([
      process.platform === 'win32' ? 'cd "my site"' : "cd 'my site'",
      'npm run dev',
    ])
    expect(nextCommands({ ...result, git: 'failed' }, cwd)).toContain(
      'git init',
    )
    expect(nextCommands({ ...result, packageManager: 'yarn' }, cwd)).toEqual([
      'cd my-site',
      'yarn install',
      'yarn dev',
    ])
  })
})

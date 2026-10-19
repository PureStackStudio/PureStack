import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { Highlighter } from 'shiki'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMdxHighlighter } from './shiki'

const mocks = vi.hoisted(() => ({ directory: '', create: vi.fn() }))
vi.mock('shiki', () => ({ createHighlighter: mocks.create }))
vi.mock('node:os', async (original) => {
  const module = await original<typeof import('node:os')>()
  mocks.directory = module.tmpdir()
  return {
    ...module,
    default: { ...module, tmpdir: () => mocks.directory },
  }
})

describe('Shiki cache integration', () => {
  let directory: string
  let systemTemporary: string

  beforeEach(async () => {
    systemTemporary = os.tmpdir()
    directory = await fs.mkdtemp(
      path.join(systemTemporary, 'purestack-shiki-test-'),
    )
    mocks.directory = directory
    mocks.create.mockReset()
    mocks.create.mockResolvedValue({
      codeToHtml: (code: string) => `<pre>${code}</pre>`,
    })
  })

  afterEach(async () => {
    mocks.directory = systemTemporary
    await fs.rm(directory, { recursive: true, force: true })
  })

  it('loads Shiki once on a cold miss and reuses disk output without loading it in a new instance', async () => {
    const cold = await createMdxHighlighter()
    expect(mocks.create).not.toHaveBeenCalled()
    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        cold.codeToHtml('const answer = 42', 'ts'),
      ),
    )
    expect(results).toEqual(Array(10).fill('<pre>const answer = 42</pre>'))
    expect(mocks.create).toHaveBeenCalledTimes(1)
    await cold.flush?.()
    mocks.create.mockRejectedValue(
      new Error('Warm builds must not initialize Shiki'),
    )
    const warm = await createMdxHighlighter()
    expect(await warm.codeToHtml('const answer = 42', 'typescript')).toBe(
      results[0],
    )
    expect(mocks.create).toHaveBeenCalledTimes(1)
    await warm.flush?.()
  })

  it('bypasses persistence for disabled caching and custom grammars', async () => {
    const uncached = await createMdxHighlighter(undefined, undefined, {
      cache: false,
    })
    expect(await uncached.codeToHtml('uncached', 'ts')).toBe(
      '<pre>uncached</pre>',
    )
    const custom = await createMdxHighlighter(undefined, undefined, {
      create: () =>
        ({
          codeToHtml: () => '<pre>custom grammar</pre>',
        }) as unknown as Highlighter,
    })
    expect(await custom.codeToHtml('custom', 'unknown-grammar')).toBe(
      '<pre>custom grammar</pre>',
    )
    expect(await fs.readdir(directory)).toEqual([])
  })
})

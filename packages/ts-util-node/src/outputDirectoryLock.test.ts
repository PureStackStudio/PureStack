import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  OutputDirectoryInUseError,
  OutputDirectoryLocks,
} from './outputDirectoryLock'

describe('OutputDirectoryLocks', () => {
  let root: string
  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'purestack-output-lock-'))
  })
  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })

  it('reports a directory held by another owner', async () => {
    const first = new OutputDirectoryLocks()
    const second = new OutputDirectoryLocks()
    try {
      const output = await first.acquire(path.join(root, 'site'))
      await expect(second.acquire(output)).rejects.toBeInstanceOf(
        OutputDirectoryInUseError,
      )
    } finally {
      await Promise.all([first.release(), second.release()])
    }
  })
})

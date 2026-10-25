import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  claimOutputDirectory,
  emptyOutputDirectory,
  OUTPUT_MARKER_FILENAME,
} from './outputDirectoryOwnership'

describe('output directory ownership', () => {
  let root: string
  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'purestack-output-'))
  })
  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })

  it('creates and marks a new directory', async () => {
    const output = path.join(root, 'dist', 'site')
    await claimOutputDirectory(output)
    expect(await fs.readdir(output)).toEqual([OUTPUT_MARKER_FILENAME])
  })

  it('marks an existing empty directory', async () => {
    await claimOutputDirectory(root)
    expect(await fs.readdir(root)).toEqual([OUTPUT_MARKER_FILENAME])
  })

  it('refuses a directory it does not own and leaves its files alone', async () => {
    await fs.writeFile(path.join(root, 'notes.txt'), 'mine')
    await expect(claimOutputDirectory(root)).rejects.toThrow(
      'is not a PureStack output directory',
    )
    await expect(emptyOutputDirectory(root)).rejects.toThrow(
      'is not a PureStack output directory',
    )
    expect(await fs.readdir(root)).toEqual(['notes.txt'])
  })

  it('empties an owned directory but keeps its marker', async () => {
    await claimOutputDirectory(root)
    await fs.mkdir(path.join(root, 'nested'))
    await fs.writeFile(path.join(root, 'nested', 'page.html'), 'old')
    await fs.writeFile(path.join(root, 'index.html'), 'old')
    await emptyOutputDirectory(root)
    expect(await fs.readdir(root)).toEqual([OUTPUT_MARKER_FILENAME])
  })
})

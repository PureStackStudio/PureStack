import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { parseCliArgs } from './cli-runner'
import { SITE_CONFIG_FILENAME } from './config/config'

describe('parseCliArgs', () => {
  let root: string
  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'purestack-cli-'))
    await fs.writeFile(path.join(root, SITE_CONFIG_FILENAME), '{}')
  })
  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })

  it.each([
    ['serve', ['--out', '2']],
    ['serve', ['--out=2']],
    ['build', ['--out', '2', '--clean']],
  ])('reads %s %j as an output name', (command, out) => {
    const cli = parseCliArgs([command, '--content', root, ...out], root)
    expect(cli.input.build?.options?.outName).toBe('2')
  })

  it.each([
    ['--out=', '--clean'],
    ['--out', '--clean'],
    ['--clean', '--out'],
  ])('refuses %s %s instead of using the default output', (...flags) => {
    expect(() =>
      parseCliArgs(['build', '--content', root, ...flags], root),
    ).toThrow('--out requires a value.')
  })

  it('lets the last occurrence of an option win', () => {
    const cli = parseCliArgs(
      [
        'serve',
        '--content',
        root,
        '--port=4700',
        '--out',
        'a',
        '--port',
        '4701',
        '--out=b',
      ],
      root,
    )
    expect(cli.input.port).toBe(4701)
    expect(cli.input.build?.options?.outName).toBe('b')
  })

  it('keeps --out away from publish', () => {
    expect(() =>
      parseCliArgs(['publish', '--content', root, '--out', '2'], root),
    ).toThrow('Unknown option: --out')
  })
})

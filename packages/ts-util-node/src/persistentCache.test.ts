import { fork } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PersistentCache, type PersistentCacheOptions } from './index'

describe('PersistentCache', () => {
  let directory: string
  beforeEach(async () => {
    directory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'purestack-persistent-cache-'),
    )
  })
  afterEach(async () => {
    vi.restoreAllMocks()
    await fs.rm(directory, { recursive: true, force: true })
  })

  function cache<T>(options: Partial<PersistentCacheOptions<T>> = {}) {
    return new PersistentCache<T>({
      directory,
      namespace: 'test',
      version: '1',
      flushIntervalMs: 0,
      ...options,
    })
  }
  async function files(root = directory): Promise<string[]> {
    const entries = await fs.readdir(root, { withFileTypes: true })
    return (
      await Promise.all(
        entries.map((entry) => {
          const file = path.join(root, entry.name)
          return entry.isDirectory() ? files(file) : [file]
        }),
      )
    ).flat()
  }
  function id(key: string, version = '1') {
    return createHash('sha256')
      .update(JSON.stringify([version, key]))
      .digest('hex')
  }

  it('buffers mutations, exposes them immediately, and persists only at flush', async () => {
    const instance = cache<{ count: number }>()
    await instance.set('answer', { count: 42 })
    expect(await instance.get('answer')).toEqual({ count: 42 })
    expect(await fs.readdir(directory)).toEqual([])
    expect(await cache().get('answer')).toBeUndefined()
    await instance.flush()
    expect(await cache().get('answer')).toEqual({ count: 42 })
    expect(await cache({ namespace: 'other' }).get('answer')).toBeUndefined()
    expect(await cache({ version: '2' }).get('answer')).toBeUndefined()
    const otherVersion = cache({ version: '2' })
    await otherVersion.set('answer', 43)
    await otherVersion.flush()
    expect(await cache().get('answer')).toEqual({ count: 42 })
  })

  it('flushes a large batch to at most 32 JSON shards and leaves a clean flush unchanged', async () => {
    const instance = cache<string>()
    for (let index = 0; index < 500; index++)
      await instance.set(`key-${index}`, `value-${index}`)
    expect(await fs.readdir(directory)).toEqual([])
    const writes = vi.spyOn(fs, 'writeFile')
    await instance.flush()
    expect(
      writes.mock.calls.filter(([file]) => String(file).includes('.json.')),
    ).toHaveLength(32)
    writes.mockClear()
    await instance.flush()
    expect(writes).not.toHaveBeenCalled()
    const reader = cache<string>()
    for (let index = 0; index < 500; index++)
      expect(await reader.get(`key-${index}`)).toBe(`value-${index}`)
  })

  it('rewrites only affected shards and merges changes with the current file', async () => {
    const first = cache<number>(),
      second = cache<number>()
    for (let index = 0; index < 100; index++)
      await first.set(`key-${index}`, index)
    await first.flush()
    await second.get('key-0') // Load a snapshot before another writer changes it.
    const before = new Map(
      await Promise.all(
        (await files()).map(
          async (file) => [file, await fs.readFile(file, 'utf8')] as const,
        ),
      ),
    )
    const writes = vi.spyOn(fs, 'writeFile')
    await first.set('key-0', 999)
    await first.flush()
    expect(
      writes.mock.calls.filter(([file]) => String(file).includes('.json.')),
    ).toHaveLength(1)
    const changed = []
    for (const [file, data] of before)
      if ((await fs.readFile(file, 'utf8')) !== data) changed.push(file)
    expect(changed).toHaveLength(1)
    await second.set('another', 1000)
    await second.flush()
    expect(await cache().get('key-0')).toBe(999)
    expect(await cache().get('another')).toBe(1000)
  })

  it('keeps binary and large text out of JSON while preserving empty values', async () => {
    const textOptions = {
      codec: {
        encode: (value: string) => value,
        decode: (data: Buffer) => data.toString(),
      },
    }
    const text = cache(textOptions)
    await text.set('empty', '')
    await text.set('large', 'x'.repeat(100_000))
    expect(await text.get('large')).toHaveLength(100_000)
    await text.flush()
    expect(
      await cache(textOptions).getOrSetAsync('empty', async () => 'wrong'),
    ).toBe('')
    expect(await cache(textOptions).get('large')).toHaveLength(100_000)
    const binaryOptions = {
      codec: {
        encode: (value: Uint8Array) => value,
        decode: (data: Buffer) => new Uint8Array(data),
      },
    }
    const binary = cache(binaryOptions)
    await binary.set('binary', new Uint8Array([0, 255, 128]))
    await binary.flush()
    expect(await cache(binaryOptions).get('binary')).toEqual(
      new Uint8Array([0, 255, 128]),
    )
    expect(
      (await files()).filter((file) => file.endsWith('.cache')),
    ).toHaveLength(2)
    for (const file of (await files()).filter((file) => file.endsWith('.json')))
      expect((await fs.stat(file)).size).toBeLessThan(1000)
  })

  it('coalesces same-key computations, allows independent keys, and retries loader errors', async () => {
    const instance = cache<string>()
    let calls = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const pending = Array.from({ length: 20 }, () =>
      instance.getOrSetAsync('same', async () => {
        calls++
        await gate
        return 'shared'
      }),
    )
    try {
      expect(await instance.getOrSetAsync('other', async () => 'ready')).toBe(
        'ready',
      )
    } finally {
      release()
    }
    expect(await Promise.all(pending)).toEqual(Array(20).fill('shared'))
    expect(calls).toBe(1)
    await expect(
      instance.getOrSetAsync('retry', async () => {
        throw new Error('Computation failed')
      }),
    ).rejects.toThrow('Computation failed')
    expect(await instance.getOrSetAsync('retry', async () => 'retried')).toBe(
      'retried',
    )
    await instance.flush()
    expect(
      await cache<string>().getOrSetAsync('same', async () => {
        throw new Error('Should not compute')
      }),
    ).toBe('shared')
  })

  it('merges concurrent processes writing different keys into the same shard', async () => {
    const script = path.join(directory, 'worker.mjs')
    await fs.writeFile(
      script,
      `
import { createHash } from 'node:crypto';
import { PersistentCache } from ${JSON.stringify(new URL('./index.ts', import.meta.url).href)};
const cache = new PersistentCache({ directory: process.argv[2], namespace: 'test', version: '1', flushIntervalMs: 0 });
const keys = [];
for (let i = 0; keys.length < 20; i++) {
  const key = process.argv[3] + '-' + i;
  const hash = createHash('sha256').update(JSON.stringify(['1', key])).digest('hex');
  if (parseInt(hash.slice(0, 2), 16) % 32 === 0) { keys.push(key); await cache.set(key, key); }
}
process.once('message', async () => { await cache.flush(); process.disconnect(); });
process.send(keys);
`,
    )
    const children = Array.from({ length: 4 }, (_, index) =>
      fork(script, [directory, `worker-${index}`], {
        execArgv: ['--import', 'tsx'],
        silent: true,
      }),
    )
    const exits = children.map(
      (child) =>
        new Promise<void>((resolve, reject) => {
          let stderr = ''
          child.stderr?.on('data', (chunk) => {
            stderr += chunk
          })
          child.once('error', reject)
          child.once('exit', (code) =>
            code === 0
              ? resolve()
              : reject(new Error(stderr || `Worker exited ${code}`)),
          )
        }),
    )
    try {
      const keys = await Promise.all(
        children.map((child, index) =>
          Promise.race([
            new Promise<string[]>((resolve) =>
              child.once('message', (message) => resolve(message as string[])),
            ),
            exits[index].then(() => {
              throw new Error('Worker exited before becoming ready')
            }),
          ]),
        ),
      )
      for (const child of children) child.send('flush')
      await Promise.all(exits)
      const reader = cache<string>()
      for (const key of keys.flat()) expect(await reader.get(key)).toBe(key)
    } finally {
      for (const child of children) if (child.exitCode === null) child.kill()
    }
  }, 15000)

  it('bypasses memory, files, timers, and cleanup when disabled', async () => {
    const instance = cache<number>({ enabled: false, flushIntervalMs: 1 })
    let calls = 0
    await instance.set('key', 99)
    expect(await instance.get('key')).toBeUndefined()
    expect(await instance.getOrSetAsync('key', async () => ++calls)).toBe(1)
    expect(await instance.getOrSetAsync('key', async () => ++calls)).toBe(2)
    await instance.delete('key')
    await instance.flush()
    await instance.prune()
    expect(await fs.readdir(directory)).toEqual([])
  })

  it('bounds pending writes under storage failures and retries when storage becomes available', async () => {
    const blocked = path.join(directory, 'blocked')
    await fs.writeFile(blocked, '')
    const instance = cache<number>({ directory: blocked, maxMemoryEntries: 2 })
    for (let i = 0; i < 10; i++) {
      await instance.set(`key-${i}`, i)
      expect(await instance.get(`key-${i}`)).toBe(i)
    }
    await instance.flush()
    await fs.rm(blocked)
    await instance.flush()
    expect(await cache({ directory: blocked }).get('key-9')).toBe(9)
  })

  it('flushes early under memory pressure without dropping concurrent producers', async () => {
    const instance = cache<number>({
      maxMemoryEntries: 2,
      maxMemoryBytes: 2048,
    })
    await Promise.all(
      Array.from({ length: 30 }, (_, index) =>
        instance.set(`key-${index}`, index),
      ),
    )
    await instance.flush()
    const reader = cache<number>()
    for (let i = 0; i < 30; i++) expect(await reader.get(`key-${i}`)).toBe(i)
  })

  it('keeps mutations made during a flush readable and persists them in the next batch', async () => {
    const instance = cache<string>({ maxMemoryEntries: 1 })
    await instance.set('one', 'first')
    let release!: () => void, entered!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const started = new Promise<void>((resolve) => {
      entered = resolve
    })
    const original = fs.writeFile
    let paused = false
    vi.spyOn(fs, 'writeFile').mockImplementation(async (...args) => {
      if (!paused && String(args[0]).includes('.json.')) {
        paused = true
        entered()
        await gate
      }
      return original(...args)
    })
    const flushing = instance.flush()
    await started
    try {
      await instance.set('two', 'second')
      expect(await instance.get('one')).toBe('first')
      expect(await instance.get('two')).toBe('second')
    } finally {
      release()
      await flushing
    }
    await instance.flush()
    expect(await cache().get('one')).toBe('first')
    expect(await cache().get('two')).toBe('second')
  })

  it('persists deletions without another writer resurrecting a stale snapshot', async () => {
    const first = cache<number>(),
      second = cache<number>()
    await first.set('remove', 1)
    await first.flush()
    expect(await second.get('remove')).toBe(1)
    await first.delete('remove')
    expect(await first.get('remove')).toBeUndefined()
    await first.flush()
    await second.set('keep', 2)
    await second.flush()
    expect(await cache().get('remove')).toBeUndefined()
    expect(await cache().get('keep')).toBe(2)
  })

  it('flushes periodically during long-running use', async () => {
    const instance = cache<number>({ flushIntervalMs: 10 })
    await instance.set('key', 42)
    await vi.waitFor(async () => expect(await cache().get('key')).toBe(42))
    await instance.flush()
  })

  it('prunes idle entries and orphan blobs while retaining active blobs and foreign files', async () => {
    const realNow = Date.now(),
      dayMs = 86_400_000
    const now = vi.spyOn(Date, 'now').mockReturnValue(realNow - 40 * dayMs)
    const old = cache<string>({
      version: 'old',
      maxAgeDays: 0,
      codec: { encode: (value) => value, decode: (data) => data.toString() },
    })
    await old.set('old', 'x'.repeat(100_000))
    await old.flush()
    now.mockReturnValue(realNow)
    const blob = path.join(
      directory,
      'test',
      'blobs',
      `${id('old', 'old')}.cache`,
    )
    const abandoned = `${blob}.00000000-0000-0000-0000-000000000000.tmp`
    const foreign = path.join(directory, 'test', 'keep.txt')
    await fs.writeFile(abandoned, '')
    await fs.writeFile(foreign, '')
    const past = new Date(realNow - 40 * dayMs)
    for (const file of [blob, abandoned, foreign])
      await fs.utimes(file, past, past)
    const active = cache<string>({
      codec: { encode: (value) => value, decode: (data) => data.toString() },
    })
    await active.set('active', 'a'.repeat(100_000))
    await active.flush()
    const activeBlob = path.join(
      directory,
      'test',
      'blobs',
      `${id('active')}.cache`,
    )
    await fs.utimes(activeBlob, past, past)
    await cache().prune()
    expect(await cache({ version: 'old' }).get('old')).toBeUndefined()
    expect(await files()).not.toContain(blob)
    expect(await files()).not.toContain(abandoned)
    expect(await fs.readFile(foreign, 'utf8')).toBe('')
    expect(
      await cache<string>({
        codec: { encode: (value) => value, decode: (data) => data.toString() },
      }).get('active'),
    ).toHaveLength(100_000)
  })

  it('renews individual entries rather than retaining all entries in a used shard', async () => {
    const realNow = Date.now(),
      dayMs = 86_400_000
    const now = vi.spyOn(Date, 'now').mockReturnValue(realNow - 40 * dayMs)
    const original = cache<number>({ maxAgeDays: 0 })
    const usedShard = Number.parseInt(id('used').slice(0, 2), 16) % 32
    const idle = Array.from(
      { length: 512 },
      (_, index) => `idle-${index}`,
    ).find((key) => Number.parseInt(id(key).slice(0, 2), 16) % 32 === usedShard)
    if (!idle) throw new Error('Expected two keys in the same shard')
    await original.set('used', 1)
    await original.set(idle, 2)
    await original.flush()
    now.mockReturnValue(realNow)
    const reader = cache<number>()
    expect(await reader.get('used')).toBe(1)
    await reader.prune()
    expect(await cache().get('used')).toBe(1)
    expect(await cache().get(idle)).toBeUndefined()
    expect(await cache({ maxAgeDays: 0 }).get('used')).toBe(1)
  })

  it('rejects invalid storage identities, limits, and flush intervals', () => {
    for (const namespace of ['', '..', '../other', 'UPPER', 'with/slash'])
      expect(() => cache({ namespace })).toThrow('namespace')
    expect(() => cache({ version: '' })).toThrow('version')
    for (const maxAgeDays of [-1, NaN, Infinity])
      expect(() => cache({ maxAgeDays })).toThrow('maxAgeDays')
    for (const maxMemoryEntries of [0, 1.5, Infinity])
      expect(() => cache({ maxMemoryEntries })).toThrow('memory limits')
    for (const maxMemoryBytes of [0, NaN, Infinity])
      expect(() => cache({ maxMemoryBytes })).toThrow('memory limits')
    for (const flushIntervalMs of [-1, NaN, Infinity])
      expect(() => cache({ flushIntervalMs })).toThrow('flushIntervalMs')
  })
})

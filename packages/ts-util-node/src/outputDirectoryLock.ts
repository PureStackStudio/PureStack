import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'

type Release = () => Promise<void>

/**
 * Machine-wide exclusive ownership of output directories. Each lock is a local
 * socket the owner listens on, so only a running owner can answer for it and a
 * killed one never blocks the next command.
 */
export class OutputDirectoryLocks {
  private readonly locks = new Map<string, Promise<Release>>()

  /** Returns the canonical path used by both the writer and its lock. */
  async acquire(directory: string): Promise<string> {
    const absolute = path.resolve(directory)
    // An existing path resolves to its on-disk casing, so aliases differing
    // only in case share one lock on case-insensitive file systems.
    await fs.mkdir(absolute, { recursive: true })
    const canonical = await fs.realpath(absolute)
    let pending = this.locks.get(canonical)
    if (!pending) {
      pending = lockOutput(canonical)
      this.locks.set(canonical, pending)
    }
    try {
      await pending
    } catch (error) {
      if (this.locks.get(canonical) === pending) this.locks.delete(canonical)
      throw error
    }
    return canonical
  }

  /** Releases `directory`, a path `acquire` returned, or every held output. */
  async release(directory?: string): Promise<void> {
    const released = [...this.locks].filter(
      ([held]) => directory === undefined || held === directory,
    )
    for (const [held] of released) this.locks.delete(held)
    await Promise.all(released.map(async ([, lock]) => (await lock)()))
  }
}

async function lockOutput(directory: string): Promise<Release> {
  const address = socketAddress(directory)
  const server = net.createServer((socket) => socket.destroy())
  try {
    await listen(server, address)
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code !== 'EADDRINUSE' ||
      (await isListening(address))
    ) {
      throw new Error(
        `Output directory "${directory}" is already in use by another PureStack command. Stop that command or use a different output directory.`,
      )
    }
    // Only a socket file outlives its killed owner.
    if (address.startsWith(os.tmpdir())) await fs.rm(address, { force: true })
    await listen(server, address)
  }
  // The lock must not keep a finished command alive.
  server.unref()
  return () => new Promise((resolve) => server.close(() => resolve()))
}

/**
 * Named pipes and Linux abstract sockets vanish with their owner. macOS only
 * has socket files, so two commands reclaiming the same dead owner's file at
 * the same instant could both succeed. The hash keeps paths within socket limits.
 */
function socketAddress(directory: string) {
  const id = createHash('sha256').update(directory).digest('hex').slice(0, 16)
  if (process.platform === 'win32') return `\\\\.\\pipe\\purestack-${id}`
  if (process.platform === 'linux') return `\0purestack-${id}`
  return path.join(os.tmpdir(), `purestack-${id}.sock`)
}

function listen(server: net.Server, address: string) {
  return new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(address, () => {
      server.off('error', reject)
      resolve()
    })
  })
}

/** Only a refused or missing endpoint proves its owner is gone. */
function isListening(address: string) {
  return new Promise<boolean>((resolve) => {
    const socket = net.connect(address)
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', (error: NodeJS.ErrnoException) => {
      resolve(error.code !== 'ECONNREFUSED' && error.code !== 'ENOENT')
    })
  })
}

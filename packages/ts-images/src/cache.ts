import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { isPlainObject } from '@purestack/ts-util'

const entryName = /^[a-f0-9]{64}$/
const temporaryName =
  /^\.purestack-images-[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.(?:tmp|trash)$/

/** Retire by rename: readers either finish reading or treat a vanished entry as a miss. */
export async function retireCacheEntry(root: string, key: string) {
  if (!entryName.test(key)) throw new Error('Invalid image cache key.')
  const directory = path.join(root, key)
  const stat = await fs.lstat(directory).catch(missing)
  if (!stat) return
  if (!stat.isDirectory() || stat.isSymbolicLink())
    throw new Error('Image cache entries must be directories, not symlinks.')
  const retired = path.join(root, `.purestack-images-${randomUUID()}.trash`)
  try {
    await fs.rename(directory, retired)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
    // Windows can report EPERM when another process has already moved the directory.
    if (
      (error as NodeJS.ErrnoException).code === 'EPERM' &&
      !(await fs.lstat(directory).catch(missing))
    )
      return
    throw error
  }
  await fs.rm(retired, { recursive: true, force: true }).catch(cleanupError)
}

/** Only our expired entries are collected; a custom cache directory may contain other files. */
export async function pruneImageCache(
  root: string,
  maxAgeDays: number,
  activeKeys: ReadonlySet<string>,
) {
  if (maxAgeDays === 0) return
  const cutoff = Date.now() - maxAgeDays * 86_400_000
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue
    const directory = path.join(root, entry.name)
    try {
      if (temporaryName.test(entry.name)) {
        const stat = await fs.lstat(directory)
        if (stat.mtimeMs < cutoff)
          await fs.rm(directory, { recursive: true, force: true })
        continue
      }
      if (!entryName.test(entry.name) || activeKeys.has(entry.name)) continue
      const manifest = path.join(directory, 'manifest.json')
      const stat = await fs.lstat(manifest)
      if (!stat.isFile() || stat.size > 64 * 1024 || stat.mtimeMs >= cutoff)
        continue
      const value: unknown = JSON.parse(await fs.readFile(manifest, 'utf8'))
      if (
        !isPlainObject(value) ||
        value.version !== 1 ||
        value.key !== entry.name ||
        !Array.isArray(value.variants)
      )
        continue
      // A concurrent cache hit may have renewed this entry while we read it.
      if ((await fs.stat(manifest)).mtimeMs < cutoff)
        await retireCacheEntry(root, entry.name)
    } catch (error) {
      if (error instanceof SyntaxError) continue
      cleanupError(error)
    }
  }
}

function missing(error: NodeJS.ErrnoException): undefined {
  if (error.code !== 'ENOENT') throw error
}

function cleanupError(error: unknown) {
  // Another process can retire the entry or still hold a Windows file handle.
  if (
    !['ENOENT', 'EACCES', 'EPERM', 'EBUSY', 'ENOTEMPTY'].includes(
      (error as NodeJS.ErrnoException).code ?? '',
    )
  )
    throw error
}

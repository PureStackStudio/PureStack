import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'

export async function watchTree(
  root: string,
  onChange: (filePath: string) => void,
) {
  const watchers: fs.FSWatcher[] = []
  const supportsRecursive =
    process.platform === 'win32' || process.platform === 'darwin'

  if (supportsRecursive) {
    const watcher = fs.watch(root, { recursive: true }, (_event, filename) => {
      const label = filename ? path.join(root, filename.toString()) : root
      onChange(label)
    })
    watchers.push(watcher)
  } else {
    const dirs = await collectDirs(root)
    for (const dir of dirs) {
      const watcher = fs.watch(dir, (_event, filename) => {
        const label = filename ? path.join(dir, filename.toString()) : dir
        onChange(label)
      })
      watchers.push(watcher)
    }
  }

  return {
    close() {
      for (const watcher of watchers) {
        watcher.close()
      }
    },
  }
}

/**
 * Watches individual files through their folders, so an editor that saves by
 * replacing the file is still noticed.
 */
export function watchFiles(
  filePaths: readonly string[],
  onChange: (filePath: string) => void,
) {
  const filesByDir = new Map<string, Set<string>>()
  for (const filePath of filePaths) {
    const dir = path.dirname(filePath)
    const files = filesByDir.get(dir) ?? new Set<string>()
    files.add(toPathKey(filePath))
    filesByDir.set(dir, files)
  }
  const watchers = [...filesByDir].map(([dir, files]) =>
    fs.watch(dir, (_event, filename) => {
      if (!filename) return
      const filePath = path.join(dir, filename.toString())
      if (files.has(toPathKey(filePath))) onChange(filePath)
    }),
  )
  return {
    close() {
      for (const watcher of watchers) watcher.close()
    },
  }
}

/** A path compared the way the file system does: case-blind on Windows. */
export function toPathKey(filePath: string) {
  const resolved = path.resolve(filePath)
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved
}

async function collectDirs(root: string) {
  const result = [root]
  const queue = [root]
  while (queue.length > 0) {
    const current = queue.pop()
    if (!current) break
    const entries = await fsPromises.readdir(current, {
      withFileTypes: true,
    })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const next = path.join(current, entry.name)
      result.push(next)
      queue.push(next)
    }
  }
  return result
}

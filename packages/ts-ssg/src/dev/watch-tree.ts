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

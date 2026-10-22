import { readFile } from 'node:fs/promises'
import path from 'node:path'

/** The PureStack repository root when this CLI runs from its own checkout. */
export async function repositoryCheckout(packageRoot: string) {
  const root = path.resolve(packageRoot, '../..')
  if (path.join(root, 'packages', 'purestack') !== packageRoot) return undefined
  try {
    const manifest: unknown = JSON.parse(
      await readFile(path.join(root, 'package.json'), 'utf8'),
    )
    return manifest &&
      typeof manifest === 'object' &&
      'name' in manifest &&
      manifest.name === 'purestack-repo'
      ? root
      : undefined
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw error
  }
}

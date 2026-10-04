import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Creates a temporary folder under the repository's `.tmp/`, for tests whose
 * fixtures must resolve the workspace's packages, such as bundled scripts.
 */
export async function makeRepoTempDir(prefix: string) {
  const root = path.join(process.cwd(), '.tmp')
  await fs.mkdir(root, { recursive: true })
  return fs.mkdtemp(path.join(root, prefix))
}

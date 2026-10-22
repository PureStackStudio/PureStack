import { globSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import path from 'node:path'

import { timeIt } from './timeIt'
import { workspaceManifestPaths } from './workspaces'

const projectRoot = process.cwd()

const distPaths = [
  path.join(projectRoot, 'dist'),
  ...workspaceManifestPaths(projectRoot).map((manifest) =>
    path.join(projectRoot, path.dirname(manifest), 'dist'),
  ),
]

const tgzFiles = globSync(['**/*.tgz'])
  .filter((p) => !p.includes('node_modules') && !p.includes('.git'))
  .map((p) => path.join(projectRoot, p))

async function removePath(targetPath: string) {
  await timeIt(`remove: ${targetPath}`, '🧹', async () => {
    try {
      await rm(targetPath, { recursive: true, force: true })
    } catch (err) {
      console.warn(`⚠️ Could not remove ${targetPath}:`, err)
    }
  })
}

async function main() {
  for (const distPath of distPaths) {
    await removePath(distPath)
  }

  for (const file of tgzFiles) {
    await removePath(file)
  }
}

main().catch((err) => {
  console.error('❌ Cleanup failed:', err)
  process.exit(1)
})

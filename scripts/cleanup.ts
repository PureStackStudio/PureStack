import { globSync, readFileSync } from 'fs'
import { rm } from 'fs/promises'
import path from 'path'

import { timeIt } from './timeIt'

interface PackageJson extends Record<string, unknown> {
  name: string
}

const projectRoot = process.cwd()

const packages: PackageJson[] = globSync(['packages/**/package.json']).map(
  (p) => JSON.parse(readFileSync(path.join(p), 'utf8')),
)

const mainPkgName =
  packages.map((x) => x.name).filter((n) => !n.startsWith('@'))[0] ??
  packages
    .map((x) => x.name)[0]
    .split('/')[0]
    .substring(1)

const unscope = (name: string) => name.replace(`@${mainPkgName}/`, '')

const distPaths = [
  path.join(projectRoot, 'dist'),
  ...packages.map((pkg) =>
    path.join(projectRoot, 'packages', unscope(pkg.name), 'dist'),
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

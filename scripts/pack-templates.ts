import { cp, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchTemplate } from '../packages/purestack/src/init/template'
import { workspaceManifestPaths } from './workspaces'

/** npm respects explicit dotfile entries; Yarn pack excludes these files. */
export async function packTemplate(directory: string) {
  const temporary = await mkdtemp(
    path.join(tmpdir(), 'purestack-template-pack-'),
  )
  try {
    const archive = await fetchTemplate(directory, temporary, directory)
    const destination = path.join(directory, 'package.tgz')
    await cp(archive, destination)
    console.log(`Template archive generated in ${destination}`)
    return destination
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

async function main() {
  for (const file of workspaceManifestPaths()) {
    const manifest: unknown = JSON.parse(await readFile(file, 'utf8'))
    if (
      manifest &&
      typeof manifest === 'object' &&
      'purestackTemplate' in manifest &&
      manifest.purestackTemplate === true
    )
      await packTemplate(path.resolve(path.dirname(file)))
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}

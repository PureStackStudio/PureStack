import assert from 'node:assert/strict'
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { findNpmCli, runProcess } from '../packages/purestack/src/init/process'

async function main() {
  const npmCli = findNpmCli()
  assert(npmCli, 'npm is required to verify first-run tool installation.')
  const template: unknown = JSON.parse(
    await readFile(
      new URL('../templates/starter/template/package.json', import.meta.url),
      'utf8',
    ),
  )
  assert(
    template &&
      typeof template === 'object' &&
      'packageManager' in template &&
      typeof template.packageManager === 'string',
    'Starter must pin its package manager.',
  )
  const root = await mkdtemp(path.join(tmpdir(), 'purestack-toolchain-'))
  try {
    const bin = path.join(root, 'node-bin')
    await mkdir(bin)
    const node = path.join(
      bin,
      process.platform === 'win32' ? 'node.exe' : 'node',
    )
    // A separate Node executable prevents finding bundled Corepack beside it.
    await copyFile(process.execPath, node)
    if (process.platform !== 'win32') await chmod(node, 0o755)
    const worker = path.join(root, 'verify.mjs')
    await build({
      entryPoints: [
        fileURLToPath(
          new URL('./fixtures/toolchain-worker.ts', import.meta.url),
        ),
      ],
      outfile: worker,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node22',
    })
    await runProcess(
      node,
      [worker, root, npmCli, template.packageManager],
      root,
    )
    console.log(
      `Fresh Corepack/Yarn setup verified on ${process.platform}/${process.arch}.`,
    )
  } finally {
    assert(
      path.dirname(root) === path.resolve(tmpdir()),
      'Unexpected verification directory.',
    )
    assert(
      path.basename(root).startsWith('purestack-toolchain-'),
      'Unexpected verification directory.',
    )
    await rm(root, { recursive: true, force: true })
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readPreviewConfig } from './preview-config'

let directory: string

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'purestack-preview-config-'))
})

afterEach(async () => {
  await rm(directory, { recursive: true, force: true })
})

async function site(dev: string, content = 'content') {
  await mkdir(path.join(directory, content), { recursive: true })
  await writeFile(path.join(directory, content, 'siteConfig.json'), '{}')
  await writeFile(
    path.join(directory, content, 'purestack.config.ts'),
    'export default {}',
  )
  await writeFile(
    path.join(directory, 'package.json'),
    JSON.stringify({ scripts: { dev } }),
  )
  return path.join(directory, 'studio-output')
}

describe('Studio live site configuration', () => {
  it('uses the dev script port and content instead of an automatic preview port', async () => {
    const outDir = await site('purestack serve --content ./content --port 5000')
    const config = await readPreviewConfig(directory, outDir)
    expect(config.port).toBe(5000)
    expect(config.configFile).toBe(
      path.join(directory, 'content/purestack.config.ts'),
    )
    expect(config.build?.siteConfig).toMatchObject({
      rootDir: directory,
      contentDir: path.join(directory, 'content'),
      outDir,
    })
    expect(config.handleSignals).toBe(false)
    expect(config.failOnInitialBuildError).toBe(true)
  })

  it('honors quoted content paths, host, equals syntax, and serve flags', async () => {
    const outDir = await site(
      'purestack serve --content="./my content" --host=127.0.0.1 --port=5100 --no-watch --no-reload --full-render',
      'my content',
    )
    expect(await readPreviewConfig(directory, outDir)).toMatchObject({
      host: '127.0.0.1',
      port: 5100,
      watch: false,
      liveReload: false,
      fullRender: true,
      build: { siteConfig: { contentDir: path.join(directory, 'my content') } },
    })
  })

  it('keeps an explicitly requested automatic port', async () => {
    const outDir = await site('purestack serve --content ./content --port 0')
    expect((await readPreviewConfig(directory, outDir)).port).toBe(0)
  })

  it('leaves omitted ports to the normal PureStack server default', async () => {
    const outDir = await site('purestack serve --content ./content')
    expect((await readPreviewConfig(directory, outDir)).port).toBeUndefined()
  })

  it.each([
    'another-server --port 5000',
    'purestack build --content ./content',
    'purestack serve --content ./content && echo done',
    'purestack serve --content "./content',
    'purestack serve --content ./content --unknown',
  ])('reports unsupported dev commands: %s', async (command) => {
    const outDir = await site(command)
    await expect(readPreviewConfig(directory, outDir)).rejects.toThrow()
  })
})

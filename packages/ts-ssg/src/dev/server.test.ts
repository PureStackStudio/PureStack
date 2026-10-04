import fs from 'node:fs/promises'
import http from 'node:http'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { disableLogger } from 'logpot'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { type DevServerHandle, startDevServer } from './server'

const HOST = '127.0.0.1'
const LIVE_RELOAD_PATH = '/__ts-ssg/events'

describe('dev server', () => {
  let root: string | undefined
  let server: DevServerHandle | undefined
  let liveReload: LiveReloadListener | undefined

  beforeAll(() => {
    disableLogger()
  })

  afterEach(async () => {
    liveReload?.close()
    await server?.close()
    if (root) await fs.rm(root, { recursive: true, force: true })
  })

  it('serves the new header on the reload a header edit triggers', async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-dev-'))
    const contentDir = path.join(root, 'content')
    const headerPath = path.join(contentDir, 'guides', 'header.mdx')
    await writeFile(headerPath, '<p>Header v1</p>')
    await writeFile(path.join(contentDir, 'guides', 'index.mdx'), '# Guides')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
        },
      },
    })
    liveReload = listenForLiveReload(port)
    // The initial build ends with the first reload signal.
    await liveReload.reachVersion(1)
    expect(await get(port, '/guides/')).toContain('Header v1')

    await writeFile(headerPath, '<p>Header v2</p>')
    await liveReload.reachVersion(2)

    // The one request a browser makes after the reload signal must already
    // show the change; no later signal announces a background render.
    expect(await get(port, '/guides/')).toContain('Header v2')
  }, 20_000)
})

type LiveReloadListener = ReturnType<typeof listenForLiveReload>

/** Follows the dev server's live reload version, like the browser script. */
function listenForLiveReload(port: number) {
  let version = -1
  const waiters: Array<{ target: number; resolve: () => void }> = []
  const request = http.get(
    { host: HOST, port, path: LIVE_RELOAD_PATH },
    (res) => {
      let buffer = ''
      res.setEncoding('utf8')
      res.on('data', (chunk: string) => {
        buffer += chunk
        const messages = buffer.split('\n\n')
        buffer = messages.pop() ?? ''
        for (const message of messages) {
          if (!message.startsWith('event: state')) continue
          const data = message
            .split('\n')
            .find((line) => line.startsWith('data: '))
          version = Number(JSON.parse(data?.slice(6) ?? '{}').version)
          for (const waiter of waiters.filter(
            (entry) => version >= entry.target,
          )) {
            waiters.splice(waiters.indexOf(waiter), 1)
            waiter.resolve()
          }
        }
      })
    },
  )
  request.on('error', () => {})
  return {
    reachVersion(target: number) {
      if (version >= target) return Promise.resolve()
      return new Promise<void>((resolve) => waiters.push({ target, resolve }))
    },
    close() {
      request.destroy()
    },
  }
}

async function writeFile(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents, 'utf8')
}

function findFreePort() {
  return new Promise<number>((resolve, reject) => {
    const probe = net.createServer()
    probe.once('error', reject)
    probe.listen(0, HOST, () => {
      const address = probe.address()
      probe.close(() =>
        typeof address === 'object' && address
          ? resolve(address.port)
          : reject(new Error('No port assigned.')),
      )
    })
  })
}

function get(port: number, pathname: string) {
  return new Promise<string>((resolve, reject) => {
    http
      .get({ host: HOST, port, path: pathname }, (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk: string) => {
          body += chunk
        })
        res.on('end', () => resolve(body))
      })
      .on('error', reject)
  })
}

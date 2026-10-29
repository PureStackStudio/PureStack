import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import type {
  DevWebSocketConnection,
  DevWebSocketMessage,
} from '@purestack/ts-ssg'
import { describe, expect, it, vi } from 'vitest'
import type {
  SessionCommand,
  SessionEvent,
  SessionSnapshot,
} from '../../../forge/modules/shared/protocol'
import { createSite } from '../../init/create-site'
import * as managers from '../../init/package-manager'
import { readTemplateUi } from '../../init/template-ui'
import { parseInitArguments } from '../arguments'
import { Session } from './session'

class BrowserPeer implements DevWebSocketConnection {
  open = true
  readonly events: SessionEvent[] = []
  private readonly listeners = new Set<(message: DevWebSocketMessage) => void>()
  private readonly closed = new Set<() => void>()
  private readonly snapshots = new Set<(snapshot: SessionSnapshot) => void>()
  send(message: DevWebSocketMessage) {
    const event: SessionEvent = JSON.parse(String(message))
    this.events.push(event)
    if (event.type === 'snapshot')
      for (const listener of this.snapshots) listener(event.snapshot)
    return true
  }
  // Creation touches real files; await its event under the normal test timeout.
  waitForCreation() {
    const completion = Promise.withResolvers<SessionSnapshot>()
    const inspect = (snapshot: SessionSnapshot) => {
      if (snapshot.status !== 'ready' && snapshot.status !== 'failed') return
      this.snapshots.delete(inspect)
      completion.resolve(snapshot)
    }
    this.snapshots.add(inspect)
    const latest = this.events.findLast((event) => event.type === 'snapshot')
    if (latest?.type === 'snapshot') inspect(latest.snapshot)
    return completion.promise
  }
  request(command: SessionCommand) {
    for (const listener of this.listeners) listener(JSON.stringify(command))
  }
  onMessage(listener: (message: DevWebSocketMessage) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
  onClose(listener: () => void) {
    this.closed.add(listener)
    return () => {
      this.closed.delete(listener)
    }
  }
  close() {
    this.open = false
    for (const listener of this.closed) listener()
  }
}

async function fixture(previewFails = false) {
  const cwd = await mkdtemp(path.join(tmpdir(), 'purestack-forge-test-'))
  const root = path.join(cwd, 'template')
  await cp(path.resolve('templates/starter'), root, {
    recursive: true,
    filter: (source) => path.basename(source) !== 'node_modules',
  })
  const template = {
    root,
    source: 'starter',
    name: '@purestack/template-starter',
    version: '1.0.0',
    description: 'Starter',
    ui: await readTemplateUi(root),
  }
  let creates = 0
  let previews = 0
  let stops = 0
  let finishes = 0
  const gate = Promise.withResolvers<void>()
  const session = new Session(
    { cwd, packageRoot: path.resolve('packages/purestack'), version: '1.1.19' },
    {
      store: { load: async () => template, dispose: async () => {} },
      output: { write: () => {} },
      create: async (...args) => {
        creates++
        await gate.promise
        return createSite(...args)
      },
      preview: async () => {
        previews++
        if (previewFails && previews === 1)
          throw new Error('Missing a site dependency.')
        return {
          url: 'http://127.0.0.1:45678/',
          close: async () => {
            stops++
          },
        }
      },
      finish: () => {
        finishes++
      },
    },
  )
  await session.initialize(
    parseInitArguments(
      ['my-site', '--title', 'My Forge Site', '--set', 'palette=orange'],
      cwd,
    ),
  )
  const peer = new BrowserPeer()
  session.connect(peer)
  return {
    cwd,
    session,
    peer,
    gate,
    counts: () => ({ creates, previews, stops, finishes }),
    close: async () => {
      gate.resolve()
      await session.dispose()
      await rm(cwd, { recursive: true, force: true })
    },
  }
}

describe('Forge session', () => {
  it('streams formatting progress after installation and before starting the live site', async () => {
    const test = await fixture()
    const prepare = vi
      .spyOn(managers, 'preparePackageManager')
      .mockResolvedValue(undefined)
    const run = vi.spyOn(managers, 'runPackageManager').mockResolvedValue('')
    test.gate.resolve()
    try {
      test.peer.request({
        type: 'create',
        configuration: {
          ...test.session.snapshot.configuration,
          install: true,
        },
      })
      expect(await test.peer.waitForCreation()).toMatchObject({
        status: 'ready',
      })
      const tasks = test.session.snapshot.tasks
      const labels = tasks.map((task) => task.label)
      expect(labels.indexOf('Format project files')).toBeGreaterThan(
        labels.indexOf('Install dependencies'),
      )
      expect(labels.indexOf('Format project files')).toBeLessThan(
        labels.indexOf('Start live site'),
      )
      expect(tasks.every((task) => task.state === 'done')).toBe(true)
      expect(
        test.peer.events.some(
          (event) =>
            event.type === 'snapshot' &&
            event.snapshot.tasks.some(
              (task) =>
                task.label === 'Format project files' &&
                task.state === 'running',
            ),
        ),
      ).toBe(true)
      expect(test.session.snapshot.result?.failures).toEqual([])
      expect(test.counts().previews).toBe(1)
    } finally {
      await test.close()
      prepare.mockRestore()
      run.mockRestore()
    }
  })

  it('creates once, streams tasks, survives reconnects and keeps the live site open until finishing', async () => {
    const test = await fixture()
    try {
      const configuration = structuredClone(test.session.snapshot.configuration)
      test.peer.request({ type: 'create', configuration })
      test.peer.request({ type: 'create', configuration })
      await expect.poll(() => test.counts().creates).toBe(1)
      expect(test.session.snapshot.status).toBe('creating')
      test.peer.close()
      const reconnected = new BrowserPeer()
      test.session.connect(reconnected)
      expect(reconnected.events[0].type).toBe('snapshot')
      test.gate.resolve()
      expect(await reconnected.waitForCreation()).toMatchObject({
        status: 'ready',
      })
      const directory = path.join(test.cwd, 'my-site')
      const config = JSON.parse(
        await readFile(path.join(directory, 'content/siteConfig.json'), 'utf8'),
      )
      expect(config.siteTitle).toBe('My Forge Site')
      expect(config.style.theme.presets).toEqual(['orange'])
      expect(await readdir(directory)).toContain('AGENTS.md')
      expect(
        test.session.snapshot.tasks.every((task) => task.state === 'done'),
      ).toBe(true)
      expect(test.session.snapshot.result?.previewUrl).toBe(
        'http://127.0.0.1:45678/',
      )
      expect(test.counts()).toEqual({
        creates: 1,
        previews: 1,
        stops: 0,
        finishes: 0,
      })
      reconnected.request({ type: 'finish' })
      await expect.poll(() => test.counts().finishes).toBe(1)
      await test.session.dispose()
      expect(test.counts().stops).toBe(1)
    } finally {
      await test.close()
    }
  })

  it('preserves existing files and allows correcting the destination after failure', async () => {
    const test = await fixture()
    test.gate.resolve()
    try {
      await mkdir(path.join(test.cwd, 'my-site'))
      await writeFile(path.join(test.cwd, 'my-site/keep.txt'), 'keep me')
      test.peer.request({
        type: 'create',
        configuration: structuredClone(test.session.snapshot.configuration),
      })
      expect(await test.peer.waitForCreation()).toMatchObject({
        status: 'failed',
      })
      expect(test.session.snapshot.error).toContain('empty directory')
      expect(
        await readFile(path.join(test.cwd, 'my-site/keep.txt'), 'utf8'),
      ).toBe('keep me')
      expect(test.counts().creates).toBe(0)
      test.peer.request({
        type: 'create',
        configuration: {
          ...test.session.snapshot.configuration,
          directory: 'another-site',
        },
      })
      expect(await test.peer.waitForCreation()).toMatchObject({
        status: 'ready',
      })
      expect(test.session.snapshot.result?.directory).toBe(
        path.join(test.cwd, 'another-site'),
      )
    } finally {
      await test.close()
    }
  })

  it('retains the generated project when preview fails and retries without creating again', async () => {
    const test = await fixture(true)
    test.gate.resolve()
    try {
      test.peer.request({
        type: 'create',
        configuration: structuredClone(test.session.snapshot.configuration),
      })
      expect(await test.peer.waitForCreation()).toMatchObject({
        status: 'ready',
      })
      expect(test.session.snapshot.result?.previewError).toContain(
        'Missing a site dependency',
      )
      test.peer.request({ type: 'preview' })
      await expect
        .poll(() => test.session.snapshot.result?.previewUrl)
        .toBe('http://127.0.0.1:45678/')
      expect(test.counts().creates).toBe(1)
      expect(test.counts().previews).toBe(2)
    } finally {
      await test.close()
    }
  })
})

describe('Forge template selection', () => {
  it('reports only the latest selection and drops outcomes it replaced', async () => {
    const root = path.resolve('templates/starter')
    const ui = await readTemplateUi(root)
    const loads = new Map<string, PromiseWithResolvers<void>>()
    const session = new Session(
      {
        cwd: tmpdir(),
        packageRoot: path.resolve('packages/purestack'),
        version: '1.1.19',
      },
      {
        store: {
          load: async (source) => {
            if (source !== 'starter') {
              const load = Promise.withResolvers<void>()
              loads.set(source, load)
              await load.promise
            }
            return {
              root,
              source,
              name: source,
              version: '1.0.0',
              description: source,
              ui,
            }
          },
          dispose: async () => {},
        },
        output: { write: () => {} },
        preview: async () => ({
          url: 'http://127.0.0.1/',
          close: async () => {},
        }),
        finish: () => {},
      },
    )
    await session.initialize(parseInitArguments([], tmpdir()))
    const peer = new BrowserPeer()
    session.connect(peer)
    const errors = () => peer.events.filter((event) => event.type === 'error')
    try {
      peer.request({ type: 'template', source: 'first' })
      peer.request({ type: 'template', source: 'second' })
      await expect.poll(() => loads.size).toBe(2)
      expect(session.snapshot.loadingTemplate).toBe('second')
      loads.get('first')?.reject(new Error('first failed'))
      loads.get('second')?.resolve()
      await expect.poll(() => session.snapshot.template.source).toBe('second')
      expect(session.snapshot.loadingTemplate).toBeUndefined()
      expect(errors()).toEqual([])

      peer.request({ type: 'template', source: 'third' })
      await expect.poll(() => loads.has('third')).toBe(true)
      loads.get('third')?.reject(new Error('third failed'))
      await expect.poll(() => errors().length).toBe(1)
      // The cleared loading state is published before the failure reaches the tab.
      const [cleared, failure] = peer.events.slice(-2)
      expect(failure).toEqual({ type: 'error', message: 'third failed' })
      expect(cleared).toMatchObject({
        type: 'snapshot',
        snapshot: { template: { source: 'second' } },
      })
      expect(cleared).not.toHaveProperty('snapshot.loadingTemplate')
      expect(errors()).toHaveLength(1)
    } finally {
      await session.dispose()
    }
  })
})

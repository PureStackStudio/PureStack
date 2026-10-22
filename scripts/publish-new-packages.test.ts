import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  npm: vi.fn<
    (
      command: string,
      args: string[],
      options: unknown,
    ) => Promise<{ stdout: string; stderr: string }>
  >(),
  checkFailures: new Map<string, string>(),
  publishFailures: new Map<string, string>(),
  existing: new Set<string>(),
  missingArchives: new Set<string>(),
}))

vi.mock('node:util', () => ({ promisify: () => mocks.npm }))
vi.mock('node:fs', () => ({
  existsSync: (file: string) =>
    !mocks.missingArchives.has(
      file.replaceAll('\\', '/').split('/').at(-2) ?? '',
    ),
  readFileSync: (file: string) => {
    const name = file.replaceAll('\\', '/').split('/').at(-2)
    return JSON.stringify({
      name: `@purestack/${name}`,
      version: '1.0.0',
      exports: { '.': './dist/index.js' },
    })
  },
}))
vi.mock('./workspaces', () => ({
  workspaceManifestPaths: () =>
    ['first', 'second', 'third'].map((name) => `packages/${name}/package.json`),
}))

import { publishNewPackages } from './publish-new-packages'

function npmError(message: string) {
  return Object.assign(new Error('npm failed'), { stdout: '', stderr: message })
}

function publishAttempts() {
  return mocks.npm.mock.calls
    .map(([, args]) => args[args.indexOf('publish') + 1])
    .filter((arg) => arg?.endsWith('package.tgz'))
    .map((file) => path.basename(path.dirname(file)))
}

beforeEach(() => {
  mocks.npm.mockReset()
  mocks.checkFailures.clear()
  mocks.publishFailures.clear()
  mocks.existing.clear()
  mocks.missingArchives.clear()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  mocks.npm.mockImplementation(async (_command, args) => {
    const view = args.indexOf('view')
    if (view !== -1) {
      const name = args[view + 1]
      const failure = mocks.checkFailures.get(name)
      if (failure) throw npmError(failure)
      if (!mocks.existing.has(name)) throw npmError('npm error code E404')
    }
    const publish = args.indexOf('publish')
    if (publish !== -1) {
      const name = path.basename(path.dirname(args[publish + 1]))
      const failure = mocks.publishFailures.get(name)
      if (failure) throw npmError(failure)
    }
    return { stdout: '"1.0.0"', stderr: '' }
  })
})

afterEach(() => vi.restoreAllMocks())

describe('publishing missing packages', () => {
  it('continues publishing after an error and reports the failed package last', async () => {
    mocks.publishFailures.set('first', 'npm error E403: permission denied')

    expect(await publishNewPackages(['--publish'])).toBe(1)

    expect(publishAttempts()).toEqual(['first', 'second', 'third'])
    expect(console.log).toHaveBeenLastCalledWith('Published 2 new package(s).')
    expect(console.error).toHaveBeenCalledWith('\nFailed 1 package(s):')
    expect(console.error).toHaveBeenLastCalledWith(
      '\n- @purestack/first@1.0.0 (publish)\nnpm error E403: permission denied',
    )
  })

  it('collects multiple publish failures without stopping later packages', async () => {
    mocks.publishFailures.set('first', 'Authentication failed')
    mocks.publishFailures.set('second', 'Upload failed')

    expect(await publishNewPackages(['--publish'])).toBe(1)

    expect(publishAttempts()).toEqual(['first', 'second', 'third'])
    expect(console.log).toHaveBeenLastCalledWith('Published 1 new package(s).')
    expect(console.error).toHaveBeenCalledWith('\nFailed 2 package(s):')
    expect(console.error).toHaveBeenCalledWith(
      '\n- @purestack/first@1.0.0 (publish)\nAuthentication failed',
    )
    expect(console.error).toHaveBeenLastCalledWith(
      '\n- @purestack/second@1.0.0 (publish)\nUpload failed',
    )
  })

  it('also continues after registry-check errors and missing archives', async () => {
    mocks.checkFailures.set('@purestack/first', 'Registry unavailable')
    mocks.missingArchives.add('second')

    expect(await publishNewPackages(['--publish'])).toBe(1)

    expect(publishAttempts()).toEqual(['third'])
    expect(console.log).toHaveBeenLastCalledWith('Published 1 new package(s).')
    expect(console.error).toHaveBeenCalledWith('\nFailed 2 package(s):')
    expect(console.error).toHaveBeenCalledWith(
      '\n- @purestack/first@1.0.0 (registry check)\nRegistry unavailable',
    )
    expect(console.error).toHaveBeenLastCalledWith(
      expect.stringContaining('@purestack/second@1.0.0 (publish)'),
    )
  })

  it('reports dry-run check failures without attempting to publish', async () => {
    mocks.checkFailures.set('@purestack/first', 'Registry unavailable')

    expect(await publishNewPackages([])).toBe(1)

    expect(publishAttempts()).toEqual([])
    expect(console.log).toHaveBeenLastCalledWith(
      'Dry run complete. 2 package version(s) would be published.',
    )
    expect(console.error).toHaveBeenLastCalledWith(
      '\n- @purestack/first@1.0.0 (registry check)\nRegistry unavailable',
    )
  })

  it('keeps already-published versions as successful skips', async () => {
    mocks.existing.add('@purestack/second')
    mocks.existing.add('@purestack/second@1.0.0')
    mocks.publishFailures.set(
      'first',
      'cannot publish over the previously published versions',
    )

    expect(await publishNewPackages(['--publish'])).toBe(0)

    expect(publishAttempts()).toEqual(['first', 'third'])
    expect(console.log).toHaveBeenLastCalledWith('Published 1 new package(s).')
    expect(console.error).not.toHaveBeenCalled()
  })
})

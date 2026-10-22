import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { c } from 'tar'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type CreateSitePlan, createSite } from './create-site'
import * as managers from './package-manager'
import * as processes from './process'
import {
  assertEmptyDestination,
  fetchTemplate,
  inspectTemplate,
  prepareProject,
  projectName,
  resolveTemplateSpec,
  unpackTemplate,
  writeProject,
} from './template'

const repository = path.resolve(import.meta.dirname, '../../../..')
const cliVersion = JSON.parse(
  await readFile(
    path.join(repository, 'packages/purestack/package.json'),
    'utf8',
  ),
).version as string
let temporary: string

function plan(
  directory: string,
  template: string,
  changes: Partial<CreateSitePlan> = {},
): CreateSitePlan {
  return {
    directory,
    template,
    title: 'Test site',
    install: false,
    git: false,
    values: {},
    ...changes,
  }
}

beforeEach(async () => {
  temporary = await mkdtemp(path.join(tmpdir(), 'purestack-init-test-'))
  vi.spyOn(managers, 'preparePackageManager').mockResolvedValue(undefined)
})
afterEach(async () => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  await rm(temporary, { recursive: true, force: true })
})

async function fixture(template = 'starter') {
  const unpacked = path.join(temporary, 'fixture')
  await cp(path.join(repository, 'templates', template), unpacked, {
    recursive: true,
    filter: (source) => path.basename(source) !== 'node_modules',
  })
  return unpacked
}

async function archiveFixture() {
  const source = await fixture()
  const archive = path.join(temporary, 'template.tgz')
  await c({ file: archive, gzip: true, cwd: source, prefix: 'package' }, [
    'package.json',
    'template.json',
    'template.ui.json',
    'template',
  ])
  return archive
}

// Build raw entries so the writer cannot sanitize the hostile paths under test.
async function rawArchive(entries: { name: string; type?: string }[]) {
  const blocks = entries.map(({ name, type = '0' }) => {
    const header = Buffer.alloc(512)
    header.write(name, 0, 100)
    header.write('0000644\0', 100)
    header.write('0000000\0', 108)
    header.write('0000000\0', 116)
    header.write('00000000000\0', 124)
    header.write('00000000000\0', 136)
    header.fill(' ', 148, 156)
    header.write(type, 156)
    if (type === '1' || type === '2') header.write('../../outside', 157)
    header.write('ustar\0', 257)
    header.write('00', 263)
    header.write(
      `${header
        .reduce((sum, byte) => sum + byte, 0)
        .toString(8)
        .padStart(6, '0')}\0 `,
      148,
    )
    return header
  })
  const archive = path.join(temporary, 'hostile.tgz')
  await writeFile(
    archive,
    gzipSync(Buffer.concat([...blocks, Buffer.alloc(1024)])),
  )
  return archive
}

describe('init options', () => {
  it('resolves aliases, explicit package versions, and local paths', () => {
    expect(resolveTemplateSpec('starter', temporary)).toBe(
      '@purestack/template-starter@latest',
    )
    expect(resolveTemplateSpec('starter@1.2.3', temporary)).toBe(
      '@purestack/template-starter@1.2.3',
    )
    expect(resolveTemplateSpec('@company/template@1.0.0', temporary)).toBe(
      '@company/template@1.0.0',
    )
    expect(resolveTemplateSpec('./template.tgz', temporary)).toBe(
      path.join(temporary, 'template.tgz'),
    )
    expect(() =>
      resolveTemplateSpec('git+https://example.com/template.git', temporary),
    ).toThrow()
    expect(() =>
      resolveTemplateSpec('--registry=https://example.com', temporary),
    ).toThrow()
  })

  it('normalizes a directory into a valid project name', () => {
    expect(projectName(path.join(temporary, 'My Docs'))).toBe('my-docs')
    expect(() => projectName(path.join(temporary, '...'))).toThrow()
  })
})

describe('template extraction', () => {
  it.each([
    '/outside',
    'package/../../outside',
    'package/a/../outside',
    'package/a\\..\\outside',
    'C:/outside',
    'package/file:stream',
    'package/NUL.txt',
    'package/file.',
    'package/file ',
    'package//file',
    'package/file?',
  ])('rejects unsafe archive entry %s before writing', async (name) => {
    const archive = await rawArchive([{ name }])
    const output = path.join(temporary, 'output')
    await expect(unpackTemplate(archive, output)).rejects.toThrow(/Unsafe/)
    await expect(lstat(output)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it.each(['1', '2', '3', '6'])(
    'rejects links and special entries of type %s',
    async (type) => {
      const archive = await rawArchive([{ name: 'package/link', type }])
      await expect(
        unpackTemplate(archive, path.join(temporary, 'output')),
      ).rejects.toThrow(/cannot contain/)
    },
  )

  it('rejects duplicate paths across case-sensitive and insensitive filesystems', async () => {
    const archive = await rawArchive([
      { name: 'package/README.md' },
      { name: 'package/readme.md' },
    ])
    await expect(
      unpackTemplate(archive, path.join(temporary, 'output')),
    ).rejects.toThrow(/Duplicate/)
  })
})

describe('project generation', () => {
  it('creates a standalone starter project and preserves binary assets', async () => {
    const unpacked = await fixture()
    const bytes = Buffer.from([0, 255, 128, 10, 13])
    await writeFile(path.join(unpacked, 'template/content/image.bin'), bytes)
    const destination = path.join(temporary, 'My Docs')
    const prepared = await prepareProject(
      unpacked,
      destination,
      cliVersion,
      'Docs "&" <Guide>',
    )
    await writeProject(prepared.source, prepared.files, destination)
    const project = JSON.parse(
      await readFile(path.join(destination, 'package.json'), 'utf8'),
    )
    expect(project).toMatchObject({
      name: 'my-docs',
      private: true,
      dependencies: { purestack: 'latest' },
    })
    expect(prepared.packageManager).toBe('yarn')
    expect(await readFile(path.join(destination, 'yarn.lock'), 'utf8')).toBe('')
    expect(project.packageManager).toBe('yarn@4.18.1')
    expect(project.devDependencies['@purestack/ts-minidom']).toBe('latest')
    const yarnConfig = await readFile(
      path.join(destination, '.yarnrc.yml'),
      'utf8',
    )
    expect(yarnConfig).toContain('nodeLinker: node-modules')
    expect(yarnConfig).toContain('npmMinimalAgeGate: 0')
    expect(project.dependencies).toMatchObject({
      '@purestack/ts-style': 'latest',
      regor: 'latest',
    })
    expect(
      JSON.parse(
        await readFile(
          path.join(destination, 'content/siteConfig.json'),
          'utf8',
        ),
      ),
    ).toMatchObject({
      siteTitle: 'Docs "&" <Guide>',
      logo: { brand: 'Docs "&" <Guide>' },
    })
    expect(await readFile(path.join(destination, 'content/image.bin'))).toEqual(
      bytes,
    )
    expect(
      await readFile(path.join(destination, '.gitignore'), 'utf8'),
    ).toContain('node_modules/')
    expect(
      await readFile(path.join(destination, 'AGENTS.md'), 'utf8'),
    ).toContain('yarn build')
  })

  it('preserves template dependency selectors instead of replacing them with the CLI version', async () => {
    const unpacked = await fixture()
    const packageFile = path.join(unpacked, 'template/package.json')
    const project = JSON.parse(await readFile(packageFile, 'utf8'))
    project.dependencies.purestack = '1.2.3'
    project.dependencies['@purestack/ts-style'] = '^1.2.0'
    await writeFile(packageFile, JSON.stringify(project))

    await prepareProject(unpacked, path.join(temporary, 'project'), cliVersion)

    expect(
      JSON.parse(await readFile(packageFile, 'utf8')).dependencies,
    ).toEqual(project.dependencies)
  })

  it.each([undefined, 42])(
    'rejects a missing or invalid PureStack dependency (%s)',
    async (dependency) => {
      const unpacked = await fixture()
      const packageFile = path.join(unpacked, 'template/package.json')
      const project = JSON.parse(await readFile(packageFile, 'utf8'))
      project.dependencies.purestack = dependency
      await writeFile(packageFile, JSON.stringify(project))

      await expect(
        prepareProject(unpacked, path.join(temporary, 'project'), cliVersion),
      ).rejects.toThrow(/must declare dependencies.purestack/)
    },
  )

  it('rejects incompatible templates without creating a destination', async () => {
    const unpacked = await fixture()
    const destination = path.join(temporary, 'project')
    await expect(
      prepareProject(unpacked, destination, '0.0.1'),
    ).rejects.toThrow(/requires PureStack/)
    await expect(lstat(destination)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('checks a template minimum numerically and rejects the next major', async () => {
    const unpacked = await fixture()
    const manifestFile = path.join(unpacked, 'template.json')
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
    await writeFile(
      manifestFile,
      JSON.stringify({ ...manifest, purestack: '1.2.9' }),
    )
    await expect(inspectTemplate(unpacked, '1.10.0')).resolves.toBeDefined()
    await expect(inspectTemplate(unpacked, '1.2.8')).rejects.toThrow(
      /requires PureStack/,
    )
    await expect(inspectTemplate(unpacked, '2.0.0')).rejects.toThrow(
      /same major/,
    )
  })

  it('rejects template ranges before creating a destination', async () => {
    const unpacked = await fixture()
    const manifestFile = path.join(unpacked, 'template.json')
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
    await writeFile(
      manifestFile,
      JSON.stringify({ ...manifest, purestack: `^${cliVersion}` }),
    )
    const destination = path.join(temporary, 'project')
    await expect(
      prepareProject(unpacked, destination, cliVersion),
    ).rejects.toThrow(/minimum version/)
    await expect(lstat(destination)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('creates an independent Yarn project inside a parent workspace', async () => {
    await writeFile(
      path.join(temporary, 'package.json'),
      JSON.stringify({
        name: 'parent-workspace',
        private: true,
        packageManager: 'yarn@4.18.1',
        workspaces: ['packages/*'],
      }),
    )
    const parentLock = '# Parent workspace lockfile\n'
    await writeFile(path.join(temporary, 'yarn.lock'), parentLock)
    const unpacked = await fixture()
    const directory = path.join(temporary, 'sites/nested-site')
    await createSite(
      plan(directory, 'starter'),
      cliVersion,
      temporary,
      undefined,
      { templateRoot: unpacked },
    )
    const output = await managers.runYarn(
      ['workspaces', 'list', '--json'],
      directory,
      { capture: true },
    )
    expect(JSON.parse(output)).toEqual({ location: '.', name: 'nested-site' })
    expect(await readFile(path.join(temporary, 'yarn.lock'), 'utf8')).toBe(
      parentLock,
    )
  })

  it('preserves a lockfile supplied by the template', async () => {
    const unpacked = await fixture()
    const lockfile = '# Template lockfile\n'
    await writeFile(path.join(unpacked, 'template/yarn.lock'), lockfile)
    const directory = path.join(temporary, 'project')
    const prepared = await prepareProject(unpacked, directory, cliVersion)
    await writeProject(prepared.source, prepared.files, directory)
    expect(await readFile(path.join(directory, 'yarn.lock'), 'utf8')).toBe(
      lockfile,
    )
  })

  it.each([
    'pnpm@10.0.0',
    'yarn@latest',
    'yarn@4.18.1;echo unexpected',
    'yarn@4.18.1+sha512.abcdef',
    'yarn@4.18.1\n',
    42,
  ])(
    'rejects an unsupported or unpinned package manager: %s',
    async (packageManager) => {
      const unpacked = await fixture()
      const packageFile = path.join(unpacked, 'template/package.json')
      const project = JSON.parse(await readFile(packageFile, 'utf8'))
      await writeFile(
        packageFile,
        JSON.stringify({ ...project, packageManager }),
      )
      await expect(
        prepareProject(unpacked, path.join(temporary, 'project'), cliVersion),
      ).rejects.toThrow(/packageManager must pin/)
    },
  )

  it('rejects unsupported manifest versions and missing guidance', async () => {
    const unpacked = await fixture()
    const destination = path.join(temporary, 'project')
    const manifestFile = path.join(unpacked, 'template.json')
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
    await writeFile(
      manifestFile,
      JSON.stringify({ ...manifest, formatVersion: 2 }),
    )
    await expect(
      prepareProject(unpacked, destination, cliVersion),
    ).rejects.toThrow(/unsupported/)
    await writeFile(manifestFile, JSON.stringify(manifest))
    await rm(path.join(unpacked, 'template/AGENTS.md'))
    await expect(
      prepareProject(unpacked, destination, cliVersion),
    ).rejects.toThrow(/missing AGENTS.md/)
  })

  it.each([
    'workspace:^',
    'file:../../packages/example',
    'link:../example',
    'portal:../example',
    'github:owner/repository',
    'git+https://github.com/owner/repository.git',
    'git@github.com:owner/repository.git',
    'owner/repository',
    'https://example.com/package.tgz',
    '//example.com/package.tgz',
    './package.tgz',
    'package.tgz',
    'package.tar.gz',
    'npm:example@https://example.com/package.tgz',
    'npm:example@file:../example',
    'C:\\packages\\example',
    '.',
    '..',
    ' package.tgz ',
    '',
    '{{unknown}}',
    '{{purestackVersion}}',
  ])('rejects nonportable dependency %s', async (version) => {
    const unpacked = await fixture()
    const packageFile = path.join(unpacked, 'template/package.json')
    const project = JSON.parse(await readFile(packageFile, 'utf8'))
    project.dependencies.example = version
    await writeFile(packageFile, JSON.stringify(project))
    await expect(
      prepareProject(unpacked, path.join(temporary, 'project'), cliVersion),
    ).rejects.toThrow(/published dependency/)
  })

  it.each([
    '1.2.3',
    '^1.2.3',
    '~1.2.3',
    '>=1 <2',
    '*',
    'latest',
    '1.2.3-beta.1',
    'npm:other@^1.2.3',
    'npm:@company/other@latest',
    'npm:other',
  ])('accepts registry dependency selector %s', async (version) => {
    const unpacked = await fixture()
    const packageFile = path.join(unpacked, 'template/package.json')
    const project = JSON.parse(await readFile(packageFile, 'utf8'))
    project.dependencies.example = version
    await writeFile(packageFile, JSON.stringify(project))
    await prepareProject(unpacked, path.join(temporary, 'project'), cliVersion)
    expect(
      JSON.parse(await readFile(packageFile, 'utf8')).dependencies.example,
    ).toBe(version)
  })

  it('rejects template install hooks', async () => {
    const unpacked = await fixture()
    const packageFile = path.join(unpacked, 'template/package.json')
    const project = JSON.parse(await readFile(packageFile, 'utf8'))
    project.scripts.postinstall = 'echo surprise'
    await writeFile(packageFile, JSON.stringify(project))
    await expect(
      prepareProject(unpacked, path.join(temporary, 'project'), cliVersion),
    ).rejects.toThrow(/installation hook/)
  })

  it('preserves existing files and rejects a destination that changed after validation', async () => {
    const unpacked = await fixture()
    const destination = path.join(temporary, 'project')
    const prepared = await prepareProject(unpacked, destination, cliVersion)
    await mkdir(destination)
    await assertEmptyDestination(destination)
    await writeFile(path.join(destination, 'keep.txt'), 'keep me')
    await expect(
      writeProject(prepared.source, prepared.files, destination),
    ).rejects.toThrow(/empty directory/)
    expect(await readdir(destination)).toEqual(['keep.txt'])
    expect(await readFile(path.join(destination, 'keep.txt'), 'utf8')).toBe(
      'keep me',
    )
  })

  it.each([undefined, new AbortController().signal])(
    'fetches local folders with disabled lifecycle scripts and optional cancellation (%s)',
    async (signal) => {
      const pack = vi
        .spyOn(processes, 'runNpm')
        .mockResolvedValue(JSON.stringify([{ filename: 'template.tgz' }]))
      expect(
        await fetchTemplate('./template', temporary, repository, signal),
      ).toBe(path.join(temporary, 'template.tgz'))
      expect(pack.mock.calls[0]).toEqual([
        [
          'pack',
          path.join(repository, 'template'),
          '--ignore-scripts',
          '--json',
          '--pack-destination',
          temporary,
        ],
        repository,
        { capture: true, signal },
      ])
      expect(pack.mock.calls[0][2]?.signal).toBe(signal)
    },
  )

  it('preserves the project and gives retry instructions when installation fails', async () => {
    const archive = await archiveFixture()
    const destination = path.join(temporary, 'project')
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const install = vi
      .spyOn(managers, 'runPackageManager')
      .mockRejectedValue(new Error('offline'))
    const result = await createSite(
      plan(destination, archive, { install: true }),
      cliVersion,
      repository,
    )
    expect(result.installed).toBe(false)
    expect(install).toHaveBeenCalledWith(
      'yarn',
      ['install', '--no-immutable'],
      destination,
      { capture: true, signal: undefined },
    )
    expect(result.failures).toEqual([
      expect.stringContaining('Retry yarn install'),
    ])
    expect(
      await readFile(path.join(destination, 'README.md'), 'utf8'),
    ).toContain('PureStack')
  })

  it('skips Git initialization inside an existing repository', async () => {
    const archive = await archiveFixture()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const git = vi
      .spyOn(processes, 'runProcess')
      .mockResolvedValue(`${repository}\n`)
    const npm = vi.spyOn(managers, 'runPackageManager')
    const result = await createSite(
      plan(path.join(temporary, 'project'), archive, { git: true }),
      cliVersion,
      repository,
    )
    expect(result.git).toBe('existing')
    expect(git).toHaveBeenCalledTimes(1)
    expect(git.mock.calls[0].slice(0, 2)).toEqual([
      'git',
      ['rev-parse', '--show-toplevel'],
    ])
    expect(npm).not.toHaveBeenCalled()
  })

  it.each([undefined, new AbortController().signal])(
    'initializes Git outside a repository with optional cancellation (%s)',
    async (signal) => {
      const archive = await archiveFixture()
      const destination = path.join(temporary, 'project')
      vi.spyOn(console, 'log').mockImplementation(() => {})
      const git = vi
        .spyOn(processes, 'runProcess')
        .mockRejectedValueOnce(new Error('not a repository'))
        .mockResolvedValueOnce('Initialized repository')
      await createSite(
        plan(destination, archive, { git: true }),
        cliVersion,
        repository,
        undefined,
        { signal },
      )
      expect(git.mock.lastCall).toEqual([
        'git',
        ['init'],
        destination,
        { capture: true, signal },
      ])
      expect(git.mock.lastCall?.[3]?.signal).toBe(signal)
      expect(git).toHaveBeenCalledTimes(2)
    },
  )

  it('does not install dependencies or initialize Git unless requested', async () => {
    const archive = await archiveFixture()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const npm = vi.spyOn(managers, 'runPackageManager')
    const git = vi.spyOn(processes, 'runProcess')
    await createSite(
      plan(path.join(temporary, 'project'), archive),
      cliVersion,
      repository,
    )
    expect(npm).not.toHaveBeenCalled()
    expect(git).not.toHaveBeenCalled()
  })

  it('rejects npm pack results pointing outside the temporary directory', async () => {
    vi.spyOn(processes, 'runNpm').mockResolvedValue(
      JSON.stringify([{ filename: '../outside.tgz' }]),
    )
    await expect(
      fetchTemplate('starter', temporary, repository),
    ).rejects.toThrow(/invalid template archive path/)
  })

  it('preserves explicitly included dotfiles through npm packing and site creation', async () => {
    vi.stubEnv('npm_config_cache', path.join(temporary, 'npm-cache'))
    const unpacked = await fixture()
    const archive = await fetchTemplate(unpacked, temporary, repository)
    const directory = path.join(temporary, 'packed-site')
    await createSite(plan(directory, archive), cliVersion, repository)
    for (const file of ['.gitignore', '.yarnrc.yml']) {
      expect(await readFile(path.join(directory, file), 'utf8')).toBe(
        await readFile(path.join(unpacked, 'template', file), 'utf8'),
      )
    }
  })

  it('applies selected settings while preserving template configuration', async () => {
    const archive = await archiveFixture()
    const directory = path.join(temporary, 'configured-site')
    await createSite(
      plan(directory, archive, {
        values: {
          palette: 'mint',
          'navigation-mode': 'none',
          search: false,
          'table-of-contents': false,
          highlight: false,
          'site-url': 'https://example.com/',
          'base-path': '/docs/',
        },
      }),
      cliVersion,
      repository,
    )
    const config = JSON.parse(
      await readFile(path.join(directory, 'content/siteConfig.json'), 'utf8'),
    )
    expect(config).toMatchObject({
      style: { theme: { skin: 'starter', presets: ['mint'] } },
      navigation: { mode: 'none' },
      pagefind: { enabled: false },
      pageToc: { enabled: false },
      mdx: { disableHighlighter: true },
      sitemap: { enabled: true, baseUrl: 'https://example.com' },
      basePath: '/docs',
      outDir: '../dist/dev',
      publishDir: '../dist/publish',
    })
  })

  it('stops subsequent actions on cancellation during installation', async () => {
    const archive = await archiveFixture()
    const cancelled = new Error('Cancelled')
    cancelled.name = 'AbortError'
    vi.spyOn(managers, 'runPackageManager').mockRejectedValue(cancelled)
    const git = vi.spyOn(processes, 'runProcess')
    const directory = path.join(temporary, 'project')
    await expect(
      createSite(
        plan(directory, archive, { install: true, git: true }),
        cliVersion,
        repository,
      ),
    ).rejects.toBe(cancelled)
    expect(git).not.toHaveBeenCalled()
    expect(
      await readFile(path.join(directory, 'package.json'), 'utf8'),
    ).toContain('purestack')
  })
})

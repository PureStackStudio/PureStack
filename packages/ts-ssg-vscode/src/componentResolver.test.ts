import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  clearComponentResolverCaches,
  getComponentSuggestions,
  resolveComponentMetadataTarget,
  resolveComponentTarget,
} from './componentResolver'

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return { ...actual, readFileSync: vi.fn(actual.readFileSync) }
})

const dependencyPackagePath = path.resolve(
  'node_modules',
  '@purestack',
  'ts-components',
)
const dependencyPackageRealPath = fs.realpathSync(dependencyPackagePath)

describe('resolveComponentTarget dependency fallback', () => {
  let isolatedWorkspaceRoot = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-resolver-'),
    )

    const isolatedDependencyPath = path.join(
      isolatedWorkspaceRoot,
      'node_modules',
      '@purestack',
      'ts-components',
    )

    fs.mkdirSync(path.dirname(isolatedDependencyPath), { recursive: true })
    fs.cpSync(dependencyPackageRealPath, isolatedDependencyPath, {
      recursive: true,
    })
  })

  afterAll(() => {
    if (!isolatedWorkspaceRoot) return

    clearComponentResolverCaches(isolatedWorkspaceRoot)
    fs.rmSync(isolatedWorkspaceRoot, { force: true, recursive: true })
  })

  it('resolves a component declared through regorComponents in an installed dependency', () => {
    const target = resolveComponentTarget(isolatedWorkspaceRoot, 'Btn')

    expect(target).toBeDefined()
    expect(target?.filePath).toContain(
      path.join('node_modules', '@purestack', 'ts-components'),
    )
    expect(target?.filePath).toMatch(/btn\.ts$/)
    expect(getResolvedLineText(target?.filePath, target?.line)).toMatch(
      /export\s+interface\s+Btn\b/,
    )
  })

  it('matches dependency components using normalized tag names', () => {
    const target = resolveComponentTarget(isolatedWorkspaceRoot, 'tab-pane')

    expect(target).toBeDefined()
    expect(target?.filePath).toContain(
      path.join('node_modules', '@purestack', 'ts-components'),
    )
    expect(getResolvedLineText(target?.filePath, target?.line)).toMatch(
      /export\s+interface\s+TabPane\b/,
    )
  })

  it('lists dependency component suggestions from regorComponents', () => {
    const suggestions = getComponentSuggestions(isolatedWorkspaceRoot)
    const names = suggestions.map((suggestion) => suggestion.componentName)

    expect(names).toContain('Btn')
    expect(names).toContain('TabPane')
    expect(
      suggestions.find((suggestion) => suggestion.componentName === 'Btn')
        ?.source,
    ).toBe('dependency')
  })

  it('reads each dependency source once for cold completion and performs no reads for cached completion', () => {
    clearComponentResolverCaches(isolatedWorkspaceRoot)
    const read = vi.mocked(fs.readFileSync)
    read.mockClear()
    const suggestions = getComponentSuggestions(isolatedWorkspaceRoot)
    const packageRoot = path.join(
      isolatedWorkspaceRoot,
      'node_modules',
      '@purestack',
      'ts-components',
    )
    const sourceReads = read.mock.calls
      .map(([file]) => String(file))
      .filter(
        (file) =>
          file.startsWith(`${packageRoot}${path.sep}`) && file.endsWith('.ts'),
      )

    expect(suggestions.some((item) => item.componentName === 'Btn')).toBe(true)
    expect(sourceReads.length).toBeGreaterThan(0)
    expect(sourceReads.length).toBe(new Set(sourceReads).size)
    read.mockClear()
    expect(getComponentSuggestions(isolatedWorkspaceRoot)).toBe(suggestions)
    expect(read).not.toHaveBeenCalled()
  })
})

describe('dependency completion semantics', () => {
  let root = '',
    packageRoot = ''
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'purestack-completion-'))
    packageRoot = path.join(root, 'node_modules', 'example-components')
    fs.mkdirSync(path.join(packageRoot, 'src'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src'))
    fs.writeFileSync(
      path.join(packageRoot, 'package.json'),
      JSON.stringify({
        name: 'example-components',
        regorComponents: [
          'Alpha',
          'beta-kebab',
          'PrivateOnly',
          'Missing',
          'Gamma',
        ],
      }),
    )
    fs.writeFileSync(
      path.join(packageRoot, 'src', 'a.ts'),
      [
        'export interface Alpha {}',
        'export interface BetaKebab {}',
        'interface PrivateOnly {}',
        'export interface Helper {}',
      ].join('\n'),
    )
    fs.writeFileSync(
      path.join(packageRoot, 'src', 'z.ts'),
      ['export interface Gamma {}', 'export interface BetaKebab {}'].join('\n'),
    )
    fs.writeFileSync(
      path.join(root, 'src', 'local.ts'),
      [
        'export interface Alpha {}',
        'const alpha = defineComponent<Alpha>()',
      ].join('\n'),
    )
  })
  afterEach(() => {
    clearComponentResolverCaches(root)
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('preserves workspace precedence, normalized manifest filtering, exported-only suggestions, and first-file locations', () => {
    const suggestions = getComponentSuggestions(root)
    expect(suggestions.map((item) => item.componentName)).toEqual([
      'Alpha',
      'BetaKebab',
      'Gamma',
    ])
    expect(suggestions[0]).toMatchObject({
      source: 'workspace',
      filePath: path.join(root, 'src', 'local.ts'),
      line: 0,
    })
    expect(suggestions[1]).toEqual({
      componentName: 'BetaKebab',
      source: 'dependency',
      filePath: fs.realpathSync.native(path.join(packageRoot, 'src', 'a.ts')),
      line: 1,
    })
    expect(suggestions[2]).toEqual({
      componentName: 'Gamma',
      source: 'dependency',
      filePath: fs.realpathSync.native(path.join(packageRoot, 'src', 'z.ts')),
      line: 0,
    })
    expect(resolveComponentTarget(root, 'beta-kebab')).toEqual({
      filePath: suggestions[1].filePath,
      line: suggestions[1].line,
    })
  })

  it('refreshes dependency sources and manifest names when caches are invalidated', () => {
    const initial = getComponentSuggestions(root)
    const manifestPath = path.join(packageRoot, 'package.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    manifest.regorComponents.push('NewComponent')
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))
    fs.writeFileSync(
      path.join(packageRoot, 'src', 'new.ts'),
      'export interface NewComponent {}',
    )
    expect(getComponentSuggestions(root)).toBe(initial)
    clearComponentResolverCaches(root)
    expect(
      getComponentSuggestions(root).map((item) => item.componentName),
    ).toContain('NewComponent')
  })
})

describe('resolveComponentTarget monorepo package workspace', () => {
  afterAll(() => {
    clearComponentResolverCaches()
  })

  it('resolves LandingBand from the canonical ts-components source path when ts-ssg is the workspace root', () => {
    const repoRoot = process.cwd()
    const workspaceRoot = path.join(repoRoot, 'packages', 'ts-ssg')
    const preferredLocalFilePath = path.join(
      workspaceRoot,
      'sample-content',
      'guide',
      'landing-band-sample.mdx',
    )
    const expectedSourcePath = path.join(
      repoRoot,
      'packages',
      'ts-components',
      'src',
      'standard',
      'landing',
      'landingTypes.ts',
    )

    const target = resolveComponentTarget(
      workspaceRoot,
      'LandingBand',
      preferredLocalFilePath,
    )

    expect(target).toBeDefined()
    expect(target?.filePath).toBe(expectedSourcePath)
  })

  it('resolves LandingBand metadata from the split implementation source path', () => {
    const repoRoot = process.cwd()
    const workspaceRoot = path.join(repoRoot, 'packages', 'ts-ssg')
    const preferredLocalFilePath = path.join(
      workspaceRoot,
      'sample-content',
      'guide',
      'landing-band-sample.mdx',
    )
    const expectedSourcePath = path.join(
      repoRoot,
      'packages',
      'ts-components',
      'src',
      'standard',
      'landing',
      'landingBand.ts',
    )

    const target = resolveComponentMetadataTarget(
      workspaceRoot,
      'LandingBand',
      preferredLocalFilePath,
    )

    expect(target).toBeDefined()
    expect(target?.filePath).toBe(expectedSourcePath)
    expect(getResolvedLineText(target?.filePath, target?.line)).toMatch(
      /defineComponent<LandingBand>\(/,
    )
  })
})

describe('resolveComponentTarget cache invalidation', () => {
  let isolatedWorkspaceRoot = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-resolver-cache-'),
    )

    const existingComponentPath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'existingComponent.ts',
    )

    fs.mkdirSync(path.dirname(existingComponentPath), { recursive: true })
    fs.writeFileSync(
      existingComponentPath,
      [
        "import { defineComponent, html } from 'regor'",
        '',
        'export interface ExistingComponent {}',
        '',
        'export function defineExistingComponents() {',
        '  return {',
        '    existingComponent: defineComponent<ExistingComponent>(html`<div/>`, {}),',
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  afterAll(() => {
    if (!isolatedWorkspaceRoot) return

    clearComponentResolverCaches(isolatedWorkspaceRoot)
    fs.rmSync(isolatedWorkspaceRoot, { force: true, recursive: true })
  })

  it('picks up newly added workspace component files after cache invalidation', () => {
    const firstTarget = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'ExistingComponent',
    )
    expect(firstTarget).toBeDefined()
    expect(
      getComponentSuggestions(isolatedWorkspaceRoot).map(
        (suggestion) => suggestion.componentName,
      ),
    ).toContain('ExistingComponent')

    const addedComponentPath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'newComponent.ts',
    )
    fs.writeFileSync(
      addedComponentPath,
      [
        "import { defineComponent, html } from 'regor'",
        '',
        'export interface NewComponent {}',
        '',
        'export function defineNewComponents() {',
        '  return {',
        '    newComponent: defineComponent<NewComponent>(html`<div/>`, {}),',
        '  }',
        '}',
        '',
      ].join('\n'),
    )

    const staleTarget = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'NewComponent',
    )
    expect(staleTarget).toBeUndefined()
    expect(
      getComponentSuggestions(isolatedWorkspaceRoot).map(
        (suggestion) => suggestion.componentName,
      ),
    ).not.toContain('NewComponent')

    clearComponentResolverCaches(isolatedWorkspaceRoot)

    const refreshedTarget = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'NewComponent',
    )
    expect(refreshedTarget).toBeDefined()
    expect(refreshedTarget?.filePath).toBe(addedComponentPath)
    expect(
      getComponentSuggestions(isolatedWorkspaceRoot).map(
        (suggestion) => suggestion.componentName,
      ),
    ).toContain('NewComponent')
  })
})

describe('resolveComponentTarget local same-file fallback', () => {
  let isolatedWorkspaceRoot = ''
  let localComponentPath = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-resolver-local-'),
    )

    localComponentPath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'localComponent.ts',
    )

    fs.mkdirSync(path.dirname(localComponentPath), { recursive: true })
    fs.writeFileSync(
      localComponentPath,
      [
        "import { defineComponent, html } from 'regor'",
        '',
        'interface LocalComponent {}',
        '',
        'export function defineLocalComponents() {',
        '  return {',
        '    localComponent: defineComponent<LocalComponent>(html`<div/>`, {}),',
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  afterAll(() => {
    if (!isolatedWorkspaceRoot) return

    clearComponentResolverCaches(isolatedWorkspaceRoot)
    fs.rmSync(isolatedWorkspaceRoot, { force: true, recursive: true })
  })

  it('resolves a non-exported component type when the active file matches', () => {
    const target = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'LocalComponent',
      localComponentPath,
    )

    expect(target).toBeDefined()
    expect(target?.filePath).toBe(localComponentPath)
    expect(getResolvedLineText(target?.filePath, target?.line)).toMatch(
      /interface\s+LocalComponent\b/,
    )
  })

  it('keeps non-exported component types hidden from other files', () => {
    const target = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'LocalComponent',
      path.join(isolatedWorkspaceRoot, 'src', 'otherFile.ts'),
    )

    expect(target).toBeUndefined()
  })

  it('does not treat imported type specifiers as local declarations', () => {
    const importedComponentPath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'importedComponent.ts',
    )
    fs.writeFileSync(
      importedComponentPath,
      [
        "import { type ImportedComponent } from './other'",
        '',
        'export function defineImportedComponents() {',
        '  return {',
        '    importedComponent: defineComponent<ImportedComponent>(html`<div/>`, {}),',
        '  }',
        '}',
        '',
      ].join('\n'),
    )

    const target = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'ImportedComponent',
      importedComponentPath,
    )

    expect(target).toBeUndefined()
  })

  it('does not treat multiline imported type specifiers as local declarations', () => {
    const importedComponentPath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'importedComponentMultiline.ts',
    )
    fs.writeFileSync(
      importedComponentPath,
      [
        'import {',
        '  type ImportedComponent,',
        "} from './other'",
        '',
        'export function defineImportedComponents() {',
        '  return {',
        '    importedComponent: defineComponent<ImportedComponent>(html`<div/>`, {}),',
        '  }',
        '}',
        '',
      ].join('\n'),
    )

    const target = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'ImportedComponent',
      importedComponentPath,
    )

    expect(target).toBeUndefined()
  })
})

function getResolvedLineText(filePath?: string, line?: number) {
  if (!filePath || line === undefined) return ''

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  return lines[line] ?? ''
}

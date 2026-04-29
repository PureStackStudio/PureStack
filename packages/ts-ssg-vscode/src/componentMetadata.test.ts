import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  clearComponentMetadataCache,
  getComponentMetadata,
} from './componentMetadata'
import {
  clearComponentResolverCaches,
  resolveComponentTarget,
} from './componentResolver'
import { getComponentTagContextAtOffset } from './componentTagContext'

describe('getComponentMetadata cache invalidation', () => {
  let isolatedWorkspaceRoot = ''
  let existingComponentFilePath = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-metadata-'),
    )

    fs.writeFileSync(
      path.join(isolatedWorkspaceRoot, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            target: 'ES2020',
          },
          include: ['src/**/*.ts'],
        },
        null,
        2,
      ),
    )

    existingComponentFilePath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'existingComponent.ts',
    )
    fs.mkdirSync(path.dirname(existingComponentFilePath), { recursive: true })
    fs.writeFileSync(
      existingComponentFilePath,
      [
        "import { defineComponent, html, type RefOrValue } from 'regor'",
        '',
        'export interface ExistingComponent {',
        '  tone?: RefOrValue<"info">',
        '}',
        '',
        'export function defineExistingComponents() {',
        '  return {',
        "    existingComponent: defineComponent<ExistingComponent>(html`<div/>`, { props: ['tone'] }),",
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  afterAll(() => {
    clearComponentMetadataCache()
    if (!isolatedWorkspaceRoot) return

    fs.rmSync(isolatedWorkspaceRoot, { force: true, recursive: true })
  })

  it('picks up newly added project files after cache invalidation', () => {
    const firstMetadata = getComponentMetadata(
      existingComponentFilePath,
      'ExistingComponent',
    )
    expect(firstMetadata?.props[0]?.literalValues).toEqual(['info'])

    const addedComponentFilePath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'newComponent.ts',
    )
    fs.writeFileSync(
      addedComponentFilePath,
      [
        "import { defineComponent, html, type RefOrValue } from 'regor'",
        '',
        'export interface NewComponent {',
        '  tone?: RefOrValue<"danger">',
        '}',
        '',
        'export function defineNewComponents() {',
        '  return {',
        "    newComponent: defineComponent<NewComponent>(html`<div/>`, { props: ['tone'] }),",
        '  }',
        '}',
        '',
      ].join('\n'),
    )

    const staleMetadata = getComponentMetadata(
      addedComponentFilePath,
      'NewComponent',
    )
    expect(staleMetadata).toBeUndefined()

    clearComponentMetadataCache(existingComponentFilePath)

    const refreshedMetadata = getComponentMetadata(
      addedComponentFilePath,
      'NewComponent',
    )
    expect(refreshedMetadata?.props[0]?.literalValues).toEqual(['danger'])
  })
})

describe('getComponentMetadata attribute naming', () => {
  let isolatedWorkspaceRoot = ''
  let componentFilePath = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-attribute-name-'),
    )

    fs.writeFileSync(
      path.join(isolatedWorkspaceRoot, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            target: 'ES2020',
          },
          include: ['src/**/*.ts'],
        },
        null,
        2,
      ),
    )

    componentFilePath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'namedComponent.ts',
    )
    fs.mkdirSync(path.dirname(componentFilePath), { recursive: true })
    fs.writeFileSync(
      componentFilePath,
      [
        "import { defineComponent, html, type RefOrValue } from 'regor'",
        '',
        'export interface NamedComponent {',
        '  buttonStyle?: RefOrValue<"primary">',
        '}',
        '',
        'export function defineNamedComponents() {',
        '  return {',
        "    namedComponent: defineComponent<NamedComponent>(html`<div/>`, { props: ['buttonStyle'] }),",
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  afterAll(() => {
    clearComponentMetadataCache()
    if (!isolatedWorkspaceRoot) return

    fs.rmSync(isolatedWorkspaceRoot, { force: true, recursive: true })
  })

  it('preserves the prop name as the suggested attribute name', () => {
    const metadata = getComponentMetadata(componentFilePath, 'NamedComponent')
    expect(metadata?.props[0]?.propName).toBe('buttonStyle')
    expect(metadata?.props[0]?.attributeName).toBe('buttonStyle')
  })
})

describe('getComponentMetadata open string literal unions', () => {
  let isolatedWorkspaceRoot = ''
  let componentFilePath = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-open-string-union-'),
    )

    fs.writeFileSync(
      path.join(isolatedWorkspaceRoot, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            target: 'ES2020',
          },
          include: ['src/**/*.ts'],
        },
        null,
        2,
      ),
    )

    componentFilePath = path.join(
      isolatedWorkspaceRoot,
      'src',
      'cssComponent.ts',
    )
    fs.mkdirSync(path.dirname(componentFilePath), { recursive: true })
    fs.writeFileSync(
      componentFilePath,
      [
        "import { defineComponent, html, type RefOrValue } from 'regor'",
        '',
        'type CSSProps = {',
        "  alignItems: 'baseline' | 'center' | 'flex-start' | (string & {})",
        '}',
        '',
        'export interface CssComponent {',
        "  alignItems?: RefOrValue<CSSProps['alignItems']>",
        '}',
        '',
        'export function defineCssComponents() {',
        '  return {',
        "    cssComponent: defineComponent<CssComponent>(html`<div/>`, { props: ['alignItems'] }),",
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  afterAll(() => {
    clearComponentMetadataCache()
    if (!isolatedWorkspaceRoot) return

    fs.rmSync(isolatedWorkspaceRoot, { force: true, recursive: true })
  })

  it('keeps literal completions from indexed access types that allow custom strings', () => {
    const metadata = getComponentMetadata(componentFilePath, 'CssComponent')

    expect(metadata?.props[0]?.valueKind).toBe('union')
    expect(metadata?.props[0]?.literalValues).toEqual([
      'baseline',
      'center',
      'flex-start',
    ])
  })
})

describe('getComponentMetadata monorepo component metadata', () => {
  afterAll(() => {
    clearComponentMetadataCache()
    clearComponentResolverCaches()
  })

  it('resolves imported CSSProps indexed access types from the real workspace', () => {
    const componentFilePath = path.join(
      process.cwd(),
      'packages',
      'ts-components',
      'src',
      'standard',
      'landing',
      'landing.ts',
    )

    const metadata = getComponentMetadata(componentFilePath, 'LandingBand')
    const alignItems = metadata?.props.find(
      (prop) => prop.propName === 'alignItems',
    )

    expect(alignItems?.signature).toBe(
      "alignItems?: RefOrValue<CSSProps['alignItems']>",
    )
    expect(alignItems?.valueKind).toBe('union')
    expect(alignItems?.literalValues).toEqual(
      expect.arrayContaining([
        'baseline',
        'center',
        'flex-start',
        'stretch',
        'safe',
        'unsafe',
      ]),
    )
  })

  it('resolves value completions from the real MDX cursor context', () => {
    const workspaceRoot = process.cwd()
    const mdxFilePath = path.join(
      workspaceRoot,
      'packages',
      'ts-ssg',
      'sample-content',
      'guide',
      'landing-band-sample.mdx',
    )
    const mdxText = fs.readFileSync(mdxFilePath, 'utf8')
    const sectionStart = mdxText.indexOf('## 6. Quiet separator band')
    const attributeStart = mdxText.indexOf('alignItems="center"', sectionStart)
    expect(sectionStart).toBeGreaterThanOrEqual(0)
    expect(attributeStart).toBeGreaterThanOrEqual(0)

    const cursorOffset = attributeStart + 'alignItems="'.length

    const tagContext = getComponentTagContextAtOffset(mdxText, cursorOffset)
    expect(tagContext?.componentName).toBe('LandingBand')
    expect(tagContext?.activeAttributeName).toBe('alignItems')

    const target = resolveComponentTarget(
      workspaceRoot,
      tagContext?.componentName ?? '',
      mdxFilePath,
    )
    expect(target?.filePath).toContain(
      path.join('packages', 'ts-components', 'src', 'standard', 'landing'),
    )

    const metadata = target
      ? getComponentMetadata(target.filePath, tagContext?.componentName ?? '')
      : undefined
    const activeProp = metadata?.props.find(
      (prop) => prop.attributeName === tagContext?.activeAttributeName,
    )

    expect(activeProp?.signature).toBe(
      "alignItems?: RefOrValue<CSSProps['alignItems']>",
    )
    expect(activeProp?.literalValues).toEqual(
      expect.arrayContaining(['center', 'flex-start', 'stretch']),
    )
  })
})

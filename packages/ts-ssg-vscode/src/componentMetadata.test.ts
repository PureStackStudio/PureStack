import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  clearComponentMetadataCache,
  getComponentMetadata,
} from './componentMetadata'
import { clearComponentResolverCaches } from './componentResolver'
import { getComponentTagContextAtOffset } from './componentTagContext'
import runtimeTs, {
  getTypescriptRuntimePath,
  setTypescriptWorkspaceRoots,
} from './typescriptRuntime'

const extensionRoot = path.resolve(__dirname, '..')
setTypescriptWorkspaceRoots([extensionRoot])

describe('TypeScript runtime', () => {
  it('uses the bundled compiler API for a TypeScript 7 workspace', () => {
    setTypescriptWorkspaceRoots([path.resolve(extensionRoot, '../..')])
    try {
      expect(getTypescriptRuntimePath()).toBe('bundled TypeScript 6')
      expect(typeof runtimeTs.createSourceFile).toBe('function')
    } finally {
      setTypescriptWorkspaceRoots([extensionRoot])
    }
  })
})

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

describe('getComponentMetadata Emits event attributes', () => {
  let isolatedWorkspaceRoot = ''
  let componentFilePath = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-emits-'),
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
      'dialogComponent.ts',
    )
    fs.mkdirSync(path.dirname(componentFilePath), { recursive: true })
    fs.writeFileSync(
      componentFilePath,
      [
        "import { defineComponent, html, type Emits, type RefOrValue } from 'regor'",
        '',
        'export interface DialogComponent {',
        '  tone?: RefOrValue<"info">',
        "  signals?: Emits<'close' | 'cancel'>",
        '}',
        '',
        'export function defineDialogComponents() {',
        '  return {',
        "    dialogComponent: defineComponent<DialogComponent>(html`<div/>`, { props: ['tone'] }),",
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

  it('discovers event attributes from Emits fields regardless of field name', () => {
    const metadata = getComponentMetadata(componentFilePath, 'DialogComponent')

    expect(metadata?.props.map((prop) => prop.attributeName)).toEqual(['tone'])
    expect(metadata?.events.map((event) => event.attributeName)).toEqual([
      '@close',
      '@cancel',
    ])
    expect(metadata?.events.map((event) => event.eventName)).toEqual([
      'close',
      'cancel',
    ])
    expect(metadata?.events[0]?.signature).toBe(
      "signals?: Emits<'close' | 'cancel'>",
    )
  })

  it('recognizes emitted event attributes in MDX component tags', () => {
    const mdxText = '<DialogComponent @close="closeDialog" />'
    const cursorOffset = mdxText.indexOf('@close="') + '@close="'.length

    const tagContext = getComponentTagContextAtOffset(mdxText, cursorOffset)

    expect(tagContext?.componentName).toBe('DialogComponent')
    expect(tagContext?.activeAttributeName).toBe('@close')
    expect(tagContext?.attributeNames.has('@close')).toBe(true)
  })

  it('recognizes emitted event attributes in TypeScript tagged templates', () => {
    const sourceText =
      'const template = html`<DialogComponent @cancel="cancelDialog" />`'
    const cursorOffset = sourceText.indexOf('@cancel="') + '@cancel="'.length

    const tagContext = getComponentTagContextAtOffset(sourceText, cursorOffset)

    expect(tagContext?.componentName).toBe('DialogComponent')
    expect(tagContext?.activeAttributeName).toBe('@cancel')
    expect(tagContext?.attributeNames.has('@cancel')).toBe(true)
  })
})

describe('getComponentMetadata type-only fallback', () => {
  let isolatedWorkspaceRoot = ''
  let componentFilePath = ''

  beforeAll(() => {
    isolatedWorkspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'purestack-component-type-only-'),
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
      'typeOnlyComponent.ts',
    )
    fs.mkdirSync(path.dirname(componentFilePath), { recursive: true })
    fs.writeFileSync(
      componentFilePath,
      [
        'type ComputedRef<T> = () => T',
        'type Emits<T extends string> = { emit: (eventName: T) => void }',
        'type RefOrValue<T> = T',
        '',
        'export interface TypeOnlyComponent {',
        '  tone?: RefOrValue<"info" | "danger">',
        '  label?: RefOrValue<string>',
        "  signals?: Emits<'close' | 'cancel'>",
        '  classes?: ComputedRef<string>',
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

  it('uses public type properties when no defineComponent metadata is available', () => {
    const metadata = getComponentMetadata(
      componentFilePath,
      'TypeOnlyComponent',
    )

    expect(metadata?.signature).toBe('interface TypeOnlyComponent')
    expect(metadata?.props.map((prop) => prop.propName)).toEqual([
      'tone',
      'label',
    ])
    expect(metadata?.events.map((event) => event.attributeName)).toEqual([
      '@close',
      '@cancel',
    ])

    const tone = metadata?.props.find((prop) => prop.propName === 'tone')
    expect(tone?.signature).toBe('tone?: RefOrValue<"info" | "danger">')
    expect(tone?.literalValues).toEqual(['info', 'danger'])
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
      'landingBand.ts',
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
})

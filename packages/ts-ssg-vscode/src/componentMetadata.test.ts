import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  clearComponentMetadataCache,
  getComponentMetadata,
} from './componentMetadata'

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

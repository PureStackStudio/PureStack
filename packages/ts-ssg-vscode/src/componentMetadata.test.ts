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

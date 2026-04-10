import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  clearComponentResolverCaches,
  resolveComponentTarget,
} from './componentResolver'

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

    clearComponentResolverCaches(isolatedWorkspaceRoot)

    const refreshedTarget = resolveComponentTarget(
      isolatedWorkspaceRoot,
      'NewComponent',
    )
    expect(refreshedTarget).toBeDefined()
    expect(refreshedTarget?.filePath).toBe(addedComponentPath)
  })
})

function getResolvedLineText(filePath?: string, line?: number) {
  if (!filePath || line === undefined) return ''

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  return lines[line] ?? ''
}

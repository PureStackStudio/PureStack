import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveComponentTarget } from './componentResolver'

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

function getResolvedLineText(filePath?: string, line?: number) {
  if (!filePath || line === undefined) return ''

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  return lines[line] ?? ''
}

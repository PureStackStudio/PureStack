import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { invocationDirectory } from './invocation'

describe('CLI invocation directory', () => {
  const root = path.resolve('repository')
  const sites = path.join(root, 'sites')

  it('uses the original caller directory when the purestack package script changes cwd', () => {
    expect(
      invocationDirectory(root, {
        INIT_CWD: sites,
        npm_lifecycle_event: 'purestack',
      }),
    ).toBe(sites)
  })

  it('keeps direct tsx and installed CLI invocations in their actual working directory', () => {
    expect(invocationDirectory(sites, {})).toBe(sites)
    expect(
      invocationDirectory(sites, {
        INIT_CWD: root,
        npm_lifecycle_event: 'tsx',
      }),
    ).toBe(sites)
  })

  it('ignores a relative or missing launcher directory', () => {
    expect(
      invocationDirectory(sites, {
        INIT_CWD: 'elsewhere',
        npm_lifecycle_event: 'purestack',
      }),
    ).toBe(sites)
    expect(
      invocationDirectory(sites, { npm_lifecycle_event: 'purestack' }),
    ).toBe(sites)
  })
})

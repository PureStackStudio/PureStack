import { describe, expect, it } from 'vitest'
import { isCompatibleVersion, parseVersion } from './version'

describe('release versions', () => {
  it('parses numeric release components', () => {
    expect(parseVersion('1.10.123')).toEqual({
      major: 1,
      minor: 10,
      patch: 123,
    })
    expect(parseVersion('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 })
  })

  it.each([
    '',
    '1.2',
    '1.2.3.4',
    '01.2.3',
    '1.02.3',
    '1.2.03',
    '-1.2.3',
    'v1.2.3',
    '^1.2.3',
    '>=1.2.3',
    '1.2.x',
    '1.2.3-beta.1',
    '1.2.3+build',
    ' 1.2.3',
    '1.2.3\n',
    '9007199254740992.0.0',
    '1.9007199254740992.0',
    '1.0.9007199254740992',
  ])('rejects unsupported version %j', (value) => {
    expect(parseVersion(value)).toBeUndefined()
  })

  it.each([
    ['1.2.9', '1.2.9', true],
    ['1.2.10', '1.2.9', true],
    ['1.10.0', '1.2.9', true],
    ['1.2.8', '1.2.9', false],
    ['1.1.99', '1.2.9', false],
    ['2.0.0', '1.2.9', false],
    ['0.2.0', '0.1.9', true],
    ['1.0.0', '0.1.9', false],
    ['1.2.9-beta.1', '1.2.9', false],
    ['1.2.9', '^1.2.9', false],
  ])('%s meets minimum %s: %s', (current, minimum, compatible) => {
    expect(isCompatibleVersion(current, minimum)).toBe(compatible)
  })
})

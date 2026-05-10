import { createDom } from '@purestack/ts-minidom'
import { ref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createAutoId } from './autoId'

describe('createAutoId', () => {
  it('uses plain generated ids outside minidom', () => {
    const resolveId = createAutoId('form-input')

    expect(resolveId()).toBe('form-input-1')
    expect(resolveId()).toBe('form-input-2')
  })

  it('marks generated ids rendered in minidom', () => {
    const cleanupDom = createDom(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    )
    const resolveId = createAutoId('form-input')

    try {
      expect(resolveId()).toBe('form-input-s-1')
      expect(resolveId(ref('auth-email'))).toBe('auth-email')
      expect(resolveId()).toBe('form-input-s-2')
    } finally {
      cleanupDom()
    }
  })
})

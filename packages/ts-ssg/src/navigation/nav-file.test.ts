import fs from 'node:fs/promises'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveNavigationConfig } from './config'
import { loadCustomNavigation } from './nav-file'

describe('navigation file roots', () => {
  afterEach(() => vi.restoreAllMocks())

  it.each([
    ['  ///guide///  ', 'guide'],
    ['reference/', 'docs/reference'],
    ['reference\\nested\\', 'docs/reference/nested'],
    ['///', '.'],
    ['.', 'docs'],
    ['', undefined],
    [`guide${'/'.repeat(200_000)}x`, 'docs/guide/x'],
    [`${'/'.repeat(200_000)}guide${'/'.repeat(200_000)}`, 'guide'],
  ])('normalizes root case %#', async (root, expected) => {
    vi.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify({ root }))
    const navigation = await loadCustomNavigation(
      'content',
      new Set(['docs']),
      resolveNavigationConfig(),
    )
    expect(navigation.docs.root).toBe(expected)
  })

  it.each(['../../outside', '/../../outside', '..\\..\\outside'])(
    'rejects traversal root %j',
    async (root) => {
      vi.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify({ root }))
      await expect(
        loadCustomNavigation(
          'content',
          new Set(['docs']),
          resolveNavigationConfig(),
        ),
      ).rejects.toThrow('Navigation roots must stay inside the content root.')
    },
  )
})

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { writeHtml } from './io'

describe('writeHtml', () => {
  it('minifies html output when enabled', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-io-'))
    try {
      const outPath = path.join(root, 'index.html')
      const html =
        '<!doctype html>\n<html>\n  <body>\n    <p>Hello</p>\n  </body>\n</html>\n'
      await writeHtml({ outPath, html, minify: true })
      const written = await fs.readFile(outPath, 'utf8')
      expect(written).toContain('<!doctype html>')
      expect(written).toContain('<html>')
      expect(written).toContain('<body>')
      expect(written).toContain('<p>Hello')
      expect(written).not.toContain('\n')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('preserves prose spacing around inline elements when minifying', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-io-'))
    try {
      const outPath = path.join(root, 'index.html')
      const html = [
        '<!doctype html>',
        '<html>',
        '<body>',
        '<p>through <code>BlockCacheLifeTime</code> and <code>InactiveBlockCacheCleanupInterval</code>.</p>',
        '</body>',
        '</html>',
      ].join('\n')

      await writeHtml({ outPath, html, minify: true })

      const written = await fs.readFile(outPath, 'utf8')
      expect(written).toContain(
        'through <code>BlockCacheLifeTime</code> and <code>InactiveBlockCacheCleanupInterval</code>.',
      )
      expect(written).not.toContain('through<code>')
      expect(written).not.toContain('</code>and<code>')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

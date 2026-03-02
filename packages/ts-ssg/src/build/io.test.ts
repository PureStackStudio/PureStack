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
      expect(written).toContain('<p>Hello')
      expect(written).not.toContain('\n')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

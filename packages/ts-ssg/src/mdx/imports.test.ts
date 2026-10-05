import fs from 'node:fs/promises'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeRepoTempDir } from '../test/repoTempDir'
import { expandImports } from './imports'

describe('expandImports', () => {
  let contentDir: string

  beforeAll(async () => {
    contentDir = await makeRepoTempDir('.tmp-ts-ssg-import-codeblock-')
    const files: Record<string, string> = {
      'guides/demo.ts': 'export const answer = 42\n',
      'guides/styles.css': '.demo { color: red; }\n',
      'shared/fence.md': 'Use a fence:\r\n\r\n```ts\r\nconst x = 1\r\n```\r\n',
      'guides/data.unknown': 'plain',
      'shared/_note.mdx':
        'A **shared** note.\r\n\r\n<import-codeblock src="./snippet.ts"/>\r\n',
      'shared/snippet.ts': 'const shared = true',
      '_partials/install.md': 'Run the installer.',
      'guides/_front.mdx': '---\ntitle: Shared\n---\nBody',
      'guides/_a.mdx': '<import-content src="./_b.mdx"/>',
      'guides/_b.mdx': '<import-content src="./_a.mdx"/>',
      'guides/notes.mdx': 'A page of its own.',
      'guides/_rule.mdx': '---\n\nAfter a rule.',
    }
    for (const [relPath, contents] of Object.entries(files)) {
      await fs.mkdir(path.join(contentDir, path.dirname(relPath)), {
        recursive: true,
      })
      await fs.writeFile(path.join(contentDir, relPath), contents)
    }
  })

  afterAll(async () => {
    await fs.rm(contentDir, { recursive: true, force: true })
  })

  const expand = (source: string, onImport?: (relPath: string) => void) =>
    expandImports(source, {
      contentDir,
      sourceRelPath: path.join('guides', 'page.mdx'),
      onImport,
    })

  it('replaces the tag with a code block holding the file, its language from the extension', async () => {
    expect(
      await expand('Before\n<import-codeblock src="./demo.ts"/>\nAfter'),
    ).toBe('Before\n\n```typescript\nexport const answer = 42\n```\n\nAfter')
  })

  it('takes the language from lang when given, and none for an unknown extension', async () => {
    expect(
      await expand('<import-codeblock src="./styles.css" lang="scss"/>'),
    ).toBe('\n```scss\n.demo { color: red; }\n```\n')
    expect(await expand('<import-codeblock src="./data.unknown"/>')).toBe(
      '\n```\nplain\n```\n',
    )
  })

  it('resolves src from the page, reports each import, and keeps line endings uniform', async () => {
    const imports: string[] = []

    const expanded = await expand(
      '<import-codeblock src="../shared/fence.md"/>',
      (relPath) => imports.push(relPath),
    )

    expect(imports).toEqual(['shared/fence.md'])
    // A longer fence keeps the file's own fence inside the block.
    expect(expanded).toBe(
      '\n````markdown\nUse a fence:\n\n```ts\nconst x = 1\n```\n````\n',
    )
  })

  it('puts the code block on lines of its own inside indented Regor markup', async () => {
    expect(
      await expand(
        '<TabPane id="code">\n  <import-codeblock src="./demo.ts"/>\n</TabPane>',
      ),
    ).toBe(
      '<TabPane id="code">\n  \n```typescript\nexport const answer = 42\n```\n\n</TabPane>',
    )
  })

  it('leaves tags inside code as written', async () => {
    const source = [
      'Write `<import-codeblock src="./demo.ts"/>` in a page:',
      '',
      '```mdx',
      '<import-codeblock src="./demo.ts"/>',
      '```',
    ].join('\n')

    expect(await expand(source)).toBe(source)
  })

  it.each([
    [
      '<import-codeblock src="./demo.ts"></import-codeblock>',
      'Code block import in "guides/page.mdx" must be self-closing: <import-codeblock src="./example.ts"/>.',
    ],
    [
      '<import-codeblock src="./demo.ts" lines="1-2"/>',
      'Code block import in "guides/page.mdx" has an unknown attribute "lines". It takes plain src and lang attributes.',
    ],
    [
      '<import-codeblock :src="file"/>',
      'Code block import in "guides/page.mdx" has an unknown attribute ":src". It takes plain src and lang attributes.',
    ],
    [
      '<import-codeblock lang="ts"/>',
      'Code block import in "guides/page.mdx" needs a src, such as <import-codeblock src="./example.ts"/>.',
    ],
    [
      '<import-codeblock src="../../outside.ts"/>',
      'Code block import "../../outside.ts" in "guides/page.mdx" needs a relative path that stays inside the content folder.',
    ],
    [
      '<import-codeblock src="/guides/demo.ts"/>',
      'Code block import "/guides/demo.ts" in "guides/page.mdx" needs a relative path that stays inside the content folder.',
    ],
    [
      '<import-codeblock src="./missing.ts"/>',
      'Code block import "./missing.ts" in "guides/page.mdx" does not match any file.',
    ],
    // Even on a disk that ignores case, so the page builds the same everywhere.
    [
      '<import-codeblock src="./Demo.ts"/>',
      'Code block import "./Demo.ts" in "guides/page.mdx" does not match any file.',
    ],
    [
      '<import-codeblock src="../Guides/demo.ts"/>',
      'Code block import "../Guides/demo.ts" in "guides/page.mdx" does not match any file.',
    ],
  ])('rejects %s', async (source, message) => {
    await expect(expand(source)).rejects.toThrow(message)
  })

  it('reports a missing file as an import, so its page can render again once it exists', async () => {
    const imports: string[] = []

    await expect(
      expand('<import-codeblock src="./missing.ts"/>', (relPath) =>
        imports.push(relPath),
      ),
    ).rejects.toThrow()

    expect(imports).toEqual(['guides/missing.ts'])
  })

  describe('import-content', () => {
    it('puts shared Markdown in the page as blocks, expanding its own tags from its file', async () => {
      const imports: string[] = []

      const expanded = await expand(
        'Intro\n<import-content src="../shared/_note.mdx"/>\nOutro',
        (relPath) => imports.push(relPath),
      )

      expect(expanded).toBe(
        'Intro\n\n\nA **shared** note.\n\n\n```typescript\nconst shared = true\n```\n\n\n\nOutro',
      )
      expect(imports).toEqual(['shared/_note.mdx', 'shared/snippet.ts'])
    })

    it('takes shared content from a folder whose name starts with _', async () => {
      expect(
        await expand('<import-content src="../_partials/install.md"/>'),
      ).toBe('\n\nRun the installer.\n\n')
    })

    it('treats a passage that opens with a rule as Markdown, not frontmatter', async () => {
      expect(await expand('<import-content src="./_rule.mdx"/>')).toBe(
        '\n\n---\n\nAfter a rule.\n\n',
      )
    })

    it.each([
      [
        '<import-content src="./notes.mdx"/>',
        'Content import "./notes.mdx" in "guides/page.mdx" needs shared content: a file whose name, or a folder above it, starts with _, such as ./_shared.mdx.',
      ],
      [
        '<import-content src="./demo.ts"/>',
        'Content import "./demo.ts" in "guides/page.mdx" needs a Markdown or MDX file: .md, .mdx, or .rmdx.',
      ],
      [
        '<import-content src="./_front.mdx"/>',
        'Content import "./_front.mdx" in "guides/page.mdx" names a file with frontmatter; shared content uses the frontmatter of the page that shows it.',
      ],
      [
        '<import-content src="./_a.mdx"/>',
        'Content import "./_a.mdx" in "guides/_b.mdx" imports itself: guides/page.mdx → guides/_a.mdx → guides/_b.mdx → guides/_a.mdx.',
      ],
      [
        '<import-content src="./_missing.mdx"/>',
        'Content import "./_missing.mdx" in "guides/page.mdx" does not match any file.',
      ],
      [
        '<import-content src="../shared/_note.mdx" lang="md"/>',
        'Content import in "guides/page.mdx" has an unknown attribute "lang". It takes a plain src attribute.',
      ],
      [
        '<import-content src="../shared/_note.mdx"></import-content>',
        'Content import in "guides/page.mdx" must be self-closing: <import-content src="./_shared.mdx"/>.',
      ],
    ])('rejects %s', async (source, message) => {
      await expect(expand(source)).rejects.toThrow(message)
    })
  })
})

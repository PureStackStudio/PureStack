/* biome-ignore-all lint/suspicious/noTemplateCurlyInString: Fixtures contain literal TypeScript interpolations. */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { applySourceEdits, formatSource } from './index'

describe('formatSource', () => {
  it('formats component markup while preserving Markdown, frontmatter and fenced samples', async () => {
    const source = readFileSync(
      new URL(
        '../../../templates/starter/template/content/guide/index.mdx',
        import.meta.url,
      ),
      'utf8',
    )
    const result = await formatSource(source, { filePath: 'guide/index.mdx' })
    expect(result.diagnostics).toEqual([])
    const outsideMarkup = (text: string) =>
      text.slice(0, text.indexOf('<SectionHeader'))
    expect(outsideMarkup(result.code)).toBe(outsideMarkup(source))
    const fence = /```mdx\n[\s\S]*?\n```/.exec(source)?.[0]
    expect(fence).toBeDefined()
    expect(result.code).toContain(fence)
    expect(result.code).toContain('Then replace the prompts')
    expect((await formatSource(result.code)).changed).toBe(false)
  })

  it('changes only html/svg template contents and preserves interpolations and Regor expressions', async () => {
    const source =
      'const  untouched = 1;\nconst view = html`<Panel><Badge :tone="tone" @click="save" />${value} {{ count +  1 }}</Panel>`;\nconst icon = svg`<svg><path d="M0 0" /></svg>`;\nconst other = sql`select  * from users`;'
    const result = await formatSource(source, { filePath: 'view.ts' })
    expect(result.diagnostics).toEqual([])
    expect(result.code).toContain('const  untouched = 1;')
    expect(result.code).toContain('${value}')
    expect(result.code).toContain('{{ count +  1 }}')
    expect(result.code).toContain('@click="save"')
    expect(result.code).toContain('<path d="M0 0"/>')
    expect(result.code).toContain('sql`select  * from users`')
    expect(
      (await formatSource(result.code, { filePath: 'view.ts' })).changed,
    ).toBe(false)
  })

  it('preserves CRLF and untouched text when applying multiple edits', async () => {
    const source =
      '---\r\ntitle: Test\r\n---\r\n\r\n<Panel><Badge /></Panel>\r\n\r\nKeep  my prose.\r\n\r\n<Flex><Btn /></Flex>\r\n'
    const result = await formatSource(source)
    expect(result.code).toContain('Keep  my prose.\r\n')
    expect(result.code.replaceAll('\r\n', '')).not.toContain('\n')
    expect((await formatSource(result.code)).changed).toBe(false)
  })

  it('does not apply overlapping replacements for nested templates', async () => {
    const source = 'const view = html`<Panel>${html`<Badge />`}</Panel>`'
    const result = await formatSource(source, { filePath: 'nested.ts' })
    expect(result.diagnostics).toEqual([])
    expect(result.code).toContain('${html`<Badge />`}')
    expect(() => applySourceEdits(source, result.edits)).not.toThrow()
  })

  it('reports malformed markup without changing it', async () => {
    const source = '<Panel title="broken></Panel>'
    const result = await formatSource(source)
    expect(result.code).toBe(source)
    expect(result.diagnostics).not.toEqual([])
  })
})

import { describe, expect, it } from 'vitest'
import { normalizeClosingTagSpacing } from './html'
import { formatSource } from './index'

describe('closing tag formatting', () => {
  it.each(['page.mdx', 'view.ts'])(
    'keeps closing tags together in %s and remains stable on repeated formatting',
    async (filePath) => {
      const markup =
        '<Flex><a href="/a-long-documentation-path/">Read the documentation</a><BtnLink href="/another-long-path/">Start building</BtnLink></Flex>'
      const source = filePath.endsWith('.ts')
        ? `const view = html\`${markup}\``
        : markup
      const options = { filePath, printWidth: 30 }
      const result = await formatSource(source, options)
      expect(result.diagnostics).toEqual([])
      expect(result.code).toContain('</a>')
      expect(result.code).toContain('</BtnLink>')
      expect(result.code).not.toMatch(/<\/[\w:.-]+\s+>/)
      expect((await formatSource(result.code, options)).code).toBe(result.code)
    },
  )

  it('preserves whitespace between inline elements', async () => {
    const source =
      '<span>Before</span><a href="/a-long-documentation-path/">Link</a> <em>After</em>'
    const result = await formatSource(source, { printWidth: 25 })
    expect(result.diagnostics).toEqual([])
    expect(result.code).toContain('Before</span><a')
    expect(result.code).toMatch(/Link<\/a>\s+<em/)
  })

  it('leaves closing-tag examples in attributes, comments and raw text untouched', () => {
    const source =
      '<Panel example="</a\n>"><!-- </a\n> --><script type="text/plain">"</a\n>"</script><textarea></a\n></textarea><a>Link</a\r\n  ></Panel>'
    expect(normalizeClosingTagSpacing(source)).toBe(
      source.replace('Link</a\r\n  >', 'Link</a>'),
    )
  })

  it('joins closing tags inside PascalCase components named like raw-text tags', () => {
    const source =
      '<Title><a>Link</a\n  ></Title\n><Style><em>Note</em\n></Style><title></a\n></title>'
    expect(normalizeClosingTagSpacing(source)).toBe(
      '<Title><a>Link</a></Title><Style><em>Note</em></Style><title></a\n></title>',
    )
  })
})

import { describe, expect, it } from 'vitest'
import { createHljsHighlighter } from './highlightjs'
import { compileMarkdown } from './md'
import { compileMdx } from './mdx'

describe('code highlighting', () => {
  it.each([compileMarkdown, compileMdx])(
    'awaits arbitrary block HTML through the existing hook',
    async (compile) => {
      const html =
        '<figure r-pre><svg viewBox="0 0 10 10"><title>{{ literal }}</title></svg></figure><p>Caption</p>'
      const result = await compile('```diagram\nsource\n```', {
        highlighter: { codeToHtml: async () => html },
      })
      expect(result.bodyHtml).toBe(html)
    },
  )

  it('awaits the same hook inside component markup', async () => {
    const result = await compileMdx(
      '<Panel>\n```diagram\nsource\n```\n</Panel>',
      {
        highlighter: {
          codeToHtml: async (code) => `<figure r-pre>${code}</figure>`,
        },
      },
    )
    expect(result.bodyHtml).toContain(
      '<Panel>\n<figure r-pre>source</figure>\n</Panel>',
    )
    expect(result.bodyHtml).not.toContain('<pre')
  })

  it('preserves callback order across separate component markup segments', async () => {
    const calls: string[] = []
    await compileMdx(
      [
        '<Panel>',
        '```custom',
        'first',
        '```',
        '</Panel>',
        '',
        'Between components.',
        '',
        '<Panel>',
        '```custom',
        'second',
        '```',
        '</Panel>',
      ].join('\n'),
      {
        highlighter: {
          codeToHtml: async (code) => {
            calls.push(`start:${code}`)
            await Promise.resolve()
            calls.push(`end:${code}`)
            return `<figure>${code}</figure>`
          },
        },
      },
    )
    expect(calls).toEqual([
      'start:first',
      'end:first',
      'start:second',
      'end:second',
    ])
  })

  it.each([compileMarkdown, compileMdx])(
    'honors empty custom HTML without restoring a code block',
    async (compile) => {
      const source =
        compile === compileMdx
          ? '<Panel>\n```custom\nsource\n```\n</Panel>'
          : '```custom\nsource\n```'
      const result = await compile(source, {
        highlighter: { codeToHtml: () => '' },
      })
      expect(result.bodyHtml).not.toContain('source')
      expect(result.bodyHtml).not.toContain('<pre')
    },
  )

  it('preserves built-in block and inline highlighting with an asynchronous wrapper', async () => {
    const fallback = createHljsHighlighter()
    const source =
      '```ts\nconst answer = 42\n```\n\n`value`\n\n<Panel>\n```ts\nconst nested = 1\n```\n`nested`\n</Panel>'
    const original = await compileMdx(source, { highlighter: fallback })
    const result = await compileMdx(source, {
      highlighter: {
        codeToHtml: async (code, lang) => fallback.codeToHtml(code, lang),
      },
    })
    expect(result).toEqual(original)
  })

  it.each([compileMarkdown, compileMdx])(
    'propagates asynchronous highlighter errors',
    async (compile) => {
      await expect(
        compile('```diagram\nbroken\n```', {
          highlighter: {
            codeToHtml: async () => {
              throw new Error('invalid diagram')
            },
          },
        }),
      ).rejects.toThrow('invalid diagram')
    },
  )
})

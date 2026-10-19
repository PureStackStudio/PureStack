import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import {
  createHighlighter,
  type Highlighter,
  type LanguageRegistration,
} from 'shiki'
import { describe, expect, it } from 'vitest'
import { highlightPlugin } from './index'

describe('highlightPlugin', () => {
  it('owns its default selection and validates identifiers only when its backend is used', async () => {
    const plugin = highlightPlugin()
    const fallback = await plugin.markdown.createHighlighter({
      mdx: {},
      cache: true,
    })
    expect(fallback?.codeToHtml('const answer = 42', 'ts')).toContain(
      'hljs-keyword',
    )
    await expect(
      plugin.markdown.createHighlighter({
        mdx: { highlighter: 'another-provider' },
        cache: true,
      }),
    ).rejects.toThrow('Supply a custom markdown.createHighlighter provider')
  })

  it('highlights Shiki code identically with and without the persistent cache', async () => {
    const code = 'const view = html`<p class="note">Saved</p>`'
    const render = async (cache: boolean) => {
      const highlighter = await highlightPlugin().markdown.createHighlighter({
        mdx: { highlighter: 'shiki' },
        cache,
      })
      try {
        return await highlighter?.codeToHtml(code, 'ts')
      } finally {
        await highlighter?.flush?.()
      }
    }
    const uncached = await render(false)
    expect(uncached).toContain('--shiki-light:')
    expect(await render(true)).toBe(uncached)
    expect(await render(true)).toBe(uncached)
  })

  it.each(['sync', 'async'])(
    'uses a %s Shiki factory with default options and a custom grammar',
    async (mode) => {
      let created: Highlighter | undefined
      let calls = 0
      const grammar = {
        name: 'creator-test',
        scopeName: 'source.creator-test',
        aliases: ['creator-test-alias'],
        repository: {},
        patterns: [
          { name: 'keyword.control.creator-test', match: '\\blaunch\\b' },
        ],
      } satisfies LanguageRegistration
      try {
        if (mode === 'sync')
          created = await createHighlighter({
            themes: ['github-light', 'github-dark'],
            langs: ['ts-tags', grammar],
          })
        const plugin = highlightPlugin({
          createShiki(defaults) {
            calls++
            expect(defaults.langs).toContain('ts-tags')
            expect(defaults.themes).toEqual(['github-light', 'github-dark'])
            if (created) return created
            return createHighlighter({
              ...defaults,
              langs: [...defaults.langs, grammar],
            }).then((instance) => {
              created = instance
              return instance
            })
          },
          createHighlightJs: () => {
            throw new Error('Unused backend.')
          },
        })
        const highlighter = await plugin.markdown.createHighlighter({
          mdx: { highlighter: 'shiki' },
          cache: true,
        })
        expect(calls).toBe(1)
        expect(
          highlighter?.codeToHtml('launch', 'creator-test-alias'),
        ).toContain('--shiki-light:')
        expect(
          highlighter?.codeToHtml('launch again', 'creator-test'),
        ).toContain('launch')
        expect(highlighter?.codeToHtml('const answer = 42', 'ts')).toContain(
          'answer',
        )
      } finally {
        created?.dispose()
      }
    },
  )

  it.each(['sync', 'async'])(
    'uses a %s highlight.js factory without changing the shared registry',
    async (mode) => {
      let calls = 0
      const plugin = highlightPlugin({
        createHighlightJs() {
          calls++
          const engine = hljs.newInstance()
          engine.registerLanguage('typescript', typescript)
          engine.registerLanguage('creator-test', () => ({
            keywords: 'launch',
            aliases: ['creator-test-alias'],
            contains: [],
          }))
          engine.configure({ classPrefix: 'custom-' })
          return mode === 'async' ? Promise.resolve(engine) : engine
        },
        createShiki: () => {
          throw new Error('Unused backend.')
        },
      })
      const highlighter = await plugin.markdown.createHighlighter({
        mdx: { highlighter: 'highlightjs' },
        cache: true,
      })
      expect(calls).toBe(1)
      expect(highlighter?.codeToHtml('launch', 'creator-test-alias')).toContain(
        '<span class="custom-keyword">launch</span>',
      )
      expect(highlighter?.codeToHtml('const answer = 42', 'ts')).toContain(
        'custom-keyword',
      )
      expect(hljs.getLanguage('creator-test')).toBeUndefined()
      const defaults = await highlightPlugin().markdown.createHighlighter({
        mdx: { highlighter: 'highlightjs' },
        cache: true,
      })
      expect(defaults?.codeToHtml('const answer = 42', 'ts')).toContain(
        'hljs-keyword',
      )
    },
  )

  it('skips both backend factories when highlighting is disabled', async () => {
    const fail = () => {
      throw new Error('Disabled backend.')
    }
    const plugin = highlightPlugin({
      createShiki: fail,
      createHighlightJs: fail,
    })
    expect(
      await plugin.markdown.createHighlighter({
        mdx: { disableHighlighter: true },
        cache: true,
      }),
    ).toBeUndefined()
  })
})

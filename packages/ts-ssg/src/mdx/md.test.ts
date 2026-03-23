import { renderApp, type TsSsgContext } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { resolveMdxBuildOptions } from '../build/incremental/support'
import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { compileMarkdown } from './md'

describe('compileMarkdown', () => {
  it('renders GFM tables as table elements', async () => {
    const source = [
      '| Option | Default |',
      '| ------ | ------- |',
      '| level  | TRACE   |',
      '| worker | false   |',
    ].join('\n')
    const html = renderApp(compileMarkdown(source).bodyHtml, {
      components: {},
      context: createTestContext(),
    })

    expect(html).toContain('<table>')
    expect(html).toContain('<div class="table-scroll">')
    expect(html).toContain('<thead>')
    expect(html).toContain('<tbody>')
    expect(html).toContain('<th>Option</th>')
    expect(html).toContain('<td>TRACE</td>')
  })

  it('supports highlightjs backend', async () => {
    const source = '```ts\nconst x = 1\n```'
    const mdx = await resolveMdxBuildOptions({
      highlighter: 'highlightjs',
    })
    const html = renderApp(compileMarkdown(source, mdx).bodyHtml, {
      components: {},
      context: createTestContext(),
    })

    expect(html).toContain('<pre class="hljs shiki">')
    expect(html).toContain('<code class="hljs language-typescript">')
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'test.md',
      urlPath: '/test',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}

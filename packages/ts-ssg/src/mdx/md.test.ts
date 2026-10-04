import type { TsSsgContext } from '@purestack/ts-common'
import { renderApp } from '@purestack/ts-render'
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

    expect(html).toContain('<pre class="hljs shiki" r-pre>')
    expect(html).toContain('<code class="hljs language-typescript">')
  })

  it('collects h1, h2, and h3 headings into the page outline', () => {
    const source = [
      '# Getting Started',
      '',
      '## Install',
      '',
      '### Package Manager',
      '',
      '## Configure',
    ].join('\n')

    expect(compileMarkdown(source).outline).toEqual([
      {
        id: 'getting-started',
        title: 'Getting Started',
        depth: 1,
        children: [
          {
            id: 'install',
            title: 'Install',
            depth: 2,
            children: [
              {
                id: 'package-manager',
                title: 'Package Manager',
                depth: 3,
              },
            ],
          },
          {
            id: 'configure',
            title: 'Configure',
            depth: 2,
          },
        ],
      },
    ])
  })

  it('does not attach skipped headings to stale ancestors', () => {
    const source = [
      '# First Page',
      '',
      '## Old Section',
      '',
      '# Second Page',
      '',
      '### Skipped Section',
    ].join('\n')

    expect(compileMarkdown(source).outline).toEqual([
      {
        id: 'first-page',
        title: 'First Page',
        depth: 1,
        children: [
          {
            id: 'old-section',
            title: 'Old Section',
            depth: 2,
          },
        ],
      },
      {
        id: 'second-page',
        title: 'Second Page',
        depth: 1,
        children: [
          {
            id: 'skipped-section',
            title: 'Skipped Section',
            depth: 3,
          },
        ],
      },
    ])
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
    basePath: site.basePath,
    locales: site.i18n.locales,
    defaultLocale: site.i18n.defaultLocale || undefined,
    resolveLocaleHref: () => undefined,
    resolvePublicHref: (href) => href,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}

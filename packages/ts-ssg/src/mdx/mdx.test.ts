import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { ensureDomGlobals } from '../minidom/createDom'
import { createModalComponents } from '../regor/components/modal/modal'
import { renderApp } from '../regor/renderApp'
import type { TsSsgContext } from '../regor/ts-ssg-context'
import { compileMdxToHtml } from './mdx'

describe('compileMdxToHtml', () => {
  it('renders a custom JSX component at root level', async () => {
    const source = '<CustomComponent data-id="x" />\n\nParagraph text.'
    const html = renderApp(compileMdxToHtml(source), {
      components: {},
      context: createTestContext(),
    })

    expect(html).toContain('<customcomponent')
    expect(html).toContain('data-id="x"')
    expect(html).toContain('<p>Paragraph text.</p>')
  })

  it('renders nested components and multiline content', async () => {
    const source = [
      '<OuterComponent>',
      '  <InnerComponent data-flag="true" />',
      '  Multi-line',
      '  text content.',
      '</OuterComponent>',
      '',
      'Another paragraph',
      'spanning two lines.',
    ].join('\n')
    const html = renderApp(compileMdxToHtml(source), {
      components: {},
      context: createTestContext(),
    })
    expect(html).toContain('<outercomponent')
    expect(html).toContain('<innercomponent')
    expect(html).toContain('data-flag="true"')
    expect(html).toContain('Multi-line\ntext content.')
    expect(html).toContain('<p>Another paragraph\nspanning two lines.</p>')
  })

  it('renders multiple JSX components in a single document', async () => {
    const source = [
      '<Banner title="Hello" />',
      '',
      'Intro text.',
      '',
      '<Callout kind="info">',
      '  Callout content.',
      '</Callout>',
      '',
      '<Footer />',
    ].join('\n')
    const html = renderApp(compileMdxToHtml(source), {
      components: {},
      context: createTestContext(),
    })

    expect(html).toContain('<banner')
    expect(html).toContain('title="Hello"')
    expect(html).toContain('<p>Intro text.</p>')
    expect(html).toContain('<callout kind="info">')
    expect(html).toContain('Callout content.')
    expect(html).toContain('<footer')
  })

  it('renders GFM tables as table elements', async () => {
    const source = [
      '| Name | Type |',
      '| ---- | ---- |',
      '| Bus  | Land |',
      '| Ship | Sea  |',
    ].join('\n')
    const html = renderApp(compileMdxToHtml(source), {
      components: {},
      context: createTestContext(),
    })

    expect(html).toContain('<table>')
    expect(html).toContain('<div class="table-scroll">')
    expect(html).toContain('<thead>')
    expect(html).toContain('<tbody>')
    expect(html).toContain('<td>Bus</td>')
    expect(html).toContain('<td>Sea</td>')
  })

  it('strips empty paragraphs around template slot content', async () => {
    const cleanup = ensureDomGlobals()
    const source = [
      '<Modal id="custom-shell-modal" size="xl" fade="true" slideFrom="bottom">',
      '  <template name="header">',
      '    <div>',
      '      <h2 id="custom-shell-modal-title">Quarterly launch checklist</h2>',
      '      <p>Use a custom header slot when default title layout is not enough.</p>',
      '    </div>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    try {
      const compiledHtml = compileMdxToHtml(source)
      expect(compiledHtml).not.toContain('<p><h2')

      const html = renderApp(compiledHtml, {
        components: createModalComponents(),
        context: createTestContext(),
      })

      expect(html).not.toContain('<p></p>')
      expect(html).not.toContain('<p><h2')
      expect(html).toContain('<h2 id="custom-shell-modal-title">')
      expect(html).toContain(
        '<p>Use a custom header slot when default title layout is not enough.</p>',
      )
    } finally {
      cleanup()
    }
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'test.mdx',
      urlPath: '/test',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}

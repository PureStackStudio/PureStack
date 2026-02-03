import { describe, expect, it } from 'vitest'

import { renderApp } from '../regor/renderApp'
import { compileMdxToHtml } from './mdx'

describe('compileMdxToHtml', () => {
  it('renders a custom JSX component at root level', async () => {
    const source = '<CustomComponent data-id="x" />\n\nParagraph text.'
    const html = renderApp(await compileMdxToHtml(source))

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
    const html = renderApp(await compileMdxToHtml(source))
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
    const html = renderApp(await compileMdxToHtml(source))

    expect(html).toContain('<banner')
    expect(html).toContain('title="Hello"')
    expect(html).toContain('<p>Intro text.</p>')
    expect(html).toContain('<callout kind="info">')
    expect(html).toContain('Callout content.')
    expect(html).toContain('<footer')
  })
})

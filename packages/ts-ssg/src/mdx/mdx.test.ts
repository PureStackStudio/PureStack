import type { TsSsgContext } from '@purestack/ts-common'
import { createModalComponents } from '@purestack/ts-components'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
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

  it('flattens markdown paragraph wrappers inside inline JSX elements', async () => {
    const source = ['<span>', '  Inline text', '</span>'].join('\n')
    const compiledHtml = compileMdxToHtml(source)

    expect(compiledHtml).toContain('<span>Inline text</span>')
    expect(compiledHtml).not.toContain('<span><p>')
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

  it('does not wrap native element before flow JSX in template slots', async () => {
    const source = [
      '<Modal id="child-modal">',
      '  <template name="footer">',
      '      <button type="button" class="modal-trigger" data-modal-close>Cancel</button>',
      '      <ModalTrigger target="child-modal" label="Continue to confirmation" />',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).not.toContain('<p><button')
    expect(compiledHtml).toContain(
      '<button type="button" class="modal-trigger" data-modal-close=',
    )
    expect(compiledHtml).toContain('>Cancel</button>')
    expect(compiledHtml).toContain(
      '<ModalTrigger target="child-modal" label="Continue to confirmation"></ModalTrigger>',
    )
  })

  it('keeps mixed text paragraphs wrapped as a single p in template slots', async () => {
    const source = [
      '<Modal id="mixed-template-paragraph">',
      '  <template name="footer">',
      '    Paragraph start <Badge>now</Badge> end.',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain(
      '<p>Paragraph start <Badge>now</Badge> end.</p>',
    )
  })

  it('keeps explicit p JSX inside template slots', async () => {
    const source = [
      '<Modal id="explicit-p-template">',
      '  <template name="footer">',
      '    <p class="note">Keep me</p>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('<p class="note">Keep me</p>')
  })

  it('keeps paragraphs that contain non-whitespace text before JSX', async () => {
    const source = [
      '<Modal id="text-before-jsx-template">',
      '  <template name="footer">',
      '    Prefix <Badge>now</Badge>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('<p>Prefix <Badge>now</Badge></p>')
  })

  it('unwraps synthetic paragraph wrappers in nested template subtree nodes', async () => {
    const source = [
      '<Modal id="nested-template-unwrapping">',
      '  <template name="header">',
      '    <section>',
      '      <h3>Quarterly launch checklist</h3>',
      '      <button type="button">Close</button>',
      '    </section>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).not.toContain('<p><h3')
    expect(compiledHtml).not.toContain('<p><button')
    expect(compiledHtml).toContain(
      '<section><h3>Quarterly launch checklist</h3><button type="button">Close</button></section>',
    )
  })

  it('keeps Btn variant component nodes unwrapped inside template slots', async () => {
    const source = [
      '<CardActions>',
      '  <template name="actions">',
      '    <Btn variant="primary" icon="iconoir:check">Create project</Btn>',
      '    <Btn variant="secondary" icon="iconoir:code">View source</Btn>',
      '    <Btn variant="ghost" icon="iconoir:pin-slash" iconPosition="end">',
      '      Read more',
      '    </Btn>',
      '    <Btn variant="warning" icon="iconoir:headset-help">Review warning</Btn>',
      '    <Btn variant="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
      '  </template>',
      '</CardActions>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).not.toContain('<p><Btn')
    expect(compiledHtml).not.toContain('</Btn></p>')
    expect(compiledHtml).toContain(
      '<Btn variant="primary" icon="iconoir:check">Create project</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="secondary" icon="iconoir:code">View source</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="ghost" icon="iconoir:pin-slash" iconPosition="end">',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="warning" icon="iconoir:headset-help">Review warning</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    )
  })

  it('renders Btn variant component nodes as direct mdx content without paragraph wrappers', async () => {
    const source = [
      '## 10. Variants with icons',
      '',
      '<Btn variant="primary" icon="iconoir:check">Create project</Btn>',
      '<Btn variant="secondary" icon="iconoir:code">View source</Btn>',
      '<Btn variant="ghost" icon="iconoir:pin-slash" iconPosition="end">',
      '  Read more',
      '</Btn>',
      '<Btn variant="warning" icon="iconoir:headset-help">Review warning</Btn>',
      '<Btn variant="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain(
      '<h2 id="10-variants-with-icons">10. Variants with icons</h2>',
    )
    expect(compiledHtml).not.toContain('<p><Btn')
    expect(compiledHtml).toContain(
      '<Btn variant="primary" icon="iconoir:check">Create project</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="secondary" icon="iconoir:code">View source</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="ghost" icon="iconoir:pin-slash" iconPosition="end"><p>Read more</p></Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="warning" icon="iconoir:headset-help">Review warning</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="primary" icon="iconoir:check">Create project</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="secondary" icon="iconoir:code">View source</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="ghost" icon="iconoir:pin-slash" iconPosition="end">',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="warning" icon="iconoir:headset-help">Review warning</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn variant="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    )
  })

  it('does not inject empty paragraphs for full modal content template', async () => {
    const cleanup = ensureDomGlobals()
    const source = [
      '<Modal id="full-content-modal" fade="false" slideFrom="left" size="md">',
      '  <template name="content">',
      '    <article class="modal__panel" role="document" tabindex="-1">',
      '      <h2>Fully custom content slot</h2>',
      '      <p>',
      '        This replaces the default modal shell entirely when you need custom internal structure.',
      '      </p>',
      '      <Grid columns="1" justifyItems="center">',
      '        <div>',
      '          <button type="button" class="modal-trigger" data-modal-close>Approve</button>',
      '          <button type="button" class="modal-trigger" data-modal-close>Cancel</button>',
      '        </div>',
      '      </Grid>',
      '    </article>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    try {
      const compiledHtml = compileMdxToHtml(source)
      expect(compiledHtml).not.toContain('<p></p>')
      expect(compiledHtml).not.toContain('<p><p>')

      const html = renderApp(compiledHtml, {
        components: createModalComponents(),
        context: createTestContext(),
      })
      expect(html).not.toContain('<p></p>')
      expect(html).not.toContain('<p><p>')
      expect(html).toContain(
        '<article class="modal__panel" role="document" tabindex="-1">',
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

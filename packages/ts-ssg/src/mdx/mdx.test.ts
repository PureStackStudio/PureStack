import type { TsSsgContext } from '@purestack/ts-common'
import { defineModalComponents } from '@purestack/ts-components'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { resolvePageContentHref } from '../build/content-hrefs'
import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { createMdxHighlighter } from './highlight'
import { createHljsHighlighter } from './highlightjs'
import { compileMdx, compileMdxToHtml } from './mdx'

describe('compileMdxToHtml', () => {
  it('preserves regor directive attributes as raw markup', () => {
    const source = [
      '<Flex wrap="true">',
      '  <Btn :tone="\'accent\'" .size="buttonSize" @click="save" #icon="props">',
      '    Save',
      '  </Btn>',
      '</Flex>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('<Flex wrap="true">')
    expect(compiledHtml).toContain(':tone="\'accent\'"')
    expect(compiledHtml).toContain('.size="buttonSize"')
    expect(compiledHtml).toContain('@click="save"')
    expect(compiledHtml).toContain('#icon="props"')
    expect(compiledHtml).not.toContain('<p><Flex')
  })

  it('unwraps standalone opaque markup paragraphs created by markdown parsing', () => {
    const source = ['<Badge icon="iconoir:check" />', '', 'Afterward.'].join(
      '\n',
    )

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('<Badge icon="iconoir:check" />')
    expect(compiledHtml).not.toContain('<p><Badge icon="iconoir:check" /></p>')
    expect(compiledHtml).toContain('<p>Afterward.</p>')
  })

  it('annotates script components with the MDX source path', () => {
    const compiledHtml = compileMdx(
      '<PageScript src="./auth-state.ts" teleport="head"/>\n<RegorApp src="./app.ts" />',
      { sourceRelPath: 'header.mdx' },
    ).bodyHtml

    expect(compiledHtml).toContain(
      '<PageScript src="./auth-state.ts" teleport="head" sourceRelPath="header.mdx"/>',
    )
    expect(compiledHtml).toContain(
      '<RegorApp src="./app.ts" sourceRelPath="header.mdx" />',
    )
  })

  it('unwraps a standalone inline markup island when it is the only paragraph content', () => {
    const compiledHtml = compileMdxToHtml('<span>inline</span>')
    expect(compiledHtml).toContain('<span>inline</span>')
    expect(compiledHtml).not.toContain('<p><span>inline</span></p>')
  })

  it('keeps mixed paragraph text around inline markup islands', () => {
    const compiledHtml = compileMdxToHtml('Prefix <span>inline</span> suffix')
    expect(compiledHtml).toContain('<p>Prefix <span>inline</span> suffix</p>')
  })

  it('does not treat code spans or fenced code as regor markup', () => {
    const source = [
      '`<Btn .size="buttonSize">`',
      '',
      '```html',
      '<Btn @click="save">',
      '```',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('<code>&#x3C;Btn .size="buttonSize"></code>')
    expect(compiledHtml).toContain('&#x3C;Btn @click="save">')
  })

  it('preserves prose spaces around inline code spans', () => {
    const source =
      'through `BlockCacheLifeTime` and `InactiveBlockCacheCleanupInterval`.'

    const compiledHtml = compileMdx(source, {
      highlighter: createHljsHighlighter(),
    }).bodyHtml

    expect(compiledHtml).toContain('through <code')
    expect(compiledHtml).toContain('</code> and <code')
    expect(compiledHtml).toContain('class="shiki shiki-inline shiki-themes"')
  })

  it('renders a custom markup component at root level', async () => {
    const source = '<CustomComponent data-id="x" />\n\nParagraph text.'
    const html = renderApp(compileMdxToHtml(source), {
      components: {},
      context: createTestContext(),
    })

    expect(html).toContain('<customcomponent')
    expect(html).toContain('data-id="x"')
    expect(html).toContain('<p>Paragraph text.</p>')
  })

  it('preserves whitespace inside opaque inline markup blocks', async () => {
    const source = ['<span>', '  Inline text', '</span>'].join('\n')
    const compiledHtml = compileMdxToHtml(source)

    expect(compiledHtml).toContain('<span>\n  Inline text\n</span>')
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
    expect(html).toContain('  Multi-line\n  text content.')
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
      '<SiteFooter />',
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
    expect(html).toContain('<sitefooter')
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

  it('rewrites markdown content links to routed page URLs', async () => {
    const html = compileMdx('[read and write API](usage/reads-and-writes.md)', {
      sourceRelPath: 'docs/getting-started.md',
      resolveContentHref: resolvePageContentHref,
    }).bodyHtml

    expect(html).toContain('href="/docs/usage/reads-and-writes/"')
    expect(html).not.toContain('href="usage/reads-and-writes.md"')
  })

  it('rewrites raw HTML content links with the configured link resolver', async () => {
    const html = compileMdx(
      '<a href="../usage/transactions.md#scope">Transactions</a>',
      {
        sourceRelPath: 'docs/concepts/storage-engine.md',
        resolveContentHref: resolvePageContentHref,
      },
    ).bodyHtml

    expect(html).toContain('href="/docs/usage/transactions/#scope"')
  })

  it('strips empty paragraphs around template slot content', async () => {
    const cleanup = ensureDomGlobals()
    const source = [
      '<Modal id="custom-shell-modal" size="xl" fade="true" slideFrom="bottom">',
      '  <template #header>',
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
        components: defineModalComponents(),
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
      '  <template #footer>',
      '      <button type="button" class="modal-trigger" data-modal-close>Cancel</button>',
      '      <ModalTrigger target="child-modal" label="Continue to confirmation" />',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).not.toContain('<p><button')
    expect(compiledHtml).toContain('<template #footer>')
    expect(compiledHtml).toContain(
      '<button type="button" class="modal-trigger" data-modal-close>Cancel</button>',
    )
    expect(compiledHtml).toContain('>Cancel</button>')
    expect(compiledHtml).toContain(
      '<ModalTrigger target="child-modal" label="Continue to confirmation" />',
    )
  })

  it('preserves mixed text inside opaque template slots without markdown p injection', async () => {
    const source = [
      '<Modal id="mixed-template-paragraph">',
      '  <template #footer>',
      '    Paragraph start <Badge>now</Badge> end.',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain(
      '    Paragraph start <Badge>now</Badge> end.',
    )
    expect(compiledHtml).not.toContain(
      '<p>Paragraph start <Badge>now</Badge> end.</p>',
    )
  })

  it('keeps explicit p JSX inside template slots', async () => {
    const source = [
      '<Modal id="explicit-p-template">',
      '  <template #footer>',
      '    <p class="note">Keep me</p>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('<p class="note">Keep me</p>')
  })

  it('preserves text before markup inside opaque template slots without paragraph injection', async () => {
    const source = [
      '<Modal id="text-before-jsx-template">',
      '  <template #footer>',
      '    Prefix <Badge>now</Badge>',
      '  </template>',
      '</Modal>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain('    Prefix <Badge>now</Badge>')
    expect(compiledHtml).not.toContain('<p>Prefix <Badge>now</Badge></p>')
  })

  it('preserves nested template subtree markup without synthetic paragraph wrappers', async () => {
    const source = [
      '<Modal id="nested-template-unwrapping">',
      '  <template #header>',
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
      '<section>\n      <h3>Quarterly launch checklist</h3>\n      <button type="button">Close</button>\n    </section>',
    )
  })

  it('keeps Btn variant component nodes unwrapped inside template slots', async () => {
    const source = [
      '<CardActions>',
      '  <template #actions>',
      '    <Btn tone="accent" icon="iconoir:check">Create project</Btn>',
      '    <Btn tone="neutral" icon="iconoir:code">View source</Btn>',
      '    <Btn tone="ghost" icon="iconoir:pin-slash" iconPosition="end">',
      '      Read more',
      '    </Btn>',
      '    <Btn tone="warning" icon="iconoir:headset-help">Review warning</Btn>',
      '    <Btn tone="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
      '  </template>',
      '</CardActions>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).not.toContain('<p><Btn')
    expect(compiledHtml).not.toContain('</Btn></p>')
    expect(compiledHtml).toContain(
      '<Btn tone="accent" icon="iconoir:check">Create project</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="neutral" icon="iconoir:code">View source</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="ghost" icon="iconoir:pin-slash" iconPosition="end">',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="warning" icon="iconoir:headset-help">Review warning</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    )
  })

  it('renders Btn variant component nodes as opaque mdx content without paragraph wrappers', async () => {
    const source = [
      '## 10. Variants with icons',
      '',
      '<Btn tone="accent" icon="iconoir:check">Create project</Btn>',
      '<Btn tone="neutral" icon="iconoir:code">View source</Btn>',
      '<Btn tone="ghost" icon="iconoir:pin-slash" iconPosition="end">',
      '  Read more',
      '</Btn>',
      '<Btn tone="warning" icon="iconoir:headset-help">Review warning</Btn>',
      '<Btn tone="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    ].join('\n')

    const compiledHtml = compileMdxToHtml(source)
    expect(compiledHtml).toContain(
      '<h2 id="10-variants-with-icons">10. Variants with icons</h2>',
    )
    expect(compiledHtml).not.toContain('<p><Btn')
    expect(compiledHtml).toContain(
      '<Btn tone="accent" icon="iconoir:check">Create project</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="neutral" icon="iconoir:code">View source</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="ghost" icon="iconoir:pin-slash" iconPosition="end">\n  Read more\n</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="warning" icon="iconoir:headset-help">Review warning</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="accent" icon="iconoir:check">Create project</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="neutral" icon="iconoir:code">View source</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="ghost" icon="iconoir:pin-slash" iconPosition="end">',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="warning" icon="iconoir:headset-help">Review warning</Btn>',
    )
    expect(compiledHtml).toContain(
      '<Btn tone="danger" icon="iconoir:pin" iconPosition="end">Delete item</Btn>',
    )
  })

  it('does not inject empty paragraphs for full modal content template', async () => {
    const cleanup = ensureDomGlobals()
    const source = [
      '<Modal id="full-content-modal" fade="false" slideFrom="left" size="md">',
      '  <template #content>',
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
        components: defineModalComponents(),
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

  it('renders fenced code blocks inside Regor component markup without a highlighter', async () => {
    const source = [
      '<Tabs id="install-flow">',
      '  <TabPane id="npm" label="npm">',
      '    ```bash',
      '    npm install @purestack/ts-ssg',
      '    ```',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')

    const html = compileMdx(source).bodyHtml

    expect(html).toContain('<Tabs id="install-flow">')
    expect(html).toContain('<TabPane id="npm" label="npm">')
    expect(html).toContain('<pre><code class="language-bash">')
    expect(html).toContain('npm install @purestack/ts-ssg')
    expect(html).toContain('</TabPane>')
  })

  it.each([
    '```',
    '~~~~',
  ])('preserves formatted source tabs with %s fences and no surrounding blank lines', (fence) => {
    const source = [
      '<Tabs',
      '  tone="neutral"',
      '>',
      '  <TabPane id="preview">',
      '    <RegorApp id="collection" src="./collection.ts"/>',
      '  </TabPane>',
      '  <TabPane id="source">',
      `${fence}typescript`,
      "import { html } from 'regor'",
      '',
      'export interface Collection { items: SRef<string[]> }',
      '',
      'const template = html`<Flex><RegorApp src="./example.ts"/></Flex>`',
      'const closingTag = "</Tabs>"',
      'const shorterFence = "```"',
      fence,
      '  </TabPane>',
      '</Tabs>',
      '',
      '## After the sample',
      '',
      'Still visible.',
    ].join('\n')

    const result = compileMdx(source, {
      sourceRelPath: 'components/buttons.mdx',
      highlighter: createHljsHighlighter(),
    })
    const cleanup = ensureDomGlobals()
    try {
      const root = document.createElement('div')
      root.innerHTML = result.bodyHtml
      expect(root.querySelectorAll('tabs > tabpane')).toHaveLength(2)
      expect(
        root.querySelector('#preview regorapp')?.getAttribute('sourceRelPath'),
      ).toBe('components/buttons.mdx')
      const code = root.querySelector('#source pre code')
      expect(code?.textContent?.trimEnd()).toBe(
        source.split(`${fence}typescript\n`)[1].split(`\n${fence}\n`)[0],
      )
      expect(code?.querySelector('span')).not.toBeNull()
      expect(root.querySelector('h2')?.textContent).toBe('After the sample')
      expect(root.querySelector('p')?.textContent).toBe('Still visible.')
    } finally {
      cleanup()
    }
  })

  it.each([
    'none',
    'highlightjs',
    'shiki',
  ])('preserves template literals inside source tabs with %s highlighting', async (engine) => {
    const code = [
      'const options = {',
      '  template: html`<Collection/>`,',
      `  label: \`Item \${nextItem++}\`,`,
      '  entity: "&#x3C;",',
      '}',
    ].join('\n')
    const source = [
      '<TabPane>',
      'Before `inline code`.',
      '```typescript',
      code,
      '```',
      'After `inline code`.',
      '</TabPane>',
    ].join('\n')
    const highlighter =
      engine === 'shiki'
        ? await createMdxHighlighter(undefined, ['typescript'])
        : engine === 'highlightjs'
          ? createHljsHighlighter()
          : undefined
    const result = compileMdx(source, { highlighter })
    const cleanup = ensureDomGlobals()
    try {
      const root = document.createElement('div')
      root.innerHTML = result.bodyHtml
      expect(root.querySelector('pre code')?.textContent?.trimEnd()).toBe(code)
      expect(root.querySelectorAll('pre code code')).toHaveLength(0)
      expect(root.querySelectorAll('tabpane > code')).toHaveLength(2)
    } finally {
      cleanup()
    }
  })

  it('highlights fenced code blocks inside Regor component markup', async () => {
    const source = [
      '<Tabs id="install-flow">',
      '  <TabPane id="npm" label="npm">',
      '    ```ts',
      '    const answer = 42',
      '    ```',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')

    const html = compileMdx(source, {
      highlighter: createHljsHighlighter(),
    }).bodyHtml

    expect(html).toContain('<pre class="hljs shiki"')
    expect(html).toContain('<code class="hljs language-typescript">')
    expect(html).toContain('const')
    expect(html).toContain('answer')
  })

  it('renders inline code inside Regor component markup without a highlighter', async () => {
    const source = [
      '<Tabs id="install-flow">',
      '  <TabPane id="npm" label="npm">',
      '    Use `npm install @purestack/ts-ssg` to add the package.',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')

    const html = compileMdx(source).bodyHtml

    expect(html).toContain('<TabPane id="npm" label="npm">')
    expect(html).toContain(
      'Use <code>npm install @purestack/ts-ssg</code> to add the package.',
    )
  })

  it('highlights inline code inside Regor component markup', async () => {
    const source = [
      '<Tabs id="install-flow">',
      '  <TabPane id="npm" label="npm">',
      '    Use `const answer = 42` here.',
      '  </TabPane>',
      '</Tabs>',
    ].join('\n')

    const html = compileMdx(source, {
      highlighter: createHljsHighlighter(),
    }).bodyHtml

    expect(html).toContain('<code class="hljs shiki shiki-inline shiki-themes"')
    expect(html).toContain('answer')
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
    basePath: site.basePath,
    locales: site.i18n.locales,
    defaultLocale: site.i18n.defaultLocale || undefined,
    resolveLocaleHref: () => undefined,
    resolvePublicHref: (href) => href,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}

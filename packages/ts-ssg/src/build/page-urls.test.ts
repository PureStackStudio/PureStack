import path from 'node:path'
import { parseHtml } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { resolveContentFiles } from '../i18n/content'
import { ContentRouteIndex } from './content-hrefs'
import { markContentSource, resolvePageUrls } from './page-urls'

const PAGES = [
  'index.mdx',
  'guides/index.mdx',
  'guides/semantic-tones.mdx',
  'guides/themes.mdx',
  'guides/r&d.mdx',
  'guides/say "hi".mdx',
]

function resolveBody(
  bodyHtml: string,
  { sourceRelPath = 'guides/semantic-tones.mdx', basePath = '' } = {},
) {
  const config = resolveSiteConfig({ rootDir: process.cwd(), basePath })
  const contentRoutes = new ContentRouteIndex(
    resolveContentFiles(
      config,
      PAGES.map((relPath) => ({
        absPath: relPath,
        relPath,
        ext: path.extname(relPath),
      })),
    ),
  )
  const { document } = parseHtml(
    `<!DOCTYPE html><html><head></head><body>${bodyHtml}</body></html>`,
  )
  resolvePageUrls(document as unknown as Document, {
    sourceRelPath,
    contentRoutes,
    config,
  })
  return document.body?.innerHTML ?? ''
}

describe('resolvePageUrls', () => {
  it('resolves href on any element from the page file', () => {
    expect(
      resolveBody(
        '<a href="./themes">Themes</a><nav><a class="btn" href="../">Home</a></nav>',
      ),
    ).toBe(
      '<a href="/guides/themes/">Themes</a><nav><a class="btn" href="/">Home</a></nav>',
    )
  })

  it('resolves links in marked partials from the partial file', () => {
    const header = markContentSource(
      '<a href="./themes">Themes</a><a href="./">Guides</a>',
      'guides/header.mdx',
    )

    expect(
      resolveBody(`${header}<a href="../">Up</a>`, {
        sourceRelPath: 'guides/deep/page.mdx',
      }),
    ).toBe(
      '<a href="/guides/themes/">Themes</a><a href="/guides/">Guides</a><a href="/guides/">Up</a>',
    )
  })

  it('uses the nearest marker and accepts Windows paths in markers', () => {
    const inner = markContentSource('<a href="./">Root</a>', 'index.mdx')
    const outer = markContentSource(
      `<a href="./themes">Themes</a>${inner}`,
      'guides\\header.mdx',
    )

    expect(resolveBody(outer)).toBe(
      '<a href="/guides/themes/">Themes</a><a href="/">Root</a>',
    )
  })

  it('removes markers and keeps their content in place', () => {
    const footer = markContentSource('<p>One</p><p>Two</p>', 'footer.mdx')

    expect(resolveBody(`<main>Page</main>${footer}<aside>After</aside>`)).toBe(
      '<main>Page</main><p>One</p><p>Two</p><aside>After</aside>',
    )
  })

  it('resolves links inside template content', () => {
    expect(resolveBody('<template><a href="./themes">T</a></template>')).toBe(
      '<template><a href="/guides/themes/">T</a></template>',
    )
  })

  it('leaves code, comments, scripts and look-alike attributes as written', () => {
    const html = [
      '<pre><code>&lt;a href="./missing"&gt;</code></pre>',
      '<!-- <a href="./missing">old</a> -->',
      '<script>const link = \'<a href="./missing">\'</script>',
      '<a data-href="./missing" hreflang="en">No href</a>',
    ].join('')

    expect(resolveBody(html)).toBe(html)
  })

  it('decodes character references and escapes the resolved URL', () => {
    expect(
      resolveBody(
        '<a href="./r&amp;d">R&amp;D</a><a href=\'./say "hi"\'>Hi</a><a href="./themes?a=1&amp;b=2">Q</a>',
      ),
    ).toBe(
      '<a href="/guides/r&amp;d/">R&amp;D</a><a href="/guides/say &quot;hi&quot;/">Hi</a><a href="/guides/themes/?a=1&amp;b=2">Q</a>',
    )
  })

  it('adds the base path to resolved and root-absolute URLs', () => {
    expect(
      resolveBody(
        [
          '<a href="./themes">Themes</a>',
          '<a href="/blog/">Blog</a>',
          '<a href="https://example.com/">Elsewhere</a>',
          '<a href="#top">Top</a>',
          '<img src="/assets/logo.svg" srcset="/assets/logo.svg 1x, /assets/logo@2x.svg 2x">',
          '<form action="/search/"></form>',
          '<video poster="/assets/poster.png"></video>',
        ].join(''),
        { basePath: '/docs' },
      ),
    ).toBe(
      [
        '<a href="/docs/guides/themes/">Themes</a>',
        '<a href="/docs/blog/">Blog</a>',
        '<a href="https://example.com/">Elsewhere</a>',
        '<a href="#top">Top</a>',
        '<img src="/docs/assets/logo.svg" srcset="/docs/assets/logo.svg 1x, /docs/assets/logo@2x.svg 2x">',
        '<form action="/docs/search/"></form>',
        '<video poster="/docs/assets/poster.png"></video>',
      ].join(''),
    )
  })

  it('fails with the file that wrote a broken link', () => {
    expect(() => resolveBody('<a href="./themse">Typo</a>')).toThrow(
      'Content link "./themse" in "guides/semantic-tones.mdx" does not match any page.',
    )
    expect(() =>
      resolveBody(
        markContentSource('<a href="./missing">X</a>', 'guides/header.mdx'),
      ),
    ).toThrow('Content link "./missing" in "guides/header.mdx"')
  })
})

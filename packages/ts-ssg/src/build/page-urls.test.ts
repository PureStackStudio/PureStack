import path from 'node:path'
import { parseHtml } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { resolveContentFiles } from '../i18n/content'
import { ContentRouteIndex } from './content-urls'
import { markContentSource, resolvePageUrls } from './page-urls'

const PAGES = [
  'index.mdx',
  'guides/index.mdx',
  'guides/semantic-tones.mdx',
  'guides/themes.mdx',
  'guides/r&d.mdx',
  'guides/say "hi".mdx',
]

const ASSETS = [
  'assets/logo.svg',
  'guides/img.png',
  'guides/img@2x.png',
  'guides/poster.jpg',
  'guides/video.mp4',
  'guides/captions.vtt',
  'guides/guide.pdf',
  'guides/icons.svg',
  'guides/demo.html',
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
    ASSETS,
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

  it('resolves image, media and file URLs from the file that wrote them', () => {
    expect(
      resolveBody(
        [
          '<img src="./img.png">',
          '<picture><source srcset="./img.png 1x, ./img@2x.png 2x"></picture>',
          '<video poster="./poster.jpg"><source src="./video.mp4"><track src="./captions.vtt"></video>',
          '<a href="./guide.pdf" download>Guide</a>',
          '<svg><use href="./icons.svg#palette"></use></svg>',
          '<iframe src="./demo.html"></iframe>',
          '<iframe src="./themes"></iframe>',
        ].join(''),
      ),
    ).toBe(
      [
        '<img src="/guides/img.png">',
        '<picture><source srcset="/guides/img.png 1x, /guides/img@2x.png 2x"></picture>',
        '<video poster="/guides/poster.jpg"><source src="/guides/video.mp4"><track src="/guides/captions.vtt"></video>',
        '<a href="/guides/guide.pdf" download>Guide</a>',
        '<svg><use href="/guides/icons.svg#palette"></use></svg>',
        '<iframe src="/guides/demo.html"></iframe>',
        '<iframe src="/guides/themes/"></iframe>',
      ].join(''),
    )
  })

  it('resolves files in marked partials from the partial folder', () => {
    expect(
      resolveBody(
        markContentSource(
          '<img src="../assets/logo.svg">',
          'guides/header.mdx',
        ),
        { sourceRelPath: 'guides/deep/page.mdx' },
      ),
    ).toBe('<img src="/assets/logo.svg">')
  })

  it('parses srcset candidates like the HTML parser', () => {
    const dataUrl = 'data:image/png;base64,iVBOR,w0KGgo='

    expect(
      resolveBody(
        `<img srcset="  ./img.png  480w,${dataUrl} 1x,./img@2x.png, ./img.png (max-width: 600px) 600w">`,
      ),
    ).toBe(
      `<img srcset="  /guides/img.png  480w,${dataUrl} 1x,/guides/img@2x.png, /guides/img.png (max-width: 600px) 600w">`,
    )
  })

  it('adds the base path to resolved files', () => {
    expect(
      resolveBody(
        '<img src="./img.png" srcset="./img.png 1x, ./img@2x.png 2x">',
        { basePath: '/docs' },
      ),
    ).toBe(
      '<img src="/docs/guides/img.png" srcset="/docs/guides/img.png 1x, /docs/guides/img@2x.png 2x">',
    )
  })

  it('keeps relative form actions, which name endpoints rather than files', () => {
    expect(resolveBody('<form action="./subscribe"></form>')).toBe(
      '<form action="./subscribe"></form>',
    )
  })

  it('fails with the file that wrote a missing image', () => {
    expect(() => resolveBody('<img src="./missing.png">')).toThrow(
      'Content link "./missing.png" in "guides/semantic-tones.mdx" points to a missing file "guides/missing.png".',
    )
    expect(() =>
      resolveBody('<img srcset="./img.png 1x, ./missing@2x.png 2x">'),
    ).toThrow('points to a missing file "guides/missing@2x.png"')
  })

  it('fails with the file that wrote a broken link', () => {
    expect(() => resolveBody('<a href="./themse">Typo</a>')).toThrow(
      'Content link "./themse" in "guides/semantic-tones.mdx" does not match any page or file.',
    )
    expect(() =>
      resolveBody(
        markContentSource('<a href="./missing">X</a>', 'guides/header.mdx'),
      ),
    ).toThrow('Content link "./missing" in "guides/header.mdx"')
  })
})

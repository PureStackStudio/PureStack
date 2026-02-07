import { describe, expect, it } from 'vitest'

import { parseHtml } from './minidom'

describe('minidom entity decoding', () => {
  it('decodes numeric entities without double-escaping', () => {
    const { document } = parseHtml(
      '<html><body><p>&#x3C;code&#x3E; &amp; &#60;</p></body></html>',
    )
    expect(document.body?.innerHTML).toBe(
      '<p>&lt;code&gt; &amp; &lt;</p>',
    )
  })
})

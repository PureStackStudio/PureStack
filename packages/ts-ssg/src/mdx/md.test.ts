import { describe, expect, it } from 'vitest'

import { renderApp } from '../regor/renderApp'
import { compileMarkdown } from './md'

describe('compileMarkdown', () => {
  it('renders GFM tables as table elements', async () => {
    const source = [
      '| Option | Default |',
      '| ------ | ------- |',
      '| level  | TRACE   |',
      '| worker | false   |',
    ].join('\n')
    const html = renderApp(compileMarkdown(source).bodyHtml)

    expect(html).toContain('<table>')
    expect(html).toContain('<div class="table-scroll">')
    expect(html).toContain('<thead>')
    expect(html).toContain('<tbody>')
    expect(html).toContain('<th>Option</th>')
    expect(html).toContain('<td>TRACE</td>')
  })
})

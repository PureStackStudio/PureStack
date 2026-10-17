import type { PageContext } from '@purestack/ts-common'
import { runInDom } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { appendRuntimeScripts } from './runtimeScripts'

describe('appendRuntimeScripts', () => {
  it('supports standalone rendering through the generic renderer callback', async () => {
    const output = await renderApp(
      '<html><head></head><body><p>Standalone</p></body></html>',
      {
        components: {},
        context: { recordRuntimeEmbed: () => {} } as PageContext,
        onRendered: (document, runtimeEmbeds) =>
          appendRuntimeScripts(document, runtimeEmbeds, { tabs: 'body' }),
      },
    )
    expect(output).toContain('<p>Standalone</p>')
    expect(output).toContain('tsSsgTabs')
  })
  it('preserves script order and lets recorded placement override frontmatter', async () => {
    await runInDom('<html><head></head><body></body></html>', (document) => {
      appendRuntimeScripts(
        document,
        new Map([
          ['tabs', 'head'],
          ['modal', 'body'],
        ]),
        { tabs: 'body', modal: 'head' },
      )
      expect(document.head.querySelectorAll('script')).toHaveLength(1)
      expect(document.head.querySelector('script')?.textContent).toContain(
        'tsSsgTabs',
      )
      expect(document.body.querySelectorAll('script')).toHaveLength(1)
      expect(document.body.querySelector('script')?.textContent).toContain(
        'tsSsgModal',
      )
    })
  })

  it('supports explicit frontmatter embeds without rendered components', async () => {
    await runInDom('<html><head></head><body></body></html>', (document) => {
      appendRuntimeScripts(document, new Map(), { tabs: 'body', modal: 'body' })
      const scripts = [...document.body.querySelectorAll('script')]
      expect(scripts).toHaveLength(2)
      expect(scripts[0].textContent).toContain('tsSsgTabs')
      expect(scripts[1].textContent).toContain('tsSsgModal')
    })
  })
})

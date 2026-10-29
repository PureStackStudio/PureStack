import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'
import { injectLiveReload } from './live-reload'

describe('live reload browser script', () => {
  it('reloads once for a newer version and closes the stream', () => {
    const browser = loadPage(3)
    const source = browser.sources[0]

    source.state('{broken')
    source.state({ version: 'invalid' })
    source.state({ version: 2 })
    source.state({ version: 3 })
    expect(browser.reload).not.toHaveBeenCalled()

    source.state({ version: 4 })
    // A second event can already be queued when the stream closes.
    source.state({ version: 5 })
    expect(browser.reload).toHaveBeenCalledTimes(1)
    expect(source.closed).toBe(true)
  })

  it('does not cancel a pending navigation to reload the old page', () => {
    const browser = loadPage(3)
    const source = browser.sources[0]

    // The clicked page is still rendering. The old document has not reached
    // pagehide yet, so its event callbacks can still run.
    browser.window.dispatchEvent(new Event('beforeunload'))
    source.state({ version: 4 })

    expect(browser.reload).not.toHaveBeenCalled()
    expect(source.closed).toBe(true)
  })

  it('keeps live reload active on the initial pageshow', () => {
    const browser = loadPage(3)

    browser.show(false)
    expect(browser.sources).toHaveLength(1)
    browser.sources[0].state({ version: 4 })
    expect(browser.reload).toHaveBeenCalledTimes(1)
  })

  it('reconnects when the browser restores a cached document', () => {
    const browser = loadPage(3)

    browser.window.dispatchEvent(new Event('beforeunload'))
    browser.show(true)

    expect(browser.sources).toHaveLength(2)
    expect(browser.sources[0].closed).toBe(true)
    expect(browser.sources[1].url).toBe('/docs/__ts-ssg/events')
    browser.sources[1].state({ version: 3 })
    expect(browser.reload).not.toHaveBeenCalled()
    browser.sources[1].state({ version: 4 })
    expect(browser.reload).toHaveBeenCalledTimes(1)
  })
})

function loadPage(version: number) {
  const sources: FakeEventSource[] = []
  const window = new EventTarget()
  const reload = vi.fn()
  const html = injectLiveReload(
    '<html><body>Page</body></html>',
    '/docs/__ts-ssg/events',
    version,
  )
  const script = html.slice(
    html.indexOf('>', html.indexOf('<script')) + 1,
    html.indexOf('</script>'),
  )
  runInNewContext(script, {
    window,
    location: { reload },
    EventSource: class extends FakeEventSource {
      constructor(url: string) {
        super(url)
        sources.push(this)
      }
    },
  })
  return {
    window,
    reload,
    sources,
    show(persisted: boolean) {
      const event = new Event('pageshow')
      Object.assign(event, { persisted })
      window.dispatchEvent(event)
    },
  }
}

class FakeEventSource extends EventTarget {
  closed = false

  constructor(readonly url: string) {
    super()
  }

  close() {
    this.closed = true
  }

  state(payload: unknown) {
    const event = new Event('state')
    Object.assign(event, {
      data: typeof payload === 'string' ? payload : JSON.stringify(payload),
    })
    this.dispatchEvent(event)
  }
}

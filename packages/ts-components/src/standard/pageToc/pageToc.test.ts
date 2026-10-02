import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineButtonComponents } from '../btn/btn'
import { defineIconComponents } from '../icon/icon'
import { definePageTocComponents } from './pageToc'

function renderPageToc(template: string) {
  const cleanup = ensureDomGlobals()
  const html = renderApp(template, {
    components: {
      ...defineButtonComponents(),
      ...defineIconComponents(getSvgIcon),
      ...definePageTocComponents(),
    },
    context: createTestContext({
      outline: [{ id: 'intro', title: 'Intro', depth: 2 }],
    }),
  })
  cleanup()
  return html.match(/<nav class="([^"]*)"/)?.[1].split(' ') ?? []
}

describe('PageToc rendering', () => {
  it('renders a stateless flat panel by default', () => {
    const classes = renderPageToc(`<PageToc/>`)

    expect(classes).toContain('page-toc')
    expect(classes).toContain('tone-fill-flat')
    expect(classes).toContain('tone-border-surface')
    expect(classes).not.toContain('tone-fill-flat-hover')
  })

  it('accepts tone, variant, variant mode and extra classes', () => {
    const classes = renderPageToc(
      `<PageToc tone="accent" variant="glass" variantMode="stateful" class="spotlight-from-top-right"/>`,
    )

    expect(classes).toContain('tone-fill-glass')
    expect(classes).toContain('tone-fill-glass-hover')
    expect(classes).toContain('tone--accent')
    expect(classes).toContain('spotlight-from-top-right')
    expect(classes).not.toContain('tone-fill-flat')
  })
})

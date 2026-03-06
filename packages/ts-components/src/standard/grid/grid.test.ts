import { ensureDomGlobals } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../../renderApp'
import { createTestContext } from '../../test/testContext'
import { createGridComponents } from './grid'

describe('Grid rendering', () => {
  it('renders responsive grid variables and modifier classes', () => {
    const cleanup = ensureDomGlobals()
    const components = createGridComponents()
    const html = renderApp(
      '<Grid columns="2" columnsMd="3" gap="sm" gapLg="24px" alignItems="center" justifyItems="start" dense="true">item</Grid>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain(
      'class="grid grid--align-center grid--justify-start grid--dense"',
    )
    expect(html).toContain('--grid-cols: 2')
    expect(html).toContain('--grid-cols-md: 3')
    expect(html).toContain('--grid-gap: 0.75rem')
    expect(html).toContain('--grid-gap-lg: 24px')
    expect(html).toContain('item')
  })
})

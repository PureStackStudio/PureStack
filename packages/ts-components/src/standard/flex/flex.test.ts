import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { createFlexComponents } from './flex'

describe('Flex rendering', () => {
  it('renders modifier classes for direction, alignment, justification, wrapping, and inline mode', () => {
    const cleanup = ensureDomGlobals()
    const components = createFlexComponents()
    const html = renderApp(
      '<Flex direction="column" align="center" justify="between" wrap="reverse" inline="true">item</Flex>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain(
      'class="flex flex--column flex--align-center flex--justify-between flex--wrap-reverse flex--inline"',
    )
    expect(html).toContain('item')
  })

  it('supports wrap as a boolean prop', () => {
    const cleanup = ensureDomGlobals()
    const components = createFlexComponents()
    const html = renderApp('<Flex wrap="true">item</Flex>', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="flex flex--wrap"')
  })

  it('omits classes for default row direction and invalid values', () => {
    const cleanup = ensureDomGlobals()
    const components = createFlexComponents()
    const html = renderApp(
      '<Flex direction="row" align="invalid" justify="invalid" wrap="nowrap" inline="false">item</Flex>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="flex"')
    expect(html).not.toContain('flex--column')
    expect(html).not.toContain('flex--wrap')
    expect(html).not.toContain('flex--inline')
  })
})

import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineFlexComponents } from './flex'

describe('Flex rendering', () => {
  it('renders modifier classes for direction, alignment, justification, wrapping, and inline mode', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineFlexComponents()
    const html = await renderApp(
      '<Flex direction="column" align="start" justify="between" wrap="reverse" inline="true">item</Flex>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain(
      'class="flex flex-column align-flex-start justify-between flex-wrap-reverse flex-inline"',
    )
    expect(html).toContain('item')
  })

  it('supports reverse directions for base and responsive layouts', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineFlexComponents()
    const html = await renderApp(
      '<Flex direction="column-reverse" directionMd="row-reverse">item</Flex>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="flex ')
    expect(html).toContain('flex-column-reverse')
    expect(html).toContain('flex-direction-md-row-reverse')
  })

  it('supports wrap as a boolean prop', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineFlexComponents()
    const html = await renderApp('<Flex wrap="true">item</Flex>', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="flex flex-wrap"')
  })

  it('renders responsive modifier classes for breakpoint-specific layout props', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineFlexComponents()
    const html = await renderApp(
      '<Flex justify="stretch" justifyMd="end" alignSm="center" alignMd="end" directionLg="column" wrapXl="nowrap">item</Flex>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="flex ')
    expect(html).toContain('flex-direction-lg-column')
    expect(html).toContain('align-sm-center')
    expect(html).toContain('align-md-flex-end')
    expect(html).toContain('justify-stretch')
    expect(html).toContain('justify-md-end')
    expect(html).toContain('flex-nowrap-xl')
  })

  it('omits classes for default row direction and invalid values', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineFlexComponents()
    const html = await renderApp(
      '<Flex direction="row" align="invalid" justify="invalid" wrap="nowrap" inline="false">item</Flex>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('class="flex"')
    expect(html).not.toContain('flex-column')
    expect(html).not.toContain('flex-wrap')
    expect(html).not.toContain('flex-inline')
  })
})

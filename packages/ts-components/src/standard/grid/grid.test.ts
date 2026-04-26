import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineGridComponents } from './grid'

describe('Grid rendering', () => {
  it('renders responsive grid variables and modifier classes', () => {
    const cleanup = ensureDomGlobals()
    const components = defineGridComponents()
    const html = renderApp(
      '<Grid columns="2" columnsMd="3" alignItems="center" justifyItems="start" dense="true">item</Grid>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain(
      'class="grid grid-align-center grid-justify-start grid-dense"',
    )
    expect(html).toContain('--grid-template-columns: repeat(2, minmax(0, 1fr))')
    expect(html).toContain(
      '--grid-template-columns-md: repeat(3, minmax(0, 1fr))',
    )
    expect(html).toContain('item')
  })

  it('renders custom template columns for base and responsive props', () => {
    const cleanup = ensureDomGlobals()
    const components = defineGridComponents()
    const html = renderApp(
      '<Grid columns="minmax(0, 1fr) auto" columnsMd="200px 1fr">item</Grid>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('--grid-template-columns: minmax(0, 1fr) auto')
    expect(html).toContain('--grid-template-columns-md: 200px 1fr')
  })

  it('supports container as a semantic element override', () => {
    const cleanup = ensureDomGlobals()
    const components = defineGridComponents()
    const html = renderApp(
      '<Grid container="section" columns="2">item</Grid>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('<section')
    expect(html).toContain('class="grid"')
    expect(html).toContain('--grid-template-columns: repeat(2, minmax(0, 1fr))')
  })

  it('keeps responsive numeric columns working when base columns use a template', () => {
    const cleanup = ensureDomGlobals()
    const components = defineGridComponents()
    const html = renderApp(
      '<Grid columns="minmax(0, 1fr) auto" columnsMd="3">item</Grid>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('--grid-template-columns: minmax(0, 1fr) auto')
    expect(html).toContain('--grid-template-columns-sm: minmax(0, 1fr) auto')
    expect(html).toContain(
      '--grid-template-columns-md: repeat(3, minmax(0, 1fr))',
    )
  })

  it('keeps the base template across breakpoints when no responsive columns are set', () => {
    const cleanup = ensureDomGlobals()
    const components = defineGridComponents()
    const html = renderApp('<Grid columns="minmax(0, 1fr) auto">item</Grid>', {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('--grid-template-columns: minmax(0, 1fr) auto')
    expect(html).toContain('--grid-template-columns-sm: minmax(0, 1fr) auto')
    expect(html).toContain('--grid-template-columns-md: minmax(0, 1fr) auto')
    expect(html).toContain('--grid-template-columns-lg: minmax(0, 1fr) auto')
    expect(html).toContain('--grid-template-columns-xl: minmax(0, 1fr) auto')
  })
})

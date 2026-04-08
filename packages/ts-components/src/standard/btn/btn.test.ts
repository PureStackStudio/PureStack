import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { createIconComponents } from '../icon/icon'
import { createButtonComponents } from './btn'

describe('Button rendering', () => {
  it('renders default label button with default classes and type', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createButtonComponents(),
    }
    const html = renderApp(`<Btn>Save</Btn>`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain(
      'class="btn tone-surface--accent tone-border--accent tone-text--accent"',
    )
    expect(html).toContain('type="button"')
    expect(html).toContain('<span class="btn__label">Save</span>')
    expect(html).not.toContain('btn__icon')
  })

  it('renders icon at start and end based on iconPosition', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createButtonComponents(),
    }
    const startHtml = renderApp(`<Btn icon="iconoir:code">Code</Btn>`, {
      components,
      context: createTestContext(),
    })
    const endHtml = renderApp(
      `<Btn icon="iconoir:code" iconPosition="end">Code</Btn>`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(startHtml).toContain('class="icon btn__icon"')
    expect(endHtml).toContain('class="icon btn__icon"')
    expect(startHtml.indexOf('btn__icon')).toBeLessThan(
      startHtml.indexOf('btn__label'),
    )
    expect(endHtml.indexOf('btn__icon')).toBeGreaterThan(
      endHtml.indexOf('btn__label'),
    )
  })

  it('renders icon-only button with aria label and icon-only class', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createButtonComponents(),
    }
    const html = renderApp(
      `<Btn icon="iconoir:pin" iconOnly="true" ariaLabel="Pin item" />`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('btn--icon-only')
    expect(html).toContain('aria-label="Pin item"')
    expect(html).toContain('class="icon btn__icon"')
    expect(html).not.toContain('btn__label')
  })

  it('applies tone, size, type, disabled, and custom class', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createButtonComponents(),
    }
    const html = renderApp(
      `<Btn tone="neutral" size="lg" type="submit" disabled="true" class="u-grow">Deploy</Btn>`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('tone-surface--neutral')
    expect(html).toContain('btn--lg')
    expect(html).toContain('u-grow')
    expect(html).toContain('type="submit"')
    expect(html).toContain('disabled')
  })

  it('supports warning and danger tones', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createButtonComponents(),
    }
    const warningHtml = renderApp(`<Btn tone="warning">Warn</Btn>`, {
      components,
      context: createTestContext(),
    })
    const dangerHtml = renderApp(`<Btn tone="danger">Delete</Btn>`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(warningHtml).toContain('tone-surface--warning')
    expect(dangerHtml).toContain('tone-surface--danger')
  })

  it('renders empty label span when button has no slot and no icon', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createIconComponents(getSvgIcon),
      ...createButtonComponents(),
    }
    const html = renderApp(`<Btn />`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('<span class="btn__label"></span>')
    expect(html).not.toContain('btn__icon')
  })
})

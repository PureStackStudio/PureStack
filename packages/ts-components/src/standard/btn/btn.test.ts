import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineButtonComponents } from './btn'

describe('Button rendering', () => {
  it('renders default label button with default classes and type', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
    }
    const html = renderApp(`<Btn>Save</Btn>`, {
      components,
      context: createTestContext(),
    })
    cleanup()

    expect(html).toContain('class="btn tone-button--accent"')
    expect(html).toContain('type="button"')
    expect(html).toContain('<span class="btn__label">Save</span>')
    expect(html).not.toContain('btn__icon')
  })

  it('renders icon at start and end based on iconPosition', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
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
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
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
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
    }
    const html = renderApp(
      `<Btn tone="neutral" size="lg" type="submit" disabled="true" class="u-grow">Deploy</Btn>`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('tone-button--neutral')
    expect(html).toContain('btn--lg')
    expect(html).toContain('u-grow')
    expect(html).toContain('type="submit"')
    expect(html).toContain('disabled')
  })

  it('renders BtnLink as an anchor with the same visual classes', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
    }
    const html = renderApp(
      `<BtnLink href="./getting-started" tone="neutral" size="lg">Read docs</BtnLink>`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('<a')
    expect(html).toContain('href="/getting-started"')
    expect(html).toContain('tone-button--neutral')
    expect(html).toContain('btn--lg')
    expect(html).toContain('<span class="btn__label">Read docs</span>')
    expect(html).not.toContain('type="button"')
  })

  it('renders BtnLink icons and resolves rel for external targets', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
    }
    const html = renderApp(
      `<BtnLink href="https://example.com/docs" target="_blank" icon="iconoir:code" iconPosition="end">Docs</BtnLink>`,
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('href="https://example.com/docs"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).toContain('class="icon btn__icon"')
  })

  it('supports warning and danger tones', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
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

    expect(warningHtml).toContain('tone-button--warning')
    expect(dangerHtml).toContain('tone-button--danger')
  })

  it('renders empty label span when button has no slot and no icon', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...defineIconComponents(getSvgIcon),
      ...defineButtonComponents(),
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

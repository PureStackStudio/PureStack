import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { createButtonComponents } from '../btn/btn'
import { createContactFormComponents } from './contactForm'

describe('ContactForm rendering', () => {
  it('renders contact fields and action with configured labels', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createButtonComponents(),
      ...createContactFormComponents(),
    }
    const html = renderApp(
      `<ContactForm action="mailto:support@example.com" submitLabel="Send it" />`,
      {
        components,
        context: createTestContext({
          pageInfo: {
            relPath: 'contact/index.mdx',
            urlPath: '/contact/',
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('contact-form__form')
    expect(html).toContain('name="name"')
    expect(html).toContain('name="email"')
    expect(html).toContain('name="topic"')
    expect(html).toContain('name="message"')
    expect(html).toContain('mailto:support@example.com')
    expect(html).toContain('Send it')
  })
})

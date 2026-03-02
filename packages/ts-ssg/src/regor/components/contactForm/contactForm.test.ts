import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../../config/config'
import { normalizeFrontmatter } from '../../../frontmatter/frontmatter'
import { ensureDomGlobals } from '../../../minidom/createDom'
import { renderApp } from '../../renderApp'
import { createContactFormComponents } from './contactForm'

describe('ContactForm rendering', () => {
  it('renders contact fields and action with configured labels', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createContactFormComponents(),
    }
    const site = resolveSiteConfig()
    const pageInfo = {
      relPath: 'contact/index.mdx',
      urlPath: '/contact/',
      frontmatter: normalizeFrontmatter({}),
    }
    const html = renderApp(
      `<ContactForm action="mailto:support@example.com" submitLabel="Send it" />`,
      {
        components,
        context: {
          site,
          theme: site.style.theme,
          pageInfo,
          recordScriptEntrypoint: () => {},
        },
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

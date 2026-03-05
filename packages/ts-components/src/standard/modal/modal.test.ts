import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../../config/config'
import { normalizeFrontmatter } from '../../../frontmatter/frontmatter'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '../../renderApp'
import type { TsSsgContext } from '../../ts-ssg-context'
import { createButtonComponents } from '../btn/btn'
import { createModalComponents } from './modal'

describe('Modal rendering', () => {
  it('renders modal shell and trigger with configured motion classes', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createButtonComponents(),
      ...createModalComponents(),
    }
    const html = renderApp(
      '<Modal id="checkout" title="Checkout" size="lg" fade="true" slideFrom="right"><p>Body</p><template name="footer"><button>Confirm</button></template></Modal><ModalTrigger target="checkout" label="Open checkout" />',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain(
      'class="modal modal--size-lg modal--fade modal--slide-right modal--animated"',
    )
    expect(html).toContain('id="checkout"')
    expect(html).toContain('data-modal-root')
    expect(html).toContain('Open checkout')
    expect(html).toContain('data-modal-target="checkout"')
    expect(html).toContain('Checkout')
    expect(html).toContain('Confirm')
  })

  it('supports full shell override via content slot', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createButtonComponents(),
      ...createModalComponents(),
    }
    const html = renderApp(
      '<Modal id="custom"><template name="content"><article class="modal__panel"><p>Custom shell</p></article></template></Modal>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('Custom shell')
    expect(html).not.toContain('modal__close')
  })

  it('hides close button when showClose is false', () => {
    const cleanup = ensureDomGlobals()
    const components = {
      ...createButtonComponents(),
      ...createModalComponents(),
    }
    const html = renderApp(
      '<Modal id="no-close" title="No close" showClose="false"><p>Body</p></Modal>',
      {
        components,
        context: createTestContext(),
      },
    )
    cleanup()

    expect(html).toContain('id="no-close"')
    expect(html).not.toContain('modal__close')
  })
})

function createTestContext(): TsSsgContext {
  const site = resolveSiteConfig({ rootDir: process.cwd() })
  return {
    site,
    pageInfo: {
      relPath: 'modal.mdx',
      urlPath: '/modal',
      frontmatter: normalizeFrontmatter({}),
    },
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
  }
}

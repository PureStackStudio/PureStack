import type { LogoConfig } from '@purestack/ts-common'
import { createDom, ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { createApp, ref, sref } from 'regor'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineIconComponents } from '../icon/icon'
import { defineLogoComponents } from './logo'

const defineComponents = () => ({
  ...defineIconComponents((name) => `<svg data-icon="${name}"></svg>`),
  ...defineLogoComponents(),
})

describe('SiteLogo', () => {
  it('renders natural brand text and resolves configured links under a base path', () => {
    const cleanup = ensureDomGlobals()
    try {
      const html = renderApp(
        '<SiteLogo brand="Calc Core" subtitle="Backend engine" suffix="." icon="iconoir:cube" href="/"/>',
        {
          components: defineComponents(),
          context: createTestContext({ site: { basePath: '/docs' } }),
        },
      )
      expect(html).toContain('href="/docs/"')
      expect(html).toContain('aria-label="Calc Core"')
      expect(html).toContain('>Calc Core</span>')
      expect(html).toContain('>Backend engine</span>')
      expect(html).toContain('data-icon="iconoir:cube"')
      expect(html).not.toContain('brand-letter')
    } finally {
      cleanup()
    }
  })

  it('supports a named mark slot and omits navigation for a null href', () => {
    const cleanup = ensureDomGlobals()
    try {
      const html = renderApp(
        '<SiteLogo brand="North Star" :href="null" layout="mark"><template #mark><span>Custom artwork</span></template></SiteLogo>',
        { components: defineComponents(), context: createTestContext() },
      )
      expect(html).toContain('role="img"')
      expect(html).not.toContain('href=')
      expect(html).not.toContain('site-logo__copy')
      expect(html).toContain('>Custom artwork</span>')
      expect(html).not.toContain('site-logo__monogram')
    } finally {
      cleanup()
    }
  })

  it('reacts to direct props and config replacement without flattening them at mount', () => {
    const cleanupGlobals = ensureDomGlobals()
    const cleanupDom = createDom(
      '<html><body><div id="app"></div></body></html>',
    )
    const config = sref<LogoConfig>({
      brand: 'First Brand',
      subtitle: 'First subtitle',
      icon: 'iconoir:cube',
      size: 'lg',
    })
    const label = ref('Custom accessible name')
    const layout = ref('horizontal')
    const app = createApp(
      { components: defineComponents(), config, label, layout },
      {
        selector: '#app',
        template:
          '<SiteLogo :config="config" :layout="layout" :ariaLabel="label"/>',
      },
    )
    try {
      const logo = () => {
        const element = document.querySelector<HTMLElement>('.site-logo')
        if (!element) throw new Error('Site logo was not rendered')
        return element
      }
      expect(logo().textContent).toContain('First Brand')
      expect(logo().getAttribute('aria-label')).toBe('Custom accessible name')
      config({
        brand: 'Next Brand',
        subtitle: '',
        href: null,
        imageSrc: '/light.png',
        imageSrcDark: '/dark.png',
        size: 'sm',
        brandColor: '#123456',
      })
      expect(logo().textContent).toContain('Next Brand')
      expect(logo().querySelector('.site-logo__subtitle')).toBeNull()
      expect(logo().getAttribute('href')).toBeNull()
      expect(logo().className).toContain('site-logo--sm')
      expect(logo().querySelectorAll('img')).toHaveLength(2)
      expect(logo().querySelector('svg')).toBeNull()
      expect(logo().getAttribute('style')).toContain(
        '--ps-logo-brand-color: #123456',
      )
      label('Updated name')
      layout('wordmark')
      expect(logo().getAttribute('aria-label')).toBe('Updated name')
      expect(logo().querySelector('.site-logo__mark')).toBeNull()
      config({ brand: 'Last Brand', monogram: 'LB', layout: 'stacked' })
      expect(logo().className).toContain('site-logo--wordmark')
      layout('mark')
      expect(logo().textContent).toContain('LB')
      expect(logo().querySelector('.site-logo__copy')).toBeNull()
    } finally {
      app.unbind()
      cleanupDom()
      cleanupGlobals()
    }
  })
})

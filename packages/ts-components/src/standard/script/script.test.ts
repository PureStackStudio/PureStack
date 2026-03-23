import { ensureDomGlobals } from '@purestack/ts-minidom'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../../render/renderApp'
import { createTestContext } from '../../test/testContext'
import { createScriptComponents } from './script'

describe('PageScript rendering', () => {
  it('maps local .ts src to emitted .js path and defaults to module', () => {
    const cleanup = ensureDomGlobals()
    const components = createScriptComponents()
    const html = renderApp('<PageScript src="./login.ts" />', {
      components,
      context: createTestContext({
        pageInfo: {
          relPath: 'login.mdx',
          urlPath: '/login/',
        },
      }),
    })
    cleanup()

    expect(html).toContain('<script')
    expect(html).toContain('src="/login/login.js"')
    expect(html).toContain('type="module"')
  })

  it('resolves nested relative paths and keeps query/hash suffix', () => {
    const cleanup = ensureDomGlobals()
    const components = createScriptComponents()
    const html = renderApp(
      '<PageScript src="../scripts/policies.ts?mode=prod#boot" />',
      {
        components,
        context: createTestContext({
          pageInfo: {
            relPath: 'security/policies.mdx',
            urlPath: '/security/policies/',
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('src="/scripts/policies/policies.js?mode=prod#boot"')
    expect(html).toContain('type="module"')
  })

  it('renders RegorApp as app shell and reuses PageScript src mapping', () => {
    const cleanup = ensureDomGlobals()
    const components = createScriptComponents()
    const html = renderApp(
      '<RegorApp src="./hosts.ts" id="hosts-app" name="hosts-main"></RegorApp>',
      {
        components,
        context: createTestContext({
          pageInfo: {
            relPath: 'hosts.mdx',
            urlPath: '/hosts/',
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('<app')
    expect(html).toContain('id="hosts-app"')
    expect(html).toContain('name="hosts-main"')
    expect(html).toContain('src="/hosts/hosts.js"')
    expect(html).toContain('type="module"')
  })
})

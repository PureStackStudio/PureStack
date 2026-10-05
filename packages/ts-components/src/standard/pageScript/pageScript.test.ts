import { ensureDomGlobals } from '@purestack/ts-minidom'
import { renderApp } from '@purestack/ts-render'
import { describe, expect, it } from 'vitest'
import { createTestContext } from '../../test/testContext'
import { defineScriptComponents } from './pageScript'

describe('PageScript rendering', () => {
  it('maps local .ts src to emitted .js path and defaults to module', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const html = await renderApp('<PageScript src="./login.ts" />', {
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
    expect(html).toContain('src="/login.js"')
    expect(html).toContain('type="module"')
  })

  it('resolves nested relative paths and keeps query/hash suffix', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const html = await renderApp(
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

    expect(html).toContain('src="/scripts/policies.js?mode=prod#boot"')
    expect(html).toContain('type="module"')
  })

  it('uses the SSG script public path resolver when available', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const resolvedScripts: string[] = []
    const html = await renderApp(
      '<PageScript src="./login.ts?mode=prod#boot" />',
      {
        components,
        context: createTestContext({
          pageInfo: {
            relPath: 'login.mdx',
            urlPath: '/login/',
          },
          resolveScriptPublicPath: (sourceRelPath) => {
            resolvedScripts.push(sourceRelPath)
            return '/login.ab12.js'
          },
        }),
      },
    )
    cleanup()

    expect(resolvedScripts).toEqual(['login.ts'])
    expect(html).toContain('src="/login.ab12.js?mode=prod#boot"')
  })

  it('resolves local src relative to an explicit source owner', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const html = await renderApp(
      '<PageScript src="./auth-state.ts" sourceRelPath="header.mdx" />',
      {
        components,
        context: createTestContext({
          pageInfo: {
            relPath: 'account/settings.mdx',
            urlPath: '/account/settings/',
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('src="/auth-state.js"')
    expect(html).not.toContain('/account/auth-state.js')
  })

  it('maps same-name folder page scripts beside their folder page', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const html = await renderApp('<PageScript src="./account.ts" />', {
      components,
      context: createTestContext({
        pageInfo: {
          relPath: 'account/account.mdx',
          urlPath: '/account/',
        },
      }),
    })
    cleanup()

    expect(html).toContain('src="/account/account.js"')
  })

  it('renders RegorApp as app shell and reuses PageScript src mapping', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const html = await renderApp(
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
    expect(html).toContain('src="/hosts.js"')
    expect(html).toContain('type="module"')
  })

  it('passes RegorApp source owner through to its PageScript', async () => {
    const cleanup = ensureDomGlobals()
    const components = defineScriptComponents()
    const html = await renderApp(
      '<RegorApp src="./auth-state.ts" sourceRelPath="header.mdx"></RegorApp>',
      {
        components,
        context: createTestContext({
          pageInfo: {
            relPath: 'account/settings.mdx',
            urlPath: '/account/settings/',
          },
        }),
      },
    )
    cleanup()

    expect(html).toContain('src="/auth-state.js"')
    expect(html).not.toContain('/account/auth-state.js')
  })
})

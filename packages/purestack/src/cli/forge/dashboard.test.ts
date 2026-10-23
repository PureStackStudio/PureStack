import { runInDom } from '@purestack/ts-minidom'
import { createApp, html } from 'regor'
import { describe, expect, it } from 'vitest'
import { defineComponents } from '../../../forge/modules/components'
import {
  type Dashboard,
  defineDashboardComponent,
} from '../../../forge/modules/components/dashboard'

function click(document: Document, label: string) {
  const button = Array.from(document.querySelectorAll('button')).find((entry) =>
    entry.textContent?.includes(label),
  )
  expect(button, `Missing button: ${label}`).toBeTruthy()
  button?.dispatchEvent(new Event('click', { bubbles: true }))
}

function edit(document: Document, id: string, value: string) {
  const input = document.querySelector(`#${id}`) as HTMLInputElement
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('PureStack Forge Regor dashboard', () => {
  it('switches to creation and keeps progress, connection state, and form values reactive', () =>
    runInDom('<div id="forge-app"></div>', (document) => {
      const dashboard = defineDashboardComponent()
      const context = dashboard.context
      const contexts: Dashboard[] = []
      dashboard.context = (head) => {
        const instance = context(head)
        contexts.push(instance)
        return instance
      }
      const app = createApp(
        {
          components: {
            ...defineComponents(),
            dashboard: dashboard,
          },
        },
        { selector: '#forge-app', template: html`<Dashboard/>` },
      )
      try {
        const { model } = contexts[0]
        edit(document, 'forge-title', 'Preserved title')
        model.status('creating')
        model.tasks([{ label: 'Creating files', state: 'running' }])
        expect(document.querySelector('#forge-title')).toBeNull()
        expect(document.querySelector('.forge-panel')?.textContent).toContain(
          'Creating files',
        )
        expect(
          Array.from(
            document.querySelectorAll('.forge-navigation button'),
          ).every((button) => button.hasAttribute('disabled')),
        ).toBe(true)
        model.tasks([{ label: 'Creating files', state: 'done' }])
        model.status('failed')
        expect(document.querySelector('#forge-title')).toBeTruthy()
        expect(model.title()).toBe('Preserved title')
        model.result({
          directory: '/sites/my-site',
          template: '@purestack/template-starter@1.1.19',
          version: '1.1.19',
          packageManager: 'yarn',
          installed: false,
          git: 'skipped',
          failures: [],
          commands: ['yarn dev'],
        })
        model.status('ready')
        const finish = () =>
          Array.from(document.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Finish Forge'),
          )
        expect(finish()).toBeTruthy()
        expect(finish()?.hasAttribute('disabled')).toBe(true)
        model.connection('connected')
        expect(finish()?.hasAttribute('disabled')).toBe(false)
        model.connection('reconnecting')
        expect(finish()?.hasAttribute('disabled')).toBe(true)
      } finally {
        app.unbind()
      }
    }))

  it('keeps native form values and selections through navigation and review', () =>
    runInDom('<div id="forge-app"></div>', (document) => {
      const app = createApp(
        { components: defineComponents() },
        { selector: '#forge-app', template: html`<Dashboard/>` },
      )
      try {
        edit(document, 'forge-title', 'My Documentation')
        edit(document, 'forge-directory', 'my-docs')
        click(document, 'Choose a template')
        expect(document.querySelectorAll('.forge-template-card')).toHaveLength(
          1,
        )
        document
          .querySelectorAll('.forge-template-card button')[0]
          .dispatchEvent(new Event('click', { bubbles: true }))
        expect(
          document
            .querySelectorAll('.forge-template-card button')[0]
            .getAttribute('aria-pressed'),
        ).toBe('true')
        click(document, 'Template options →')
        expect(
          document.querySelector('[aria-current="step"]')?.textContent,
        ).toContain('Template options')
        click(document, 'Project setup →')
        for (const id of ['forge-install', 'forge-git']) {
          const checkbox = document.querySelector(`#${id}`) as HTMLInputElement
          checkbox.checked = true
          checkbox.dispatchEvent(new Event('change', { bubbles: true }))
        }
        click(document, 'Review configuration')
        const summary = document.querySelector('.forge-review')?.textContent
        expect(summary).toContain('My Documentation')
        expect(summary).toContain('my-docs')
        expect(
          document.querySelectorAll('.forge-review dd')[2].textContent,
        ).toBe('Starter')
        expect(summary).toContain('Install dependencies')
        expect(summary).toContain('Initialize or reuse')
        click(document, 'Back')
        for (const id of ['forge-install', 'forge-git']) {
          expect(
            (document.querySelector(`#${id}`) as HTMLInputElement).checked,
          ).toBe(true)
        }
        click(document, 'Back')
        click(document, 'Back')
        expect(
          document
            .querySelectorAll('.forge-template-card button')[0]
            .getAttribute('aria-pressed'),
        ).toBe('true')
        click(document, 'Back')
        expect(
          (document.querySelector('#forge-title') as HTMLInputElement).value,
        ).toBe('My Documentation')
        expect(
          (document.querySelector('#forge-directory') as HTMLInputElement)
            .value,
        ).toBe('my-docs')
      } finally {
        app.unbind()
      }
    }))

  it.each(['forge-title', 'forge-directory'])(
    'keeps review closed when %s is empty',
    (id) =>
      runInDom('<div id="forge-app"></div>', (document) => {
        const app = createApp(
          { components: defineComponents() },
          { selector: '#forge-app', template: html`<Dashboard/>` },
        )
        try {
          edit(document, id, '')
          click(document, 'Review')
          expect(document.querySelector('.forge-review')).toBeNull()
          expect(
            document.querySelector('.forge-panel [role="status"]')?.textContent,
          ).toContain('Enter a site title and project folder')
        } finally {
          app.unbind()
        }
      }),
  )
})

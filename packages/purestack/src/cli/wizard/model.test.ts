import { createDom } from '@purestack/ts-minidom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { StudioConnectionState } from '../../../wizard/modules/connection'
import { WizardModel } from '../../../wizard/modules/model'
import type {
  StudioEvent,
  StudioSnapshot,
} from '../../../wizard/modules/shared/protocol'

const transport = vi.hoisted(() => ({
  receive: (_event: StudioEvent) => {},
  state: (_state: StudioConnectionState) => {},
  send: vi.fn(() => true),
}))

vi.mock('../../../wizard/modules/connection', () => ({
  StudioConnection: class {
    constructor(
      receive: (event: StudioEvent) => void,
      state: (state: StudioConnectionState) => void,
    ) {
      transport.receive = receive
      transport.state = state
    }
    connect = vi.fn()
    send = transport.send
    close = vi.fn()
  },
}))

function snapshot(source = 'starter'): StudioSnapshot {
  return {
    cwd: '/sites',
    version: '1.1.19',
    configuration: {
      title: 'My site',
      directory: 'my-site',
      template: source,
      install: false,
      git: false,
      values: { heading: 'Original heading' },
    },
    templates: [
      {
        id: source,
        title: source === 'starter' ? 'Starter' : 'Custom',
        description: '',
        marker: 'S',
      },
    ],
    template: {
      source,
      name: '@purestack/template-starter',
      version: '1.1.19',
      description: '',
      ui: {
        version: 1,
        categories: [
          {
            id: 'content',
            label: 'Content',
            description: '',
            categories: [],
            fields: [
              {
                id: 'heading',
                label: 'Heading',
                description: '',
                type: 'text',
                default: 'Default heading',
                bindings: [],
              },
            ],
          },
        ],
      },
    },
    status: 'idle',
    tasks: [],
  }
}

let restoreDom = () => {}
beforeEach(() => {
  restoreDom = createDom('')
  transport.send.mockReset().mockReturnValue(true)
  vi.stubGlobal('location', new URL('http://localhost/#token=test'))
})

afterEach(() => {
  vi.unstubAllGlobals()
  restoreDom()
})

function connectedModel() {
  const model = new WizardModel()
  model.connect()
  transport.state('connected')
  transport.receive({ type: 'snapshot', snapshot: snapshot() })
  return model
}

function receive(source: string, loadingTemplate?: string) {
  transport.receive({
    type: 'snapshot',
    snapshot: { ...snapshot(source), loadingTemplate },
  })
}

describe('Studio template selection', () => {
  it('keeps the confirmed template and edited settings usable after a failed load', () => {
    const model = connectedModel()
    model.categories()[0].fields[0].value('Edited heading')
    model.chooseTemplate('@missing/template')
    expect(model.templateLoading()).toBe(true)
    expect(model.canCreate()).toBe(false)
    expect(model.template()).toBe('starter')
    transport.receive({ type: 'error', message: 'Template package not found.' })
    expect(model.error()).toBe('Template package not found.')
    expect(model.templateLoading()).toBe(false)
    expect(model.template()).toBe('starter')
    expect(
      model.summary().find((entry) => entry.label === 'Template')?.value,
    ).toBe('Starter')
    expect(model.canCreate()).toBe(true)
    model.create()
    expect(transport.send).toHaveBeenLastCalledWith({
      type: 'create',
      configuration: {
        ...snapshot().configuration,
        values: { heading: 'Edited heading' },
      },
    })
  })

  it('changes the active template only when its snapshot is confirmed', () => {
    const model = connectedModel()
    model.chooseTemplate('@company/template')
    expect(model.template()).toBe('starter')
    expect(transport.send).toHaveBeenLastCalledWith({
      type: 'template',
      source: '@company/template',
    })
    receive('starter', '@company/template')
    expect(model.templateLoading()).toBe(true)
    expect(model.template()).toBe('starter')
    receive('@company/template')
    expect(model.template()).toBe('@company/template')
    expect(model.templateLoading()).toBe(false)
    expect(
      model.summary().find((entry) => entry.label === 'Template')?.value,
    ).toBe('Custom')
    model.create()
    expect(transport.send).toHaveBeenLastCalledWith({
      type: 'create',
      configuration: snapshot('@company/template').configuration,
    })
  })

  it('preserves the confirmed template when a selection cannot be sent', () => {
    const model = connectedModel()
    transport.send.mockReturnValueOnce(false)
    model.chooseTemplate('@company/template')
    expect(model.templateLoading()).toBe(false)
    expect(model.template()).toBe('starter')
    expect(model.error()).toContain('reconnecting')
  })

  it('keeps loading and edited settings through unrelated snapshots', () => {
    const model = connectedModel()
    model.categories()[0].fields[0].value('Edited heading')
    model.chooseTemplate('@company/template')
    // Sent before the server received the request, e.g. by another tab.
    receive('starter')
    expect(model.templateLoading()).toBe(true)
    expect(model.canCreate()).toBe(false)
    receive('starter', '@company/template')
    receive('starter', '@company/template')
    expect(model.templateLoading()).toBe(true)
    expect(model.categories()[0].fields[0].value()).toBe('Edited heading')
    receive('@company/template')
    expect(model.templateLoading()).toBe(false)
    expect(model.template()).toBe('@company/template')
    expect(model.categories()[0].fields[0].value()).toBe('Original heading')
  })

  it('follows the server when a newer selection replaces the request', () => {
    const model = connectedModel()
    model.chooseTemplate('@company/template')
    receive('starter', '@company/template')
    receive('starter', '@other/template')
    expect(model.templateLoading()).toBe(true)
    receive('@other/template')
    expect(model.templateLoading()).toBe(false)
    expect(model.template()).toBe('@other/template')
    expect(model.canCreate()).toBe(true)
  })

  it('stops waiting for an unacknowledged request when the connection drops', () => {
    const model = connectedModel()
    model.chooseTemplate('@company/template')
    transport.state('reconnecting')
    transport.state('connected')
    receive('starter')
    expect(model.templateLoading()).toBe(false)
    expect(model.template()).toBe('starter')
    expect(model.canCreate()).toBe(true)
  })
})

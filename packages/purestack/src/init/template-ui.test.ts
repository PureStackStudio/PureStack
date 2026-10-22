import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { parseInitArguments, parseTemplateOverrides } from '../cli/arguments'
import {
  applyTemplateValues,
  parseTemplateUi,
  resolveTemplateValues,
  templateFields,
} from './template-ui'

function definition() {
  return {
    version: 1,
    categories: [
      {
        id: 'brand',
        label: 'Brand',
        description: 'Brand settings',
        fields: [
          {
            id: 'palette',
            label: 'Palette',
            description: 'Colors',
            type: 'select',
            default: 'blue',
            choices: [
              { value: 'blue', label: 'Blue', color: '#2874b7' },
              { value: 'mint', label: 'Mint', color: '#6dd59a' },
            ],
            bindings: [
              { path: ['style', 'theme', 'presets'], transform: 'array' },
            ],
          },
          {
            id: 'search',
            label: 'Search',
            description: 'Find pages',
            type: 'toggle',
            default: true,
            bindings: [{ path: ['pagefind', 'enabled'] }],
          },
          {
            id: 'site-url',
            label: 'URL',
            description: 'Public address',
            type: 'text',
            default: '',
            validation: 'url',
            bindings: [
              { path: ['sitemap', 'baseUrl'], transform: 'trim-slashes' },
              { path: ['sitemap', 'enabled'], transform: 'nonempty' },
            ],
          },
        ],
      },
    ],
  }
}
let temporary: string | undefined
afterEach(async () => {
  if (temporary) await rm(temporary, { recursive: true, force: true })
  temporary = undefined
})

describe('template UI contract', () => {
  it('resolves template defaults and validates values from the same schema as the menu', () => {
    const ui = parseTemplateUi(definition())
    expect(templateFields(ui).map((field) => field.id)).toEqual([
      'palette',
      'search',
      'site-url',
    ])
    expect(resolveTemplateValues(ui, { palette: 'mint' })).toEqual({
      palette: 'mint',
      search: true,
      'site-url': '',
    })
    expect(() => resolveTemplateValues(ui, { unknown: 'value' })).toThrow(
      'Unknown template option',
    )
    expect(() =>
      resolveTemplateValues(ui, { palette: 'not-a-choice' }),
    ).toThrow('available values')
    expect(() => resolveTemplateValues(ui, { search: 'true' })).toThrow('type')
  })
  it('rejects unsafe binding paths, duplicate IDs, and unknown transforms', () => {
    for (const unsafe of ['__proto__', 'constructor', 'prototype']) {
      const input = definition()
      input.categories[0].fields[0].bindings[0].path = [unsafe, 'polluted']
      expect(() => parseTemplateUi(input)).toThrow('binding')
    }
    const duplicate = definition()
    duplicate.categories[0].fields[0].id = 'brand'
    expect(() => parseTemplateUi(duplicate)).toThrow('duplicate')
    const transform = definition()
    transform.categories[0].fields[0].bindings[0] = {
      path: ['style'],
      transform: 'execute-js',
    }
    expect(() => parseTemplateUi(transform)).toThrow('transform')
  })
  it('rejects invalid defaults, URL credentials, and malformed categories', () => {
    const invalidDefault = definition()
    invalidDefault.categories[0].fields[0].default = 'unknown'
    expect(() => parseTemplateUi(invalidDefault)).toThrow('default')
    const ui = parseTemplateUi(definition())
    expect(() =>
      resolveTemplateValues(ui, {
        'site-url': 'https://user:secret@example.com',
      }),
    ).toThrow('credentials')
    expect(() =>
      parseTemplateUi({
        version: 1,
        categories: [
          {
            id: 'broken',
            label: 'Broken',
            description: 'Broken',
            fields: 'not-an-array',
          },
        ],
      }),
    ).toThrow('arrays')
  })
  it('writes declarative bindings without changing unrelated template configuration', async () => {
    temporary = await mkdtemp(path.join(tmpdir(), 'purestack-ui-test-'))
    await mkdir(path.join(temporary, 'content'))
    const file = path.join(temporary, 'content/siteConfig.json')
    await writeFile(
      file,
      JSON.stringify({
        siteTitle: 'Original',
        style: { theme: { skin: 'standard' } },
        extensions: { custom: { keep: true } },
      }),
    )
    await applyTemplateValues(temporary, parseTemplateUi(definition()), {
      palette: 'mint',
      search: false,
      'site-url': 'https://example.com/',
    })
    expect(JSON.parse(await readFile(file, 'utf8'))).toEqual({
      siteTitle: 'Original',
      style: { theme: { skin: 'standard', presets: ['mint'] } },
      pagefind: { enabled: false },
      sitemap: { baseUrl: 'https://example.com', enabled: true },
      extensions: { custom: { keep: true } },
    })
    expect(Object.prototype).not.toHaveProperty('polluted')
  })
})

describe('native argument parsing', () => {
  it('accepts optional Studio host and port, including automatic port selection', () => {
    expect(parseInitArguments([], process.cwd())).toMatchObject({
      host: undefined,
      port: undefined,
    })
    expect(
      parseInitArguments(
        ['--host', '0.0.0.0', '--port', '4700'],
        process.cwd(),
      ),
    ).toMatchObject({ host: '0.0.0.0', port: 4700 })
    expect(
      parseInitArguments(['--host=::1', '--port=0'], process.cwd()),
    ).toMatchObject({ host: '::1', port: 0 })
    expect(parseInitArguments(['--port=65535'], process.cwd()).port).toBe(65535)
  })
  it.each([
    '',
    ' ',
    '-1',
    '65536',
    '1.5',
    'NaN',
    'Infinity',
    '1e3',
    '0x50',
    '9'.repeat(400),
  ])('rejects invalid Studio port %j', (port) => {
    expect(() => parseInitArguments([`--port=${port}`], process.cwd())).toThrow(
      'Port must be an integer between 0 and 65535.',
    )
  })
  it('rejects an empty host or missing network option values', () => {
    expect(() => parseInitArguments(['--host= '], process.cwd())).toThrow(
      'Host cannot be empty.',
    )
    for (const option of ['--host', '--port'])
      expect(() => parseInitArguments([option], process.cwd())).toThrow()
  })
  it('accepts init alone, preserves the working directory, and makes setup opt-in', () => {
    expect(parseInitArguments([], process.cwd())).toMatchObject({
      directory: undefined,
      template: 'starter',
      install: false,
      git: false,
      yes: false,
    })
    expect(
      parseInitArguments(
        ['--install', '--git', '--yes', 'my-site'],
        process.cwd(),
      ),
    ).toMatchObject({
      directory: 'my-site',
      install: true,
      git: true,
      yes: true,
    })
  })
  it.each([
    '--no-install',
    '--no-git',
    '--git=false',
    '--install=false',
    '--preset',
  ])('rejects removed option %s', (argument) => {
    expect(() =>
      parseInitArguments(['my-site', argument], process.cwd()),
    ).toThrow()
  })
  it('parses template-specific overrides and rejects ambiguous values', () => {
    const ui = parseTemplateUi(definition())
    expect(
      parseTemplateOverrides(ui, ['palette=mint', 'search=false']),
    ).toEqual({ palette: 'mint', search: false })
    expect(() => parseTemplateOverrides(ui, ['search=off'])).toThrow('type')
    expect(() =>
      parseTemplateOverrides(ui, ['palette=blue', 'palette=mint']),
    ).toThrow('twice')
    expect(() => parseTemplateOverrides(ui, ['anything=value'])).toThrow(
      'Unknown',
    )
  })
})

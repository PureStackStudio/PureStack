import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type OptionValue = string | boolean
export interface TemplateChoice {
  value: OptionValue
  label: string
  description?: string
  color?: string
}
export interface ConfigBinding {
  path: string[]
  transform?: 'identity' | 'array' | 'not' | 'nonempty' | 'trim-slashes'
}
export interface TemplateField {
  id: string
  label: string
  description: string
  type: 'text' | 'select' | 'toggle'
  default: OptionValue
  choices?: TemplateChoice[]
  validation?: 'required' | 'url' | 'base-path'
  bindings: ConfigBinding[]
}
export interface TemplateCategory {
  id: string
  label: string
  description: string
  categories: TemplateCategory[]
  fields: TemplateField[]
}
export interface TemplateUi {
  version: 1
  categories: TemplateCategory[]
}

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}
function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 2000)
    throw new Error(`Invalid template UI ${label}.`)
  return value
}
function value(input: unknown): OptionValue {
  if (typeof input !== 'boolean' && typeof input !== 'string')
    throw new Error('Template UI values must be strings or booleans.')
  return input
}

/** Validate untrusted template metadata before it can become navigation or writes. */
export function parseTemplateUi(input: unknown): TemplateUi {
  if (!record(input) || input.version !== 1 || !Array.isArray(input.categories))
    throw new Error('Invalid template UI. Expected version 1 and categories.')
  const ids = new Set<string>()
  function id(input: unknown) {
    const result = text(input, 'id')
    if (
      !/^[a-z][a-z0-9.-]*$/.test(result) ||
      ids.has(result) ||
      ids.size >= 250
    )
      throw new Error(`Invalid or duplicate template UI id: ${result}`)
    ids.add(result)
    return result
  }
  function field(input: unknown): TemplateField {
    if (
      !record(input) ||
      !['text', 'select', 'toggle'].includes(String(input.type)) ||
      !Array.isArray(input.bindings)
    )
      throw new Error('Invalid template UI field.')
    const result: TemplateField = {
      id: id(input.id),
      label: text(input.label, 'field label'),
      description: text(input.description, 'field description'),
      type: input.type as TemplateField['type'],
      default: value(input.default),
      bindings: [],
    }
    if (input.validation !== undefined) {
      if (!['required', 'url', 'base-path'].includes(String(input.validation)))
        throw new Error(`Unknown validation for ${result.id}.`)
      result.validation = input.validation as TemplateField['validation']
    }
    if (input.choices !== undefined) {
      if (!Array.isArray(input.choices) || input.choices.length > 100)
        throw new Error(`Invalid choices for ${result.id}.`)
      const values = new Set<OptionValue>()
      result.choices = input.choices.map((choice) => {
        if (!record(choice)) throw new Error(`Invalid choice for ${result.id}.`)
        const choiceValue = value(choice.value)
        if (values.has(choiceValue))
          throw new Error(`Duplicate choice in ${result.id}.`)
        values.add(choiceValue)
        if (
          choice.color !== undefined &&
          (typeof choice.color !== 'string' ||
            !/^#[a-f0-9]{6}$/i.test(choice.color))
        )
          throw new Error('Invalid template color swatch.')
        return {
          value: choiceValue,
          label: text(choice.label, 'choice label'),
          description:
            typeof choice.description === 'string'
              ? choice.description
              : undefined,
          color: choice.color as string | undefined,
        }
      })
    }
    for (const binding of input.bindings) {
      if (
        !record(binding) ||
        !Array.isArray(binding.path) ||
        !binding.path.length ||
        binding.path.length > 12 ||
        binding.path.some(
          (key) =>
            typeof key !== 'string' ||
            !key ||
            ['__proto__', 'constructor', 'prototype'].includes(key),
        )
      )
        throw new Error(`Invalid config binding for ${result.id}.`)
      if (
        binding.transform !== undefined &&
        !['identity', 'array', 'not', 'nonempty', 'trim-slashes'].includes(
          String(binding.transform),
        )
      )
        throw new Error(`Invalid config transform for ${result.id}.`)
      if (binding.transform === 'not' && result.type !== 'toggle')
        throw new Error('The not transform requires a toggle.')
      result.bindings.push({
        path: binding.path as string[],
        transform: binding.transform as ConfigBinding['transform'],
      })
    }
    const invalid = validateField(result, result.default)
    if (invalid) throw new Error(`Invalid default for ${result.id}: ${invalid}`)
    return result
  }
  function category(input: unknown, depth: number): TemplateCategory {
    if (!record(input) || depth > 5)
      throw new Error('Invalid template UI category nesting.')
    if (
      (input.categories !== undefined && !Array.isArray(input.categories)) ||
      (input.fields !== undefined && !Array.isArray(input.fields))
    )
      throw new Error('Category fields and categories must be arrays.')
    return {
      id: id(input.id),
      label: text(input.label, 'category label'),
      description: text(input.description, 'category description'),
      categories: ((input.categories ?? []) as unknown[]).map((child) =>
        category(child, depth + 1),
      ),
      fields: ((input.fields ?? []) as unknown[]).map(field),
    }
  }
  return {
    version: 1,
    categories: input.categories.map((item) => category(item, 0)),
  }
}

export function templateFields(ui: TemplateUi): TemplateField[] {
  return ui.categories.flatMap(function collect(category): TemplateField[] {
    return [...category.fields, ...category.categories.flatMap(collect)]
  })
}

export function validateField(field: TemplateField, input: OptionValue) {
  if (
    (field.type === 'toggle' && typeof input !== 'boolean') ||
    (field.type === 'text' && typeof input !== 'string')
  )
    return 'Invalid value type.'
  if (
    field.type === 'select' &&
    !field.choices?.some((choice) => choice.value === input)
  )
    return 'Choose one of the available values.'
  if (typeof input !== 'string') return undefined
  if (input.length > 2000 || /[\r\n]/.test(input))
    return 'Use a single line of at most 2,000 characters.'
  if (field.validation === 'required' && !input.trim())
    return 'This value is required.'
  if (field.validation === 'url' && input) {
    try {
      const url = new URL(input)
      if (
        !['https:', 'http:'].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
      )
        return 'Use a public http:// or https:// URL without credentials, query, or fragment.'
    } catch {
      return 'Use an absolute URL such as https://example.com.'
    }
  }
  if (
    field.validation === 'base-path' &&
    input &&
    (!input.startsWith('/') ||
      /[\\?#\s]/.test(input) ||
      input
        .split('/')
        .slice(1)
        .some(
          (part, index, parts) =>
            part === '.' ||
            part === '..' ||
            (!part && index < parts.length - 1),
        ))
  )
    return 'Use a path such as /docs, without traversal, query, or fragment.'
  return undefined
}

export async function readTemplateUi(root: string): Promise<TemplateUi> {
  const manifest = JSON.parse(
    await readFile(path.join(root, 'template.json'), 'utf8'),
  )
  if (manifest.ui === undefined) return { version: 1, categories: [] }
  if (manifest.ui !== 'template.ui.json')
    throw new Error('Template UI must reference template.ui.json.')
  return parseTemplateUi(
    JSON.parse(await readFile(path.join(root, manifest.ui), 'utf8')),
  )
}

export function resolveTemplateValues(
  ui: TemplateUi,
  overrides: Record<string, OptionValue> = {},
) {
  const fields = templateFields(ui)
  const result: Record<string, OptionValue> = {}
  for (const key of Object.keys(overrides))
    if (!fields.some((field) => field.id === key))
      throw new Error(`Unknown template option: ${key}`)
  for (const field of fields) {
    const current = Object.hasOwn(overrides, field.id)
      ? overrides[field.id]
      : field.default
    const invalid = validateField(field, current)
    if (invalid) throw new Error(`${field.label}: ${invalid}`)
    result[field.id] = current
  }
  return result
}

export async function applyTemplateValues(
  source: string,
  ui: TemplateUi,
  overrides: Record<string, OptionValue>,
) {
  const values = resolveTemplateValues(ui, overrides)
  const file = path.join(source, 'content/siteConfig.json')
  const config: unknown = JSON.parse(await readFile(file, 'utf8'))
  if (!record(config))
    throw new Error('siteConfig.json must contain an object.')
  for (const field of templateFields(ui))
    for (const binding of field.bindings) {
      let parent = config
      for (const key of binding.path.slice(0, -1)) {
        if (!Object.hasOwn(parent, key)) parent[key] = {}
        const child = parent[key]
        if (!record(child))
          throw new Error(
            `Cannot write template binding ${binding.path.join('.')}.`,
          )
        parent = child
      }
      const input = values[field.id]
      const output =
        binding.transform === 'array'
          ? [input]
          : binding.transform === 'not'
            ? !input
            : binding.transform === 'nonempty'
              ? Boolean(input)
              : binding.transform === 'trim-slashes'
                ? String(input).replace(/\/+$/, '')
                : input
      parent[binding.path.at(-1) as string] = output
    }
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`)
}

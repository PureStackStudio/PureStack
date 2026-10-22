import type {
  StudioCommand,
  StudioConfiguration,
} from '../../../wizard/modules/shared/protocol'

function object(value: unknown): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected a Studio message object.')
}
function text(value: unknown): asserts value is string {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    value.length > 2000 ||
    [...value].some((character) => character.charCodeAt(0) < 32)
  )
    throw new Error('Enter a valid title, folder, or template source.')
}

export function parseStudioCommand(message: string): StudioCommand {
  const input: unknown = JSON.parse(message)
  object(input)
  if (input.type === 'finish' || input.type === 'preview')
    return { type: input.type }
  if (input.type === 'template') {
    text(input.source)
    return { type: 'template', source: input.source }
  }
  if (input.type !== 'create') throw new Error('Unknown Studio command.')
  const config = input.configuration
  object(config)
  text(config.title)
  text(config.directory)
  text(config.template)
  if (typeof config.install !== 'boolean' || typeof config.git !== 'boolean')
    throw new Error('Invalid installation or Git choice.')
  object(config.values)
  if (
    Object.keys(config.values).length > 250 ||
    Object.values(config.values).some(
      (value) =>
        typeof value !== 'boolean' &&
        (typeof value !== 'string' || value.length > 2000),
    )
  )
    throw new Error('Invalid template options.')
  return {
    type: 'create',
    configuration: config as unknown as StudioConfiguration,
  }
}

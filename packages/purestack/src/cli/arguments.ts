import { parseArgs } from 'node:util'
import { resolveTemplateSpec } from '../init/template'
import {
  type OptionValue,
  type TemplateUi,
  templateFields,
  validateField,
} from '../init/template-ui'

export interface InitArguments {
  directory?: string
  template: string
  title?: string
  host?: string
  port?: number
  install: boolean
  git: boolean
  yes: boolean
  sets: string[]
  help: boolean
}
export const initHelp = `Usage: purestack init [directory] [options]

Start the local PureStack wizard and open the URL printed in your terminal.
Configure your project, create it, and browse the live site in Studio.
Studio stays open until you finish. Options below preset its choices.

  -t, --template <source>  Official alias, npm package, local folder, or .tgz
      --title <title>      Site title and logo brand
      --set <id=value>     A template-defined option; repeat for more options
      --host <address>     Studio bind address (default: 127.0.0.1)
      --port <number>      Studio port (default: automatic; 0 selects a free port)
      --install            Install dependencies with the template's package manager
      --git                Initialize or reuse a Git repository
  -y, --yes                Skip Studio and create with these choices (scripts, CI)
  -h, --help               Show help

Examples:
  purestack init
  purestack init my-site --template starter --set palette=mint
  purestack init --host 127.0.0.1 --port 4700

Installation and Git initialization are opt-in. Relative paths use your current
folder. In this checkout, unversioned official aliases use local templates.`

export function parseInitArguments(args: string[], cwd: string): InitArguments {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't', default: 'starter' },
      title: { type: 'string' },
      host: { type: 'string' },
      port: { type: 'string' },
      set: { type: 'string', multiple: true, default: [] },
      install: { type: 'boolean', default: false },
      git: { type: 'boolean', default: false },
      yes: { type: 'boolean', short: 'y', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })
  if (positionals.length > 1)
    throw new Error('Expected a single project directory.')
  if (values.title !== undefined && !values.title.trim())
    throw new Error('Site title cannot be empty.')
  if (values.host !== undefined && !values.host.trim())
    throw new Error('Host cannot be empty.')
  let port: number | undefined
  if (values.port !== undefined) {
    port = Number(values.port)
    if (!/^\d+$/.test(values.port) || port > 65535)
      throw new Error('Port must be an integer between 0 and 65535.')
  }
  resolveTemplateSpec(values.template, cwd)
  return {
    directory: positionals[0],
    template: values.template,
    title: values.title,
    host: values.host?.trim(),
    port,
    sets: values.set,
    install: values.install,
    git: values.git,
    yes: values.yes,
    help: values.help,
  }
}

export function parseTemplateOverrides(ui: TemplateUi, inputs: string[]) {
  const result: Record<string, OptionValue> = {}
  const fields = templateFields(ui)
  for (const input of inputs) {
    const equals = input.indexOf('=')
    if (equals < 1) throw new Error('Use --set option-id=value.')
    const id = input.slice(0, equals)
    const field = fields.find((candidate) => candidate.id === id)
    if (!field) throw new Error(`Unknown template option: ${id}`)
    if (Object.hasOwn(result, id))
      throw new Error(`Template option was specified twice: ${id}`)
    const raw = input.slice(equals + 1)
    const parsed =
      field.type === 'toggle'
        ? raw === 'true'
          ? true
          : raw === 'false'
            ? false
            : raw
        : field.type === 'select'
          ? (field.choices?.find((choice) => String(choice.value) === raw)
              ?.value ?? raw)
          : raw
    const invalid = validateField(field, parsed)
    if (invalid) throw new Error(`${field.label}: ${invalid}`)
    result[id] = parsed
  }
  return result
}

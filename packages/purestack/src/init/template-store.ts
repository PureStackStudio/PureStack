import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fetchTemplate, inspectTemplate, unpackTemplate } from './template'
import { readTemplateUi, type TemplateUi } from './template-ui'

export interface LoadedTemplate {
  source: string
  root: string
  name: string
  version: string
  description: string
  ui: TemplateUi
}
export interface TemplateEnvironment {
  cwd: string
  packageRoot: string
  version: string
}
export interface TemplateSourceStore {
  load(source: string): Promise<LoadedTemplate>
  dispose(): Promise<void>
}
export const officialTemplates = [
  {
    id: 'starter',
    label: 'Starter',
    description:
      'A focused website with a home page, about page, and browser TypeScript.',
  },
]

export async function localTemplate(
  source: string,
  environment: TemplateEnvironment,
) {
  if (!officialTemplates.some((template) => template.id === source))
    return source
  const root = path.resolve(environment.packageRoot, '../..')
  try {
    const manifest = JSON.parse(
      await readFile(path.join(root, 'package.json'), 'utf8'),
    )
    if (
      manifest.name !== 'purestack-repo' ||
      path.join(root, 'packages/purestack') !== environment.packageRoot
    )
      return source
    const directory = path.join(root, 'templates', source)
    const template = JSON.parse(
      await readFile(path.join(directory, 'package.json'), 'utf8'),
    )
    return template.purestackTemplate === true ? directory : source
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return source
    throw error
  }
}

/** One staged copy per source. Browsing a template never writes a user project. */
export class TemplateStore implements TemplateSourceStore {
  private directory?: Promise<string>
  private readonly abort = new AbortController()
  private readonly entries = new Map<string, Promise<LoadedTemplate>>()
  constructor(private readonly environment: TemplateEnvironment) {}
  load(source: string): Promise<LoadedTemplate> {
    const existing = this.entries.get(source)
    if (existing) return existing
    const pending = this.fetch(source).catch((error) => {
      this.entries.delete(source)
      throw error
    })
    this.entries.set(source, pending)
    return pending
  }
  private async fetch(source: string): Promise<LoadedTemplate> {
    this.directory ??= mkdtemp(path.join(tmpdir(), 'purestack-studio-'))
    const stage = await mkdtemp(path.join(await this.directory, 'template-'))
    const resolved = await localTemplate(source, this.environment)
    const archive = await fetchTemplate(
      resolved,
      stage,
      this.environment.cwd,
      this.abort.signal,
    )
    const root = path.join(stage, 'unpacked')
    await unpackTemplate(archive, root)
    const { pkg, manifest } = await inspectTemplate(
      root,
      this.environment.version,
    )
    return {
      source,
      root,
      name: pkg.name as string,
      version: pkg.version as string,
      description: manifest.description as string,
      ui: await readTemplateUi(root),
    }
  }
  async dispose() {
    this.abort.abort()
    await Promise.allSettled(this.entries.values())
    if (this.directory)
      await rm(await this.directory, { recursive: true, force: true })
  }
}

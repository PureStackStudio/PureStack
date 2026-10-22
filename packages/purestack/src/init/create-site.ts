import { cp, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  type PackageManager,
  preparePackageManager,
  runPackageManager,
} from './package-manager'
import { runProcess } from './process'
import type { TaskRunner } from './tasks'
import {
  assertEmptyDestination,
  fetchTemplate,
  prepareProject,
  unpackTemplate,
  writeProject,
} from './template'
import {
  applyTemplateValues,
  type OptionValue,
  readTemplateUi,
} from './template-ui'

export interface CreateSitePlan {
  directory: string
  template: string
  title: string
  install: boolean
  git: boolean
  values: Record<string, OptionValue>
}
export interface CreateSiteResult {
  directory: string
  template: string
  version: string
  packageManager: PackageManager
  installed: boolean
  git: 'skipped' | 'existing' | 'created' | 'failed'
  failures: string[]
}
/** Filesystem/process service: no prompts, terminal detection, or rendering. */
export async function createSite(
  plan: CreateSitePlan,
  version: string,
  cwd: string,
  task: TaskRunner = (_label, action) => action(),
  options: { templateRoot?: string; signal?: AbortSignal } = {},
): Promise<CreateSiteResult> {
  const perform: TaskRunner = async (label, action) => {
    options.signal?.throwIfAborted()
    const result = await task(label, action)
    options.signal?.throwIfAborted()
    return result
  }
  const directory = path.resolve(cwd, plan.directory)
  await assertEmptyDestination(directory)
  const temporary = await mkdtemp(path.join(tmpdir(), 'purestack-init-'))
  let template: string
  let packageManager: PackageManager
  try {
    const unpacked = path.join(temporary, 'unpacked')
    const templateRoot = options.templateRoot
    if (templateRoot)
      await perform('Prepare selected template', () =>
        cp(templateRoot, unpacked, { recursive: true }),
      )
    else {
      const archive = await perform('Fetch template', () =>
        fetchTemplate(plan.template, temporary, cwd, options.signal),
      )
      await perform('Validate template archive', () =>
        unpackTemplate(archive, unpacked),
      )
    }
    const project = await perform(
      'Validate project and compatibility',
      async () => {
        return prepareProject(unpacked, directory, version, plan.title)
      },
    )
    await perform('Create project files', async () => {
      await applyTemplateValues(
        project.source,
        await readTemplateUi(unpacked),
        plan.values,
      )
      await writeProject(project.source, project.files, directory)
    })
    template = `${project.name}@${project.version}`
    packageManager = project.packageManager
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
  const result: CreateSiteResult = {
    directory,
    template,
    version,
    packageManager,
    installed: false,
    git: 'skipped',
    failures: [],
  }
  if (plan.install) {
    try {
      await preparePackageManager(
        packageManager,
        directory,
        perform,
        options.signal,
      )
      // The first install writes the lockfile, even where CI makes Yarn immutable.
      const install =
        packageManager === 'yarn' ? ['install', '--no-immutable'] : ['install']
      await perform('Install dependencies', () =>
        runPackageManager(packageManager, install, directory, {
          capture: true,
          signal: options.signal,
        }),
      )
      result.installed = true
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error
      result.failures.push(
        `Dependency installation failed: ${error instanceof Error ? error.message : String(error)}\nRetry ${packageManager} install in the project directory.`,
      )
    }
  }
  if (plan.git) {
    try {
      await perform('Set up Git', async () => {
        const git = (args: string[]) =>
          runProcess('git', args, directory, {
            capture: true,
            signal: options.signal,
          })
        const parent = await git(['rev-parse', '--show-toplevel']).catch(
          (error) => {
            if (error instanceof Error && error.name === 'AbortError')
              throw error
            return undefined
          },
        )
        if (parent) result.git = 'existing'
        else {
          await git(['init'])
          result.git = 'created'
        }
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error
      result.git = 'failed'
      result.failures.push(
        `Git initialization failed: ${error instanceof Error ? error.message : String(error)}\nRetry git init in the project directory.`,
      )
    }
  }
  return result
}

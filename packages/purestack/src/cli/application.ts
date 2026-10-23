import path from 'node:path'
import { PURESTACK_SKILL_PATH, updatePureStackSkill } from '../init/agent-skill'
import { type TemplateEnvironment, TemplateStore } from '../init/template-store'
import { resolveTemplateValues } from '../init/template-ui'
import {
  initHelp,
  parseInitArguments,
  parseTemplateOverrides,
} from './arguments'
import { createSiteWithProgress } from './creation'
import { runForge } from './forge/run'

const help = `PureStack

  purestack init                         Open PureStack Forge
  purestack serve --content <directory>  Preview with live reload
  purestack build --content <directory>  Build static files
  purestack publish --content <dir>      Prepare a local release artifact
  purestack skills update                Refresh this site's AI agent skill
  purestack --version                    Print the installed version

Use purestack init --help to explore creation options.`

export async function runApplication(
  args: string[],
  environment: TemplateEnvironment,
): Promise<number> {
  try {
    if (['--version', '-v'].includes(args[0])) {
      console.log(environment.version)
      return 0
    }
    if (!args.length || ['--help', '-h', 'help'].includes(args[0])) {
      console.log(args[0] === 'help' && args[1] === 'init' ? initHelp : help)
      return 0
    }
    if (args[0] === 'skills') {
      if (args[1] !== 'update' || args.length > 2)
        throw new Error('Usage: purestack skills update')
      const updated = await updatePureStackSkill(
        environment.cwd,
        environment.packageRoot,
        environment.version,
      )
      console.log(
        `${updated ? 'Updated' : 'Already up to date:'} ${PURESTACK_SKILL_PATH.replaceAll(path.sep, '/')} for PureStack ${environment.version}.`,
      )
      return 0
    }
    if (args[0] !== 'init') {
      if (!['serve', 'build', 'publish'].includes(args[0]))
        throw new Error(`Unknown command: ${args[0]}. Run purestack --help.`)
      const { runCli } = await import('@purestack/ts-ssg')
      await runCli(args)
      return 0
    }
    const input = parseInitArguments(args.slice(1), environment.cwd)
    if (input.help) {
      console.log(initHelp)
      return 0
    }
    if (!input.yes) return await runForge(environment, input)
    if (!input.directory)
      throw new Error(
        'A directory is required with --yes. Use purestack init my-site --yes.',
      )
    const store = new TemplateStore(environment)
    try {
      const template = await store.load(input.template)
      const values = resolveTemplateValues(
        template.ui,
        parseTemplateOverrides(template.ui, input.sets),
      )
      return await createSiteWithProgress(
        {
          plan: {
            directory: input.directory,
            template: input.template,
            title:
              input.title ??
              path.basename(path.resolve(environment.cwd, input.directory)),
            values,
            install: input.install,
            git: input.git,
          },
          templateRoot: template.root,
        },
        environment,
      )
    } finally {
      await store.dispose()
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    return error instanceof Error && error.name === 'AbortError' ? 130 : 1
  }
}

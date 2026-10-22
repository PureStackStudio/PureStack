import path from 'node:path'
import {
  type CreateSitePlan,
  type CreateSiteResult,
  createSite,
} from '../init/create-site'
import type { TaskRunner } from '../init/tasks'
import type { TemplateEnvironment } from '../init/template-store'
import { changeDirectoryCommand } from './terminal/commands'
import { type CreationOutput, CreationView } from './terminal/creation-view'
import { safeText } from './terminal/layout'

export interface SiteCreationRequest {
  plan: CreateSitePlan
  templateRoot: string
}

/** Direct creation with progress and copyable commands in terminal scrollback. */
export async function createSiteWithProgress(
  request: SiteCreationRequest,
  environment: TemplateEnvironment,
  output: CreationOutput = process.stdout,
) {
  const abort = new AbortController()
  const interrupt = () => abort.abort()
  process.on('SIGINT', interrupt)
  process.on('SIGTERM', interrupt)
  try {
    const view = new CreationView(output)
    output.write(
      view.start(
        request.plan.title,
        path.resolve(environment.cwd, request.plan.directory),
        environment.version,
      ),
    )
    const result = await createSite(
      request.plan,
      environment.version,
      environment.cwd,
      progressTasks(output),
      { templateRoot: request.templateRoot, signal: abort.signal },
    )
    output.write(view.complete(result, nextCommands(result, environment.cwd)))
    return result.failures.length ? 1 : 0
  } catch (error) {
    if (abort.signal.aborted) {
      const cancelled = new Error(
        'Cancelled. Any project files already written have been preserved.',
      )
      cancelled.name = 'AbortError'
      throw cancelled
    }
    throw error
  } finally {
    process.removeListener('SIGINT', interrupt)
    process.removeListener('SIGTERM', interrupt)
  }
}

export function progressTasks(output: CreationOutput): TaskRunner {
  const view = new CreationView(output)
  return async (label, action) => {
    const frames = ['◜', '◠', '◝', '◞', '◡', '◟']
    let frame = 0
    const interactive = output.isTTY && process.env.TERM !== 'dumb'
    const ansiEscape = String.fromCharCode(27)
    const redraw = () => {
      output.write(
        `\r${ansiEscape}[2K${view.progress(label, frames[frame++ % frames.length], 'accent')}`,
      )
    }
    if (interactive) redraw()
    else output.write(`  → ${safeText(label)}\n`)
    const timer = interactive ? setInterval(redraw, 90) : undefined
    const finish = (symbol: string) => {
      if (timer) clearInterval(timer)
      output.write(
        interactive
          ? `\r${ansiEscape}[2K${view.progress(label, symbol, symbol === '✓' ? 'success' : 'error')}\n`
          : `  ${symbol} ${safeText(label)}\n`,
      )
    }
    try {
      const result = await action()
      finish('✓')
      return result
    } catch (error) {
      finish('✗')
      throw error
    }
  }
}

export function nextCommands(result: CreateSiteResult, cwd: string): string[] {
  const relative = path.relative(cwd, result.directory) || '.'
  const directory = relative.replaceAll(path.sep, '/')
  return [
    changeDirectoryCommand(
      directory,
      process.platform === 'win32' ? 'windows' : 'posix',
    ),
    ...(!result.installed ? [`${result.packageManager} install`] : []),
    ...(result.git === 'failed' ? ['git init'] : []),
    result.packageManager === 'yarn' ? 'yarn dev' : 'npm run dev',
  ]
}

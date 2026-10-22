import path from 'node:path'

/** Package scripts run at the package root; INIT_CWD retains the caller's folder. */
export function invocationDirectory(cwd: string, env: NodeJS.ProcessEnv) {
  return env.npm_lifecycle_event === 'purestack' &&
    env.INIT_CWD &&
    path.isAbsolute(env.INIT_CWD)
    ? path.resolve(env.INIT_CWD)
    : cwd
}

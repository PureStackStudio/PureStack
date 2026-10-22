import { fork } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface SitePreview {
  url: string
  close(): Promise<void>
}

/** Use the same CLI in a separate process: site theme/build registries stay isolated. */
export function startSitePreview(
  directory: string,
  outDir: string,
  packageRoot: string,
  signal: AbortSignal,
  stopped: () => void,
): Promise<SitePreview> {
  signal.throwIfAborted()
  const moduleFile = fileURLToPath(import.meta.url)
  const cli = moduleFile.endsWith('.ts')
    ? path.join(packageRoot, 'src/cli.ts')
    : moduleFile
  const environment = { ...process.env }
  delete environment.INIT_CWD
  delete environment.npm_lifecycle_event
  const child = fork(cli, ['__studio-preview', directory, outDir], {
    cwd: directory,
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  })
  let diagnostics = ''
  let closing = false
  let ready = false
  const exited = Promise.withResolvers<void>()
  const capture = (chunk: Buffer) => {
    diagnostics = (diagnostics + chunk.toString()).slice(-8000)
  }
  child.stdout?.on('data', capture)
  child.stderr?.on('data', capture)
  const close = async () => {
    if (closing) return exited.promise
    closing = true
    if (child.connected) child.send({ type: 'stop' }, () => {})
    const timer = setTimeout(() => child.kill(), 2000)
    timer.unref()
    await exited.promise
    clearTimeout(timer)
  }
  const abort = () => {
    void close()
  }
  signal.addEventListener('abort', abort, { once: true })
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          'Live site startup timed out. Check its configuration and dependencies.',
        ),
      )
      void close()
    }, 45000)
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
      exited.resolve()
    })
    child.once('exit', (code) => {
      clearTimeout(timer)
      signal.removeEventListener('abort', abort)
      exited.resolve()
      if (!ready)
        reject(
          new Error(`Could not start the live site (${code}). ${diagnostics}`),
        )
      else if (!closing) stopped()
    })
    child.on('message', (message) => {
      if (
        !message ||
        typeof message !== 'object' ||
        !('type' in message) ||
        message.type !== 'ready' ||
        !('url' in message) ||
        typeof message.url !== 'string' ||
        ready
      )
        return
      clearTimeout(timer)
      ready = true
      if (signal.aborted) {
        void close()
        reject(signal.reason)
        return
      }
      resolve({ url: message.url, close })
    })
  })
}

import { type DevServerHandle, startDevServer } from '@purestack/ts-ssg'
import { readPreviewConfig } from './preview-config'

/** Private IPC worker, launched only by Studio through this package's own CLI. */
export async function runPreviewProcess(directory: string, outDir: string) {
  let server: DevServerHandle | undefined
  const done = Promise.withResolvers<void>()
  const stop = () => done.resolve()
  const message = (input: unknown) => {
    if (
      input &&
      typeof input === 'object' &&
      'type' in input &&
      input.type === 'stop'
    )
      stop()
  }
  process.on('message', message)
  process.once('disconnect', stop)
  process.once('SIGTERM', stop)
  process.once('SIGINT', stop)
  try {
    server = await startDevServer(await readPreviewConfig(directory, outDir))
    const response = await fetch(server.url, {
      signal: AbortSignal.timeout(30000),
    })
    await response.text()
    if (!response.ok) throw new Error(`Site returned HTTP ${response.status}.`)
    if (process.connected) process.send?.({ type: 'ready', url: server.url })
    else stop()
    await done.promise
  } finally {
    process.off('message', message)
    process.off('disconnect', stop)
    process.off('SIGTERM', stop)
    process.off('SIGINT', stop)
    await server?.close()
    if (process.connected) process.disconnect?.()
  }
}

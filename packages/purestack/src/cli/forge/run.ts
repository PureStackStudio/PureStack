import { randomBytes, timingSafeEqual } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { type DevServerHandle, startDevServer } from '@purestack/ts-ssg'
import { FORGE_SOCKET_PATH } from '../../../forge/modules/shared/protocol'
import {
  type TemplateEnvironment,
  TemplateStore,
} from '../../init/template-store'
import type { InitArguments } from '../arguments'
import { CreationView } from '../terminal/creation-view'
import { startSitePreview } from './preview'
import { Session } from './session'

/** Serve ordinary Forge content through PureStack's existing server. */
export async function runForge(
  environment: TemplateEnvironment,
  input: InitArguments,
) {
  const temporary = await mkdtemp(path.join(tmpdir(), 'purestack-forge-'))
  let server: DevServerHandle | undefined
  const done = Promise.withResolvers<number>()
  const interrupt = () => {
    done.resolve(130)
    void session.dispose()
  }
  const token = randomBytes(32).toString('hex')
  let origin = ''
  let previewNumber = 0
  const session = new Session(environment, {
    store: new TemplateStore(environment),
    output: process.stdout,
    finish: () => done.resolve(0),
    preview: (directory, signal, stopped) =>
      startSitePreview(
        directory,
        path.join(temporary, `preview-${++previewNumber}`),
        environment.packageRoot,
        signal,
        stopped,
      ),
  })
  process.on('SIGINT', interrupt)
  process.on('SIGTERM', interrupt)
  try {
    await session.initialize(input)
    server = await startDevServer({
      host: input.host ?? '127.0.0.1',
      port: input.port ?? 0,
      logLevel: 'WARN',
      watch: false,
      liveReload: false,
      fullRender: true,
      handleSignals: false,
      failOnInitialBuildError: true,
      webSockets: [
        {
          path: FORGE_SOCKET_PATH,
          authorize: (request) => {
            const wildcard = input.host === '0.0.0.0' || input.host === '::'
            const expectedOrigin = wildcard
              ? `http://${request.headers.host}`
              : origin
            const supplied =
              new URL(request.url ?? '/', 'http://localhost').searchParams.get(
                'token',
              ) ?? ''
            return Boolean(
              origin &&
                request.headers.origin === expectedOrigin &&
                (wildcard || request.headers.host === new URL(origin).host) &&
                /^[a-f0-9]{64}$/.test(supplied) &&
                timingSafeEqual(Buffer.from(supplied), Buffer.from(token)),
            )
          },
          connect: (peer) => session.connect(peer),
        },
      ],
      configFile: path.join(
        environment.packageRoot,
        'forge/modules/purestack.config.ts',
      ),
      build: {
        siteConfig: {
          rootDir: environment.packageRoot,
          contentDir: path.join(environment.packageRoot, 'forge'),
          outDir: path.join(temporary, 'site'),
        },
        options: { cache: false },
      },
    })
    origin = new URL(server.url).origin
    if (process.stdout.isTTY)
      process.stdout.write(
        `${String.fromCharCode(27)}]0;PURESTACK FORGE${String.fromCharCode(7)}`,
      )
    process.stdout.write(
      new CreationView(process.stdout).openForge(
        `${server.url}#token=${token}`,
        environment.cwd,
      ),
    )
    return await done.promise
  } finally {
    process.removeListener('SIGINT', interrupt)
    process.removeListener('SIGTERM', interrupt)
    await session.dispose()
    await server?.close()
    await rm(temporary, { recursive: true, force: true })
  }
}

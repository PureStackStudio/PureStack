import os from 'node:os'
import path from 'node:path'
import type { SiteConfig, SiteConfigInput } from '@purestack/ts-common'
import { resolveSelectedSiteConfig } from '../config/config'
import type { PureStackPlugin } from '../plugins/plugin'
import type { BuildInput } from './site'

export interface PublishOptions {
  enabled?: boolean
}

export function resolveBuildSiteConfig(
  input: BuildInput,
  plugins: readonly PureStackPlugin[],
  file?: SiteConfigInput,
): SiteConfig {
  const resolved = resolveSelectedSiteConfig(
    input.siteConfig ?? {},
    plugins,
    file,
  )
  const config: SiteConfig = {
    ...resolved,
    outDir: resolveNamedOutDir(resolved.outDir, input),
    cache: input.options?.cache !== false,
  }
  assertSafeOutputs(config)
  if (input.publish?.enabled !== true) return config
  return {
    ...config,
    outDir: config.publishDir,
    html: {
      ...config.html,
      minify: true,
    },
    ...(config.style
      ? {
          style: {
            ...config.style,
            pretty: false,
          },
        }
      : {}),
  }
}

/** A named output is a sibling of `outDir`, so it can never land elsewhere. */
function resolveNamedOutDir(outDir: string, input: BuildInput) {
  const name = input.options?.outName
  if (name === undefined) return outDir
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    throw new Error(
      `Output name "${name}" must start with a lowercase letter or digit and contain only lowercase letters, digits, and hyphens.`,
    )
  }
  if (input.publish?.enabled === true) {
    throw new Error(
      'An output name applies to outDir; publish always writes to publishDir.',
    )
  }
  return path.join(path.dirname(outDir), `${path.basename(outDir)}-${name}`)
}

/** Neither output may hold the site's sources or a directory the user works in. */
function assertSafeOutputs(config: SiteConfig) {
  const outputs = { outDir: config.outDir, publishDir: config.publishDir }
  for (const [name, output] of Object.entries(outputs)) {
    const absolute = path.resolve(output)
    const protectedDirectories = {
      'the filesystem root': path.parse(absolute).root,
      'the content directory': config.contentDir,
      'the project root': config.rootDir,
      'the working directory': process.cwd(),
      'the home directory': os.homedir(),
    }
    for (const [label, directory] of Object.entries(protectedDirectories)) {
      if (isWithin(absolute, directory)) {
        throw new Error(
          `${name} "${absolute}" must not be or contain ${label} "${path.resolve(directory)}". --clean and publish empty the output directory, so this check protects your files from accidental deletion.`,
        )
      }
    }
  }
  // Each output is locked separately, so cleaning one must not reach into the
  // other. Exactly one enclosing the other means nesting; both means the same.
  if (
    isWithin(config.outDir, config.publishDir) !==
    isWithin(config.publishDir, config.outDir)
  ) {
    throw new Error(
      'outDir and publishDir must be the same directory or separate directories; neither may contain the other.',
    )
  }
}

/** Whether `child` is `parent` or lies inside it. */
function isWithin(parent: string, child: string) {
  const relative = path.relative(parent, child)
  return (
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  )
}

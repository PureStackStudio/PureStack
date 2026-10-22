import { constants } from 'node:fs'
import {
  cp,
  lstat,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { t, x } from 'tar'
import type { PackageManager } from './package-manager'
import { runNpm } from './process'
import { isCompatibleVersion, parseVersion } from './version'

export const OFFICIAL_TEMPLATES = {
  starter: '@purestack/template-starter',
} as const

export async function assertEmptyDestination(directory: string) {
  const info = await lstat(directory).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined
    throw error
  })
  if (
    info &&
    (!info.isDirectory() ||
      info.isSymbolicLink() ||
      (await readdir(directory)).length)
  ) {
    throw new Error(`Destination must be an empty directory: ${directory}`)
  }
}

export function resolveTemplateSpec(spec: string, cwd: string) {
  const [alias, ...version] = spec.split('@')
  if (Object.hasOwn(OFFICIAL_TEMPLATES, alias)) {
    return `${OFFICIAL_TEMPLATES[alias as keyof typeof OFFICIAL_TEMPLATES]}${version.length ? `@${version.join('@')}` : '@latest'}`
  }
  if (
    path.isAbsolute(spec) ||
    spec.startsWith('./') ||
    spec.startsWith('../') ||
    spec.startsWith('.\\') ||
    spec.startsWith('..\\')
  ) {
    return path.resolve(cwd, spec)
  }
  // Deliberately accept registry packages and local paths, not executable Git sources.
  if (
    !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*(?:@[^\s/@]+)?$/.test(
      spec,
    )
  ) {
    throw new Error(
      'Template must be an npm package, an official alias, or an explicit local path.',
    )
  }
  return spec
}

export async function fetchTemplate(
  spec: string,
  temporary: string,
  cwd: string,
  signal?: AbortSignal,
) {
  const resolved = resolveTemplateSpec(spec, cwd)
  if (path.isAbsolute(resolved) && resolved.endsWith('.tgz')) {
    const archive = path.join(temporary, 'template.tgz')
    await cp(resolved, archive, { errorOnExist: true, force: false })
    return archive
  }
  const result: unknown = JSON.parse(
    await runNpm(
      [
        'pack',
        resolved,
        '--ignore-scripts',
        '--json',
        '--pack-destination',
        temporary,
      ],
      cwd,
      { capture: true, signal },
    ),
  )
  if (
    !Array.isArray(result) ||
    result.length !== 1 ||
    typeof result[0]?.filename !== 'string'
  ) {
    throw new Error('npm did not return a template archive.')
  }
  const archive = path.resolve(temporary, result[0].filename)
  if (path.dirname(archive) !== temporary || !archive.endsWith('.tgz')) {
    throw new Error('npm returned an invalid template archive path.')
  }
  return archive
}

function safeArchivePath(name: string) {
  const parts = name.replace(/\/$/, '').split('/')
  if (
    parts[0] !== 'package' ||
    parts.some(
      (part) =>
        !part ||
        part === '.' ||
        part === '..' ||
        /[\\:<>"|?*]/.test(part) ||
        [...part].some((character) => character.charCodeAt(0) < 32) ||
        /[. ]$/.test(part) ||
        /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
    )
  ) {
    throw new Error(`Unsafe template archive path: ${name}`)
  }
}

export async function unpackTemplate(archive: string, directory: string) {
  const seen = new Set<string>()
  let totalSize = 0
  let invalid: Error | undefined
  await t({
    file: archive,
    strict: true,
    onReadEntry(entry) {
      try {
        safeArchivePath(entry.path)
        if (entry.type !== 'File' && entry.type !== 'Directory') {
          throw new Error(
            `Template archives cannot contain ${entry.type}: ${entry.path}`,
          )
        }
        const key = entry.path.replace(/\/$/, '').toLowerCase()
        if (seen.has(key))
          throw new Error(`Duplicate template archive path: ${entry.path}`)
        seen.add(key)
        totalSize += entry.size
        if (seen.size > 10000 || totalSize > 100 * 1024 * 1024)
          throw new Error('Template exceeds the 100 MB / 10,000 entry limit.')
      } catch (error) {
        invalid ??= error as Error
      }
    },
  })
  if (invalid) throw invalid
  await mkdir(directory)
  await x({
    file: archive,
    cwd: directory,
    strip: 1,
    strict: true,
    noChmod: true,
  })
}

async function readJson(file: string): Promise<Record<string, unknown>> {
  const value: unknown = JSON.parse(await readFile(file, 'utf8'))
  if (!isRecord(value)) throw new Error(`Expected a JSON object: ${file}`)
  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

async function writeJson(file: string, value: Record<string, unknown>) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`)
}

async function listProjectFiles(
  directory: string,
  prefix = '',
): Promise<string[]> {
  const result: string[] = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.npmrc'].includes(entry.name.toLowerCase()))
      throw new Error(
        `Template contains forbidden project entry: ${entry.name}`,
      )
    const relative = path.join(prefix, entry.name)
    if (entry.isDirectory())
      result.push(
        ...(await listProjectFiles(path.join(directory, entry.name), relative)),
      )
    else if (entry.isFile()) result.push(relative)
    else throw new Error(`Template contains a non-regular file: ${relative}`)
  }
  return result
}

export function projectName(directory: string) {
  const name = path
    .basename(directory)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '')
  if (
    !name ||
    name.length > 214 ||
    ['node_modules', 'favicon.ico'].includes(name)
  )
    throw new Error(
      'Choose a directory name that can be used as an npm project name.',
    )
  return name
}

export async function inspectTemplate(
  unpacked: string,
  purestackVersion: string,
) {
  const pkg = await readJson(path.join(unpacked, 'package.json'))
  if (
    pkg.purestackTemplate !== true ||
    typeof pkg.name !== 'string' ||
    typeof pkg.version !== 'string' ||
    !parseVersion(pkg.version)
  ) {
    throw new Error('Not a versioned PureStack template package.')
  }
  const manifest = await readJson(path.join(unpacked, 'template.json'))
  if (
    manifest.formatVersion !== 1 ||
    typeof manifest.description !== 'string' ||
    typeof manifest.purestack !== 'string' ||
    !parseVersion(manifest.purestack)
  ) {
    throw new Error(
      'Invalid or unsupported PureStack template manifest (expected formatVersion: 1 and a plain major.minor.patch purestack minimum version).',
    )
  }
  if (!isCompatibleVersion(purestackVersion, manifest.purestack)) {
    throw new Error(
      `${pkg.name}@${pkg.version} requires PureStack ${manifest.purestack} or newer within the same major version; this CLI is ${purestackVersion}. Use a compatible CLI or template version.`,
    )
  }
  return { pkg, manifest }
}

/** Registry selectors only; npm/Yarn validate their version, range, or tag syntax. */
function isRegistryDependency(version: string) {
  const alias =
    /^npm:(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*(?:@(.+))?$/.exec(
      version,
    )
  const selector = (
    alias?.[0] === version ? (alias[1] ?? 'latest') : version
  ).trim()
  return (
    /^[\w.*+^~<>=| -]+$/.test(selector) &&
    !['.', '..'].includes(selector) &&
    !/\.(?:tgz|tar\.gz)$/i.test(selector)
  )
}

export async function prepareProject(
  unpacked: string,
  directory: string,
  purestackVersion: string,
  title = path.basename(directory),
) {
  const { pkg } = await inspectTemplate(unpacked, purestackVersion)
  const source = path.join(unpacked, 'template')
  const files = await listProjectFiles(source)
  for (const file of [
    'package.json',
    'AGENTS.md',
    'README.md',
    path.join('content', 'siteConfig.json'),
    path.join('content', 'index.mdx'),
  ]) {
    if (!files.includes(file)) throw new Error(`Template is missing ${file}.`)
  }
  const project = await readJson(path.join(source, 'package.json'))
  let packageManager: PackageManager = 'npm'
  if (project.packageManager !== undefined) {
    if (typeof project.packageManager !== 'string')
      throw new Error('Project packageManager must pin a Yarn or npm version.')
    const match = /^(yarn|npm)@(.+)$/.exec(project.packageManager)
    if (
      !match ||
      match[0] !== project.packageManager ||
      !parseVersion(match[2])
    )
      throw new Error('Project packageManager must pin a Yarn or npm version.')
    if (match[1] === 'yarn') packageManager = 'yarn'
  }
  const dependencies = project.dependencies
  if (
    !isRecord(dependencies) ||
    dependencies.purestack !== '{{purestackVersion}}'
  )
    throw new Error(
      'Template must declare dependencies.purestack as {{purestackVersion}}.',
    )
  for (const field of [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
  ]) {
    const entries = project[field]
    if (entries === undefined) continue
    if (!isRecord(entries)) throw new Error(`Invalid project ${field}.`)
    for (const [dependency, version] of Object.entries(entries)) {
      if (
        typeof version !== 'string' ||
        (!isRegistryDependency(version) &&
          !(
            (dependency === 'purestack' ||
              dependency.startsWith('@purestack/')) &&
            version === '{{purestackVersion}}'
          ))
      )
        throw new Error(
          `Project ${field} must use published dependency versions.`,
        )
      if (version === '{{purestackVersion}}')
        entries[dependency] = purestackVersion
    }
  }
  const scripts = project.scripts
  if (
    !isRecord(scripts) ||
    ['dev', 'build', 'publish'].some(
      (script) => typeof scripts[script] !== 'string',
    )
  ) {
    throw new Error('Template must provide dev, build, and publish scripts.')
  }
  for (const hook of [
    'preinstall',
    'install',
    'postinstall',
    'prepare',
    'prepublish',
    'preprepare',
    'postprepare',
  ]) {
    if (Object.hasOwn(scripts, hook))
      throw new Error(`Template must not provide an installation hook: ${hook}`)
  }
  project.name = projectName(directory)
  project.private = true
  dependencies.purestack = purestackVersion
  await writeJson(path.join(source, 'package.json'), project)
  const configFile = path.join(source, 'content', 'siteConfig.json')
  const config = await readJson(configFile)
  config.siteTitle = title
  if (isRecord(config.logo)) config.logo.brand = title
  await writeJson(configFile, config)
  // A lockfile marks an independent Yarn project, even inside another workspace.
  if (packageManager === 'yarn' && !files.includes('yarn.lock')) {
    await writeFile(path.join(source, 'yarn.lock'), '', { flag: 'wx' })
    files.push('yarn.lock')
  }
  return {
    source,
    files,
    name: pkg.name,
    version: pkg.version,
    packageManager,
  }
}

export async function writeProject(
  source: string,
  files: string[],
  directory: string,
) {
  await assertEmptyDestination(directory)
  await mkdir(directory, { recursive: true })
  for (const file of files) {
    const destination = path.join(directory, file)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(path.join(source, file), destination, {
      errorOnExist: true,
      force: false,
      mode: constants.COPYFILE_EXCL,
    })
  }
}

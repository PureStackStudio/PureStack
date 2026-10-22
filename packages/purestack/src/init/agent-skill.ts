import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { repositoryCheckout } from './checkout'

/**
 * The skill's place in the PureStack repository, in the published package
 * (copied there while packing), and in every generated site.
 */
export const PURESTACK_SKILL_PATH = path.join(
  'skills',
  'purestack-development',
  'SKILL.md',
)

/** The skill, marked as managed so local edits are not expected to last. */
export async function readPureStackSkill(packageRoot: string, version: string) {
  // The repository's own skill is the source; packages carry a packed copy.
  const source = (await repositoryCheckout(packageRoot)) ?? packageRoot
  const skill = await readFile(path.join(source, PURESTACK_SKILL_PATH), 'utf8')
  // Agents read the frontmatter first, so the notice follows it.
  const frontmatter = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(skill)
  if (!frontmatter)
    throw new Error(
      `${PURESTACK_SKILL_PATH.replaceAll(path.sep, '/')} must start with frontmatter.`,
    )
  const notice = `\n<!-- Managed by PureStack ${version}. Run \`purestack skills update\` after upgrading PureStack; local edits are replaced. -->\n`
  return `${frontmatter[0]}${notice}${skill.slice(frontmatter[0].length)}`
}

/** Refreshes an existing site's copy from the installed PureStack package. */
export async function updatePureStackSkill(
  projectRoot: string,
  packageRoot: string,
  version: string,
) {
  const manifest: unknown = JSON.parse(
    await readFile(path.join(projectRoot, 'package.json'), 'utf8').catch(
      () => '{}',
    ),
  )
  const dependencies = isRecord(manifest)
    ? [manifest.dependencies, manifest.devDependencies].flatMap((entries) =>
        isRecord(entries) ? Object.keys(entries) : [],
      )
    : []
  if (!dependencies.includes('purestack'))
    throw new Error(
      'Run purestack skills update in the root folder of a PureStack site.',
    )
  const target = path.join(projectRoot, PURESTACK_SKILL_PATH)
  const skill = await readPureStackSkill(packageRoot, version)
  const current = await readFile(target, 'utf8').catch(() => undefined)
  if (current === skill) return false
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, skill)
  return true
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

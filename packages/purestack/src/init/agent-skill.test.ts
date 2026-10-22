import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  PURESTACK_SKILL_PATH,
  readPureStackSkill,
  updatePureStackSkill,
} from './agent-skill'

const packageRoot = path.resolve(import.meta.dirname, '../..')
let temporary: string

beforeEach(async () => {
  temporary = await mkdtemp(path.join(tmpdir(), 'purestack-skill-test-'))
})
afterEach(async () => {
  await rm(temporary, { recursive: true, force: true })
})

async function site(dependencies: Record<string, string> = { purestack: '1' }) {
  await writeFile(
    path.join(temporary, 'package.json'),
    JSON.stringify({ name: 'site', dependencies }),
  )
  return path.join(temporary, PURESTACK_SKILL_PATH)
}

describe('PureStack agent skill', () => {
  it('marks the shipped skill as managed without breaking its frontmatter', async () => {
    const skill = await readPureStackSkill(packageRoot, '9.8.7')
    const [frontmatter, rest] = skill.split(/(?<=\n---\n)/, 2)
    expect(frontmatter).toMatch(/^---\nname: purestack-development\n/)
    expect(rest).toMatch(
      /^\n<!-- Managed by PureStack 9\.8\.7\. Run `purestack skills update`/,
    )
  })

  it('rejects a shipped skill without frontmatter', async () => {
    const file = path.join(temporary, PURESTACK_SKILL_PATH)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, '# No frontmatter\n')
    await expect(readPureStackSkill(temporary, '1.0.0')).rejects.toThrow(
      'skills/purestack-development/SKILL.md must start with frontmatter.',
    )
  })

  it('replaces a stale or edited copy and reports when nothing changed', async () => {
    const target = await site()
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, 'locally edited')

    expect(await updatePureStackSkill(temporary, packageRoot, '2.0.0')).toBe(
      true,
    )
    expect(await readFile(target, 'utf8')).toBe(
      await readPureStackSkill(packageRoot, '2.0.0'),
    )
    expect(await updatePureStackSkill(temporary, packageRoot, '2.0.0')).toBe(
      false,
    )
  })

  it('also recognizes PureStack as a development dependency', async () => {
    await writeFile(
      path.join(temporary, 'package.json'),
      JSON.stringify({ devDependencies: { purestack: '1' } }),
    )
    expect(await updatePureStackSkill(temporary, packageRoot, '2.0.0')).toBe(
      true,
    )
  })

  it.each([
    ['without a package.json', undefined],
    ['without a PureStack dependency', { regor: '1' }],
  ])('refuses folders %s', async (_case, dependencies) => {
    if (dependencies) await site(dependencies)
    await expect(
      updatePureStackSkill(temporary, packageRoot, '2.0.0'),
    ).rejects.toThrow(
      'Run purestack skills update in the root folder of a PureStack site.',
    )
  })
})

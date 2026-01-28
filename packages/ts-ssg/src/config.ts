import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  siteTitle: string
}

export type PartialConfig = Partial<SiteConfig>

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

export function resolveConfig(input: PartialConfig = {}): SiteConfig {
  const rootDir = input.rootDir ?? DEFAULT_ROOT
  const contentDir = input.contentDir ?? path.join(rootDir, 'sample-content')
  const outDir = input.outDir ?? path.join(rootDir, 'dist', 'site')
  const siteTitle = input.siteTitle ?? 'ts-ssg'
  return { rootDir, contentDir, outDir, siteTitle }
}

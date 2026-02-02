import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  siteTitle: string
  styleFileName: string
  styleHref: string
}

export type PartialSiteConfig = Partial<SiteConfig>

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)

export function resolveSiteConfig(input: PartialSiteConfig = {}): SiteConfig {
  const rootDir = input.rootDir ?? DEFAULT_ROOT
  const contentDir = input.contentDir ?? path.join(rootDir, 'sample-content')
  const outDir = input.outDir ?? path.join(rootDir, 'dist', 'site')
  const siteTitle = input.siteTitle ?? 'ts-ssg'
  const styleFileName = input.styleFileName ?? 'site.css'
  const styleHref = input.styleHref ?? `/${styleFileName}`
  return { rootDir, contentDir, outDir, siteTitle, styleFileName, styleHref }
}

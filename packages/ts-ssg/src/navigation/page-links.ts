import type {
  NavItem,
  PageNavigationLink,
  PageNavigationLinks,
} from '@purestack/ts-common'
import { urlNormalizer } from '@purestack/ts-util'
import { resolveRouteInfo } from '../routing/route'
import type { NavFile, NavigationContentFile, NavigationTree } from './model'

export function buildPageLinksByFolder(
  customByFolder: Record<string, NavFile>,
) {
  const pageLinksByFolder: Record<string, boolean> = {}
  for (const [folder, navFile] of Object.entries(customByFolder)) {
    if (navFile.pageLinks) pageLinksByFolder[folder] = true
  }
  return pageLinksByFolder
}

export function resolvePageLinks(
  tree: NavigationTree,
  folder: string,
  items: NavItem[],
  file: NavigationContentFile,
): PageNavigationLinks | undefined {
  if (!isPageLinksEnabled(tree, folder)) return undefined
  const currentUrl = normalizePageLinkUrl(resolveRouteInfo(file).urlPath)
  if (!currentUrl) return undefined

  const links = flattenPageLinks(items)
  const index = links.findIndex((link) => link.url === currentUrl)
  if (index < 0) return undefined

  const previous = links[index - 1]
  const next = links[index + 1]
  if (!previous && !next) return undefined
  return {
    ...(previous ? { previous } : {}),
    ...(next ? { next } : {}),
  }
}

function isPageLinksEnabled(tree: NavigationTree, folder: string) {
  let current = folder
  while (true) {
    if (tree.pageLinksByFolder[current]) return true
    if (!current) return false
    current = resolveParentFolderKey(current)
  }
}

function flattenPageLinks(items: NavItem[]) {
  const links: PageNavigationLink[] = []
  const seen = new Set<string>()
  const visit = (item: NavItem) => {
    const url = normalizePageLinkUrl(item.url)
    if (url && !seen.has(url)) {
      links.push({ title: item.title, url })
      seen.add(url)
    }
    for (const child of item.children ?? []) {
      visit(child)
    }
  }
  for (const item of items) {
    visit(item)
  }
  return links
}

function normalizePageLinkUrl(url: string | undefined) {
  const normalized = urlNormalizer.normalizeInternalPath(url)
  if (!normalized || urlNormalizer.hasPathExtension(normalized))
    return undefined
  return normalized
}

function resolveParentFolderKey(folder: string) {
  const slashIndex = folder.lastIndexOf('/')
  if (slashIndex < 0) return ''
  return folder.slice(0, slashIndex)
}

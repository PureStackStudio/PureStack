import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { withBasePath } from '@purestack/ts-util'
import { definePlugin } from 'purestack'

export function pageIndex() {
  const pages = new Map<string, string>()

  return definePlugin({
    name: 'page-index',
    hooks: {
      onConfigResolved() {
        pages.clear()
      },
      onPageRendered(_context, page) {
        if (page.frontmatter.index === false) return
        pages.set(page.urlPath, page.frontmatter.title ?? page.urlPath)
      },
      async onBuildComplete({ config }) {
        const entries = [...pages]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([urlPath, title]) => ({
            title,
            url: withBasePath(config.basePath, urlPath),
          }))

        await writeFile(
          path.join(config.outDir, 'page-index.json'),
          `${JSON.stringify(entries, null, 2)}\n`,
          'utf8',
        )
      },
    },
  })
}

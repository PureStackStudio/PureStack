import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

/** Create editable starters without overwriting the site's private legal text. */
export async function ensureLegalContent(contentDir: string) {
  const directory = path.join(contentDir, 'legal', '_private')
  await fs.mkdir(directory, { recursive: true })
  for (const fileName of ['imprint.mdx', 'privacy.mdx']) {
    const filePath = path.join(directory, fileName)
    if (existsSync(filePath)) continue
    const title = fileName === 'imprint.mdx' ? 'Imprint' : 'Privacy Policy'
    const content = `<article class="container doc-content py-6">
  <header class="mb-6"><h1 class="m-0">${title}</h1></header>
  <p><strong>Content required.</strong> Add your own ${title} before publishing.</p>
  <p>Edit <code>legal/_private/${fileName}</code> in the site's content folder. This file is ignored by Git.</p>
</article>
`
    try {
      await fs.writeFile(filePath, content, {
        encoding: 'utf8',
        flag: 'wx', // Create only if missing; never overwrite an existing file.
      })
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    }
  }
}

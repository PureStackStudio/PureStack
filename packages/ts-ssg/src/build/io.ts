import fs from 'node:fs/promises'
import { htmlMinifier } from '@node-minify/html-minifier'
import { ensureDir } from '@purestack/ts-util-node'

export async function readSource(absPath: string) {
  return fs.readFile(absPath, 'utf-8')
}

export interface WriteHtmlOptions {
  outPath: string
  html: string
  minify: boolean
}

export async function writeHtml(options: WriteHtmlOptions) {
  const { outPath, html } = options
  const output = options.minify ? await minifyHtml(html) : html
  await ensureDir(outPath)
  await fs.writeFile(outPath, output, 'utf-8')
}

export async function prepareOutDir(
  outDir: string,
  options: { clean?: boolean } = {},
) {
  if (options.clean) {
    await fs.rm(outDir, { recursive: true, force: true })
  }
  await fs.mkdir(outDir, { recursive: true })
}

async function minifyHtml(input: string): Promise<string> {
  const result = await htmlMinifier({
    content: input,
    settings: {
      compressor: async () => ({ code: '' }),
      options: {
        collapseInlineTagWhitespace: false,
        removeOptionalTags: false,
        conservativeCollapse: true,
      },
    },
  })
  return result.code
}

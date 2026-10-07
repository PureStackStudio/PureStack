import fs from 'node:fs/promises'
import { ensureDir } from '@purestack/ts-util-node'
import { minify } from 'html-minifier-next'

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
  return minify(input, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  })
}

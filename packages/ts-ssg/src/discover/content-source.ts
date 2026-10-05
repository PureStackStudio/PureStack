import fs from 'node:fs/promises'
import type { ContentFile } from './content'

/** A page's source: its generated source, or the text of its file. */
export async function readContentSource(file: ContentFile): Promise<string> {
  if (typeof file.source === 'function') return file.source()
  return file.source ?? fs.readFile(file.absPath, 'utf8')
}

import type { ThemeStylesheetLink } from '@purestack/ts-style'

export interface WriteStylesResult {
  revision: number
  outPath: string
  outputs: string[]
  signature: string
}

/** A site's stylesheet output, initialized after config contributions and before component factories. */
export interface SiteStyles {
  readonly revision: number
  links(cacheKey?: string): ThemeStylesheetLink[]
  write(input: {
    outDir: string
    cacheKey?: string
  }): Promise<WriteStylesResult>
}

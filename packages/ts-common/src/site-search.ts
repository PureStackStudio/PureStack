/** Search output owned by a plugin; the builder manages output invalidation. */
export interface SiteSearch {
  /** Whether a decoded, base-path-relative URL belongs to this search provider. */
  ownsPath(pathname: string): boolean
  write(input: {
    outDir: string
    excludeFiles: Iterable<string>
    /** Only these rendered pages are available during lazy development. */
    onlyFiles?: Iterable<string>
  }): Promise<void>
}

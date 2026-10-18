/** A local source selected through the site's URL and locale resolution rules. */
export interface AssetSource {
  relPath: string
  absPath: string
  /** Root-relative URL, without the site's base path. */
  publicPath: string
}

export interface PageAssetInput {
  document: Document
  sourceRelPath: string
  /** Resolves original content assets and records dependencies. Generated outputs are not resolver inputs. */
  resolveSource: (
    element: Element,
    url: string,
  ) => Promise<AssetSource | undefined>
  /** Records another content-root-relative input, including a file not yet created. */
  dependOn: (relPath: string) => void
  /** Await writes before returning. Use immutable content-addressed names within this namespace. */
  emit: (fileName: string, data: Uint8Array) => Promise<string>
}

/** Each build/session owns its processors; core handles generated files and invalidation. */
export interface SiteAssets {
  /** A unique path segment under /_assets/. */
  namespace: string
  /** Ordered within a page; different pages may run concurrently. Input methods expire when this call completes. */
  processPage: (input: PageAssetInput) => void | Promise<void>
}

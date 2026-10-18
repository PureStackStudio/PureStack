/** Internal, serializable ownership records stored in the build manifest. */
export interface GeneratedAssetReference {
  namespace: string
  path: string
}

export interface PageAssetReceipt {
  dependencies: string[]
  outputs: GeneratedAssetReference[]
}

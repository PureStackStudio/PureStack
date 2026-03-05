import path from 'node:path'

const TS_EXT = '.ts'
const JS_EXT = '.js'

export function isTypeScriptAssetPath(filePath: string) {
  return path.extname(filePath).toLowerCase() === TS_EXT
}

export function toOutputAssetRelPath(relPath: string) {
  if (!isTypeScriptAssetPath(relPath)) return relPath
  const normalized = relPath.replaceAll('\\', '/')
  const parsed = path.posix.parse(normalized)
  const fileName = `${parsed.name}${JS_EXT}`
  return parsed.dir.length > 0
    ? `${parsed.dir}/${parsed.name}/${fileName}`
    : `${parsed.name}/${fileName}`
}

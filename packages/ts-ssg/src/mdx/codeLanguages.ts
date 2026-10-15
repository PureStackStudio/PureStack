interface CodeLanguage {
  aliases?: string[]
  extensions?: string[]
}

// Use Shiki names (including its aliases) as the common language identifiers.
const codeLanguages: Record<string, CodeLanguage> = {
  bash: {
    aliases: ['sh', 'shell', 'shellscript', 'zsh'],
    extensions: ['.sh', '.bash', '.zsh'],
  },
  bat: { aliases: ['batch', 'cmd', 'dos'], extensions: ['.bat', '.cmd'] },
  c: { extensions: ['.c', '.h'] },
  cmake: { extensions: ['.cmake'] },
  cpp: {
    aliases: ['c++', 'cc', 'cxx', 'h++', 'hpp', 'hxx'],
    extensions: ['.cc', '.cpp', '.cxx', '.hh', '.hpp', '.hxx'],
  },
  csharp: { aliases: ['c#', 'cs'], extensions: ['.cs', '.csx'] },
  css: { extensions: ['.css'] },
  dart: { extensions: ['.dart'] },
  diff: { aliases: ['patch'], extensions: ['.diff', '.patch'] },
  dockerfile: { aliases: ['docker'], extensions: ['.dockerfile'] },
  elixir: { aliases: ['ex', 'exs'], extensions: ['.ex', '.exs'] },
  erlang: { aliases: ['erl'], extensions: ['.erl', '.hrl'] },
  fsharp: { aliases: ['f#', 'fs'], extensions: ['.fs', '.fsi', '.fsx'] },
  go: { aliases: ['golang'], extensions: ['.go'] },
  graphql: { aliases: ['gql'], extensions: ['.graphql', '.gql'] },
  groovy: { extensions: ['.groovy', '.gradle'] },
  html: { aliases: ['htm'], extensions: ['.html', '.htm'] },
  http: { aliases: ['https'], extensions: ['.http', '.rest'] },
  ini: { aliases: ['properties'], extensions: ['.ini', '.cfg', '.properties'] },
  java: { extensions: ['.java'] },
  javascript: {
    aliases: ['js', 'cjs', 'mjs'],
    extensions: ['.js', '.cjs', '.mjs'],
  },
  json: { extensions: ['.json'] },
  jsonc: { extensions: ['.jsonc'] },
  jsx: { extensions: ['.jsx'] },
  kotlin: { aliases: ['kt', 'kts'], extensions: ['.kt', '.kts'] },
  less: { extensions: ['.less'] },
  lua: { extensions: ['.lua'] },
  makefile: { aliases: ['make', 'mk'], extensions: ['.mk', '.mak'] },
  markdown: {
    aliases: ['md', 'mkd', 'mdown'],
    extensions: ['.md', '.markdown', '.mkd', '.mdown'],
  },
  mdx: { aliases: ['rmdx'], extensions: ['.mdx', '.rmdx'] },
  'objective-c': { aliases: ['objc', 'objectivec'], extensions: ['.m'] },
  perl: { aliases: ['pl', 'pm'], extensions: ['.pl', '.pm'] },
  php: { extensions: ['.php', '.phtml'] },
  powershell: {
    aliases: ['ps', 'ps1', 'pwsh'],
    extensions: ['.ps1', '.psm1', '.psd1'],
  },
  python: {
    aliases: ['py', 'py3', 'python3'],
    extensions: ['.py', '.pyw', '.pyi'],
  },
  r: { extensions: ['.r'] },
  ruby: {
    aliases: ['rb', 'gemspec'],
    extensions: ['.rb', '.rake', '.gemspec'],
  },
  rust: { aliases: ['rs'], extensions: ['.rs'] },
  scala: { extensions: ['.scala', '.sc'] },
  scss: { extensions: ['.scss'] },
  sql: { extensions: ['.sql'] },
  swift: { extensions: ['.swift'] },
  text: { aliases: ['txt', 'plaintext'], extensions: ['.txt', '.text'] },
  toml: { extensions: ['.toml'] },
  'ts-tags': { aliases: ['lit'] },
  tsx: { extensions: ['.tsx'] },
  typescript: {
    aliases: ['ts', 'cts', 'mts'],
    extensions: ['.ts', '.cts', '.mts'],
  },
  xml: {
    aliases: ['svg', 'xhtml'],
    extensions: ['.xml', '.svg', '.xhtml', '.xsd', '.xsl', '.xslt'],
  },
  yaml: { aliases: ['yml'], extensions: ['.yaml', '.yml'] },
}

export const DEFAULT_CODE_LANGUAGES = Object.keys(codeLanguages)

const languageAliases = new Map(
  Object.entries(codeLanguages).flatMap(([language, { aliases = [] }]) =>
    aliases.map((alias) => [alias, language] as const),
  ),
)

export const LANGUAGE_BY_EXTENSION: Record<string, string> = Object.fromEntries(
  Object.entries(codeLanguages).flatMap(([language, { extensions = [] }]) =>
    extensions.map((extension) => [extension, language]),
  ),
)

export function normalizeCodeLanguage(value: string): string {
  const normalized = value.trim().toLowerCase()
  return languageAliases.get(normalized) ?? normalized
}

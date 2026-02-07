import { globSync, readFileSync } from 'fs'
import { rm } from 'fs/promises'
import path from 'path'
import { build, InlineConfig } from 'tsdown'

import { fixDtsExports } from './fixDtsExports'
import { timeIt } from './timeIt'

const emojis: Record<string, string> = {
  '@purestack/ts-html': '⚙️',
  '@purestack/ts-css': '⚙️',
  '@purestack/ts-css-bootstrap': '⚙️',
  '@purestack/ts-ssg': '⚙️',
  '@purestack/utils': '⚙️',
}
const packages: PackageJson[] = globSync(['packages/**/package.json']).map(
  (p) => JSON.parse(readFileSync(path.join(p), 'utf8')),
)
const mainPkgName =
  packages.map((x) => x.name).filter((n) => !n.startsWith('@'))[0] ??
  packages
    .map((x) => x.name)[0]
    .split('/')[0]
    .substring(1)
const unscope = (name: string) => name.replace(`@${mainPkgName}/`, '')
const projectRoot = process.cwd()
const getOutDir = (pkg: PackageJson) =>
  path.join(projectRoot, 'packages', unscope(pkg.name), 'dist')

const getBanner = (pkg: PackageJson) =>
  `/*! ${pkg.name} v${
    pkg.version
  } | (c) ${new Date().getFullYear()} Ahmed Yasin Koculu | ${
    pkg.license
  } License */\n\n`

async function cleanDist(pkg: PackageJson) {
  const outDir = getOutDir(pkg)
  await timeIt(`clean: ${outDir}`, '⚡', async () => {
    try {
      await rm(outDir, { recursive: true, force: true })
    } catch (err) {
      console.warn(`⚠️ Could not remove ${outDir}:`, err)
    }
  })
}
interface PackageJson extends Record<string, unknown> {
  name: string
  version: string
  main: string
  module: string
  types: string
  exports: Record<
    string,
    {
      require: string
      import: string
      types: string
    }
  >
}
function getEntries(pkg: PackageJson) {
  if (!pkg.exports || Object.entries(pkg.exports).length === 0)
    throw new Error(`${pkg.name} package exports is not defined.`)
  const pkgName = unscope(pkg.name)
  const result = [{ [pkg.name]: `./packages/${pkgName}/src/index.ts` }]
  for (const [key] of Object.entries(pkg.exports)) {
    if (key == '.') continue
    if (!key.startsWith('./'))
      throw new Error(
        `${pkg.name} package additional export keys should start with ./`,
      )
    const name = key.substring(2) // skip './'
    result.push({
      [name]: `./packages/${pkgName}/src/${name}.ts`,
    })
  }
  return result
}
async function bundlePackage(pkg: PackageJson) {
  const entries = getEntries(pkg)
  for (const entry of entries) {
    const name = Object.keys(entry)[0]
    const input = entry[name]!
    // Select emoji based on entry
    const emoji = emojis[name] ?? 'XXX'
    const banner = getBanner(pkg)
    const outDir = getOutDir(pkg)
    await timeIt(`build: ${name}`, emoji, async () => {
      const opts: InlineConfig = {
        entry: { [unscope(name)]: input },
        platform: 'node',
        target: 'esnext',
        tsconfig: `./tsconfig.json`,
        format: ['module'],
        treeshake: true,
        minify: { compress: true, mangle: true },
        external: [
          'esbuild',
          'prettier',
          ...packages.filter((x) => x != pkg).map((x) => x.name),
        ],
        noExternal: [],
        // banner is set empty here, bcs of a bug in d.ts bundler.
        // custom plugin 'addBanner' adds the banner to the all outputs.
        outputOptions: {
          banner: '',
          sourcemap: true,
          codeSplitting: false,
        },
        dts: name === mainPkgName || name.startsWith('@'),
        sourcemap: true,
        clean: false,
        unbundle: false,
        outDir,
        logLevel: 'silent',
        plugins: [replaceVersion(pkg.version), addBanner(banner)],
      }
      await build(opts)
    })
  }
}

function replaceVersion(version: string) {
  return {
    name: 'replace-version',
    transform(code: string, id: string) {
      if (!id.endsWith('index.ts')) return null
      return {
        code: code.replace(
          /\bversion = PURESTACK_VERSION\b/g,
          'version = ' + JSON.stringify(version),
        ),
        map: null,
      }
    },
  }
}

function addBanner(banner: string) {
  return {
    name: 'add-banner',
    renderChunk(code: string) {
      return {
        code: banner + code,
        map: null,
      }
    },
  }
}

async function fixTypes(pkg: PackageJson) {
  const outDir = getOutDir(pkg)
  await timeIt(`fixDtsExports: ${outDir}`, '✨', async () => {
    await fixDtsExports(outDir)
  })
}

async function main() {
  await timeIt('total', '⏳', async () => {
    for (const pkg of packages) {
      await cleanDist(pkg)
      await bundlePackage(pkg)
      await fixTypes(pkg)
      console.log('')
    }
  })
  console.log('✅ Build complete!')
}

main().catch((err) => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})

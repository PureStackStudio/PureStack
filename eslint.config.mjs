import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

let tsdocPlugin
try {
  const tsdocModule = await import('eslint-plugin-tsdoc')
  tsdocPlugin = tsdocModule.default ?? tsdocModule
} catch {
  tsdocPlugin = undefined
}

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
      ...(tsdocPlugin ? { tsdoc: tsdocPlugin } : {}),
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1, // no more than one consecutive empty line anywhere
          maxBOF: 0, // zero empty lines at the beginning of the file
          maxEOF: 0, // no empty line at the end of the file
        },
      ],
      'eol-last': ['error', 'always'], // add single empty line at the end of the file
      ...(tsdocPlugin ? { 'tsdoc/syntax': 'error' } : {}),
    },
  }
)

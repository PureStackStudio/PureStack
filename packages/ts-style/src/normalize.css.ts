import { styleBuilder } from './styles'
import { themes } from './themeOptions'

export function registerNormalizeStyles() {
  themes.forEach((theme) => {
    applyNormalizeDocumentRules(theme)
    applyNormalizeTextRules(theme)
    applyNormalizeFormRules(theme)
    applyNormalizeMediaRules(theme)
  })
}

function applyNormalizeDocumentRules(theme: string) {
  styleBuilder.select('*, *::before, *::after', theme).boxSizing('border-box')
  styleBuilder.select('html', theme).webkitTextSizeAdjust('100%')
  styleBuilder.select('body', theme).margin('0').lineHeight('1.4')
  styleBuilder
    .select('pre, code, kbd, samp', theme)
    .fontFamily(
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
    )
    .fontSize('1em')
  styleBuilder
    .select('ul, ol', theme)
    .listStyle('none')
    .padding('0')
    .margin('0')
}

function applyNormalizeTextRules(theme: string) {
  styleBuilder
    .select('abbr[title]', theme)
    .borderBottom('none')
    .textDecoration('underline dotted')
  styleBuilder.select('small', theme).fontSize('80%')
  styleBuilder
    .select('sub, sup', theme)
    .fontSize('75%')
    .lineHeight('0')
    .position('relative')
    .verticalAlign('baseline')
  styleBuilder.select('sub', theme).bottom('-0.25em')
  styleBuilder.select('sup', theme).top('-0.5em')
}

function applyNormalizeFormRules(theme: string) {
  styleBuilder
    .select(
      'a, button, summary, [role="button"], input, label, select, textarea',
      theme,
    )
    .webkitTapHighlightColor('transparent')
  styleBuilder
    .select('button, input, optgroup, select, textarea', theme)
    .margin('0')
}

function applyNormalizeMediaRules(theme: string) {
  styleBuilder.select('summary', theme).display('list-item')
  styleBuilder.select('[hidden]', theme).display('none')
  styleBuilder
    .select('img, picture, video, canvas, svg', theme)
    .display('block')
    .maxWidth('100%')
  styleBuilder
    .select('button, input, textarea, select', theme)
    .font('inherit')
    .color('inherit')
  styleBuilder
    .select('table', theme)
    .borderCollapse('collapse')
    .borderSpacing('0')
}

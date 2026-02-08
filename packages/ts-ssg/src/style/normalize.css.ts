import { styleBuilder } from './styles'
import { themes } from './themeOptions'

export function registerNormalizeStyles() {
  themes.forEach((theme) => {
    styleBuilder.select('*, *::before, *::after', theme).boxSizing('border-box')

    styleBuilder
      .select('html', theme)
      .lineHeight('1.15')
      .webkitTextSizeAdjust('100%')

    styleBuilder.select('body', theme).margin('0')

    styleBuilder.select('main', theme).display('block')

    styleBuilder.select('h1', theme).fontSize('2em').margin('0.67em 0')

    styleBuilder
      .select('hr', theme)
      .boxSizing('content-box')
      .height('0')
      .overflow('visible')

    styleBuilder
      .select('pre', theme)
      .fontFamily('monospace, monospace')
      .fontSize('1em')

    styleBuilder.select('a', theme).backgroundColor('transparent')

    styleBuilder
      .select('abbr[title]', theme)
      .borderBottom('none')
      .textDecoration('underline dotted')

    styleBuilder.select('b, strong', theme).fontWeight('bolder')

    styleBuilder
      .select('code, kbd, samp', theme)
      .fontFamily('monospace, monospace')
      .fontSize('1em')

    styleBuilder.select('small', theme).fontSize('80%')

    styleBuilder
      .select('sub, sup', theme)
      .fontSize('75%')
      .lineHeight('0')
      .position('relative')
      .verticalAlign('baseline')
    styleBuilder.select('sub', theme).bottom('-0.25em')
    styleBuilder.select('sup', theme).top('-0.5em')

    styleBuilder.select('img', theme).borderStyle('none')

    styleBuilder
      .select('button, input, optgroup, select, textarea', theme)
      .fontFamily('inherit')
      .fontSize('100%')
      .lineHeight('1.15')
      .margin('0')

    styleBuilder.select('button, input', theme).overflow('visible')

    styleBuilder.select('button, select', theme).textTransform('none')

    styleBuilder
      .select('button, [type="button"], [type="reset"], [type="submit"]', theme)
      .webkitAppearance('button')

    styleBuilder
      .select(
        'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner',
        theme,
      )
      .borderStyle('none')
      .padding('0')

    styleBuilder
      .select(
        'button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring',
        theme,
      )
      .outline('1px dotted ButtonText')

    styleBuilder.select('fieldset', theme).padding('0.35em 0.75em 0.625em')

    styleBuilder
      .select('legend', theme)
      .boxSizing('border-box')
      .color('inherit')
      .display('table')
      .maxWidth('100%')
      .padding('0')
      .whiteSpace('normal')

    styleBuilder.select('progress', theme).verticalAlign('baseline')

    styleBuilder.select('textarea', theme).overflow('auto')

    styleBuilder
      .select('[type="checkbox"], [type="radio"]', theme)
      .boxSizing('border-box')
      .padding('0')

    styleBuilder
      .select('[type="number"]::-webkit-inner-spin-button', theme)
      .height('auto')

    styleBuilder
      .select('[type="search"]', theme)
      .webkitAppearance('textfield')
      .outlineOffset('-2px')

    styleBuilder
      .select('[type="search"]::-webkit-search-decoration', theme)
      .webkitAppearance('none')

    styleBuilder
      .select('::-webkit-file-upload-button', theme)
      .webkitAppearance('button')
      .font('inherit')

    styleBuilder.select('details', theme).display('block')
    styleBuilder.select('summary', theme).display('list-item')
    styleBuilder.select('template', theme).display('none')
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
  })
}

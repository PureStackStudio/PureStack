import { styleBuilder } from './styles'

export function registerNormalizeStyles() {
  const baseNormalize = (theme: string) => {
    styleBuilder
      .select('*, *::before, *::after', theme)
      .set('box-sizing', 'border-box')

    styleBuilder
      .select('html', theme)
      .set('line-height', '1.15')
      .set('-webkit-text-size-adjust', '100%')

    styleBuilder.select('body', theme).set('margin', '0')

    styleBuilder.select('main', theme).set('display', 'block')

    styleBuilder
      .select('h1', theme)
      .set('font-size', '2em')
      .set('margin', '0.67em 0')

    styleBuilder
      .select('hr', theme)
      .set('box-sizing', 'content-box')
      .set('height', '0')
      .set('overflow', 'visible')

    styleBuilder
      .select('pre', theme)
      .set('font-family', 'monospace, monospace')
      .set('font-size', '1em')

    styleBuilder.select('a', theme).set('background-color', 'transparent')

    styleBuilder
      .select('abbr[title]', theme)
      .set('border-bottom', 'none')
      .set('text-decoration', 'underline dotted')

    styleBuilder.select('b, strong', theme).set('font-weight', 'bolder')

    styleBuilder
      .select('code, kbd, samp', theme)
      .set('font-family', 'monospace, monospace')
      .set('font-size', '1em')

    styleBuilder.select('small', theme).set('font-size', '80%')

    styleBuilder
      .select('sub, sup', theme)
      .set('font-size', '75%')
      .set('line-height', '0')
      .set('position', 'relative')
      .set('vertical-align', 'baseline')
    styleBuilder.select('sub', theme).set('bottom', '-0.25em')
    styleBuilder.select('sup', theme).set('top', '-0.5em')

    styleBuilder.select('img', theme).set('border-style', 'none')

    styleBuilder
      .select('button, input, optgroup, select, textarea', theme)
      .set('font-family', 'inherit')
      .set('font-size', '100%')
      .set('line-height', '1.15')
      .set('margin', '0')

    styleBuilder.select('button, input', theme).set('overflow', 'visible')

    styleBuilder.select('button, select', theme).set('text-transform', 'none')

    styleBuilder
      .select('button, [type="button"], [type="reset"], [type="submit"]', theme)
      .set('-webkit-appearance', 'button')

    styleBuilder
      .select(
        'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner',
        theme,
      )
      .set('border-style', 'none')
      .set('padding', '0')

    styleBuilder
      .select(
        'button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring',
        theme,
      )
      .set('outline', '1px dotted ButtonText')

    styleBuilder
      .select('fieldset', theme)
      .set('padding', '0.35em 0.75em 0.625em')

    styleBuilder
      .select('legend', theme)
      .set('box-sizing', 'border-box')
      .set('color', 'inherit')
      .set('display', 'table')
      .set('max-width', '100%')
      .set('padding', '0')
      .set('white-space', 'normal')

    styleBuilder.select('progress', theme).set('vertical-align', 'baseline')

    styleBuilder.select('textarea', theme).set('overflow', 'auto')

    styleBuilder
      .select('[type="checkbox"], [type="radio"]', theme)
      .set('box-sizing', 'border-box')
      .set('padding', '0')

    styleBuilder
      .select('[type="number"]::-webkit-inner-spin-button', theme)
      .set('height', 'auto')

    styleBuilder
      .select('[type="search"]', theme)
      .set('-webkit-appearance', 'textfield')
      .set('outline-offset', '-2px')

    styleBuilder
      .select('[type="search"]::-webkit-search-decoration', theme)
      .set('-webkit-appearance', 'none')

    styleBuilder
      .select('::-webkit-file-upload-button', theme)
      .set('-webkit-appearance', 'button')
      .set('font', 'inherit')

    styleBuilder.select('details', theme).set('display', 'block')
    styleBuilder.select('summary', theme).set('display', 'list-item')
    styleBuilder.select('template', theme).set('display', 'none')
    styleBuilder.select('[hidden]', theme).set('display', 'none')

    styleBuilder
      .select('img, picture, video, canvas, svg', theme)
      .set('display', 'block')
      .set('max-width', '100%')

    styleBuilder
      .select('button, input, textarea, select', theme)
      .set('font', 'inherit')
      .set('color', 'inherit')

    styleBuilder
      .select('table', theme)
      .set('border-collapse', 'collapse')
      .set('border-spacing', '0')
  }

  baseNormalize('light')
  baseNormalize('dark')
}

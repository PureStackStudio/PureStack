import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'

// Reboot
//
// Normalization of HTML elements, manually forked from Normalize.css to remove
// styles targeting irrelevant browsers while applying new styles.
//
// Normalize is licensed MIT. https://github.com/necolas/normalize.css

export function reboot(config: CssConfig, style: Style) {
  setAll(style)
  setRoot(style)
  setBody(style, config)
  setHr(style, config)
  setHeading(style, config)
  setP(style, config)
  setAbr(style, config)
  setAddress(style, config)
  setPrimitives1(style, config)
  setLink(style, config)
  setPreCode(style, config)
  setPrimitives2(style, config)
  setTable(style, config)
  setForm(style, config)
  setPrimitives3(style, config)
}

function setAll(style: Style) {
  style.select('*, *::before, *::after').boxSizing('border-box')
}

function setRoot(style: Style) {
  style
    .select(':root')
    .media('prefers-reduced-motion: no-preference')
    .scrollBehavior('smooth')
}

function setHr(style: Style, config: CssConfig) {
  style
    .select('hr')
    .margin(`${config.margins.margin1} 0`)
    .color(config.presetDefaultForeground())
    .border('0')
    .borderTop(
      `${
        config.borderWidths.borderWidth1
      } solid ${config.presetDefaultForeground()}`,
    )
    .opacity(config.opacities[25])
}

function setBody(style: Style, config: CssConfig) {
  style
    .select('body')
    .margin('0')
    // Prevent adjustments of font size after orientation changes in iOS.
    .webkitTextSizeAdjust('100%')
    // Change the default tap highlight to be completely transparent in iOS.
    .webkitTapHighlightColor('rgba(#000000,0)')
    .fontFamily(config.fontFamilies.bodyFontFamily)
    .fontSize(config.fontSizes.bodyFontSize)
    .fontWeight(config.fontWeights.bodyFontWeight)
    .lineHeight(config.lineHeights.bodyLineHeight)
    .webkitTapHighlightColor(`rgba(${config.colors.bg1}, 0)`)
    .color(config.presetDefaultForeground())
    .backgroundColor(config.presetDefaultBackground())
}

function setHeading(style: Style, config: CssConfig) {
  const size = config.fontSizes.headings
  style
    .select('h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6')
    .marginTop('0')
    .marginBottom(config.margins.headingMarginBottom)
    .fontFamily(config.fontFamilies.headingFontFamily)
    .fontStyle(config.fontStyles.headingFontStyle)
    .fontWeight(config.fontWeights.headingFontWeight)
    .lineHeight(config.lineHeights.headingLineHeight)
  const headerColors = config.presetDefaultTagColors()
  for (const [key, value] of Object.entries(headerColors)) {
    style.select(`${key}, .${key}`).color(`${value} !important`)
  }
  style.select('h1, .h1').fontSize(`${size[1]}rem`)
  style.select('h2, .h2').fontSize(`${size[2]}rem`)
  style.select('h3, .h3').fontSize(`${size[3]}rem`)
  style.select('h4, .h4').fontSize(`${size[4]}rem`)
  style.select('h5, .h5').fontSize(`${size[5]}rem`)
  style.select('h6, .h6').fontSize(`${size[6]}rem`)
}

function setP(style: Style, config: CssConfig) {
  style
    .select('p')
    .marginTop('0')
    .marginBottom(config.margins.paragraphMarginBottom)
}

function setAbr(style: Style, _config: CssConfig) {
  // Abbreviations
  //
  // 1. Add the correct text decoration in Chrome, Edge, Opera, and Safari.
  // 2. Add explicit cursor to indicate changed behavior.
  // 3. Prevent the text-decoration to be skipped.
  style
    .select('abbr[title]')
    .textDecoration('underline dotted')
    .set('text-decoration-skip-ink', 'none')
}

function setAddress(style: Style, config: CssConfig) {
  style
    .select('address')
    .marginBottom(config.margins.margin1)
    .fontStyle('normal')
    .lineHeight('inherit')
}

function setPrimitives1(style: Style, config: CssConfig) {
  style.select('ol,ul,dl,li').margin('0').padding('0')
  style.select('dt').fontWeight(config.fontWeights.bold)
  style.select('dd').marginLeft('0').marginBottom('.5rem')
  style.select('blockquote').marginRight('0 0 1rem')
  style.select('b,strong').fontWeight(config.fontWeights.bolder)
  style.select('small').fontSize('.875em')
  style
    .select('mark')
    .padding('.2em')
    .color(config.presetDefaultForeground())
    .backgroundColor(config.presetDefaultBackground())
  style
    .select('sub,sup')
    .position('relative')
    .fontSize(config.fontSizes.subSupSize)
    .lineHeight('0')
    .verticalAlign('baseline')
  style.select('sub').bottom('-.25em')
  style.select('sup').top('-.5em')
}

function setLink(style: Style, config: CssConfig) {
  style
    .select('a')
    .color(config.presetDefaultForeground())
    .textDecoration('none')
    .select(':hover')
    .textDecoration('none')
}

function setPreCode(style: Style, config: CssConfig) {
  style
    .select('pre,code,kbd,samp')
    .fontFamily(config.fontFamilies.codeFont)
    .fontSize('1em')
  style
    .select('pre')
    .display('block')
    .marginTop('0')
    .marginBottom('1rem')
    .overflow('auto')
    .fontSize(config.fontSizes.codeFontSize)
  style
    .select('pre')
    .select('code')
    .fontSize('inherit')
    .color('inherit')
    .wordBreak('normal')
  style
    .select('code')
    .fontSize(config.fontSizes.codeFontSize)
    .wordBreak('break-word')
  style.select('a > code').color('inherit')
}

function setPrimitives2(style: Style, _config: CssConfig) {
  style.select('figure').margin('0 0 1rem')
  style.select('img, svg').verticalAlign('middle')
}

function setTable(style: Style, config: CssConfig) {
  style.select('table').captionSide('bottom').borderCollapse('collapse')
  style
    .select('caption')
    .paddingTop(config.paddings.tableCellPaddingY)
    .paddingBottom(config.paddings.tableCellPaddingY)
    .textAlign('left')
  style.select('th').fontWeight('inherit').textAlign('inherit')
  // Fix alignment for Safari
  // textAlign('-webkit-match-parent')
  // TODO: how to make double assignments for the same key? may use | operator?
  style
    .select('thead,tbody,tfoot,tr,td,th')
    .borderColor('inherit')
    .borderStyle('solid')
    .borderWidth('0')
}

function setForm(style: Style, config: CssConfig) {
  style.select('label').display('inline-block')
  style.select('button').borderRadius('0')
  style.select('button:focus:not(:focus-visible)').outline('0')
  style
    .select('input,button,select,optgroup,textarea')
    .margin('0')
    .fontFamily('inherit')
    .fontSize('inherit')
    .lineHeight('inherit')
  style.select('button,select').textTransform('none')
  style.select('[role="button"]').cursor('pointer')
  style.select('select').wordWrap('normal')
  style.select('select:disabled').opacity(1)
  style
    .select(
      '[list]:not([type="date"]):not([type="datetime-local"]):not([type="month"]):not([type="week"]):not([type="time"])::-webkit-calendar-picker-indicator',
    )
    .display('none !important')
  style
    .select('button,[type="button"],[type="reset"],[type="submit"]')
    .appearance('button')
    .select(':not(disabled)')
    .cursor('pointer')
  style.select('::-moz-focus-inner').padding('0').borderStyle('none')
  style.select('textarea').resize('vertical')
  style.select('fieldset').minWidth('0').padding('0').margin('0').border('0')
  style
    .select('legend')
    .float('left')
    .width('100%')
    .padding('0')
    .marginBottom(config.margins.margin1)
    .fontSize('inherit')
    .fontWeight('inherit')
    .lineHeight('inherit')
    .select('+ *')
    .clear('left')
  style
    .select(
      '::-webkit-datetime-edit-fields-wrapper,::-webkit-datetime-edit-text,::-webkit-datetime-edit-minute,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-year-field',
    )
    .padding('0')
  style.select('::-webkit-inner-spin-button').height('auto')
  style.select('[type="search"]').appearance('textfield').outlineOffset('-2px')
  style.select('::-webkit-search-decoration').appearance('none')
  style.select('::-webkit-color-swatch-wrapper').padding('0')
  style.select('::file-selector-button').font('inherit').appearance('button')
}

function setPrimitives3(style: Style, _config: CssConfig) {
  style.select('output').display('inline-block')
  style.select('iframe').border('0')
  style.select('summary').display('list-item').cursor('pointer')
  style.select('progress').verticalAlign('baseline')
  style.select('[hidden]').display('none !important')
}

import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'

export function border(config: CssConfig, style: Style) {
  const defaultBorder = '1px solid currentColor'
  const noBorder = '0 !important'
  style.select('.border').border(defaultBorder)
  style.select('.border-0').border(noBorder)
  style.select('.border-top').borderTop(defaultBorder)
  style.select('.border-top-0').borderTop(noBorder)
  style.select('.border-bottom').borderBottom(defaultBorder)
  style.select('.border-bottom-0').borderBottom(noBorder)
  style.select('.border-start').borderLeft(defaultBorder)
  style.select('.border-start-0').borderLeft(noBorder)
  style.select('.border-end').borderRight(defaultBorder)
  style.select('.border-end-0').borderRight(noBorder)
  style.select('.border-1').borderWidth('1px !important')
  style.select('.border-2').borderWidth('2px !important')
  style.select('.border-3').borderWidth('3px !important')
  style.select('.border-4').borderWidth('4px !important')
  style.select('.border-5').borderWidth('5px !important')

  for (const [key, value] of Object.entries(config.rounded)) {
    const css = value
    style.select(`.rounded-${key}`).borderRadius(css)
    style.select(`.rounded-t-${key}`).borderTopRightRadius(css)
    style.select(`.rounded-t-${key}`).borderTopLeftRadius(css)
    style.select(`.rounded-b-${key}`).borderBottomRightRadius(css)
    style.select(`.rounded-b-${key}`).borderBottomLeftRadius(css)
    style.select(`.rounded-s-${key}`).borderTopLeftRadius(css)
    style.select(`.rounded-s-${key}`).borderBottomLeftRadius(css)
    style.select(`.rounded-e-${key}`).borderTopRightRadius(css)
    style.select(`.rounded-e-${key}`).borderBottomRightRadius(css)
    style.select(`.rounded-te-${key}`).borderTopRightRadius(css)
    style.select(`.rounded-ts-${key}`).borderTopLeftRadius(css)
    style.select(`.rounded-be-${key}`).borderBottomRightRadius(css)
    style.select(`.rounded-bs-${key}`).borderBottomLeftRadius(css)
  }
}

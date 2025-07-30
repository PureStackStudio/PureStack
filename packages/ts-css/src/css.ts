import { Style } from './style'

export function css(selector?: string) {
  return new Style(selector)
}

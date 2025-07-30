import { Style } from './style'

export function s(selector?: string) {
  return new Style(selector)
}

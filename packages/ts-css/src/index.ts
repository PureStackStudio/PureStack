import { Style } from './style'

export { Style } from './style'

export function css(selector?: string) {
  return new Style(selector)
}

declare const PURESTACK_VERSION: string
export const version = PURESTACK_VERSION

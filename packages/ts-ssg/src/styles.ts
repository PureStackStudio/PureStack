import { Style } from '@purestack/ts-css'

const styleBuilders = new Map<string, Style>()

export const styleBuilder = {
  get(name = '') {
    const existing = styleBuilders.get(name)
    if (existing) return existing
    const created = new Style()
    styleBuilders.set(name, created)
    return created
  },
  select(selector: string, name = '') {
    return styleBuilder.get(name).select(selector)
  },
  list() {
    return [...styleBuilders.keys()]
  },
  async render(name: string = '', pretty: boolean = true) {
    const style = styleBuilder.get(name)
    return pretty ? style.toPrettyCSS() : style.toCSS()
  },
}

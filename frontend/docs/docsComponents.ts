import { defineModalExampleComponents } from './modal'
import { defineTabsExampleComponents } from './tabs'

export function defineDocumentationComponents() {
  return {
    ...defineTabsExampleComponents(),
    ...defineModalExampleComponents(),
  }
}

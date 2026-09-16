import { defineButtonsExampleComponents } from './buttons'
import { defineModalExampleComponents } from './modal'
import { defineTabsExampleComponents } from './tabs'

export function defineDocumentationComponents() {
  return {
    ...defineButtonsExampleComponents(),
    ...defineTabsExampleComponents(),
    ...defineModalExampleComponents(),
  }
}

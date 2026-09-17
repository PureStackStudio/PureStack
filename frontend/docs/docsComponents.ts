import { defineApiPropertyComponent } from './apiProperty'
import { defineModalExampleComponents } from './modal'
import { defineTabsExampleComponents } from './tabs'

export function defineDocumentationComponents() {
  return {
    ApiProperty: defineApiPropertyComponent(),
    ...defineTabsExampleComponents(),
    ...defineModalExampleComponents(),
  }
}

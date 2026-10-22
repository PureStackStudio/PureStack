import { definePlugin } from '@purestack/ts-ssg'
import { createWizardPalettes } from './skin'
import { registerWizardStyles } from './styles'

export const wizardPlugin = definePlugin({
  name: 'purestack-studio-wizard',
  skins: {
    wizard: {
      create: createWizardPalettes,
    },
  },
  hooks: { onConfigResolved: () => registerWizardStyles() },
})

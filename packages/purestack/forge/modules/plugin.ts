import { definePlugin } from '@purestack/ts-ssg'
import { createPalettes } from './skin'
import { registerStyles } from './styles'

export const forgePlugin = definePlugin({
  name: 'purestack-forge',
  skins: {
    forge: {
      create: createPalettes,
    },
  },
  hooks: { onConfigResolved: () => registerStyles() },
})

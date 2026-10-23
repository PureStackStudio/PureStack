import { defineConfig } from '@purestack/ts-ssg'
import { frontendPlugin } from '../plugin'

export default defineConfig({
  plugins: [frontendPlugin],
})

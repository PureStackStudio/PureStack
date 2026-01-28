import { Style } from '@purestack/ts-css'

import { align } from './core/align'
import { border } from './core/border'
import { color } from './core/color'
import { container } from './core/container'
import { display } from './core/display'
import { flex } from './core/flex'
import { font } from './core/font'
import { grid } from './core/grid'
import { misc } from './core/misc'
import { modal } from './core/modal'
import { overflow } from './core/overflow'
import { reboot } from './core/reboot'
import { shadow } from './core/shadow'
import { size } from './core/size'
import { spacing } from './core/spacing'
import { text } from './core/text'
import { CssConfig } from './cssConfig'

export * from './colorMaster'
export * from './core/align'
export * from './core/border'
export * from './core/color'
export * from './core/container'
export * from './core/display'
export * from './core/flex'
export * from './core/font'
export * from './core/grid'
export * from './core/misc'
export * from './core/modal'
export * from './core/overflow'
export * from './core/reboot'
export * from './core/shadow'
export * from './core/size'
export * from './core/spacing'
export * from './core/text'
export * from './core/utility'
export * from './cssConfig'

export type BootstrapModules = {
  reboot: typeof reboot
  color: typeof color
  container: typeof container
  align: typeof align
  border: typeof border
  display: typeof display
  flex: typeof flex
  font: typeof font
  grid: typeof grid
  misc: typeof misc
  overflow: typeof overflow
  size: typeof size
  shadow: typeof shadow
  spacing: typeof spacing
  text: typeof text
  modal: typeof modal
}

export const bootstrapModules: BootstrapModules = {
  reboot,
  color,
  container,
  align,
  border,
  display,
  flex,
  font,
  grid,
  misc,
  overflow,
  size,
  shadow,
  spacing,
  text,
  modal,
}

export function applyBootstrap(config: CssConfig, style: Style) {
  reboot(config, style)
  color(config, style)
  container(config, style)
  align(config, style)
  border(config, style)
  display(config, style)
  flex(config, style)
  font(config, style)
  grid(config, style)
  misc(config, style)
  overflow(config, style)
  size(config, style)
  shadow(config, style)
  spacing(config, style)
  text(config, style)
  modal(config, style)
}

export function createBootstrapStyle(
  config: CssConfig = new CssConfig(),
  style: Style = new Style(),
) {
  config.prepare()
  applyBootstrap(config, style)
  return { config, style }
}

export async function writeBootstrapCssFile(
  style: Style,
  outputPath: string = './dist/css/ts-css-bootstrap.css',
) {
  const { promises: fs } = await import('fs')
  const path = await import('path')
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const source = await style.toPrettyCSS()
  await fs.writeFile(outputPath, source)
}

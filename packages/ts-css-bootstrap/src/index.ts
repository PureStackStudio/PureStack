import { Style } from '@purestack/ts-css'
import * as fs from 'fs'

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

const config = new CssConfig()
config.prepare()
const style = new Style()

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

/*
+ (Next-sibling combinator)
> (Child combinator)
|| (Column combinator)
~ (Subsequent sibling combinator)
" " (Descendant combinator)
| (Namespace separator) 
 */

async function main() {
  const source = await style.toPrettyCSS()
  fs.mkdirSync('./dist/css', { recursive: true })
  fs.writeFileSync('./dist/css/ts-css-bootstrap.css', source)
  console.log('compiled css')
}

main()
  .then()
  .catch((err) => console.error(err))

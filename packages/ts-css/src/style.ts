import { BaseStyle } from './baseStyle'

export type CSSProps = {
  'additive-symbols': string
  'align-content':
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'stretch'
    | 'start'
    | 'end'
    | 'normal'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'stretch'
    | 'safe'
    | 'unsafe'
    | (string & {})
  'align-items':
    | 'baseline'
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'stretch'
    | 'normal'
    | 'start'
    | 'end'
    | 'self-start'
    | 'self-end'
    | 'first baseline'
    | 'last baseline'
    | 'stretch'
    | 'safe'
    | 'unsafe'
    | (string & {})
  'justify-items':
    | 'auto'
    | 'normal'
    | 'end'
    | 'start'
    | 'flex-end'
    | 'flex-start'
    | 'self-end'
    | 'self-start'
    | 'center'
    | 'left'
    | 'right'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'stretch'
    | 'safe'
    | 'unsafe'
    | 'legacy'
    | (string & {})
  'justify-self':
    | 'auto'
    | 'normal'
    | 'end'
    | 'start'
    | 'flex-end'
    | 'flex-start'
    | 'self-end'
    | 'self-start'
    | 'center'
    | 'left'
    | 'right'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'stretch'
    | 'save'
    | 'unsave'
    | (string & {})
  'align-self':
    | 'auto'
    | 'normal'
    | 'self-end'
    | 'self-start'
    | 'baseline'
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'stretch'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'safe'
    | 'unsafe'
    | (string & {})
  all: 'revert' | (string & {})
  alt: 'none' | (string & {})
  animation:
    | 'alternate'
    | 'alternate-reverse'
    | 'backwards'
    | 'both'
    | 'forwards'
    | 'infinite'
    | 'none'
    | 'normal'
    | 'reverse'
    | (string & {})
  'animation-delay': string
  'animation-direction':
    | 'alternate'
    | 'alternate-reverse'
    | 'normal'
    | 'reverse'
    | (string & {})
  'animation-duration': string
  'animation-fill-mode':
    | 'backwards'
    | 'both'
    | 'forwards'
    | 'none'
    | (string & {})
  'animation-iteration-count': 'infinite' | (string & {})
  'animation-name': 'none' | (string & {})
  'animation-play-state': 'paused' | 'running' | (string & {})
  'animation-timing-function': string
  'backface-visibility': 'hidden' | 'visible' | (string & {})
  background: 'fixed' | 'local' | 'none' | 'scroll' | (string & {})
  'background-attachment': 'fixed' | 'local' | 'scroll' | (string & {})
  'background-blend-mode':
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity'
    | (string & {})
  'background-clip': string
  'background-color': string
  'background-image': 'none' | (string & {})
  'background-origin': string
  'background-position': string
  'background-repeat': 'logical' | (string & {})
  'background-size': 'auto' | 'contain' | 'cover' | (string & {})
  'block-size': 'auto' | (string & {})
  border: string
  'border-block-end': string
  'border-block-start': string
  'border-block-end-color': string
  'border-block-start-color': string
  'border-block-end-style': string
  'border-block-start-style': string
  'border-block-end-width': string
  'border-block-start-width': string
  'border-bottom': string
  'border-bottom-color': string
  'border-bottom-left-radius': string
  'border-bottom-right-radius': string
  'border-bottom-style': string
  'border-bottom-width': string
  'border-collapse': 'collapse' | 'separate' | (string & {})
  'border-color': 'logical' | (string & {})
  'border-image':
    | 'auto'
    | 'fill'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | 'url()'
    | (string & {})
  'border-image-outset': string
  'border-image-repeat':
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | (string & {})
  'border-image-slice': 'fill' | (string & {})
  'border-image-source': 'none' | (string & {})
  'border-image-width': 'auto' | (string & {})
  'border-inline-end': string
  'border-inline-start': string
  'border-inline-end-color': string
  'border-inline-start-color': string
  'border-inline-end-style': string
  'border-inline-start-style': string
  'border-inline-end-width': string
  'border-inline-start-width': string
  'border-left': string
  'border-left-color': string
  'border-left-style': string
  'border-left-width': string
  'border-radius': string
  'border-right': string
  'border-right-color': string
  'border-right-style': string
  'border-right-width': string
  'border-spacing': string
  'border-style': 'logical' | (string & {})
  'border-top': string
  'border-top-color': string
  'border-top-left-radius': string
  'border-top-right-radius': string
  'border-top-style': string
  'border-top-width': string
  'border-width': 'logical' | (string & {})
  bottom: 'auto' | (string & {})
  'box-decoration-break': 'clone' | 'slice' | (string & {})
  'box-shadow': 'inset' | 'none' | (string & {})
  'box-sizing': 'border-box' | 'content-box' | (string & {})
  'caption-side':
    | 'block-end'
    | 'block-start'
    | 'bottom'
    | 'inline-end'
    | 'inline-start'
    | 'top'
    | (string & {})
  'caret-color': 'auto' | (string & {})
  clear:
    | 'both'
    | 'inline-end'
    | 'inline-start'
    | 'left'
    | 'none'
    | 'right'
    | (string & {})
  clip: 'auto' | 'rect()' | (string & {})
  'clip-path': 'none' | 'url()' | (string & {})
  'clip-rule': 'evenodd' | 'nonzero' | (string & {})
  color: string
  'color-interpolation-filters': 'auto' | 'linearRGB' | 'sRGB' | (string & {})
  'column-count': 'auto' | (string & {})
  'column-fill': 'auto' | 'balance' | (string & {})
  'column-gap': 'normal' | (string & {})
  'column-rule': string
  'column-rule-style': string
  'column-rule-width': string
  columns: 'auto' | (string & {})
  'column-span': 'all' | 'none' | (string & {})
  'column-width':
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  contain:
    | 'none'
    | 'strict'
    | 'content'
    | 'size'
    | 'layout'
    | 'style'
    | 'paint'
    | (string & {})
  content:
    | 'attr()'
    | 'box'
    | 'check'
    | 'circle'
    | 'close-quote'
    | 'contents'
    | 'counter(name)'
    | 'counter(name, style)'
    | 'counters(name, string)'
    | 'counters(name, string, style)'
    | 'date(format)'
    | 'diamond'
    | 'disc'
    | 'endnote'
    | 'footnote'
    | 'hyphen'
    | 'icon'
    | 'inhibit'
    | 'list-item'
    | 'no-close-quote'
    | 'none'
    | 'no-open-quote'
    | 'normal'
    | 'open-quote'
    | 'pending()'
    | 'section-note'
    | 'square'
    | 'string(name)'
    | 'url()'
    | (string & {})
  'counter-increment': 'none' | (string & {})
  'counter-reset': 'none' | (string & {})
  cursor:
    | 'alias'
    | 'all-scroll'
    | 'auto'
    | 'cell'
    | 'col-resize'
    | 'context-menu'
    | 'copy'
    | 'crosshair'
    | 'default'
    | 'e-resize'
    | 'ew-resize'
    | 'grab'
    | 'grabbing'
    | 'help'
    | 'move'
    | '-moz-grab'
    | '-moz-grabbing'
    | '-moz-zoom-in'
    | '-moz-zoom-out'
    | 'ne-resize'
    | 'nesw-resize'
    | 'no-drop'
    | 'none'
    | 'not-allowed'
    | 'n-resize'
    | 'ns-resize'
    | 'nw-resize'
    | 'nwse-resize'
    | 'pointer'
    | 'progress'
    | 'row-resize'
    | 'se-resize'
    | 's-resize'
    | 'sw-resize'
    | 'text'
    | 'vertical-text'
    | 'wait'
    | '-webkit-grab'
    | '-webkit-grabbing'
    | '-webkit-zoom-in'
    | '-webkit-zoom-out'
    | 'w-resize'
    | 'zoom-in'
    | 'zoom-out'
    | (string & {})
  direction: 'ltr' | 'rtl' | (string & {})
  display:
    | 'block'
    | 'contents'
    | 'flex'
    | 'flexbox'
    | 'flow'
    | 'flow-root'
    | 'grid'
    | 'inline'
    | 'inline-block'
    | 'inline-flex'
    | 'inline-flexbox'
    | 'inline-grid'
    | 'inline-table'
    | 'list-item'
    | '-moz-box'
    | '-moz-deck'
    | '-moz-grid'
    | '-moz-grid-group'
    | '-moz-grid-line'
    | '-moz-groupbox'
    | '-moz-inline-box'
    | '-moz-inline-grid'
    | '-moz-inline-stack'
    | '-moz-marker'
    | '-moz-popup'
    | '-moz-stack'
    | '-ms-flexbox'
    | '-ms-grid'
    | '-ms-inline-flexbox'
    | '-ms-inline-grid'
    | 'none'
    | 'ruby'
    | 'ruby-base'
    | 'ruby-base-container'
    | 'ruby-base-group'
    | 'ruby-text'
    | 'ruby-text-container'
    | 'ruby-text-group'
    | 'run-in'
    | 'table'
    | 'table-caption'
    | 'table-cell'
    | 'table-column'
    | 'table-column-group'
    | 'table-footer-group'
    | 'table-header-group'
    | 'table-row'
    | 'table-row-group'
    | '-webkit-box'
    | '-webkit-flex'
    | '-webkit-inline-box'
    | '-webkit-inline-flex'
    | (string & {})
  'empty-cells': 'hide' | '-moz-show-background' | 'show' | (string & {})
  'enable-background': 'accumulate' | 'new' | (string & {})
  fallback: string
  fill:
    | 'child'
    | 'child()'
    | 'context-fill'
    | 'context-stroke'
    | 'url()'
    | 'none'
    | (string & {})
  'fill-opacity': number
  'fill-rule': 'evenodd' | 'nonzero' | (string & {})
  filter:
    | 'none'
    | 'blur()'
    | 'brightness()'
    | 'contrast()'
    | 'drop-shadow()'
    | 'grayscale()'
    | 'hue-rotate()'
    | 'invert()'
    | 'opacity()'
    | 'saturate()'
    | 'sepia()'
    | 'url()'
    | (string & {})
  flex: 'auto' | 'content' | 'none' | (string & {})
  'flex-basis': 'auto' | 'content' | (string & {})
  'flex-direction':
    | 'column'
    | 'column-reverse'
    | 'row'
    | 'row-reverse'
    | (string & {})
  'flex-flow':
    | 'column'
    | 'column-reverse'
    | 'nowrap'
    | 'row'
    | 'row-reverse'
    | 'wrap'
    | 'wrap-reverse'
    | (string & {})
  'flex-grow': number
  'flex-shrink': number
  'flex-wrap': 'nowrap' | 'wrap' | 'wrap-reverse' | (string & {})
  float:
    | 'inline-end'
    | 'inline-start'
    | 'left'
    | 'none'
    | 'right'
    | (string & {})
  'flood-color': string
  'flood-opacity': string
  font:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 'bold'
    | 'bolder'
    | 'caption'
    | 'icon'
    | 'italic'
    | 'large'
    | 'larger'
    | 'lighter'
    | 'medium'
    | 'menu'
    | 'message-box'
    | 'normal'
    | 'oblique'
    | 'small'
    | 'small-caps'
    | 'small-caption'
    | 'smaller'
    | 'status-bar'
    | 'x-large'
    | 'x-small'
    | 'xx-large'
    | 'xx-small'
    | (string & {})
  'font-family':
    | "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    | 'Arial, Helvetica, sans-serif'
    | "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
    | "'Courier New', Courier, monospace"
    | 'cursive'
    | 'fantasy'
    | "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
    | "Georgia, 'Times New Roman', Times, serif"
    | "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
    | "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
    | "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"
    | 'monospace'
    | 'sans-serif'
    | "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    | 'serif'
    | "'Times New Roman', Times, serif"
    | "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
    | 'Verdana, Geneva, Tahoma, sans-serif'
    | (string & {})
  'font-feature-settings':
    | 'aalt'
    | 'abvf'
    | 'abvm'
    | 'abvs'
    | 'afrc'
    | 'akhn'
    | 'blwf'
    | 'blwm'
    | 'blws'
    | 'calt'
    | 'case'
    | 'ccmp'
    | 'cfar'
    | 'cjct'
    | 'clig'
    | 'cpct'
    | 'cpsp'
    | 'cswh'
    | 'curs'
    | 'c2pc'
    | 'c2sc'
    | 'dist'
    | 'dlig'
    | 'dnom'
    | 'dtls'
    | 'expt'
    | 'falt'
    | 'fin2'
    | 'fin3'
    | 'fina'
    | 'flac'
    | 'frac'
    | 'fwid'
    | 'half'
    | 'haln'
    | 'halt'
    | 'hist'
    | 'hkna'
    | 'hlig'
    | 'hngl'
    | 'hojo'
    | 'hwid'
    | 'init'
    | 'isol'
    | 'ital'
    | 'jalt'
    | 'jp78'
    | 'jp83'
    | 'jp90'
    | 'jp04'
    | 'kern'
    | 'lfbd'
    | 'liga'
    | 'ljmo'
    | 'lnum'
    | 'locl'
    | 'ltra'
    | 'ltrm'
    | 'mark'
    | 'med2'
    | 'medi'
    | 'mgrk'
    | 'mkmk'
    | 'nalt'
    | 'nlck'
    | 'nukt'
    | 'numr'
    | 'onum'
    | 'opbd'
    | 'ordn'
    | 'ornm'
    | 'palt'
    | 'pcap'
    | 'pkna'
    | 'pnum'
    | 'pref'
    | 'pres'
    | 'pstf'
    | 'psts'
    | 'pwid'
    | 'qwid'
    | 'rand'
    | 'rclt'
    | 'rlig'
    | 'rkrf'
    | 'rphf'
    | 'rtbd'
    | 'rtla'
    | 'rtlm'
    | 'ruby'
    | 'salt'
    | 'sinf'
    | 'size'
    | 'smcp'
    | 'smpl'
    | 'ssty'
    | 'stch'
    | 'subs'
    | 'sups'
    | 'swsh'
    | 'titl'
    | 'tjmo'
    | 'tnam'
    | 'tnum'
    | 'trad'
    | 'twid'
    | 'unic'
    | 'valt'
    | 'vatu'
    | 'vert'
    | 'vhal'
    | 'vjmo'
    | 'vkna'
    | 'vkrn'
    | 'vpal'
    | 'vrt2'
    | 'zero'
    | 'normal'
    | 'off'
    | 'on'
    | (string & {})
  'font-kerning': 'auto' | 'none' | 'normal' | (string & {})
  'font-language-override': 'normal' | (string & {})
  'font-size':
    | 'large'
    | 'larger'
    | 'medium'
    | 'small'
    | 'smaller'
    | 'x-large'
    | 'x-small'
    | 'xx-large'
    | 'xx-small'
    | (string & {})
  'font-size-adjust': number
  'font-stretch':
    | 'condensed'
    | 'expanded'
    | 'extra-condensed'
    | 'extra-expanded'
    | 'narrower'
    | 'normal'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'ultra-condensed'
    | 'ultra-expanded'
    | 'wider'
    | (string & {})
  'font-style': 'italic' | 'normal' | 'oblique' | (string & {})
  'font-synthesis': 'none' | 'style' | 'weight' | (string & {})
  'font-variant': 'normal' | 'small-caps' | (string & {})
  'font-variant-alternates':
    | 'annotation()'
    | 'character-variant()'
    | 'historical-forms'
    | 'normal'
    | 'ornaments()'
    | 'styleset()'
    | 'stylistic()'
    | 'swash()'
    | (string & {})
  'font-variant-caps':
    | 'all-petite-caps'
    | 'all-small-caps'
    | 'normal'
    | 'petite-caps'
    | 'small-caps'
    | 'titling-caps'
    | 'unicase'
    | (string & {})
  'font-variant-east-asian':
    | 'full-width'
    | 'jis04'
    | 'jis78'
    | 'jis83'
    | 'jis90'
    | 'normal'
    | 'proportional-width'
    | 'ruby'
    | 'simplified'
    | 'traditional'
    | (string & {})
  'font-variant-ligatures':
    | 'additional-ligatures'
    | 'common-ligatures'
    | 'contextual'
    | 'discretionary-ligatures'
    | 'historical-ligatures'
    | 'no-additional-ligatures'
    | 'no-common-ligatures'
    | 'no-contextual'
    | 'no-discretionary-ligatures'
    | 'no-historical-ligatures'
    | 'none'
    | 'normal'
    | (string & {})
  'font-variant-numeric':
    | 'diagonal-fractions'
    | 'lining-nums'
    | 'normal'
    | 'oldstyle-nums'
    | 'ordinal'
    | 'proportional-nums'
    | 'slashed-zero'
    | 'stacked-fractions'
    | 'tabular-nums'
    | (string & {})
  'font-variant-position': 'normal' | 'sub' | 'super' | (string & {})
  'font-weight':
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | 'normal'
    | (string & {})
  'glyph-orientation-horizontal': string
  'glyph-orientation-vertical': 'auto' | (string & {})
  'grid-area': 'auto' | 'span' | (string & {})
  grid: string
  'grid-auto-columns':
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'minmax()'
    | (string & {})
  'grid-auto-flow': 'row' | 'column' | 'dense' | (string & {})
  'grid-auto-rows':
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'minmax()'
    | (string & {})
  'grid-column': 'auto' | 'span' | (string & {})
  'grid-column-end': 'auto' | 'span' | (string & {})
  'grid-column-gap': string
  'grid-column-start': 'auto' | 'span' | (string & {})
  'grid-gap': string
  'grid-row': 'auto' | 'span' | (string & {})
  'grid-row-end': 'auto' | 'span' | (string & {})
  'grid-row-gap': string
  'grid-row-start': 'auto' | 'span' | (string & {})
  'grid-template':
    | 'none'
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'subgrid'
    | 'minmax()'
    | 'repeat()'
    | (string & {})
  'grid-template-areas': 'none' | (string & {})
  'grid-template-columns':
    | 'none'
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'subgrid'
    | 'minmax()'
    | 'repeat()'
    | (string & {})
  'grid-template-rows':
    | 'none'
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'subgrid'
    | 'minmax()'
    | 'repeat()'
    | (string & {})
  height:
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  hyphens: 'auto' | 'manual' | 'none' | (string & {})
  'image-orientation': 'flip' | 'from-image' | (string & {})
  'image-rendering':
    | 'auto'
    | 'crisp-edges'
    | '-moz-crisp-edges'
    | 'optimizeQuality'
    | 'optimizeSpeed'
    | 'pixelated'
    | (string & {})
  'ime-mode':
    | 'active'
    | 'auto'
    | 'disabled'
    | 'inactive'
    | 'normal'
    | (string & {})
  'inline-size': 'auto' | (string & {})
  isolation: 'auto' | 'isolate' | (string & {})
  'justify-content':
    | 'center'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'safe'
    | 'unsafe'
    | 'stretch'
    | 'space-evenly'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | (string & {})
  kerning: 'auto' | (string & {})
  left: 'auto' | (string & {})
  'letter-spacing': 'normal' | (string & {})
  'lighting-color': string
  'line-break':
    | 'auto'
    | 'loose'
    | 'normal'
    | 'strict'
    | 'anywhere'
    | (string & {})
  'line-height': 'normal' | (string & {})
  'list-style':
    | 'armenian'
    | 'circle'
    | 'decimal'
    | 'decimal-leading-zero'
    | 'disc'
    | 'georgian'
    | 'hanging'
    | 'inside'
    | 'lower-alpha'
    | 'lower-greek'
    | 'lower-latin'
    | 'lower-roman'
    | 'none'
    | 'outside'
    | 'square'
    | 'symbols()'
    | 'upper-alpha'
    | 'upper-latin'
    | 'upper-roman'
    | 'url()'
    | (string & {})
  'list-style-image': 'none' | (string & {})
  'list-style-position': 'inside' | 'outside' | (string & {})
  'list-style-type':
    | 'arabic-indic'
    | 'armenian'
    | 'bengali'
    | 'cambodian'
    | 'circle'
    | 'cjk-decimal'
    | 'cjk-earthly-branch'
    | 'cjk-heavenly-stem'
    | 'decimal'
    | 'decimal-leading-zero'
    | 'devanagari'
    | 'disc'
    | 'disclosure-closed'
    | 'disclosure-open'
    | 'georgian'
    | 'gujarati'
    | 'gurmukhi'
    | 'hebrew'
    | 'hiragana'
    | 'hiragana-iroha'
    | 'kannada'
    | 'katakana'
    | 'katakana-iroha'
    | 'khmer'
    | 'lao'
    | 'lower-alpha'
    | 'lower-armenian'
    | 'lower-greek'
    | 'lower-latin'
    | 'lower-roman'
    | 'malayalam'
    | 'mongolian'
    | 'myanmar'
    | 'none'
    | 'oriya'
    | 'persian'
    | 'square'
    | 'tamil'
    | 'telugu'
    | 'thai'
    | 'tibetan'
    | 'symbols()'
    | 'upper-alpha'
    | 'upper-armenian'
    | 'upper-latin'
    | 'upper-roman'
    | (string & {})
  margin: 'auto' | 'logical' | (string & {})
  'margin-block-end': 'auto' | (string & {})
  'margin-block-start': 'auto' | (string & {})
  'margin-bottom': 'auto' | (string & {})
  'margin-inline-end': 'auto' | (string & {})
  'margin-inline-start': 'auto' | (string & {})
  'margin-left': 'auto' | (string & {})
  'margin-right': 'auto' | (string & {})
  'margin-top': 'auto' | (string & {})
  marker: 'none' | 'child' | 'url()' | (string & {})
  'marker-end': 'none' | 'child' | 'url()' | (string & {})
  'marker-mid': 'none' | 'child' | 'url()' | (string & {})
  'marker-start': 'none' | 'child' | 'url()' | (string & {})
  'mask-image': 'none' | 'url()' | (string & {})
  'mask-mode': 'alpha' | 'auto' | 'luminance' | (string & {})
  'mask-origin': string
  'mask-position': string
  'mask-repeat': string
  'mask-size': 'auto' | 'contain' | 'cover' | (string & {})
  'mask-type': 'alpha' | 'luminance' | (string & {})
  'max-block-size': 'none' | (string & {})
  'max-height':
    | 'none'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  'max-inline-size': 'none' | (string & {})
  'max-width':
    | 'none'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  'min-block-size': string
  'min-height':
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  'min-inline-size': string
  'min-width':
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  'mix-blend-mode':
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity'
    | (string & {})
  motion: 'none' | 'path()' | 'url()' | 'auto' | 'reverse' | (string & {})
  'motion-offset': string
  'motion-path': 'none' | 'path()' | 'url()' | (string & {})
  'motion-rotation': 'auto' | 'reverse' | (string & {})
  '-moz-animation':
    | 'alternate'
    | 'alternate-reverse'
    | 'backwards'
    | 'both'
    | 'forwards'
    | 'infinite'
    | 'none'
    | 'normal'
    | 'reverse'
    | (string & {})
  '-moz-animation-delay': string
  '-moz-animation-direction':
    | 'alternate'
    | 'alternate-reverse'
    | 'normal'
    | 'reverse'
    | (string & {})
  '-moz-animation-duration': string
  '-moz-animation-iteration-count': 'infinite' | (string & {})
  '-moz-animation-name': 'none' | (string & {})
  '-moz-animation-play-state': 'paused' | 'running' | (string & {})
  '-moz-animation-timing-function': string
  '-moz-appearance':
    | 'button'
    | 'button-arrow-down'
    | 'button-arrow-next'
    | 'button-arrow-previous'
    | 'button-arrow-up'
    | 'button-bevel'
    | 'checkbox'
    | 'checkbox-container'
    | 'checkbox-label'
    | 'dialog'
    | 'groupbox'
    | 'listbox'
    | 'menuarrow'
    | 'menuimage'
    | 'menuitem'
    | 'menuitemtext'
    | 'menulist'
    | 'menulist-button'
    | 'menulist-text'
    | 'menulist-textfield'
    | 'menupopup'
    | 'menuradio'
    | 'menuseparator'
    | '-moz-mac-unified-toolbar'
    | '-moz-win-borderless-glass'
    | '-moz-win-browsertabbar-toolbox'
    | '-moz-win-communications-toolbox'
    | '-moz-win-glass'
    | '-moz-win-media-toolbox'
    | 'none'
    | 'progressbar'
    | 'progresschunk'
    | 'radio'
    | 'radio-container'
    | 'radio-label'
    | 'radiomenuitem'
    | 'resizer'
    | 'resizerpanel'
    | 'scrollbarbutton-down'
    | 'scrollbarbutton-left'
    | 'scrollbarbutton-right'
    | 'scrollbarbutton-up'
    | 'scrollbar-small'
    | 'scrollbartrack-horizontal'
    | 'scrollbartrack-vertical'
    | 'separator'
    | 'spinner'
    | 'spinner-downbutton'
    | 'spinner-textfield'
    | 'spinner-upbutton'
    | 'statusbar'
    | 'statusbarpanel'
    | 'tab'
    | 'tabpanels'
    | 'tab-scroll-arrow-back'
    | 'tab-scroll-arrow-forward'
    | 'textfield'
    | 'textfield-multiline'
    | 'toolbar'
    | 'toolbox'
    | 'tooltip'
    | 'treeheadercell'
    | 'treeheadersortarrow'
    | 'treeitem'
    | 'treetwistyopen'
    | 'treeview'
    | 'treewisty'
    | 'window'
    | (string & {})
  '-moz-backface-visibility': 'hidden' | 'visible' | (string & {})
  '-moz-background-clip': 'padding' | (string & {})
  '-moz-background-inline-policy':
    | 'bounding-box'
    | 'continuous'
    | 'each-box'
    | (string & {})
  '-moz-background-origin': string
  '-moz-border-bottom-colors': string
  '-moz-border-image':
    | 'auto'
    | 'fill'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | 'url()'
    | (string & {})
  '-moz-border-left-colors': string
  '-moz-border-right-colors': string
  '-moz-border-top-colors': string
  '-moz-box-align':
    | 'baseline'
    | 'center'
    | 'end'
    | 'start'
    | 'stretch'
    | (string & {})
  '-moz-box-direction': 'normal' | 'reverse' | (string & {})
  '-moz-box-flex': number
  '-moz-box-flexgroup': number
  '-moz-box-ordinal-group': number
  '-moz-box-orient':
    | 'block-axis'
    | 'horizontal'
    | 'inline-axis'
    | 'vertical'
    | (string & {})
  '-moz-box-pack': 'center' | 'end' | 'justify' | 'start' | (string & {})
  '-moz-box-sizing':
    | 'border-box'
    | 'content-box'
    | 'padding-box'
    | (string & {})
  '-moz-column-count': number
  '-moz-column-gap': 'normal' | (string & {})
  '-moz-column-rule': string
  '-moz-column-rule-color': string
  '-moz-column-rule-style': string
  '-moz-column-rule-width': string
  '-moz-columns': 'auto' | (string & {})
  '-moz-column-width': 'auto' | (string & {})
  '-moz-font-feature-settings':
    | 'c2cs'
    | 'dlig'
    | 'kern'
    | 'liga'
    | 'lnum'
    | 'onum'
    | 'smcp'
    | 'swsh'
    | 'tnum'
    | 'normal'
    | 'off'
    | 'on'
    | (string & {})
  '-moz-hyphens': 'auto' | 'manual' | 'none' | (string & {})
  '-moz-perspective': 'none' | (string & {})
  '-moz-perspective-origin': string
  '-moz-text-align-last':
    | 'auto'
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'right'
    | 'start'
    | (string & {})
  '-moz-text-decoration-color': string
  '-moz-text-decoration-line':
    | 'line-through'
    | 'none'
    | 'overline'
    | 'underline'
    | (string & {})
  '-moz-text-decoration-style':
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'none'
    | 'solid'
    | 'wavy'
    | (string & {})
  '-moz-text-size-adjust': 'auto' | 'none' | (string & {})
  '-moz-transform':
    | 'matrix()'
    | 'matrix3d()'
    | 'none'
    | 'perspective'
    | 'rotate()'
    | 'rotate3d()'
    | "rotateX('angle')"
    | "rotateY('angle')"
    | "rotateZ('angle')"
    | 'scale()'
    | 'scale3d()'
    | 'scaleX()'
    | 'scaleY()'
    | 'scaleZ()'
    | 'skew()'
    | 'skewX()'
    | 'skewY()'
    | 'translate()'
    | 'translate3d()'
    | 'translateX()'
    | 'translateY()'
    | 'translateZ()'
    | (string & {})
  '-moz-transform-origin': string
  '-moz-transition': 'all' | 'none' | (string & {})
  '-moz-transition-delay': string
  '-moz-transition-duration': string
  '-moz-transition-property': 'all' | 'none' | (string & {})
  '-moz-transition-timing-function': string
  '-moz-user-focus': 'ignore' | 'normal' | (string & {})
  '-moz-user-select':
    | 'all'
    | 'element'
    | 'elements'
    | '-moz-all'
    | '-moz-none'
    | 'none'
    | 'text'
    | 'toggle'
    | (string & {})
  negative: string
  'object-fit':
    | 'contain'
    | 'cover'
    | 'fill'
    | 'none'
    | 'scale-down'
    | (string & {})
  'object-position': string
  opacity: number
  order: number
  orphans: number
  'offset-block-end': 'auto' | (string & {})
  'offset-block-start': 'auto' | (string & {})
  'offset-inline-end': 'auto' | (string & {})
  'offset-inline-start': 'auto' | (string & {})
  outline: 'auto' | 'invert' | (string & {})
  'outline-color': 'invert' | (string & {})
  'outline-offset': string
  'outline-style': 'auto' | (string & {})
  'outline-width': string
  overflow:
    | 'auto'
    | 'clip'
    | 'hidden'
    | '-moz-hidden-unscrollable'
    | 'scroll'
    | 'visible'
    | (string & {})
  'overflow-wrap': 'break-word' | 'normal' | 'anywhere' | (string & {})
  'overflow-x':
    | 'auto'
    | 'clip'
    | 'hidden'
    | 'scroll'
    | 'visible'
    | (string & {})
  'overflow-y':
    | 'auto'
    | 'clip'
    | 'hidden'
    | 'scroll'
    | 'visible'
    | (string & {})
  pad: string
  padding: 'logical' | (string & {})
  'padding-bottom': string
  'padding-block-end': string
  'padding-block-start': string
  'padding-inline-end': string
  'padding-inline-start': string
  'padding-left': string
  'padding-right': string
  'padding-top': string
  'page-break-after':
    | 'always'
    | 'auto'
    | 'avoid'
    | 'left'
    | 'recto'
    | 'right'
    | 'verso'
    | (string & {})
  'page-break-before':
    | 'always'
    | 'auto'
    | 'avoid'
    | 'left'
    | 'right'
    | (string & {})
  'page-break-inside': 'auto' | 'avoid' | (string & {})
  'paint-order': 'fill' | 'markers' | 'normal' | 'stroke' | (string & {})
  perspective: 'none' | (string & {})
  'perspective-origin': string
  'pointer-events':
    | 'all'
    | 'fill'
    | 'none'
    | 'painted'
    | 'stroke'
    | 'visible'
    | 'visibleFill'
    | 'visiblePainted'
    | 'visibleStroke'
    | (string & {})
  position:
    | 'absolute'
    | 'center'
    | 'fixed'
    | '-ms-page'
    | 'page'
    | 'relative'
    | 'static'
    | 'sticky'
    | '-webkit-sticky'
    | (string & {})
  prefix: string
  quotes: 'none' | (string & {})
  range: 'auto' | 'infinite' | (string & {})
  resize:
    | 'both'
    | 'block'
    | 'horizontal'
    | 'inline'
    | 'none'
    | 'vertical'
    | (string & {})
  right: 'auto' | (string & {})
  'ruby-align':
    | 'auto'
    | 'center'
    | 'distribute-letter'
    | 'distribute-space'
    | 'left'
    | 'line-edge'
    | 'right'
    | 'start'
    | 'space-between'
    | 'space-around'
    | (string & {})
  'ruby-overhang': 'auto' | 'end' | 'none' | 'start' | (string & {})
  'ruby-position': 'after' | 'before' | 'inline' | 'right' | (string & {})
  'ruby-span': 'attr(x)' | 'none' | (string & {})
  'scroll-behavior': 'auto' | 'smooth' | (string & {})
  'scroll-snap-coordinate': 'none' | 'border-box' | 'margin-box' | (string & {})
  'scroll-snap-destination': string
  'scroll-snap-points-x': 'none' | 'repeat()' | (string & {})
  'scroll-snap-points-y': 'none' | 'repeat()' | (string & {})
  'scroll-snap-type': 'none' | 'mandatory' | 'proximity' | (string & {})
  'shape-image-threshold': number
  'shape-margin': string
  'shape-outside': 'margin-box' | 'none' | (string & {})
  size: string
  src: 'url()' | 'format()' | 'local()' | (string & {})
  'stop-color': string
  'stop-opacity': number
  stroke:
    | 'child'
    | 'child()'
    | 'context-fill'
    | 'context-stroke'
    | 'url()'
    | 'none'
    | (string & {})
  'stroke-dasharray': 'none' | (string & {})
  'stroke-dashoffset': string
  'stroke-linecap': 'butt' | 'round' | 'square' | (string & {})
  'stroke-linejoin':
    | 'arcs'
    | 'bevel'
    | 'miter'
    | 'miter-clip'
    | 'round'
    | (string & {})
  'stroke-miterlimit': number
  'stroke-opacity': number
  'stroke-width': string
  suffix: string
  system:
    | 'additive'
    | 'alphabetic'
    | 'cyclic'
    | 'extends'
    | 'fixed'
    | 'numeric'
    | 'symbolic'
    | (string & {})
  symbols: string
  'table-layout': 'auto' | 'fixed' | (string & {})
  'tab-size': string
  'text-align':
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'match-parent'
    | 'right'
    | 'start'
    | (string & {})
  'text-align-last':
    | 'auto'
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'right'
    | 'start'
    | (string & {})
  'text-anchor': 'end' | 'middle' | 'start' | (string & {})
  'text-decoration':
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'line-through'
    | 'none'
    | 'overline'
    | 'solid'
    | 'underline'
    | 'wavy'
    | (string & {})
  'text-decoration-color': string
  'text-decoration-line':
    | 'line-through'
    | 'none'
    | 'overline'
    | 'underline'
    | (string & {})
  'text-decoration-style':
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'none'
    | 'solid'
    | 'wavy'
    | (string & {})
  'text-indent': 'each-line' | 'hanging' | (string & {})
  'text-orientation':
    | 'mixed'
    | 'sideways'
    | 'sideways-left'
    | 'sideways-right'
    | 'upright'
    | 'use-glyph-orientation'
    | (string & {})
  'text-overflow': 'clip' | 'ellipsis' | (string & {})
  'text-rendering':
    | 'auto'
    | 'geometricPrecision'
    | 'optimizeLegibility'
    | 'optimizeSpeed'
    | (string & {})
  'text-shadow': 'none' | (string & {})
  'text-transform':
    | 'capitalize'
    | 'full-width'
    | 'lowercase'
    | 'none'
    | 'uppercase'
    | (string & {})
  top: 'auto' | (string & {})
  'touch-action':
    | 'auto'
    | 'cross-slide-x'
    | 'cross-slide-y'
    | 'double-tap-zoom'
    | 'manipulation'
    | 'none'
    | 'pan-x'
    | 'pan-y'
    | 'pinch-zoom'
    | (string & {})
  transform:
    | 'matrix()'
    | 'matrix3d()'
    | 'none'
    | 'perspective()'
    | 'rotate()'
    | 'rotate3d()'
    | "rotateX('angle')"
    | "rotateY('angle')"
    | "rotateZ('angle')"
    | 'scale()'
    | 'scale3d()'
    | 'scaleX()'
    | 'scaleY()'
    | 'scaleZ()'
    | 'skew()'
    | 'skewX()'
    | 'skewY()'
    | 'translate()'
    | 'translate3d()'
    | 'translateX()'
    | 'translateY()'
    | 'translateZ()'
    | (string & {})
  'transform-origin': string
  'transform-style': 'flat' | 'preserve-3d' | (string & {})
  transition: 'all' | 'none' | (string & {})
  'transition-delay': string
  'transition-duration': string
  'transition-property': 'all' | 'none' | (string & {})
  'transition-timing-function': string
  'unicode-bidi':
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'normal'
    | 'plaintext'
    | (string & {})
  'unicode-range':
    | 'U+26'
    | 'U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00-FB4F'
    | 'U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF'
    | 'U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD'
    | 'U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD'
    | 'U+00-7F'
    | 'U+80-FF'
    | 'U+100-17F'
    | 'U+180-24F'
    | 'U+1E00-1EFF'
    | 'U+250-2AF'
    | 'U+370-3FF'
    | 'U+1F00-1FFF'
    | 'U+400-4FF'
    | 'U+500-52F'
    | 'U+00-52F, U+1E00-1FFF, U+2200-22FF'
    | 'U+530-58F'
    | 'U+590-5FF'
    | 'U+600-6FF'
    | 'U+750-77F'
    | 'U+8A0-8FF'
    | 'U+700-74F'
    | 'U+900-97F'
    | 'U+980-9FF'
    | 'U+A00-A7F'
    | 'U+A80-AFF'
    | 'U+B00-B7F'
    | 'U+B80-BFF'
    | 'U+C00-C7F'
    | 'U+C80-CFF'
    | 'U+D00-D7F'
    | 'U+D80-DFF'
    | 'U+118A0-118FF'
    | 'U+E00-E7F'
    | 'U+1A20-1AAF'
    | 'U+AA80-AADF'
    | 'U+E80-EFF'
    | 'U+F00-FFF'
    | 'U+1000-109F'
    | 'U+10A0-10FF'
    | 'U+1200-137F'
    | 'U+1380-139F'
    | 'U+2D80-2DDF'
    | 'U+AB00-AB2F'
    | 'U+1780-17FF'
    | 'U+1800-18AF'
    | 'U+1B80-1BBF'
    | 'U+1CC0-1CCF'
    | 'U+4E00-9FD5'
    | 'U+3400-4DB5'
    | 'U+2F00-2FDF'
    | 'U+2E80-2EFF'
    | 'U+1100-11FF'
    | 'U+AC00-D7AF'
    | 'U+3040-309F'
    | 'U+30A0-30FF'
    | 'U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F'
    | 'U+A4D0-A4FF'
    | 'U+A000-A48F'
    | 'U+A490-A4CF'
    | 'U+2000-206F'
    | 'U+3000-303F'
    | 'U+2070-209F'
    | 'U+20A0-20CF'
    | 'U+2100-214F'
    | 'U+2150-218F'
    | 'U+2190-21FF'
    | 'U+2200-22FF'
    | 'U+2300-23FF'
    | 'U+E000-F8FF'
    | 'U+FB00-FB4F'
    | 'U+FB50-FDFF'
    | 'U+1F600-1F64F'
    | 'U+2600-26FF'
    | 'U+1F300-1F5FF'
    | 'U+1F900-1F9FF'
    | 'U+1F680-1F6FF'
    | (string & {})
  'user-select': 'all' | 'auto' | 'contain' | 'none' | 'text' | (string & {})
  'vertical-align':
    | 'alphabetic'
    | 'auto'
    | 'baseline'
    | 'bottom'
    | 'center'
    | 'central'
    | 'mathematical'
    | 'middle'
    | 'sub'
    | 'super'
    | 'text-bottom'
    | 'text-top'
    | 'top'
    | '-webkit-baseline-middle'
    | (string & {})
  visibility: 'collapse' | 'hidden' | 'visible' | (string & {})
  '-webkit-animation':
    | 'alternate'
    | 'alternate-reverse'
    | 'backwards'
    | 'both'
    | 'forwards'
    | 'infinite'
    | 'none'
    | 'normal'
    | 'reverse'
    | (string & {})
  '-webkit-animation-delay': string
  '-webkit-animation-direction':
    | 'alternate'
    | 'alternate-reverse'
    | 'normal'
    | 'reverse'
    | (string & {})
  '-webkit-animation-duration': string
  '-webkit-animation-fill-mode':
    | 'backwards'
    | 'both'
    | 'forwards'
    | 'none'
    | (string & {})
  '-webkit-animation-iteration-count': 'infinite' | (string & {})
  '-webkit-animation-name': 'none' | (string & {})
  '-webkit-animation-play-state': 'paused' | 'running' | (string & {})
  '-webkit-animation-timing-function': string
  '-webkit-appearance':
    | 'button'
    | 'button-bevel'
    | 'caps-lock-indicator'
    | 'caret'
    | 'checkbox'
    | 'default-button'
    | 'listbox'
    | 'listitem'
    | 'media-fullscreen-button'
    | 'media-mute-button'
    | 'media-play-button'
    | 'media-seek-back-button'
    | 'media-seek-forward-button'
    | 'media-slider'
    | 'media-sliderthumb'
    | 'menulist'
    | 'menulist-button'
    | 'menulist-text'
    | 'menulist-textfield'
    | 'none'
    | 'push-button'
    | 'radio'
    | 'scrollbarbutton-down'
    | 'scrollbarbutton-left'
    | 'scrollbarbutton-right'
    | 'scrollbarbutton-up'
    | 'scrollbargripper-horizontal'
    | 'scrollbargripper-vertical'
    | 'scrollbarthumb-horizontal'
    | 'scrollbarthumb-vertical'
    | 'scrollbartrack-horizontal'
    | 'scrollbartrack-vertical'
    | 'searchfield'
    | 'searchfield-cancel-button'
    | 'searchfield-decoration'
    | 'searchfield-results-button'
    | 'searchfield-results-decoration'
    | 'slider-horizontal'
    | 'sliderthumb-horizontal'
    | 'sliderthumb-vertical'
    | 'slider-vertical'
    | 'square-button'
    | 'textarea'
    | 'textfield'
    | (string & {})
  '-webkit-backdrop-filter':
    | 'none'
    | 'blur()'
    | 'brightness()'
    | 'contrast()'
    | 'drop-shadow()'
    | 'grayscale()'
    | 'hue-rotate()'
    | 'invert()'
    | 'opacity()'
    | 'saturate()'
    | 'sepia()'
    | 'url()'
    | (string & {})
  '-webkit-backface-visibility': 'hidden' | 'visible' | (string & {})
  '-webkit-background-clip': string
  '-webkit-background-composite': 'border' | 'padding' | (string & {})
  '-webkit-background-origin': string
  '-webkit-border-image':
    | 'auto'
    | 'fill'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | 'url()'
    | (string & {})
  '-webkit-box-align':
    | 'baseline'
    | 'center'
    | 'end'
    | 'start'
    | 'stretch'
    | (string & {})
  '-webkit-box-direction': 'normal' | 'reverse' | (string & {})
  '-webkit-box-flex': number
  '-webkit-box-flex-group': number
  '-webkit-box-ordinal-group': number
  '-webkit-box-orient':
    | 'block-axis'
    | 'horizontal'
    | 'inline-axis'
    | 'vertical'
    | (string & {})
  '-webkit-box-pack': 'center' | 'end' | 'justify' | 'start' | (string & {})
  '-webkit-box-reflect': 'above' | 'below' | 'left' | 'right' | (string & {})
  '-webkit-box-sizing': 'border-box' | 'content-box' | (string & {})
  '-webkit-break-after':
    | 'always'
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | 'column'
    | 'left'
    | 'page'
    | 'region'
    | 'right'
    | (string & {})
  '-webkit-break-before':
    | 'always'
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | 'column'
    | 'left'
    | 'page'
    | 'region'
    | 'right'
    | (string & {})
  '-webkit-break-inside':
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | (string & {})
  '-webkit-column-break-after':
    | 'always'
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | 'column'
    | 'left'
    | 'page'
    | 'region'
    | 'right'
    | (string & {})
  '-webkit-column-break-before':
    | 'always'
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | 'column'
    | 'left'
    | 'page'
    | 'region'
    | 'right'
    | (string & {})
  '-webkit-column-break-inside':
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | (string & {})
  '-webkit-column-count': number
  '-webkit-column-gap': 'normal' | (string & {})
  '-webkit-column-rule': string
  '-webkit-column-rule-color': string
  '-webkit-column-rule-style': string
  '-webkit-column-rule-width': string
  '-webkit-columns': 'auto' | (string & {})
  '-webkit-column-span': 'all' | 'none' | (string & {})
  '-webkit-column-width': 'auto' | (string & {})
  '-webkit-filter':
    | 'none'
    | 'blur()'
    | 'brightness()'
    | 'contrast()'
    | 'drop-shadow()'
    | 'grayscale()'
    | 'hue-rotate()'
    | 'invert()'
    | 'opacity()'
    | 'saturate()'
    | 'sepia()'
    | 'url()'
    | (string & {})
  '-webkit-flow-from': 'none' | (string & {})
  '-webkit-flow-into': 'none' | (string & {})
  '-webkit-font-feature-settings':
    | 'c2cs'
    | 'dlig'
    | 'kern'
    | 'liga'
    | 'lnum'
    | 'onum'
    | 'smcp'
    | 'swsh'
    | 'tnum'
    | 'normal'
    | 'off'
    | 'on'
    | (string & {})
  '-webkit-hyphens': 'auto' | 'manual' | 'none' | (string & {})
  '-webkit-line-break': 'after-white-space' | 'normal' | (string & {})
  '-webkit-margin-bottom-collapse':
    | 'collapse'
    | 'discard'
    | 'separate'
    | (string & {})
  '-webkit-margin-collapse': 'collapse' | 'discard' | 'separate' | (string & {})
  '-webkit-margin-start': 'auto' | (string & {})
  '-webkit-margin-top-collapse':
    | 'collapse'
    | 'discard'
    | 'separate'
    | (string & {})
  '-webkit-mask-clip': string
  '-webkit-mask-image': 'none' | 'url()' | (string & {})
  '-webkit-mask-origin': string
  '-webkit-mask-repeat': string
  '-webkit-mask-size': 'auto' | 'contain' | 'cover' | (string & {})
  '-webkit-nbsp-mode': 'normal' | 'space' | (string & {})
  '-webkit-overflow-scrolling': 'auto' | 'touch' | (string & {})
  '-webkit-padding-start': string
  '-webkit-perspective': 'none' | (string & {})
  '-webkit-perspective-origin': string
  '-webkit-region-fragment': 'auto' | 'break' | (string & {})
  '-webkit-tap-highlight-color': string
  '-webkit-text-fill-color': string
  '-webkit-text-size-adjust': 'auto' | 'none' | (string & {})
  '-webkit-text-stroke': string
  '-webkit-text-stroke-color': string
  '-webkit-text-stroke-width': string
  '-webkit-touch-callout': 'none' | (string & {})
  '-webkit-transform':
    | 'matrix()'
    | 'matrix3d()'
    | 'none'
    | 'perspective()'
    | 'rotate()'
    | 'rotate3d()'
    | "rotateX('angle')"
    | "rotateY('angle')"
    | "rotateZ('angle')"
    | 'scale()'
    | 'scale3d()'
    | 'scaleX()'
    | 'scaleY()'
    | 'scaleZ()'
    | 'skew()'
    | 'skewX()'
    | 'skewY()'
    | 'translate()'
    | 'translate3d()'
    | 'translateX()'
    | 'translateY()'
    | 'translateZ()'
    | (string & {})
  '-webkit-transform-origin': string
  '-webkit-transform-origin-x': string
  '-webkit-transform-origin-y': string
  '-webkit-transform-origin-z': string
  '-webkit-transform-style': 'flat' | 'preserve-3d' | (string & {})
  '-webkit-transition': 'all' | 'none' | (string & {})
  '-webkit-transition-delay': string
  '-webkit-transition-duration': string
  '-webkit-transition-property': 'all' | 'none' | (string & {})
  '-webkit-transition-timing-function': string
  '-webkit-user-drag': 'auto' | 'element' | 'none' | (string & {})
  '-webkit-user-modify':
    | 'read-only'
    | 'read-write'
    | 'read-write-plaintext-only'
    | (string & {})
  '-webkit-user-select': 'auto' | 'none' | 'text' | (string & {})
  widows: number
  width:
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  'will-change': 'auto' | 'contents' | 'scroll-position' | (string & {})
  'word-break': 'break-all' | 'keep-all' | 'normal' | (string & {})
  'word-spacing': 'normal' | (string & {})
  'word-wrap': 'break-word' | 'normal' | (string & {})
  'writing-mode':
    | 'horizontal-tb'
    | 'sideways-lr'
    | 'sideways-rl'
    | 'vertical-lr'
    | 'vertical-rl'
    | (string & {})
  'z-index': number
  zoom: 'normal' | (string & {})
} & Record<string, string | number>

export class Style extends BaseStyle<Style> {
  constructor(selector?: string) {
    super((s) => new Style(s), selector)
  }

  css(css: Partial<CSSProps>) {
    for (const [key, value] of Object.entries(css)) {
      this.props.set(key, value as string)
    }
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor. Needs to be specified if the counter system is 'additive'..
     * 
     * syntax:  `@counter-style { additive-symbols: 1 I; }`
     * 
     * restriction: integer, string, image, identifier
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-additive-symbols
     * 

     * @param value -
     */
  additiveSymbols(value: string) {
    this.props.set('additive-symbols', value)
    return this
  }

  /**
     * Aligns a flex container's lines within the flex container when there is extra space in the cross-axis, similar to how 'justify-content' aligns individual items within the main-axis..
     * 
     * syntax:  `p { align-content: flex-start; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#align-content
     * 
     * values:
     * ```md
     * center: Lines are packed toward the center of the flex container.

     * flex-end: Lines are packed toward the end of the flex container.

     * flex-start: Lines are packed toward the start of the flex container.

     * space-around: Lines are evenly distributed in the flex container, with half-size spaces on either end.

     * space-between: Lines are evenly distributed in the flex container.

     * stretch: Lines stretch to take up the remaining space.

     * start: undefined

     * end: undefined

     * normal: undefined

     * baseline: undefined

     * first baseline: undefined

     * last baseline: undefined

     * space-around: undefined

     * space-between: undefined

     * space-evenly: undefined

     * stretch: undefined

     * safe: undefined

     * unsafe: undefined
     * ```
     *
     * @param value -
     */
  alignContent(
    value:
      | 'center'
      | 'flex-end'
      | 'flex-start'
      | 'space-around'
      | 'space-between'
      | 'stretch'
      | 'start'
      | 'end'
      | 'normal'
      | 'baseline'
      | 'first baseline'
      | 'last baseline'
      | 'space-around'
      | 'space-between'
      | 'space-evenly'
      | 'stretch'
      | 'safe'
      | 'unsafe'
      | (string & {}),
  ) {
    this.props.set('align-content', value)
    return this
  }

  /**
     * Aligns flex items along the cross axis of the current line of the flex container..
     * 
     * syntax:  `p { align-items: flex-start; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#align-items
     * 
     * values:
     * ```md
     * baseline: If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.

     * center: The flex item's margin box is centered in the cross axis within the line.

     * flex-end: The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.

     * flex-start: The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.

     * stretch: If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.

     * normal: undefined

     * start: undefined

     * end: undefined

     * self-start: undefined

     * self-end: undefined

     * first baseline: undefined

     * last baseline: undefined

     * stretch: undefined

     * safe: undefined

     * unsafe: undefined
     * ```
     *
     * @param value -
     */
  alignItems(
    value:
      | 'baseline'
      | 'center'
      | 'flex-end'
      | 'flex-start'
      | 'stretch'
      | 'normal'
      | 'start'
      | 'end'
      | 'self-start'
      | 'self-end'
      | 'first baseline'
      | 'last baseline'
      | 'stretch'
      | 'safe'
      | 'unsafe'
      | (string & {}),
  ) {
    this.props.set('align-items', value)
    return this
  }

  /**
     * Defines the default justify-self for all items of the box, giving them the default way of justifying each box along the appropriate axis.
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: FF45
     * 
     * ref: https://www.w3.org/TR/css-grid-1/#row-align
     * 
     * values:
     * ```md
     * auto: undefined

     * normal: undefined

     * end: undefined

     * start: undefined

     * flex-end: "Flex items are packed toward the end of the line."

     * flex-start: "Flex items are packed toward the start of the line."

     * self-end: The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.

     * self-start: The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..

     * center: The items are packed flush to each other toward the center of the of the alignment container.

     * left: undefined

     * right: undefined

     * baseline: undefined

     * first baseline: undefined

     * last baseline: undefined

     * stretch: If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.

     * safe: undefined

     * unsafe: undefined

     * legacy: undefined
     * ```
     *
     * @param value -
     */
  justifyItems(
    value:
      | 'auto'
      | 'normal'
      | 'end'
      | 'start'
      | 'flex-end'
      | 'flex-start'
      | 'self-end'
      | 'self-start'
      | 'center'
      | 'left'
      | 'right'
      | 'baseline'
      | 'first baseline'
      | 'last baseline'
      | 'stretch'
      | 'safe'
      | 'unsafe'
      | 'legacy'
      | (string & {}),
  ) {
    this.props.set('justify-items', value)
    return this
  }

  /**
     * Defines the way of justifying a box inside its container along the appropriate axis..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: FF45
     * 
     * ref: https://www.w3.org/TR/css-grid-1/#row-align
     * 
     * values:
     * ```md
     * auto: undefined

     * normal: undefined

     * end: undefined

     * start: undefined

     * flex-end: "Flex items are packed toward the end of the line."

     * flex-start: "Flex items are packed toward the start of the line."

     * self-end: The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.

     * self-start: The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..

     * center: The items are packed flush to each other toward the center of the of the alignment container.

     * left: undefined

     * right: undefined

     * baseline: undefined

     * first baseline: undefined

     * last baseline: undefined

     * stretch: If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.

     * save: undefined

     * unsave: undefined
     * ```
     *
     * @param value -
     */
  justifySelf(
    value:
      | 'auto'
      | 'normal'
      | 'end'
      | 'start'
      | 'flex-end'
      | 'flex-start'
      | 'self-end'
      | 'self-start'
      | 'center'
      | 'left'
      | 'right'
      | 'baseline'
      | 'first baseline'
      | 'last baseline'
      | 'stretch'
      | 'save'
      | 'unsave'
      | (string & {}),
  ) {
    this.props.set('justify-self', value)
    return this
  }

  /**
     * Allows the default alignment along the cross axis to be overridden for individual flex items..
     * 
     * syntax:  `p { align-self: flex-start; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#align-items
     * 
     * values:
     * ```md
     * auto: Computes to the value of 'align-items' on the element's parent, or 'stretch' if the element has no parent. On absolutely positioned elements, it computes to itself.

     * normal: undefined

     * self-end: undefined

     * self-start: undefined

     * baseline: If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.

     * center: The flex item's margin box is centered in the cross axis within the line.

     * flex-end: The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.

     * flex-start: The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.

     * stretch: If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.

     * baseline: undefined

     * first baseline: undefined

     * last baseline: undefined

     * safe: undefined

     * unsafe: undefined
     * ```
     *
     * @param value -
     */
  alignSelf(
    value:
      | 'auto'
      | 'normal'
      | 'self-end'
      | 'self-start'
      | 'baseline'
      | 'center'
      | 'flex-end'
      | 'flex-start'
      | 'stretch'
      | 'baseline'
      | 'first baseline'
      | 'last baseline'
      | 'safe'
      | 'unsafe'
      | (string & {}),
  ) {
    this.props.set('align-self', value)
    return this
  }

  /**
     * Shorthand that resets all properties except 'direction' and 'unicode-bidi'..
     * 
     * syntax:  `* { all: unset; }`
     * 
     * restriction: enum
     * 
     * browsers: C37,FF27,O24
     * 
     * ref: http://www.w3.org/TR/css-cascade-3/#all-shorthand
     * 

     * @param value -
     */
  all(value: 'revert' | (string & {})) {
    this.props.set('all', value)
    return this
  }

  /**
     * Provides alternative text for assistive technology to replace the generated content of a ::before or ::after element..
     * 
     * syntax:  `label::before { alt: 'alt text'; }`
     * 
     * restriction: string, enum
     * 
     * browsers: S9
     * 
     * ref: https://drafts.csswg.org/css-content-3/#propdef-alt
     * 

     * @param value -
     */
  alt(value: 'none' | (string & {})) {
    this.props.set('alt', value)
    return this
  }

  /**
     * Shorthand property combines six of the animation properties into a single property..
     * 
     * syntax:  `div { animation: movearound 4s ease 3 normal; }`
     * 
     * restriction: time, timing-function, enum, identifier, number
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation
     * 
     * values:
     * ```md
     * alternate: The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.

     * alternate-reverse: The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.

     * backwards: The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.

     * both: Both forwards and backwards fill modes are applied.

     * forwards: The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.

     * infinite: Causes the animation to repeat forever.

     * none: No animation is performed

     * normal: Normal playback.

     * reverse: All iterations of the animation are played in the reverse direction from the way they were specified.
     * ```
     *
     * @param value -
     */
  animation(
    value:
      | 'alternate'
      | 'alternate-reverse'
      | 'backwards'
      | 'both'
      | 'forwards'
      | 'infinite'
      | 'none'
      | 'normal'
      | 'reverse'
      | (string & {}),
  ) {
    this.props.set('animation', value)
    return this
  }

  /**
     * Defines when the animation will start..
     * 
     * syntax:  `div { animation-delay: 4s; }`
     * 
     * restriction: time
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-delay
     * 

     * @param value -
     */
  animationDelay(value: string) {
    this.props.set('animation-delay', value)
    return this
  }

  /**
     * Defines whether or not the animation should play in reverse on alternate cycles..
     * 
     * syntax:  `div { animation-direction: normal; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-direction
     * 
     * values:
     * ```md
     * alternate: The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.

     * alternate-reverse: The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.

     * normal: Normal playback.

     * reverse: All iterations of the animation are played in the reverse direction from the way they were specified.
     * ```
     *
     * @param value -
     */
  animationDirection(
    value:
      | 'alternate'
      | 'alternate-reverse'
      | 'normal'
      | 'reverse'
      | (string & {}),
  ) {
    this.props.set('animation-direction', value)
    return this
  }

  /**
     * Defines the length of time that an animation takes to complete one cycle..
     * 
     * syntax:  `div { animation-duration: 4s; }`
     * 
     * restriction: time
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-duration
     * 

     * @param value -
     */
  animationDuration(value: string) {
    this.props.set('animation-duration', value)
    return this
  }

  /**
     * Defines what values are applied by the animation outside the time it is executing..
     * 
     * syntax:  `div { animation-fill-mode: forwards; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-fill-mode-property
     * 
     * values:
     * ```md
     * backwards: The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.

     * both: Both forwards and backwards fill modes are applied.

     * forwards: The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.

     * none: There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.
     * ```
     *
     * @param value -
     */
  animationFillMode(
    value: 'backwards' | 'both' | 'forwards' | 'none' | (string & {}),
  ) {
    this.props.set('animation-fill-mode', value)
    return this
  }

  /**
     * Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once..
     * 
     * syntax:  `div { animation-iteration-count: 3; }`
     * 
     * restriction: number, enum
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-iteration-count
     * 

     * @param value -
     */
  animationIterationCount(value: 'infinite' | (string & {})) {
    this.props.set('animation-iteration-count', value)
    return this
  }

  /**
     * Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation..
     * 
     * syntax:  `div { animation-name: movearound; }`
     * 
     * restriction: identifier, enum
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#the-animation-name-property-
     * 

     * @param value -
     */
  animationName(value: 'none' | (string & {})) {
    this.props.set('animation-name', value)
    return this
  }

  /**
     * Defines whether the animation is running or paused..
     * 
     * syntax:  `div { animation-play-state: running; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-play-state
     * 
     * values:
     * ```md
     * paused: A running animation will be paused.

     * running: Resume playback of a paused animation.
     * ```
     *
     * @param value -
     */
  animationPlayState(value: 'paused' | 'running' | (string & {})) {
    this.props.set('animation-play-state', value)
    return this
  }

  /**
     * Describes how the animation will progress over one cycle of its duration..
     * 
     * syntax:  `div { animation-timing-function: ease; }`
     * 
     * restriction: timing-function
     * 
     * browsers: E,C43,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-timing-function
     * 

     * @param value -
     */
  animationTimingFunction(value: string) {
    this.props.set('animation-timing-function', value)
    return this
  }

  /**
     * Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer..
     * 
     * syntax:  `div { backface-visibility: hidden; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C36,FF16,IE10,O23
     * 
     * ref: http://www.w3.org/TR/css3-transforms/#backface-visibility-property
     * 
     * values:
     * ```md
     * hidden: Back side is hidden.

     * visible: Back side is visible.
     * ```
     *
     * @param value -
     */
  backfaceVisibility(value: 'hidden' | 'visible' | (string & {})) {
    this.props.set('backface-visibility', value)
    return this
  }

  /**
     * Shorthand property for setting most background properties at the same place in the style sheet..
     * 
     * syntax:  `section { background: url(image.png) no-repeat #999; }`
     * 
     * restriction: enum, image, color, position, length, repeat, percentage, box
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#background
     * 
     * values:
     * ```md
     * fixed: The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page.

     * local: The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents.

     * none: A value of 'none' counts as an image layer but draws nothing.

     * scroll: The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)
     * ```
     *
     * @param value -
     */
  background(value: 'fixed' | 'local' | 'none' | 'scroll' | (string & {})) {
    this.props.set('background', value)
    return this
  }

  /**
     * Specifies whether the background images are fixed with regard to the viewport ('fixed') or scroll along with the element ('scroll') or its contents ('local')..
     * 
     * syntax:  `.box { background-attachment: fixed; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-attachment
     * 
     * values:
     * ```md
     * fixed: The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page.

     * local: The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents.

     * scroll: The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)
     * ```
     *
     * @param value -
     */
  backgroundAttachment(value: 'fixed' | 'local' | 'scroll' | (string & {})) {
    this.props.set('background-attachment', value)
    return this
  }

  /**
     * Defines the blending mode of each background layer..
     * 
     * syntax:  `div { background-blend-mode: saturation; }`
     * 
     * restriction: enum
     * 
     * browsers: C35,FF30,O22,S7.1
     * 
     * ref: http://www.w3.org/TR/compositing-1/#propdef-background-blend-mode
     * 
     * values:
     * ```md
     * normal: Default attribute which specifies no blending

     * multiply: The source color is multiplied by the destination color and replaces the destination.

     * screen: Multiplies the complements of the backdrop and source color values, then complements the result.

     * overlay: Multiplies or screens the colors, depending on the backdrop color value.

     * darken: Selects the darker of the backdrop and source colors.

     * lighten: Selects the lighter of the backdrop and source colors.

     * color-dodge: Brightens the backdrop color to reflect the source color.

     * color-burn: Darkens the backdrop color to reflect the source color.

     * hard-light: Multiplies or screens the colors, depending on the source color value.

     * soft-light: Darkens or lightens the colors, depending on the source color value.

     * difference: Subtracts the darker of the two constituent colors from the lighter color..

     * exclusion: Produces an effect similar to that of the Difference mode but lower in contrast.

     * hue: Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.

     * saturation: Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.

     * color: Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.

     * luminosity: Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.
     * ```
     *
     * @param value -
     */
  backgroundBlendMode(
    value:
      | 'normal'
      | 'multiply'
      | 'screen'
      | 'overlay'
      | 'darken'
      | 'lighten'
      | 'color-dodge'
      | 'color-burn'
      | 'hard-light'
      | 'soft-light'
      | 'difference'
      | 'exclusion'
      | 'hue'
      | 'saturation'
      | 'color'
      | 'luminosity'
      | (string & {}),
  ) {
    this.props.set('background-blend-mode', value)
    return this
  }

  /**
     * Determines the background painting area..
     * 
     * syntax:  `header { background-clip: border-box; }`
     * 
     * restriction: box
     * 
     * browsers: E,C,FF4,IE9,O10.5,S3
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-clip
     * 

     * @param value -
     */
  backgroundClip(value: string) {
    this.props.set('background-clip', value)
    return this
  }

  /**
     * Sets the background color of an element..
     * 
     * syntax:  `body { background-color: white; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-color
     * 

     * @param value -
     */
  backgroundColor(value: string) {
    this.props.set('background-color', value)
    return this
  }

  /**
     * Sets the background image(s) of an element..
     * 
     * syntax:  `article { background-image: url(image.png); }`
     * 
     * restriction: image, enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-image
     * 

     * @param value -
     */
  backgroundImage(value: 'none' | (string & {})) {
    this.props.set('background-image', value)
    return this
  }

  /**
     * For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s)..
     * 
     * syntax:  `header { background-origin: border-box; }`
     * 
     * restriction: box
     * 
     * browsers: E,C,FF4,IE9,O10.5,S3
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-origin
     * 

     * @param value -
     */
  backgroundOrigin(value: string) {
    this.props.set('background-origin', value)
    return this
  }

  /**
     * Specifies the initial position of the background image(s) (after any resizing) within their corresponding background positioning area..
     * 
     * syntax:  `div { background-position: left center}`
     * 
     * restriction: position, length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-position
     * 

     * @param value -
     */
  backgroundPosition(value: string) {
    this.props.set('background-position', value)
    return this
  }

  /**
     * Specifies how background images are tiled after they have been sized and positioned..
     * 
     * syntax:  `article { background-repeat: no-repeat; }`
     * 
     * restriction: repeat
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-repeat
     * 

     * @param value -
     */
  backgroundRepeat(value: 'logical' | (string & {})) {
    this.props.set('background-repeat', value)
    return this
  }

  /**
     * Specifies the size of the background images..
     * 
     * syntax:  `header { background-size: 20px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF4,IE9,O10,S4.1
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-size
     * 
     * values:
     * ```md
     * auto: Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.

     * contain: Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.

     * cover: Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.
     * ```
     *
     * @param value -
     */
  backgroundSize(value: 'auto' | 'contain' | 'cover' | (string & {})) {
    this.props.set('background-size', value)
    return this
  }

  /**
     * Size of an element in the direction opposite that of the direction specified by 'writing-mode'..
     * 
     * syntax:  `header { block-size: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#propdef-block-size
     * 

     * @param value -
     */
  blockSize(value: 'auto' | (string & {})) {
    this.props.set('block-size', value)
    return this
  }

  /**
     * Shorthand property for setting border width, style, and color..
     * 
     * syntax:  `header { border: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#borders
     * 

     * @param value -
     */
  border(value: string) {
    this.props.set('border', value)
    return this
  }

  /**
     * Logical 'border-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `header { border-block-end: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockEnd(value: string) {
    this.props.set('border-block-end', value)
    return this
  }

  /**
     * Logical 'border-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `header { border-block-start: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockStart(value: string) {
    this.props.set('border-block-start', value)
    return this
  }

  /**
     * Logical 'border-bottom-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-block-end-color: red; }`
     * 
     * restriction: color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockEndColor(value: string) {
    this.props.set('border-block-end-color', value)
    return this
  }

  /**
     * Logical 'border-top-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-block-start-color: red; }`
     * 
     * restriction: color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockStartColor(value: string) {
    this.props.set('border-block-start-color', value)
    return this
  }

  /**
     * Logical 'border-bottom-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-block-end-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockEndStyle(value: string) {
    this.props.set('border-block-end-style', value)
    return this
  }

  /**
     * Logical 'border-top-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-block-start-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockStartStyle(value: string) {
    this.props.set('border-block-start-style', value)
    return this
  }

  /**
     * Logical 'border-bottom-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-block-end-width: 50px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockEndWidth(value: string) {
    this.props.set('border-block-end-width', value)
    return this
  }

  /**
     * Logical 'border-top-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-block-start-width: 50px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderBlockStartWidth(value: string) {
    this.props.set('border-block-start-width', value)
    return this
  }

  /**
     * Shorthand property for setting border width, style and color..
     * 
     * syntax:  `header { border-bottom: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#borders
     * 

     * @param value -
     */
  borderBottom(value: string) {
    this.props.set('border-bottom', value)
    return this
  }

  /**
     * Sets the color of the bottom border..
     * 
     * syntax:  `td { border-bottom-color: blue; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-color
     * 

     * @param value -
     */
  borderBottomColor(value: string) {
    this.props.set('border-bottom-color', value)
    return this
  }

  /**
     * Defines the radii of the bottom left outer border edge..
     * 
     * syntax:  `td { border-bottom-left-radius: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF4,IE9,O10.5,S5
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-radius
     * 

     * @param value -
     */
  borderBottomLeftRadius(value: string) {
    this.props.set('border-bottom-left-radius', value)
    return this
  }

  /**
     * Defines the radii of the bottom right outer border edge..
     * 
     * syntax:  `td { border-bottom-right-radius: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF4,IE9,O10.5,S5
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-radius
     * 

     * @param value -
     */
  borderBottomRightRadius(value: string) {
    this.props.set('border-bottom-right-radius', value)
    return this
  }

  /**
     * Sets the style of the bottom border..
     * 
     * syntax:  `td { border-bottom-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-style
     * 

     * @param value -
     */
  borderBottomStyle(value: string) {
    this.props.set('border-bottom-style', value)
    return this
  }

  /**
     * Sets the thickness of the bottom border..
     * 
     * syntax:  `td { border-bottom-width: 2px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-width
     * 

     * @param value -
     */
  borderBottomWidth(value: string) {
    this.props.set('border-bottom-width', value)
    return this
  }

  /**
     * Selects a table's border model..
     * 
     * syntax:  `table { border-collapse: collapse; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/CSS2/tables.html#borders
     * 
     * values:
     * ```md
     * collapse: Selects the collapsing borders model.

     * separate: Selects the separated borders border model.
     * ```
     *
     * @param value -
     */
  borderCollapse(value: 'collapse' | 'separate' | (string & {})) {
    this.props.set('border-collapse', value)
    return this
  }

  /**
     * The color of the border around all four edges of an element..
     * 
     * syntax:  `td { border-color: blue; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-color
     * 

     * @param value -
     */
  borderColor(value: 'logical' | (string & {})) {
    this.props.set('border-color', value)
    return this
  }

  /**
     * Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values..
     * 
     * syntax:  `td { border-image: url(border.png) 30 30 round;}`
     * 
     * restriction: length, percentage, number, url, enum
     * 
     * browsers: E,C16,FF15,IE11,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-image
     * 
     * values:
     * ```md
     * auto: If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.

     * fill: Causes the middle part of the border-image to be preserved.

     * none: Use the border styles.

     * repeat: The image is tiled (repeated) to fill the area.

     * round: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.

     * space: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.

     * stretch: The image is stretched to fill the area.

     * url(): undefined
     * ```
     *
     * @param value -
     */
  borderImage(
    value:
      | 'auto'
      | 'fill'
      | 'none'
      | 'repeat'
      | 'round'
      | 'space'
      | 'stretch'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('border-image', value)
    return this
  }

  /**
     * The values specify the amount by which the border image area extends beyond the border box on the top, right, bottom, and left sides respectively. If the fourth value is absent, it is the same as the second. If the third one is also absent, it is the same as the first. If the second one is also absent, it is the same as the first. Numbers represent multiples of the corresponding border-width..
     * 
     * syntax:  `div { border-image-outset: 3px; }`
     * 
     * restriction: length, number
     * 
     * browsers: E,C16,FF15,IE11,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-image-outset
     * 

     * @param value -
     */
  borderImageOutset(value: string) {
    this.props.set('border-image-outset', value)
    return this
  }

  /**
     * Specifies how the images for the sides and the middle part of the border image are scaled and tiled. If the second keyword is absent, it is assumed to be the same as the first..
     * 
     * syntax:  `td { border-image-repeat: stretch; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C16,FF15,IE11,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-border-image-repeat
     * 
     * values:
     * ```md
     * repeat: The image is tiled (repeated) to fill the area.

     * round: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.

     * space: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.

     * stretch: The image is stretched to fill the area.
     * ```
     *
     * @param value -
     */
  borderImageRepeat(
    value: 'repeat' | 'round' | 'space' | 'stretch' | (string & {}),
  ) {
    this.props.set('border-image-repeat', value)
    return this
  }

  /**
     * Specifies inward offsets from the top, right, bottom, and left edges of the image, dividing it into nine regions: four corners, four edges and a middle..
     * 
     * syntax:  `div { border-image-slice: 10%; }`
     * 
     * restriction: number, percentage
     * 
     * browsers: E,C16,FF15,IE11,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-image-slice
     * 

     * @param value -
     */
  borderImageSlice(value: 'fill' | (string & {})) {
    this.props.set('border-image-slice', value)
    return this
  }

  /**
     * Specifies an image to use instead of the border styles given by the 'border-style' properties and as an additional background layer for the element. If the value is 'none' or if the image cannot be displayed, the border styles will be used..
     * 
     * syntax:  `aside { border-image-source: url(image.png); }`
     * 
     * restriction: image
     * 
     * browsers: E,C16,FF15,IE11,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-border-image-source
     * 

     * @param value -
     */
  borderImageSource(value: 'none' | (string & {})) {
    this.props.set('border-image-source', value)
    return this
  }

  /**
     * The four values of 'border-image-width' specify offsets that are used to divide the border image area into nine parts. They represent inward distances from the top, right, bottom, and left sides of the area, respectively..
     * 
     * syntax:  `.album { border-image-width: 4px; }`
     * 
     * restriction: length, percentage, number
     * 
     * browsers: E,C16,FF15,IE11,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-image-slice
     * 

     * @param value -
     */
  borderImageWidth(value: 'auto' | (string & {})) {
    this.props.set('border-image-width', value)
    return this
  }

  /**
     * Logical 'border-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `header { border-inline-end: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineEnd(value: string) {
    this.props.set('border-inline-end', value)
    return this
  }

  /**
     * Logical 'border-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `header { border-inline-start: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineStart(value: string) {
    this.props.set('border-inline-start', value)
    return this
  }

  /**
     * Logical 'border-right-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-inline-end-color: red; }`
     * 
     * restriction: color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineEndColor(value: string) {
    this.props.set('border-inline-end-color', value)
    return this
  }

  /**
     * Logical 'border-left-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-inline-start-color: red; }`
     * 
     * restriction: color
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineStartColor(value: string) {
    this.props.set('border-inline-start-color', value)
    return this
  }

  /**
     * Logical 'border-right-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-inline-end-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineEndStyle(value: string) {
    this.props.set('border-inline-end-style', value)
    return this
  }

  /**
     * Logical 'border-left-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-inline-start-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineStartStyle(value: string) {
    this.props.set('border-inline-start-style', value)
    return this
  }

  /**
     * Logical 'border-right-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-inline-end-width: 50px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineEndWidth(value: string) {
    this.props.set('border-inline-end-width', value)
    return this
  }

  /**
     * Logical 'border-left-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { border-inline-start-width: 50px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  borderInlineStartWidth(value: string) {
    this.props.set('border-inline-start-width', value)
    return this
  }

  /**
     * Shorthand property for setting border width, style and color.
     * 
     * syntax:  `header { border-left: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#borders
     * 

     * @param value -
     */
  borderLeft(value: string) {
    this.props.set('border-left', value)
    return this
  }

  /**
     * Sets the color of the left border..
     * 
     * syntax:  `td { border-left-color: blue; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-color
     * 

     * @param value -
     */
  borderLeftColor(value: string) {
    this.props.set('border-left-color', value)
    return this
  }

  /**
     * Sets the style of the left border..
     * 
     * syntax:  `td { border-left-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-style
     * 

     * @param value -
     */
  borderLeftStyle(value: string) {
    this.props.set('border-left-style', value)
    return this
  }

  /**
     * Sets the thickness of the left border..
     * 
     * syntax:  `td { border-left-width: 2px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-width
     * 

     * @param value -
     */
  borderLeftWidth(value: string) {
    this.props.set('border-left-width', value)
    return this
  }

  /**
     * Defines the radii of the outer border edge..
     * 
     * syntax:  `td { border-radius: 3px 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF4,IE9,O10.5,S5
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-radius
     * 

     * @param value -
     */
  borderRadius(value: string) {
    this.props.set('border-radius', value)
    return this
  }

  /**
     * Shorthand property for setting border width, style and color.
     * 
     * syntax:  `header { border-right: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#borders
     * 

     * @param value -
     */
  borderRight(value: string) {
    this.props.set('border-right', value)
    return this
  }

  /**
     * Sets the color of the right border..
     * 
     * syntax:  `td { border-right-color: blue; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-color
     * 

     * @param value -
     */
  borderRightColor(value: string) {
    this.props.set('border-right-color', value)
    return this
  }

  /**
     * Sets the style of the right border..
     * 
     * syntax:  `td { border-right-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-style
     * 

     * @param value -
     */
  borderRightStyle(value: string) {
    this.props.set('border-right-style', value)
    return this
  }

  /**
     * Sets the thickness of the right border..
     * 
     * syntax:  `td { border-right-width: 2px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-width
     * 

     * @param value -
     */
  borderRightWidth(value: string) {
    this.props.set('border-right-width', value)
    return this
  }

  /**
     * The lengths specify the distance that separates adjoining cell borders. If one length is specified, it gives both the horizontal and vertical spacing. If two are specified, the first gives the horizontal spacing and the second the vertical spacing. Lengths may not be negative..
     * 
     * syntax:  `table { border-spacing: 10px 50px; }`
     * 
     * restriction: length
     * 
     * browsers: E,C,FF1,IE8,O7,S1.2
     * 
     * ref: http://www.w3.org/TR/CSS2/tables.html#borders
     * 

     * @param value -
     */
  borderSpacing(value: string) {
    this.props.set('border-spacing', value)
    return this
  }

  /**
     * The style of the border around edges of an element..
     * 
     * syntax:  `td { border-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-style
     * 

     * @param value -
     */
  borderStyle(value: 'logical' | (string & {})) {
    this.props.set('border-style', value)
    return this
  }

  /**
     * Shorthand property for setting border width, style and color.
     * 
     * syntax:  `header { border-top: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#borders
     * 

     * @param value -
     */
  borderTop(value: string) {
    this.props.set('border-top', value)
    return this
  }

  /**
     * Sets the color of the top border..
     * 
     * syntax:  `td { border-top-color: blue; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-color
     * 

     * @param value -
     */
  borderTopColor(value: string) {
    this.props.set('border-top-color', value)
    return this
  }

  /**
     * Defines the radii of the top left outer border edge..
     * 
     * syntax:  `td { border-top-left-radius: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF4,IE9,O10.5,S5
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-radius
     * 

     * @param value -
     */
  borderTopLeftRadius(value: string) {
    this.props.set('border-top-left-radius', value)
    return this
  }

  /**
     * Defines the radii of the top right outer border edge..
     * 
     * syntax:  `td { border-top-right-radius: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF4,IE9,O10.5,S5
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-radius
     * 

     * @param value -
     */
  borderTopRightRadius(value: string) {
    this.props.set('border-top-right-radius', value)
    return this
  }

  /**
     * Sets the style of the top border..
     * 
     * syntax:  `td { border-top-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-style
     * 

     * @param value -
     */
  borderTopStyle(value: string) {
    this.props.set('border-top-style', value)
    return this
  }

  /**
     * Sets the thickness of the top border..
     * 
     * syntax:  `td { border-top-width: 2px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-width
     * 

     * @param value -
     */
  borderTopWidth(value: string) {
    this.props.set('border-top-width', value)
    return this
  }

  /**
     * Shorthand that sets the four 'border-*-width' properties. If it has four values, they set top, right, bottom and left in that order. If left is missing, it is the same as right; if bottom is missing, it is the same as top; if right is missing, it is the same as top..
     * 
     * syntax:  `td { border-width: 2px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-width
     * 

     * @param value -
     */
  borderWidth(value: 'logical' | (string & {})) {
    this.props.set('border-width', value)
    return this
  }

  /**
     * Specifies how far an absolutely positioned box's bottom margin edge is offset above the bottom edge of the box's 'containing block'..
     * 
     * syntax:  `article { bottom: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-positioning/#propdef-bottom
     * 

     * @param value -
     */
  bottom(value: 'auto' | (string & {})) {
    this.props.set('bottom', value)
    return this
  }

  /**
     * Specifies whether individual boxes are treated as broken pieces of one continuous box, or whether each box is individually wrapped with the border and padding..
     * 
     * syntax:  `div { box-decoration-break: clone; }`
     * 
     * restriction: enum
     * 
     * browsers: FF32,O11
     * 
     * ref: http://www.w3.org/TR/css3-break/#break-decoration
     * 
     * values:
     * ```md
     * clone: Each box is independently wrapped with the border and padding.

     * slice: The effect is as though the element were rendered with no breaks present, and then sliced by the breaks afterward.
     * ```
     *
     * @param value -
     */
  boxDecorationBreak(value: 'clone' | 'slice' | (string & {})) {
    this.props.set('box-decoration-break', value)
    return this
  }

  /**
     * Attaches one or more drop-shadows to the box. The property is a comma-separated list of shadows, each specified by 2-4 length values, an optional color, and an optional 'inset' keyword. Omitted lengths are 0; omitted colors are a user agent chosen color..
     * 
     * syntax:  `div { box-shadow: rgba(0,0,0,0.4) 10px 10px inset; }`
     * 
     * restriction: length, color, enum
     * 
     * browsers: E,C,FF4,IE9,O11.5,S5.1
     * 
     * ref: http://www.w3.org/TR/css3-background/#box-shadow
     * 
     * values:
     * ```md
     * inset: Changes the drop shadow from an outer shadow (one that shadows the box onto the canvas, as if it were lifted above the canvas) to an inner shadow (one that shadows the canvas onto the box, as if the box were cut out of the canvas and shifted behind it).

     * none: No shadow.
     * ```
     *
     * @param value -
     */
  boxShadow(value: 'inset' | 'none' | (string & {})) {
    this.props.set('box-shadow', value)
    return this
  }

  /**
     * Specifies the behavior of the 'width' and 'height' properties..
     * 
     * syntax:  `div { box-sizing: content-box; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C10,FF29,IE8,O8,S5.1
     * 
     * ref: http://www.w3.org/TR/css3-ui/#box-sizing
     * 
     * values:
     * ```md
     * border-box: The specified width and height (and respective min/max properties) on this element determine the border box of the element.

     * content-box: Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.
     * ```
     *
     * @param value -
     */
  boxSizing(value: 'border-box' | 'content-box' | (string & {})) {
    this.props.set('box-sizing', value)
    return this
  }

  /**
     * Specifies the position of the caption box with respect to the table box..
     * 
     * syntax:  `caption { caption-side: bottom; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C,FF,IE8,O,S
     * 
     * ref: http://www.w3.org/TR/CSS2/tables.html#caption-position
     * 
     * values:
     * ```md
     * block-end: Logical 'bottom'

     * block-start: Logical 'top'

     * bottom: Positions the caption box below the table box.

     * inline-end: Logical 'right'

     * inline-start: Logical 'left'

     * top: Positions the caption box above the table box.
     * ```
     *
     * @param value -
     */
  captionSide(
    value:
      | 'block-end'
      | 'block-start'
      | 'bottom'
      | 'inline-end'
      | 'inline-start'
      | 'top'
      | (string & {}),
  ) {
    this.props.set('caption-side', value)
    return this
  }

  /**
     * Controls the color of the text insertion indicator..
     * 
     * syntax:  `textarea { caret-color: red; }`
     * 
     * restriction: color, enum
     * 
     * browsers: C60,FF55,O46
     * 
     * ref: http://www.w3.org/TR/css3-ui/#propdef-caret-color
     * 

     * @param value -
     */
  caretColor(value: 'auto' | (string & {})) {
    this.props.set('caret-color', value)
    return this
  }

  /**
     * Indicates which sides of an element's box(es) may not be adjacent to an earlier floating box. The 'clear' property does not consider floats inside the element itself or in other block formatting contexts..
     * 
     * syntax:  `footer { clear: both; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/2006/WD-CSS21-20060411/visuren.html#propdef-clear
     * 
     * values:
     * ```md
     * both: The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating and left-floating boxes that resulted from elements earlier in the source document.

     * inline-end: Logical 'right'

     * inline-start: Logical 'left'

     * left: The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any left-floating boxes that resulted from elements earlier in the source document.

     * none: No constraint on the box's position with respect to floats.

     * right: The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating boxes that resulted from elements earlier in the source document.
     * ```
     *
     * @param value -
     */
  clear(
    value:
      | 'both'
      | 'inline-end'
      | 'inline-start'
      | 'left'
      | 'none'
      | 'right'
      | (string & {}),
  ) {
    this.props.set('clear', value)
    return this
  }

  /**
     * Deprecated. Use the 'clip-path' property when support allows. Defines the visible portion of an element's box..
     * 
     * syntax:  `span { clip: rect(0px, 60px, 200px, 0px); }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-masking/#clip-property
     * 
     * values:
     * ```md
     * auto: The element does not clip.

     * rect(): Specifies offsets from the edges of the border box.
     * ```
     *
     * @param value -
     */
  clip(value: 'auto' | 'rect()' | (string & {})) {
    this.props.set('clip', value)
    return this
  }

  /**
     * Specifies a clipping path where everything inside the path is visible and everything outside is clipped out..
     * 
     * syntax:  ` `
     * 
     * restriction: url, shape, geometry-box, enum
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css-masking/#the-clip-path
     * 
     * values:
     * ```md
     * none: No clipping path gets created.

     * url(): References a <clipPath> element to create a clipping path.
     * ```
     *
     * @param value -
     */
  clipPath(value: 'none' | 'url()' | (string & {})) {
    this.props.set('clip-path', value)
    return this
  }

  /**
     * Indicates the algorithm which is to be used to determine what parts of the canvas are included inside the shape..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: E,C5,FF3,IE10,O9,S6
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-clip-rule
     * 
     * values:
     * ```md
     * evenodd: Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.

     * nonzero: Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.
     * ```
     *
     * @param value -
     */
  clipRule(value: 'evenodd' | 'nonzero' | (string & {})) {
    this.props.set('clip-rule', value)
    return this
  }

  /**
     * Sets the color of an element's text.
     * 
     * syntax:  `body { color: red; }`
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-color/#foreground
     * 

     * @param value -
     */
  color(value: string) {
    this.props.set('color', value)
    return this
  }

  /**
     * Specifies the color space for imaging operations performed via filter effects..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: E,C5,FF3,IE10,O9,S6
     * 
     * ref: http://www.w3.org/TR/filter-effects/#ColorInterpolationFiltersProperty
     * 
     * values:
     * ```md
     * auto: Color operations are not required to occur in a particular color space.

     * linearRGB: Color operations should occur in the linearized RGB color space.

     * sRGB: Color operations should occur in the sRGB color space.
     * ```
     *
     * @param value -
     */
  colorInterpolationFilters(
    value: 'auto' | 'linearRGB' | 'sRGB' | (string & {}),
  ) {
    this.props.set('color-interpolation-filters', value)
    return this
  }

  /**
     * Describes the optimal number of columns into which the content of the element will be flowed..
     * 
     * syntax:  `div { column-count: 3; }`
     * 
     * restriction: integer, enum
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-count
     * 

     * @param value -
     */
  columnCount(value: 'auto' | (string & {})) {
    this.props.set('column-count', value)
    return this
  }

  /**
     * In continuous media, this property will only be consulted if the length of columns has been constrained. Otherwise, columns will automatically be balanced..
     * 
     * syntax:  `article { column-fill: balance; }`
     * 
     * restriction: enum
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#filling-columns
     * 
     * values:
     * ```md
     * auto: Fills columns sequentially.

     * balance: Balance content equally between columns, if possible.
     * ```
     *
     * @param value -
     */
  columnFill(value: 'auto' | 'balance' | (string & {})) {
    this.props.set('column-fill', value)
    return this
  }

  /**
     * Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap..
     * 
     * syntax:  `div { column-gap: 10px; }`
     * 
     * restriction: length, enum
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-gap0
     * 

     * @param value -
     */
  columnGap(value: 'normal' | (string & {})) {
    this.props.set('column-gap', value)
    return this
  }

  /**
     * Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values..
     * 
     * syntax:  `header { column-rule: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule0
     * 

     * @param value -
     */
  columnRule(value: string) {
    this.props.set('column-rule', value)
    return this
  }

  /**
     * Sets the style of the rule between columns of an element..
     * 
     * syntax:  `div { column-rule-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: E,IE10,O11.5,S6
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-style
     * 

     * @param value -
     */
  columnRuleStyle(value: string) {
    this.props.set('column-rule-style', value)
    return this
  }

  /**
     * Sets the width of the rule between columns. Negative values are not allowed..
     * 
     * syntax:  `div { column-rule-width: 3px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-width
     * 

     * @param value -
     */
  columnRuleWidth(value: string) {
    this.props.set('column-rule-width', value)
    return this
  }

  /**
     * A shorthand property which sets both 'column-width' and 'column-count'..
     * 
     * syntax:  `div { columns: 100px 3; }`
     * 
     * restriction: length, integer, enum
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#columns0
     * 

     * @param value -
     */
  columns(value: 'auto' | (string & {})) {
    this.props.set('columns', value)
    return this
  }

  /**
     * Describes the page/column break behavior after the generated box..
     * 
     * syntax:  `article { column-span: all; }`
     * 
     * restriction: enum
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-span0
     * 
     * values:
     * ```md
     * all: The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear.

     * none: The element does not span multiple columns.
     * ```
     *
     * @param value -
     */
  columnSpan(value: 'all' | 'none' | (string & {})) {
    this.props.set('column-span', value)
    return this
  }

  /**
     * Describes the width of columns in multicol elements..
     * 
     * syntax:  `div { column-width: 100px; }`
     * 
     * restriction: length, enum
     * 
     * browsers: E,IE10,O11.5,S9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-width
     * 
     * values:
     * ```md
     * auto: The width depends on the values of other properties.

     * fill: Specifies the optimal column width as the fill-available inline size of the multi-column element.

     * fit-content: Specifies the optimal column width as min(max-content inline size, max(min-content inline size, fill-available inline size)).

     * max-content: Specifies the optimal column width as the max-content inline size of the multi-column element's contents.

     * min-content: Specifies the optimal column width as the min-content inline size of the multi-column element's contents.
     * ```
     *
     * @param value -
     */
  columnWidth(
    value:
      | 'auto'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('column-width', value)
    return this
  }

  /**
     * Indicates that an element and its contents are, as much as possible, independent of the rest of the document tree..
     * 
     * syntax:  `div { contain: strict; }`
     * 
     * restriction: enum
     * 
     * browsers: C52,O40
     * 
     * ref: https://drafts.csswg.org/css-containment-3/#propdef-contain
     * 
     * values:
     * ```md
     * none: Indicates that the property has no effect.

     * strict: Turns on all forms of containment for the element.

     * content: All containment rules except size are applied to the element.

     * size: For properties that can have effects on more than just an element and its descendants, those effects don't escape the containing element.

     * layout: Turns on layout containment for the element.

     * style: Turns on style containment for the element.

     * paint: Turns on paint containment for the element.
     * ```
     *
     * @param value -
     */
  contain(
    value:
      | 'none'
      | 'strict'
      | 'content'
      | 'size'
      | 'layout'
      | 'style'
      | 'paint'
      | (string & {}),
  ) {
    this.props.set('contain', value)
    return this
  }

  /**
     * Determines which page-based occurrence of a given element is applied to a counter or string value..
     * 
     * syntax:  `a:after { content: ' ( attr(href))';}`
     * 
     * restriction: string, url
     * 
     * browsers: E,C,FF1,IE8,O4,S1
     * 
     * ref: http://www.w3.org/TR/css3-content/#content
     * 
     * values:
     * ```md
     * attr(): The attr(n) function returns as a string the value of attribute n for the subject of the selector.

     * box: A hollow square.

     * check: A check mark.

     * circle: A hollow circle.

     * close-quote: Value is replaced by the appropriate string from the 'quotes' property.

     * contents: Displays the element's descendants.

     * counter(name): Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).

     * counter(name, style): Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).

     * counters(name, string): Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).

     * counters(name, string, style): Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).

     * date(format): Current date and/or time, formatted according to the specified formatting string. Format is based on POSIX date formatting strings.

     * diamond: A filled diamond. On some platforms, this is similar to 'disc'.

     * disc: A filled circle.

     * endnote: Shorthand for 'counter(endnote, normal)'. This is intended to be used on the in-flow part of a endnote.

     * footnote: Shorthand for 'counter(footnote, normal)'. This is intended to be used on the in-flow part of a footnote.

     * hyphen: A hyphen bullet.

     * icon: The (pseudo-)element is replaced in its entirety by the resource referenced by its 'icon' property, and treated as a replaced element.

     * inhibit: On elements, this inhibits the children of the element from being rendered as children of this element, as if the element was empty. On pseudo-elements, this inhibits the creation of the pseudo-element, as if 'display' computed to 'none'.

     * list-item: Shorthand for 'counter(list-item, normal)'. Note that this is not equivalent to 'normal' when set on a '::marker' pseudo-element that has a superior with 'display' set to 'list-item', as it ignores the 'list-style' properties.

     * no-close-quote: Inserts nothing (as in 'none'), but increments (decrements) the level of nesting for quotes.

     * none: On elements, this inhibits the children of the element from being rendered as children of this element, as if the element was empty. On pseudo-elements it causes the pseudo-element to have no content.

     * no-open-quote: Inserts nothing (as in 'none'), but increments (decrements) the level of nesting for quotes.

     * normal: See http://www.w3.org/TR/css3-content/#content for computation rules.

     * open-quote: Value is replaced by the appropriate string from the 'quotes' property.

     * pending(): This causes all elements and pseudo-elements whose 'move-to' property computes to the specified identifier to be inserted as children of the current element (or pseudo-element).

     * section-note: Shorthand for 'counter(section-note, normal)'. This is intended to be used on the in-flow part of a section-note.

     * square: A filled square.

     * string(name): Specifies a string value

     * url(): undefined
     * ```
     *
     * @param value -
     */
  content(
    value:
      | 'attr()'
      | 'box'
      | 'check'
      | 'circle'
      | 'close-quote'
      | 'contents'
      | 'counter(name)'
      | 'counter(name, style)'
      | 'counters(name, string)'
      | 'counters(name, string, style)'
      | 'date(format)'
      | 'diamond'
      | 'disc'
      | 'endnote'
      | 'footnote'
      | 'hyphen'
      | 'icon'
      | 'inhibit'
      | 'list-item'
      | 'no-close-quote'
      | 'none'
      | 'no-open-quote'
      | 'normal'
      | 'open-quote'
      | 'pending()'
      | 'section-note'
      | 'square'
      | 'string(name)'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('content', value)
    return this
  }

  /**
     * Manipulate the value of existing counters..
     * 
     * syntax:  `h1:before { counter-increment: section; }`
     * 
     * restriction: identifier, integer
     * 
     * browsers: E,C,FF1.5,IE8,O10.5,S3
     * 
     * ref: http://www.w3.org/TR/css3-content/#counters
     * 

     * @param value -
     */
  counterIncrement(value: 'none' | (string & {})) {
    this.props.set('counter-increment', value)
    return this
  }

  /**
     * Property accepts one or more names of counters (identifiers), each one optionally followed by an integer. The integer gives the value that the counter is set to on each occurrence of the element..
     * 
     * syntax:  `h1 { counter-reset: section; }`
     * 
     * restriction: identifier, integer
     * 
     * browsers: E,C,FF1.5,IE8,O10.5,S3
     * 
     * ref: http://www.w3.org/TR/css3-content/#counters
     * 

     * @param value -
     */
  counterReset(value: 'none' | (string & {})) {
    this.props.set('counter-reset', value)
    return this
  }

  /**
     * Allows control over cursor appearance in an element.
     * 
     * syntax:  `nav { cursor: pointer; }`
     * 
     * restriction: url, number, enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-ui/#cursor0
     * 
     * values:
     * ```md
     * alias: Indicates an alias of/shortcut to something is to be created. Often rendered as an arrow with a small curved arrow next to it.

     * all-scroll: Indicates that the something can be scrolled in any direction. Often rendered as arrows pointing up, down, left, and right with a dot in the middle.

     * auto: The UA determines the cursor to display based on the current context.

     * cell: Indicates that a cell or set of cells may be selected. Often rendered as a thick plus-sign with a dot in the middle.

     * col-resize: Indicates that the item/column can be resized horizontally. Often rendered as arrows pointing left and right with a vertical bar separating them.

     * context-menu: A context menu is available for the object under the cursor. Often rendered as an arrow with a small menu-like graphic next to it.

     * copy: Indicates something is to be copied. Often rendered as an arrow with a small plus sign next to it.

     * crosshair: A simple crosshair (e.g., short line segments resembling a '+' sign). Often used to indicate a two dimensional bitmap selection mode.

     * default: The platform-dependent default cursor. Often rendered as an arrow.

     * e-resize: Indicates that east edge is to be moved.

     * ew-resize: Indicates a bidirectional east-west resize cursor.

     * grab: Indicates that something can be grabbed.

     * grabbing: Indicates that something is being grabbed.

     * help: Help is available for the object under the cursor. Often rendered as a question mark or a balloon.

     * move: Indicates something is to be moved.

     * -moz-grab: Indicates that something can be grabbed.

     * -moz-grabbing: Indicates that something is being grabbed.

     * -moz-zoom-in: Indicates that something can be zoomed (magnified) in.

     * -moz-zoom-out: Indicates that something can be zoomed (magnified) out.

     * ne-resize: Indicates that movement starts from north-east corner.

     * nesw-resize: Indicates a bidirectional north-east/south-west cursor.

     * no-drop: Indicates that the dragged item cannot be dropped at the current cursor location. Often rendered as a hand or pointer with a small circle with a line through it.

     * none: No cursor is rendered for the element.

     * not-allowed: Indicates that the requested action will not be carried out. Often rendered as a circle with a line through it.

     * n-resize: Indicates that north edge is to be moved.

     * ns-resize: Indicates a bidirectional north-south cursor.

     * nw-resize: Indicates that movement starts from north-west corner.

     * nwse-resize: Indicates a bidirectional north-west/south-east cursor.

     * pointer: The cursor is a pointer that indicates a link.

     * progress: A progress indicator. The program is performing some processing, but is different from 'wait' in that the user may still interact with the program. Often rendered as a spinning beach ball, or an arrow with a watch or hourglass.

     * row-resize: Indicates that the item/row can be resized vertically. Often rendered as arrows pointing up and down with a horizontal bar separating them.

     * se-resize: Indicates that movement starts from south-east corner.

     * s-resize: Indicates that south edge is to be moved.

     * sw-resize: Indicates that movement starts from south-west corner.

     * text: Indicates text that may be selected. Often rendered as a vertical I-beam.

     * vertical-text: Indicates vertical-text that may be selected. Often rendered as a horizontal I-beam.

     * wait: Indicates that the program is busy and the user should wait. Often rendered as a watch or hourglass.

     * -webkit-grab: Indicates that something can be grabbed.

     * -webkit-grabbing: Indicates that something is being grabbed.

     * -webkit-zoom-in: Indicates that something can be zoomed (magnified) in.

     * -webkit-zoom-out: Indicates that something can be zoomed (magnified) out.

     * w-resize: Indicates that west edge is to be moved.

     * zoom-in: Indicates that something can be zoomed (magnified) in.

     * zoom-out: Indicates that something can be zoomed (magnified) out.
     * ```
     *
     * @param value -
     */
  cursor(
    value:
      | 'alias'
      | 'all-scroll'
      | 'auto'
      | 'cell'
      | 'col-resize'
      | 'context-menu'
      | 'copy'
      | 'crosshair'
      | 'default'
      | 'e-resize'
      | 'ew-resize'
      | 'grab'
      | 'grabbing'
      | 'help'
      | 'move'
      | '-moz-grab'
      | '-moz-grabbing'
      | '-moz-zoom-in'
      | '-moz-zoom-out'
      | 'ne-resize'
      | 'nesw-resize'
      | 'no-drop'
      | 'none'
      | 'not-allowed'
      | 'n-resize'
      | 'ns-resize'
      | 'nw-resize'
      | 'nwse-resize'
      | 'pointer'
      | 'progress'
      | 'row-resize'
      | 'se-resize'
      | 's-resize'
      | 'sw-resize'
      | 'text'
      | 'vertical-text'
      | 'wait'
      | '-webkit-grab'
      | '-webkit-grabbing'
      | '-webkit-zoom-in'
      | '-webkit-zoom-out'
      | 'w-resize'
      | 'zoom-in'
      | 'zoom-out'
      | (string & {}),
  ) {
    this.props.set('cursor', value)
    return this
  }

  /**
     * Specifies the inline base direction or directionality of any bidi paragraph, embedding, isolate, or override established by the box. Note: for HTML content use the 'dir' attribute and 'bdo' element rather than this property..
     * 
     * syntax:  `div { direction: rtl; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-writing-modes-3/#direction
     * 
     * values:
     * ```md
     * ltr: Left-to-right direction.

     * rtl: Right-to-left direction.
     * ```
     *
     * @param value -
     */
  direction(value: 'ltr' | 'rtl' | (string & {})) {
    this.props.set('direction', value)
    return this
  }

  /**
     * In combination with 'float' and 'position', determines the type of box or boxes that are generated for an element..
     * 
     * syntax:  `p { display: inline; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-display-3/#propdef-display
     * 
     * values:
     * ```md
     * block: The element generates a block-level box

     * contents: The element itself does not generate any boxes, but its children and pseudo-elements still generate boxes as normal.

     * flex: The element generates a principal flex container box and establishes a flex formatting context.

     * flexbox: The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.

     * flow: The element lays out its contents using flow layout (block-and-inline layout).

     * flow-root: The element generates a block container box, and lays out its contents using flow layout.

     * grid: The element generates a principal grid container box, and establishes a grid formatting context.

     * inline: The element generates an inline-level box.

     * inline-block: A block box, which itself is flowed as a single inline box, similar to a replaced element. The inside of an inline-block is formatted as a block box, and the box itself is formatted as an inline box.

     * inline-flex: Inline-level flex container.

     * inline-flexbox: Inline-level flex container. Standardized as 'inline-flex'

     * inline-grid: Inline-level grid container.

     * inline-table: Inline-level table wrapper box containing table box.

     * list-item: One or more block boxes and one marker box.

     * -moz-box: The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.

     * -moz-deck: undefined

     * -moz-grid: undefined

     * -moz-grid-group: undefined

     * -moz-grid-line: undefined

     * -moz-groupbox: undefined

     * -moz-inline-box: Inline-level flex container. Standardized as 'inline-flex'

     * -moz-inline-grid: undefined

     * -moz-inline-stack: undefined

     * -moz-marker: undefined

     * -moz-popup: undefined

     * -moz-stack: undefined

     * -ms-flexbox: The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.

     * -ms-grid: The element generates a principal grid container box, and establishes a grid formatting context.

     * -ms-inline-flexbox: Inline-level flex container. Standardized as 'inline-flex'

     * -ms-inline-grid: Inline-level grid container.

     * none: The element and its descendants generates no boxes.

     * ruby: The element generates a principal ruby container box, and establishes a ruby formatting context.

     * ruby-base: undefined

     * ruby-base-container: undefined

     * ruby-base-group: undefined

     * ruby-text: undefined

     * ruby-text-container: undefined

     * ruby-text-group: undefined

     * run-in: The element generates a run-in box. Run-in elements act like inlines or blocks, depending on the surrounding elements.

     * table: The element generates a principal table wrapper box containing an additionally-generated table box, and establishes a table formatting context.

     * table-caption: undefined

     * table-cell: undefined

     * table-column: undefined

     * table-column-group: undefined

     * table-footer-group: undefined

     * table-header-group: undefined

     * table-row: undefined

     * table-row-group: undefined

     * -webkit-box: The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.

     * -webkit-flex: The element lays out its contents using flow layout (block-and-inline layout).

     * -webkit-inline-box: Inline-level flex container. Standardized as 'inline-flex'

     * -webkit-inline-flex: Inline-level flex container.
     * ```
     *
     * @param value -
     */
  display(
    value:
      | 'block'
      | 'contents'
      | 'flex'
      | 'flexbox'
      | 'flow'
      | 'flow-root'
      | 'grid'
      | 'inline'
      | 'inline-block'
      | 'inline-flex'
      | 'inline-flexbox'
      | 'inline-grid'
      | 'inline-table'
      | 'list-item'
      | '-moz-box'
      | '-moz-deck'
      | '-moz-grid'
      | '-moz-grid-group'
      | '-moz-grid-line'
      | '-moz-groupbox'
      | '-moz-inline-box'
      | '-moz-inline-grid'
      | '-moz-inline-stack'
      | '-moz-marker'
      | '-moz-popup'
      | '-moz-stack'
      | '-ms-flexbox'
      | '-ms-grid'
      | '-ms-inline-flexbox'
      | '-ms-inline-grid'
      | 'none'
      | 'ruby'
      | 'ruby-base'
      | 'ruby-base-container'
      | 'ruby-base-group'
      | 'ruby-text'
      | 'ruby-text-container'
      | 'ruby-text-group'
      | 'run-in'
      | 'table'
      | 'table-caption'
      | 'table-cell'
      | 'table-column'
      | 'table-column-group'
      | 'table-footer-group'
      | 'table-header-group'
      | 'table-row'
      | 'table-row-group'
      | '-webkit-box'
      | '-webkit-flex'
      | '-webkit-inline-box'
      | '-webkit-inline-flex'
      | (string & {}),
  ) {
    this.props.set('display', value)
    return this
  }

  /**
     * In the separated borders model, this property controls the rendering of borders and backgrounds around cells that have no visible content..
     * 
     * syntax:  `table { empty-cells: hide; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C,FF1,IE7,O4,S1.2
     * 
     * ref: http://www.w3.org/TR/CSS2/tables.html#empty-cells
     * 
     * values:
     * ```md
     * hide: No borders or backgrounds are drawn around/behind empty cells.

     * -moz-show-background: undefined

     * show: Borders and backgrounds are drawn around/behind empty cells (like normal cells).
     * ```
     *
     * @param value -
     */
  emptyCells(value: 'hide' | '-moz-show-background' | 'show' | (string & {})) {
    this.props.set('empty-cells', value)
    return this
  }

  /**
     * Deprecated. Use 'isolation' property instead when support allows. Specifies how the accumulation of the background image is managed..
     * 
     * syntax:  ` `
     * 
     * restriction: integer, length, percentage, enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/filter-effects/#AccessBackgroundImage
     * 
     * values:
     * ```md
     * accumulate: If the ancestor container element has a property of new, then all graphics elements within the current container are rendered both on the parent's background image and onto the target.

     * new: Create a new background image canvas. All children of the current container element can access the background, and they will be rendered onto both the parent's background image canvas in addition to the target device.
     * ```
     *
     * @param value -
     */
  enableBackground(value: 'accumulate' | 'new' | (string & {})) {
    this.props.set('enable-background', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies a fallback counter style to be used when the current counter style can't create a representation for a given counter value..
     * 
     * syntax:  `@counter-style { fallback: upper-alpha; }`
     * 
     * restriction: identifier
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-fallback
     * 

     * @param value -
     */
  fallback(value: string) {
    this.props.set('fallback', value)
    return this
  }

  /**
     * Paints the interior of the given graphical element..
     * 
     * syntax:  ` `
     * 
     * restriction: color, enum, url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#FillProperty
     * 
     * values:
     * ```md
     * child: A reference to the last child paint server element of the element being painted.

     * child(): A reference to the nth child paint server element of the element being painted.

     * context-fill: The computed value of the 'fill' property of the context element of the element being painted.

     * context-stroke: The computed value of the 'stroke' property of the context element of the element being painted.

     * url(): A URL reference to a paint server element, which is an element that defines a paint server: 'hatch', 'linearGradient', 'mesh', 'pattern', 'radialGradient' and 'solidcolor'.

     * none: No paint is applied in this layer.
     * ```
     *
     * @param value -
     */
  fill(
    value:
      | 'child'
      | 'child()'
      | 'context-fill'
      | 'context-stroke'
      | 'url()'
      | 'none'
      | (string & {}),
  ) {
    this.props.set('fill', value)
    return this
  }

  /**
     * Specifies the opacity of the painting operation used to paint the interior the current object..
     * 
     * syntax:  ` `
     * 
     * restriction: number(0-1)
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#FillOpacity
     * 

     * @param value -
     */
  fillOpacity(value: number) {
    this.props.set('fill-opacity', value)
    return this
  }

  /**
     * Indicates the algorithm (or winding rule) which is to be used to determine what parts of the canvas are included inside the shape..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#WindingRule
     * 
     * values:
     * ```md
     * evenodd: Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.

     * nonzero: Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.
     * ```
     *
     * @param value -
     */
  fillRule(value: 'evenodd' | 'nonzero' | (string & {})) {
    this.props.set('fill-rule', value)
    return this
  }

  /**
     * Processes an element's rendering before it is displayed in the document, by applying one or more filter effects..
     * 
     * syntax:  `div { filter: opacity(50%); }`
     * 
     * restriction: enum, url
     * 
     * browsers: E13,FF35
     * 
     * ref: http://www.w3.org/TR/filter-effects/#propdef-filter
     * 
     * values:
     * ```md
     * none: No filter effects are applied.

     * blur(): Applies a Gaussian blur to the input image.

     * brightness(): Applies a linear multiplier to input image, making it appear more or less bright.

     * contrast(): Adjusts the contrast of the input.

     * drop-shadow(): Applies a drop shadow effect to the input image.

     * grayscale(): Converts the input image to grayscale.

     * hue-rotate(): Applies a hue rotation on the input image. 

     * invert(): Inverts the samples in the input image.

     * opacity(): Applies transparency to the samples in the input image.

     * saturate(): Saturates the input image.

     * sepia(): Converts the input image to sepia.

     * url(): A filter reference to a <filter> element.
     * ```
     *
     * @param value -
     */
  filter(
    value:
      | 'none'
      | 'blur()'
      | 'brightness()'
      | 'contrast()'
      | 'drop-shadow()'
      | 'grayscale()'
      | 'hue-rotate()'
      | 'invert()'
      | 'opacity()'
      | 'saturate()'
      | 'sepia()'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('filter', value)
    return this
  }

  /**
     * Specifies the components of a flexible length: the flex grow factor and flex shrink factor, and the flex basis..
     * 
     * syntax:  `p { flex: 0 1 auto; }`
     * 
     * restriction: length, number, percentage
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex
     * 
     * values:
     * ```md
     * auto: Retrieves the value of the main size property as the used 'flex-basis'.

     * content: Indicates automatic sizing, based on the flex item's content.

     * none: Expands to '0 0 auto'.
     * ```
     *
     * @param value -
     */
  flex(value: 'auto' | 'content' | 'none' | (string & {})) {
    this.props.set('flex', value)
    return this
  }

  /**
     * Sets the flex basis..
     * 
     * syntax:  `p { flex-basis: 30%; }`
     * 
     * restriction: length, number, percentage
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex-basis-propdef
     * 
     * values:
     * ```md
     * auto: Retrieves the value of the main size property as the used 'flex-basis'.

     * content: Indicates automatic sizing, based on the flex item's content.
     * ```
     *
     * @param value -
     */
  flexBasis(value: 'auto' | 'content' | (string & {})) {
    this.props.set('flex-basis', value)
    return this
  }

  /**
     * Specifies how flex items are placed in the flex container, by setting the direction of the flex container's main axis..
     * 
     * syntax:  `div { flex-direction: column; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex-direction
     * 
     * values:
     * ```md
     * column: The flex container's main axis has the same orientation as the block axis of the current writing mode.

     * column-reverse: Same as 'column', except the main-start and main-end directions are swapped.

     * row: The flex container's main axis has the same orientation as the inline axis of the current writing mode.

     * row-reverse: Same as 'row', except the main-start and main-end directions are swapped.
     * ```
     *
     * @param value -
     */
  flexDirection(
    value: 'column' | 'column-reverse' | 'row' | 'row-reverse' | (string & {}),
  ) {
    this.props.set('flex-direction', value)
    return this
  }

  /**
     * Specifies how flexbox items are placed in the flexbox..
     * 
     * syntax:  `div { flex-flow: column wrap; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF28,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex-flow
     * 
     * values:
     * ```md
     * column: The flex container's main axis has the same orientation as the block axis of the current writing mode.

     * column-reverse: Same as 'column', except the main-start and main-end directions are swapped.

     * nowrap: The flex container is single-line.

     * row: The flex container's main axis has the same orientation as the inline axis of the current writing mode.

     * row-reverse: Same as 'row', except the main-start and main-end directions are swapped.

     * wrap: The flexbox is multi-line.

     * wrap-reverse: Same as 'wrap', except the cross-start and cross-end directions are swapped.
     * ```
     *
     * @param value -
     */
  flexFlow(
    value:
      | 'column'
      | 'column-reverse'
      | 'nowrap'
      | 'row'
      | 'row-reverse'
      | 'wrap'
      | 'wrap-reverse'
      | (string & {}),
  ) {
    this.props.set('flex-flow', value)
    return this
  }

  /**
     * Sets the flex grow factor. Negative numbers are invalid..
     * 
     * syntax:  `p { flex-grow: 4; }`
     * 
     * restriction: number
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex-grow
     * 

     * @param value -
     */
  flexGrow(value: number) {
    this.props.set('flex-grow', value)
    return this
  }

  /**
     * Sets the flex shrink factor. Negative numbers are invalid..
     * 
     * syntax:  `p { flex-shrink: 4; }`
     * 
     * restriction: number
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex-shrink
     * 

     * @param value -
     */
  flexShrink(value: number) {
    this.props.set('flex-shrink', value)
    return this
  }

  /**
     * Controls whether the flex container is single-line or multi-line, and the direction of the cross-axis, which determines the direction new lines are stacked in..
     * 
     * syntax:  `div { flex-wrap: nowrap; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF28,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#flex-wrap
     * 
     * values:
     * ```md
     * nowrap: The flex container is single-line.

     * wrap: The flexbox is multi-line.

     * wrap-reverse: Same as 'wrap', except the cross-start and cross-end directions are swapped.
     * ```
     *
     * @param value -
     */
  flexWrap(value: 'nowrap' | 'wrap' | 'wrap-reverse' | (string & {})) {
    this.props.set('flex-wrap', value)
    return this
  }

  /**
     * Specifies how a box should be floated. It may be set for any element, but only applies to elements that generate boxes that are not absolutely positioned..
     * 
     * syntax:  `img { float: right; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/CSS21/visuren.html#propdef-float
     * 
     * values:
     * ```md
     * inline-end: A keyword indicating that the element must float on the end side of its containing block. That is the right side with ltr scripts, and the left side with rtl scripts.

     * inline-start: A keyword indicating that the element must float on the start side of its containing block. That is the left side with ltr scripts, and the right side with rtl scripts.

     * left: The element generates a block box that is floated to the left. Content flows on the right side of the box, starting at the top (subject to the 'clear' property).

     * none: The box is not floated.

     * right: Similar to 'left', except the box is floated to the right, and content flows on the left side of the box, starting at the top.
     * ```
     *
     * @param value -
     */
  float(
    value:
      | 'inline-end'
      | 'inline-start'
      | 'left'
      | 'none'
      | 'right'
      | (string & {}),
  ) {
    this.props.set('float', value)
    return this
  }

  /**
     * Indicates what color to use to flood the current filter primitive subregion..
     * 
     * syntax:  ` `
     * 
     * restriction: color
     * 
     * browsers: E,C5,FF3,IE10,O9,S6
     * 
     * ref: http://www.w3.org/TR/filter-effects/#FloodColorProperty
     * 

     * @param value -
     */
  floodColor(value: string) {
    this.props.set('flood-color', value)
    return this
  }

  /**
     * Indicates what opacity to use to flood the current filter primitive subregion..
     * 
     * syntax:  ` `
     * 
     * restriction: number(0-1), percentage
     * 
     * browsers: E,C5,FF3,IE10,O9,S6
     * 
     * ref: http://www.w3.org/TR/filter-effects/#FloodOpacityProperty
     * 

     * @param value -
     */
  floodOpacity(value: string) {
    this.props.set('flood-opacity', value)
    return this
  }

  /**
     * Shorthand property for setting 'font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', and 'font-family', at the same place in the style sheet. The syntax of this property is based on a traditional typographical shorthand notation to set multiple properties related to fonts..
     * 
     * syntax:  `body { font: bold 12px arial, verdana; }`
     * 
     * restriction: font
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font
     * 
     * values:
     * ```md
     * 100: Thin

     * 200: Extra Light (Ultra Light)

     * 300: Light

     * 400: Normal

     * 500: Medium

     * 600: Semi Bold (Demi Bold)

     * 700: Bold

     * 800: Extra Bold (Ultra Bold)

     * 900: Black (Heavy)

     * bold: Same as 700

     * bolder: Specifies the weight of the face bolder than the inherited value.

     * caption: The font used for captioned controls (e.g., buttons, drop-downs, etc.).

     * icon: The font used to label icons.

     * italic: Selects a font that is labeled 'italic', or, if that is not available, one labeled 'oblique'.

     * large: undefined

     * larger: undefined

     * lighter: Specifies the weight of the face lighter than the inherited value.

     * medium: undefined

     * menu: The font used in menus (e.g., dropdown menus and menu lists).

     * message-box: The font used in dialog boxes.

     * normal: Specifies a face that is not labeled as a small-caps font.

     * oblique: Selects a font that is labeled 'oblique'.

     * small: undefined

     * small-caps: Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font.

     * small-caption: The font used for labeling small controls.

     * smaller: undefined

     * status-bar: The font used in window status bars.

     * x-large: undefined

     * x-small: undefined

     * xx-large: undefined

     * xx-small: undefined
     * ```
     *
     * @param value -
     */
  font(
    value:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'bold'
      | 'bolder'
      | 'caption'
      | 'icon'
      | 'italic'
      | 'large'
      | 'larger'
      | 'lighter'
      | 'medium'
      | 'menu'
      | 'message-box'
      | 'normal'
      | 'oblique'
      | 'small'
      | 'small-caps'
      | 'small-caption'
      | 'smaller'
      | 'status-bar'
      | 'x-large'
      | 'x-small'
      | 'xx-large'
      | 'xx-small'
      | (string & {}),
  ) {
    this.props.set('font', value)
    return this
  }

  /**
     * Specifies a prioritized list of font family names or generic family names. A user agent iterates through the list of family names until it matches an available font that contains a glyph for the character to be rendered..
     * 
     * syntax:  `body { font-family: arial, verdana; }`
     * 
     * restriction: font
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-family0
     * 
     * values:
     * ```md
     * system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif: undefined

     * Arial, Helvetica, sans-serif: undefined

     * Cambria, Cochin, Georgia, Times, 'Times New Roman', serif: undefined

     * 'Courier New', Courier, monospace: undefined

     * cursive: undefined

     * fantasy: undefined

     * 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif: undefined

     * Georgia, 'Times New Roman', Times, serif: undefined

     * 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif: undefined

     * Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif: undefined

     * 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif: undefined

     * monospace: undefined

     * sans-serif: undefined

     * 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif: undefined

     * serif: undefined

     * 'Times New Roman', Times, serif: undefined

     * 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif: undefined

     * Verdana, Geneva, Tahoma, sans-serif: undefined
     * ```
     *
     * @param value -
     */
  fontFamily(
    value:
      | "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      | 'Arial, Helvetica, sans-serif'
      | "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
      | "'Courier New', Courier, monospace"
      | 'cursive'
      | 'fantasy'
      | "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      | "Georgia, 'Times New Roman', Times, serif"
      | "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
      | "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
      | "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"
      | 'monospace'
      | 'sans-serif'
      | "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      | 'serif'
      | "'Times New Roman', Times, serif"
      | "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
      | 'Verdana, Geneva, Tahoma, sans-serif'
      | (string & {}),
  ) {
    this.props.set('font-family', value)
    return this
  }

  /**
     * Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case..
     * 
     * syntax:  `body { font-feature-settings: 'hwid'; }`
     * 
     * restriction: string, integer
     * 
     * browsers: E,FF34,IE10
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-feature-settings
     * 
     * values:
     * ```md
     * aalt: Access All Alternates.

     * abvf: Above-base Forms. Required in Khmer script.

     * abvm: Above-base Mark Positioning. Required in Indic scripts.

     * abvs: Above-base Substitutions. Required in Indic scripts.

     * afrc: Alternative Fractions.

     * akhn: Akhand. Required in most Indic scripts.

     * blwf: Below-base Form. Required in a number of Indic scripts.

     * blwm: Below-base Mark Positioning. Required in Indic scripts.

     * blws: Below-base Substitutions. Required in Indic scripts.

     * calt: Contextual Alternates.

     * case: Case-Sensitive Forms. Applies only to European scripts; particularly prominent in Spanish-language setting.

     * ccmp: Glyph Composition/Decomposition.

     * cfar: Conjunct Form After Ro. Required in Khmer scripts.

     * cjct: Conjunct Forms. Required in Indic scripts that show similarity to Devanagari.

     * clig: Contextual Ligatures.

     * cpct: Centered CJK Punctuation. Used primarily in Chinese fonts.

     * cpsp: Capital Spacing. Should not be used in connecting scripts (e.g. most Arabic).

     * cswh: Contextual Swash.

     * curs: Cursive Positioning. Can be used in any cursive script.

     * c2pc: Petite Capitals From Capitals. Applies only to bicameral scripts.

     * c2sc: Small Capitals From Capitals. Applies only to bicameral scripts.

     * dist: Distances. Required in Indic scripts.

     * dlig: Discretionary ligatures.

     * dnom: Denominators.

     * dtls: Dotless Forms. Applied to math formula layout.

     * expt: Expert Forms. Applies only to Japanese.

     * falt: Final Glyph on Line Alternates. Can be used in any cursive script.

     * fin2: Terminal Form #2. Used only with the Syriac script.

     * fin3: Terminal Form #3. Used only with the Syriac script.

     * fina: Terminal Forms. Can be used in any alphabetic script.

     * flac: Flattened ascent forms. Applied to math formula layout.

     * frac: Fractions.

     * fwid: Full Widths. Applies to any script which can use monospaced forms.

     * half: Half Forms. Required in Indic scripts that show similarity to Devanagari.

     * haln: Halant Forms. Required in Indic scripts.

     * halt: Alternate Half Widths. Used only in CJKV fonts.

     * hist: Historical Forms.

     * hkna: Horizontal Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).

     * hlig: Historical Ligatures.

     * hngl: Hangul. Korean only.

     * hojo: Hojo Kanji Forms (JIS X 0212-1990 Kanji Forms). Used only with Kanji script.

     * hwid: Half Widths. Generally used only in CJKV fonts.

     * init: Initial Forms. Can be used in any alphabetic script.

     * isol: Isolated Forms. Can be used in any cursive script.

     * ital: Italics. Applies mostly to Latin; note that many non-Latin fonts contain Latin as well.

     * jalt: Justification Alternates. Can be used in any cursive script.

     * jp78: JIS78 Forms. Applies only to Japanese.

     * jp83: JIS83 Forms. Applies only to Japanese.

     * jp90: JIS90 Forms. Applies only to Japanese.

     * jp04: JIS2004 Forms. Applies only to Japanese.

     * kern: Kerning.

     * lfbd: Left Bounds.

     * liga: Standard Ligatures.

     * ljmo: Leading Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.

     * lnum: Lining Figures.

     * locl: Localized Forms.

     * ltra: Left-to-right glyph alternates.

     * ltrm: Left-to-right mirrored forms.

     * mark: Mark Positioning.

     * med2: Medial Form #2. Used only with the Syriac script.

     * medi: Medial Forms.

     * mgrk: Mathematical Greek.

     * mkmk: Mark to Mark Positioning.

     * nalt: Alternate Annotation Forms.

     * nlck: NLC Kanji Forms. Used only with Kanji script.

     * nukt: Nukta Forms. Required in Indic scripts..

     * numr: Numerators.

     * onum: Oldstyle Figures.

     * opbd: Optical Bounds.

     * ordn: Ordinals. Applies mostly to Latin script.

     * ornm: Ornaments.

     * palt: Proportional Alternate Widths. Used mostly in CJKV fonts.

     * pcap: Petite Capitals.

     * pkna: Proportional Kana. Generally used only in Japanese fonts.

     * pnum: Proportional Figures.

     * pref: Pre-base Forms. Required in Khmer and Myanmar (Burmese) scripts and southern Indic scripts that may display a pre-base form of Ra.

     * pres: Pre-base Substitutions. Required in Indic scripts.

     * pstf: Post-base Forms. Required in scripts of south and southeast Asia that have post-base forms for consonants eg: Gurmukhi, Malayalam, Khmer.

     * psts: Post-base Substitutions.

     * pwid: Proportional Widths.

     * qwid: Quarter Widths. Generally used only in CJKV fonts.

     * rand: Randomize.

     * rclt: Required Contextual Alternates. May apply to any script, but is especially important for many styles of Arabic.

     * rlig: Required Ligatures. Applies to Arabic and Syriac. May apply to some other scripts.

     * rkrf: Rakar Forms. Required in Devanagari and Gujarati scripts.

     * rphf: Reph Form. Required in Indic scripts. E.g. Devanagari, Kannada.

     * rtbd: Right Bounds.

     * rtla: Right-to-left alternates.

     * rtlm: Right-to-left mirrored forms.

     * ruby: Ruby Notation Forms. Applies only to Japanese.

     * salt: Stylistic Alternates.

     * sinf: Scientific Inferiors.

     * size: Optical size.

     * smcp: Small Capitals. Applies only to bicameral scripts.

     * smpl: Simplified Forms. Applies only to Chinese and Japanese.

     * ssty: Math script style alternates.

     * stch: Stretching Glyph Decomposition.

     * subs: Subscript.

     * sups: Superscript.

     * swsh: Swash. Does not apply to ideographic scripts.

     * titl: Titling.

     * tjmo: Trailing Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.

     * tnam: Traditional Name Forms. Applies only to Japanese.

     * tnum: Tabular Figures.

     * trad: Traditional Forms. Applies only to Chinese and Japanese.

     * twid: Third Widths. Generally used only in CJKV fonts.

     * unic: Unicase.

     * valt: Alternate Vertical Metrics. Applies only to scripts with vertical writing modes.

     * vatu: Vattu Variants. Used for Indic scripts. E.g. Devanagari.

     * vert: Vertical Alternates. Applies only to scripts with vertical writing modes.

     * vhal: Alternate Vertical Half Metrics. Used only in CJKV fonts.

     * vjmo: Vowel Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.

     * vkna: Vertical Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).

     * vkrn: Vertical Kerning.

     * vpal: Proportional Alternate Vertical Metrics. Used mostly in CJKV fonts.

     * vrt2: Vertical Alternates and Rotation. Applies only to scripts with vertical writing modes.

     * zero: Slashed Zero.

     * normal: No change in glyph substitution or positioning occurs.

     * off: Disable feature.

     * on: Enable feature.
     * ```
     *
     * @param value -
     */
  fontFeatureSettings(
    value:
      | 'aalt'
      | 'abvf'
      | 'abvm'
      | 'abvs'
      | 'afrc'
      | 'akhn'
      | 'blwf'
      | 'blwm'
      | 'blws'
      | 'calt'
      | 'case'
      | 'ccmp'
      | 'cfar'
      | 'cjct'
      | 'clig'
      | 'cpct'
      | 'cpsp'
      | 'cswh'
      | 'curs'
      | 'c2pc'
      | 'c2sc'
      | 'dist'
      | 'dlig'
      | 'dnom'
      | 'dtls'
      | 'expt'
      | 'falt'
      | 'fin2'
      | 'fin3'
      | 'fina'
      | 'flac'
      | 'frac'
      | 'fwid'
      | 'half'
      | 'haln'
      | 'halt'
      | 'hist'
      | 'hkna'
      | 'hlig'
      | 'hngl'
      | 'hojo'
      | 'hwid'
      | 'init'
      | 'isol'
      | 'ital'
      | 'jalt'
      | 'jp78'
      | 'jp83'
      | 'jp90'
      | 'jp04'
      | 'kern'
      | 'lfbd'
      | 'liga'
      | 'ljmo'
      | 'lnum'
      | 'locl'
      | 'ltra'
      | 'ltrm'
      | 'mark'
      | 'med2'
      | 'medi'
      | 'mgrk'
      | 'mkmk'
      | 'nalt'
      | 'nlck'
      | 'nukt'
      | 'numr'
      | 'onum'
      | 'opbd'
      | 'ordn'
      | 'ornm'
      | 'palt'
      | 'pcap'
      | 'pkna'
      | 'pnum'
      | 'pref'
      | 'pres'
      | 'pstf'
      | 'psts'
      | 'pwid'
      | 'qwid'
      | 'rand'
      | 'rclt'
      | 'rlig'
      | 'rkrf'
      | 'rphf'
      | 'rtbd'
      | 'rtla'
      | 'rtlm'
      | 'ruby'
      | 'salt'
      | 'sinf'
      | 'size'
      | 'smcp'
      | 'smpl'
      | 'ssty'
      | 'stch'
      | 'subs'
      | 'sups'
      | 'swsh'
      | 'titl'
      | 'tjmo'
      | 'tnam'
      | 'tnum'
      | 'trad'
      | 'twid'
      | 'unic'
      | 'valt'
      | 'vatu'
      | 'vert'
      | 'vhal'
      | 'vjmo'
      | 'vkna'
      | 'vkrn'
      | 'vpal'
      | 'vrt2'
      | 'zero'
      | 'normal'
      | 'off'
      | 'on'
      | (string & {}),
  ) {
    this.props.set('font-feature-settings', value)
    return this
  }

  /**
     * Kerning is the contextual adjustment of inter-glyph spacing. This property controls metric kerning, kerning that utilizes adjustment data contained in the font..
     * 
     * syntax:  `body { font-kerning: normal; }`
     * 
     * restriction: enum
     * 
     * browsers: C33,FF34,O20
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-kerning
     * 
     * values:
     * ```md
     * auto: Specifies that kerning is applied at the discretion of the user agent.

     * none: Specifies that kerning is not applied.

     * normal: Specifies that kerning is applied.
     * ```
     *
     * @param value -
     */
  fontKerning(value: 'auto' | 'none' | 'normal' | (string & {})) {
    this.props.set('font-kerning', value)
    return this
  }

  /**
     * The value of 'normal' implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering..
     * 
     * syntax:  `body { font-language-override: 'SRB'; }`
     * 
     * restriction: string
     * 
     * browsers: FF34
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-language-override-prop
     * 

     * @param value -
     */
  fontLanguageOverride(value: 'normal' | (string & {})) {
    this.props.set('font-language-override', value)
    return this
  }

  /**
     * Indicates the desired height of glyphs from the font. For scalable fonts, the font-size is a scale factor applied to the EM unit of the font. (Note that certain glyphs may bleed outside their EM box.) For non-scalable fonts, the font-size is converted into absolute units and matched against the declared font-size of the font, using the same absolute coordinate space for both of the matched values..
     * 
     * syntax:  `div { font-size: 12px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-size-prop
     * 
     * values:
     * ```md
     * large: undefined

     * larger: undefined

     * medium: undefined

     * small: undefined

     * smaller: undefined

     * x-large: undefined

     * x-small: undefined

     * xx-large: undefined

     * xx-small: undefined
     * ```
     *
     * @param value -
     */
  fontSize(
    value:
      | 'large'
      | 'larger'
      | 'medium'
      | 'small'
      | 'smaller'
      | 'x-large'
      | 'x-small'
      | 'xx-large'
      | 'xx-small'
      | (string & {}),
  ) {
    this.props.set('font-size', value)
    return this
  }

  /**
     * Preserves the readability of text when font fallback occurs by adjusting the font-size so that the x-height is the same regardless of the font used..
     * 
     * syntax:  `div { font-size-adjust: 0.58; }`
     * 
     * restriction: number
     * 
     * browsers: E,FF3,IE10
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-size-adjust
     * 

     * @param value -
     */
  fontSizeAdjust(value: number) {
    this.props.set('font-size-adjust', value)
    return this
  }

  /**
     * Selects a normal, condensed, or expanded face from a font family..
     * 
     * syntax:  `div { font-stretch: expanded; }`
     * 
     * restriction: enum
     * 
     * browsers: E,FF9,IE9
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-stretch0
     * 
     * values:
     * ```md
     * condensed: undefined

     * expanded: undefined

     * extra-condensed: undefined

     * extra-expanded: undefined

     * narrower: Indicates a narrower value relative to the width of the parent element.

     * normal: undefined

     * semi-condensed: undefined

     * semi-expanded: undefined

     * ultra-condensed: undefined

     * ultra-expanded: undefined

     * wider: Indicates a wider value relative to the width of the parent element.
     * ```
     *
     * @param value -
     */
  fontStretch(
    value:
      | 'condensed'
      | 'expanded'
      | 'extra-condensed'
      | 'extra-expanded'
      | 'narrower'
      | 'normal'
      | 'semi-condensed'
      | 'semi-expanded'
      | 'ultra-condensed'
      | 'ultra-expanded'
      | 'wider'
      | (string & {}),
  ) {
    this.props.set('font-stretch', value)
    return this
  }

  /**
     * Allows italic or oblique faces to be selected. Italic forms are generally cursive in nature while oblique faces are typically sloped versions of the regular face..
     * 
     * syntax:  `body { font-style: italic; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-style0
     * 
     * values:
     * ```md
     * italic: Selects a font that is labeled as an 'italic' face, or an 'oblique' face if one is not

     * normal: Selects a face that is classified as 'normal'.

     * oblique: Selects a font that is labeled as an 'oblique' face, or an 'italic' face if one is not.
     * ```
     *
     * @param value -
     */
  fontStyle(value: 'italic' | 'normal' | 'oblique' | (string & {})) {
    this.props.set('font-style', value)
    return this
  }

  /**
     * Controls whether user agents are allowed to synthesize bold or oblique font faces when a font family lacks bold or italic faces..
     * 
     * syntax:  `html:lang(ar) { font-synthesis: none; }`
     * 
     * restriction: enum
     * 
     * browsers: FF34,S9
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-synthesis
     * 
     * values:
     * ```md
     * none: Disallow all synthetic faces.

     * style: Allow synthetic italic faces.

     * weight: Allow synthetic bold faces.
     * ```
     *
     * @param value -
     */
  fontSynthesis(value: 'none' | 'style' | 'weight' | (string & {})) {
    this.props.set('font-synthesis', value)
    return this
  }

  /**
     * Specifies variant representations of the font.
     * 
     * syntax:  `div { font-variant: small-caps; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-variant-prop
     * 
     * values:
     * ```md
     * normal: Specifies a face that is not labeled as a small-caps font.

     * small-caps: Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font.
     * ```
     *
     * @param value -
     */
  fontVariant(value: 'normal' | 'small-caps' | (string & {})) {
    this.props.set('font-variant', value)
    return this
  }

  /**
     * For any given character, fonts can provide a variety of alternate glyphs in addition to the default glyph for that character. This property provides control over the selection of these alternate glyphs..
     * 
     * syntax:  `h2 { font-variant-alternates: styleset(3,5); }`
     * 
     * restriction: enum
     * 
     * browsers: FF34
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-variant-alternates
     * 
     * values:
     * ```md
     * annotation(): Enables display of alternate annotation forms.

     * character-variant(): Enables display of specific character variants.

     * historical-forms: Enables display of historical forms.

     * normal: None of the features are enabled.

     * ornaments(): Enables replacement of default glyphs with ornaments, if provided in the font.

     * styleset(): Enables display with stylistic sets.

     * stylistic(): Enables display of stylistic alternates.

     * swash(): Enables display of swash glyphs.
     * ```
     *
     * @param value -
     */
  fontVariantAlternates(
    value:
      | 'annotation()'
      | 'character-variant()'
      | 'historical-forms'
      | 'normal'
      | 'ornaments()'
      | 'styleset()'
      | 'stylistic()'
      | 'swash()'
      | (string & {}),
  ) {
    this.props.set('font-variant-alternates', value)
    return this
  }

  /**
     * Specifies control over capitalized forms..
     * 
     * syntax:  `p { font-variant-caps: titling-caps; }`
     * 
     * restriction: enum
     * 
     * browsers: FF34
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-variant-caps-prop
     * 
     * values:
     * ```md
     * all-petite-caps: Enables display of petite capitals for both upper and lowercase letters.

     * all-small-caps: Enables display of small capitals for both upper and lowercase letters.

     * normal: None of the features are enabled.

     * petite-caps: Enables display of petite capitals.

     * small-caps: Enables display of small capitals. Small-caps glyphs typically use the form of uppercase letters but are reduced to the size of lowercase letters.

     * titling-caps: Enables display of titling capitals.

     * unicase: Enables display of mixture of small capitals for uppercase letters with normal lowercase letters.
     * ```
     *
     * @param value -
     */
  fontVariantCaps(
    value:
      | 'all-petite-caps'
      | 'all-small-caps'
      | 'normal'
      | 'petite-caps'
      | 'small-caps'
      | 'titling-caps'
      | 'unicase'
      | (string & {}),
  ) {
    this.props.set('font-variant-caps', value)
    return this
  }

  /**
     * Allows control of glyph substitute and positioning in East Asian text..
     * 
     * syntax:  `mark { font-variant-east-asian: normal; }`
     * 
     * restriction: enum
     * 
     * browsers: FF34
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-variant-east-asian-prop
     * 
     * values:
     * ```md
     * full-width: Enables rendering of full-width variants.

     * jis04: Enables rendering of JIS04 forms.

     * jis78: Enables rendering of JIS78 forms.

     * jis83: Enables rendering of JIS83 forms.

     * jis90: Enables rendering of JIS90 forms.

     * normal: None of the features are enabled.

     * proportional-width: Enables rendering of proportionally-spaced variants.

     * ruby: Enables display of ruby variant glyphs.

     * simplified: Enables rendering of simplified forms.

     * traditional: Enables rendering of traditional forms.
     * ```
     *
     * @param value -
     */
  fontVariantEastAsian(
    value:
      | 'full-width'
      | 'jis04'
      | 'jis78'
      | 'jis83'
      | 'jis90'
      | 'normal'
      | 'proportional-width'
      | 'ruby'
      | 'simplified'
      | 'traditional'
      | (string & {}),
  ) {
    this.props.set('font-variant-east-asian', value)
    return this
  }

  /**
     * Specifies control over which ligatures are enabled or disabled. A value of 'normal' implies that the defaults set by the font are used..
     * 
     * syntax:  `div { font-variant-ligatures: historical-ligatures; }`
     * 
     * restriction: enum
     * 
     * browsers: C18,FF34,O15,S6
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-variant-ligatures-prop
     * 
     * values:
     * ```md
     * additional-ligatures: Enables display of additional ligatures.

     * common-ligatures: Enables display of common ligatures.

     * contextual: Enables display of contextual alternates.

     * discretionary-ligatures: Enables display of discretionary ligatures.

     * historical-ligatures: Enables display of historical ligatures.

     * no-additional-ligatures: Disables display of additional ligatures.

     * no-common-ligatures: Disables display of common ligatures.

     * no-contextual: Disables display of contextual alternates.

     * no-discretionary-ligatures: Disables display of discretionary ligatures.

     * no-historical-ligatures: Disables display of historical ligatures.

     * none: Disables all ligatures.

     * normal: Implies that the defaults set by the font are used.
     * ```
     *
     * @param value -
     */
  fontVariantLigatures(
    value:
      | 'additional-ligatures'
      | 'common-ligatures'
      | 'contextual'
      | 'discretionary-ligatures'
      | 'historical-ligatures'
      | 'no-additional-ligatures'
      | 'no-common-ligatures'
      | 'no-contextual'
      | 'no-discretionary-ligatures'
      | 'no-historical-ligatures'
      | 'none'
      | 'normal'
      | (string & {}),
  ) {
    this.props.set('font-variant-ligatures', value)
    return this
  }

  /**
     * Specifies control over numerical forms..
     * 
     * syntax:  `.amount { font-variant-numeric: oldstyle-nums diagonal-fractions; }`
     * 
     * restriction: enum
     * 
     * browsers: FF34
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-variant-numeric-prop
     * 
     * values:
     * ```md
     * diagonal-fractions: Enables display of lining diagonal fractions.

     * lining-nums: Enables display of lining numerals.

     * normal: None of the features are enabled.

     * oldstyle-nums: Enables display of old-style numerals.

     * ordinal: Enables display of letter forms used with ordinal numbers.

     * proportional-nums: Enables display of proportional numerals.

     * slashed-zero: Enables display of slashed zeros.

     * stacked-fractions: Enables display of lining stacked fractions.

     * tabular-nums: Enables display of tabular numerals.
     * ```
     *
     * @param value -
     */
  fontVariantNumeric(
    value:
      | 'diagonal-fractions'
      | 'lining-nums'
      | 'normal'
      | 'oldstyle-nums'
      | 'ordinal'
      | 'proportional-nums'
      | 'slashed-zero'
      | 'stacked-fractions'
      | 'tabular-nums'
      | (string & {}),
  ) {
    this.props.set('font-variant-numeric', value)
    return this
  }

  /**
     * Specifies the vertical position.
     * 
     * syntax:  `sub { font-variant-position: subscript; }`
     * 
     * restriction: enum
     * 
     * browsers: FF34
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-variant-position
     * 
     * values:
     * ```md
     * normal: None of the features are enabled.

     * sub: Enables display of subscript variants (OpenType feature: subs).

     * super: Enables display of superscript variants (OpenType feature: sups).
     * ```
     *
     * @param value -
     */
  fontVariantPosition(value: 'normal' | 'sub' | 'super' | (string & {})) {
    this.props.set('font-variant-position', value)
    return this
  }

  /**
     * Specifies weight of glyphs in the font, their degree of blackness or stroke thickness..
     * 
     * syntax:  `th { font-weight: bold; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#font-weight-the-font-weight-property
     * 
     * values:
     * ```md
     * 100: Thin

     * 200: Extra Light (Ultra Light)

     * 300: Light

     * 400: Normal

     * 500: Medium

     * 600: Semi Bold (Demi Bold)

     * 700: Bold

     * 800: Extra Bold (Ultra Bold)

     * 900: Black (Heavy)

     * bold: Same as 700

     * bolder: Specifies the weight of the face bolder than the inherited value.

     * lighter: Specifies the weight of the face lighter than the inherited value.

     * normal: Same as 400
     * ```
     *
     * @param value -
     */
  fontWeight(
    value:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'bold'
      | 'bolder'
      | 'lighter'
      | 'normal'
      | (string & {}),
  ) {
    this.props.set('font-weight', value)
    return this
  }

  /**
     * Controls glyph orientation when the inline-progression-direction is horizontal..
     * 
     * syntax:  ` `
     * 
     * restriction: angle, number
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/text.html#GlyphOrientationHorizontal
     * 

     * @param value -
     */
  glyphOrientationHorizontal(value: string) {
    this.props.set('glyph-orientation-horizontal', value)
    return this
  }

  /**
     * Controls glyph orientation when the inline-progression-direction is vertical..
     * 
     * syntax:  ` `
     * 
     * restriction: angle, number, enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/text.html#GlyphOrientationVertical
     * 

     * @param value -
     */
  glyphOrientationVertical(value: 'auto' | (string & {})) {
    this.props.set('glyph-orientation-vertical', value)
    return this
  }

  /**
     * Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement. Shorthand for 'grid-row-start', 'grid-column-start', 'grid-row-end', and 'grid-column-end'..
     * 
     * syntax:  `div { grid-area: span 3; }`
     * 
     * restriction: identifier, integer
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-area
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridArea(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-area', value)
    return this
  }

  /**
     * The grid CSS property is a shorthand property that sets all of the explicit grid properties ('grid-template-rows', 'grid-template-columns', and 'grid-template-areas'), and all the implicit grid properties ('grid-auto-rows', 'grid-auto-columns', and 'grid-auto-flow'), in a single declaration..
     * 
     * syntax:  `div { grid: span 3; }`
     * 
     * restriction: identifier, length, percentage, string, enum
     * 
     * browsers: FF52,C57,E16,S10.1,O44
     * 
     * ref: https://drafts.csswg.org/css-grid/#propdef-grid
     * 

     * @param value -
     */
  grid(value: string) {
    this.props.set('grid', value)
    return this
  }

  /**
     * Specifies the size of implicitly created columns..
     * 
     * syntax:  `div { grid-auto-columns: 100px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-auto-columns
     * 
     * values:
     * ```md
     * min-content: Represents the largest min-content contribution of the grid items occupying the grid track.

     * max-content: Represents the largest max-content contribution of the grid items occupying the grid track.

     * auto: As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.

     * minmax(): Defines a size range greater than or equal to min and less than or equal to max.
     * ```
     *
     * @param value -
     */
  gridAutoColumns(
    value: 'min-content' | 'max-content' | 'auto' | 'minmax()' | (string & {}),
  ) {
    this.props.set('grid-auto-columns', value)
    return this
  }

  /**
     * Controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid..
     * 
     * syntax:  `div { grid-auto-flow: column; }`
     * 
     * restriction: enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-auto-flow
     * 
     * values:
     * ```md
     * row: The auto-placement algorithm places items by filling each row in turn, adding new rows as necessary.

     * column: The auto-placement algorithm places items by filling each column in turn, adding new columns as necessary.

     * dense: If specified, the auto-placement algorithm uses a "dense" packing algorithm, which attempts to fill in holes earlier in the grid if smaller items come up later.
     * ```
     *
     * @param value -
     */
  gridAutoFlow(value: 'row' | 'column' | 'dense' | (string & {})) {
    this.props.set('grid-auto-flow', value)
    return this
  }

  /**
     * Specifies the size of implicitly created rows..
     * 
     * syntax:  `div { grid-auto-rows: 100px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-auto-rows
     * 
     * values:
     * ```md
     * min-content: Represents the largest min-content contribution of the grid items occupying the grid track.

     * max-content: Represents the largest max-content contribution of the grid items occupying the grid track.

     * auto: As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.

     * minmax(): Defines a size range greater than or equal to min and less than or equal to max.
     * ```
     *
     * @param value -
     */
  gridAutoRows(
    value: 'min-content' | 'max-content' | 'auto' | 'minmax()' | (string & {}),
  ) {
    this.props.set('grid-auto-rows', value)
    return this
  }

  /**
     * Shorthand for 'grid-column-start' and 'grid-column-end'..
     * 
     * syntax:  `#item1 { grid-column: span 2 / auto; }`
     * 
     * restriction: identifier, integer, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-column
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridColumn(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-column', value)
    return this
  }

  /**
     * Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement..
     * 
     * syntax:  `#item1 { grid-column-end: span 2; }`
     * 
     * restriction: identifier, integer, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-column-end
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridColumnEnd(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-column-end', value)
    return this
  }

  /**
     * Specifies the gutters between grid columns. Replaced by 'column-gap' property..
     * 
     * syntax:  `#item1 { grid-column-gap: 2em; }`
     * 
     * restriction: length
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-column-gap
     * 

     * @param value -
     */
  gridColumnGap(value: string) {
    this.props.set('grid-column-gap', value)
    return this
  }

  /**
     * Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement..
     * 
     * syntax:  `#item1 { grid-column-start: span 2; }`
     * 
     * restriction: identifier, integer, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-column-start
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridColumnStart(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-column-start', value)
    return this
  }

  /**
     * Shorthand that specifies the gutters between grid columns and grid rows in one declaration. Replaced by 'gap' property..
     * 
     * syntax:  `#item1 { grid-gap: 2em 1em; }`
     * 
     * restriction: length
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-gap
     * 

     * @param value -
     */
  gridGap(value: string) {
    this.props.set('grid-gap', value)
    return this
  }

  /**
     * Shorthand for 'grid-row-start' and 'grid-row-end'..
     * 
     * syntax:  `#item1 { grid-row: span 2 / auto; }`
     * 
     * restriction: identifier, integer, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-row
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridRow(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-row', value)
    return this
  }

  /**
     * Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement..
     * 
     * syntax:  `#item1 { grid-row-end: span 2; }`
     * 
     * restriction: identifier, integer, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-row-end
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridRowEnd(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-row-end', value)
    return this
  }

  /**
     * Specifies the gutters between grid rows. Replaced by 'row-gap' property..
     * 
     * syntax:  `#item1 { grid-row-gap: 2em; }`
     * 
     * restriction: length
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-row-gap
     * 

     * @param value -
     */
  gridRowGap(value: string) {
    this.props.set('grid-row-gap', value)
    return this
  }

  /**
     * Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement..
     * 
     * syntax:  `#item1 { grid-row-start: span 2; }`
     * 
     * restriction: identifier, integer, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-row-start
     * 
     * values:
     * ```md
     * auto: The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.

     * span: Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.
     * ```
     *
     * @param value -
     */
  gridRowStart(value: 'auto' | 'span' | (string & {})) {
    this.props.set('grid-row-start', value)
    return this
  }

  /**
     * Shorthand for setting grid-template-columns, grid-template-rows, and grid-template-areas in a single declaration..
     * 
     * syntax:  `#item1 { grid-template: auto 1fr auto / auto 1fr; }`
     * 
     * restriction: identifier, length, percentage, string, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-template
     * 
     * values:
     * ```md
     * none: Sets all three properties to their initial values.

     * min-content: Represents the largest min-content contribution of the grid items occupying the grid track.

     * max-content: Represents the largest max-content contribution of the grid items occupying the grid track.

     * auto: As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.

     * subgrid: Sets 'grid-template-rows' and 'grid-template-columns' to 'subgrid', and 'grid-template-areas' to its initial value.

     * minmax(): Defines a size range greater than or equal to min and less than or equal to max.

     * repeat(): Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.
     * ```
     *
     * @param value -
     */
  gridTemplate(
    value:
      | 'none'
      | 'min-content'
      | 'max-content'
      | 'auto'
      | 'subgrid'
      | 'minmax()'
      | 'repeat()'
      | (string & {}),
  ) {
    this.props.set('grid-template', value)
    return this
  }

  /**
     * Specifies named grid areas, which are not associated with any particular grid item, but can be referenced from the grid-placement properties..
     * 
     * syntax:  `#item1 { grid-template-areas: 'head head' 'nav main' 'foot foot'; }`
     * 
     * restriction: string
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-template-areas
     * 

     * @param value -
     */
  gridTemplateAreas(value: 'none' | (string & {})) {
    this.props.set('grid-template-areas', value)
    return this
  }

  /**
     * specifies, as a space-separated track list, the line names and track sizing functions of the grid..
     * 
     * syntax:  `#item1 { grid-template-columns: 100px 1fr max-content minmax(min-content, 1fr); }`
     * 
     * restriction: identifier, length, percentage, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-template-columns
     * 
     * values:
     * ```md
     * none: There is no explicit grid; any rows/columns will be implicitly generated.

     * min-content: Represents the largest min-content contribution of the grid items occupying the grid track.

     * max-content: Represents the largest max-content contribution of the grid items occupying the grid track.

     * auto: As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.

     * subgrid: Indicates that the grid will align to its parent grid in that axis.

     * minmax(): Defines a size range greater than or equal to min and less than or equal to max.

     * repeat(): Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.
     * ```
     *
     * @param value -
     */
  gridTemplateColumns(
    value:
      | 'none'
      | 'min-content'
      | 'max-content'
      | 'auto'
      | 'subgrid'
      | 'minmax()'
      | 'repeat()'
      | (string & {}),
  ) {
    this.props.set('grid-template-columns', value)
    return this
  }

  /**
     * specifies, as a space-separated track list, the line names and track sizing functions of the grid..
     * 
     * syntax:  `#item1 { grid-template-rows: 100px 1fr max-content minmax(min-content, 1fr); }`
     * 
     * restriction: identifier, length, percentage, string, enum
     * 
     * browsers: FF52,C57,S10.1,O44
     * 
     * ref: http://www.w3.org/TR/css-grid-1/#propdef-grid-template-rows
     * 
     * values:
     * ```md
     * none: There is no explicit grid; any rows/columns will be implicitly generated.

     * min-content: Represents the largest min-content contribution of the grid items occupying the grid track.

     * max-content: Represents the largest max-content contribution of the grid items occupying the grid track.

     * auto: As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.

     * subgrid: Indicates that the grid will align to its parent grid in that axis.

     * minmax(): Defines a size range greater than or equal to min and less than or equal to max.

     * repeat(): Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.
     * ```
     *
     * @param value -
     */
  gridTemplateRows(
    value:
      | 'none'
      | 'min-content'
      | 'max-content'
      | 'auto'
      | 'subgrid'
      | 'minmax()'
      | 'repeat()'
      | (string & {}),
  ) {
    this.props.set('grid-template-rows', value)
    return this
  }

  /**
     * Specifies the height of the content area, padding area or border area (depending on 'box-sizing') of certain boxes..
     * 
     * syntax:  `footer { height: 100px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#height
     * 
     * values:
     * ```md
     * auto: The height depends on the values of other properties.

     * fill: Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.

     * fit-content: Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.

     * max-content: Use the max-content inline size or max-content block size, as appropriate to the writing mode.

     * min-content: Use the min-content inline size or min-content block size, as appropriate to the writing mode.
     * ```
     *
     * @param value -
     */
  height(
    value:
      | 'auto'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('height', value)
    return this
  }

  /**
     * Controls whether hyphenation is allowed to create more break opportunities within a line of text..
     * 
     * syntax:  `div { hyphens: manual; }`
     * 
     * restriction: enum
     * 
     * browsers: C55,FF43,O44
     * 
     * ref: http://www.w3.org/TR/css-text-3/#hyphens-property
     * 
     * values:
     * ```md
     * auto: Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.

     * manual: Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities

     * none: Words are not broken at line breaks, even if characters inside the word suggest line break points.
     * ```
     *
     * @param value -
     */
  hyphens(value: 'auto' | 'manual' | 'none' | (string & {})) {
    this.props.set('hyphens', value)
    return this
  }

  /**
     * Specifies an orthogonal rotation to be applied to an image before it is laid out..
     * 
     * syntax:  `img.ninety { image-orientation: 90deg; }`
     * 
     * restriction: angle
     * 
     * browsers: FF26
     * 
     * ref: http://www.w3.org/TR/css4-images/#image-orientation
     * 
     * values:
     * ```md
     * flip: After rotating by the precededing angle, the image is flipped horizontally. Defaults to 0deg if the angle is ommitted.

     * from-image: If the image has an orientation specified in its metadata, such as EXIF, this value computes to the angle that the metadata specifies is necessary to correctly orient the image.
     * ```
     *
     * @param value -
     */
  imageOrientation(value: 'flip' | 'from-image' | (string & {})) {
    this.props.set('image-orientation', value)
    return this
  }

  /**
     * Provides a hint to the user-agent about what aspects of an image are most important to preserve when the image is scaled, to aid the user-agent in the choice of an appropriate scaling algorithm..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: C,FF3.6,O11.6,S
     * 
     * ref: https://drafts.csswg.org/css-images-3/#the-image-rendering
     * 
     * values:
     * ```md
     * auto: The image should be scaled with an algorithm that maximizes the appearance of the image.

     * crisp-edges: The image must be scaled with an algorithm that preserves contrast and edges in the image, and which does not smooth colors or introduce blur to the image in the process.

     * -moz-crisp-edges: undefined

     * optimizeQuality: Deprecated.

     * optimizeSpeed: Deprecated.

     * pixelated: When scaling the image up, the 'nearest neighbor' or similar algorithm must be used, so that the image appears to be simply composed of very large pixels.
     * ```
     *
     * @param value -
     */
  imageRendering(
    value:
      | 'auto'
      | 'crisp-edges'
      | '-moz-crisp-edges'
      | 'optimizeQuality'
      | 'optimizeSpeed'
      | 'pixelated'
      | (string & {}),
  ) {
    this.props.set('image-rendering', value)
    return this
  }

  /**
     * Controls the state of the input method editor for text fields..
     * 
     * syntax:  `body { ime-mode: active; }`
     * 
     * restriction: enum
     * 
     * browsers: E,FF3,IE5
     * 
     * ref: http://www.w3.org/TR/css3-ui/#ime-mode
     * 
     * values:
     * ```md
     * active: The input method editor is initially active; text entry is performed using it unless the user specifically dismisses it.

     * auto: No change is made to the current input method editor state. This is the default.

     * disabled: The input method editor is disabled and may not be activated by the user.

     * inactive: The input method editor is initially inactive, but the user may activate it if they wish.

     * normal: The IME state should be normal; this value can be used in a user style sheet to override the page setting.
     * ```
     *
     * @param value -
     */
  imeMode(
    value:
      | 'active'
      | 'auto'
      | 'disabled'
      | 'inactive'
      | 'normal'
      | (string & {}),
  ) {
    this.props.set('ime-mode', value)
    return this
  }

  /**
     * Size of an element in the direction specified by 'writing-mode'..
     * 
     * syntax:  `header { inline-size: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#propdef-inline-size
     * 

     * @param value -
     */
  inlineSize(value: 'auto' | (string & {})) {
    this.props.set('inline-size', value)
    return this
  }

  /**
     * In CSS setting to 'isolate' will turn the element into a stacking context. In SVG, it defines whether an element is isolated or not..
     * 
     * syntax:  `div { isolation: isolate; }`
     * 
     * restriction: enum
     * 
     * browsers: C,FF,O,S
     * 
     * ref: http://www.w3.org/TR/compositing-1/#isolation
     * 
     * values:
     * ```md
     * auto: Elements are not isolated unless an operation is applied that causes the creation of a stacking context.

     * isolate: In CSS will turn the element into a stacking context.
     * ```
     *
     * @param value -
     */
  isolation(value: 'auto' | 'isolate' | (string & {})) {
    this.props.set('isolation', value)
    return this
  }

  /**
     * Aligns flex items along the main axis of the current line of the flex container..
     * 
     * syntax:  `p { justify-content: flex-start; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#align-content
     * 
     * values:
     * ```md
     * center: Flex items are packed toward the center of the line.

     * start: The items are packed flush to each other toward the start edge of the alignment container in the main axis.

     * end: The items are packed flush to each other toward the end edge of the alignment container in the main axis.

     * left: The items are packed flush to each other toward the left edge of the alignment container in the main axis.

     * right: The items are packed flush to each other toward the right edge of the alignment container in the main axis.

     * safe: If the size of the item overflows the alignment container, the item is instead aligned as if the alignment mode were start.

     * unsafe: Regardless of the relative sizes of the item and alignment container, the given alignment value is honored.

     * stretch: If the combined size of the alignment subjects is less than the size of the alignment container, any auto-sized alignment subjects have their size increased equally (not proportionally), while still respecting the constraints imposed by max-height/max-width (or equivalent functionality), so that the combined size exactly fills the alignment container.

     * space-evenly: The items are evenly distributed within the alignment container along the main axis.

     * flex-end: Flex items are packed toward the end of the line.

     * flex-start: Flex items are packed toward the start of the line.

     * space-around: Flex items are evenly distributed in the line, with half-size spaces on either end.

     * space-between: Flex items are evenly distributed in the line.

     * baseline: Specifies participation in first-baseline alignment.

     * first baseline: Specifies participation in first-baseline alignment.

     * last baseline: Specifies participation in last-baseline alignment.
     * ```
     *
     * @param value -
     */
  justifyContent(
    value:
      | 'center'
      | 'start'
      | 'end'
      | 'left'
      | 'right'
      | 'safe'
      | 'unsafe'
      | 'stretch'
      | 'space-evenly'
      | 'flex-end'
      | 'flex-start'
      | 'space-around'
      | 'space-between'
      | 'baseline'
      | 'first baseline'
      | 'last baseline'
      | (string & {}),
  ) {
    this.props.set('justify-content', value)
    return this
  }

  /**
     * Indicates whether the user agent should adjust inter-glyph spacing based on kerning tables that are included in the relevant font or instead disable auto-kerning and set inter-character spacing to a specific length..
     * 
     * syntax:  ` `
     * 
     * restriction: length, enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG11/text.html#KerningProperty
     * 

     * @param value -
     */
  kerning(value: 'auto' | (string & {})) {
    this.props.set('kerning', value)
    return this
  }

  /**
     * Specifies how far an absolutely positioned box's left margin edge is offset to the right of the left edge of the box's 'containing block'..
     * 
     * syntax:  `article { left: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-positioning/#propdef-left
     * 

     * @param value -
     */
  left(value: 'auto' | (string & {})) {
    this.props.set('left', value)
    return this
  }

  /**
     * Specifies the minimum, maximum, and optimal spacing between grapheme clusters..
     * 
     * syntax:  `h2 { letter-spacing: 2px; }`
     * 
     * restriction: length
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-text/#letter-spacing0
     * 

     * @param value -
     */
  letterSpacing(value: 'normal' | (string & {})) {
    this.props.set('letter-spacing', value)
    return this
  }

  /**
     * Defines the color of the light source for filter primitives 'feDiffuseLighting' and 'feSpecularLighting'..
     * 
     * syntax:  ` `
     * 
     * restriction: color
     * 
     * browsers: E,C5,FF3,IE10,O9,S6
     * 
     * ref: http://www.w3.org/TR/filter-effects/#LightingColorProperty
     * 

     * @param value -
     */
  lightingColor(value: string) {
    this.props.set('lighting-color', value)
    return this
  }

  /**
     * Specifies what set of line breaking restrictions are in effect within the element..
     * 
     * syntax:  `p { line-break: normal; }`
     * 
     * restriction: enum
     * 
     * browsers: E,IE5.5,C58,O45,S
     * 
     * ref: http://www.w3.org/TR/css3-text/#line-break0
     * 
     * values:
     * ```md
     * auto: The UA determines the set of line-breaking restrictions to use for CJK scripts, and it may vary the restrictions based on the length of the line; e.g., use a less restrictive set of line-break rules for short lines.

     * loose: Breaks text using the least restrictive set of line-breaking rules. Typically used for short lines, such as in newspapers.

     * normal: Breaks text using the most common set of line-breaking rules.

     * strict: Breaks CJK scripts using a more restrictive set of line-breaking rules than 'normal'.

     * anywhere: There is a soft wrap opportunity around every typographic character unit, including around any punctuation character or preserved white spaces, or in the middle of words, disregarding any prohibition against line breaks, even those introduced by characters with the GL, WJ, or ZWJ line breaking classes or mandated by the word-break property.
     * ```
     *
     * @param value -
     */
  lineBreak(
    value: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | (string & {}),
  ) {
    this.props.set('line-break', value)
    return this
  }

  /**
     * Determines the block-progression dimension of the text content area of an inline box..
     * 
     * syntax:  `#menu { line-height: 22px; }`
     * 
     * restriction: number, length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-linebox/#line-height
     * 

     * @param value -
     */
  lineHeight(value: 'normal' | (string & {})) {
    this.props.set('line-height', value)
    return this
  }

  /**
     * Shorthand for setting 'list-style-type', 'list-style-position' and 'list-style-image'.
     * 
     * syntax:  `ul { list-style: square url('square.png');}`
     * 
     * restriction: image, enum, url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-lists/#list-style
     * 
     * values:
     * ```md
     * armenian: undefined

     * circle: A hollow circle.

     * decimal: undefined

     * decimal-leading-zero: undefined

     * disc: A filled circle.

     * georgian: undefined

     * hanging: As 'inside', except the marker is instead placed immediately before the first text or significant whitespace in the list item or its children

     * inside: The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.

     * lower-alpha: undefined

     * lower-greek: undefined

     * lower-latin: undefined

     * lower-roman: undefined

     * none: undefined

     * outside: The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.

     * square: A filled square.

     * symbols(): Allows a counter style to be defined inline.

     * upper-alpha: undefined

     * upper-latin: undefined

     * upper-roman: undefined

     * url(): undefined
     * ```
     *
     * @param value -
     */
  listStyle(
    value:
      | 'armenian'
      | 'circle'
      | 'decimal'
      | 'decimal-leading-zero'
      | 'disc'
      | 'georgian'
      | 'hanging'
      | 'inside'
      | 'lower-alpha'
      | 'lower-greek'
      | 'lower-latin'
      | 'lower-roman'
      | 'none'
      | 'outside'
      | 'square'
      | 'symbols()'
      | 'upper-alpha'
      | 'upper-latin'
      | 'upper-roman'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('list-style', value)
    return this
  }

  /**
     * Sets the image that will be used as the list item marker. When the image is available, it will replace the marker set with the 'list-style-type' marker..
     * 
     * syntax:  `<uri> | none`
     * 
     * restriction: image
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-lists/#list-style-image
     * 

     * @param value -
     */
  listStyleImage(value: 'none' | (string & {})) {
    this.props.set('list-style-image', value)
    return this
  }

  /**
     * Specifies the position of the '::marker' pseudo-element's box in the list item..
     * 
     * syntax:  `ul { list-style-position: inside; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-lists/#list-style-position
     * 
     * values:
     * ```md
     * inside: The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.

     * outside: The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.
     * ```
     *
     * @param value -
     */
  listStylePosition(value: 'inside' | 'outside' | (string & {})) {
    this.props.set('list-style-position', value)
    return this
  }

  /**
     * Used to construct the default contents of a list item's marker.
     * 
     * syntax:  `<glyph> | <algorithmic> | <numeric> | <alphabetic> | <symbolic> | <non-repeating> | normal | none`
     * 
     * restriction: enum, string
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-lists/#list-style-type
     * 
     * values:
     * ```md
     * arabic-indic: Arabic-indic numbering.

     * armenian: Traditional uppercase Armenian numbering.

     * bengali: Bengali numbering.

     * cambodian: Cambodian/Khmer numbering.

     * circle: A hollow circle.

     * cjk-decimal: Han decimal numbers.

     * cjk-earthly-branch: Han "Earthly Branch" ordinals.

     * cjk-heavenly-stem: Han "Heavenly Stem" ordinals.

     * decimal: Western decimal numbers.

     * decimal-leading-zero: Decimal numbers padded by initial zeros.

     * devanagari: Devanagari numbering.

     * disc: A filled circle.

     * disclosure-closed: Symbols appropriate for indicating a closed disclosure widget.

     * disclosure-open: Symbols appropriate for indicating an open disclosure widget.

     * georgian: Traditional Georgian numbering.

     * gujarati: Gujarati numbering.

     * gurmukhi: Gurmukhi numbering.

     * hebrew: Traditional Hebrew numbering.

     * hiragana: Dictionary-order hiragana lettering

     * hiragana-iroha: Iroha-order hiragana lettering

     * kannada: Kannada numbering.

     * katakana: Dictionary-order katakana lettering

     * katakana-iroha: Iroha-order katakana lettering

     * khmer: Cambodian/Khmer numbering.

     * lao: Laotian numbering.

     * lower-alpha: Lowercase ASCII letters.

     * lower-armenian: Lowercase Armenian numbering.

     * lower-greek: Lowercase classical Greek.

     * lower-latin: Lowercase ASCII letters.

     * lower-roman: Lowercase ASCII Roman numerals.

     * malayalam: Malayalam numbering.

     * mongolian: Mongolian numbering.

     * myanmar: Myanmar (Burmese) numbering.

     * none: No marker

     * oriya: Oriya numbering.

     * persian: Persian numbering.

     * square: A filled square.

     * tamil: Tamil numbering.

     * telugu: Telugu numbering.

     * thai: Thai (Siamese) numbering.

     * tibetan: Tibetan numbering.

     * symbols(): Allows a counter style to be defined inline.

     * upper-alpha: Uppercase ASCII letters.

     * upper-armenian: Traditional uppercase Armenian numbering.

     * upper-latin: Uppercase ASCII letters.

     * upper-roman: Uppercase ASCII Roman numerals.
     * ```
     *
     * @param value -
     */
  listStyleType(
    value:
      | 'arabic-indic'
      | 'armenian'
      | 'bengali'
      | 'cambodian'
      | 'circle'
      | 'cjk-decimal'
      | 'cjk-earthly-branch'
      | 'cjk-heavenly-stem'
      | 'decimal'
      | 'decimal-leading-zero'
      | 'devanagari'
      | 'disc'
      | 'disclosure-closed'
      | 'disclosure-open'
      | 'georgian'
      | 'gujarati'
      | 'gurmukhi'
      | 'hebrew'
      | 'hiragana'
      | 'hiragana-iroha'
      | 'kannada'
      | 'katakana'
      | 'katakana-iroha'
      | 'khmer'
      | 'lao'
      | 'lower-alpha'
      | 'lower-armenian'
      | 'lower-greek'
      | 'lower-latin'
      | 'lower-roman'
      | 'malayalam'
      | 'mongolian'
      | 'myanmar'
      | 'none'
      | 'oriya'
      | 'persian'
      | 'square'
      | 'tamil'
      | 'telugu'
      | 'thai'
      | 'tibetan'
      | 'symbols()'
      | 'upper-alpha'
      | 'upper-armenian'
      | 'upper-latin'
      | 'upper-roman'
      | (string & {}),
  ) {
    this.props.set('list-style-type', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..
     * 
     * syntax:  `div { margin: 4px 7px 2px 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#margin1
     * 
     * values:
     * ```md
     * auto: undefined

     * logical: Indicates that the values map to the logical properties instead of the physical ones.
     * ```
     *
     * @param value -
     */
  margin(value: 'auto' | 'logical' | (string & {})) {
    this.props.set('margin', value)
    return this
  }

  /**
     * Logical 'margin-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `div { margin-block-end: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  marginBlockEnd(value: 'auto' | (string & {})) {
    this.props.set('margin-block-end', value)
    return this
  }

  /**
     * Logical 'margin-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `div { margin-block-start: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  marginBlockStart(value: 'auto' | (string & {})) {
    this.props.set('margin-block-start', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits...
     * 
     * syntax:  `div { margin-bottom: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#margin1
     * 

     * @param value -
     */
  marginBottom(value: 'auto' | (string & {})) {
    this.props.set('margin-bottom', value)
    return this
  }

  /**
     * Logical 'margin-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `div { margin-inline-end: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  marginInlineEnd(value: 'auto' | (string & {})) {
    this.props.set('margin-inline-end', value)
    return this
  }

  /**
     * Logical 'margin-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `div { margin-inline-start: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  marginInlineStart(value: 'auto' | (string & {})) {
    this.props.set('margin-inline-start', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits...
     * 
     * syntax:  `div { margin-left: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#margin1
     * 

     * @param value -
     */
  marginLeft(value: 'auto' | (string & {})) {
    this.props.set('margin-left', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits...
     * 
     * syntax:  `div { margin-right: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#margin1
     * 

     * @param value -
     */
  marginRight(value: 'auto' | (string & {})) {
    this.props.set('margin-right', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits...
     * 
     * syntax:  `div { margin-top: 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#margin1
     * 

     * @param value -
     */
  marginTop(value: 'auto' | (string & {})) {
    this.props.set('margin-top', value)
    return this
  }

  /**
     * Specifies the marker symbol that shall be used for all points on the sets the value for all vertices on the given 'path' element or basic shape..
     * 
     * syntax:  ` `
     * 
     * restriction: url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#MarkerProperty
     * 
     * values:
     * ```md
     * none: Indicates that no marker symbol will be drawn at the given vertex or vertices.

     * child: Indicates that the last child <marker> element of the element where the property is specified will be used.

     * url(): Indicates that the <marker> element referenced will be used.
     * ```
     *
     * @param value -
     */
  marker(value: 'none' | 'child' | 'url()' | (string & {})) {
    this.props.set('marker', value)
    return this
  }

  /**
     * Specifies the marker that will be drawn at the last vertices of the given markable element..
     * 
     * syntax:  ` `
     * 
     * restriction: url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#VertexMarkerProperties
     * 
     * values:
     * ```md
     * none: Indicates that no marker symbol will be drawn at the given vertex or vertices.

     * child: Indicates that the last child <marker> element of the element where the property is specified will be used.

     * url(): Indicates that the <marker> element referenced will be used.
     * ```
     *
     * @param value -
     */
  markerEnd(value: 'none' | 'child' | 'url()' | (string & {})) {
    this.props.set('marker-end', value)
    return this
  }

  /**
     * Specifies the marker that will be drawn at all vertices except the first and last..
     * 
     * syntax:  ` `
     * 
     * restriction: url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#VertexMarkerProperties
     * 
     * values:
     * ```md
     * none: Indicates that no marker symbol will be drawn at the given vertex or vertices.

     * child: Indicates that the last child <marker> element of the element where the property is specified will be used.

     * url(): Indicates that the <marker> element referenced will be used.
     * ```
     *
     * @param value -
     */
  markerMid(value: 'none' | 'child' | 'url()' | (string & {})) {
    this.props.set('marker-mid', value)
    return this
  }

  /**
     * Specifies the marker that will be drawn at the first vertices of the given markable element..
     * 
     * syntax:  ` `
     * 
     * restriction: url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#VertexMarkerProperties
     * 
     * values:
     * ```md
     * none: Indicates that no marker symbol will be drawn at the given vertex or vertices.

     * child: Indicates that the last child <marker> element of the element where the property is specified will be used.

     * url(): Indicates that the <marker> element referenced will be used.
     * ```
     *
     * @param value -
     */
  markerStart(value: 'none' | 'child' | 'url()' | (string & {})) {
    this.props.set('marker-start', value)
    return this
  }

  /**
     * Sets the mask layer image of an element..
     * 
     * syntax:  ` `
     * 
     * restriction: url, image, enum
     * 
     * browsers: E,FF53
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-image
     * 
     * values:
     * ```md
     * none: Counts as a transparent black image layer.

     * url(): Reference to a <mask element or to a CSS image.
     * ```
     *
     * @param value -
     */
  maskImage(value: 'none' | 'url()' | (string & {})) {
    this.props.set('mask-image', value)
    return this
  }

  /**
     * Indicates whether the mask layer image is treated as luminance mask or alpha mask..
     * 
     * syntax:  ` `
     * 
     * restriction: url, image, enum
     * 
     * browsers: FF53
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-mode
     * 
     * values:
     * ```md
     * alpha: Alpha values of the mask layer image should be used as the mask values.

     * auto: Use alpha values if 'mask-image' is an image, luminance if a <mask> element or a CSS image.

     * luminance: Luminance values of the mask layer image should be used as the mask values.
     * ```
     *
     * @param value -
     */
  maskMode(value: 'alpha' | 'auto' | 'luminance' | (string & {})) {
    this.props.set('mask-mode', value)
    return this
  }

  /**
     * Specifies the mask positioning area..
     * 
     * syntax:  ` `
     * 
     * restriction: geometry-box, enum
     * 
     * browsers: FF53
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-origin
     * 

     * @param value -
     */
  maskOrigin(value: string) {
    this.props.set('mask-origin', value)
    return this
  }

  /**
     * Specifies how mask layer images are positioned..
     * 
     * syntax:  ` `
     * 
     * restriction: position, length, percentage
     * 
     * browsers: FF53
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-position
     * 

     * @param value -
     */
  maskPosition(value: string) {
    this.props.set('mask-position', value)
    return this
  }

  /**
     * Specifies how mask layer images are tiled after they have been sized and positioned..
     * 
     * syntax:  ` `
     * 
     * restriction: repeat
     * 
     * browsers: FF53
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-repeat
     * 

     * @param value -
     */
  maskRepeat(value: string) {
    this.props.set('mask-repeat', value)
    return this
  }

  /**
     * Specifies the size of the mask layer images..
     * 
     * syntax:  ` `
     * 
     * restriction: length, percentage, enum
     * 
     * browsers: F53
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-size
     * 
     * values:
     * ```md
     * auto: Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.

     * contain: Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.

     * cover: Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.
     * ```
     *
     * @param value -
     */
  maskSize(value: 'auto' | 'contain' | 'cover' | (string & {})) {
    this.props.set('mask-size', value)
    return this
  }

  /**
     * Defines whether the content of the <mask> element is treated as as luminance mask or alpha mask..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: C24,FF35,O15,S7
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-type
     * 
     * values:
     * ```md
     * alpha: Indicates that the alpha values of the mask should be used.

     * luminance: Indicates that the luminance values of the mask should be used.
     * ```
     *
     * @param value -
     */
  maskType(value: 'alpha' | 'luminance' | (string & {})) {
    this.props.set('mask-type', value)
    return this
  }

  /**
     * Maximum size of an element in the direction opposite that of the direction specified by 'writing-mode'..
     * 
     * syntax:  `header { max-block-size: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#propdef-min-block-size
     * 

     * @param value -
     */
  maxBlockSize(value: 'none' | (string & {})) {
    this.props.set('max-block-size', value)
    return this
  }

  /**
     * Allows authors to constrain content height to a certain range..
     * 
     * syntax:  `footer { max-height: 300px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF1,IE7,O7,S1
     * 
     * ref: http://www.w3.org/TR/css3-box/#max-height
     * 
     * values:
     * ```md
     * none: No limit on the height of the box.

     * fill: Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.

     * fit-content: Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.

     * max-content: Use the max-content inline size or max-content block size, as appropriate to the writing mode.

     * min-content: Use the min-content inline size or min-content block size, as appropriate to the writing mode.
     * ```
     *
     * @param value -
     */
  maxHeight(
    value:
      | 'none'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('max-height', value)
    return this
  }

  /**
     * Maximum size of an element in the direction specified by 'writing-mode'..
     * 
     * syntax:  `header { max-inline-size: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#propdef-min-block-size
     * 

     * @param value -
     */
  maxInlineSize(value: 'none' | (string & {})) {
    this.props.set('max-inline-size', value)
    return this
  }

  /**
     * Allows authors to constrain content width to a certain range..
     * 
     * syntax:  `footer { max-width: 300px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF1,IE7,O7,S1
     * 
     * ref: http://www.w3.org/TR/css3-box/#max-width
     * 
     * values:
     * ```md
     * none: No limit on the width of the box.

     * fill: Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.

     * fit-content: Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.

     * max-content: Use the max-content inline size or max-content block size, as appropriate to the writing mode.

     * min-content: Use the min-content inline size or min-content block size, as appropriate to the writing mode.
     * ```
     *
     * @param value -
     */
  maxWidth(
    value:
      | 'none'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('max-width', value)
    return this
  }

  /**
     * Minimal size of an element in the direction opposite that of the direction specified by 'writing-mode'..
     * 
     * syntax:  `header { min-block-size: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#propdef-min-block-size
     * 

     * @param value -
     */
  minBlockSize(value: string) {
    this.props.set('min-block-size', value)
    return this
  }

  /**
     * Allows authors to constrain content height to a certain range..
     * 
     * syntax:  `footer { min-height: 300px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF1,IE7,O7,S1
     * 
     * ref: http://www.w3.org/TR/css3-box/#min-height
     * 
     * values:
     * ```md
     * auto: undefined

     * fill: Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.

     * fit-content: Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.

     * max-content: Use the max-content inline size or max-content block size, as appropriate to the writing mode.

     * min-content: Use the min-content inline size or min-content block size, as appropriate to the writing mode.
     * ```
     *
     * @param value -
     */
  minHeight(
    value:
      | 'auto'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('min-height', value)
    return this
  }

  /**
     * Minimal size of an element in the direction specified by 'writing-mode'..
     * 
     * syntax:  `header { min-inline-size: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#propdef-min-block-size
     * 

     * @param value -
     */
  minInlineSize(value: string) {
    this.props.set('min-inline-size', value)
    return this
  }

  /**
     * Allows authors to constrain content width to a certain range..
     * 
     * syntax:  `footer { min-width: 300px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: E,C,FF1,IE7,O7,S1
     * 
     * ref: http://www.w3.org/TR/css3-box/#min-width
     * 
     * values:
     * ```md
     * auto: undefined

     * fill: Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.

     * fit-content: Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.

     * max-content: Use the max-content inline size or max-content block size, as appropriate to the writing mode.

     * min-content: Use the min-content inline size or min-content block size, as appropriate to the writing mode.
     * ```
     *
     * @param value -
     */
  minWidth(
    value:
      | 'auto'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('min-width', value)
    return this
  }

  /**
     * Defines the formula that must be used to mix the colors with the backdrop..
     * 
     * syntax:  `div { mix-blend-mode: saturation; }`
     * 
     * restriction: enum
     * 
     * browsers: C41,FF32,O29,S7.1
     * 
     * ref: http://www.w3.org/TR/compositing-1/#propdef-mix-blend-mode
     * 
     * values:
     * ```md
     * normal: Default attribute which specifies no blending

     * multiply: The source color is multiplied by the destination color and replaces the destination.

     * screen: Multiplies the complements of the backdrop and source color values, then complements the result.

     * overlay: Multiplies or screens the colors, depending on the backdrop color value.

     * darken: Selects the darker of the backdrop and source colors.

     * lighten: Selects the lighter of the backdrop and source colors.

     * color-dodge: Brightens the backdrop color to reflect the source color.

     * color-burn: Darkens the backdrop color to reflect the source color.

     * hard-light: Multiplies or screens the colors, depending on the source color value.

     * soft-light: Darkens or lightens the colors, depending on the source color value.

     * difference: Subtracts the darker of the two constituent colors from the lighter color..

     * exclusion: Produces an effect similar to that of the Difference mode but lower in contrast.

     * hue: Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.

     * saturation: Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.

     * color: Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.

     * luminosity: Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.
     * ```
     *
     * @param value -
     */
  mixBlendMode(
    value:
      | 'normal'
      | 'multiply'
      | 'screen'
      | 'overlay'
      | 'darken'
      | 'lighten'
      | 'color-dodge'
      | 'color-burn'
      | 'hard-light'
      | 'soft-light'
      | 'difference'
      | 'exclusion'
      | 'hue'
      | 'saturation'
      | 'color'
      | 'luminosity'
      | (string & {}),
  ) {
    this.props.set('mix-blend-mode', value)
    return this
  }

  /**
     * Shorthand property for setting 'motion-path', 'motion-offset' and 'motion-rotation'..
     * 
     * syntax:  ` `
     * 
     * restriction: url, length, percentage, angle, shape, geometry-box, enum
     * 
     * browsers: C46,O33
     * 
     * ref: http://www.w3.org/TR/motion-1/#propdef-motion
     * 
     * values:
     * ```md
     * none: No motion path gets created.

     * path(): Defines an SVG path as a string, with optional 'fill-rule' as the first argument.

     * url(): References an SVG shape element and uses its geometry as motion path.

     * auto: Indicates that the object is rotated by the angle of the direction of the motion path.

     * reverse: Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees.
     * ```
     *
     * @param value -
     */
  motion(
    value: 'none' | 'path()' | 'url()' | 'auto' | 'reverse' | (string & {}),
  ) {
    this.props.set('motion', value)
    return this
  }

  /**
     * A distance that describes the position along the specified motion path..
     * 
     * syntax:  `div { motion-offset: 10%; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: C46,O33
     * 
     * ref: http://www.w3.org/TR/motion-1/#propdef-motion-offset
     * 

     * @param value -
     */
  motionOffset(value: string) {
    this.props.set('motion-offset', value)
    return this
  }

  /**
     * Specifies the motion path the element gets positioned at..
     * 
     * syntax:  ` `
     * 
     * restriction: url, shape, geometry-box, enum
     * 
     * browsers: C46,O33
     * 
     * ref: http://www.w3.org/TR/motion-1/#propdef-motion-path
     * 
     * values:
     * ```md
     * none: No motion path gets created.

     * path(): Defines an SVG path as a string, with optional 'fill-rule' as the first argument.

     * url(): References an SVG shape element and uses its geometry as motion path.
     * ```
     *
     * @param value -
     */
  motionPath(value: 'none' | 'path()' | 'url()' | (string & {})) {
    this.props.set('motion-path', value)
    return this
  }

  /**
     * Defines the direction of the element while positioning along the motion path..
     * 
     * syntax:  `div { motion-rotation: 90%; }`
     * 
     * restriction: angle
     * 
     * browsers: C46,O33
     * 
     * ref: http://www.w3.org/TR/motion-1/#propdef-motion-rotation
     * 
     * values:
     * ```md
     * auto: Indicates that the object is rotated by the angle of the direction of the motion path.

     * reverse: Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees.
     * ```
     *
     * @param value -
     */
  motionRotation(value: 'auto' | 'reverse' | (string & {})) {
    this.props.set('motion-rotation', value)
    return this
  }

  /**
     * Shorthand property combines six of the animation properties into a single property..
     * 
     * syntax:  `div { -moz-animation: movearound 4s ease 3 normal; }`
     * 
     * restriction: time, enum, timing-function, identifier, number
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation
     * 
     * values:
     * ```md
     * alternate: The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.

     * alternate-reverse: The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.

     * backwards: The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.

     * both: Both forwards and backwards fill modes are applied.

     * forwards: The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.

     * infinite: Causes the animation to repeat forever.

     * none: No animation is performed

     * normal: Normal playback.

     * reverse: All iterations of the animation are played in the reverse direction from the way they were specified.
     * ```
     *
     * @param value -
     */
  mozAnimation(
    value:
      | 'alternate'
      | 'alternate-reverse'
      | 'backwards'
      | 'both'
      | 'forwards'
      | 'infinite'
      | 'none'
      | 'normal'
      | 'reverse'
      | (string & {}),
  ) {
    this.props.set('-moz-animation', value)
    return this
  }

  /**
     * Defines when the animation will start..
     * 
     * syntax:  `div { -moz-animation-delay: 4s; }`
     * 
     * restriction: time
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-delay
     * 

     * @param value -
     */
  mozAnimationDelay(value: string) {
    this.props.set('-moz-animation-delay', value)
    return this
  }

  /**
     * Defines whether or not the animation should play in reverse on alternate cycles..
     * 
     * syntax:  `div { -moz-animation-direction: normal; }`
     * 
     * restriction: enum
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-direction
     * 
     * values:
     * ```md
     * alternate: The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.

     * alternate-reverse: The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.

     * normal: Normal playback.

     * reverse: All iterations of the animation are played in the reverse direction from the way they were specified.
     * ```
     *
     * @param value -
     */
  mozAnimationDirection(
    value:
      | 'alternate'
      | 'alternate-reverse'
      | 'normal'
      | 'reverse'
      | (string & {}),
  ) {
    this.props.set('-moz-animation-direction', value)
    return this
  }

  /**
     * Defines the length of time that an animation takes to complete one cycle..
     * 
     * syntax:  `div { -moz-animation-duration: 4s; }`
     * 
     * restriction: time
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-duration
     * 

     * @param value -
     */
  mozAnimationDuration(value: string) {
    this.props.set('-moz-animation-duration', value)
    return this
  }

  /**
     * Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once..
     * 
     * syntax:  `div { -moz-animation-iteration-count: 3; }`
     * 
     * restriction: number, enum
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-iteration-count
     * 

     * @param value -
     */
  mozAnimationIterationCount(value: 'infinite' | (string & {})) {
    this.props.set('-moz-animation-iteration-count', value)
    return this
  }

  /**
     * Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation..
     * 
     * syntax:  `div { -moz-animation-name: movearound; }`
     * 
     * restriction: identifier, enum
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#the-animation-name-property-
     * 

     * @param value -
     */
  mozAnimationName(value: 'none' | (string & {})) {
    this.props.set('-moz-animation-name', value)
    return this
  }

  /**
     * Defines whether the animation is running or paused..
     * 
     * syntax:  `div { -moz-animation-play-state: running; }`
     * 
     * restriction: enum
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-play-state
     * 
     * values:
     * ```md
     * paused: A running animation will be paused.

     * running: Resume playback of a paused animation.
     * ```
     *
     * @param value -
     */
  mozAnimationPlayState(value: 'paused' | 'running' | (string & {})) {
    this.props.set('-moz-animation-play-state', value)
    return this
  }

  /**
     * Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'..
     * 
     * syntax:  `div { -moz-animation-timing-function: ease; }`
     * 
     * restriction: timing-function
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-timing-function
     * 

     * @param value -
     */
  mozAnimationTimingFunction(value: string) {
    this.props.set('-moz-animation-timing-function', value)
    return this
  }

  /**
     * Used in Gecko (Firefox) to display an element using a platform-native styling based on the operating system's theme..
     * 
     * syntax:  `.example { -moz-appearance: toolbarbutton; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-appearance
     * 
     * values:
     * ```md
     * button: undefined

     * button-arrow-down: undefined

     * button-arrow-next: undefined

     * button-arrow-previous: undefined

     * button-arrow-up: undefined

     * button-bevel: undefined

     * checkbox: undefined

     * checkbox-container: undefined

     * checkbox-label: undefined

     * dialog: undefined

     * groupbox: undefined

     * listbox: undefined

     * menuarrow: undefined

     * menuimage: undefined

     * menuitem: undefined

     * menuitemtext: undefined

     * menulist: undefined

     * menulist-button: undefined

     * menulist-text: undefined

     * menulist-textfield: undefined

     * menupopup: undefined

     * menuradio: undefined

     * menuseparator: undefined

     * -moz-mac-unified-toolbar: undefined

     * -moz-win-borderless-glass: undefined

     * -moz-win-browsertabbar-toolbox: undefined

     * -moz-win-communications-toolbox: undefined

     * -moz-win-glass: undefined

     * -moz-win-media-toolbox: undefined

     * none: undefined

     * progressbar: undefined

     * progresschunk: undefined

     * radio: undefined

     * radio-container: undefined

     * radio-label: undefined

     * radiomenuitem: undefined

     * resizer: undefined

     * resizerpanel: undefined

     * scrollbarbutton-down: undefined

     * scrollbarbutton-left: undefined

     * scrollbarbutton-right: undefined

     * scrollbarbutton-up: undefined

     * scrollbar-small: undefined

     * scrollbartrack-horizontal: undefined

     * scrollbartrack-vertical: undefined

     * separator: undefined

     * spinner: undefined

     * spinner-downbutton: undefined

     * spinner-textfield: undefined

     * spinner-upbutton: undefined

     * statusbar: undefined

     * statusbarpanel: undefined

     * tab: undefined

     * tabpanels: undefined

     * tab-scroll-arrow-back: undefined

     * tab-scroll-arrow-forward: undefined

     * textfield: undefined

     * textfield-multiline: undefined

     * toolbar: undefined

     * toolbox: undefined

     * tooltip: undefined

     * treeheadercell: undefined

     * treeheadersortarrow: undefined

     * treeitem: undefined

     * treetwistyopen: undefined

     * treeview: undefined

     * treewisty: undefined

     * window: undefined
     * ```
     *
     * @param value -
     */
  mozAppearance(
    value:
      | 'button'
      | 'button-arrow-down'
      | 'button-arrow-next'
      | 'button-arrow-previous'
      | 'button-arrow-up'
      | 'button-bevel'
      | 'checkbox'
      | 'checkbox-container'
      | 'checkbox-label'
      | 'dialog'
      | 'groupbox'
      | 'listbox'
      | 'menuarrow'
      | 'menuimage'
      | 'menuitem'
      | 'menuitemtext'
      | 'menulist'
      | 'menulist-button'
      | 'menulist-text'
      | 'menulist-textfield'
      | 'menupopup'
      | 'menuradio'
      | 'menuseparator'
      | '-moz-mac-unified-toolbar'
      | '-moz-win-borderless-glass'
      | '-moz-win-browsertabbar-toolbox'
      | '-moz-win-communications-toolbox'
      | '-moz-win-glass'
      | '-moz-win-media-toolbox'
      | 'none'
      | 'progressbar'
      | 'progresschunk'
      | 'radio'
      | 'radio-container'
      | 'radio-label'
      | 'radiomenuitem'
      | 'resizer'
      | 'resizerpanel'
      | 'scrollbarbutton-down'
      | 'scrollbarbutton-left'
      | 'scrollbarbutton-right'
      | 'scrollbarbutton-up'
      | 'scrollbar-small'
      | 'scrollbartrack-horizontal'
      | 'scrollbartrack-vertical'
      | 'separator'
      | 'spinner'
      | 'spinner-downbutton'
      | 'spinner-textfield'
      | 'spinner-upbutton'
      | 'statusbar'
      | 'statusbarpanel'
      | 'tab'
      | 'tabpanels'
      | 'tab-scroll-arrow-back'
      | 'tab-scroll-arrow-forward'
      | 'textfield'
      | 'textfield-multiline'
      | 'toolbar'
      | 'toolbox'
      | 'tooltip'
      | 'treeheadercell'
      | 'treeheadersortarrow'
      | 'treeitem'
      | 'treetwistyopen'
      | 'treeview'
      | 'treewisty'
      | 'window'
      | (string & {}),
  ) {
    this.props.set('-moz-appearance', value)
    return this
  }

  /**
     * Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer..
     * 
     * syntax:  `div { -moz-backface-visibility: hidden; }`
     * 
     * restriction: enum
     * 
     * browsers: FF10
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#backface-visibility
     * 
     * values:
     * ```md
     * hidden: undefined

     * visible: undefined
     * ```
     *
     * @param value -
     */
  mozBackfaceVisibility(value: 'hidden' | 'visible' | (string & {})) {
    this.props.set('-moz-backface-visibility', value)
    return this
  }

  /**
     * Determines the background painting area..
     * 
     * syntax:  `header { -moz-background-clip: border-box; }`
     * 
     * restriction: box, enum
     * 
     * browsers: FF1-3.6
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-clip
     * 

     * @param value -
     */
  mozBackgroundClip(value: 'padding' | (string & {})) {
    this.props.set('-moz-background-clip', value)
    return this
  }

  /**
     * In Gecko-based applications like Firefox, the -moz-background-inline-policy CSS property specifies how the background image of an inline element is determined when the content of the inline element wraps onto multiple lines. The choice of position has significant effects on repetition..
     * 
     * syntax:  `div { -moz-background-inline-policy: bounding-box; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-background-inline-policy
     * 
     * values:
     * ```md
     * bounding-box: undefined

     * continuous: undefined

     * each-box: undefined
     * ```
     *
     * @param value -
     */
  mozBackgroundInlinePolicy(
    value: 'bounding-box' | 'continuous' | 'each-box' | (string & {}),
  ) {
    this.props.set('-moz-background-inline-policy', value)
    return this
  }

  /**
     * For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s)..
     * 
     * syntax:  `header { -moz-background-origin: border-box; }`
     * 
     * restriction: box
     * 
     * browsers: FF1
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-origin
     * 

     * @param value -
     */
  mozBackgroundOrigin(value: string) {
    this.props.set('-moz-background-origin', value)
    return this
  }

  /**
     * Sets a list of colors for the bottom border..
     * 
     * syntax:  `td { -moz-border-bottom-colors:  #00ff33 #33ff66 #66ff99; }`
     * 
     * restriction: color
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-border-left-colors
     * 

     * @param value -
     */
  mozBorderBottomColors(value: string) {
    this.props.set('-moz-border-bottom-colors', value)
    return this
  }

  /**
     * Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values..
     * 
     * syntax:  `td { -moz-border-image: url(border.png) 30 30 round;}`
     * 
     * restriction: length, percentage, number, url, enum
     * 
     * browsers: FF3.6
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-image
     * 
     * values:
     * ```md
     * auto: If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.

     * fill: Causes the middle part of the border-image to be preserved.

     * none: undefined

     * repeat: The image is tiled (repeated) to fill the area.

     * round: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.

     * space: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.

     * stretch: The image is stretched to fill the area.

     * url(): undefined
     * ```
     *
     * @param value -
     */
  mozBorderImage(
    value:
      | 'auto'
      | 'fill'
      | 'none'
      | 'repeat'
      | 'round'
      | 'space'
      | 'stretch'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('-moz-border-image', value)
    return this
  }

  /**
     * Sets a list of colors for the bottom border..
     * 
     * syntax:  `td { -moz-border-left-colors:  #00ff33 #33ff66 #66ff99; }`
     * 
     * restriction: color
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-border-left-colors
     * 

     * @param value -
     */
  mozBorderLeftColors(value: string) {
    this.props.set('-moz-border-left-colors', value)
    return this
  }

  /**
     * Sets a list of colors for the bottom border..
     * 
     * syntax:  `td { -moz-border-right-colors:  #00ff33 #33ff66 #66ff99; }`
     * 
     * restriction: color
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-border-left-colors
     * 

     * @param value -
     */
  mozBorderRightColors(value: string) {
    this.props.set('-moz-border-right-colors', value)
    return this
  }

  /**
     * Ske Firefox, -moz-border-bottom-colors sets a list of colors for the bottom border..
     * 
     * syntax:  `td { -moz-border-top-colors:  #00ff33 #33ff66 #66ff99; }`
     * 
     * restriction: color
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-border-left-colors
     * 

     * @param value -
     */
  mozBorderTopColors(value: string) {
    this.props.set('-moz-border-top-colors', value)
    return this
  }

  /**
     * Specifies how a XUL box aligns its contents across (perpendicular to) the direction of its layout. The effect of this is only visible if there is extra space in the box..
     * 
     * syntax:  `div { -moz-box-align: end; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-align
     * 
     * values:
     * ```md
     * baseline: If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used.

     * center: Any extra space is divided evenly, with half placed above the child and the other half placed after the child.

     * end: For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element.

     * start: For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element.

     * stretch: The height of each child is adjusted to that of the containing block.
     * ```
     *
     * @param value -
     */
  mozBoxAlign(
    value: 'baseline' | 'center' | 'end' | 'start' | 'stretch' | (string & {}),
  ) {
    this.props.set('-moz-box-align', value)
    return this
  }

  /**
     * Specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge)..
     * 
     * syntax:  `div { -moz-box-direction: reverse; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-direction
     * 
     * values:
     * ```md
     * normal: A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom.

     * reverse: A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top.
     * ```
     *
     * @param value -
     */
  mozBoxDirection(value: 'normal' | 'reverse' | (string & {})) {
    this.props.set('-moz-box-direction', value)
    return this
  }

  /**
     * Specifies how a box grows to fill the box that contains it, in the direction of the containing box's layout..
     * 
     * syntax:  `div { -moz-box-flex: 1; }`
     * 
     * restriction: number
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-flex
     * 

     * @param value -
     */
  mozBoxFlex(value: number) {
    this.props.set('-moz-box-flex', value)
    return this
  }

  /**
     * Flexible elements can be assigned to flex groups using the 'box-flex-group' property..
     * 
     * syntax:  `div { -moz-box-flexgroup: 3; }`
     * 
     * restriction: integer
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-flexgroup
     * 

     * @param value -
     */
  mozBoxFlexgroup(value: number) {
    this.props.set('-moz-box-flexgroup', value)
    return this
  }

  /**
     * Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group..
     * 
     * syntax:  `div { -moz-box-ordinal-group: 5; }`
     * 
     * restriction: integer
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-ordinal-group
     * 

     * @param value -
     */
  mozBoxOrdinalGroup(value: number) {
    this.props.set('-moz-box-ordinal-group', value)
    return this
  }

  /**
     * In Mozilla applications, -moz-box-orient specifies whether a box lays out its contents horizontally or vertically..
     * 
     * syntax:  `div { -moz-box-orient: vertical; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-orient
     * 
     * values:
     * ```md
     * block-axis: Elements are oriented along the box's axis.

     * horizontal: The box displays its children from left to right in a horizontal line.

     * inline-axis: Elements are oriented vertically.

     * vertical: The box displays its children from stacked from top to bottom vertically.
     * ```
     *
     * @param value -
     */
  mozBoxOrient(
    value:
      | 'block-axis'
      | 'horizontal'
      | 'inline-axis'
      | 'vertical'
      | (string & {}),
  ) {
    this.props.set('-moz-box-orient', value)
    return this
  }

  /**
     * Specifies how a box packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box..
     * 
     * syntax:  `div { -moz-box-pack: end; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-box-pack
     * 
     * values:
     * ```md
     * center: The extra space is divided evenly, with half placed before the first child and the other half placed after the last child.

     * end: For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child.

     * justify: The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start.

     * start: For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child.
     * ```
     *
     * @param value -
     */
  mozBoxPack(value: 'center' | 'end' | 'justify' | 'start' | (string & {})) {
    this.props.set('-moz-box-pack', value)
    return this
  }

  /**
     * Box Model addition in CSS3..
     * 
     * syntax:  `div { -moz-box-sizing: content-box; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1
     * 
     * ref: http://www.w3.org/TR/css3-ui/#box-sizing
     * 
     * values:
     * ```md
     * border-box: The specified width and height (and respective min/max properties) on this element determine the border box of the element.

     * content-box: Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.

     * padding-box: The specified width and height (and respective min/max properties) on this element determine the padding box of the element.
     * ```
     *
     * @param value -
     */
  mozBoxSizing(
    value: 'border-box' | 'content-box' | 'padding-box' | (string & {}),
  ) {
    this.props.set('-moz-box-sizing', value)
    return this
  }

  /**
     * Describes the optimal number of columns into which the content of the element will be flowed..
     * 
     * syntax:  `div { -moz-column-count: 3; }`
     * 
     * restriction: integer
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-count
     * 

     * @param value -
     */
  mozColumnCount(value: number) {
    this.props.set('-moz-column-count', value)
    return this
  }

  /**
     * Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap..
     * 
     * syntax:  `div { -moz-column-gap: 10px; }`
     * 
     * restriction: length
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-gap0
     * 

     * @param value -
     */
  mozColumnGap(value: 'normal' | (string & {})) {
    this.props.set('-moz-column-gap', value)
    return this
  }

  /**
     * Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values..
     * 
     * syntax:  `header { -moz-column-rule: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule0
     * 

     * @param value -
     */
  mozColumnRule(value: string) {
    this.props.set('-moz-column-rule', value)
    return this
  }

  /**
     * Sets the color of the column rule.
     * 
     * syntax:  `div { -moz-column-rule-color: #ff0; }`
     * 
     * restriction: color
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-color
     * 

     * @param value -
     */
  mozColumnRuleColor(value: string) {
    this.props.set('-moz-column-rule-color', value)
    return this
  }

  /**
     * Sets the style of the rule between columns of an element..
     * 
     * syntax:  `div { -moz-column-rule-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-style
     * 

     * @param value -
     */
  mozColumnRuleStyle(value: string) {
    this.props.set('-moz-column-rule-style', value)
    return this
  }

  /**
     * Sets the width of the rule between columns. Negative values are not allowed..
     * 
     * syntax:  `div { -moz-column-rule-width: 3px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-width
     * 

     * @param value -
     */
  mozColumnRuleWidth(value: string) {
    this.props.set('-moz-column-rule-width', value)
    return this
  }

  /**
     * A shorthand property which sets both 'column-width' and 'column-count'..
     * 
     * syntax:  `div { -moz-columns: 100px 3; }`
     * 
     * restriction: length, integer
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#columns0
     * 

     * @param value -
     */
  mozColumns(value: 'auto' | (string & {})) {
    this.props.set('-moz-columns', value)
    return this
  }

  /**
     * This property describes the width of columns in multicol elements..
     * 
     * syntax:  `div { -moz-column-width: 100px; }`
     * 
     * restriction: length
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-width
     * 

     * @param value -
     */
  mozColumnWidth(value: 'auto' | (string & {})) {
    this.props.set('-moz-column-width', value)
    return this
  }

  /**
     * Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case..
     * 
     * syntax:  `body { -moz-font-feature-settings: 'hwid'; }`
     * 
     * restriction: string, integer
     * 
     * browsers: FF4
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-feature-settings
     * 
     * values:
     * ```md
     * c2cs: undefined

     * dlig: undefined

     * kern: undefined

     * liga: undefined

     * lnum: undefined

     * onum: undefined

     * smcp: undefined

     * swsh: undefined

     * tnum: undefined

     * normal: No change in glyph substitution or positioning occurs.

     * off: undefined

     * on: undefined
     * ```
     *
     * @param value -
     */
  mozFontFeatureSettings(
    value:
      | 'c2cs'
      | 'dlig'
      | 'kern'
      | 'liga'
      | 'lnum'
      | 'onum'
      | 'smcp'
      | 'swsh'
      | 'tnum'
      | 'normal'
      | 'off'
      | 'on'
      | (string & {}),
  ) {
    this.props.set('-moz-font-feature-settings', value)
    return this
  }

  /**
     * Controls whether hyphenation is allowed to create more break opportunities within a line of text..
     * 
     * syntax:  `div { -moz-hyphens: manual; }`
     * 
     * restriction: enum
     * 
     * browsers: FF9
     * 
     * ref: http://www.w3.org/TR/css3-text/#hyphens0
     * 
     * values:
     * ```md
     * auto: Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.

     * manual: Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities

     * none: Words are not broken at line breaks, even if characters inside the word suggest line break points.
     * ```
     *
     * @param value -
     */
  mozHyphens(value: 'auto' | 'manual' | 'none' | (string & {})) {
    this.props.set('-moz-hyphens', value)
    return this
  }

  /**
     * Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself..
     * 
     * syntax:  `div { -moz-perspective: none; }`
     * 
     * restriction: length
     * 
     * browsers: FF10
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#perspective
     * 

     * @param value -
     */
  mozPerspective(value: 'none' | (string & {})) {
    this.props.set('-moz-perspective', value)
    return this
  }

  /**
     * Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element..
     * 
     * syntax:  `div { -moz-perspective-origin: 10px; }`
     * 
     * restriction: position, percentage, length
     * 
     * browsers: FF10
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin
     * 

     * @param value -
     */
  mozPerspectiveOrigin(value: string) {
    this.props.set('-moz-perspective-origin', value)
    return this
  }

  /**
     * Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'..
     * 
     * syntax:  `div { -moz-text-align-last: right; }`
     * 
     * restriction: enum
     * 
     * browsers: FF12
     * 
     * ref: http://www.w3.org/TR/css3-text/#text-align-last0
     * 
     * values:
     * ```md
     * auto: undefined

     * center: The inline contents are centered within the line box.

     * end: The inline contents are aligned to the end edge of the line box.

     * justify: The text is justified according to the method specified by the 'text-justify' property.

     * left: The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.

     * right: The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.

     * start: The inline contents are aligned to the start edge of the line box.
     * ```
     *
     * @param value -
     */
  mozTextAlignLast(
    value:
      | 'auto'
      | 'center'
      | 'end'
      | 'justify'
      | 'left'
      | 'right'
      | 'start'
      | (string & {}),
  ) {
    this.props.set('-moz-text-align-last', value)
    return this
  }

  /**
     * Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line..
     * 
     * syntax:  `div { -moz-text-decoration-color: #ff0; }`
     * 
     * restriction: color
     * 
     * browsers: FF6
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-color
     * 

     * @param value -
     */
  mozTextDecorationColor(value: string) {
    this.props.set('-moz-text-decoration-color', value)
    return this
  }

  /**
     * Specifies what line decorations, if any, are added to the element..
     * 
     * syntax:  `div { -moz-text-decoration-line: underline; }`
     * 
     * restriction: enum
     * 
     * browsers: FF6
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-line
     * 
     * values:
     * ```md
     * line-through: Each line of text has a line through the middle.

     * none: Neither produces nor inhibits text decoration.

     * overline: Each line of text has a line above it.

     * underline: Each line of text is underlined.
     * ```
     *
     * @param value -
     */
  mozTextDecorationLine(
    value: 'line-through' | 'none' | 'overline' | 'underline' | (string & {}),
  ) {
    this.props.set('-moz-text-decoration-line', value)
    return this
  }

  /**
     * Specifies the line style for underline, line-through and overline text decoration..
     * 
     * syntax:  `div { -moz-text-decoration-style: solid; }`
     * 
     * restriction: enum
     * 
     * browsers: FF6
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-style
     * 
     * values:
     * ```md
     * dashed: Produces a dashed line style.

     * dotted: Produces a dotted line.

     * double: Produces a double line.

     * none: Produces no line.

     * solid: Produces a solid line.

     * wavy: Produces a wavy line.
     * ```
     *
     * @param value -
     */
  mozTextDecorationStyle(
    value:
      | 'dashed'
      | 'dotted'
      | 'double'
      | 'none'
      | 'solid'
      | 'wavy'
      | (string & {}),
  ) {
    this.props.set('-moz-text-decoration-style', value)
    return this
  }

  /**
     * Specifies a size adjustment for displaying text content in mobile browsers..
     * 
     * syntax:  `body { -moz-text-size-adjust: 150%; }`
     * 
     * restriction: enum, percentage
     * 
     * browsers: FF
     * 
     * ref: http://dev.w3.org/csswg/css-size-adjust/
     * 
     * values:
     * ```md
     * auto: Renderers must use the default size adjustment when displaying on a small device.

     * none: Renderers must not do size adjustment when displaying on a small device.
     * ```
     *
     * @param value -
     */
  mozTextSizeAdjust(value: 'auto' | 'none' | (string & {})) {
    this.props.set('-moz-text-size-adjust', value)
    return this
  }

  /**
     * A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG..
     * 
     * syntax:  `div { -moz-transform: rotate(-90deg); }`
     * 
     * restriction: enum
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-2d-transforms/#transform-property
     * 
     * values:
     * ```md
     * matrix(): Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]

     * matrix3d(): Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.

     * none: undefined

     * perspective: Specifies a perspective projection matrix.

     * rotate(): Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.

     * rotate3d(): Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.

     * rotateX('angle'): Specifies a clockwise rotation by the given angle about the X axis.

     * rotateY('angle'): Specifies a clockwise rotation by the given angle about the Y axis.

     * rotateZ('angle'): Specifies a clockwise rotation by the given angle about the Z axis.

     * scale(): Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.

     * scale3d(): Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.

     * scaleX(): Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.

     * scaleY(): Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.

     * scaleZ(): Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.

     * skew(): Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).

     * skewX(): Specifies a skew transformation along the X axis by the given angle.

     * skewY(): Specifies a skew transformation along the Y axis by the given angle.

     * translate(): Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.

     * translate3d(): Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.

     * translateX(): Specifies a translation by the given amount in the X direction.

     * translateY(): Specifies a translation by the given amount in the Y direction.

     * translateZ(): Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.
     * ```
     *
     * @param value -
     */
  mozTransform(
    value:
      | 'matrix()'
      | 'matrix3d()'
      | 'none'
      | 'perspective'
      | 'rotate()'
      | 'rotate3d()'
      | "rotateX('angle')"
      | "rotateY('angle')"
      | "rotateZ('angle')"
      | 'scale()'
      | 'scale3d()'
      | 'scaleX()'
      | 'scaleY()'
      | 'scaleZ()'
      | 'skew()'
      | 'skewX()'
      | 'skewY()'
      | 'translate()'
      | 'translate3d()'
      | 'translateX()'
      | 'translateY()'
      | 'translateZ()'
      | (string & {}),
  ) {
    this.props.set('-moz-transform', value)
    return this
  }

  /**
     * Establishes the origin of transformation for an element..
     * 
     * syntax:  `.album { -moz-transform-origin: 20% 40%; }`
     * 
     * restriction: position, length, percentage
     * 
     * browsers: FF3.5
     * 
     * ref: http://www.w3.org/TR/css3-2d-transforms/#transform-origin
     * 

     * @param value -
     */
  mozTransformOrigin(value: string) {
    this.props.set('-moz-transform-origin', value)
    return this
  }

  /**
     * Shorthand property combines four of the transition properties into a single property..
     * 
     * syntax:  `div { -moz-transition: background-color linear 1s; }`
     * 
     * restriction: time, property, timing-function, enum
     * 
     * browsers: FF4
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition
     * 
     * values:
     * ```md
     * all: Every property that is able to undergo a transition will do so.

     * none: No property will transition.
     * ```
     *
     * @param value -
     */
  mozTransition(value: 'all' | 'none' | (string & {})) {
    this.props.set('-moz-transition', value)
    return this
  }

  /**
     * Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied..
     * 
     * syntax:  `div { -moz-transition-delay: 1s; }`
     * 
     * restriction: time
     * 
     * browsers: FF4
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-delay
     * 

     * @param value -
     */
  mozTransitionDelay(value: string) {
    this.props.set('-moz-transition-delay', value)
    return this
  }

  /**
     * Specifies how long the transition from the old value to the new value should take..
     * 
     * syntax:  `div { -moz-transition-duration: 1s; }`
     * 
     * restriction: time
     * 
     * browsers: FF4
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-duration
     * 

     * @param value -
     */
  mozTransitionDuration(value: string) {
    this.props.set('-moz-transition-duration', value)
    return this
  }

  /**
     * Specifies the name of the CSS property to which the transition is applied..
     * 
     * syntax:  `div { -moz-transition-property: background-color; }`
     * 
     * restriction: property
     * 
     * browsers: FF4
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-property
     * 
     * values:
     * ```md
     * all: Every property that is able to undergo a transition will do so.

     * none: No property will transition.
     * ```
     *
     * @param value -
     */
  mozTransitionProperty(value: 'all' | 'none' | (string & {})) {
    this.props.set('-moz-transition-property', value)
    return this
  }

  /**
     * Describes how the intermediate values used during a transition will be calculated..
     * 
     * syntax:  `div { -moz-transition-timing-function: linear; }`
     * 
     * restriction: timing-function
     * 
     * browsers: FF4
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-timing-function
     * 

     * @param value -
     */
  mozTransitionTimingFunction(value: string) {
    this.props.set('-moz-transition-timing-function', value)
    return this
  }

  /**
     * Used to indicate whether the element can have focus..
     * 
     * syntax:  `div { -moz-user-focus: ignore; }`
     * 
     * restriction: 
     * 
     * browsers: FF1.5
     * 
     * ref: https://developer.mozilla.org/en-US/docs/CSS/-moz-user-focus
     * 
     * values:
     * ```md
     * ignore: undefined

     * normal: undefined
     * ```
     *
     * @param value -
     */
  mozUserFocus(value: 'ignore' | 'normal' | (string & {})) {
    this.props.set('-moz-user-focus', value)
    return this
  }

  /**
     * Controls the appearance of selection..
     * 
     * syntax:  `div { -moz-user-select: text; }`
     * 
     * restriction: enum
     * 
     * browsers: FF1.5
     * 
     * ref: https://developer.mozilla.org/en/CSS/-moz-user-select
     * 
     * values:
     * ```md
     * all: undefined

     * element: undefined

     * elements: undefined

     * -moz-all: undefined

     * -moz-none: undefined

     * none: undefined

     * text: undefined

     * toggle: undefined
     * ```
     *
     * @param value -
     */
  mozUserSelect(
    value:
      | 'all'
      | 'element'
      | 'elements'
      | '-moz-all'
      | '-moz-none'
      | 'none'
      | 'text'
      | 'toggle'
      | (string & {}),
  ) {
    this.props.set('-moz-user-select', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Defines how to alter the representation when the counter value is negative..
     * 
     * syntax:  `@counter-style { negative: '(' ')'; }`
     * 
     * restriction: image, identifier, string
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-negative
     * 

     * @param value -
     */
  negative(value: string) {
    this.props.set('negative', value)
    return this
  }

  /**
     * Specifies how the contents of a replaced element should be scaled relative to the box established by its used height and width..
     * 
     * syntax:  `p { object-fit: cover; }`
     * 
     * restriction: enum
     * 
     * browsers: C32,FF36,O19,S7.1
     * 
     * ref: http://www.w3.org/TR/css-images/#object-fit
     * 
     * values:
     * ```md
     * contain: The replaced content is sized to maintain its aspect ratio while fitting within the element's content box: its concrete object size is resolved as a contain constraint against the element's used width and height.

     * cover: The replaced content is sized to maintain its aspect ratio while filling the element's entire content box: its concrete object size is resolved as a cover constraint against the element's used width and height.

     * fill: The replaced content is sized to fill the element's content box: the object's concrete object size is the element's used width and height.

     * none: The replaced content is not resized to fit inside the element's content box

     * scale-down: Size the content as if 'none' or 'contain' were specified, whichever would result in a smaller concrete object size.
     * ```
     *
     * @param value -
     */
  objectFit(
    value: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' | (string & {}),
  ) {
    this.props.set('object-fit', value)
    return this
  }

  /**
     * Determines the alignment of the replaced element inside its box..
     * 
     * syntax:  `img { object-position: left top; }`
     * 
     * restriction: position, length, percentage
     * 
     * browsers: C32,FF36,O19
     * 
     * ref: http://www.w3.org/TR/css-images/#object-position
     * 

     * @param value -
     */
  objectPosition(value: string) {
    this.props.set('object-position', value)
    return this
  }

  /**
     * Opacity of an element's text, where 1 is opaque and 0 is entirely transparent..
     * 
     * syntax:  `article { opacity: opacity: 0.4; }`
     * 
     * restriction: number(0-1)
     * 
     * browsers: C,FF3.6,IE9,O9,S1.2
     * 
     * ref: http://www.w3.org/TR/css3-color/#opacity
     * 

     * @param value -
     */
  opacity(value: number) {
    this.props.set('opacity', value)
    return this
  }

  /**
     * Controls the order in which children of a flex container appear within the flex container, by assigning them to ordinal groups..
     * 
     * syntax:  `p { order: -1; }`
     * 
     * restriction: integer
     * 
     * browsers: E,C29,FF22,IE11,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-flexbox/#order
     * 

     * @param value -
     */
  order(value: number) {
    this.props.set('order', value)
    return this
  }

  /**
     * Specifies the minimum number of line boxes in a block container that must be left in a fragment before a fragmentation break..
     * 
     * syntax:  `<integer>`
     * 
     * restriction: integer
     * 
     * browsers: C,IE8,O7,S1.3
     * 
     * ref: http://www.w3.org/TR/css3-break/#widows-orphans
     * 

     * @param value -
     */
  orphans(value: number) {
    this.props.set('orphans', value)
    return this
  }

  /**
     * Logical 'bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { offset-block-end: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  offsetBlockEnd(value: 'auto' | (string & {})) {
    this.props.set('offset-block-end', value)
    return this
  }

  /**
     * Logical 'top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { offset-block-start: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  offsetBlockStart(value: 'auto' | (string & {})) {
    this.props.set('offset-block-start', value)
    return this
  }

  /**
     * Logical 'right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { offset-inline-end: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  offsetInlineEnd(value: 'auto' | (string & {})) {
    this.props.set('offset-inline-end', value)
    return this
  }

  /**
     * Logical 'left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { offset-inline-start: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#logical-prop
     * 

     * @param value -
     */
  offsetInlineStart(value: 'auto' | (string & {})) {
    this.props.set('offset-inline-start', value)
    return this
  }

  /**
     * Shorthand property for 'outline-style', 'outline-width', and 'outline-color'..
     * 
     * syntax:  `header { outline: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color, enum
     * 
     * browsers: E,C,FF1.5,IE8,O8,S1.2
     * 
     * ref: http://www.w3.org/TR/css3-ui/#outline0
     * 
     * values:
     * ```md
     * auto: Permits the user agent to render a custom outline style, typically the default platform style.

     * invert: Performs a color inversion on the pixels on the screen.
     * ```
     *
     * @param value -
     */
  outline(value: 'auto' | 'invert' | (string & {})) {
    this.props.set('outline', value)
    return this
  }

  /**
     * The color of the outline..
     * 
     * syntax:  `body { outline-color: red; }`
     * 
     * restriction: enum, color
     * 
     * browsers: E,C,FF1.5,IE8,O8,S1.2
     * 
     * ref: http://www.w3.org/TR/css3-ui/#outline-color
     * 

     * @param value -
     */
  outlineColor(value: 'invert' | (string & {})) {
    this.props.set('outline-color', value)
    return this
  }

  /**
     * Offset the outline and draw it beyond the border edge..
     * 
     * syntax:  `article { outline-offset: 15px; }`
     * 
     * restriction: length
     * 
     * browsers: C,FF1.5,O9.5,S1.2
     * 
     * ref: http://www.w3.org/TR/css3-ui/#outline-offset0
     * 

     * @param value -
     */
  outlineOffset(value: string) {
    this.props.set('outline-offset', value)
    return this
  }

  /**
     * Style of the outline..
     * 
     * syntax:  `td { outline-style: solid; }`
     * 
     * restriction: line-style, enum
     * 
     * browsers: E,C,FF1.5,IE8,O8,S1.2
     * 
     * ref: http://www.w3.org/TR/css3-ui/#outline-style0
     * 

     * @param value -
     */
  outlineStyle(value: 'auto' | (string & {})) {
    this.props.set('outline-style', value)
    return this
  }

  /**
     * Width of the outline..
     * 
     * syntax:  `td { outline-width: 2px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: E,C,FF1.5,IE8,O8,S1.2
     * 
     * ref: http://www.w3.org/TR/css3-ui/#outline-width0
     * 

     * @param value -
     */
  outlineWidth(value: string) {
    this.props.set('outline-width', value)
    return this
  }

  /**
     * Shorthand for setting 'overflow-x' and 'overflow-y'..
     * 
     * syntax:  `div { overflow: hidden auto; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-overflow-3/#overflow
     * 
     * values:
     * ```md
     * auto: The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.

     * clip: Behaves as 'hidden' except forbids scrolling entirely, through any mechanism.

     * hidden: Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.

     * -moz-hidden-unscrollable: Same as the standardized 'clip', except doesn't establish a block formatting context.

     * scroll: Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.

     * visible: Content is not clipped, i.e., it may be rendered outside the content box.
     * ```
     *
     * @param value -
     */
  overflow(
    value:
      | 'auto'
      | 'clip'
      | 'hidden'
      | '-moz-hidden-unscrollable'
      | 'scroll'
      | 'visible'
      | (string & {}),
  ) {
    this.props.set('overflow', value)
    return this
  }

  /**
     * Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit within the line box..
     * 
     * syntax:  `div { overflow-wrap: break-word; }`
     * 
     * restriction: enum
     * 
     * browsers: C23,O12.1,S6.1
     * 
     * ref: http://www.w3.org/TR/css3-text/#overflow-wrap0
     * 
     * values:
     * ```md
     * break-word: An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.

     * normal: Lines may break only at allowed break points.

     * anywhere: There is a soft wrap opportunity around every typographic character unit, including around any punctuation character or preserved white spaces, or in the middle of words, disregarding any prohibition against line breaks, even those introduced by characters with the GL, WJ, or ZWJ line breaking classes or mandated by the word-break property.
     * ```
     *
     * @param value -
     */
  overflowWrap(value: 'break-word' | 'normal' | 'anywhere' | (string & {})) {
    this.props.set('overflow-wrap', value)
    return this
  }

  /**
     * Specifies the handling of overflow in the horizontal direction..
     * 
     * syntax:  `div { overflow-x: hidden; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C,FF1.5,IE5,O9.5,S3
     * 
     * ref: http://www.w3.org/TR/css3-box/#overflow-x
     * 
     * values:
     * ```md
     * auto: The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.

     * clip: Behaves as 'hidden' except forbids scrolling entirely, through any mechanism.

     * hidden: Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.

     * scroll: Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.

     * visible: Content is not clipped, i.e., it may be rendered outside the content box.
     * ```
     *
     * @param value -
     */
  overflowX(
    value: 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | (string & {}),
  ) {
    this.props.set('overflow-x', value)
    return this
  }

  /**
     * Specifies the handling of overflow in the vertical direction..
     * 
     * syntax:  `div { overflow-y: hidden; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C,FF1.5,IE5,O9.5,S3
     * 
     * ref: http://www.w3.org/TR/css3-box/#overflow-x
     * 
     * values:
     * ```md
     * auto: The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.

     * clip: Behaves as 'hidden' except forbids scrolling entirely, through any mechanism.

     * hidden: Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.

     * scroll: Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.

     * visible: Content is not clipped, i.e., it may be rendered outside the content box.
     * ```
     *
     * @param value -
     */
  overflowY(
    value: 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | (string & {}),
  ) {
    this.props.set('overflow-y', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies a "fixed-width" counter style, where representations shorter than the pad value are padded with a particular <symbol>.
     * 
     * syntax:  `@counter-style { pad: 3 '0'; }`
     * 
     * restriction: integer, image, string, identifier
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-pad
     * 

     * @param value -
     */
  pad(value: string) {
    this.props.set('pad', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative..
     * 
     * syntax:  `div { padding: 4px 7px 2px 4px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#padding1
     * 

     * @param value -
     */
  padding(value: 'logical' | (string & {})) {
    this.props.set('padding', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative..
     * 
     * syntax:  `ul { padding-bottom: 2em; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#padding1
     * 

     * @param value -
     */
  paddingBottom(value: string) {
    this.props.set('padding-bottom', value)
    return this
  }

  /**
     * Logical 'padding-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { padding-block-end: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  paddingBlockEnd(value: string) {
    this.props.set('padding-block-end', value)
    return this
  }

  /**
     * Logical 'padding-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { padding-block-start: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  paddingBlockStart(value: string) {
    this.props.set('padding-block-start', value)
    return this
  }

  /**
     * Logical 'padding-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { padding-inline-end: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  paddingInlineEnd(value: string) {
    this.props.set('padding-inline-end', value)
    return this
  }

  /**
     * Logical 'padding-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'..
     * 
     * syntax:  `article { padding-inline-start: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: FF41
     * 
     * ref: https://drafts.csswg.org/css-logical-props/#border-padding
     * 

     * @param value -
     */
  paddingInlineStart(value: string) {
    this.props.set('padding-inline-start', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative..
     * 
     * syntax:  `ul { padding-left: 2em; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#padding1
     * 

     * @param value -
     */
  paddingLeft(value: string) {
    this.props.set('padding-left', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative..
     * 
     * syntax:  `ul { padding-right: 2em; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#padding1
     * 

     * @param value -
     */
  paddingRight(value: string) {
    this.props.set('padding-right', value)
    return this
  }

  /**
     * Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative..
     * 
     * syntax:  `ul { padding-top: 2em; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#padding1
     * 

     * @param value -
     */
  paddingTop(value: string) {
    this.props.set('padding-top', value)
    return this
  }

  /**
     * Defines rules for page breaks after an element..
     * 
     * syntax:  `table { page-break-after: always; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-break/#page-break-properties
     * 
     * values:
     * ```md
     * always: Always force a page break after the generated box.

     * auto: Neither force nor forbid a page break after generated box.

     * avoid: Avoid a page break after the generated box.

     * left: Force one or two page breaks after the generated box so that the next page is formatted as a left page.

     * recto: Equivalent to right in left-to-right page progressions and left in right-to-left page progressions.

     * right: Force one or two page breaks after the generated box so that the next page is formatted as a right page.

     * verso: Equivalent to left in left-to-right page progressions and right in right-to-left page progressions.
     * ```
     *
     * @param value -
     */
  pageBreakAfter(
    value:
      | 'always'
      | 'auto'
      | 'avoid'
      | 'left'
      | 'recto'
      | 'right'
      | 'verso'
      | (string & {}),
  ) {
    this.props.set('page-break-after', value)
    return this
  }

  /**
     * Defines rules for page breaks before an element..
     * 
     * syntax:  `table { page-break-before: always; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-break/#page-break-properties
     * 
     * values:
     * ```md
     * always: Always force a page break before the generated box.

     * auto: Neither force nor forbid a page break before the generated box.

     * avoid: Avoid a page break before the generated box.

     * left: Force one or two page breaks before the generated box so that the next page is formatted as a left page.

     * right: Force one or two page breaks before the generated box so that the next page is formatted as a right page.
     * ```
     *
     * @param value -
     */
  pageBreakBefore(
    value: 'always' | 'auto' | 'avoid' | 'left' | 'right' | (string & {}),
  ) {
    this.props.set('page-break-before', value)
    return this
  }

  /**
     * Defines rules for page breaks inside an element..
     * 
     * syntax:  `table { page-break-inside: avoid; }`
     * 
     * restriction: enum
     * 
     * browsers: C,IE8,O7,S1.3
     * 
     * ref: http://www.w3.org/TR/css3-break/#page-break-properties
     * 
     * values:
     * ```md
     * auto: Neither force nor forbid a page break inside the generated box.

     * avoid: Avoid a page break inside the generated box.
     * ```
     *
     * @param value -
     */
  pageBreakInside(value: 'auto' | 'avoid' | (string & {})) {
    this.props.set('page-break-inside', value)
    return this
  }

  /**
     * Controls the order that the three paint operations that shapes and text are rendered with: their fill, their stroke and any markers they might have..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: C35,FF31,O22,S7.1
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#PaintOrderProperty
     * 
     * values:
     * ```md
     * fill: undefined

     * markers: undefined

     * normal: The element is painted with the standard order of painting operations: the 'fill' is painted first, then its 'stroke' and finally its markers.

     * stroke: undefined
     * ```
     *
     * @param value -
     */
  paintOrder(value: 'fill' | 'markers' | 'normal' | 'stroke' | (string & {})) {
    this.props.set('paint-order', value)
    return this
  }

  /**
     * Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself..
     * 
     * syntax:  `div { perspective: none; }`
     * 
     * restriction: length, enum
     * 
     * browsers: E,C36,FF16,IE10,O23,S9
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#perspective
     * 

     * @param value -
     */
  perspective(value: 'none' | (string & {})) {
    this.props.set('perspective', value)
    return this
  }

  /**
     * Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element..
     * 
     * syntax:  `div { perspective-origin: 10px; }`
     * 
     * restriction: position, percentage, length
     * 
     * browsers: E,C36,FF16,IE10,O23,S9
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin
     * 

     * @param value -
     */
  perspectiveOrigin(value: string) {
    this.props.set('perspective-origin', value)
    return this
  }

  /**
     * Specifies under what circumstances a given element can be the target element for a pointer event..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/interact.html#PointerEventsProperty
     * 
     * values:
     * ```md
     * all: The given element can be the target element for pointer events whenever the pointer is over either the interior or the perimeter of the element.

     * fill: The given element can be the target element for pointer events whenever the pointer is over the interior of the element.

     * none: The given element does not receive pointer events.

     * painted: The given element can be the target element for pointer events when the pointer is over a "painted" area. 

     * stroke: The given element can be the target element for pointer events whenever the pointer is over the perimeter of the element.

     * visible: The given element can be the target element for pointer events when the 'visibility' property is set to visible and the pointer is over either the interior or the perimeter of the element.

     * visibleFill: The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over the interior of the element.

     * visiblePainted: The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over a 'painted' area.

     * visibleStroke: The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over the perimeter of the element.
     * ```
     *
     * @param value -
     */
  pointerEvents(
    value:
      | 'all'
      | 'fill'
      | 'none'
      | 'painted'
      | 'stroke'
      | 'visible'
      | 'visibleFill'
      | 'visiblePainted'
      | 'visibleStroke'
      | (string & {}),
  ) {
    this.props.set('pointer-events', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { position: absolute; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-positioning/#propdef-position
     * 
     * values:
     * ```md
     * absolute: The box's position (and possibly size) is specified with the 'top', 'right', 'bottom', and 'left' properties. These properties specify offsets with respect to the box's 'containing block'.

     * center: Center positioned boxes are taken out of the normal flow. This means they have no impact on the layout of later siblings.

     * fixed: The box's position is calculated according to the 'absolute' model, but in addition, the box is fixed with respect to some reference. As with the 'absolute' model, the box's margins do not collapse with any other margins.

     * -ms-page: The box's position is calculated according to the 'absolute' model.

     * page: The box's position is calculated according to the 'absolute' model.

     * relative: The box's position is calculated according to the normal flow (this is called the position in normal flow). Then the box is offset relative to its normal position.

     * static: The box is a normal box, laid out according to the normal flow. The 'top', 'right', 'bottom', and 'left' properties do not apply.

     * sticky: The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.

     * -webkit-sticky: The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.
     * ```
     *
     * @param value -
     */
  position(
    value:
      | 'absolute'
      | 'center'
      | 'fixed'
      | '-ms-page'
      | 'page'
      | 'relative'
      | 'static'
      | 'sticky'
      | '-webkit-sticky'
      | (string & {}),
  ) {
    this.props.set('position', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies a <symbol> that is prepended to the marker representation..
     * 
     * syntax:  `@counter-style { prefix: '#'; }`
     * 
     * restriction: image, string, identifier
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-prefix
     * 

     * @param value -
     */
  prefix(value: string) {
    this.props.set('prefix', value)
    return this
  }

  /**
     * Specifies quotation marks for any number of embedded quotations..
     * 
     * syntax:  `none | [ <string> <string> ]+`
     * 
     * restriction: string
     * 
     * browsers: E,C,FF1.5,IE8,O8,S5.1
     * 
     * ref: http://www.w3.org/TR/css3-content/#quotes
     * 

     * @param value -
     */
  quotes(value: 'none' | (string & {})) {
    this.props.set('quotes', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Defines the ranges over which the counter style is defined..
     * 
     * syntax:  `@counter-style { range: 2 infinite, 8 834048; }`
     * 
     * restriction: integer, enum
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-range
     * 
     * values:
     * ```md
     * auto: The range depends on the counter system.

     * infinite: If used as the first value in a range, it represents negative infinity; if used as the second value, it represents positive infinity.
     * ```
     *
     * @param value -
     */
  range(value: 'auto' | 'infinite' | (string & {})) {
    this.props.set('range', value)
    return this
  }

  /**
     * Specifies whether or not an element is resizable by the user, and if so, along which axis/axes..
     * 
     * syntax:  `div { resize: both; }`
     * 
     * restriction: enum
     * 
     * browsers: C,FF4,O15,S3
     * 
     * ref: http://www.w3.org/TR/css3-ui/#resize0
     * 
     * values:
     * ```md
     * both: The UA presents a bidirectional resizing mechanism to allow the user to adjust both the height and the width of the element.

     * block: Logical 'vertical'

     * horizontal: The UA presents a unidirectional horizontal resizing mechanism to allow the user to adjust only the width of the element.

     * inline: Logical 'horizontal'

     * none: The UA does not present a resizing mechanism on the element, and the user is given no direct manipulation mechanism to resize the element.

     * vertical: The UA presents a unidirectional vertical resizing mechanism to allow the user to adjust only the height of the element.
     * ```
     *
     * @param value -
     */
  resize(
    value:
      | 'both'
      | 'block'
      | 'horizontal'
      | 'inline'
      | 'none'
      | 'vertical'
      | (string & {}),
  ) {
    this.props.set('resize', value)
    return this
  }

  /**
     * Specifies how far an absolutely positioned box's right margin edge is offset to the left of the right edge of the box's 'containing block'..
     * 
     * syntax:  `article { right: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-positioning/#propdef-right
     * 

     * @param value -
     */
  right(value: 'auto' | (string & {})) {
    this.props.set('right', value)
    return this
  }

  /**
     * Specifies how text is distributed within the various ruby boxes when their contents do not exactly fill their respective boxes..
     * 
     * syntax:  `auto | start | left | center | end | right | distribute-letter | distribute-space | line-edge`
     * 
     * restriction: enum
     * 
     * browsers: FF10,IE5
     * 
     * ref: http://www.w3.org/TR/css3-ruby/#rubyalign
     * 
     * values:
     * ```md
     * auto: The user agent determines how the ruby contents are aligned. This is the initial value.

     * center: The ruby content is centered within its box.

     * distribute-letter: If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with the first and last ruby text glyphs lining up with the corresponding first and last base glyphs. If the width of the ruby text is at least the width of the base, then the letters of the base are evenly distributed across the width of the ruby text.

     * distribute-space: If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with a certain amount of white space preceding the first and following the last character in the ruby text. That amount of white space is normally equal to half the amount of inter-character space of the ruby text.

     * left: The ruby text content is aligned with the start edge of the base.

     * line-edge: If the ruby text is not adjacent to a line edge, it is aligned as in 'auto'. If it is adjacent to a line edge, then it is still aligned as in auto, but the side of the ruby text that touches the end of the line is lined up with the corresponding edge of the base.

     * right: The ruby text content is aligned with the end edge of the base.

     * start: The ruby text content is aligned with the start edge of the base.

     * space-between: The ruby content expands as defined for normal text justification (as defined by 'text-justify'),

     * space-around: As for 'space-between' except that there exists an extra justification opportunities whose space is distributed half before and half after the ruby content.
     * ```
     *
     * @param value -
     */
  rubyAlign(
    value:
      | 'auto'
      | 'center'
      | 'distribute-letter'
      | 'distribute-space'
      | 'left'
      | 'line-edge'
      | 'right'
      | 'start'
      | 'space-between'
      | 'space-around'
      | (string & {}),
  ) {
    this.props.set('ruby-align', value)
    return this
  }

  /**
     * Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base..
     * 
     * syntax:  `auto | start | end | none`
     * 
     * restriction: enum
     * 
     * browsers: FF10,IE5
     * 
     * ref: http://www.w3.org/TR/css3-ruby/#rubyover
     * 
     * values:
     * ```md
     * auto: The ruby text can overhang text adjacent to the base on either side. This is the initial value.

     * end: The ruby text can overhang the text that follows it.

     * none: The ruby text cannot overhang any text adjacent to its base, only its own base.

     * start: The ruby text can overhang the text that precedes it.
     * ```
     *
     * @param value -
     */
  rubyOverhang(value: 'auto' | 'end' | 'none' | 'start' | (string & {})) {
    this.props.set('ruby-overhang', value)
    return this
  }

  /**
     * Used by the parent of elements with display: ruby-text to control the position of the ruby text with respect to its base..
     * 
     * syntax:  `before | after | right`
     * 
     * restriction: enum
     * 
     * browsers: FF10,IE5
     * 
     * ref: http://www.w3.org/TR/css3-ruby/#ruby-position
     * 
     * values:
     * ```md
     * after: The ruby text appears after the base. This is a relatively rare setting used in ideographic East Asian writing systems, most easily found in educational text.

     * before: The ruby text appears before the base. This is the most common setting used in ideographic East Asian writing systems.

     * inline: undefined

     * right: The ruby text appears on the right of the base. Unlike 'before' and 'after', this value is not relative to the text flow direction.
     * ```
     *
     * @param value -
     */
  rubyPosition(value: 'after' | 'before' | 'inline' | 'right' | (string & {})) {
    this.props.set('ruby-position', value)
    return this
  }

  /**
     * Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base..
     * 
     * syntax:  `attr(x) | none`
     * 
     * restriction: enum
     * 
     * browsers: FF10
     * 
     * ref: http://www.w3.org/TR/css3-ruby/#rubyspan
     * 
     * values:
     * ```md
     * attr(x): The value of attribute 'x' is a string value. The string value is evaluated as a <number> to determine the number of ruby base elements to be spanned by the annotation element.

     * none: No spanning. The computed value is '1'.
     * ```
     *
     * @param value -
     */
  rubySpan(value: 'attr(x)' | 'none' | (string & {})) {
    this.props.set('ruby-span', value)
    return this
  }

  /**
     * Specifies the scrolling behavior for a scrolling box, when scrolling happens due to navigation or CSSOM scrolling APIs..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: FF36
     * 
     * ref: http://www.w3.org/TR/cssom-view/#scroll-behavior
     * 
     * values:
     * ```md
     * auto: Scrolls in an instant fashion.

     * smooth: Scrolls in a smooth fashion using a user-agent-defined timing function and time period.
     * ```
     *
     * @param value -
     */
  scrollBehavior(value: 'auto' | 'smooth' | (string & {})) {
    this.props.set('scroll-behavior', value)
    return this
  }

  /**
     * Defines the x and y coordinate within the element which will align with the nearest ancestor scroll container's snap-destination for the respective axis..
     * 
     * syntax:  ` `
     * 
     * restriction: position, length, percentage, enum
     * 
     * browsers: FF39
     * 
     * ref: http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-coordinate
     * 
     * values:
     * ```md
     * none: Specifies that this element does not contribute a snap point.

     * border-box: Specifies the offset of the snap coordinate from the start edge of the element's border box.

     * margin-box: Specifies the offset of the snap coordinate from the start edge of the element's margin box.
     * ```
     *
     * @param value -
     */
  scrollSnapCoordinate(
    value: 'none' | 'border-box' | 'margin-box' | (string & {}),
  ) {
    this.props.set('scroll-snap-coordinate', value)
    return this
  }

  /**
     * Define the x and y coordinate within the scroll container's visual viewport which element snap points will align with..
     * 
     * syntax:  ` `
     * 
     * restriction: position, length, percentage
     * 
     * browsers: FF39
     * 
     * ref: http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-destination
     * 

     * @param value -
     */
  scrollSnapDestination(value: string) {
    this.props.set('scroll-snap-destination', value)
    return this
  }

  /**
     * Defines the positioning of snap points along the x axis of the scroll container it is applied to..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: FF39
     * 
     * ref: http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-points-x
     * 
     * values:
     * ```md
     * none: No snap points are defined by this scroll container.

     * repeat(): Defines an interval at which snap points are defined, starting from the container's relevant start edge.
     * ```
     *
     * @param value -
     */
  scrollSnapPointsX(value: 'none' | 'repeat()' | (string & {})) {
    this.props.set('scroll-snap-points-x', value)
    return this
  }

  /**
     * Defines the positioning of snap points along the y axis of the scroll container it is applied to..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: FF39
     * 
     * ref: http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-points-y
     * 
     * values:
     * ```md
     * none: No snap points are defined by this scroll container.

     * repeat(): Defines an interval at which snap points are defined, starting from the container's relevant start edge.
     * ```
     *
     * @param value -
     */
  scrollSnapPointsY(value: 'none' | 'repeat()' | (string & {})) {
    this.props.set('scroll-snap-points-y', value)
    return this
  }

  /**
     * Defines how strictly snap points are enforced on the scroll container..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: FF39
     * 
     * ref: http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-type
     * 
     * values:
     * ```md
     * none: The visual viewport of this scroll container must ignore snap points, if any, when scrolled.

     * mandatory: The visual viewport of this scroll container is guaranteed to rest on a snap point when there are no active scrolling operations.

     * proximity: The visual viewport of this scroll container may come to rest on a snap point at the termination of a scroll at the discretion of the UA given the parameters of the scroll.
     * ```
     *
     * @param value -
     */
  scrollSnapType(value: 'none' | 'mandatory' | 'proximity' | (string & {})) {
    this.props.set('scroll-snap-type', value)
    return this
  }

  /**
     * Defines the alpha channel threshold used to extract the shape using an image. A value of 0.5 means that the shape will enclose all the pixels that are more than 50% opaque..
     * 
     * syntax:  `div { shape-image-threshold: 0.5; }`
     * 
     * restriction: number
     * 
     * browsers: C37,O24
     * 
     * ref: http://www.w3.org/TR/css-shapes-1/#propdef-shape-image-threshold
     * 

     * @param value -
     */
  shapeImageThreshold(value: number) {
    this.props.set('shape-image-threshold', value)
    return this
  }

  /**
     * Adds a margin to a 'shape-outside'. This defines a new shape that is the smallest contour that includes all the points that are the 'shape-margin' distance outward in the perpendicular direction from a point on the underlying shape..
     * 
     * syntax:  `div { shape-margin: 10px; }`
     * 
     * restriction: url, length, percentage
     * 
     * browsers: C37,O24
     * 
     * ref: http://www.w3.org/TR/css-shapes-1/#propdef-shape-margin
     * 

     * @param value -
     */
  shapeMargin(value: string) {
    this.props.set('shape-margin', value)
    return this
  }

  /**
     * Specifies an orthogonal rotation to be applied to an image before it is laid out..
     * 
     * syntax:  `div { shape-outside: margin-box; }`
     * 
     * restriction: image, box, shape, enum
     * 
     * browsers: C37,O24
     * 
     * ref: http://www.w3.org/TR/css-shapes-1/#shape-outside-property
     * 
     * values:
     * ```md
     * margin-box: The background is painted within (clipped to) the margin box.

     * none: The float area is unaffected.
     * ```
     *
     * @param value -
     */
  shapeOutside(value: 'margin-box' | 'none' | (string & {})) {
    this.props.set('shape-outside', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `<length>{1,2} | auto | [ <page-size> || [ portrait | landscape] ]`
     * 
     * restriction: length
     * 
     * browsers: C,O8
     * 
     * ref: http://www.w3.org/TR/css3-page/#page-size-prop
     * 

     * @param value -
     */
  size(value: string) {
    this.props.set('size', value)
    return this
  }

  /**
     * `@`font-face descriptor. Specifies the resource containing font data. It is required, whether the font is downloadable or locally installed..
     * 
     * syntax:  `src: url(font.woff) format('woff');`
     * 
     * restriction: enum, url, identifier
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#src-desc
     * 
     * values:
     * ```md
     * url(): Reference font by URL

     * format(): Optional hint describing the format of the font resource.

     * local(): Format-specific string that identifies a locally available copy of a given font.
     * ```
     *
     * @param value -
     */
  src(value: 'url()' | 'format()' | 'local()' | (string & {})) {
    this.props.set('src', value)
    return this
  }

  /**
     * Indicates what color to use at that gradient stop..
     * 
     * syntax:  ` `
     * 
     * restriction: color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/pservers.html#StopColorProperty
     * 

     * @param value -
     */
  stopColor(value: string) {
    this.props.set('stop-color', value)
    return this
  }

  /**
     * Defines the opacity of a given gradient stop..
     * 
     * syntax:  ` `
     * 
     * restriction: number(0-1)
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty
     * 

     * @param value -
     */
  stopOpacity(value: number) {
    this.props.set('stop-opacity', value)
    return this
  }

  /**
     * Paints along the outline of the given graphical element..
     * 
     * syntax:  ` `
     * 
     * restriction: color, enum, url
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeProperty
     * 
     * values:
     * ```md
     * child: A reference to the last child paint server element of the element being painted.

     * child(): A reference to the nth child paint server element of the element being painted.

     * context-fill: The computed value of the 'fill' property of the context element of the element being painted.

     * context-stroke: The computed value of the 'stroke' property of the context element of the element being painted.

     * url(): A URL reference to a paint server element, which is an element that defines a paint server: 'hatch', 'linearGradient', 'mesh', 'pattern', 'radialGradient' and 'solidcolor'.

     * none: No paint is applied in this layer.
     * ```
     *
     * @param value -
     */
  stroke(
    value:
      | 'child'
      | 'child()'
      | 'context-fill'
      | 'context-stroke'
      | 'url()'
      | 'none'
      | (string & {}),
  ) {
    this.props.set('stroke', value)
    return this
  }

  /**
     * Controls the pattern of dashes and gaps used to stroke paths..
     * 
     * syntax:  ` `
     * 
     * restriction: length, percentage, number, enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeDasharrayProperty
     * 

     * @param value -
     */
  strokeDasharray(value: 'none' | (string & {})) {
    this.props.set('stroke-dasharray', value)
    return this
  }

  /**
     * Specifies the distance into the dash pattern to start the dash..
     * 
     * syntax:  ` `
     * 
     * restriction: percentage, length
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeDashoffsetProperty
     * 

     * @param value -
     */
  strokeDashoffset(value: string) {
    this.props.set('stroke-dashoffset', value)
    return this
  }

  /**
     * Specifies the shape to be used at the end of open subpaths when they are stroked..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeLinecapProperty
     * 
     * values:
     * ```md
     * butt: Indicates that the stroke for each subpath does not extend beyond its two endpoints.

     * round: Indicates that at each end of each subpath, the shape representing the stroke will be extended by a half circle with a radius equal to the stroke width.

     * square: Indicates that at the end of each subpath, the shape representing the stroke will be extended by a rectangle with the same width as the stroke width and whose length is half of the stroke width.
     * ```
     *
     * @param value -
     */
  strokeLinecap(value: 'butt' | 'round' | 'square' | (string & {})) {
    this.props.set('stroke-linecap', value)
    return this
  }

  /**
     * Specifies the shape to be used at the corners of paths or basic shapes when they are stroked..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeLinejoinProperty
     * 
     * values:
     * ```md
     * arcs: Indicates that an arcs corner is to be used to join path segments.

     * bevel: Indicates that a bevelled corner is to be used to join path segments.

     * miter: Indicates that a sharp corner is to be used to join path segments.

     * miter-clip: Same as miter but if the 'stroke-miterlimit' is exceeded, the miter is clipped at a miter length equal to the 'stroke-miterlimit' value multiplied by the stroke width.

     * round: Indicates that a round corner is to be used to join path segments.
     * ```
     *
     * @param value -
     */
  strokeLinejoin(
    value: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round' | (string & {}),
  ) {
    this.props.set('stroke-linejoin', value)
    return this
  }

  /**
     * When two line segments meet at a sharp angle and miter joins have been specified for 'stroke-linejoin', it is possible for the miter to extend far beyond the thickness of the line stroking the path..
     * 
     * syntax:  `path { stroke-miterlimit: 4; }`
     * 
     * restriction: number
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeMiterlimitProperty
     * 

     * @param value -
     */
  strokeMiterlimit(value: number) {
    this.props.set('stroke-miterlimit', value)
    return this
  }

  /**
     * Specifies the opacity of the painting operation used to stroke the current object..
     * 
     * syntax:  ` `
     * 
     * restriction: number(0-1)
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeOpacityProperty
     * 

     * @param value -
     */
  strokeOpacity(value: number) {
    this.props.set('stroke-opacity', value)
    return this
  }

  /**
     * Specifies the width of the stroke on the current object..
     * 
     * syntax:  ` `
     * 
     * restriction: percentage, length
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#StrokeWidth
     * 

     * @param value -
     */
  strokeWidth(value: string) {
    this.props.set('stroke-width', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies a <symbol> that is appended to the marker representation..
     * 
     * syntax:  `@counter-style { suffix: '\2E\20'; }`
     * 
     * restriction: image, string, identifier
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-suffix
     * 

     * @param value -
     */
  suffix(value: string) {
    this.props.set('suffix', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies which algorithm will be used to construct the counter's representation based on the counter value..
     * 
     * syntax:  `@counter-style triangle { system: cyclic; }`
     * 
     * restriction: enum, integer
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-system
     * 
     * values:
     * ```md
     * additive: Represents "sign-value" numbering systems, which, rather than using reusing digits in different positions to change their value, define additional digits with much larger values, so that the value of the number can be obtained by adding all the digits together.

     * alphabetic: Interprets the list of counter symbols as digits to an alphabetic numbering system, similar to the default lower-alpha counter style, which wraps from "a", "b", "c", to "aa", "ab", "ac".

     * cyclic: Cycles repeatedly through its provided symbols, looping back to the beginning when it reaches the end of the list.

     * extends: Use the algorithm of another counter style, but alter other aspects.

     * fixed: Runs through its list of counter symbols once, then falls back.

     * numeric: interprets the list of counter symbols as digits to a "place-value" numbering system, similar to the default 'decimal' counter style.

     * symbolic: Cycles repeatedly through its provided symbols, doubling, tripling, etc. the symbols on each successive pass through the list.
     * ```
     *
     * @param value -
     */
  system(
    value:
      | 'additive'
      | 'alphabetic'
      | 'cyclic'
      | 'extends'
      | 'fixed'
      | 'numeric'
      | 'symbolic'
      | (string & {}),
  ) {
    this.props.set('system', value)
    return this
  }

  /**
     * `@`counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor..
     * 
     * syntax:  `@counter-style { symbols: '*' ⁑ † ‡; }`
     * 
     * restriction: image, string, identifier
     * 
     * browsers: FF33
     * 
     * ref: http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-symbols
     * 

     * @param value -
     */
  symbols(value: string) {
    this.props.set('symbols', value)
    return this
  }

  /**
     * Controls the algorithm used to lay out the table cells, rows, and columns..
     * 
     * syntax:  `table { table-layout: fixed; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/CSS2/tables.html#width-layout
     * 
     * values:
     * ```md
     * auto: Use any automatic table layout algorithm.

     * fixed: Use the fixed table layout algorithm.
     * ```
     *
     * @param value -
     */
  tableLayout(value: 'auto' | 'fixed' | (string & {})) {
    this.props.set('table-layout', value)
    return this
  }

  /**
     * Determines the width of the tab character (U+0009), in space characters (U+0020), when rendered..
     * 
     * syntax:  `div { tab-size: 4; }`
     * 
     * restriction: integer, length
     * 
     * browsers: C21,O15,S6.1
     * 
     * ref: http://www.w3.org/TR/css3-text/#tab-size
     * 

     * @param value -
     */
  tabSize(value: string) {
    this.props.set('tab-size', value)
    return this
  }

  /**
     * Describes how inline contents of a block are horizontally aligned if the contents do not completely fill the line box..
     * 
     * syntax:  `h2 { text-align: center; }`
     * 
     * restriction: string
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-text/#text-align0
     * 
     * values:
     * ```md
     * center: The inline contents are centered within the line box.

     * end: The inline contents are aligned to the end edge of the line box.

     * justify: The text is justified according to the method specified by the 'text-justify' property.

     * left: The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.

     * match-parent: This value behaves the same as 'inherit' except that an inherited value of 'start' or 'end' is calculated against its parent's 'direction' value.

     * right: The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.

     * start: The inline contents are aligned to the start edge of the line box.
     * ```
     *
     * @param value -
     */
  textAlign(
    value:
      | 'center'
      | 'end'
      | 'justify'
      | 'left'
      | 'match-parent'
      | 'right'
      | 'start'
      | (string & {}),
  ) {
    this.props.set('text-align', value)
    return this
  }

  /**
     * Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'..
     * 
     * syntax:  `div { text-align-last: right; }`
     * 
     * restriction: enum
     * 
     * browsers: E,FF12,IE5
     * 
     * ref: http://www.w3.org/TR/css3-text/#text-align-last0
     * 
     * values:
     * ```md
     * auto: Content on the affected line is aligned per 'text-align' unless 'text-align' is set to 'justify', in which case it is 'start-aligned'.

     * center: The inline contents are centered within the line box.

     * end: The inline contents are aligned to the end edge of the line box.

     * justify: The text is justified according to the method specified by the 'text-justify' property.

     * left: The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.

     * right: The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.

     * start: The inline contents are aligned to the start edge of the line box.
     * ```
     *
     * @param value -
     */
  textAlignLast(
    value:
      | 'auto'
      | 'center'
      | 'end'
      | 'justify'
      | 'left'
      | 'right'
      | 'start'
      | (string & {}),
  ) {
    this.props.set('text-align-last', value)
    return this
  }

  /**
     * Used to align (start-, middle- or end-alignment) a string of text relative to a given point..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/SVG2/text.html#TextAnchorProperty
     * 
     * values:
     * ```md
     * end: The rendered characters are aligned such that the end of the resulting rendered text is at the initial current text position.

     * middle: The rendered characters are aligned such that the geometric middle of the resulting rendered text is at the initial current text position.

     * start: The rendered characters are aligned such that the start of the resulting rendered text is at the initial current text position.
     * ```
     *
     * @param value -
     */
  textAnchor(value: 'end' | 'middle' | 'start' | (string & {})) {
    this.props.set('text-anchor', value)
    return this
  }

  /**
     * Decorations applied to font used for an element's text..
     * 
     * syntax:  `a:visited { text-decoration: line-through; }`
     * 
     * restriction: enum, color
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-style
     * 
     * values:
     * ```md
     * dashed: Produces a dashed line style.

     * dotted: Produces a dotted line.

     * double: Produces a double line.

     * line-through: Each line of text has a line through the middle.

     * none: Produces no line.

     * overline: Each line of text has a line above it.

     * solid: Produces a solid line.

     * underline: Each line of text is underlined.

     * wavy: Produces a wavy line.
     * ```
     *
     * @param value -
     */
  textDecoration(
    value:
      | 'dashed'
      | 'dotted'
      | 'double'
      | 'line-through'
      | 'none'
      | 'overline'
      | 'solid'
      | 'underline'
      | 'wavy'
      | (string & {}),
  ) {
    this.props.set('text-decoration', value)
    return this
  }

  /**
     * Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line..
     * 
     * syntax:  `div { text-decoration-color: #ff0; }`
     * 
     * restriction: color
     * 
     * browsers: FF36,C57,O44
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-color
     * 

     * @param value -
     */
  textDecorationColor(value: string) {
    this.props.set('text-decoration-color', value)
    return this
  }

  /**
     * Specifies what line decorations, if any, are added to the element..
     * 
     * syntax:  `div { text-decoration-line: underline; }`
     * 
     * restriction: enum
     * 
     * browsers: FF36
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-line
     * 
     * values:
     * ```md
     * line-through: Each line of text has a line through the middle.

     * none: Neither produces nor inhibits text decoration.

     * overline: Each line of text has a line above it.

     * underline: Each line of text is underlined.
     * ```
     *
     * @param value -
     */
  textDecorationLine(
    value: 'line-through' | 'none' | 'overline' | 'underline' | (string & {}),
  ) {
    this.props.set('text-decoration-line', value)
    return this
  }

  /**
     * Specifies the line style for underline, line-through and overline text decoration..
     * 
     * syntax:  `div { text-decoration-style: solid; }`
     * 
     * restriction: enum
     * 
     * browsers: FF36
     * 
     * ref: http://www.w3.org/TR/css-text-decor-3/#text-decoration-style
     * 
     * values:
     * ```md
     * dashed: Produces a dashed line style.

     * dotted: Produces a dotted line.

     * double: Produces a double line.

     * none: Produces no line.

     * solid: Produces a solid line.

     * wavy: Produces a wavy line.
     * ```
     *
     * @param value -
     */
  textDecorationStyle(
    value:
      | 'dashed'
      | 'dotted'
      | 'double'
      | 'none'
      | 'solid'
      | 'wavy'
      | (string & {}),
  ) {
    this.props.set('text-decoration-style', value)
    return this
  }

  /**
     * Specifies the indentation applied to lines of inline content in a block. The indentation only affects the first line of inline content in the block unless the 'hanging' keyword is specified, in which case it affects all lines except the first..
     * 
     * syntax:  `li { text-indent: 5px; }`
     * 
     * restriction: percentage, length
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-text/#text-indent0
     * 
     * values:
     * ```md
     * each-line: Indentation affects the first line of the block container as well as each line after a forced line break, but does not affect lines after a text wrap break.

     * hanging: Inverts which lines are affected.
     * ```
     *
     * @param value -
     */
  textIndent(value: 'each-line' | 'hanging' | (string & {})) {
    this.props.set('text-indent', value)
    return this
  }

  /**
     * Specifies the orientation of text within a line..
     * 
     * syntax:  `span { text-orientation: mixed; }`
     * 
     * restriction: enum
     * 
     * browsers: C,O15,S5.1
     * 
     * ref: http://www.w3.org/TR/css-writing-modes-3/#text-orientation
     * 
     * values:
     * ```md
     * mixed: In vertical writing modes, characters from horizontal-only scripts are set sideways, i.e. 90° clockwise from their standard orientation in horizontal text.

     * sideways: This value is equivalent to 'sideways-right' in 'vertical-rl' writing mode and equivalent to 'sideways-left' in 'vertical-lr' writing mode.

     * sideways-left: In vertical writing modes, this causes text to be set as if in a horizontal layout, but rotated 90° counter-clockwise.

     * sideways-right: In vertical writing modes, this causes text to be set as if in a horizontal layout, but rotated 90° clockwise.

     * upright: In vertical writing modes, characters from horizontal-only scripts are rendered upright, i.e. in their standard horizontal orientation.

     * use-glyph-orientation: This value deprecated and only applies to SVG.
     * ```
     *
     * @param value -
     */
  textOrientation(
    value:
      | 'mixed'
      | 'sideways'
      | 'sideways-left'
      | 'sideways-right'
      | 'upright'
      | 'use-glyph-orientation'
      | (string & {}),
  ) {
    this.props.set('text-orientation', value)
    return this
  }

  /**
     * Text can overflow for example when it is prevented from wrapping..
     * 
     * syntax:  `span { text-overflow: ellipsis; }`
     * 
     * restriction: enum, string
     * 
     * browsers: E,C,FF9,IE5.5,O11.6,S2
     * 
     * ref: http://www.w3.org/TR/css3-ui/#text-overflow0
     * 
     * values:
     * ```md
     * clip: Clip inline content that overflows. Characters may be only partially rendered.

     * ellipsis: Render an ellipsis character (U+2026) to represent clipped inline content.
     * ```
     *
     * @param value -
     */
  textOverflow(value: 'clip' | 'ellipsis' | (string & {})) {
    this.props.set('text-overflow', value)
    return this
  }

  /**
     * The creator of SVG content might want to provide a hint to the implementation about what tradeoffs to make as it renders text. The 'text-rendering' property provides these hints..
     * 
     * syntax:  ` `
     * 
     * restriction: enum
     * 
     * browsers: C,FF3,O9,S5
     * 
     * ref: http://www.w3.org/TR/SVG2/painting.html#TextRenderingProperty
     * 
     * values:
     * ```md
     * auto: undefined

     * geometricPrecision: Indicates that the user agent shall emphasize geometric precision over legibility and rendering speed.

     * optimizeLegibility: Indicates that the user agent shall emphasize legibility over rendering speed and geometric precision.

     * optimizeSpeed: Indicates that the user agent shall emphasize rendering speed over legibility and geometric precision.
     * ```
     *
     * @param value -
     */
  textRendering(
    value:
      | 'auto'
      | 'geometricPrecision'
      | 'optimizeLegibility'
      | 'optimizeSpeed'
      | (string & {}),
  ) {
    this.props.set('text-rendering', value)
    return this
  }

  /**
     * Enables shadow effects to be applied to the text of the element..
     * 
     * syntax:  `h1 { text-shadow: 20px 12px 2px #333;}`
     * 
     * restriction: length, color
     * 
     * browsers: E,C,FF3.6,IE10,O9.5,S1.1
     * 
     * ref: http://www.w3.org/TR/css3-text/#text-shadow0
     * 

     * @param value -
     */
  textShadow(value: 'none' | (string & {})) {
    this.props.set('text-shadow', value)
    return this
  }

  /**
     * Controls capitalization effects of an element's text..
     * 
     * syntax:  `h1 { text-transform: capitalize; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-text/#text-transform0
     * 
     * values:
     * ```md
     * capitalize: Puts the first typographic letter unit of each word in titlecase.

     * full-width: Puts all characters in fullwidth form. If the character does not have corresponding fullwidth form, it is left as is.

     * lowercase: Puts all letters in lowercase.

     * none: No effects.

     * uppercase: Puts all letters in uppercase.
     * ```
     *
     * @param value -
     */
  textTransform(
    value:
      | 'capitalize'
      | 'full-width'
      | 'lowercase'
      | 'none'
      | 'uppercase'
      | (string & {}),
  ) {
    this.props.set('text-transform', value)
    return this
  }

  /**
     * Specifies how far an absolutely positioned box's top margin edge is offset below the top edge of the box's 'containing block'..
     * 
     * syntax:  `article { top: 50px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-positioning/#propdef-top
     * 

     * @param value -
     */
  top(value: 'auto' | (string & {})) {
    this.props.set('top', value)
    return this
  }

  /**
     * Determines whether touch input may trigger default behavior supplied by user agent..
     * 
     * syntax:  `div { touch-action: pan-x; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C36,IE11,O23
     * 
     * ref: http://www.w3.org/TR/pointerevents/#the-touch-action-css-property
     * 
     * values:
     * ```md
     * auto: The user agent may determine any permitted touch behaviors for touches that begin on the element.

     * cross-slide-x: undefined

     * cross-slide-y: undefined

     * double-tap-zoom: undefined

     * manipulation: The user agent may consider touches that begin on the element only for the purposes of scrolling and continuous zooming.

     * none: Touches that begin on the element must not trigger default touch behaviors.

     * pan-x: The user agent may consider touches that begin on the element only for the purposes of horizontally scrolling the element's nearest ancestor with horizontally scrollable content.

     * pan-y: The user agent may consider touches that begin on the element only for the purposes of vertically scrolling the element's nearest ancestor with vertically scrollable content.

     * pinch-zoom: undefined
     * ```
     *
     * @param value -
     */
  touchAction(
    value:
      | 'auto'
      | 'cross-slide-x'
      | 'cross-slide-y'
      | 'double-tap-zoom'
      | 'manipulation'
      | 'none'
      | 'pan-x'
      | 'pan-y'
      | 'pinch-zoom'
      | (string & {}),
  ) {
    this.props.set('touch-action', value)
    return this
  }

  /**
     * A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG..
     * 
     * syntax:  `div { transform: rotate(-90deg); }`
     * 
     * restriction: enum
     * 
     * browsers: E,C36,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-transforms/#transform-property
     * 
     * values:
     * ```md
     * matrix(): Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]

     * matrix3d(): Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.

     * none: undefined

     * perspective(): Specifies a perspective projection matrix.

     * rotate(): Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.

     * rotate3d(): Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.

     * rotateX('angle'): Specifies a clockwise rotation by the given angle about the X axis.

     * rotateY('angle'): Specifies a clockwise rotation by the given angle about the Y axis.

     * rotateZ('angle'): Specifies a clockwise rotation by the given angle about the Z axis.

     * scale(): Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.

     * scale3d(): Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.

     * scaleX(): Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.

     * scaleY(): Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.

     * scaleZ(): Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.

     * skew(): Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).

     * skewX(): Specifies a skew transformation along the X axis by the given angle.

     * skewY(): Specifies a skew transformation along the Y axis by the given angle.

     * translate(): Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.

     * translate3d(): Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.

     * translateX(): Specifies a translation by the given amount in the X direction.

     * translateY(): Specifies a translation by the given amount in the Y direction.

     * translateZ(): Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.
     * ```
     *
     * @param value -
     */
  transform(
    value:
      | 'matrix()'
      | 'matrix3d()'
      | 'none'
      | 'perspective()'
      | 'rotate()'
      | 'rotate3d()'
      | "rotateX('angle')"
      | "rotateY('angle')"
      | "rotateZ('angle')"
      | 'scale()'
      | 'scale3d()'
      | 'scaleX()'
      | 'scaleY()'
      | 'scaleZ()'
      | 'skew()'
      | 'skewX()'
      | 'skewY()'
      | 'translate()'
      | 'translate3d()'
      | 'translateX()'
      | 'translateY()'
      | 'translateZ()'
      | (string & {}),
  ) {
    this.props.set('transform', value)
    return this
  }

  /**
     * Establishes the origin of transformation for an element..
     * 
     * syntax:  `.album { transform-origin: 20% 40%; }`
     * 
     * restriction: position, length, percentage
     * 
     * browsers: E,C36,FF16,IE10,O12.1,S9
     * 
     * ref: http://www.w3.org/TR/css3-transforms/#propdef-transform-origin
     * 

     * @param value -
     */
  transformOrigin(value: string) {
    this.props.set('transform-origin', value)
    return this
  }

  /**
     * Defines how nested elements are rendered in 3D space..
     * 
     * syntax:  `div { transform-style: flat; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C36,FF16,IE10,O23,S9
     * 
     * ref: http://www.w3.org/TR/css3-transforms/#propdef-transform-style
     * 
     * values:
     * ```md
     * flat: All children of this element are rendered flattened into the 2D plane of the element.

     * preserve-3d: Flattening is not performed, so children maintain their position in 3D space.
     * ```
     *
     * @param value -
     */
  transformStyle(value: 'flat' | 'preserve-3d' | (string & {})) {
    this.props.set('transform-style', value)
    return this
  }

  /**
     * Shorthand property combines four of the transition properties into a single property..
     * 
     * syntax:  `div { transition: background-color linear 1s; }`
     * 
     * restriction: time, property, timing-function, enum
     * 
     * browsers: E,FF16,IE10,O12.5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition
     * 
     * values:
     * ```md
     * all: Every property that is able to undergo a transition will do so.

     * none: No property will transition.
     * ```
     *
     * @param value -
     */
  transition(value: 'all' | 'none' | (string & {})) {
    this.props.set('transition', value)
    return this
  }

  /**
     * Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied..
     * 
     * syntax:  `div { transition-delay: 1s; }`
     * 
     * restriction: time
     * 
     * browsers: E,FF16,IE10,O12.5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-delay
     * 

     * @param value -
     */
  transitionDelay(value: string) {
    this.props.set('transition-delay', value)
    return this
  }

  /**
     * Specifies how long the transition from the old value to the new value should take..
     * 
     * syntax:  `div { transition-duration: 1s; }`
     * 
     * restriction: time
     * 
     * browsers: E,FF16,IE10,O12.5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-duration
     * 

     * @param value -
     */
  transitionDuration(value: string) {
    this.props.set('transition-duration', value)
    return this
  }

  /**
     * Specifies the name of the CSS property to which the transition is applied..
     * 
     * syntax:  `div { transition-property: background-color; }`
     * 
     * restriction: property
     * 
     * browsers: E,FF16,IE10,O12.5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-property
     * 
     * values:
     * ```md
     * all: Every property that is able to undergo a transition will do so.

     * none: No property will transition.
     * ```
     *
     * @param value -
     */
  transitionProperty(value: 'all' | 'none' | (string & {})) {
    this.props.set('transition-property', value)
    return this
  }

  /**
     * Describes how the intermediate values used during a transition will be calculated..
     * 
     * syntax:  `div { transition-timing-function: linear; }`
     * 
     * restriction: timing-function
     * 
     * browsers: E,FF16,IE10,O12.5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-timing-function
     * 

     * @param value -
     */
  transitionTimingFunction(value: string) {
    this.props.set('transition-timing-function', value)
    return this
  }

  /**
     * The level of embedding with respect to the bidirectional algorithm..
     * 
     * syntax:  `p { unicode-bidi: embed; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-writing-modes-3/#unicode-bidi
     * 
     * values:
     * ```md
     * bidi-override: Inside the element, reordering is strictly in sequence according to the 'direction' property; the implicit part of the bidirectional algorithm is ignored.

     * embed: If the element is inline-level, this value opens an additional level of embedding with respect to the bidirectional algorithm. The direction of this embedding level is given by the 'direction' property.

     * isolate: The contents of the element are considered to be inside a separate, independent paragraph.

     * isolate-override: This combines the isolation behavior of 'isolate' with the directional override behavior of 'bidi-override'

     * normal: The element does not open an additional level of embedding with respect to the bidirectional algorithm. For inline-level elements, implicit reordering works across element boundaries.

     * plaintext: For the purposes of the Unicode bidirectional algorithm, the base directionality of each bidi paragraph for which the element forms the containing block is determined not by the element's computed 'direction'.
     * ```
     *
     * @param value -
     */
  unicodeBidi(
    value:
      | 'bidi-override'
      | 'embed'
      | 'isolate'
      | 'isolate-override'
      | 'normal'
      | 'plaintext'
      | (string & {}),
  ) {
    this.props.set('unicode-bidi', value)
    return this
  }

  /**
     * `@`font-face descriptor. Defines the set of Unicode codepoints that may be supported by the font face for which it is declared..
     * 
     * syntax:  `@font-face { unicode-range: U+26; }`
     * 
     * restriction: unicode-range
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#unicode-range-desc
     * 
     * values:
     * ```md
     * U+26: Ampersand.

     * U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00-FB4F: WGL4 character set (Pan-European).

     * U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF: The Multilingual European Subset No. 1. Latin. Covers ~44 languages.

     * U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD: The Multilingual European Subset No. 2. Latin, Greek, and Cyrillic. Covers ~128 language.

     * U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD: The Multilingual European Subset No. 3. Covers all characters belonging to European scripts.

     * U+00-7F: Basic Latin (ASCII).

     * U+80-FF: Latin-1 Supplement. Accented characters for Western European languages, common punctuation characters, multiplication and division signs.

     * U+100-17F: Latin Extended-A. Accented characters for for Czech, Dutch, Polish, and Turkish.

     * U+180-24F: Latin Extended-B. Croatian, Slovenian, Romanian, Non-European and historic latin, Khoisan, Pinyin, Livonian, Sinology.

     * U+1E00-1EFF: Latin Extended Additional. Vietnamese, German captial sharp s, Medievalist, Latin general use.

     * U+250-2AF: International Phonetic Alphabet Extensions.

     * U+370-3FF: Greek and Coptic.

     * U+1F00-1FFF: Greek Extended. Accented characters for polytonic Greek.

     * U+400-4FF: Cyrillic.

     * U+500-52F: Cyrillic Supplement. Extra letters for Komi, Khanty, Chukchi, Mordvin, Kurdish, Aleut, Chuvash, Abkhaz, Azerbaijani, and Orok.

     * U+00-52F, U+1E00-1FFF, U+2200-22FF: Latin, Greek, Cyrillic, some punctuation and symbols.

     * U+530-58F: Armenian.

     * U+590-5FF: Hebrew.

     * U+600-6FF: Arabic.

     * U+750-77F: Arabic Supplement. Additional letters for African languages, Khowar, Torwali, Burushaski, and early Persian.

     * U+8A0-8FF: Arabic Extended-A. Additional letters for African languages, European and Central Asian languages, Rohingya, Tamazight, Arwi, and Koranic annotation signs.

     * U+700-74F: Syriac.

     * U+900-97F: Devanagari.

     * U+980-9FF: Bengali.

     * U+A00-A7F: Gurmukhi.

     * U+A80-AFF: Gujarati.

     * U+B00-B7F: Oriya.

     * U+B80-BFF: Tamil.

     * U+C00-C7F: Telugu.

     * U+C80-CFF: Kannada.

     * U+D00-D7F: Malayalam.

     * U+D80-DFF: Sinhala.

     * U+118A0-118FF: Warang Citi.

     * U+E00-E7F: Thai.

     * U+1A20-1AAF: Tai Tham.

     * U+AA80-AADF: Tai Viet.

     * U+E80-EFF: Lao.

     * U+F00-FFF: Tibetan.

     * U+1000-109F: Myanmar (Burmese).

     * U+10A0-10FF: Georgian.

     * U+1200-137F: Ethiopic.

     * U+1380-139F: Ethiopic Supplement. Extra Syllables for Sebatbeit, and Tonal marks

     * U+2D80-2DDF: Ethiopic Extended. Extra Syllables for Me'en, Blin, and Sebatbeit.

     * U+AB00-AB2F: Ethiopic Extended-A. Extra characters for Gamo-Gofa-Dawro, Basketo, and Gumuz.

     * U+1780-17FF: Khmer.

     * U+1800-18AF: Mongolian.

     * U+1B80-1BBF: Sundanese.

     * U+1CC0-1CCF: Sundanese Supplement. Punctuation.

     * U+4E00-9FD5: CJK (Chinese, Japanese, Korean) Unified Ideographs. Most common ideographs for modern Chinese and Japanese.

     * U+3400-4DB5: CJK Unified Ideographs Extension A. Rare ideographs.

     * U+2F00-2FDF: Kangxi Radicals.

     * U+2E80-2EFF: CJK Radicals Supplement. Alternative forms of Kangxi Radicals.

     * U+1100-11FF: Hangul Jamo.

     * U+AC00-D7AF: Hangul Syllables.

     * U+3040-309F: Hiragana.

     * U+30A0-30FF: Katakana.

     * U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F: Japanese Kanji, Hiragana and Katakana characters plus Yen/Yuan symbol.

     * U+A4D0-A4FF: Lisu.

     * U+A000-A48F: Yi Syllables.

     * U+A490-A4CF: Yi Radicals.

     * U+2000-206F: General Punctuation.

     * U+3000-303F: CJK Symbols and Punctuation.

     * U+2070-209F: Superscripts and Subscripts.

     * U+20A0-20CF: Currency Symbols.

     * U+2100-214F: Letterlike Symbols.

     * U+2150-218F: Number Forms.

     * U+2190-21FF: Arrows.

     * U+2200-22FF: Mathematical Operators.

     * U+2300-23FF: Miscellaneous Technical.

     * U+E000-F8FF: Private Use Area.

     * U+FB00-FB4F: Alphabetic Presentation Forms. Ligatures for latin, Armenian, and Hebrew.

     * U+FB50-FDFF: Arabic Presentation Forms-A. Contextual forms / ligatures for Persian, Urdu, Sindhi, Central Asian languages, etc, Arabic pedagogical symbols, word ligatures.

     * U+1F600-1F64F: Emoji: Emoticons.

     * U+2600-26FF: Emoji: Miscellaneous Symbols.

     * U+1F300-1F5FF: Emoji: Miscellaneous Symbols and Pictographs.

     * U+1F900-1F9FF: Emoji: Supplemental Symbols and Pictographs.

     * U+1F680-1F6FF: Emoji: Transport and Map Symbols.
     * ```
     *
     * @param value -
     */
  unicodeRange(
    value:
      | 'U+26'
      | 'U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00-FB4F'
      | 'U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF'
      | 'U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD'
      | 'U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD'
      | 'U+00-7F'
      | 'U+80-FF'
      | 'U+100-17F'
      | 'U+180-24F'
      | 'U+1E00-1EFF'
      | 'U+250-2AF'
      | 'U+370-3FF'
      | 'U+1F00-1FFF'
      | 'U+400-4FF'
      | 'U+500-52F'
      | 'U+00-52F, U+1E00-1FFF, U+2200-22FF'
      | 'U+530-58F'
      | 'U+590-5FF'
      | 'U+600-6FF'
      | 'U+750-77F'
      | 'U+8A0-8FF'
      | 'U+700-74F'
      | 'U+900-97F'
      | 'U+980-9FF'
      | 'U+A00-A7F'
      | 'U+A80-AFF'
      | 'U+B00-B7F'
      | 'U+B80-BFF'
      | 'U+C00-C7F'
      | 'U+C80-CFF'
      | 'U+D00-D7F'
      | 'U+D80-DFF'
      | 'U+118A0-118FF'
      | 'U+E00-E7F'
      | 'U+1A20-1AAF'
      | 'U+AA80-AADF'
      | 'U+E80-EFF'
      | 'U+F00-FFF'
      | 'U+1000-109F'
      | 'U+10A0-10FF'
      | 'U+1200-137F'
      | 'U+1380-139F'
      | 'U+2D80-2DDF'
      | 'U+AB00-AB2F'
      | 'U+1780-17FF'
      | 'U+1800-18AF'
      | 'U+1B80-1BBF'
      | 'U+1CC0-1CCF'
      | 'U+4E00-9FD5'
      | 'U+3400-4DB5'
      | 'U+2F00-2FDF'
      | 'U+2E80-2EFF'
      | 'U+1100-11FF'
      | 'U+AC00-D7AF'
      | 'U+3040-309F'
      | 'U+30A0-30FF'
      | 'U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F'
      | 'U+A4D0-A4FF'
      | 'U+A000-A48F'
      | 'U+A490-A4CF'
      | 'U+2000-206F'
      | 'U+3000-303F'
      | 'U+2070-209F'
      | 'U+20A0-20CF'
      | 'U+2100-214F'
      | 'U+2150-218F'
      | 'U+2190-21FF'
      | 'U+2200-22FF'
      | 'U+2300-23FF'
      | 'U+E000-F8FF'
      | 'U+FB00-FB4F'
      | 'U+FB50-FDFF'
      | 'U+1F600-1F64F'
      | 'U+2600-26FF'
      | 'U+1F300-1F5FF'
      | 'U+1F900-1F9FF'
      | 'U+1F680-1F6FF'
      | (string & {}),
  ) {
    this.props.set('unicode-range', value)
    return this
  }

  /**
     * Controls the appearance of selection..
     * 
     * syntax:  `div { user-select: text; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css-ui-4/#propdef-user-select
     * 
     * values:
     * ```md
     * all: The content of the element must be selected atomically

     * auto: undefined

     * contain: UAs must not allow a selection which is started in this element to be extended outside of this element.

     * none: The UA must not allow selections to be started in this element.

     * text: The element imposes no constraint on the selection.
     * ```
     *
     * @param value -
     */
  userSelect(
    value: 'all' | 'auto' | 'contain' | 'none' | 'text' | (string & {}),
  ) {
    this.props.set('user-select', value)
    return this
  }

  /**
     * Affects the vertical positioning of the inline boxes generated by an inline-level element inside a line box..
     * 
     * syntax:  `div { vertical-align: middle; }`
     * 
     * restriction: percentage, length
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-linebox/#vertical-align
     * 
     * values:
     * ```md
     * alphabetic: Match the box's alphabetic baseline to that of its parent.

     * auto: Align the dominant baseline of the parent box with the equivalent, or heuristically reconstructed, baseline of the element inline box.

     * baseline: Align the 'alphabetic' baseline of the element with the 'alphabetic' baseline of the parent element.

     * bottom: Align the after edge of the extended inline box with the after-edge of the line box.

     * center: Align the center of the aligned subtree with the center of the line box.

     * central: Align the 'central' baseline of the inline element with the central baseline of the parent.

     * mathematical: Match the box's mathematical baseline to that of its parent.

     * middle: Align the 'middle' baseline of the inline element with the middle baseline of the parent.

     * sub: Lower the baseline of the box to the proper position for subscripts of the parent's box. (This value has no effect on the font size of the element's text.)

     * super: Raise the baseline of the box to the proper position for superscripts of the parent's box. (This value has no effect on the font size of the element's text.)

     * text-bottom: Align the bottom of the box with the after-edge of the parent element's font.

     * text-top: Align the top of the box with the before-edge of the parent element's font.

     * top: Align the before edge of the extended inline box with the before-edge of the line box.

     * -webkit-baseline-middle: undefined
     * ```
     *
     * @param value -
     */
  verticalAlign(
    value:
      | 'alphabetic'
      | 'auto'
      | 'baseline'
      | 'bottom'
      | 'center'
      | 'central'
      | 'mathematical'
      | 'middle'
      | 'sub'
      | 'super'
      | 'text-bottom'
      | 'text-top'
      | 'top'
      | '-webkit-baseline-middle'
      | (string & {}),
  ) {
    this.props.set('vertical-align', value)
    return this
  }

  /**
     * Specifies whether the boxes generated by an element are rendered. Invisible boxes still affect layout (set the 'display' property to 'none' to suppress box generation altogether)..
     * 
     * syntax:  `img { visibility: hidden; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#visibility
     * 
     * values:
     * ```md
     * collapse: Table-specific. If used on elements other than rows, row groups, columns, or column groups, 'collapse' has the same meaning as 'hidden'.

     * hidden: The generated box is invisible (fully transparent, nothing is drawn), but still affects layout.

     * visible: The generated box is visible.
     * ```
     *
     * @param value -
     */
  visibility(value: 'collapse' | 'hidden' | 'visible' | (string & {})) {
    this.props.set('visibility', value)
    return this
  }

  /**
     * Shorthand property combines six of the animation properties into a single property..
     * 
     * syntax:  `div { -webkit-animation: movearound 4s ease 3 normal; }`
     * 
     * restriction: time, enum, timing-function, identifier, number
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation
     * 
     * values:
     * ```md
     * alternate: The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.

     * alternate-reverse: The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.

     * backwards: The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.

     * both: Both forwards and backwards fill modes are applied.

     * forwards: The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.

     * infinite: Causes the animation to repeat forever.

     * none: No animation is performed

     * normal: Normal playback.

     * reverse: All iterations of the animation are played in the reverse direction from the way they were specified.
     * ```
     *
     * @param value -
     */
  webkitAnimation(
    value:
      | 'alternate'
      | 'alternate-reverse'
      | 'backwards'
      | 'both'
      | 'forwards'
      | 'infinite'
      | 'none'
      | 'normal'
      | 'reverse'
      | (string & {}),
  ) {
    this.props.set('-webkit-animation', value)
    return this
  }

  /**
     * Defines when the animation will start..
     * 
     * syntax:  `div { -webkit-animation-delay: 4s; }`
     * 
     * restriction: time
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-delay
     * 

     * @param value -
     */
  webkitAnimationDelay(value: string) {
    this.props.set('-webkit-animation-delay', value)
    return this
  }

  /**
     * Defines whether or not the animation should play in reverse on alternate cycles..
     * 
     * syntax:  `div { -webkit-animation-direction: normal; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-direction
     * 
     * values:
     * ```md
     * alternate: The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.

     * alternate-reverse: The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.

     * normal: Normal playback.

     * reverse: All iterations of the animation are played in the reverse direction from the way they were specified.
     * ```
     *
     * @param value -
     */
  webkitAnimationDirection(
    value:
      | 'alternate'
      | 'alternate-reverse'
      | 'normal'
      | 'reverse'
      | (string & {}),
  ) {
    this.props.set('-webkit-animation-direction', value)
    return this
  }

  /**
     * Defines the length of time that an animation takes to complete one cycle..
     * 
     * syntax:  `div { -webkit-animation-duration: 4s; }`
     * 
     * restriction: time
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-duration
     * 

     * @param value -
     */
  webkitAnimationDuration(value: string) {
    this.props.set('-webkit-animation-duration', value)
    return this
  }

  /**
     * Defines what values are applied by the animation outside the time it is executing..
     * 
     * syntax:  `div { -webkit-animation-fill-mode: forwards; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-fill-mode-property
     * 
     * values:
     * ```md
     * backwards: The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.

     * both: Both forwards and backwards fill modes are applied.

     * forwards: The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.

     * none: There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.
     * ```
     *
     * @param value -
     */
  webkitAnimationFillMode(
    value: 'backwards' | 'both' | 'forwards' | 'none' | (string & {}),
  ) {
    this.props.set('-webkit-animation-fill-mode', value)
    return this
  }

  /**
     * Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once..
     * 
     * syntax:  `div { -webkit-animation-iteration-count: 3; }`
     * 
     * restriction: number, enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-iteration-count
     * 

     * @param value -
     */
  webkitAnimationIterationCount(value: 'infinite' | (string & {})) {
    this.props.set('-webkit-animation-iteration-count', value)
    return this
  }

  /**
     * Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation..
     * 
     * syntax:  `div { -webkit-animation-name: movearound; }`
     * 
     * restriction: identifier, enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#the-animation-name-property-
     * 

     * @param value -
     */
  webkitAnimationName(value: 'none' | (string & {})) {
    this.props.set('-webkit-animation-name', value)
    return this
  }

  /**
     * Defines whether the animation is running or paused..
     * 
     * syntax:  `div { -webkit-animation-play-state: running; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-play-state
     * 
     * values:
     * ```md
     * paused: A running animation will be paused.

     * running: Resume playback of a paused animation.
     * ```
     *
     * @param value -
     */
  webkitAnimationPlayState(value: 'paused' | 'running' | (string & {})) {
    this.props.set('-webkit-animation-play-state', value)
    return this
  }

  /**
     * Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'..
     * 
     * syntax:  `div { -webkit-animation-timing-function: ease; }`
     * 
     * restriction: timing-function
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-animations/#animation-timing-function
     * 

     * @param value -
     */
  webkitAnimationTimingFunction(value: string) {
    this.props.set('-webkit-animation-timing-function', value)
    return this
  }

  /**
     * Changes the appearance of buttons and other controls to resemble native controls..
     * 
     * syntax:  `h3 { -webkit-appearance: button; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-appearance
     * 
     * values:
     * ```md
     * button: undefined

     * button-bevel: undefined

     * caps-lock-indicator: undefined

     * caret: undefined

     * checkbox: undefined

     * default-button: undefined

     * listbox: undefined

     * listitem: undefined

     * media-fullscreen-button: undefined

     * media-mute-button: undefined

     * media-play-button: undefined

     * media-seek-back-button: undefined

     * media-seek-forward-button: undefined

     * media-slider: undefined

     * media-sliderthumb: undefined

     * menulist: undefined

     * menulist-button: undefined

     * menulist-text: undefined

     * menulist-textfield: undefined

     * none: undefined

     * push-button: undefined

     * radio: undefined

     * scrollbarbutton-down: undefined

     * scrollbarbutton-left: undefined

     * scrollbarbutton-right: undefined

     * scrollbarbutton-up: undefined

     * scrollbargripper-horizontal: undefined

     * scrollbargripper-vertical: undefined

     * scrollbarthumb-horizontal: undefined

     * scrollbarthumb-vertical: undefined

     * scrollbartrack-horizontal: undefined

     * scrollbartrack-vertical: undefined

     * searchfield: undefined

     * searchfield-cancel-button: undefined

     * searchfield-decoration: undefined

     * searchfield-results-button: undefined

     * searchfield-results-decoration: undefined

     * slider-horizontal: undefined

     * sliderthumb-horizontal: undefined

     * sliderthumb-vertical: undefined

     * slider-vertical: undefined

     * square-button: undefined

     * textarea: undefined

     * textfield: undefined
     * ```
     *
     * @param value -
     */
  webkitAppearance(
    value:
      | 'button'
      | 'button-bevel'
      | 'caps-lock-indicator'
      | 'caret'
      | 'checkbox'
      | 'default-button'
      | 'listbox'
      | 'listitem'
      | 'media-fullscreen-button'
      | 'media-mute-button'
      | 'media-play-button'
      | 'media-seek-back-button'
      | 'media-seek-forward-button'
      | 'media-slider'
      | 'media-sliderthumb'
      | 'menulist'
      | 'menulist-button'
      | 'menulist-text'
      | 'menulist-textfield'
      | 'none'
      | 'push-button'
      | 'radio'
      | 'scrollbarbutton-down'
      | 'scrollbarbutton-left'
      | 'scrollbarbutton-right'
      | 'scrollbarbutton-up'
      | 'scrollbargripper-horizontal'
      | 'scrollbargripper-vertical'
      | 'scrollbarthumb-horizontal'
      | 'scrollbarthumb-vertical'
      | 'scrollbartrack-horizontal'
      | 'scrollbartrack-vertical'
      | 'searchfield'
      | 'searchfield-cancel-button'
      | 'searchfield-decoration'
      | 'searchfield-results-button'
      | 'searchfield-results-decoration'
      | 'slider-horizontal'
      | 'sliderthumb-horizontal'
      | 'sliderthumb-vertical'
      | 'slider-vertical'
      | 'square-button'
      | 'textarea'
      | 'textfield'
      | (string & {}),
  ) {
    this.props.set('-webkit-appearance', value)
    return this
  }

  /**
     * Applies a filter effect where the first filter in the list takes the element's background image as the input image..
     * 
     * syntax:  `div { -webkit-backdrop-filter: blur(2px); }`
     * 
     * restriction: enum, url
     * 
     * browsers: S9
     * 
     * ref: https://drafts.fxtf.org/filters-2/#propdef-backdrop-filter
     * 
     * values:
     * ```md
     * none: No filter effects are applied.

     * blur(): Applies a Gaussian blur to the input image.

     * brightness(): Applies a linear multiplier to input image, making it appear more or less bright.

     * contrast(): Adjusts the contrast of the input.

     * drop-shadow(): Applies a drop shadow effect to the input image.

     * grayscale(): Converts the input image to grayscale.

     * hue-rotate(): Applies a hue rotation on the input image. 

     * invert(): Inverts the samples in the input image.

     * opacity(): Applies transparency to the samples in the input image.

     * saturate(): Saturates the input image.

     * sepia(): Converts the input image to sepia.

     * url(): A filter reference to a <filter> element.
     * ```
     *
     * @param value -
     */
  webkitBackdropFilter(
    value:
      | 'none'
      | 'blur()'
      | 'brightness()'
      | 'contrast()'
      | 'drop-shadow()'
      | 'grayscale()'
      | 'hue-rotate()'
      | 'invert()'
      | 'opacity()'
      | 'saturate()'
      | 'sepia()'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('-webkit-backdrop-filter', value)
    return this
  }

  /**
     * Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer..
     * 
     * syntax:  `div { -webkit-backface-visibility: hidden; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#backface-visibility
     * 
     * values:
     * ```md
     * hidden: undefined

     * visible: undefined
     * ```
     *
     * @param value -
     */
  webkitBackfaceVisibility(value: 'hidden' | 'visible' | (string & {})) {
    this.props.set('-webkit-backface-visibility', value)
    return this
  }

  /**
     * Determines the background painting area..
     * 
     * syntax:  `header { -webkit-background-clip: border-box; }`
     * 
     * restriction: box
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-clip
     * 

     * @param value -
     */
  webkitBackgroundClip(value: string) {
    this.props.set('-webkit-background-clip', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-background-composite: padding; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: undefined
     * 
     * values:
     * ```md
     * border: undefined

     * padding: undefined
     * ```
     *
     * @param value -
     */
  webkitBackgroundComposite(value: 'border' | 'padding' | (string & {})) {
    this.props.set('-webkit-background-composite', value)
    return this
  }

  /**
     * For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s)..
     * 
     * syntax:  `header { -webkit-background-origin: border-box; }`
     * 
     * restriction: box
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-background/#the-background-origin
     * 

     * @param value -
     */
  webkitBackgroundOrigin(value: string) {
    this.props.set('-webkit-background-origin', value)
    return this
  }

  /**
     * Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values..
     * 
     * syntax:  `td { -webkit-border-image: url(border.png) 30 30 round;}`
     * 
     * restriction: length, percentage, number, url, enum
     * 
     * browsers: C,S5
     * 
     * ref: http://www.w3.org/TR/css3-background/#border-image
     * 
     * values:
     * ```md
     * auto: If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.

     * fill: Causes the middle part of the border-image to be preserved.

     * none: undefined

     * repeat: The image is tiled (repeated) to fill the area.

     * round: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.

     * space: The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.

     * stretch: The image is stretched to fill the area.

     * url(): undefined
     * ```
     *
     * @param value -
     */
  webkitBorderImage(
    value:
      | 'auto'
      | 'fill'
      | 'none'
      | 'repeat'
      | 'round'
      | 'space'
      | 'stretch'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('-webkit-border-image', value)
    return this
  }

  /**
     * Specifies the alignment of nested elements within an outer flexible box element..
     * 
     * syntax:  `div { -webkit-box-align: end; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-align
     * 
     * values:
     * ```md
     * baseline: If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used.

     * center: Any extra space is divided evenly, with half placed above the child and the other half placed after the child.

     * end: For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element.

     * start: For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element.

     * stretch: The height of each child is adjusted to that of the containing block.
     * ```
     *
     * @param value -
     */
  webkitBoxAlign(
    value: 'baseline' | 'center' | 'end' | 'start' | 'stretch' | (string & {}),
  ) {
    this.props.set('-webkit-box-align', value)
    return this
  }

  /**
     * In webkit applications, -webkit-box-direction specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge)..
     * 
     * syntax:  `div { -webkit-box-direction: reverse; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-direction
     * 
     * values:
     * ```md
     * normal: A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom.

     * reverse: A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top.
     * ```
     *
     * @param value -
     */
  webkitBoxDirection(value: 'normal' | 'reverse' | (string & {})) {
    this.props.set('-webkit-box-direction', value)
    return this
  }

  /**
     * Specifies an element's flexibility..
     * 
     * syntax:  `div { -webkit-box-flex: 1; }`
     * 
     * restriction: number
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-flex
     * 

     * @param value -
     */
  webkitBoxFlex(value: number) {
    this.props.set('-webkit-box-flex', value)
    return this
  }

  /**
     * Flexible elements can be assigned to flex groups using the 'box-flex-group' property..
     * 
     * syntax:  `div { -webkit-box-flex-group: 4; }`
     * 
     * restriction: integer
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-flex-group
     * 

     * @param value -
     */
  webkitBoxFlexGroup(value: number) {
    this.props.set('-webkit-box-flex-group', value)
    return this
  }

  /**
     * Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group..
     * 
     * syntax:  `div { -webkit-box-ordinal-group: 3; }`
     * 
     * restriction: integer
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-ordinal-group
     * 

     * @param value -
     */
  webkitBoxOrdinalGroup(value: number) {
    this.props.set('-webkit-box-ordinal-group', value)
    return this
  }

  /**
     * In webkit applications, -webkit-box-orient specifies whether a box lays out its contents horizontally or vertically..
     * 
     * syntax:  `div { -webkit-box-orient: vertical; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-orient
     * 
     * values:
     * ```md
     * block-axis: Elements are oriented along the box's axis.

     * horizontal: The box displays its children from left to right in a horizontal line.

     * inline-axis: Elements are oriented vertically.

     * vertical: The box displays its children from stacked from top to bottom vertically.
     * ```
     *
     * @param value -
     */
  webkitBoxOrient(
    value:
      | 'block-axis'
      | 'horizontal'
      | 'inline-axis'
      | 'vertical'
      | (string & {}),
  ) {
    this.props.set('-webkit-box-orient', value)
    return this
  }

  /**
     * Specifies alignment of child elements within the current element in the direction of orientation..
     * 
     * syntax:  `div { -webkit-box-pack: end; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-box-pack
     * 
     * values:
     * ```md
     * center: The extra space is divided evenly, with half placed before the first child and the other half placed after the last child.

     * end: For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child.

     * justify: The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start.

     * start: For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child.
     * ```
     *
     * @param value -
     */
  webkitBoxPack(value: 'center' | 'end' | 'justify' | 'start' | (string & {})) {
    this.props.set('-webkit-box-pack', value)
    return this
  }

  /**
     * Defines a reflection of a border box..
     * 
     * syntax:  `div { -webkit-box-reflect: below 5px; }`
     * 
     * restriction: 
     * 
     * browsers: C,S4
     * 
     * ref: http://css-infos.net/property/-webkit-box-reflect
     * 
     * values:
     * ```md
     * above: The reflection appears above the border box.

     * below: The reflection appears below the border box.

     * left: The reflection appears to the left of the border box.

     * right: The reflection appears to the right of the border box.
     * ```
     *
     * @param value -
     */
  webkitBoxReflect(
    value: 'above' | 'below' | 'left' | 'right' | (string & {}),
  ) {
    this.props.set('-webkit-box-reflect', value)
    return this
  }

  /**
     * Box Model addition in CSS3..
     * 
     * syntax:  `div { -webkit-box-sizing: content-box; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-ui/#box-sizing
     * 
     * values:
     * ```md
     * border-box: The specified width and height (and respective min/max properties) on this element determine the border box of the element.

     * content-box: Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.
     * ```
     *
     * @param value -
     */
  webkitBoxSizing(value: 'border-box' | 'content-box' | (string & {})) {
    this.props.set('-webkit-box-sizing', value)
    return this
  }

  /**
     * Describes the page/column break behavior before the generated box..
     * 
     * syntax:  `h2 { -webkit-break-after: column; }`
     * 
     * restriction: enum
     * 
     * browsers: S7
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-breaks
     * 
     * values:
     * ```md
     * always: Always force a page break before/after the generated box.

     * auto: Neither force nor forbid a page/column break before/after the generated box.

     * avoid: Avoid a page/column break before/after the generated box.

     * avoid-column: Avoid a column break before/after the generated box.

     * avoid-page: Avoid a page break before/after the generated box.

     * avoid-region: undefined

     * column: Always force a column break before/after the generated box.

     * left: Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.

     * page: Always force a page break before/after the generated box.

     * region: undefined

     * right: Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.
     * ```
     *
     * @param value -
     */
  webkitBreakAfter(
    value:
      | 'always'
      | 'auto'
      | 'avoid'
      | 'avoid-column'
      | 'avoid-page'
      | 'avoid-region'
      | 'column'
      | 'left'
      | 'page'
      | 'region'
      | 'right'
      | (string & {}),
  ) {
    this.props.set('-webkit-break-after', value)
    return this
  }

  /**
     * Describes the page/column break behavior before the generated box..
     * 
     * syntax:  `h2 { -webkit-break-before: column; }`
     * 
     * restriction: enum
     * 
     * browsers: S7
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-breaks
     * 
     * values:
     * ```md
     * always: Always force a page break before/after the generated box.

     * auto: Neither force nor forbid a page/column break before/after the generated box.

     * avoid: Avoid a page/column break before/after the generated box.

     * avoid-column: Avoid a column break before/after the generated box.

     * avoid-page: Avoid a page break before/after the generated box.

     * avoid-region: undefined

     * column: Always force a column break before/after the generated box.

     * left: Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.

     * page: Always force a page break before/after the generated box.

     * region: undefined

     * right: Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.
     * ```
     *
     * @param value -
     */
  webkitBreakBefore(
    value:
      | 'always'
      | 'auto'
      | 'avoid'
      | 'avoid-column'
      | 'avoid-page'
      | 'avoid-region'
      | 'column'
      | 'left'
      | 'page'
      | 'region'
      | 'right'
      | (string & {}),
  ) {
    this.props.set('-webkit-break-before', value)
    return this
  }

  /**
     * Describes the page/column break behavior inside the generated box..
     * 
     * syntax:  `h2 { -webkit-break-inside: avoid-column; }`
     * 
     * restriction: enum
     * 
     * browsers: S7
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-breaks
     * 
     * values:
     * ```md
     * auto: Neither force nor forbid a page/column break inside the generated box.

     * avoid: Avoid a page/column break inside the generated box.

     * avoid-column: Avoid a column break inside the generated box.

     * avoid-page: Avoid a page break inside the generated box.

     * avoid-region: undefined
     * ```
     *
     * @param value -
     */
  webkitBreakInside(
    value:
      | 'auto'
      | 'avoid'
      | 'avoid-column'
      | 'avoid-page'
      | 'avoid-region'
      | (string & {}),
  ) {
    this.props.set('-webkit-break-inside', value)
    return this
  }

  /**
     * Describes the page/column break behavior before the generated box..
     * 
     * syntax:  `h2 { -webkit-column-break-after: column; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-breaks
     * 
     * values:
     * ```md
     * always: Always force a page break before/after the generated box.

     * auto: Neither force nor forbid a page/column break before/after the generated box.

     * avoid: Avoid a page/column break before/after the generated box.

     * avoid-column: Avoid a column break before/after the generated box.

     * avoid-page: Avoid a page break before/after the generated box.

     * avoid-region: undefined

     * column: Always force a column break before/after the generated box.

     * left: Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.

     * page: Always force a page break before/after the generated box.

     * region: undefined

     * right: Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.
     * ```
     *
     * @param value -
     */
  webkitColumnBreakAfter(
    value:
      | 'always'
      | 'auto'
      | 'avoid'
      | 'avoid-column'
      | 'avoid-page'
      | 'avoid-region'
      | 'column'
      | 'left'
      | 'page'
      | 'region'
      | 'right'
      | (string & {}),
  ) {
    this.props.set('-webkit-column-break-after', value)
    return this
  }

  /**
     * Describes the page/column break behavior before the generated box..
     * 
     * syntax:  `h2 { -webkit-column-break-before: column; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-breaks
     * 
     * values:
     * ```md
     * always: Always force a page break before/after the generated box.

     * auto: Neither force nor forbid a page/column break before/after the generated box.

     * avoid: Avoid a page/column break before/after the generated box.

     * avoid-column: Avoid a column break before/after the generated box.

     * avoid-page: Avoid a page break before/after the generated box.

     * avoid-region: undefined

     * column: Always force a column break before/after the generated box.

     * left: Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.

     * page: Always force a page break before/after the generated box.

     * region: undefined

     * right: Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.
     * ```
     *
     * @param value -
     */
  webkitColumnBreakBefore(
    value:
      | 'always'
      | 'auto'
      | 'avoid'
      | 'avoid-column'
      | 'avoid-page'
      | 'avoid-region'
      | 'column'
      | 'left'
      | 'page'
      | 'region'
      | 'right'
      | (string & {}),
  ) {
    this.props.set('-webkit-column-break-before', value)
    return this
  }

  /**
     * Describes the page/column break behavior inside the generated box..
     * 
     * syntax:  `h2 { -webkit-column-break-inside: avoid-column; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-breaks
     * 
     * values:
     * ```md
     * auto: Neither force nor forbid a page/column break inside the generated box.

     * avoid: Avoid a page/column break inside the generated box.

     * avoid-column: Avoid a column break inside the generated box.

     * avoid-page: Avoid a page break inside the generated box.

     * avoid-region: undefined
     * ```
     *
     * @param value -
     */
  webkitColumnBreakInside(
    value:
      | 'auto'
      | 'avoid'
      | 'avoid-column'
      | 'avoid-page'
      | 'avoid-region'
      | (string & {}),
  ) {
    this.props.set('-webkit-column-break-inside', value)
    return this
  }

  /**
     * Describes the optimal number of columns into which the content of the element will be flowed..
     * 
     * syntax:  `div { -webkit-column-count: 3; }`
     * 
     * restriction: integer
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-count
     * 

     * @param value -
     */
  webkitColumnCount(value: number) {
    this.props.set('-webkit-column-count', value)
    return this
  }

  /**
     * Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap..
     * 
     * syntax:  `div { -webkit-column-gap: 10px; }`
     * 
     * restriction: length
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-gap0
     * 

     * @param value -
     */
  webkitColumnGap(value: 'normal' | (string & {})) {
    this.props.set('-webkit-column-gap', value)
    return this
  }

  /**
     * This property is a shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values..
     * 
     * syntax:  `header { -webkit-column-rule: 5px solid red;}`
     * 
     * restriction: length, line-width, line-style, color
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule0
     * 

     * @param value -
     */
  webkitColumnRule(value: string) {
    this.props.set('-webkit-column-rule', value)
    return this
  }

  /**
     * Sets the color of the column rule.
     * 
     * syntax:  `div { -webkit-column-rule-color: #ff0; }`
     * 
     * restriction: color
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-color
     * 

     * @param value -
     */
  webkitColumnRuleColor(value: string) {
    this.props.set('-webkit-column-rule-color', value)
    return this
  }

  /**
     * Sets the style of the rule between columns of an element..
     * 
     * syntax:  `div { -webkit-column-rule-style: solid; }`
     * 
     * restriction: line-style
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-style
     * 

     * @param value -
     */
  webkitColumnRuleStyle(value: string) {
    this.props.set('-webkit-column-rule-style', value)
    return this
  }

  /**
     * Sets the width of the rule between columns. Negative values are not allowed..
     * 
     * syntax:  `div { -webkit-column-rule-width: 3px; }`
     * 
     * restriction: length, line-width
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-rule-width
     * 

     * @param value -
     */
  webkitColumnRuleWidth(value: string) {
    this.props.set('-webkit-column-rule-width', value)
    return this
  }

  /**
     * A shorthand property which sets both 'column-width' and 'column-count'..
     * 
     * syntax:  `div { -webkit-columns: 100px 3; }`
     * 
     * restriction: length, integer
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#columns0
     * 

     * @param value -
     */
  webkitColumns(value: 'auto' | (string & {})) {
    this.props.set('-webkit-columns', value)
    return this
  }

  /**
     * Describes the page/column break behavior after the generated box..
     * 
     * syntax:  `article { -webkit-column-span: all; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-span0
     * 
     * values:
     * ```md
     * all: The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear.

     * none: The element does not span multiple columns.
     * ```
     *
     * @param value -
     */
  webkitColumnSpan(value: 'all' | 'none' | (string & {})) {
    this.props.set('-webkit-column-span', value)
    return this
  }

  /**
     * This property describes the width of columns in multicol elements..
     * 
     * syntax:  `div { -webkit-column-width: 100px; }`
     * 
     * restriction: length
     * 
     * browsers: C,S3
     * 
     * ref: http://www.w3.org/TR/css3-multicol/#column-width
     * 

     * @param value -
     */
  webkitColumnWidth(value: 'auto' | (string & {})) {
    this.props.set('-webkit-column-width', value)
    return this
  }

  /**
     * Processes an element's rendering before it is displayed in the document, by applying one or more filter effects..
     * 
     * syntax:  `img { -webkit-filter: blur(3px); }`
     * 
     * restriction: enum, url
     * 
     * browsers: C18,O15,S6
     * 
     * ref: http://www.w3.org/TR/filter-effects/#propdef-filter
     * 
     * values:
     * ```md
     * none: No filter effects are applied.

     * blur(): Applies a Gaussian blur to the input image.

     * brightness(): Applies a linear multiplier to input image, making it appear more or less bright.

     * contrast(): Adjusts the contrast of the input.

     * drop-shadow(): Applies a drop shadow effect to the input image.

     * grayscale(): Converts the input image to grayscale.

     * hue-rotate(): Applies a hue rotation on the input image. 

     * invert(): Inverts the samples in the input image.

     * opacity(): Applies transparency to the samples in the input image.

     * saturate(): Saturates the input image.

     * sepia(): Converts the input image to sepia.

     * url(): A filter reference to a <filter> element.
     * ```
     *
     * @param value -
     */
  webkitFilter(
    value:
      | 'none'
      | 'blur()'
      | 'brightness()'
      | 'contrast()'
      | 'drop-shadow()'
      | 'grayscale()'
      | 'hue-rotate()'
      | 'invert()'
      | 'opacity()'
      | 'saturate()'
      | 'sepia()'
      | 'url()'
      | (string & {}),
  ) {
    this.props.set('-webkit-filter', value)
    return this
  }

  /**
     * Makes a block container a region and associates it with a named flow..
     * 
     * syntax:  `div { -webkit-flow-from: identifier; }`
     * 
     * restriction: identifier
     * 
     * browsers: S6.1
     * 
     * ref: http://www.w3.org/TR/css3-regions/#flow-from
     * 

     * @param value -
     */
  webkitFlowFrom(value: 'none' | (string & {})) {
    this.props.set('-webkit-flow-from', value)
    return this
  }

  /**
     * Places an element or its contents into a named flow..
     * 
     * syntax:  `div { -webkit-flow-into: identifier; }`
     * 
     * restriction: identifier
     * 
     * browsers: S6.1
     * 
     * ref: http://www.w3.org/TR/css3-regions/#flow-into
     * 

     * @param value -
     */
  webkitFlowInto(value: 'none' | (string & {})) {
    this.props.set('-webkit-flow-into', value)
    return this
  }

  /**
     * This property provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case..
     * 
     * syntax:  `body { -webkit-font-feature-settings: 'hwid'; }`
     * 
     * restriction: string, integer
     * 
     * browsers: C16
     * 
     * ref: http://www.w3.org/TR/css3-fonts/#propdef-font-feature-settings
     * 
     * values:
     * ```md
     * c2cs: undefined

     * dlig: undefined

     * kern: undefined

     * liga: undefined

     * lnum: undefined

     * onum: undefined

     * smcp: undefined

     * swsh: undefined

     * tnum: undefined

     * normal: No change in glyph substitution or positioning occurs.

     * off: undefined

     * on: undefined
     * ```
     *
     * @param value -
     */
  webkitFontFeatureSettings(
    value:
      | 'c2cs'
      | 'dlig'
      | 'kern'
      | 'liga'
      | 'lnum'
      | 'onum'
      | 'smcp'
      | 'swsh'
      | 'tnum'
      | 'normal'
      | 'off'
      | 'on'
      | (string & {}),
  ) {
    this.props.set('-webkit-font-feature-settings', value)
    return this
  }

  /**
     * Controls whether hyphenation is allowed to create more break opportunities within a line of text..
     * 
     * syntax:  `div { -webkit-hyphens: manual; }`
     * 
     * restriction: enum
     * 
     * browsers: S5.1
     * 
     * ref: http://www.w3.org/TR/css3-text/#hyphens0
     * 
     * values:
     * ```md
     * auto: Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.

     * manual: Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities

     * none: Words are not broken at line breaks, even if characters inside the word suggest line break points.
     * ```
     *
     * @param value -
     */
  webkitHyphens(value: 'auto' | 'manual' | 'none' | (string & {})) {
    this.props.set('-webkit-hyphens', value)
    return this
  }

  /**
     * Specifies line-breaking rules for CJK (Chinese, Japanese, and Korean) text..
     * 
     * syntax:  `p { -webkit-line-break: normal; }`
     * 
     * restriction: 
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-line-break
     * 
     * values:
     * ```md
     * after-white-space: undefined

     * normal: undefined
     * ```
     *
     * @param value -
     */
  webkitLineBreak(value: 'after-white-space' | 'normal' | (string & {})) {
    this.props.set('-webkit-line-break', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-margin-bottom-collapse: collapse; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: undefined
     * 
     * values:
     * ```md
     * collapse: undefined

     * discard: undefined

     * separate: undefined
     * ```
     *
     * @param value -
     */
  webkitMarginBottomCollapse(
    value: 'collapse' | 'discard' | 'separate' | (string & {}),
  ) {
    this.props.set('-webkit-margin-bottom-collapse', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-margin-collapse: collapse; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: undefined
     * 
     * values:
     * ```md
     * collapse: undefined

     * discard: undefined

     * separate: undefined
     * ```
     *
     * @param value -
     */
  webkitMarginCollapse(
    value: 'collapse' | 'discard' | 'separate' | (string & {}),
  ) {
    this.props.set('-webkit-margin-collapse', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-margin-start: 5px; }`
     * 
     * restriction: percentage, length
     * 
     * browsers: C,S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitMarginStart(value: 'auto' | (string & {})) {
    this.props.set('-webkit-margin-start', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-margin-top-collapse: collapse; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: undefined
     * 
     * values:
     * ```md
     * collapse: undefined

     * discard: undefined

     * separate: undefined
     * ```
     *
     * @param value -
     */
  webkitMarginTopCollapse(
    value: 'collapse' | 'discard' | 'separate' | (string & {}),
  ) {
    this.props.set('-webkit-margin-top-collapse', value)
    return this
  }

  /**
     * Determines the mask painting area, which determines the area that is affected by the mask..
     * 
     * syntax:  ` `
     * 
     * restriction: box
     * 
     * browsers: C,O15,S4
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-clip
     * 

     * @param value -
     */
  webkitMaskClip(value: string) {
    this.props.set('-webkit-mask-clip', value)
    return this
  }

  /**
     * Sets the mask layer image of an element..
     * 
     * syntax:  ` `
     * 
     * restriction: url, image, enum
     * 
     * browsers: C,O15,S4
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-image
     * 
     * values:
     * ```md
     * none: Counts as a transparent black image layer.

     * url(): Reference to a <mask element or to a CSS image.
     * ```
     *
     * @param value -
     */
  webkitMaskImage(value: 'none' | 'url()' | (string & {})) {
    this.props.set('-webkit-mask-image', value)
    return this
  }

  /**
     * Specifies the mask positioning area..
     * 
     * syntax:  ` `
     * 
     * restriction: box
     * 
     * browsers: C,O15,S4
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-origin
     * 

     * @param value -
     */
  webkitMaskOrigin(value: string) {
    this.props.set('-webkit-mask-origin', value)
    return this
  }

  /**
     * Specifies how mask layer images are tiled after they have been sized and positioned..
     * 
     * syntax:  ` `
     * 
     * restriction: repeat
     * 
     * browsers: C,O15,S4
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-repeat
     * 

     * @param value -
     */
  webkitMaskRepeat(value: string) {
    this.props.set('-webkit-mask-repeat', value)
    return this
  }

  /**
     * Specifies the size of the mask layer images..
     * 
     * syntax:  ` `
     * 
     * restriction: length, percentage, enum
     * 
     * browsers: C,O15,S4
     * 
     * ref: http://www.w3.org/TR/css-masking-1/#the-mask-size
     * 
     * values:
     * ```md
     * auto: Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.

     * contain: Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.

     * cover: Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.
     * ```
     *
     * @param value -
     */
  webkitMaskSize(value: 'auto' | 'contain' | 'cover' | (string & {})) {
    this.props.set('-webkit-mask-size', value)
    return this
  }

  /**
     * Defines the behavior of nonbreaking spaces within text..
     * 
     * syntax:  `p { -webkit-nbsp-mode: space; }`
     * 
     * restriction: 
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-nbsp-mode
     * 
     * values:
     * ```md
     * normal: undefined

     * space: undefined
     * ```
     *
     * @param value -
     */
  webkitNbspMode(value: 'normal' | 'space' | (string & {})) {
    this.props.set('-webkit-nbsp-mode', value)
    return this
  }

  /**
     * Specifies whether to use native-style scrolling in an overflow:scroll element..
     * 
     * syntax:  `div { -webkit-overflow-scrolling: touch; }`
     * 
     * restriction: 
     * 
     * browsers: C,S5
     * 
     * ref: http://css-infos.net/property/-webkit-nbsp-mode
     * 
     * values:
     * ```md
     * auto: undefined

     * touch: undefined
     * ```
     *
     * @param value -
     */
  webkitOverflowScrolling(value: 'auto' | 'touch' | (string & {})) {
    this.props.set('-webkit-overflow-scrolling', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-padding-start: 5px; }`
     * 
     * restriction: percentage, length
     * 
     * browsers: C,S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitPaddingStart(value: string) {
    this.props.set('-webkit-padding-start', value)
    return this
  }

  /**
     * Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself..
     * 
     * syntax:  `div { -webkit-perspective: none; }`
     * 
     * restriction: length
     * 
     * browsers: C,S4
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#perspective
     * 

     * @param value -
     */
  webkitPerspective(value: 'none' | (string & {})) {
    this.props.set('-webkit-perspective', value)
    return this
  }

  /**
     * Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element..
     * 
     * syntax:  `div { -webkit-perspective-origin: 10px; }`
     * 
     * restriction: position, percentage, length
     * 
     * browsers: C,S4
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin
     * 

     * @param value -
     */
  webkitPerspectiveOrigin(value: string) {
    this.props.set('-webkit-perspective-origin', value)
    return this
  }

  /**
     * The 'region-fragment' property controls the behavior of the last region associated with a named flow..
     * 
     * syntax:  `article { -webkit-region-fragment: break; }`
     * 
     * restriction: enum
     * 
     * browsers: S7
     * 
     * ref: http://dev.w3.org/csswg/css-regions/#region-fragment
     * 
     * values:
     * ```md
     * auto: Content flows as it would in a regular content box.

     * break: If the content fits within the CSS Region, then this property has no effect.
     * ```
     *
     * @param value -
     */
  webkitRegionFragment(value: 'auto' | 'break' | (string & {})) {
    this.props.set('-webkit-region-fragment', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  ` `
     * 
     * restriction: color
     * 
     * browsers: E,C,S3.1
     * 
     * ref: http://css-infos.net/property/-webkit-tap-highlight-color
     * 

     * @param value -
     */
  webkitTapHighlightColor(value: string) {
    this.props.set('-webkit-tap-highlight-color', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-text-fill-color: red; }`
     * 
     * restriction: color
     * 
     * browsers: E,C,S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitTextFillColor(value: string) {
    this.props.set('-webkit-text-fill-color', value)
    return this
  }

  /**
     * Specifies a size adjustment for displaying text content in mobile browsers..
     * 
     * syntax:  `div { -webkit-text-size-adjust: 60%; }`
     * 
     * restriction: percentage
     * 
     * browsers: E,C,S3
     * 
     * ref: https://drafts.csswg.org/css-size-adjust/#text-size-adjust
     * 
     * values:
     * ```md
     * auto: Renderers must use the default size adjustment when displaying on a small device.

     * none: Renderers must not do size adjustment when displaying on a small device.
     * ```
     *
     * @param value -
     */
  webkitTextSizeAdjust(value: 'auto' | 'none' | (string & {})) {
    this.props.set('-webkit-text-size-adjust', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-text-stroke: red 2x; }`
     * 
     * restriction: length, line-width, color, percentage
     * 
     * browsers: S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitTextStroke(value: string) {
    this.props.set('-webkit-text-stroke', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-text-stroke-color: red; }`
     * 
     * restriction: color
     * 
     * browsers: S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitTextStrokeColor(value: string) {
    this.props.set('-webkit-text-stroke-color', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-text-stroke-width: 2px; }`
     * 
     * restriction: length, line-width, percentage
     * 
     * browsers: S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitTextStrokeWidth(value: string) {
    this.props.set('-webkit-text-stroke-width', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `a { -webkit-touch-callout: none; }`
     * 
     * restriction: enum
     * 
     * browsers: S3
     * 
     * ref: undefined
     * 

     * @param value -
     */
  webkitTouchCallout(value: 'none' | (string & {})) {
    this.props.set('-webkit-touch-callout', value)
    return this
  }

  /**
     * A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG..
     * 
     * syntax:  `div { -webkit-transform: rotate(-90deg); }`
     * 
     * restriction: enum
     * 
     * browsers: C,O12,S3.1
     * 
     * ref: http://www.w3.org/TR/css3-2d-transforms/#transform-property
     * 
     * values:
     * ```md
     * matrix(): Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]

     * matrix3d(): Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.

     * none: undefined

     * perspective(): Specifies a perspective projection matrix.

     * rotate(): Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.

     * rotate3d(): Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.

     * rotateX('angle'): Specifies a clockwise rotation by the given angle about the X axis.

     * rotateY('angle'): Specifies a clockwise rotation by the given angle about the Y axis.

     * rotateZ('angle'): Specifies a clockwise rotation by the given angle about the Z axis.

     * scale(): Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.

     * scale3d(): Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.

     * scaleX(): Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.

     * scaleY(): Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.

     * scaleZ(): Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.

     * skew(): Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).

     * skewX(): Specifies a skew transformation along the X axis by the given angle.

     * skewY(): Specifies a skew transformation along the Y axis by the given angle.

     * translate(): Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.

     * translate3d(): Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.

     * translateX(): Specifies a translation by the given amount in the X direction.

     * translateY(): Specifies a translation by the given amount in the Y direction.

     * translateZ(): Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.
     * ```
     *
     * @param value -
     */
  webkitTransform(
    value:
      | 'matrix()'
      | 'matrix3d()'
      | 'none'
      | 'perspective()'
      | 'rotate()'
      | 'rotate3d()'
      | "rotateX('angle')"
      | "rotateY('angle')"
      | "rotateZ('angle')"
      | 'scale()'
      | 'scale3d()'
      | 'scaleX()'
      | 'scaleY()'
      | 'scaleZ()'
      | 'skew()'
      | 'skewX()'
      | 'skewY()'
      | 'translate()'
      | 'translate3d()'
      | 'translateX()'
      | 'translateY()'
      | 'translateZ()'
      | (string & {}),
  ) {
    this.props.set('-webkit-transform', value)
    return this
  }

  /**
     * Establishes the origin of transformation for an element..
     * 
     * syntax:  `.album { -webkit-transform-origin: 20% 40%; }`
     * 
     * restriction: position, length, percentage
     * 
     * browsers: C,O15,S3.1
     * 
     * ref: http://www.w3.org/TR/css3-2d-transforms/#transform-origin
     * 

     * @param value -
     */
  webkitTransformOrigin(value: string) {
    this.props.set('-webkit-transform-origin', value)
    return this
  }

  /**
     * The x coordinate of the origin for transforms applied to an element with respect to its border box..
     * 
     * syntax:  `img { -webkit-transform-origin-x: 5px}`
     * 
     * restriction: length, percentage
     * 
     * browsers: C,S3.1
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#transform-origin
     * 

     * @param value -
     */
  webkitTransformOriginX(value: string) {
    this.props.set('-webkit-transform-origin-x', value)
    return this
  }

  /**
     * The y coordinate of the origin for transforms applied to an element with respect to its border box..
     * 
     * syntax:  `img { -webkit-transform-origin-y: 5px}`
     * 
     * restriction: length, percentage
     * 
     * browsers: C,S3.1
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#transform-origin
     * 

     * @param value -
     */
  webkitTransformOriginY(value: string) {
    this.props.set('-webkit-transform-origin-y', value)
    return this
  }

  /**
     * The z coordinate of the origin for transforms applied to an element with respect to its border box..
     * 
     * syntax:  `img { -webkit-transform-origin-z: 5px}`
     * 
     * restriction: length, percentage
     * 
     * browsers: C,S4
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#transform-origin
     * 

     * @param value -
     */
  webkitTransformOriginZ(value: string) {
    this.props.set('-webkit-transform-origin-z', value)
    return this
  }

  /**
     * Defines how nested elements are rendered in 3D space..
     * 
     * syntax:  `div { -webkit-transform-style: flat; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S4
     * 
     * ref: http://www.w3.org/TR/css3-3d-transforms/#transform-origin
     * 
     * values:
     * ```md
     * flat: All children of this element are rendered flattened into the 2D plane of the element.

     * preserve-3d: Flattening is not performed, so children maintain their position in 3D space.
     * ```
     *
     * @param value -
     */
  webkitTransformStyle(value: 'flat' | 'preserve-3d' | (string & {})) {
    this.props.set('-webkit-transform-style', value)
    return this
  }

  /**
     * Shorthand property combines four of the transition properties into a single property..
     * 
     * syntax:  `div { -webkit-transition: background-color linear 1s; }`
     * 
     * restriction: time, property, timing-function, enum
     * 
     * browsers: C,O12,S5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition
     * 
     * values:
     * ```md
     * all: Every property that is able to undergo a transition will do so.

     * none: No property will transition.
     * ```
     *
     * @param value -
     */
  webkitTransition(value: 'all' | 'none' | (string & {})) {
    this.props.set('-webkit-transition', value)
    return this
  }

  /**
     * Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied..
     * 
     * syntax:  `div { -webkit-transition-delay: 1s; }`
     * 
     * restriction: time
     * 
     * browsers: C,O12,S5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-delay
     * 

     * @param value -
     */
  webkitTransitionDelay(value: string) {
    this.props.set('-webkit-transition-delay', value)
    return this
  }

  /**
     * Specifies how long the transition from the old value to the new value should take..
     * 
     * syntax:  `div { -webkit-transition-duration: 1s; }`
     * 
     * restriction: time
     * 
     * browsers: C,O12,S5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-duration
     * 

     * @param value -
     */
  webkitTransitionDuration(value: string) {
    this.props.set('-webkit-transition-duration', value)
    return this
  }

  /**
     * Specifies the name of the CSS property to which the transition is applied..
     * 
     * syntax:  `div { -webkit-transition-property: background-color; }`
     * 
     * restriction: property
     * 
     * browsers: C,O12,S5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-property
     * 
     * values:
     * ```md
     * all: Every property that is able to undergo a transition will do so.

     * none: No property will transition.
     * ```
     *
     * @param value -
     */
  webkitTransitionProperty(value: 'all' | 'none' | (string & {})) {
    this.props.set('-webkit-transition-property', value)
    return this
  }

  /**
     * Describes how the intermediate values used during a transition will be calculated..
     * 
     * syntax:  `div { -webkit-transition-timing-function: linear; }`
     * 
     * restriction: timing-function
     * 
     * browsers: C,O12,S5
     * 
     * ref: http://www.w3.org/TR/css3-transitions/#transition-timing-function
     * 

     * @param value -
     */
  webkitTransitionTimingFunction(value: string) {
    this.props.set('-webkit-transition-timing-function', value)
    return this
  }

  /**
     * undefined.
     * 
     * syntax:  `div { -webkit-user-drag: element; }`
     * 
     * restriction: enum
     * 
     * browsers: S3
     * 
     * ref: undefined
     * 
     * values:
     * ```md
     * auto: undefined

     * element: undefined

     * none: undefined
     * ```
     *
     * @param value -
     */
  webkitUserDrag(value: 'auto' | 'element' | 'none' | (string & {})) {
    this.props.set('-webkit-user-drag', value)
    return this
  }

  /**
     * Determines whether a user can edit the content of an element..
     * 
     * syntax:  `div { -webkit-user-modify: read-only; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-user-modify
     * 
     * values:
     * ```md
     * read-only: undefined

     * read-write: undefined

     * read-write-plaintext-only: undefined
     * ```
     *
     * @param value -
     */
  webkitUserModify(
    value:
      | 'read-only'
      | 'read-write'
      | 'read-write-plaintext-only'
      | (string & {}),
  ) {
    this.props.set('-webkit-user-modify', value)
    return this
  }

  /**
     * Controls the appearance of selection..
     * 
     * syntax:  `div { -webkit-user-select: text; }`
     * 
     * restriction: enum
     * 
     * browsers: C,S3
     * 
     * ref: http://css-infos.net/property/-webkit-user-select
     * 
     * values:
     * ```md
     * auto: undefined

     * none: undefined

     * text: undefined
     * ```
     *
     * @param value -
     */
  webkitUserSelect(value: 'auto' | 'none' | 'text' | (string & {})) {
    this.props.set('-webkit-user-select', value)
    return this
  }

  /**
     * Specifies the minimum number of line boxes of a block container that must be left in a fragment after a break..
     * 
     * syntax:  `<integer>`
     * 
     * restriction: integer
     * 
     * browsers: C,IE8,O9.5,S1
     * 
     * ref: http://www.w3.org/TR/css3-break/#widows-orphans
     * 

     * @param value -
     */
  widows(value: number) {
    this.props.set('widows', value)
    return this
  }

  /**
     * Specifies the width of the content area, padding area or border area (depending on 'box-sizing') of certain boxes..
     * 
     * syntax:  `header { width: 200px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-box/#width
     * 
     * values:
     * ```md
     * auto: The width depends on the values of other properties.

     * fill: Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.

     * fit-content: Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.

     * max-content: Use the max-content inline size or max-content block size, as appropriate to the writing mode.

     * min-content: Use the min-content inline size or min-content block size, as appropriate to the writing mode.
     * ```
     *
     * @param value -
     */
  width(
    value:
      | 'auto'
      | 'fill'
      | 'fit-content'
      | 'max-content'
      | 'min-content'
      | (string & {}),
  ) {
    this.props.set('width', value)
    return this
  }

  /**
     * Provides a rendering hint to the user agent, stating what kinds of changes the author expects to perform on the element..
     * 
     * syntax:  `body { will-change: scroll-position; }`
     * 
     * restriction: enum, identifier
     * 
     * browsers: C36,FF36,O24
     * 
     * ref: http://www.w3.org/TR/css-will-change/
     * 
     * values:
     * ```md
     * auto: Expresses no particular intent.

     * contents: Indicates that the author expects to animate or change something about the element's contents in the near future.

     * scroll-position: Indicates that the author expects to animate or change the scroll position of the element in the near future.
     * ```
     *
     * @param value -
     */
  willChange(value: 'auto' | 'contents' | 'scroll-position' | (string & {})) {
    this.props.set('will-change', value)
    return this
  }

  /**
     * Specifies line break opportunities for non-CJK scripts..
     * 
     * syntax:  `p.album { word-break: break-all; }`
     * 
     * restriction: enum
     * 
     * browsers: E,C,FF15,IE5,S3
     * 
     * ref: http://www.w3.org/TR/css3-text/#word-break0
     * 
     * values:
     * ```md
     * break-all: Lines may break between any two grapheme clusters for non-CJK scripts.

     * keep-all: Block characters can no longer create implied break points.

     * normal: Breaks non-CJK scripts according to their own rules.
     * ```
     *
     * @param value -
     */
  wordBreak(value: 'break-all' | 'keep-all' | 'normal' | (string & {})) {
    this.props.set('word-break', value)
    return this
  }

  /**
     * Specifies additional spacing between "words"..
     * 
     * syntax:  `article { word-spacing: 3px; }`
     * 
     * restriction: length, percentage
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-text/#word-spacing0
     * 

     * @param value -
     */
  wordSpacing(value: 'normal' | (string & {})) {
    this.props.set('word-spacing', value)
    return this
  }

  /**
     * Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit..
     * 
     * syntax:  `p { word-wrap: break-word; }`
     * 
     * restriction: enum
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-text/#word-wrap0
     * 
     * values:
     * ```md
     * break-word: An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.

     * normal: Lines may break only at allowed break points.
     * ```
     *
     * @param value -
     */
  wordWrap(value: 'break-word' | 'normal' | (string & {})) {
    this.props.set('word-wrap', value)
    return this
  }

  /**
     * This is a shorthand property for both 'direction' and 'block-progression'..
     * 
     * syntax:  `span { writing-mode: lr-tb; }`
     * 
     * restriction: enum
     * 
     * browsers: E,FF41
     * 
     * ref: http://www.w3.org/TR/css-writing-modes-3/#writing-mode
     * 
     * values:
     * ```md
     * horizontal-tb: Top-to-bottom block flow direction. The writing mode is horizontal.

     * sideways-lr: Left-to-right block flow direction. The writing mode is vertical, while the typographic mode is horizontal.

     * sideways-rl: Right-to-left block flow direction. The writing mode is vertical, while the typographic mode is horizontal.

     * vertical-lr: Left-to-right block flow direction. The writing mode is vertical.

     * vertical-rl: Right-to-left block flow direction. The writing mode is vertical.
     * ```
     *
     * @param value -
     */
  writingMode(
    value:
      | 'horizontal-tb'
      | 'sideways-lr'
      | 'sideways-rl'
      | 'vertical-lr'
      | 'vertical-rl'
      | (string & {}),
  ) {
    this.props.set('writing-mode', value)
    return this
  }

  /**
     * For a positioned box, the 'z-index' property specifies the stack level of the box in the current stacking context and whether the box establishes a local stacking context..
     * 
     * syntax:  `img { z-index: 3; }`
     * 
     * restriction: integer
     * 
     * browsers: all
     * 
     * ref: http://www.w3.org/TR/css3-positioning/#propdef-z-index
     * 

     * @param value -
     */
  zIndex(value: number) {
    this.props.set('z-index', value)
    return this
  }

  /**
     * Non-standard. Specifies the magnification scale of the object. See 'transform: scale()' for a standards-based alternative..
     * 
     * syntax:  `.example { zoom: 1; }`
     * 
     * restriction: enum, integer, number, percentage
     * 
     * browsers: E,C,IE6,O15,S4
     * 
     * ref: https://msdn.microsoft.com/en-us/library/ms531189(v=vs.85).aspx
     * 

     * @param value -
     */
  zoom(value: 'normal' | (string & {})) {
    this.props.set('zoom', value)
    return this
  }
}

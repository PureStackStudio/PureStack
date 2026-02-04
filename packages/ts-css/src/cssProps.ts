export type CSSProps = {
  whitespace:
    | 'normal'
    | 'nowrap'
    | 'pre'
    | 'pre-wrap'
    | 'pre-line'
    | 'break-spaces'
    | 'collapse balance'
    | 'preserve nowrap'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'revert-layer'
    | 'unset'
    | (string & {})
  additiveSymbols: string
  alignContent:
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
  alignItems:
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
  justifyItems:
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
  justifySelf:
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
  alignSelf:
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
  animationDelay: string
  animationDirection:
    | 'alternate'
    | 'alternate-reverse'
    | 'normal'
    | 'reverse'
    | (string & {})
  animationDuration: string
  animationFillMode: 'backwards' | 'both' | 'forwards' | 'none' | (string & {})
  animationIterationCount: 'infinite' | (string & {})
  animationName: 'none' | (string & {})
  animationPlayState: 'paused' | 'running' | (string & {})
  animationTimingFunction: string
  backfaceVisibility: 'hidden' | 'visible' | (string & {})
  background: 'fixed' | 'local' | 'none' | 'scroll' | (string & {})
  backgroundAttachment: 'fixed' | 'local' | 'scroll' | (string & {})
  backgroundBlendMode:
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
  backgroundClip: string
  backgroundColor: string
  backgroundImage: 'none' | (string & {})
  backgroundOrigin: string
  backgroundPosition: string
  backgroundRepeat: 'logical' | (string & {})
  backgroundSize: 'auto' | 'contain' | 'cover' | (string & {})
  blockSize: 'auto' | (string & {})
  border: string
  borderBlockEnd: string
  borderBlockStart: string
  borderBlockEndColor: string
  borderBlockStartColor: string
  borderBlockEndStyle: string
  borderBlockStartStyle: string
  borderBlockEndWidth: string
  borderBlockStartWidth: string
  borderBottom: string
  borderBottomColor: string
  borderBottomLeftRadius: string
  borderBottomRightRadius: string
  borderBottomStyle: string
  borderBottomWidth: string
  borderCollapse: 'collapse' | 'separate' | (string & {})
  borderColor: 'logical' | (string & {})
  borderImage:
    | 'auto'
    | 'fill'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | 'url()'
    | (string & {})
  borderImageOutset: string
  borderImageRepeat: 'repeat' | 'round' | 'space' | 'stretch' | (string & {})
  borderImageSlice: 'fill' | (string & {})
  borderImageSource: 'none' | (string & {})
  borderImageWidth: 'auto' | (string & {})
  borderInlineEnd: string
  borderInlineStart: string
  borderInlineEndColor: string
  borderInlineStartColor: string
  borderInlineEndStyle: string
  borderInlineStartStyle: string
  borderInlineEndWidth: string
  borderInlineStartWidth: string
  borderLeft: string
  borderLeftColor: string
  borderLeftStyle: string
  borderLeftWidth: string
  borderRadius: string
  borderRight: string
  borderRightColor: string
  borderRightStyle: string
  borderRightWidth: string
  borderSpacing: string
  borderStyle: 'logical' | (string & {})
  borderTop: string
  borderTopColor: string
  borderTopLeftRadius: string
  borderTopRightRadius: string
  borderTopStyle: string
  borderTopWidth: string
  borderWidth: 'logical' | (string & {})
  bottom: 'auto' | (string & {})
  boxDecorationBreak: 'clone' | 'slice' | (string & {})
  boxShadow: 'inset' | 'none' | (string & {})
  boxSizing: 'border-box' | 'content-box' | (string & {})
  captionSide:
    | 'block-end'
    | 'block-start'
    | 'bottom'
    | 'inline-end'
    | 'inline-start'
    | 'top'
    | (string & {})
  caretColor: 'auto' | (string & {})
  clear:
    | 'both'
    | 'inline-end'
    | 'inline-start'
    | 'left'
    | 'none'
    | 'right'
    | (string & {})
  clip: 'auto' | 'rect()' | (string & {})
  clipPath: 'none' | 'url()' | (string & {})
  clipRule: 'evenodd' | 'nonzero' | (string & {})
  color: string
  colorInterpolationFilters: 'auto' | 'linearRGB' | 'sRGB' | (string & {})
  columnCount: 'auto' | (string & {})
  columnFill: 'auto' | 'balance' | (string & {})
  columnGap: 'normal' | (string & {})
  columnRule: string
  columnRuleStyle: string
  columnRuleWidth: string
  columns: 'auto' | (string & {})
  columnSpan: 'all' | 'none' | (string & {})
  columnWidth:
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
  counterIncrement: 'none' | (string & {})
  counterReset: 'none' | (string & {})
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
  emptyCells: 'hide' | '-moz-show-background' | 'show' | (string & {})
  enableBackground: 'accumulate' | 'new' | (string & {})
  fallback: string
  fill:
    | 'child'
    | 'child()'
    | 'context-fill'
    | 'context-stroke'
    | 'url()'
    | 'none'
    | (string & {})
  fillOpacity: number | string
  fillRule: 'evenodd' | 'nonzero' | (string & {})
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
  flexBasis: 'auto' | 'content' | (string & {})
  flexDirection:
    | 'column'
    | 'column-reverse'
    | 'row'
    | 'row-reverse'
    | (string & {})
  flexFlow:
    | 'column'
    | 'column-reverse'
    | 'nowrap'
    | 'row'
    | 'row-reverse'
    | 'wrap'
    | 'wrap-reverse'
    | (string & {})
  flexGrow: number | string
  flexShrink: number | string
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse' | (string & {})
  float:
    | 'inline-end'
    | 'inline-start'
    | 'left'
    | 'none'
    | 'right'
    | (string & {})
  floodColor: string
  floodOpacity: string
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
  fontFamily:
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
  fontFeatureSettings:
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
  fontKerning: 'auto' | 'none' | 'normal' | (string & {})
  fontLanguageOverride: 'normal' | (string & {})
  fontSize:
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
  fontSizeAdjust: number | string
  fontStretch:
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
  fontStyle: 'italic' | 'normal' | 'oblique' | (string & {})
  fontSynthesis: 'none' | 'style' | 'weight' | (string & {})
  fontVariant: 'normal' | 'small-caps' | (string & {})
  fontVariantAlternates:
    | 'annotation()'
    | 'character-variant()'
    | 'historical-forms'
    | 'normal'
    | 'ornaments()'
    | 'styleset()'
    | 'stylistic()'
    | 'swash()'
    | (string & {})
  fontVariantCaps:
    | 'all-petite-caps'
    | 'all-small-caps'
    | 'normal'
    | 'petite-caps'
    | 'small-caps'
    | 'titling-caps'
    | 'unicase'
    | (string & {})
  fontVariantEastAsian:
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
  fontVariantLigatures:
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
  fontVariantNumeric:
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
  fontVariantPosition: 'normal' | 'sub' | 'super' | (string & {})
  fontWeight:
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
  glyphOrientationHorizontal: string
  glyphOrientationVertical: 'auto' | (string & {})
  gridArea: 'auto' | 'span' | (string & {})
  grid: string
  gridAutoColumns:
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'minmax()'
    | (string & {})
  gridAutoFlow: 'row' | 'column' | 'dense' | (string & {})
  gridAutoRows:
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'minmax()'
    | (string & {})
  gridColumn: 'auto' | 'span' | (string & {})
  gridColumnEnd: 'auto' | 'span' | (string & {})
  gridColumnGap: string
  gridColumnStart: 'auto' | 'span' | (string & {})
  gap: string
  gridRow: 'auto' | 'span' | (string & {})
  gridRowEnd: 'auto' | 'span' | (string & {})
  gridRowGap: string
  gridRowStart: 'auto' | 'span' | (string & {})
  gridTemplate:
    | 'none'
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'subgrid'
    | 'minmax()'
    | 'repeat()'
    | (string & {})
  gridTemplateAreas: 'none' | (string & {})
  gridTemplateColumns:
    | 'none'
    | 'min-content'
    | 'max-content'
    | 'auto'
    | 'subgrid'
    | 'minmax()'
    | 'repeat()'
    | (string & {})
  gridTemplateRows:
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
  imageOrientation: 'flip' | 'from-image' | (string & {})
  imageRendering:
    | 'auto'
    | 'crisp-edges'
    | '-moz-crisp-edges'
    | 'optimizeQuality'
    | 'optimizeSpeed'
    | 'pixelated'
    | (string & {})
  imeMode:
    | 'active'
    | 'auto'
    | 'disabled'
    | 'inactive'
    | 'normal'
    | (string & {})
  inlineSize: 'auto' | (string & {})
  isolation: 'auto' | 'isolate' | (string & {})
  justifyContent:
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
  letterSpacing: 'normal' | (string & {})
  lightingColor: string
  lineBreak: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | (string & {})
  lineHeight: 'normal' | (string & {})
  listStyle:
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
  listStyleImage: 'none' | (string & {})
  listStylePosition: 'inside' | 'outside' | (string & {})
  listStyleType:
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
  marginBlockEnd: 'auto' | (string & {})
  marginBlockStart: 'auto' | (string & {})
  marginBottom: 'auto' | (string & {})
  marginInlineEnd: 'auto' | (string & {})
  marginInlineStart: 'auto' | (string & {})
  marginLeft: 'auto' | (string & {})
  marginRight: 'auto' | (string & {})
  marginTop: 'auto' | (string & {})
  marker: 'none' | 'child' | 'url()' | (string & {})
  markerEnd: 'none' | 'child' | 'url()' | (string & {})
  markerMid: 'none' | 'child' | 'url()' | (string & {})
  markerStart: 'none' | 'child' | 'url()' | (string & {})
  maskImage: 'none' | 'url()' | (string & {})
  maskMode: 'alpha' | 'auto' | 'luminance' | (string & {})
  maskOrigin: string
  maskPosition: string
  maskRepeat: string
  maskSize: 'auto' | 'contain' | 'cover' | (string & {})
  maskType: 'alpha' | 'luminance' | (string & {})
  maxBlockSize: 'none' | (string & {})
  maxHeight:
    | 'none'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  maxInlineSize: 'none' | (string & {})
  maxWidth:
    | 'none'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  minBlockSize: string
  minHeight:
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  minInlineSize: string
  minWidth:
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  mixBlendMode:
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
  motionOffset: string
  motionPath: 'none' | 'path()' | 'url()' | (string & {})
  motionRotation: 'auto' | 'reverse' | (string & {})
  mozAnimation:
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
  mozAnimationDelay: string
  mozAnimationDirection:
    | 'alternate'
    | 'alternate-reverse'
    | 'normal'
    | 'reverse'
    | (string & {})
  mozAnimationDuration: string
  mozAnimationIterationCount: 'infinite' | (string & {})
  mozAnimationName: 'none' | (string & {})
  mozAnimationPlayState: 'paused' | 'running' | (string & {})
  mozAnimationTimingFunction: string
  mozAppearance:
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
  mozBackfaceVisibility: 'hidden' | 'visible' | (string & {})
  mozBackgroundClip: 'padding' | (string & {})
  mozBackgroundInlinePolicy:
    | 'bounding-box'
    | 'continuous'
    | 'each-box'
    | (string & {})
  mozBackgroundOrigin: string
  mozBorderBottomColors: string
  mozBorderImage:
    | 'auto'
    | 'fill'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | 'url()'
    | (string & {})
  mozBorderLeftColors: string
  mozBorderRightColors: string
  mozBorderTopColors: string
  mozBoxAlign:
    | 'baseline'
    | 'center'
    | 'end'
    | 'start'
    | 'stretch'
    | (string & {})
  mozBoxDirection: 'normal' | 'reverse' | (string & {})
  mozBoxFlex: number | string
  mozBoxFlexgroup: number | string
  mozBoxOrdinalGroup: number | string
  mozBoxOrient:
    | 'block-axis'
    | 'horizontal'
    | 'inline-axis'
    | 'vertical'
    | (string & {})
  mozBoxPack: 'center' | 'end' | 'justify' | 'start' | (string & {})
  mozBoxSizing: 'border-box' | 'content-box' | 'padding-box' | (string & {})
  mozColumnCount: number | string
  mozColumnGap: 'normal' | (string & {})
  mozColumnRule: string
  mozColumnRuleColor: string
  mozColumnRuleStyle: string
  mozColumnRuleWidth: string
  mozColumns: 'auto' | (string & {})
  mozColumnWidth: 'auto' | (string & {})
  mozFontFeatureSettings:
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
  mozHyphens: 'auto' | 'manual' | 'none' | (string & {})
  mozPerspective: 'none' | (string & {})
  mozPerspectiveOrigin: string
  mozTextAlignLast:
    | 'auto'
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'right'
    | 'start'
    | (string & {})
  mozTextDecorationColor: string
  mozTextDecorationLine:
    | 'line-through'
    | 'none'
    | 'overline'
    | 'underline'
    | (string & {})
  mozTextDecorationStyle:
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'none'
    | 'solid'
    | 'wavy'
    | (string & {})
  mozTextSizeAdjust: 'auto' | 'none' | (string & {})
  mozTransform:
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
  mozTransformOrigin: string
  mozTransition: 'all' | 'none' | (string & {})
  mozTransitionDelay: string
  mozTransitionDuration: string
  mozTransitionProperty: 'all' | 'none' | (string & {})
  mozTransitionTimingFunction: string
  mozUserFocus: 'ignore' | 'normal' | (string & {})
  mozUserSelect:
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
  objectFit:
    | 'contain'
    | 'cover'
    | 'fill'
    | 'none'
    | 'scale-down'
    | (string & {})
  objectPosition: string
  opacity: number | string
  order: number | string
  orphans: number | string
  offsetBlockEnd: 'auto' | (string & {})
  offsetBlockStart: 'auto' | (string & {})
  offsetInlineEnd: 'auto' | (string & {})
  offsetInlineStart: 'auto' | (string & {})
  outline: 'auto' | 'invert' | (string & {})
  outlineColor: 'invert' | (string & {})
  outlineOffset: string
  outlineStyle: 'auto' | (string & {})
  outlineWidth: string
  overflow:
    | 'auto'
    | 'clip'
    | 'hidden'
    | '-moz-hidden-unscrollable'
    | 'scroll'
    | 'visible'
    | (string & {})
  overflowWrap: 'break-word' | 'normal' | 'anywhere' | (string & {})
  overflowX: 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | (string & {})
  overflowY: 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | (string & {})
  pad: string
  padding: 'logical' | (string & {})
  paddingBottom: string
  paddingBlockEnd: string
  paddingBlockStart: string
  paddingInlineEnd: string
  paddingInlineStart: string
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  pageBreakAfter:
    | 'always'
    | 'auto'
    | 'avoid'
    | 'left'
    | 'recto'
    | 'right'
    | 'verso'
    | (string & {})
  pageBreakBefore:
    | 'always'
    | 'auto'
    | 'avoid'
    | 'left'
    | 'right'
    | (string & {})
  pageBreakInside: 'auto' | 'avoid' | (string & {})
  paintOrder: 'fill' | 'markers' | 'normal' | 'stroke' | (string & {})
  perspective: 'none' | (string & {})
  perspectiveOrigin: string
  pointerEvents:
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
  rubyAlign:
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
  rubyOverhang: 'auto' | 'end' | 'none' | 'start' | (string & {})
  rubyPosition: 'after' | 'before' | 'inline' | 'right' | (string & {})
  rubySpan: 'attr(x)' | 'none' | (string & {})
  scrollBehavior: 'auto' | 'smooth' | (string & {})
  scrollSnapCoordinate: 'none' | 'border-box' | 'margin-box' | (string & {})
  scrollSnapDestination: string
  scrollSnapPointsX: 'none' | 'repeat()' | (string & {})
  scrollSnapPointsY: 'none' | 'repeat()' | (string & {})
  scrollSnapType: 'none' | 'mandatory' | 'proximity' | (string & {})
  shapeImageThreshold: number | string
  shapeMargin: string
  shapeOutside: 'margin-box' | 'none' | (string & {})
  size: string
  src: 'url()' | 'format()' | 'local()' | (string & {})
  stopColor: string
  stopOpacity: number | string
  stroke:
    | 'child'
    | 'child()'
    | 'context-fill'
    | 'context-stroke'
    | 'url()'
    | 'none'
    | (string & {})
  strokeDasharray: 'none' | (string & {})
  strokeDashoffset: string
  strokeLinecap: 'butt' | 'round' | 'square' | (string & {})
  strokeLinejoin:
    | 'arcs'
    | 'bevel'
    | 'miter'
    | 'miter-clip'
    | 'round'
    | (string & {})
  strokeMiterlimit: number | string
  strokeOpacity: number | string
  strokeWidth: string
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
  tableLayout: 'auto' | 'fixed' | (string & {})
  tabSize: string
  textAlign:
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'match-parent'
    | 'right'
    | 'start'
    | (string & {})
  textAlignLast:
    | 'auto'
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'right'
    | 'start'
    | (string & {})
  textAnchor: 'end' | 'middle' | 'start' | (string & {})
  textDecoration:
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
  textDecorationColor: string
  textDecorationLine:
    | 'line-through'
    | 'none'
    | 'overline'
    | 'underline'
    | (string & {})
  textDecorationStyle:
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'none'
    | 'solid'
    | 'wavy'
    | (string & {})
  textIndent: 'each-line' | 'hanging' | (string & {})
  textOrientation:
    | 'mixed'
    | 'sideways'
    | 'sideways-left'
    | 'sideways-right'
    | 'upright'
    | 'use-glyph-orientation'
    | (string & {})
  textOverflow: 'clip' | 'ellipsis' | (string & {})
  textRendering:
    | 'auto'
    | 'geometricPrecision'
    | 'optimizeLegibility'
    | 'optimizeSpeed'
    | (string & {})
  textShadow: 'none' | (string & {})
  textTransform:
    | 'capitalize'
    | 'full-width'
    | 'lowercase'
    | 'none'
    | 'uppercase'
    | (string & {})
  top: 'auto' | (string & {})
  touchAction:
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
  transformOrigin: string
  transformStyle: 'flat' | 'preserve-3d' | (string & {})
  transition: 'all' | 'none' | (string & {})
  transitionDelay: string
  transitionDuration: string
  transitionProperty: 'all' | 'none' | (string & {})
  transitionTimingFunction: string
  unicodeBidi:
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'normal'
    | 'plaintext'
    | (string & {})
  unicodeRange:
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
  userSelect: 'all' | 'auto' | 'contain' | 'none' | 'text' | (string & {})
  verticalAlign:
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
  webkitAnimation:
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
  webkitAnimationDelay: string
  webkitAnimationDirection:
    | 'alternate'
    | 'alternate-reverse'
    | 'normal'
    | 'reverse'
    | (string & {})
  webkitAnimationDuration: string
  webkitAnimationFillMode:
    | 'backwards'
    | 'both'
    | 'forwards'
    | 'none'
    | (string & {})
  webkitAnimationIterationCount: 'infinite' | (string & {})
  webkitAnimationName: 'none' | (string & {})
  webkitAnimationPlayState: 'paused' | 'running' | (string & {})
  webkitAnimationTimingFunction: string
  webkitAppearance:
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
  backdropFilter:
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
  webkitBackfaceVisibility: 'hidden' | 'visible' | (string & {})
  webkitBackgroundClip: string
  webkitBackgroundComposite: 'border' | 'padding' | (string & {})
  webkitBackgroundOrigin: string
  webkitBorderImage:
    | 'auto'
    | 'fill'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | 'url()'
    | (string & {})
  webkitBoxAlign:
    | 'baseline'
    | 'center'
    | 'end'
    | 'start'
    | 'stretch'
    | (string & {})
  webkitBoxDirection: 'normal' | 'reverse' | (string & {})
  webkitBoxFlex: number | string
  webkitBoxFlexGroup: number | string
  webkitBoxOrdinalGroup: number | string
  webkitBoxOrient:
    | 'block-axis'
    | 'horizontal'
    | 'inline-axis'
    | 'vertical'
    | (string & {})
  webkitBoxPack: 'center' | 'end' | 'justify' | 'start' | (string & {})
  webkitBoxReflect: 'above' | 'below' | 'left' | 'right' | (string & {})
  webkitBoxSizing: 'border-box' | 'content-box' | (string & {})
  webkitBreakAfter:
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
  webkitBreakBefore:
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
  webkitBreakInside:
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | (string & {})
  webkitColumnBreakAfter:
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
  webkitColumnBreakBefore:
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
  webkitColumnBreakInside:
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | (string & {})
  webkitColumnCount: number | string
  webkitColumnGap: 'normal' | (string & {})
  webkitColumnRule: string
  webkitColumnRuleColor: string
  webkitColumnRuleStyle: string
  webkitColumnRuleWidth: string
  webkitColumns: 'auto' | (string & {})
  webkitColumnSpan: 'all' | 'none' | (string & {})
  webkitColumnWidth: 'auto' | (string & {})
  webkitFilter:
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
  webkitFlowFrom: 'none' | (string & {})
  webkitFlowInto: 'none' | (string & {})
  webkitFontFeatureSettings:
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
  webkitHyphens: 'auto' | 'manual' | 'none' | (string & {})
  webkitLineBreak: 'after-white-space' | 'normal' | (string & {})
  webkitMarginBottomCollapse:
    | 'collapse'
    | 'discard'
    | 'separate'
    | (string & {})
  webkitMarginCollapse: 'collapse' | 'discard' | 'separate' | (string & {})
  webkitMarginStart: 'auto' | (string & {})
  webkitMarginTopCollapse: 'collapse' | 'discard' | 'separate' | (string & {})
  webkitMaskClip: string
  webkitMaskImage: 'none' | 'url()' | (string & {})
  webkitMaskOrigin: string
  webkitMaskRepeat: string
  webkitMaskSize: 'auto' | 'contain' | 'cover' | (string & {})
  webkitNbspMode: 'normal' | 'space' | (string & {})
  webkitOverflowScrolling: 'auto' | 'touch' | (string & {})
  webkitPaddingStart: string
  webkitPerspective: 'none' | (string & {})
  webkitPerspectiveOrigin: string
  webkitRegionFragment: 'auto' | 'break' | (string & {})
  webkitTapHighlightColor: string
  webkitTextFillColor: string
  webkitTextSizeAdjust: 'auto' | 'none' | (string & {})
  webkitTextStroke: string
  webkitTextStrokeColor: string
  webkitTextStrokeWidth: string
  webkitTouchCallout: 'none' | (string & {})
  webkitTransform:
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
  webkitTransformOrigin: string
  webkitTransformOriginX: string
  webkitTransformOriginY: string
  webkitTransformOriginZ: string
  webkitTransformStyle: 'flat' | 'preserve-3d' | (string & {})
  webkitTransition: 'all' | 'none' | (string & {})
  webkitTransitionDelay: string
  webkitTransitionDuration: string
  webkitTransitionProperty: 'all' | 'none' | (string & {})
  webkitTransitionTimingFunction: string
  webkitUserDrag: 'auto' | 'element' | 'none' | (string & {})
  webkitUserModify:
    | 'read-only'
    | 'read-write'
    | 'read-write-plaintext-only'
    | (string & {})
  webkitUserSelect: 'auto' | 'none' | 'text' | (string & {})
  widows: number | string
  width:
    | 'auto'
    | 'fill'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | (string & {})
  willChange: 'auto' | 'contents' | 'scroll-position' | (string & {})
  wordBreak: 'break-all' | 'keep-all' | 'normal' | (string & {})
  wordSpacing: 'normal' | (string & {})
  wordWrap: 'break-word' | 'normal' | (string & {})
  writingMode:
    | 'horizontal-tb'
    | 'sideways-lr'
    | 'sideways-rl'
    | 'vertical-lr'
    | 'vertical-rl'
    | (string & {})
  zIndex: number | string
  zoom: 'normal' | (string & {})
} & Record<string & {}, string | number>

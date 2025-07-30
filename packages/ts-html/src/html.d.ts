/** All standard HTML global attributes */
export type GlobalAttributes =
  | 'accesskey'
  | 'autocapitalize'
  | 'autocorrect'
  | 'autofocus'
  | 'class'
  | 'contenteditable'
  | 'contextmenu'
  | 'dir'
  | 'draggable'
  | 'dropzone'
  | 'enterkeyhint'
  | 'exportparts'
  | 'hidden'
  | 'id'
  | 'inert'
  | 'inputmode'
  | 'is'
  | 'itemid'
  | 'itemprop'
  | 'itemref'
  | 'itemscope'
  | 'itemtype'
  | 'lang'
  | 'nonce'
  | 'part'
  | 'popover'
  | 'role'
  | 'slot'
  | 'spellcheck'
  | 'style'
  | 'tabindex'
  | 'title'
  | 'translate'
  | 'virtualkeyboardpolicy'

/** All ARIA-only attributes */
export type AriaAttributes =
  | 'aria-activedescendant'
  | 'aria-atomic'
  | 'aria-autocomplete'
  | 'aria-busy'
  | 'aria-checked'
  | 'aria-colcount'
  | 'aria-colindex'
  | 'aria-colspan'
  | 'aria-controls'
  | 'aria-current'
  | 'aria-describedby'
  | 'aria-details'
  | 'aria-disabled'
  | 'aria-dropeffect'
  | 'aria-errormessage'
  | 'aria-expanded'
  | 'aria-flowto'
  | 'aria-grabbed'
  | 'aria-haspopup'
  | 'aria-hidden'
  | 'aria-invalid'
  | 'aria-keyshortcuts'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-level'
  | 'aria-live'
  | 'aria-modal'
  | 'aria-multiline'
  | 'aria-multiselectable'
  | 'aria-orientation'
  | 'aria-owns'
  | 'aria-placeholder'
  | 'aria-posinset'
  | 'aria-pressed'
  | 'aria-readonly'
  | 'aria-relevant'
  | 'aria-required'
  | 'aria-roledescription'
  | 'aria-rowcount'
  | 'aria-rowindex'
  | 'aria-rowspan'
  | 'aria-selected'
  | 'aria-setsize'
  | 'aria-sort'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'aria-valuetext'

/** All event-handler-only attributes (onclick, oninput, etc.) */
export type EventAttributes =
  | 'onDOMActivate'
  | 'onDOMAttrModified'
  | 'onDOMAttributeNameChanged'
  | 'onDOMCharacterDataModified'
  | 'onDOMContentLoaded'
  | 'onDOMElementNameChanged'
  | 'onDOMFocusIn'
  | 'onDOMFocusOut'
  | 'onDOMNodeInserted'
  | 'onDOMNodeInsertedIntoDocument'
  | 'onDOMNodeRemoved'
  | 'onDOMNodeRemovedFromDocument'
  | 'onDOMSubtreeModified'
  | 'onSVGAbort'
  | 'onSVGError'
  | 'onSVGLoad'
  | 'onSVGResize'
  | 'onSVGScroll'
  | 'onSVGUnload'
  | 'onSVGZoom'
  | 'onabort'
  | 'onafterprint'
  | 'onanimationend'
  | 'onanimationiteration'
  | 'onanimationstart'
  | 'onappinstalled'
  | 'onaudioend'
  | 'onaudioprocess'
  | 'onaudiostart'
  | 'onbeforeprint'
  | 'onbeforeunload'
  | 'onbeginEvent'
  | 'onblocked'
  | 'onblur'
  | 'onboundary'
  | 'oncached'
  | 'oncanplay'
  | 'oncanplaythrough'
  | 'onchange'
  | 'onchargingchange'
  | 'onchargingtimechange'
  | 'onchecking'
  | 'onclick'
  | 'onclose'
  | 'oncomplete'
  | 'oncompositionend'
  | 'oncompositionstart'
  | 'oncompositionupdate'
  | 'oncontextmenu'
  | 'oncopy'
  | 'oncut'
  | 'ondblclick'
  | 'ondevicechange'
  | 'ondevicelight'
  | 'ondevicemotion'
  | 'ondeviceorientation'
  | 'ondeviceproximity'
  | 'ondischargingtimechange'
  | 'ondownloading'
  | 'ondrag'
  | 'ondragend'
  | 'ondragenter'
  | 'ondragleave'
  | 'ondragover'
  | 'ondragstart'
  | 'ondrop'
  | 'ondurationchange'
  | 'onemptied'
  | 'onend'
  | 'onendEvent'
  | 'onended'
  | 'onerror'
  | 'onfocus'
  | 'onfocusin'
  | 'onfocusout'
  | 'onformchange'
  | 'onforminput'
  | 'onfullscreenchange'
  | 'onfullscreenerror'
  | 'ongamepadconnected'
  | 'ongamepaddisconnected'
  | 'ongotpointercapture'
  | 'onhashchange'
  | 'oninput'
  | 'oninvalid'
  | 'onkeydown'
  | 'onkeypress'
  | 'onkeyup'
  | 'onlanguagechange'
  | 'onlevelchange'
  | 'onload'
  | 'onloadeddata'
  | 'onloadedmetadata'
  | 'onloadend'
  | 'onloadstart'
  | 'onlostpointercapture'
  | 'onmark'
  | 'onmessage'
  | 'onmessageerror'
  | 'onmousedown'
  | 'onmouseenter'
  | 'onmouseleave'
  | 'onmousemove'
  | 'onmouseout'
  | 'onmouseover'
  | 'onmouseup'
  | 'onmousewheel'
  | 'onnomatch'
  | 'onnotificationclick'
  | 'onnoupdate'
  | 'onobsolete'
  | 'onoffline'
  | 'ononline'
  | 'onopen'
  | 'onorientationchange'
  | 'onpagehide'
  | 'onpageshow'
  | 'onpaste'
  | 'onpause'
  | 'onplay'
  | 'onplaying'
  | 'onpointercancel'
  | 'onpointerdown'
  | 'onpointerenter'
  | 'onpointerleave'
  | 'onpointerlockchange'
  | 'onpointerlockerror'
  | 'onpointermove'
  | 'onpointerout'
  | 'onpointerover'
  | 'onpointerup'
  | 'onpopstate'
  | 'onprogress'
  | 'onpush'
  | 'onpushsubscriptionchange'
  | 'onratechange'
  | 'onreadystatechange'
  | 'onrepeatEvent'
  | 'onreset'
  | 'onresize'
  | 'onresourcetimingbufferfull'
  | 'onresult'
  | 'onresume'
  | 'onscroll'
  | 'onseeked'
  | 'onseeking'
  | 'onselect'
  | 'onselectionchange'
  | 'onselectstart'
  | 'onshow'
  | 'onslotchange'
  | 'onsoundend'
  | 'onsoundstart'
  | 'onspeechend'
  | 'onspeechstart'
  | 'onstalled'
  | 'onstart'
  | 'onstorage'
  | 'onsubmit'
  | 'onsuccess'
  | 'onsuspend'
  | 'ontimeout'
  | 'ontimeupdate'
  | 'ontouchcancel'
  | 'ontouchend'
  | 'ontouchmove'
  | 'ontouchstart'
  | 'ontransitionend'
  | 'onunload'
  | 'onupdateready'
  | 'onupgradeneeded'
  | 'onuserproximity'
  | 'onversionchange'
  | 'onvisibilitychange'
  | 'onvoiceschanged'
  | 'onvolumechange'
  | 'onwaiting'
  | 'onwheel'

/** Tag-specific attributes only */
export type SpecificAttributesMap = {
  html: 'manifest'
  head: never
  title: never
  base: 'href' | 'target'
  link: 'crossorigin' | 'href' | 'hreflang' | 'media' | 'rel' | 'sizes' | 'type'
  meta: 'charset' | 'content' | 'http-equiv' | 'name'
  style: 'media' | 'scoped' | 'type'
  body: never
  article: never
  section: never
  nav: never
  aside: never
  h1: never
  h2: never
  h3: never
  h4: never
  h5: never
  h6: never
  header: never
  footer: never
  address: never
  p: never
  hr: never
  pre: never
  blockquote: 'cite'
  ol: 'reversed' | 'start' | 'type'
  ul: never
  li: 'value'
  dl: never
  dt: never
  dd: never
  figure: never
  figcaption: never
  main: never
  div: never
  a: 'download' | 'href' | 'hreflang' | 'ping' | 'rel' | 'target' | 'type'
  em: never
  strong: never
  small: never
  s: never
  cite: never
  q: 'cite'
  dfn: never
  abbr: never
  ruby: never
  rb: never
  rt: never
  rp: never
  time: 'datetime'
  code: never
  var: never
  samp: never
  kbd: never
  sub: never
  sup: never
  i: never
  b: never
  u: never
  mark: never
  bdi: never
  bdo: never
  span: never
  br: never
  wbr: never
  ins: never
  del: 'cite' | 'datetime'
  picture: never
  img:
    | 'alt'
    | 'crossorigin'
    | 'decoding'
    | 'fetchpriority'
    | 'height'
    | 'ismap'
    | 'loading'
    | 'referrerpolicy'
    | 'sizes'
    | 'src'
    | 'srcset'
    | 'usemap'
    | 'width'
  iframe:
    | 'allowfullscreen'
    | 'height'
    | 'name'
    | 'sandbox'
    | 'seamless'
    | 'src'
    | 'srcdoc'
    | 'width'
  embed: 'height' | 'src' | 'type' | 'width'
  object:
    | 'data'
    | 'form'
    | 'height'
    | 'name'
    | 'type'
    | 'typemustmatch'
    | 'usemap'
    | 'width'
  param: 'name' | 'value'
  video:
    | 'autoplay'
    | 'controls'
    | 'crossorigin'
    | 'height'
    | 'loop'
    | 'mediagroup'
    | 'muted'
    | 'poster'
    | 'preload'
    | 'src'
    | 'width'
  audio:
    | 'autoplay'
    | 'controls'
    | 'crossorigin'
    | 'loop'
    | 'mediagroup'
    | 'muted'
    | 'preload'
    | 'src'
  source: 'src' | 'type'
  track: 'default' | 'kind' | 'label' | 'src' | 'srclang'
  map: 'name'
  area:
    | 'alt'
    | 'coords'
    | 'download'
    | 'href'
    | 'hreflang'
    | 'ping'
    | 'rel'
    | 'shape'
    | 'target'
    | 'type'
  table: 'border'
  caption: never
  colgroup: 'span'
  col: 'span'
  tbody: never
  thead: never
  tfoot: never
  tr: never
  td: 'colspan' | 'headers' | 'rowspan'
  th: 'abbr' | 'colspan' | 'headers' | 'rowspan' | 'scope' | 'sorted'
  form:
    | 'accept-charset'
    | 'action'
    | 'autocomplete'
    | 'enctype'
    | 'method'
    | 'name'
    | 'novalidate'
    | 'target'
  label: 'for' | 'form'
  input:
    | 'accept'
    | 'alt'
    | 'autocomplete'
    | 'checked'
    | 'dirname'
    | 'disabled'
    | 'form'
    | 'formaction'
    | 'formenctype'
    | 'formmethod'
    | 'formnovalidate'
    | 'formtarget'
    | 'height'
    | 'list'
    | 'max'
    | 'maxlength'
    | 'min'
    | 'minlength'
    | 'multiple'
    | 'name'
    | 'pattern'
    | 'placeholder'
    | 'popovertarget'
    | 'popovertargetaction'
    | 'readonly'
    | 'required'
    | 'size'
    | 'src'
    | 'step'
    | 'type'
    | 'value'
    | 'width'
  button:
    | 'disabled'
    | 'form'
    | 'formaction'
    | 'formenctype'
    | 'formmethod'
    | 'formnovalidate'
    | 'formtarget'
    | 'name'
    | 'popovertarget'
    | 'popovertargetaction'
    | 'type'
    | 'value'
  select:
    | 'autocomplete'
    | 'disabled'
    | 'form'
    | 'multiple'
    | 'name'
    | 'required'
    | 'size'
  datalist: never
  optgroup: 'disabled' | 'label'
  option: 'disabled' | 'label' | 'selected' | 'value'
  textarea:
    | 'autocomplete'
    | 'cols'
    | 'dirname'
    | 'disabled'
    | 'form'
    | 'maxlength'
    | 'minlength'
    | 'name'
    | 'placeholder'
    | 'readonly'
    | 'required'
    | 'rows'
    | 'wrap'
  output: 'for' | 'form' | 'name'
  progress: 'max' | 'value'
  meter: 'high' | 'low' | 'max' | 'min' | 'optimum' | 'value'
  fieldset: 'disabled' | 'form' | 'name'
  legend: never
  details: 'open'
  summary: never
  dialog: never
  script: 'async' | 'charset' | 'crossorigin' | 'defer' | 'src' | 'type'
  noscript: never
  template: never
  canvas: 'height' | 'width'
  slot: 'name'
  data: 'value'
  hgroup: never
  menu: never
  search: never
  fencedframe: 'allow' | 'height' | 'width'
  selectedcontent: never
}

/** All supported HTML tags */
export type HtmlTag = keyof SpecificAttributesMap | (string & {})

/** Base set shared by every tag */
export type BaseAttributes = GlobalAttributes | AriaAttributes | EventAttributes

/** Tag-specific attrs for T */
export type SpecificAttributesForTag<T extends HtmlTag> =
  T extends keyof SpecificAttributesMap ? SpecificAttributesMap[T] : string

/** All allowed attrs for T (base + specific) */
export type AttributesForTag<T extends HtmlTag> =
  | BaseAttributes
  | SpecificAttributesForTag<T>

/** A union of absolutely every attribute name */
export type AllAttributes =
  | BaseAttributes
  | SpecificAttributesMap[keyof SpecificAttributesMap]

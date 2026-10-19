/**
 * Hand-maintained additions to cssProps.ts in the same metadata format.
 * Includes the 126 properties selected in docs/css-property-audit.md and the
 * seven setters previously maintained directly in Style. Keep existing entries.
 *
 * Syntax and browser references were checked against:
 * https://github.com/microsoft/vscode-custom-data/blob/23b85b992e52a06bebee444bd788ccaa549ae5a1/web-data/data/browsers.css-data.json
 */
export const cssProps2 = [
  {
    $: {
      name: 'accent-color',
      restriction: 'color',
      browsers: 'E93,FF92,C93,O79',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/accent-color',
      syntax: 'auto | <color>',
    },
    desc: 'Sets the accent color of controls that expose an accent color',
    values: {
      value: [{ $: { name: 'auto' }, desc: 'Use the browser accent color.' }],
    },
  },
  {
    $: {
      name: 'animation-composition',
      restriction: 'enum',
      browsers: 'E112,FF115,S16,C112,O98',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/animation-composition',
      syntax: '<single-animation-composition>#',
    },
    desc: 'Controls how animation effects combine with underlying property values',
    values: {
      value: [
        { $: { name: 'replace' }, desc: 'Replace the underlying value.' },
        { $: { name: 'add' }, desc: 'Add the effect to the underlying value.' },
        {
          $: { name: 'accumulate' },
          desc: 'Accumulate the effect with the underlying value.',
        },
      ],
    },
  },
  {
    $: {
      name: 'appearance',
      restriction: 'enum',
      browsers: 'E84,FF80,S15.4,C84,O70',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/appearance',
      syntax: 'none | auto | <compat-auto> | <compat-special>',
    },
    desc: 'Controls the native platform appearance of a user interface element',
    values: {
      value: [
        { $: { name: 'none' }, desc: 'Remove the native appearance.' },
        {
          $: { name: 'auto' },
          desc: 'Use the native appearance for the element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'aspect-ratio',
      restriction: 'ratio',
      browsers: 'E88,FF89,S15,C88,O74',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/aspect-ratio',
      syntax: 'auto || <ratio>',
    },
    desc: 'Sets the preferred width-to-height ratio used during automatic sizing',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Use the intrinsic ratio when available.',
        },
      ],
    },
  },
  {
    $: {
      name: 'background-position-x',
      restriction: 'length, percentage',
      browsers: 'E12,FF49,S1,C1,O15',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/background-position-x',
      syntax:
        '[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? ]! ]#',
    },
    desc: 'Sets the horizontal starting position of each background image',
    values: {
      value: [
        { $: { name: 'left' }, desc: 'Align with the left edge.' },
        { $: { name: 'center' }, desc: 'Center horizontally.' },
        { $: { name: 'right' }, desc: 'Align with the right edge.' },
      ],
    },
  },
  {
    $: {
      name: 'background-position-y',
      restriction: 'length, percentage',
      browsers: 'E12,FF49,S1,C1,O15',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/background-position-y',
      syntax:
        '[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? ]! ]#',
    },
    desc: 'Sets the vertical starting position of each background image',
    values: {
      value: [
        { $: { name: 'top' }, desc: 'Align with the top edge.' },
        { $: { name: 'center' }, desc: 'Center vertically.' },
        { $: { name: 'bottom' }, desc: 'Align with the bottom edge.' },
      ],
    },
  },
  {
    $: {
      name: 'border-block',
      restriction: 'length, color',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-block',
      syntax: "<'border-block-start'>",
    },
    desc: 'Sets the width, style, and color of both logical block borders',
  },
  {
    $: {
      name: 'border-block-color',
      restriction: 'color',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-block-color',
      syntax: "<'border-top-color'>{1,2}",
    },
    desc: 'Sets the colors of the logical block-start and block-end borders',
  },
  {
    $: {
      name: 'border-block-style',
      restriction: 'string',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-block-style',
      syntax: "<'border-top-style'>{1,2}",
    },
    desc: 'Sets the line styles of the logical block borders',
  },
  {
    $: {
      name: 'border-block-width',
      restriction: 'length',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-block-width',
      syntax: "<'border-top-width'>{1,2}",
    },
    desc: 'Sets the widths of the logical block borders',
  },
  {
    $: {
      name: 'border-end-end-radius',
      restriction: 'length, percentage',
      browsers: 'E89,FF66,S15,C89,O75',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-end-end-radius',
      syntax: "<'border-top-left-radius'>",
    },
    desc: 'Rounds the corner at the logical block-end and inline-end edges',
  },
  {
    $: {
      name: 'border-end-start-radius',
      restriction: 'length, percentage',
      browsers: 'E89,FF66,S15,C89,O75',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-end-start-radius',
      syntax: "<'border-top-left-radius'>",
    },
    desc: 'Rounds the corner at the logical block-end and inline-start edges',
  },
  {
    $: {
      name: 'border-inline',
      restriction: 'length, color',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-inline',
      syntax: "<'border-block-start'>",
    },
    desc: 'Sets the width, style, and color of both logical inline borders',
  },
  {
    $: {
      name: 'border-inline-color',
      restriction: 'color',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-inline-color',
      syntax: "<'border-top-color'>{1,2}",
    },
    desc: 'Sets the colors of the logical inline-start and inline-end borders',
  },
  {
    $: {
      name: 'border-inline-style',
      restriction: 'string',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-inline-style',
      syntax: "<'border-top-style'>{1,2}",
    },
    desc: 'Sets the line styles of the logical inline borders',
  },
  {
    $: {
      name: 'border-inline-width',
      restriction: 'length',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-inline-width',
      syntax: "<'border-top-width'>{1,2}",
    },
    desc: 'Sets the widths of the logical inline borders',
  },
  {
    $: {
      name: 'border-start-end-radius',
      restriction: 'length, percentage',
      browsers: 'E89,FF66,S15,C89,O75',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-start-end-radius',
      syntax: "<'border-top-left-radius'>",
    },
    desc: 'Rounds the corner at the logical block-start and inline-end edges',
  },
  {
    $: {
      name: 'border-start-start-radius',
      restriction: 'length, percentage',
      browsers: 'E89,FF66,S15,C89,O75',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/border-start-start-radius',
      syntax: "<'border-top-left-radius'>",
    },
    desc: 'Rounds the corner at the logical block-start and inline-start edges',
  },
  {
    $: {
      name: 'break-after',
      restriction: 'enum',
      browsers: 'E12,FF65,S10,C50,O37',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/break-after',
      syntax:
        'auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region',
    },
    desc: 'Controls page, column, or region breaks after the element',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Allow automatic breaks.' },
        { $: { name: 'avoid' }, desc: 'Avoid a break.' },
        { $: { name: 'page' }, desc: 'Force a page break.' },
        { $: { name: 'column' }, desc: 'Force a column break.' },
      ],
    },
  },
  {
    $: {
      name: 'break-before',
      restriction: 'enum',
      browsers: 'E12,FF65,S10,C50,O37',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/break-before',
      syntax:
        'auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region',
    },
    desc: 'Controls page, column, or region breaks before the element',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Allow automatic breaks.' },
        { $: { name: 'avoid' }, desc: 'Avoid a break.' },
        { $: { name: 'page' }, desc: 'Force a page break.' },
        { $: { name: 'column' }, desc: 'Force a column break.' },
      ],
    },
  },
  {
    $: {
      name: 'break-inside',
      restriction: 'enum',
      browsers: 'E12,FF65,S10,C50,O37',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/break-inside',
      syntax: 'auto | avoid | avoid-page | avoid-column | avoid-region',
    },
    desc: 'Controls whether page, column, or region breaks may occur inside the element',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Allow automatic breaks.' },
        { $: { name: 'avoid' }, desc: 'Avoid breaks inside the element.' },
        {
          $: { name: 'avoid-page' },
          desc: 'Avoid page breaks inside the element.',
        },
        {
          $: { name: 'avoid-column' },
          desc: 'Avoid column breaks inside the element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'color-scheme',
      restriction: 'string',
      browsers: 'E81,FF96,S13,C81,O68',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/color-scheme',
      syntax: 'normal | [ light | dark | <custom-ident> ]+ && only?',
    },
    desc: 'Declares the color schemes supported by the element for browser-provided rendering',
    values: {
      value: [
        {
          $: { name: 'normal' },
          desc: 'Use the browser default color scheme.',
        },
        { $: { name: 'light' }, desc: 'Support a light color scheme.' },
        { $: { name: 'dark' }, desc: 'Support a dark color scheme.' },
      ],
    },
  },
  {
    $: {
      name: 'column-rule-color',
      restriction: 'color',
      browsers: 'E12,FF52,S9,C50,O11.1',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/column-rule-color',
      syntax: '<color>',
    },
    desc: 'Sets the color of the rule drawn between columns',
  },
  {
    $: {
      name: 'contain-intrinsic-block-size',
      restriction: 'length',
      browsers: 'E95,FF107,S17,C95,O81',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-block-size',
      syntax: 'auto? [ none | <length> ]',
    },
    desc: 'Provides a placeholder block size when size containment hides the actual content size',
  },
  {
    $: {
      name: 'contain-intrinsic-height',
      restriction: 'length',
      browsers: 'E95,FF107,S17,C95,O81',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-height',
      syntax: 'auto? [ none | <length> ]',
    },
    desc: 'Provides a placeholder height for size-contained content',
  },
  {
    $: {
      name: 'contain-intrinsic-inline-size',
      restriction: 'length',
      browsers: 'E95,FF107,S17,C95,O81',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-inline-size',
      syntax: 'auto? [ none | <length> ]',
    },
    desc: 'Provides a placeholder inline size for size-contained content',
  },
  {
    $: {
      name: 'contain-intrinsic-size',
      restriction: 'length',
      browsers: 'E83,FF107,S17,C83,O69',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-size',
      syntax: '[ auto? [ none | <length> ] ]{1,2}',
    },
    desc: 'Sets placeholder width and height values for size-contained content',
  },
  {
    $: {
      name: 'contain-intrinsic-width',
      restriction: 'length',
      browsers: 'E95,FF107,S17,C95,O81',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-width',
      syntax: 'auto? [ none | <length> ]',
    },
    desc: 'Provides a placeholder width for size-contained content',
  },
  {
    $: {
      name: 'container',
      restriction: 'string',
      browsers: 'E105,FF110,S16,C105,O91',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/container',
      syntax: "<'container-name'> [ / <'container-type'> ]?",
    },
    desc: 'Sets a query container name and containment type',
  },
  {
    $: {
      name: 'container-name',
      restriction: 'identifier',
      browsers: 'E105,FF110,S16,C105,O91',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/container-name',
      syntax: 'none | <custom-ident>+',
    },
    desc: 'Names the element for use in container queries',
  },
  {
    $: {
      name: 'container-type',
      restriction: 'string',
      browsers: 'E105,FF110,S16,C105,O91',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/container-type',
      syntax: 'normal | [ [ size | inline-size ] || scroll-state ]',
    },
    desc: 'Establishes the types of container queries supported by the element',
    values: {
      value: [
        {
          $: { name: 'normal' },
          desc: 'Do not establish size containment for queries.',
        },
        { $: { name: 'size' }, desc: 'Allow queries on both size axes.' },
        {
          $: { name: 'inline-size' },
          desc: 'Allow queries on the inline size.',
        },
        { $: { name: 'scroll-state' }, desc: 'Allow scroll-state queries.' },
      ],
    },
  },
  {
    $: {
      name: 'content-visibility',
      restriction: 'enum',
      browsers: 'E85,FF125,S18,C85,O71',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/content-visibility',
      syntax: 'visible | auto | hidden',
    },
    desc: 'Controls whether the browser renders the contents of an element',
    values: {
      value: [
        { $: { name: 'visible' }, desc: 'Render the contents normally.' },
        {
          $: { name: 'auto' },
          desc: 'Allow rendering work to be skipped for offscreen content.',
        },
        { $: { name: 'hidden' }, desc: 'Skip rendering the contents.' },
      ],
    },
  },
  {
    $: {
      name: 'counter-set',
      restriction: 'string',
      browsers: 'E85,FF68,S17.2,C85,O71',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/counter-set',
      syntax: '[ <counter-name> <integer>? ]+ | none',
    },
    desc: 'Sets the values of named CSS counters',
  },
  {
    $: {
      name: 'cx',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S9,C43,O30',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/cx',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the horizontal center coordinate of an SVG circle or ellipse',
  },
  {
    $: {
      name: 'cy',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S9,C43,O30',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/cy',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the vertical center coordinate of an SVG circle or ellipse',
  },
  {
    $: {
      name: 'dominant-baseline',
      restriction: 'enum',
      browsers: 'E79,FF1,S4,C1,O15',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/dominant-baseline',
      syntax:
        'auto | text-bottom | alphabetic | ideographic | middle | central | mathematical | hanging | text-top',
    },
    desc: 'Selects the dominant baseline used to align text',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Choose the baseline from the writing mode.',
        },
        { $: { name: 'alphabetic' }, desc: 'Use the alphabetic baseline.' },
        { $: { name: 'middle' }, desc: 'Use the middle baseline.' },
        { $: { name: 'central' }, desc: 'Use the central baseline.' },
        { $: { name: 'hanging' }, desc: 'Use the hanging baseline.' },
      ],
    },
  },
  {
    $: {
      name: 'font-optical-sizing',
      restriction: 'enum',
      browsers: 'E17,FF62,S13.1,C79,O66',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/font-optical-sizing',
      syntax: 'auto | none',
    },
    desc: 'Controls automatic optical-size adjustment in fonts that support it',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Adjust optical sizing to the text size.',
        },
        { $: { name: 'none' }, desc: 'Disable automatic optical sizing.' },
      ],
    },
  },
  {
    $: {
      name: 'font-palette',
      restriction: 'string',
      browsers: 'E101,FF107,S15.4,C101,O87',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/font-palette',
      syntax: 'normal | light | dark | <palette-identifier> | <palette-mix()>',
    },
    desc: 'Chooses the color palette used by a color font',
    values: {
      value: [
        { $: { name: 'normal' }, desc: 'Use the default palette.' },
        {
          $: { name: 'light' },
          desc: 'Choose a palette suited to a light background.',
        },
        {
          $: { name: 'dark' },
          desc: 'Choose a palette suited to a dark background.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-synthesis-small-caps',
      restriction: 'enum',
      browsers: 'E97,FF111,S16.4,C97,O83',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/font-synthesis-small-caps',
      syntax: 'auto | none',
    },
    desc: 'Controls whether missing small-cap glyphs may be synthesized',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Allow synthetic small caps.' },
        {
          $: { name: 'none' },
          desc: 'Use only small-cap glyphs supplied by the font.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-synthesis-style',
      restriction: 'enum',
      browsers: 'E97,FF111,S16.4,C97,O83',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/font-synthesis-style',
      syntax: 'auto | none',
    },
    desc: 'Controls whether missing italic or oblique font styles may be synthesized',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Allow synthetic font styles.' },
        { $: { name: 'none' }, desc: 'Use only styles supplied by the font.' },
      ],
    },
  },
  {
    $: {
      name: 'font-synthesis-weight',
      restriction: 'enum',
      browsers: 'E97,FF111,S16.4,C97,O83',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/font-synthesis-weight',
      syntax: 'auto | none',
    },
    desc: 'Controls whether missing bold font weights may be synthesized',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Allow synthetic bold weights.' },
        { $: { name: 'none' }, desc: 'Use only weights supplied by the font.' },
      ],
    },
  },
  {
    $: {
      name: 'font-variation-settings',
      restriction: 'string',
      browsers: 'E17,FF62,S11,C62,O49',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/font-variation-settings',
      syntax: 'normal | [ <string> <number> ]#',
    },
    desc: 'Sets individual variation-axis values for a variable font',
  },
  {
    $: {
      name: 'hyphenate-character',
      restriction: 'string',
      browsers: 'E106,FF98,S17,C106,O92',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/hyphenate-character',
      syntax: 'auto | <string>',
    },
    desc: 'Selects the string displayed at automatic hyphenation breaks',
  },
  {
    $: {
      name: 'inset',
      restriction: 'length, percentage',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset',
      syntax: "<'top'>{1,4}",
    },
    desc: 'Sets the top, right, bottom, and left offsets of a positioned element',
  },
  {
    $: {
      name: 'inset-block',
      restriction: 'length, percentage',
      browsers: 'E87,FF63,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset-block',
      syntax: "<'top'>{1,2}",
    },
    desc: 'Sets both logical block offsets of a positioned element',
  },
  {
    $: {
      name: 'inset-block-end',
      restriction: 'length, percentage',
      browsers: 'E87,FF63,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset-block-end',
      syntax: "<'top'>",
    },
    desc: 'Sets the logical block-end offset of a positioned element',
  },
  {
    $: {
      name: 'inset-block-start',
      restriction: 'length, percentage',
      browsers: 'E87,FF63,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset-block-start',
      syntax: "<'top'>",
    },
    desc: 'Sets the logical block-start offset of a positioned element',
  },
  {
    $: {
      name: 'inset-inline',
      restriction: 'length, percentage',
      browsers: 'E87,FF63,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset-inline',
      syntax: "<'top'>{1,2}",
    },
    desc: 'Sets both logical inline offsets of a positioned element',
  },
  {
    $: {
      name: 'inset-inline-end',
      restriction: 'length, percentage',
      browsers: 'E87,FF63,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset-inline-end',
      syntax: "<'top'>",
    },
    desc: 'Sets the logical inline-end offset of a positioned element',
  },
  {
    $: {
      name: 'inset-inline-start',
      restriction: 'length, percentage',
      browsers: 'E87,FF63,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/inset-inline-start',
      syntax: "<'top'>",
    },
    desc: 'Sets the logical inline-start offset of a positioned element',
  },
  {
    $: {
      name: 'line-clamp',
      restriction: 'integer, string',
      browsers: 'O15',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/line-clamp',
      syntax: 'none | <integer>',
    },
    desc: 'Limits the number of displayed lines in a block of text',
    values: {
      value: [
        { $: { name: 'none' }, desc: 'Do not clamp the number of lines.' },
      ],
    },
  },
  {
    $: {
      name: 'margin-block',
      restriction: 'length, percentage',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/margin-block',
      syntax: "<'margin-top'>{1,2}",
    },
    desc: 'Sets the logical block-start and block-end margins',
  },
  {
    $: {
      name: 'margin-inline',
      restriction: 'length, percentage',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/margin-inline',
      syntax: "<'margin-top'>{1,2}",
    },
    desc: 'Sets the logical inline-start and inline-end margins',
  },
  {
    $: {
      name: 'mask',
      restriction: 'string',
      browsers: 'E120,FF53,S15.4,C120,O106',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/mask',
      syntax: '<mask-layer>#',
    },
    desc: 'Sets the mask images, positions, sizing, clipping, and compositing layers',
  },
  {
    $: {
      name: 'mask-clip',
      restriction: 'string',
      browsers: 'E120,FF53,S15.4,C120,O106',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/mask-clip',
      syntax: '[ <coord-box> | no-clip ]#',
    },
    desc: 'Specifies the area affected by each mask layer',
    values: {
      value: [
        { $: { name: 'border-box' }, desc: 'Clip the mask to the border box.' },
        {
          $: { name: 'padding-box' },
          desc: 'Clip the mask to the padding box.',
        },
        {
          $: { name: 'content-box' },
          desc: 'Clip the mask to the content box.',
        },
        { $: { name: 'no-clip' }, desc: 'Do not clip the mask.' },
      ],
    },
  },
  {
    $: {
      name: 'mask-composite',
      restriction: 'string',
      browsers: 'E120,FF53,S15.4,C120,O106',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/mask-composite',
      syntax: '<compositing-operator>#',
    },
    desc: 'Controls how each mask layer combines with the layers below it',
    values: {
      value: [
        {
          $: { name: 'add' },
          desc: 'Add the current layer to the layers below.',
        },
        {
          $: { name: 'subtract' },
          desc: 'Keep the part outside the layers below.',
        },
        { $: { name: 'intersect' }, desc: 'Keep only the overlapping part.' },
        {
          $: { name: 'exclude' },
          desc: 'Keep only the non-overlapping parts.',
        },
      ],
    },
  },
  {
    $: {
      name: 'math-style',
      restriction: 'enum',
      browsers: 'E109,FF117,S14.1,C109,O95',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/math-style',
      syntax: 'normal | compact',
    },
    desc: 'Selects normal or compact layout for mathematical expressions',
    values: {
      value: [
        { $: { name: 'normal' }, desc: 'Use normal mathematical layout.' },
        { $: { name: 'compact' }, desc: 'Use compact mathematical layout.' },
      ],
    },
  },
  {
    $: {
      name: 'offset',
      restriction: 'string',
      browsers: 'E79,FF72,S16,C55,O42',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/offset',
      syntax:
        "[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?",
    },
    desc: 'Sets the motion path, distance, rotation, position, and anchor',
  },
  {
    $: {
      name: 'offset-anchor',
      restriction: 'position',
      browsers: 'E116,FF72,S16,C116,O102',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/offset-anchor',
      syntax: 'auto | <position>',
    },
    desc: 'Sets the point on the element that follows its motion path',
  },
  {
    $: {
      name: 'offset-distance',
      restriction: 'length, percentage',
      browsers: 'E79,FF72,S16,C55,O42',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/offset-distance',
      syntax: '<length-percentage>',
    },
    desc: 'Sets how far the element has traveled along its motion path',
  },
  {
    $: {
      name: 'offset-path',
      restriction: 'string',
      browsers: 'E79,FF72,S15.4,C55,O45',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/offset-path',
      syntax: 'none | <offset-path> || <coord-box>',
    },
    desc: 'Defines the path followed by an element during motion',
  },
  {
    $: {
      name: 'offset-position',
      restriction: 'position',
      browsers: 'E116,FF122,S16,C116,O102',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/offset-position',
      syntax: 'normal | auto | <position>',
    },
    desc: 'Sets the initial position used to establish the motion path',
  },
  {
    $: {
      name: 'offset-rotate',
      restriction: 'angle',
      browsers: 'E79,FF72,S16,C56,O43',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/offset-rotate',
      syntax: '[ auto | reverse ] || <angle>',
    },
    desc: 'Sets the orientation of an element as it follows its motion path',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Follow the direction of the path.' },
        {
          $: { name: 'reverse' },
          desc: 'Face opposite the direction of the path.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overflow-block',
      restriction: 'enum',
      browsers: 'E135,FF69,S26,C135,O120',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overflow-block',
      syntax: 'visible | hidden | clip | scroll | auto',
    },
    desc: 'Controls overflow along the logical block axis',
    values: {
      value: [
        { $: { name: 'visible' }, desc: 'Allow content to overflow.' },
        {
          $: { name: 'hidden' },
          desc: 'Clip overflow while allowing programmatic scrolling.',
        },
        {
          $: { name: 'clip' },
          desc: 'Clip overflow without creating a scroll container.',
        },
        {
          $: { name: 'scroll' },
          desc: 'Provide scrolling even without overflow.',
        },
        {
          $: { name: 'auto' },
          desc: 'Provide scrolling when content overflows.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overflow-inline',
      restriction: 'enum',
      browsers: 'E135,FF69,S26,C135,O120',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overflow-inline',
      syntax: 'visible | hidden | clip | scroll | auto',
    },
    desc: 'Controls overflow along the logical inline axis',
    values: {
      value: [
        { $: { name: 'visible' }, desc: 'Allow content to overflow.' },
        {
          $: { name: 'hidden' },
          desc: 'Clip overflow while allowing programmatic scrolling.',
        },
        {
          $: { name: 'clip' },
          desc: 'Clip overflow without creating a scroll container.',
        },
        {
          $: { name: 'scroll' },
          desc: 'Provide scrolling even without overflow.',
        },
        {
          $: { name: 'auto' },
          desc: 'Provide scrolling when content overflows.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overscroll-behavior',
      restriction: 'string',
      browsers: 'E18,FF59,S16,C63,O50',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior',
      syntax: '[ contain | none | auto ]{1,2}',
    },
    desc: 'Controls scroll chaining and boundary effects on both scroll axes',
  },
  {
    $: {
      name: 'overscroll-behavior-block',
      restriction: 'enum',
      browsers: 'E79,FF73,S16,C77,O64',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-block',
      syntax: 'contain | none | auto',
    },
    desc: 'Controls scroll chaining and boundary effects on the logical block axis',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Allow scroll chaining and boundary effects.',
        },
        { $: { name: 'contain' }, desc: 'Prevent scroll chaining.' },
        {
          $: { name: 'none' },
          desc: 'Prevent scroll chaining and boundary effects.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overscroll-behavior-inline',
      restriction: 'enum',
      browsers: 'E79,FF73,S16,C77,O64',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-inline',
      syntax: 'contain | none | auto',
    },
    desc: 'Controls scroll chaining and boundary effects on the logical inline axis',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Allow scroll chaining and boundary effects.',
        },
        { $: { name: 'contain' }, desc: 'Prevent scroll chaining.' },
        {
          $: { name: 'none' },
          desc: 'Prevent scroll chaining and boundary effects.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overscroll-behavior-x',
      restriction: 'enum',
      browsers: 'E18,FF59,S16,C63,O50',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-x',
      syntax: 'contain | none | auto',
    },
    desc: 'Controls horizontal scroll chaining and boundary effects',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Allow scroll chaining and boundary effects.',
        },
        { $: { name: 'contain' }, desc: 'Prevent scroll chaining.' },
        {
          $: { name: 'none' },
          desc: 'Prevent scroll chaining and boundary effects.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overscroll-behavior-y',
      restriction: 'enum',
      browsers: 'E18,FF59,S16,C63,O50',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-y',
      syntax: 'contain | none | auto',
    },
    desc: 'Controls vertical scroll chaining and boundary effects',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Allow scroll chaining and boundary effects.',
        },
        { $: { name: 'contain' }, desc: 'Prevent scroll chaining.' },
        {
          $: { name: 'none' },
          desc: 'Prevent scroll chaining and boundary effects.',
        },
      ],
    },
  },
  {
    $: {
      name: 'padding-block',
      restriction: 'length, percentage',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/padding-block',
      syntax: "<'padding-top'>{1,2}",
    },
    desc: 'Sets the logical block-start and block-end padding',
  },
  {
    $: {
      name: 'padding-inline',
      restriction: 'length, percentage',
      browsers: 'E87,FF66,S14.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/padding-inline',
      syntax: "<'padding-top'>{1,2}",
    },
    desc: 'Sets the logical inline-start and inline-end padding',
  },
  {
    $: {
      name: 'page',
      restriction: 'identifier',
      browsers: 'E85,FF110,S1,C85,O71',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/page',
      syntax: 'auto | <custom-ident>',
    },
    desc: 'Assigns the element to a named page in paged media',
  },
  {
    $: {
      name: 'place-content',
      restriction: 'string',
      browsers: 'E79,FF45,S9,C59,O46',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/place-content',
      syntax: "<'align-content'> <'justify-content'>?",
    },
    desc: 'Sets content alignment on the block and inline axes',
  },
  {
    $: {
      name: 'place-items',
      restriction: 'string',
      browsers: 'E79,FF45,S11,C59,O46',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/place-items',
      syntax: "<'align-items'> <'justify-items'>?",
    },
    desc: 'Sets item alignment on the block and inline axes',
  },
  {
    $: {
      name: 'place-self',
      restriction: 'string',
      browsers: 'E79,FF45,S11,C59,O46',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/place-self',
      syntax: "<'align-self'> <'justify-self'>?",
    },
    desc: 'Sets the alignment of an individual item on both axes',
  },
  {
    $: {
      name: 'print-color-adjust',
      restriction: 'enum',
      browsers: 'E136,FF97,S15.4,C136,O121',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/print-color-adjust',
      syntax: 'economy | exact',
    },
    desc: 'Controls whether the browser may adjust colors when printing',
    values: {
      value: [
        {
          $: { name: 'economy' },
          desc: 'Allow adjustments that reduce printing cost.',
        },
        {
          $: { name: 'exact' },
          desc: 'Request that authored colors be preserved.',
        },
      ],
    },
  },
  {
    $: {
      name: 'r',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S9,C43,O30',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/r',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the radius of an SVG circle',
  },
  {
    $: {
      name: 'rotate',
      restriction: 'angle',
      browsers: 'E104,FF72,S14.1,C104,O90',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/rotate',
      syntax: 'none | <angle> | [ x | y | z | <number>{3} ] && <angle>',
    },
    desc: 'Sets rotation independently of the transform property',
  },
  {
    $: {
      name: 'row-gap',
      restriction: 'length, percentage',
      browsers: 'E16,FF52,S10.1,C47,O34',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/row-gap',
      syntax: 'normal | <length-percentage>',
    },
    desc: 'Sets the gap between rows in grid, flex, and multi-column layouts',
  },
  {
    $: {
      name: 'rx',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S17.4,C43,O30',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/rx',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the horizontal radius of an SVG ellipse or rounded rectangle',
  },
  {
    $: {
      name: 'ry',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S17.4,C43,O30',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/ry',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the vertical radius of an SVG ellipse or rounded rectangle',
  },
  {
    $: {
      name: 'scale',
      restriction: 'number, percentage',
      browsers: 'E104,FF72,S14.1,C104,O90',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scale',
      syntax: 'none | [ <number> | <percentage> ]{1,3}',
    },
    desc: 'Sets scaling independently of the transform property',
  },
  {
    $: {
      name: 'scroll-margin',
      restriction: 'length',
      browsers: 'E79,FF90,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin',
      syntax: '<length>{1,4}',
    },
    desc: 'Sets the outsets of the scroll snap area on all four sides',
  },
  {
    $: {
      name: 'scroll-margin-block',
      restriction: 'length',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block',
      syntax: '<length>{1,2}',
    },
    desc: 'Sets the scroll snap area outsets on both logical block edges',
  },
  {
    $: {
      name: 'scroll-margin-block-end',
      restriction: 'length',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-end',
      syntax: '<length>',
    },
    desc: 'Sets the scroll snap area outset on the logical block-end edge',
  },
  {
    $: {
      name: 'scroll-margin-block-start',
      restriction: 'length',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-start',
      syntax: '<length>',
    },
    desc: 'Sets the scroll snap area outset on the logical block-start edge',
  },
  {
    $: {
      name: 'scroll-margin-bottom',
      restriction: 'length',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-bottom',
      syntax: '<length>',
    },
    desc: 'Sets the bottom outset of the scroll snap area',
  },
  {
    $: {
      name: 'scroll-margin-inline',
      restriction: 'length',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline',
      syntax: '<length>{1,2}',
    },
    desc: 'Sets the scroll snap area outsets on both logical inline edges',
  },
  {
    $: {
      name: 'scroll-margin-inline-end',
      restriction: 'length',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-end',
      syntax: '<length>',
    },
    desc: 'Sets the scroll snap area outset on the logical inline-end edge',
  },
  {
    $: {
      name: 'scroll-margin-inline-start',
      restriction: 'length',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-start',
      syntax: '<length>',
    },
    desc: 'Sets the scroll snap area outset on the logical inline-start edge',
  },
  {
    $: {
      name: 'scroll-margin-left',
      restriction: 'length',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-left',
      syntax: '<length>',
    },
    desc: 'Sets the left outset of the scroll snap area',
  },
  {
    $: {
      name: 'scroll-margin-right',
      restriction: 'length',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-right',
      syntax: '<length>',
    },
    desc: 'Sets the right outset of the scroll snap area',
  },
  {
    $: {
      name: 'scroll-margin-top',
      restriction: 'length',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-margin-top',
      syntax: '<length>',
    },
    desc: 'Sets the top outset of the scroll snap area',
  },
  {
    $: {
      name: 'scroll-padding',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding',
      syntax: '[ auto | <length-percentage> ]{1,4}',
    },
    desc: 'Sets the optimal viewing area insets on all four sides of a scrollport',
  },
  {
    $: {
      name: 'scroll-padding-block',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block',
      syntax: '[ auto | <length-percentage> ]{1,2}',
    },
    desc: 'Sets the scrollport viewing area insets on both logical block edges',
  },
  {
    $: {
      name: 'scroll-padding-block-end',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-end',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the scrollport viewing area inset on the logical block-end edge',
  },
  {
    $: {
      name: 'scroll-padding-block-start',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-start',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the scrollport viewing area inset on the logical block-start edge',
  },
  {
    $: {
      name: 'scroll-padding-bottom',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-bottom',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the bottom inset of the scrollport viewing area',
  },
  {
    $: {
      name: 'scroll-padding-inline',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline',
      syntax: '[ auto | <length-percentage> ]{1,2}',
    },
    desc: 'Sets the scrollport viewing area insets on both logical inline edges',
  },
  {
    $: {
      name: 'scroll-padding-inline-end',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-end',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the scrollport viewing area inset on the logical inline-end edge',
  },
  {
    $: {
      name: 'scroll-padding-inline-start',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S15,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-start',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the scrollport viewing area inset on the logical inline-start edge',
  },
  {
    $: {
      name: 'scroll-padding-left',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-left',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the left inset of the scrollport viewing area',
  },
  {
    $: {
      name: 'scroll-padding-right',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-right',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the right inset of the scrollport viewing area',
  },
  {
    $: {
      name: 'scroll-padding-top',
      restriction: 'length, percentage',
      browsers: 'E79,FF68,S14.1,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-padding-top',
      syntax: 'auto | <length-percentage>',
    },
    desc: 'Sets the top inset of the scrollport viewing area',
  },
  {
    $: {
      name: 'scroll-snap-align',
      restriction: 'string',
      browsers: 'E79,FF68,S11,C69,O56',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align',
      syntax: '[ none | start | end | center ]{1,2}',
    },
    desc: 'Sets the alignment of the element within its scroll snap area',
    values: {
      value: [
        { $: { name: 'none' }, desc: 'Do not define a snap position.' },
        { $: { name: 'start' }, desc: 'Align with the start of the snapport.' },
        { $: { name: 'end' }, desc: 'Align with the end of the snapport.' },
        {
          $: { name: 'center' },
          desc: 'Align with the center of the snapport.',
        },
      ],
    },
  },
  {
    $: {
      name: 'scroll-snap-stop',
      restriction: 'enum',
      browsers: 'E79,FF103,S15,C75,O62',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop',
      syntax: 'normal | always',
    },
    desc: 'Controls whether scrolling may pass over a snap position',
    values: {
      value: [
        {
          $: { name: 'normal' },
          desc: 'Allow scrolling to pass over the snap position.',
        },
        {
          $: { name: 'always' },
          desc: 'Require scrolling to stop at the snap position.',
        },
      ],
    },
  },
  {
    $: {
      name: 'scrollbar-color',
      restriction: 'color',
      browsers: 'E121,FF64,S26.2,C121,O107',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scrollbar-color',
      syntax: 'auto | <color>{2}',
    },
    desc: 'Sets the thumb and track colors of scrollbars',
  },
  {
    $: {
      name: 'scrollbar-gutter',
      restriction: 'string',
      browsers: 'E94,FF97,S18.2,C94,O80',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter',
      syntax: 'auto | stable && both-edges?',
    },
    desc: 'Reserves space for scrollbars to prevent layout changes',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Reserve space only when required by the scrollbar.',
        },
        { $: { name: 'stable' }, desc: 'Reserve a stable scrollbar gutter.' },
        {
          $: { name: 'stable both-edges' },
          desc: 'Reserve matching gutters on both inline edges.',
        },
      ],
    },
  },
  {
    $: {
      name: 'scrollbar-width',
      restriction: 'enum',
      browsers: 'E121,FF64,S18.2,C121,O107',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/scrollbar-width',
      syntax: 'auto | thin | none',
    },
    desc: 'Chooses the thickness of scrollbars',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Use the platform default thickness.' },
        { $: { name: 'thin' }, desc: 'Use a thinner scrollbar.' },
        {
          $: { name: 'none' },
          desc: 'Hide the scrollbar without disabling scrolling.',
        },
      ],
    },
  },
  {
    $: {
      name: 'shape-rendering',
      restriction: 'enum',
      browsers: 'E79,FF3,S4,C1,O15',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/shape-rendering',
      syntax: 'auto | optimizeSpeed | crispEdges | geometricPrecision',
    },
    desc: 'Provides rendering-quality hints for SVG shapes',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Let the renderer balance speed and quality.',
        },
        { $: { name: 'optimizeSpeed' }, desc: 'Favor rendering speed.' },
        { $: { name: 'crispEdges' }, desc: 'Favor crisp edges.' },
        {
          $: { name: 'geometricPrecision' },
          desc: 'Favor geometric accuracy.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-autospace',
      restriction: 'string',
      browsers: 'E140,FF145,S18.4,C140,O124',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-autospace',
      syntax: 'normal | <autospace> | auto',
    },
    desc: 'Controls automatic spacing between characters from different writing systems',
  },
  {
    $: {
      name: 'text-combine-upright',
      restriction: 'string',
      browsers: 'E79,FF48,S15.4,C48,O35',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-combine-upright',
      syntax: 'none | all | [ digits <integer>? ]',
    },
    desc: 'Combines a sequence of characters into one upright unit in vertical text',
    values: {
      value: [
        { $: { name: 'none' }, desc: 'Do not combine characters.' },
        { $: { name: 'all' }, desc: 'Combine all characters in the element.' },
      ],
    },
  },
  {
    $: {
      name: 'text-decoration-skip-ink',
      restriction: 'enum',
      browsers: 'E79,FF70,S15.4,C64,O50',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip-ink',
      syntax: 'auto | all | none',
    },
    desc: 'Controls whether text decoration lines avoid glyph strokes',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Let the browser avoid glyph strokes.' },
        { $: { name: 'all' }, desc: 'Avoid glyph strokes wherever possible.' },
        { $: { name: 'none' }, desc: 'Draw continuous decoration lines.' },
      ],
    },
  },
  {
    $: {
      name: 'text-decoration-thickness',
      restriction: 'length, percentage',
      browsers: 'E89,FF70,S12.1,C89,O75',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-decoration-thickness',
      syntax: 'auto | from-font | <length> | <percentage>',
    },
    desc: 'Sets the thickness of text decoration lines',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Let the browser choose a thickness.' },
        {
          $: { name: 'from-font' },
          desc: 'Use the thickness specified by the font.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-emphasis',
      restriction: 'string, color',
      browsers: 'E99,FF46,S7,C99,O85',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-emphasis',
      syntax: "<'text-emphasis-style'> || <'text-emphasis-color'>",
    },
    desc: 'Sets the style and color of emphasis marks beside text',
  },
  {
    $: {
      name: 'text-emphasis-color',
      restriction: 'color',
      browsers: 'E99,FF46,S7,C99,O85',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-emphasis-color',
      syntax: '<color>',
    },
    desc: 'Sets the color of text emphasis marks',
  },
  {
    $: {
      name: 'text-emphasis-position',
      restriction: 'string',
      browsers: 'E99,FF46,S7,C99,O85',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-emphasis-position',
      syntax: 'auto | [ over | under ] && [ right | left ]?',
    },
    desc: 'Positions emphasis marks relative to the text',
  },
  {
    $: {
      name: 'text-emphasis-style',
      restriction: 'string',
      browsers: 'E99,FF46,S7,C99,O85',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-emphasis-style',
      syntax:
        'none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>',
    },
    desc: 'Selects the shape and fill of text emphasis marks',
  },
  {
    $: {
      name: 'text-underline-offset',
      restriction: 'length, percentage',
      browsers: 'E87,FF70,S12.1,C87,O73',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-underline-offset',
      syntax: 'auto | <length> | <percentage>',
    },
    desc: 'Sets the distance between an underline and its original position',
  },
  {
    $: {
      name: 'text-underline-position',
      restriction: 'string',
      browsers: 'E12,FF74,S12.1,C33,O20',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-underline-position',
      syntax: 'auto | from-font | [ under || [ left | right ] ]',
    },
    desc: 'Selects the placement of underlines in horizontal and vertical text',
    values: {
      value: [
        { $: { name: 'auto' }, desc: 'Let the browser choose the position.' },
        {
          $: { name: 'from-font' },
          desc: 'Use the underline position supplied by the font.',
        },
        {
          $: { name: 'under' },
          desc: 'Place the underline below the text content.',
        },
        {
          $: { name: 'left' },
          desc: 'Place the underline to the left in vertical text.',
        },
        {
          $: { name: 'right' },
          desc: 'Place the underline to the right in vertical text.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-wrap',
      restriction: 'string',
      browsers: 'E114,FF121,S17.4,C114,O100',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-wrap',
      syntax: "<'text-wrap-mode'> || <'text-wrap-style'>",
    },
    desc: 'Sets text wrapping behavior and the strategy used to choose line breaks',
    values: {
      value: [
        { $: { name: 'wrap' }, desc: 'Allow text to wrap.' },
        { $: { name: 'nowrap' }, desc: 'Prevent text from wrapping.' },
        { $: { name: 'balance' }, desc: 'Balance line lengths.' },
        {
          $: { name: 'pretty' },
          desc: 'Favor a more pleasing arrangement of line breaks.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-wrap-mode',
      restriction: 'enum',
      browsers: 'E130,FF124,S17.4,C130,O115',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-wrap-mode',
      syntax: 'wrap | nowrap',
    },
    desc: 'Controls whether text may wrap onto additional lines',
    values: {
      value: [
        { $: { name: 'wrap' }, desc: 'Allow wrapping.' },
        { $: { name: 'nowrap' }, desc: 'Prevent wrapping.' },
      ],
    },
  },
  {
    $: {
      name: 'text-wrap-style',
      restriction: 'enum',
      browsers: 'E130,FF124,S17.5,C130,O115',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/text-wrap-style',
      syntax: 'auto | balance | stable | pretty',
    },
    desc: 'Chooses the strategy used to arrange wrapped text lines',
    values: {
      value: [
        {
          $: { name: 'auto' },
          desc: 'Use the browser default wrapping strategy.',
        },
        { $: { name: 'balance' }, desc: 'Balance line lengths.' },
        {
          $: { name: 'stable' },
          desc: 'Avoid changing earlier lines while editing.',
        },
        {
          $: { name: 'pretty' },
          desc: 'Favor a more pleasing arrangement of line breaks.',
        },
      ],
    },
  },
  {
    $: {
      name: 'transform-box',
      restriction: 'enum',
      browsers: 'E79,FF55,S11,C64,O51',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/transform-box',
      syntax: 'content-box | border-box | fill-box | stroke-box | view-box',
    },
    desc: 'Selects the reference box used by transforms and transform-origin',
    values: {
      value: [
        { $: { name: 'content-box' }, desc: 'Use the content box.' },
        { $: { name: 'border-box' }, desc: 'Use the border box.' },
        { $: { name: 'fill-box' }, desc: 'Use the object bounding box.' },
        { $: { name: 'stroke-box' }, desc: 'Use the stroke bounding box.' },
        { $: { name: 'view-box' }, desc: 'Use the nearest SVG viewport.' },
      ],
    },
  },
  {
    $: {
      name: 'transition-behavior',
      restriction: 'string',
      browsers: 'E117,FF129,S17.4,C117,O103',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/transition-behavior',
      syntax: '<transition-behavior-value>#',
    },
    desc: 'Controls whether transitions may start for discrete properties',
    values: {
      value: [
        {
          $: { name: 'normal' },
          desc: 'Transition only continuously animatable properties.',
        },
        {
          $: { name: 'allow-discrete' },
          desc: 'Allow transitions of discrete properties.',
        },
      ],
    },
  },
  {
    $: {
      name: 'translate',
      restriction: 'length, percentage',
      browsers: 'E104,FF72,S14.1,C104,O90',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/translate',
      syntax: 'none | <length-percentage> [ <length-percentage> <length>? ]?',
    },
    desc: 'Sets translation independently of the transform property',
  },
  {
    $: {
      name: 'vector-effect',
      restriction: 'enum',
      browsers: 'E79,FF15,S5.1,C6,O15',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/vector-effect',
      syntax:
        'none | non-scaling-stroke | non-scaling-size | non-rotation | fixed-position',
    },
    desc: 'Controls how transformations affect SVG strokes and geometry',
    values: {
      value: [
        {
          $: { name: 'none' },
          desc: 'Apply the normal transformation behavior.',
        },
        {
          $: { name: 'non-scaling-stroke' },
          desc: 'Keep stroke width independent of scaling.',
        },
        {
          $: { name: 'non-scaling-size' },
          desc: 'Keep the object size independent of scaling.',
        },
        {
          $: { name: 'non-rotation' },
          desc: 'Keep the object orientation independent of rotation.',
        },
        {
          $: { name: 'fixed-position' },
          desc: 'Keep the object position independent of transformations.',
        },
      ],
    },
  },
  {
    $: {
      name: 'view-transition-class',
      restriction: 'identifier',
      browsers: 'E125,FF144,S18.2,C125,O111',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/view-transition-class',
      syntax: 'none | <custom-ident>+',
    },
    desc: 'Assigns classes used to style view-transition pseudo-elements',
  },
  {
    $: {
      name: 'view-transition-name',
      restriction: 'identifier',
      browsers: 'E111,FF144,S18,C111,O97',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/view-transition-name',
      syntax: 'none | <custom-ident> | match-element',
    },
    desc: 'Names an element for capture and matching during a view transition',
  },
  {
    $: {
      name: 'white-space-collapse',
      restriction: 'enum',
      browsers: 'E114,FF124,S17.4,C114,O100',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/white-space-collapse',
      syntax:
        'collapse | preserve | preserve-breaks | preserve-spaces | break-spaces',
    },
    desc: 'Controls how whitespace characters and segment breaks are collapsed',
    values: {
      value: [
        {
          $: { name: 'collapse' },
          desc: 'Collapse whitespace sequences and segment breaks.',
        },
        {
          $: { name: 'preserve' },
          desc: 'Preserve whitespace sequences and segment breaks.',
        },
        {
          $: { name: 'preserve-breaks' },
          desc: 'Preserve segment breaks while collapsing spaces.',
        },
        {
          $: { name: 'preserve-spaces' },
          desc: 'Preserve spaces while converting tabs and breaks to spaces.',
        },
        {
          $: { name: 'break-spaces' },
          desc: 'Preserve spaces and allow a break after each one.',
        },
      ],
    },
  },
  {
    $: {
      name: 'x',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S9,C42,O29',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/x',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the horizontal position of an SVG geometry element',
  },
  {
    $: {
      name: 'y',
      restriction: 'length, percentage',
      browsers: 'E79,FF69,S9,C42,O29',
      ref: 'https://developer.mozilla.org/docs/Web/CSS/y',
      syntax: '<length> | <percentage>',
    },
    desc: 'Sets the vertical position of an SVG geometry element',
  },
]

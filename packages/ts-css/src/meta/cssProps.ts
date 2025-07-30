/**
 * Copied properties supported by all browsers chrome, firefox, safari from:
 * https://github.com/microsoft/vscode-custom-data/blob/main/web-data/css/css-schema.json
 *
 * ```ts
 * Object.groupBy(cssProps, x => x.$.browsers)
 * var d = cssProps.filter(x => x.$.browsers == 'all' || x.$.browsers?.includes("C") || x.$.browsers?.includes("F") || x.$.browsers?.includes("S"))
 * Object.groupBy(d, x => x.$.browsers)
 * ```
 *
 * */
export const cssProps = [
  {
    $: {
      name: 'additive-symbols',
      restriction: 'integer, string, image, identifier',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-additive-symbols',
      syntax: '@counter-style { additive-symbols: 1 I; }',
    },
    desc: "@counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor. Needs to be specified if the counter system is 'additive'.",
  },
  {
    $: {
      name: 'align-content',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#align-content',
      syntax: 'p { $(name): flex-start; }',
    },
    desc: "Aligns a flex container's lines within the flex container when there is extra space in the cross-axis, similar to how 'justify-content' aligns individual items within the main-axis.",
    values: {
      value: [
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines are packed toward the center of the flex container.',
        },
        {
          $: {
            name: 'flex-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines are packed toward the end of the flex container.',
        },
        {
          $: {
            name: 'flex-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines are packed toward the start of the flex container.',
        },
        {
          $: {
            name: 'space-around',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines are evenly distributed in the flex container, with half-size spaces on either end.',
        },
        {
          $: {
            name: 'space-between',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines are evenly distributed in the flex container.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines stretch to take up the remaining space.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'first baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'last baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'space-around',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'space-between',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'space-evenly',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'safe',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'unsafe',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'align-items',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#align-items',
      syntax: 'p { $(name): flex-start; }',
    },
    desc: 'Aligns flex items along the cross axis of the current line of the flex container.',
    values: {
      value: [
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: "If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.",
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The flex item's margin box is centered in the cross axis within the line.",
        },
        {
          $: {
            name: 'flex-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.',
        },
        {
          $: {
            name: 'flex-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'self-start',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'self-end',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'first baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'last baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'safe',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'unsafe',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'justify-items',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF45',
      ref: 'https://www.w3.org/TR/css-grid-1/#row-align',
    },
    desc: 'Defines the default justify-self for all items of the box, giving them the default way of justifying each box along the appropriate axis',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'flex-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: '"Flex items are packed toward the end of the line."',
        },
        {
          $: {
            name: 'flex-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: '"Flex items are packed toward the start of the line."',
        },
        {
          $: {
            name: 'self-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.',
        },
        {
          $: {
            name: 'self-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..',
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are packed flush to each other toward the center of the of the alignment container.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'first baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'last baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.',
        },
        {
          $: {
            name: 'safe',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'unsafe',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'legacy',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'justify-self',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF45',
      ref: 'https://www.w3.org/TR/css-grid-1/#row-align',
    },
    desc: 'Defines the way of justifying a box inside its container along the appropriate axis.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'flex-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: '"Flex items are packed toward the end of the line."',
        },
        {
          $: {
            name: 'flex-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: '"Flex items are packed toward the start of the line."',
        },
        {
          $: {
            name: 'self-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.',
        },
        {
          $: {
            name: 'self-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..',
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are packed flush to each other toward the center of the of the alignment container.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'first baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'last baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.',
        },
        {
          $: {
            name: 'save',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'unsave',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'align-self',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#align-items',
      syntax: 'p { $(name): flex-start; }',
    },
    desc: 'Allows the default alignment along the cross axis to be overridden for individual flex items.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Computes to the value of 'align-items' on the element's parent, or 'stretch' if the element has no parent. On absolutely positioned elements, it computes to itself.",
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'self-end',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'self-start',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: "If the flex item's inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment.",
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The flex item's margin box is centered in the cross axis within the line.",
        },
        {
          $: {
            name: 'flex-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line.',
        },
        {
          $: {
            name: 'flex-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched.',
        },
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'first baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'last baseline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'safe',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'unsafe',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'all',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C37,FF27,O24',
      ref: 'http://www.w3.org/TR/css-cascade-3/#all-shorthand',
      syntax: '* { $(name): unset; }',
    },
    desc: "Shorthand that resets all properties except 'direction' and 'unicode-bidi'.",
    values: {
      value: {
        $: {
          name: 'revert',
          version: '4.0',
          browsers: 'none',
        },
        desc: 'Behavior depends on the origin to which the declaration belongs.',
      },
    },
  },
  {
    $: {
      name: 'alt',
      restriction: 'string, enum',
      version: '3.0',
      browsers: 'S9',
      ref: 'https://drafts.csswg.org/css-content-3/#propdef-alt',
      syntax: "label::before { $(name): 'alt text'; }",
    },
    desc: 'Provides alternative text for assistive technology to replace the generated content of a ::before or ::after element.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'none',
        },
        desc: 'No alternative text.',
      },
    },
  },
  {
    $: {
      name: 'animation',
      restriction: 'time, timing-function, enum, identifier, number',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation',
      syntax: 'div { $(name): movearound 4s ease 3 normal; }',
    },
    desc: 'Shorthand property combines six of the animation properties into a single property.',
    values: {
      value: [
        {
          $: {
            name: 'alternate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.',
        },
        {
          $: {
            name: 'alternate-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.',
        },
        {
          $: {
            name: 'backwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
        },
        {
          $: {
            name: 'both',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Both forwards and backwards fill modes are applied.',
        },
        {
          $: {
            name: 'forwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.',
        },
        {
          $: {
            name: 'infinite',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Causes the animation to repeat forever.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No animation is performed',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Normal playback.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All iterations of the animation are played in the reverse direction from the way they were specified.',
        },
      ],
    },
  },
  {
    $: {
      name: 'animation-delay',
      restriction: 'time',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-delay',
      syntax: 'div { $(name): 4s; }',
    },
    desc: 'Defines when the animation will start.',
  },
  {
    $: {
      name: 'animation-direction',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-direction',
      syntax: 'div { $(name): normal; }',
    },
    desc: 'Defines whether or not the animation should play in reverse on alternate cycles.',
    values: {
      value: [
        {
          $: {
            name: 'alternate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.',
        },
        {
          $: {
            name: 'alternate-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Normal playback.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All iterations of the animation are played in the reverse direction from the way they were specified.',
        },
      ],
    },
  },
  {
    $: {
      name: 'animation-duration',
      restriction: 'time',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-duration',
      syntax: 'div { $(name): 4s; }',
    },
    desc: 'Defines the length of time that an animation takes to complete one cycle.',
  },
  {
    $: {
      name: 'animation-fill-mode',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-fill-mode-property',
      syntax: 'div { $(name): forwards; }',
    },
    desc: 'Defines what values are applied by the animation outside the time it is executing.',
    values: {
      value: [
        {
          $: {
            name: 'backwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
        },
        {
          $: {
            name: 'both',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Both forwards and backwards fill modes are applied.',
        },
        {
          $: {
            name: 'forwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.',
        },
      ],
    },
  },
  {
    $: {
      name: 'animation-iteration-count',
      restriction: 'number, enum',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-iteration-count',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.',
    values: {
      value: {
        $: {
          name: 'infinite',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Causes the animation to repeat forever.',
      },
    },
  },
  {
    $: {
      name: 'animation-name',
      restriction: 'identifier, enum',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#the-animation-name-property-',
      syntax: 'div { $(name): movearound; }',
    },
    desc: 'Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No animation is performed',
      },
    },
  },
  {
    $: {
      name: 'animation-play-state',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-play-state',
      syntax: 'div { $(name): running; }',
    },
    desc: 'Defines whether the animation is running or paused.',
    values: {
      value: [
        {
          $: {
            name: 'paused',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A running animation will be paused.',
        },
        {
          $: {
            name: 'running',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Resume playback of a paused animation.',
        },
      ],
    },
  },
  {
    $: {
      name: 'animation-timing-function',
      restriction: 'timing-function',
      version: '3.0',
      browsers: 'E,C43,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-timing-function',
      syntax: 'div { $(name): ease; }',
    },
    desc: 'Describes how the animation will progress over one cycle of its duration.',
  },
  {
    $: {
      name: 'backface-visibility',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C36,FF16,IE10,O23',
      ref: 'http://www.w3.org/TR/css3-transforms/#backface-visibility-property',
      syntax: 'div { $(name): hidden; }',
    },
    desc: "Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
    values: {
      value: [
        {
          $: {
            name: 'hidden',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Back side is hidden.',
        },
        {
          $: {
            name: 'visible',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Back side is visible.',
        },
      ],
    },
  },
  {
    $: {
      name: 'background',
      restriction:
        'enum, image, color, position, length, repeat, percentage, box',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#background',
      syntax: 'section { $(name): url(image.png) no-repeat #999; }',
    },
    desc: 'Shorthand property for setting most background properties at the same place in the style sheet.',
    values: {
      value: [
        {
          $: {
            name: 'fixed',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page.",
        },
        {
          $: {
            name: 'local',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents.",
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: "A value of 'none' counts as an image layer but draws nothing.",
        },
        {
          $: {
            name: 'scroll',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)",
        },
      ],
    },
  },
  {
    $: {
      name: 'background-attachment',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-attachment',
      syntax: '.box { $(name): fixed; }',
    },
    desc: "Specifies whether the background images are fixed with regard to the viewport ('fixed') or scroll along with the element ('scroll') or its contents ('local').",
    values: {
      value: [
        {
          $: {
            name: 'fixed',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page.",
        },
        {
          $: {
            name: 'local',
            version: '3.0',
            browsers: 'E,C,FF25,IE9,O11.5,S5',
          },
          desc: "The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents.",
        },
        {
          $: {
            name: 'scroll',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)",
        },
      ],
    },
  },
  {
    $: {
      name: 'background-blend-mode',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C35,FF30,O22,S7.1',
      ref: 'http://www.w3.org/TR/compositing-1/#propdef-background-blend-mode',
      syntax: 'div { $(name): saturation; }',
    },
    desc: 'Defines the blending mode of each background layer.',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Default attribute which specifies no blending',
        },
        {
          $: {
            name: 'multiply',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The source color is multiplied by the destination color and replaces the destination.',
        },
        {
          $: {
            name: 'screen',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Multiplies the complements of the backdrop and source color values, then complements the result.',
        },
        {
          $: {
            name: 'overlay',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Multiplies or screens the colors, depending on the backdrop color value.',
        },
        {
          $: {
            name: 'darken',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Selects the darker of the backdrop and source colors.',
        },
        {
          $: {
            name: 'lighten',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Selects the lighter of the backdrop and source colors.',
        },
        {
          $: {
            name: 'color-dodge',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Brightens the backdrop color to reflect the source color.',
        },
        {
          $: {
            name: 'color-burn',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Darkens the backdrop color to reflect the source color.',
        },
        {
          $: {
            name: 'hard-light',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Multiplies or screens the colors, depending on the source color value.',
        },
        {
          $: {
            name: 'soft-light',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Darkens or lightens the colors, depending on the source color value.',
        },
        {
          $: {
            name: 'difference',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Subtracts the darker of the two constituent colors from the lighter color..',
        },
        {
          $: {
            name: 'exclusion',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces an effect similar to that of the Difference mode but lower in contrast.',
        },
        {
          $: {
            name: 'hue',
            version: '3.0',
            browsers: 'C35,FF30,O22',
          },
          desc: 'Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.',
        },
        {
          $: {
            name: 'saturation',
            version: '3.0',
            browsers: 'C35,FF30,O22',
          },
          desc: 'Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.',
        },
        {
          $: {
            name: 'color',
            version: '3.0',
            browsers: 'C35,FF30,O22',
          },
          desc: 'Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.',
        },
        {
          $: {
            name: 'luminosity',
            version: '3.0',
            browsers: 'C35,FF30,O22',
          },
          desc: 'Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.',
        },
      ],
    },
  },
  {
    $: {
      name: 'background-clip',
      restriction: 'box',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S3',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-clip',
      syntax: 'header { $(name): border-box; }',
    },
    desc: 'Determines the background painting area.',
  },
  {
    $: {
      name: 'background-color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-color',
      syntax: 'body { $(name): white; }',
    },
    desc: 'Sets the background color of an element.',
  },
  {
    $: {
      name: 'background-image',
      restriction: 'image, enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-image',
      syntax: 'article { $(name): url(image.png); }',
    },
    desc: 'Sets the background image(s) of an element.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '1.0',
          browsers: 'all',
        },
        desc: 'Counts as an image layer but draws nothing.',
      },
    },
  },
  {
    $: {
      name: 'background-origin',
      restriction: 'box',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S3',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-origin',
      syntax: 'header { $(name): border-box; }',
    },
    desc: "For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
  },
  {
    $: {
      name: 'background-position',
      restriction: 'position, length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-position',
      syntax: 'div { $(name): left center}',
    },
    desc: 'Specifies the initial position of the background image(s) (after any resizing) within their corresponding background positioning area.',
  },
  {
    $: {
      name: 'background-repeat',
      restriction: 'repeat',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-repeat',
      syntax: 'article { $(name): no-repeat; }',
    },
    desc: 'Specifies how background images are tiled after they have been sized and positioned.',
    values: {
      value: {
        $: {
          name: 'logical',
          version: '3.0',
          browsers: 'none',
        },
        desc: 'Double values are considered logical.',
      },
    },
  },
  {
    $: {
      name: 'background-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10,S4.1',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-size',
      syntax: 'header { $(name): 20px; }',
    },
    desc: 'Specifies the size of the background images.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.",
        },
        {
          $: {
            name: 'contain',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.',
        },
        {
          $: {
            name: 'cover',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.',
        },
      ],
    },
  },
  {
    $: {
      name: 'block-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#propdef-block-size',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Size of an element in the direction opposite that of the direction specified by 'writing-mode'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '4.0',
          browsers: 'all',
        },
        desc: 'Depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: 'border',
      restriction: 'length, line-width, line-style, color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#borders',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: 'Shorthand property for setting border width, style, and color.',
  },
  {
    $: {
      name: 'border-block-end',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Logical 'border-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-start',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Logical 'border-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-end-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): red; }',
    },
    desc: "Logical 'border-bottom-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-start-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): red; }',
    },
    desc: "Logical 'border-top-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-end-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): solid; }',
    },
    desc: "Logical 'border-bottom-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-start-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): solid; }',
    },
    desc: "Logical 'border-top-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-end-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'border-bottom-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-block-start-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'border-top-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-bottom',
      restriction: 'length, line-width, line-style, color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#borders',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: 'Shorthand property for setting border width, style and color.',
  },
  {
    $: {
      name: 'border-bottom-color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-color',
      syntax: 'td { $(name): blue; }',
    },
    desc: 'Sets the color of the bottom border.',
  },
  {
    $: {
      name: 'border-bottom-left-radius',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S5',
      ref: 'http://www.w3.org/TR/css3-background/#border-radius',
      syntax: 'td { $(name): 4px; }',
    },
    desc: 'Defines the radii of the bottom left outer border edge.',
  },
  {
    $: {
      name: 'border-bottom-right-radius',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S5',
      ref: 'http://www.w3.org/TR/css3-background/#border-radius',
      syntax: 'td { $(name): 4px; }',
    },
    desc: 'Defines the radii of the bottom right outer border edge.',
  },
  {
    $: {
      name: 'border-bottom-style',
      restriction: 'line-style',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-style',
      syntax: 'td { $(name): solid; }',
    },
    desc: 'Sets the style of the bottom border.',
  },
  {
    $: {
      name: 'border-bottom-width',
      restriction: 'length, line-width',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-width',
      syntax: 'td { $(name): 2px; }',
    },
    desc: 'Sets the thickness of the bottom border.',
  },
  {
    $: {
      name: 'border-collapse',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/CSS2/tables.html#borders',
      syntax: 'table { $(name): collapse; }',
    },
    desc: "Selects a table's border model.",
    values: {
      value: [
        {
          $: {
            name: 'collapse',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Selects the collapsing borders model.',
        },
        {
          $: {
            name: 'separate',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Selects the separated borders border model.',
        },
      ],
    },
  },
  {
    $: {
      name: 'border-color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-color',
      syntax: 'td { $(name): blue; }',
    },
    desc: 'The color of the border around all four edges of an element.',
    values: {
      value: {
        $: {
          name: 'logical',
          version: '3.0',
          browsers: 'none',
        },
        desc: 'Indicates that the values map to the logical properties instead of the physical ones.',
      },
    },
  },
  {
    $: {
      name: 'border-image',
      restriction: 'length, percentage, number, url, enum',
      version: '3.0',
      browsers: 'E,C16,FF15,IE11,O15,S6',
      ref: 'http://www.w3.org/TR/css3-background/#border-image',
      syntax: 'td { $(name): url(border.png) 30 30 round;}',
    },
    desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Causes the middle part of the border-image to be preserved.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Use the border styles.',
        },
        {
          $: {
            name: 'repeat',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area.',
        },
        {
          $: {
            name: 'round',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.',
        },
        {
          $: {
            name: 'space',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is stretched to fill the area.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'border-image-outset',
      restriction: 'length, number',
      version: '3.0',
      browsers: 'E,C16,FF15,IE11,O15,S6',
      ref: 'http://www.w3.org/TR/css3-background/#border-image-outset',
      syntax: 'div { $(name): 3px; }',
    },
    desc: 'The values specify the amount by which the border image area extends beyond the border box on the top, right, bottom, and left sides respectively. If the fourth value is absent, it is the same as the second. If the third one is also absent, it is the same as the first. If the second one is also absent, it is the same as the first. Numbers represent multiples of the corresponding border-width.',
  },
  {
    $: {
      name: 'border-image-repeat',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C16,FF15,IE11,O15,S6',
      ref: 'http://www.w3.org/TR/css3-background/#the-border-image-repeat',
      syntax: 'td { $(name): stretch; }',
    },
    desc: 'Specifies how the images for the sides and the middle part of the border image are scaled and tiled. If the second keyword is absent, it is assumed to be the same as the first.',
    values: {
      value: [
        {
          $: {
            name: 'repeat',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area.',
        },
        {
          $: {
            name: 'round',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.',
        },
        {
          $: {
            name: 'space',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is stretched to fill the area.',
        },
      ],
    },
  },
  {
    $: {
      name: 'border-image-slice',
      restriction: 'number, percentage',
      version: '3.0',
      browsers: 'E,C16,FF15,IE11,O15,S6',
      ref: 'http://www.w3.org/TR/css3-background/#border-image-slice',
      syntax: 'div { $(name): 10%; }',
    },
    desc: 'Specifies inward offsets from the top, right, bottom, and left edges of the image, dividing it into nine regions: four corners, four edges and a middle.',
    values: {
      value: {
        $: {
          name: 'fill',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Causes the middle part of the border-image to be preserved.',
      },
    },
  },
  {
    $: {
      name: 'border-image-source',
      restriction: 'image',
      version: '3.0',
      browsers: 'E,C16,FF15,IE11,O15,S6',
      ref: 'http://www.w3.org/TR/css3-background/#the-border-image-source',
      syntax: 'aside { $(name): url(image.png); }',
    },
    desc: "Specifies an image to use instead of the border styles given by the 'border-style' properties and as an additional background layer for the element. If the value is 'none' or if the image cannot be displayed, the border styles will be used.",
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Use the border styles.',
      },
    },
  },
  {
    $: {
      name: 'border-image-width',
      restriction: 'length, percentage, number',
      version: '3.0',
      browsers: 'E,C16,FF15,IE11,O15,S6',
      ref: 'http://www.w3.org/TR/css3-background/#border-image-slice',
      syntax: '.album { $(name): 4px; }',
    },
    desc: "The four values of 'border-image-width' specify offsets that are used to divide the border image area into nine parts. They represent inward distances from the top, right, bottom, and left sides of the area, respectively.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.',
      },
    },
  },
  {
    $: {
      name: 'border-inline-end',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Logical 'border-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-start',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Logical 'border-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-end-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): red; }',
    },
    desc: "Logical 'border-right-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-start-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): red; }',
    },
    desc: "Logical 'border-left-color'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-end-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): solid; }',
    },
    desc: "Logical 'border-right-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-start-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): solid; }',
    },
    desc: "Logical 'border-left-style'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-end-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'border-right-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-inline-start-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'border-left-width'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'border-left',
      restriction: 'length, line-width, line-style, color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#borders',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: 'Shorthand property for setting border width, style and color',
  },
  {
    $: {
      name: 'border-left-color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-color',
      syntax: 'td { $(name): blue; }',
    },
    desc: 'Sets the color of the left border.',
  },
  {
    $: {
      name: 'border-left-style',
      restriction: 'line-style',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-style',
      syntax: 'td { $(name): solid; }',
    },
    desc: 'Sets the style of the left border.',
  },
  {
    $: {
      name: 'border-left-width',
      restriction: 'length, line-width',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-width',
      syntax: 'td { $(name): 2px; }',
    },
    desc: 'Sets the thickness of the left border.',
  },
  {
    $: {
      name: 'border-radius',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S5',
      ref: 'http://www.w3.org/TR/css3-background/#border-radius',
      syntax: 'td { $(name): 3px 4px; }',
    },
    desc: 'Defines the radii of the outer border edge.',
  },
  {
    $: {
      name: 'border-right',
      restriction: 'length, line-width, line-style, color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#borders',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: 'Shorthand property for setting border width, style and color',
  },
  {
    $: {
      name: 'border-right-color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-color',
      syntax: 'td { $(name): blue; }',
    },
    desc: 'Sets the color of the right border.',
  },
  {
    $: {
      name: 'border-right-style',
      restriction: 'line-style',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-style',
      syntax: 'td { $(name): solid; }',
    },
    desc: 'Sets the style of the right border.',
  },
  {
    $: {
      name: 'border-right-width',
      restriction: 'length, line-width',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-width',
      syntax: 'td { $(name): 2px; }',
    },
    desc: 'Sets the thickness of the right border.',
  },
  {
    $: {
      name: 'border-spacing',
      restriction: 'length',
      version: '2.0',
      browsers: 'E,C,FF1,IE8,O7,S1.2',
      ref: 'http://www.w3.org/TR/CSS2/tables.html#borders',
      syntax: 'table { $(name): 10px 50px; }',
    },
    desc: 'The lengths specify the distance that separates adjoining cell borders. If one length is specified, it gives both the horizontal and vertical spacing. If two are specified, the first gives the horizontal spacing and the second the vertical spacing. Lengths may not be negative.',
  },
  {
    $: {
      name: 'border-style',
      restriction: 'line-style',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-style',
      syntax: 'td { $(name): solid; }',
    },
    desc: 'The style of the border around edges of an element.',
    values: {
      value: {
        $: {
          name: 'logical',
          version: '3.0',
          browsers: 'none',
        },
        desc: 'Indicates that the values map to the logical properties instead of the physical ones.',
      },
    },
  },
  {
    $: {
      name: 'border-top',
      restriction: 'length, line-width, line-style, color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#borders',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: 'Shorthand property for setting border width, style and color',
  },
  {
    $: {
      name: 'border-top-color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-color',
      syntax: 'td { $(name): blue; }',
    },
    desc: 'Sets the color of the top border.',
  },
  {
    $: {
      name: 'border-top-left-radius',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S5',
      ref: 'http://www.w3.org/TR/css3-background/#border-radius',
      syntax: 'td { $(name): 4px; }',
    },
    desc: 'Defines the radii of the top left outer border edge.',
  },
  {
    $: {
      name: 'border-top-right-radius',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O10.5,S5',
      ref: 'http://www.w3.org/TR/css3-background/#border-radius',
      syntax: 'td { $(name): 4px; }',
    },
    desc: 'Defines the radii of the top right outer border edge.',
  },
  {
    $: {
      name: 'border-top-style',
      restriction: 'line-style',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-style',
      syntax: 'td { $(name): solid; }',
    },
    desc: 'Sets the style of the top border.',
  },
  {
    $: {
      name: 'border-top-width',
      restriction: 'length, line-width',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-width',
      syntax: 'td { $(name): 2px; }',
    },
    desc: 'Sets the thickness of the top border.',
  },
  {
    $: {
      name: 'border-width',
      restriction: 'length, line-width',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-background/#border-width',
      syntax: 'td { $(name): 2px; }',
    },
    desc: "Shorthand that sets the four 'border-*-width' properties. If it has four values, they set top, right, bottom and left in that order. If left is missing, it is the same as right; if bottom is missing, it is the same as top; if right is missing, it is the same as top.",
    values: {
      value: {
        $: {
          name: 'logical',
          version: '3.0',
          browsers: 'none',
        },
        desc: 'Indicates that the values map to the logical properties instead of the physical ones.',
      },
    },
  },
  {
    $: {
      name: 'bottom',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-positioning/#propdef-bottom',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Specifies how far an absolutely positioned box's bottom margin edge is offset above the bottom edge of the box's 'containing block'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '2.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
      },
    },
  },
  {
    $: {
      name: 'box-decoration-break',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF32,O11',
      ref: 'http://www.w3.org/TR/css3-break/#break-decoration',
      syntax: 'div { $(name): clone; }',
    },
    desc: 'Specifies whether individual boxes are treated as broken pieces of one continuous box, or whether each box is individually wrapped with the border and padding.',
    values: {
      value: [
        {
          $: {
            name: 'clone',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each box is independently wrapped with the border and padding.',
        },
        {
          $: {
            name: 'slice',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The effect is as though the element were rendered with no breaks present, and then sliced by the breaks afterward.',
        },
      ],
    },
  },
  {
    $: {
      name: 'box-shadow',
      restriction: 'length, color, enum',
      version: '3.0',
      browsers: 'E,C,FF4,IE9,O11.5,S5.1',
      ref: 'http://www.w3.org/TR/css3-background/#box-shadow',
      syntax: 'div { $(name): rgba(0,0,0,0.4) 10px 10px inset; }',
    },
    desc: "Attaches one or more drop-shadows to the box. The property is a comma-separated list of shadows, each specified by 2-4 length values, an optional color, and an optional 'inset' keyword. Omitted lengths are 0; omitted colors are a user agent chosen color.",
    values: {
      value: [
        {
          $: {
            name: 'inset',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Changes the drop shadow from an outer shadow (one that shadows the box onto the canvas, as if it were lifted above the canvas) to an inner shadow (one that shadows the canvas onto the box, as if the box were cut out of the canvas and shifted behind it).',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No shadow.',
        },
      ],
    },
  },
  {
    $: {
      name: 'box-sizing',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C10,FF29,IE8,O8,S5.1',
      ref: 'http://www.w3.org/TR/css3-ui/#box-sizing',
      syntax: 'div { $(name): content-box; }',
    },
    desc: "Specifies the behavior of the 'width' and 'height' properties.",
    values: {
      value: [
        {
          $: {
            name: 'border-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The specified width and height (and respective min/max properties) on this element determine the border box of the element.',
        },
        {
          $: {
            name: 'content-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'caption-side',
      restriction: 'enum',
      version: '2.0',
      browsers: 'E,C,FF,IE8,O,S',
      ref: 'http://www.w3.org/TR/CSS2/tables.html#caption-position',
      syntax: 'caption { $(name): bottom; }',
    },
    desc: 'Specifies the position of the caption box with respect to the table box.',
    values: {
      value: [
        {
          $: {
            name: 'block-end',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'bottom'",
        },
        {
          $: {
            name: 'block-start',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'top'",
        },
        {
          $: {
            name: 'bottom',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Positions the caption box below the table box.',
        },
        {
          $: {
            name: 'inline-end',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'right'",
        },
        {
          $: {
            name: 'inline-start',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'left'",
        },
        {
          $: {
            name: 'top',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Positions the caption box above the table box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'caret-color',
      restriction: 'color, enum',
      version: '3.0',
      browsers: 'C60,FF55,O46',
      ref: 'http://www.w3.org/TR/css3-ui/#propdef-caret-color',
      syntax: 'textarea { $(name): red; }',
    },
    desc: 'Controls the color of the text insertion indicator.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The user agent selects an appropriate color for the caret. This is generally currentcolor, but the user agent may choose a different color to ensure good visibility and contrast with the surrounding content, taking into account the value of currentcolor, the background, shadows, and other factors.',
      },
    },
  },
  {
    $: {
      name: 'clear',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/2006/WD-CSS21-20060411/visuren.html#propdef-clear',
      syntax: 'footer { $(name): both; }',
    },
    desc: "Indicates which sides of an element's box(es) may not be adjacent to an earlier floating box. The 'clear' property does not consider floats inside the element itself or in other block formatting contexts.",
    values: {
      value: [
        {
          $: {
            name: 'both',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating and left-floating boxes that resulted from elements earlier in the source document.',
        },
        {
          $: {
            name: 'inline-end',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'right'",
        },
        {
          $: {
            name: 'inline-start',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'left'",
        },
        {
          $: {
            name: 'left',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any left-floating boxes that resulted from elements earlier in the source document.',
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: "No constraint on the box's position with respect to floats.",
        },
        {
          $: {
            name: 'right',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating boxes that resulted from elements earlier in the source document.',
        },
      ],
    },
  },
  {
    $: {
      name: 'clip',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-masking/#clip-property',
      syntax: 'span { $(name): rect(0px, 60px, 200px, 0px); }',
    },
    desc: "Deprecated. Use the 'clip-path' property when support allows. Defines the visible portion of an element's box.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The element does not clip.',
        },
        {
          $: {
            name: 'rect()',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Specifies offsets from the edges of the border box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'clip-path',
      restriction: 'url, shape, geometry-box, enum',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css-masking/#the-clip-path',
    },
    desc: 'Specifies a clipping path where everything inside the path is visible and everything outside is clipped out.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No clipping path gets created.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'References a <clipPath> element to create a clipping path.',
        },
      ],
    },
  },
  {
    $: {
      name: 'clip-rule',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C5,FF3,IE10,O9,S6',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-clip-rule',
    },
    desc: 'Indicates the algorithm which is to be used to determine what parts of the canvas are included inside the shape.',
    values: {
      value: [
        {
          $: {
            name: 'evenodd',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.",
        },
        {
          $: {
            name: 'nonzero',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.",
        },
      ],
    },
  },
  {
    $: {
      name: 'color',
      restriction: 'color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-color/#foreground',
      syntax: 'body { $(name): red; }',
    },
    desc: "Sets the color of an element's text",
  },
  {
    $: {
      name: 'color-interpolation-filters',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C5,FF3,IE10,O9,S6',
      ref: 'http://www.w3.org/TR/filter-effects/#ColorInterpolationFiltersProperty',
    },
    desc: 'Specifies the color space for imaging operations performed via filter effects.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Color operations are not required to occur in a particular color space.',
        },
        {
          $: {
            name: 'linearRGB',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Color operations should occur in the linearized RGB color space.',
        },
        {
          $: {
            name: 'sRGB',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Color operations should occur in the sRGB color space.',
        },
      ],
    },
  },
  {
    $: {
      name: 'column-count',
      restriction: 'integer, enum',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-count',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Describes the optimal number of columns into which the content of the element will be flowed.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "Determines the number of columns by the 'column-width' property and the element width.",
      },
    },
  },
  {
    $: {
      name: 'column-fill',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#filling-columns',
      syntax: 'article { $(name): balance; }',
    },
    desc: 'In continuous media, this property will only be consulted if the length of columns has been constrained. Otherwise, columns will automatically be balanced.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Fills columns sequentially.',
        },
        {
          $: {
            name: 'balance',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Balance content equally between columns, if possible.',
        },
      ],
    },
  },
  {
    $: {
      name: 'column-gap',
      restriction: 'length, enum',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-gap0',
      syntax: 'div { $(name): 10px; }',
    },
    desc: 'Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.',
    values: {
      value: {
        $: {
          name: 'normal',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'User agent specific and typically equivalent to 1em.',
      },
    },
  },
  {
    $: {
      name: 'column-rule',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule0',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
  },
  {
    $: {
      name: 'column-rule-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S6',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-style',
      syntax: 'div { $(name): solid; }',
    },
    desc: 'Sets the style of the rule between columns of an element.',
  },
  {
    $: {
      name: 'column-rule-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-width',
      syntax: 'div { $(name): 3px; }',
    },
    desc: 'Sets the width of the rule between columns. Negative values are not allowed.',
  },
  {
    $: {
      name: 'columns',
      restriction: 'length, integer, enum',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#columns0',
      syntax: 'div { $(name): 100px 3; }',
    },
    desc: "A shorthand property which sets both 'column-width' and 'column-count'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The width depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: 'column-span',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-span0',
      syntax: 'article { $(name): all; }',
    },
    desc: 'Describes the page/column break behavior after the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The element does not span multiple columns.',
        },
      ],
    },
  },
  {
    $: {
      name: 'column-width',
      restriction: 'length, enum',
      version: '3.0',
      browsers: 'E,IE10,O11.5,S9',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-width',
      syntax: 'div { $(name): 100px; }',
    },
    desc: 'Describes the width of columns in multicol elements.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The width depends on the values of other properties.',
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Specifies the optimal column width as the fill-available inline size of the multi-column element.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Specifies the optimal column width as min(max-content inline size, max(min-content inline size, fill-available inline size)).',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Specifies the optimal column width as the max-content inline size of the multi-column element's contents.",
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Specifies the optimal column width as the min-content inline size of the multi-column element's contents.",
        },
      ],
    },
  },
  {
    $: {
      name: 'contain',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C52,O40',
      ref: 'https://drafts.csswg.org/css-containment-3/#propdef-contain',
      syntax: 'div { $(name): strict; }',
    },
    desc: 'Indicates that an element and its contents are, as much as possible, independent of the rest of the document tree.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the property has no effect.',
        },
        {
          $: {
            name: 'strict',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Turns on all forms of containment for the element.',
        },
        {
          $: {
            name: 'content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All containment rules except size are applied to the element.',
        },
        {
          $: {
            name: 'size',
            version: '3.0',
            browsers: 'all',
          },
          desc: "For properties that can have effects on more than just an element and its descendants, those effects don't escape the containing element.",
        },
        {
          $: {
            name: 'layout',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Turns on layout containment for the element.',
        },
        {
          $: {
            name: 'style',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Turns on style containment for the element.',
        },
        {
          $: {
            name: 'paint',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Turns on paint containment for the element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'content',
      restriction: 'string, url',
      version: '2.0',
      browsers: 'E,C,FF1,IE8,O4,S1',
      ref: 'http://www.w3.org/TR/css3-content/#content',
      syntax: "a:after { $(name): ' ( attr(href))';}",
    },
    desc: 'Determines which page-based occurrence of a given element is applied to a counter or string value.',
    values: {
      value: [
        {
          $: {
            name: 'attr()',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The attr(n) function returns as a string the value of attribute n for the subject of the selector.',
        },
        {
          $: {
            name: 'box',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'A hollow square.',
        },
        {
          $: {
            name: 'check',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'A check mark.',
        },
        {
          $: {
            name: 'circle',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'A hollow circle.',
        },
        {
          $: {
            name: 'close-quote',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Value is replaced by the appropriate string from the 'quotes' property.",
        },
        {
          $: {
            name: 'contents',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Displays the element's descendants.",
        },
        {
          $: {
            name: 'counter(name)',
            version: '2.0',
            browsers: 'all',
          },
          desc: "Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).",
        },
        {
          $: {
            name: 'counter(name, style)',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).",
        },
        {
          $: {
            name: 'counters(name, string)',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).",
        },
        {
          $: {
            name: 'counters(name, string, style)',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).",
        },
        {
          $: {
            name: 'date(format)',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Current date and/or time, formatted according to the specified formatting string. Format is based on POSIX date formatting strings.',
        },
        {
          $: {
            name: 'diamond',
            version: '3.0',
            browsers: 'none',
          },
          desc: "A filled diamond. On some platforms, this is similar to 'disc'.",
        },
        {
          $: {
            name: 'disc',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'A filled circle.',
        },
        {
          $: {
            name: 'endnote',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Shorthand for 'counter(endnote, normal)'. This is intended to be used on the in-flow part of a endnote.",
        },
        {
          $: {
            name: 'footnote',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Shorthand for 'counter(footnote, normal)'. This is intended to be used on the in-flow part of a footnote.",
        },
        {
          $: {
            name: 'hyphen',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'A hyphen bullet.',
        },
        {
          $: {
            name: 'icon',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The (pseudo-)element is replaced in its entirety by the resource referenced by its 'icon' property, and treated as a replaced element.",
        },
        {
          $: {
            name: 'inhibit',
            version: '3.0',
            browsers: 'none',
          },
          desc: "On elements, this inhibits the children of the element from being rendered as children of this element, as if the element was empty. On pseudo-elements, this inhibits the creation of the pseudo-element, as if 'display' computed to 'none'.",
        },
        {
          $: {
            name: 'list-item',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Shorthand for 'counter(list-item, normal)'. Note that this is not equivalent to 'normal' when set on a '::marker' pseudo-element that has a superior with 'display' set to 'list-item', as it ignores the 'list-style' properties.",
        },
        {
          $: {
            name: 'no-close-quote',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Inserts nothing (as in 'none'), but increments (decrements) the level of nesting for quotes.",
        },
        {
          $: {
            name: 'none',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'On elements, this inhibits the children of the element from being rendered as children of this element, as if the element was empty. On pseudo-elements it causes the pseudo-element to have no content.',
        },
        {
          $: {
            name: 'no-open-quote',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Inserts nothing (as in 'none'), but increments (decrements) the level of nesting for quotes.",
        },
        {
          $: {
            name: 'normal',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'See http://www.w3.org/TR/css3-content/#content for computation rules.',
        },
        {
          $: {
            name: 'open-quote',
            version: '2.0',
            browsers: 'none',
          },
          desc: "Value is replaced by the appropriate string from the 'quotes' property.",
        },
        {
          $: {
            name: 'pending()',
            version: '2.0',
            browsers: 'none',
          },
          desc: "This causes all elements and pseudo-elements whose 'move-to' property computes to the specified identifier to be inserted as children of the current element (or pseudo-element).",
        },
        {
          $: {
            name: 'section-note',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Shorthand for 'counter(section-note, normal)'. This is intended to be used on the in-flow part of a section-note.",
        },
        {
          $: {
            name: 'square',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'A filled square.',
        },
        {
          $: {
            name: 'string(name)',
            version: '2.0',
            browsers: 'none',
          },
          desc: 'Specifies a string value',
        },
        {
          $: {
            name: 'url()',
            version: '2.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'counter-increment',
      restriction: 'identifier, integer',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O10.5,S3',
      ref: 'http://www.w3.org/TR/css3-content/#counters',
      syntax: 'h1:before { $(name): section; }',
    },
    desc: 'Manipulate the value of existing counters.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '2.0',
          browsers: 'all',
        },
        desc: 'This element does not alter the value of any counters.',
      },
    },
  },
  {
    $: {
      name: 'counter-reset',
      restriction: 'identifier, integer',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O10.5,S3',
      ref: 'http://www.w3.org/TR/css3-content/#counters',
      syntax: 'h1 { $(name): section; }',
    },
    desc: 'Property accepts one or more names of counters (identifiers), each one optionally followed by an integer. The integer gives the value that the counter is set to on each occurrence of the element.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '2.0',
          browsers: 'all',
        },
        desc: 'The counter is not modified.',
      },
    },
  },
  {
    $: {
      name: 'cursor',
      restriction: 'url, number, enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-ui/#cursor0',
      syntax: 'nav { $(name): pointer; }',
    },
    desc: 'Allows control over cursor appearance in an element',
    values: {
      value: [
        {
          $: {
            name: 'alias',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates an alias of/shortcut to something is to be created. Often rendered as an arrow with a small curved arrow next to it.',
        },
        {
          $: {
            name: 'all-scroll',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the something can be scrolled in any direction. Often rendered as arrows pointing up, down, left, and right with a dot in the middle.',
        },
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The UA determines the cursor to display based on the current context.',
        },
        {
          $: {
            name: 'cell',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that a cell or set of cells may be selected. Often rendered as a thick plus-sign with a dot in the middle.',
        },
        {
          $: {
            name: 'col-resize',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the item/column can be resized horizontally. Often rendered as arrows pointing left and right with a vertical bar separating them.',
        },
        {
          $: {
            name: 'context-menu',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A context menu is available for the object under the cursor. Often rendered as an arrow with a small menu-like graphic next to it.',
        },
        {
          $: {
            name: 'copy',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates something is to be copied. Often rendered as an arrow with a small plus sign next to it.',
        },
        {
          $: {
            name: 'crosshair',
            version: '2.0',
            browsers: 'all',
          },
          desc: "A simple crosshair (e.g., short line segments resembling a '+' sign). Often used to indicate a two dimensional bitmap selection mode.",
        },
        {
          $: {
            name: 'default',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The platform-dependent default cursor. Often rendered as an arrow.',
        },
        {
          $: {
            name: 'e-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that east edge is to be moved.',
        },
        {
          $: {
            name: 'ew-resize',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates a bidirectional east-west resize cursor.',
        },
        {
          $: {
            name: 'grab',
            version: '3.0',
            browsers: 'FF27',
          },
          desc: 'Indicates that something can be grabbed.',
        },
        {
          $: {
            name: 'grabbing',
            version: '3.0',
            browsers: 'FF27',
          },
          desc: 'Indicates that something is being grabbed.',
        },
        {
          $: {
            name: 'help',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Help is available for the object under the cursor. Often rendered as a question mark or a balloon.',
        },
        {
          $: {
            name: 'move',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates something is to be moved.',
        },
        {
          $: {
            name: '-moz-grab',
            version: '3.0',
            browsers: 'FF1.5',
          },
          desc: 'Indicates that something can be grabbed.',
        },
        {
          $: {
            name: '-moz-grabbing',
            version: '3.0',
            browsers: 'FF1.5',
          },
          desc: 'Indicates that something is being grabbed.',
        },
        {
          $: {
            name: '-moz-zoom-in',
            version: '3.0',
            browsers: 'FF',
          },
          desc: 'Indicates that something can be zoomed (magnified) in.',
        },
        {
          $: {
            name: '-moz-zoom-out',
            version: '3.0',
            browsers: 'FF',
          },
          desc: 'Indicates that something can be zoomed (magnified) out.',
        },
        {
          $: {
            name: 'ne-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that movement starts from north-east corner.',
        },
        {
          $: {
            name: 'nesw-resize',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates a bidirectional north-east/south-west cursor.',
        },
        {
          $: {
            name: 'no-drop',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the dragged item cannot be dropped at the current cursor location. Often rendered as a hand or pointer with a small circle with a line through it.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No cursor is rendered for the element.',
        },
        {
          $: {
            name: 'not-allowed',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the requested action will not be carried out. Often rendered as a circle with a line through it.',
        },
        {
          $: {
            name: 'n-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that north edge is to be moved.',
        },
        {
          $: {
            name: 'ns-resize',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates a bidirectional north-south cursor.',
        },
        {
          $: {
            name: 'nw-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that movement starts from north-west corner.',
        },
        {
          $: {
            name: 'nwse-resize',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates a bidirectional north-west/south-east cursor.',
        },
        {
          $: {
            name: 'pointer',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The cursor is a pointer that indicates a link.',
        },
        {
          $: {
            name: 'progress',
            version: '2.1',
            browsers: 'all',
          },
          desc: "A progress indicator. The program is performing some processing, but is different from 'wait' in that the user may still interact with the program. Often rendered as a spinning beach ball, or an arrow with a watch or hourglass.",
        },
        {
          $: {
            name: 'row-resize',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the item/row can be resized vertically. Often rendered as arrows pointing up and down with a horizontal bar separating them.',
        },
        {
          $: {
            name: 'se-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that movement starts from south-east corner.',
        },
        {
          $: {
            name: 's-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that south edge is to be moved.',
        },
        {
          $: {
            name: 'sw-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that movement starts from south-west corner.',
        },
        {
          $: {
            name: 'text',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates text that may be selected. Often rendered as a vertical I-beam.',
        },
        {
          $: {
            name: 'vertical-text',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates vertical-text that may be selected. Often rendered as a horizontal I-beam.',
        },
        {
          $: {
            name: 'wait',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that the program is busy and the user should wait. Often rendered as a watch or hourglass.',
        },
        {
          $: {
            name: '-webkit-grab',
            version: '3.0',
            browsers: 'C,S4',
          },
          desc: 'Indicates that something can be grabbed.',
        },
        {
          $: {
            name: '-webkit-grabbing',
            version: '3.0',
            browsers: 'C,S4',
          },
          desc: 'Indicates that something is being grabbed.',
        },
        {
          $: {
            name: '-webkit-zoom-in',
            version: '2.0',
            browsers: 'C,S1.2',
          },
          desc: 'Indicates that something can be zoomed (magnified) in.',
        },
        {
          $: {
            name: '-webkit-zoom-out',
            version: '2.0',
            browsers: 'C,S1.2',
          },
          desc: 'Indicates that something can be zoomed (magnified) out.',
        },
        {
          $: {
            name: 'w-resize',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Indicates that west edge is to be moved.',
        },
        {
          $: {
            name: 'zoom-in',
            version: '3.0',
            browsers: 'E,C37,FF24,O12.1,S9',
          },
          desc: 'Indicates that something can be zoomed (magnified) in.',
        },
        {
          $: {
            name: 'zoom-out',
            version: '3.0',
            browsers: 'E,C37,FF24,O12.1,S9',
          },
          desc: 'Indicates that something can be zoomed (magnified) out.',
        },
      ],
    },
  },
  {
    $: {
      name: 'direction',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-writing-modes-3/#direction',
      syntax: 'div { $(name): rtl; }',
    },
    desc: "Specifies the inline base direction or directionality of any bidi paragraph, embedding, isolate, or override established by the box. Note: for HTML content use the 'dir' attribute and 'bdo' element rather than this property.",
    values: {
      value: [
        {
          $: {
            name: 'ltr',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Left-to-right direction.',
        },
        {
          $: {
            name: 'rtl',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Right-to-left direction.',
        },
      ],
    },
  },
  {
    $: {
      name: 'display',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-display-3/#propdef-display',
      syntax: 'p { $(name): inline; }',
    },
    desc: "In combination with 'float' and 'position', determines the type of box or boxes that are generated for an element.",
    values: {
      value: [
        {
          $: {
            name: 'block',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The element generates a block-level box',
        },
        {
          $: {
            name: 'contents',
            version: '3.0',
            browsers: 'FF37',
          },
          desc: 'The element itself does not generate any boxes, but its children and pseudo-elements still generate boxes as normal.',
        },
        {
          $: {
            name: 'flex',
            version: '3.0',
            browsers: 'E,C29,FF22,IE11,O12.1,S9',
          },
          desc: 'The element generates a principal flex container box and establishes a flex formatting context.',
        },
        {
          $: {
            name: 'flexbox',
            version: '1.0',
            browsers: 'O12.1',
          },
          desc: "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
        },
        {
          $: {
            name: 'flow',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'The element lays out its contents using flow layout (block-and-inline layout).',
        },
        {
          $: {
            name: 'flow-root',
            version: '3.0',
            browsers: 'C58,FF53,O45',
          },
          desc: 'The element generates a block container box, and lays out its contents using flow layout.',
        },
        {
          $: {
            name: 'grid',
            version: '3.0',
            browsers: 'FF52,C57,S10.1,O44',
          },
          desc: 'The element generates a principal grid container box, and establishes a grid formatting context.',
        },
        {
          $: {
            name: 'inline',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The element generates an inline-level box.',
        },
        {
          $: {
            name: 'inline-block',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'A block box, which itself is flowed as a single inline box, similar to a replaced element. The inside of an inline-block is formatted as a block box, and the box itself is formatted as an inline box.',
        },
        {
          $: {
            name: 'inline-flex',
            version: '1.0',
            browsers: 'E,C29,FF22,IE11,O12.1,S9',
          },
          desc: 'Inline-level flex container.',
        },
        {
          $: {
            name: 'inline-flexbox',
            version: '1.0',
            browsers: 'O12.1',
          },
          desc: "Inline-level flex container. Standardized as 'inline-flex'",
        },
        {
          $: {
            name: 'inline-grid',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Inline-level grid container.',
        },
        {
          $: {
            name: 'inline-table',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Inline-level table wrapper box containing table box.',
        },
        {
          $: {
            name: 'list-item',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'One or more block boxes and one marker box.',
        },
        {
          $: {
            name: '-moz-box',
            version: '1.0',
            browsers: 'FF',
          },
          desc: "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
        },
        {
          $: {
            name: '-moz-deck',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-grid',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-grid-group',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-grid-line',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-groupbox',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-inline-box',
            version: '1.0',
            browsers: 'FF',
          },
          desc: "Inline-level flex container. Standardized as 'inline-flex'",
        },
        {
          $: {
            name: '-moz-inline-grid',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-inline-stack',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-marker',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-popup',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-moz-stack',
            version: '1.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: '-ms-flexbox',
            version: '1.0',
            browsers: 'IE10',
          },
          desc: "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
        },
        {
          $: {
            name: '-ms-grid',
            version: '3.0',
            browsers: 'E,IE10',
          },
          desc: 'The element generates a principal grid container box, and establishes a grid formatting context.',
        },
        {
          $: {
            name: '-ms-inline-flexbox',
            version: '1.0',
            browsers: 'IE10',
          },
          desc: "Inline-level flex container. Standardized as 'inline-flex'",
        },
        {
          $: {
            name: '-ms-inline-grid',
            version: '3.0',
            browsers: 'E,IE10',
          },
          desc: 'Inline-level grid container.',
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The element and its descendants generates no boxes.',
        },
        {
          $: {
            name: 'ruby',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The element generates a principal ruby container box, and establishes a ruby formatting context.',
        },
        {
          $: {
            name: 'ruby-base',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'ruby-base-container',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'ruby-base-group',
            version: '3.0',
            browsers: 'none',
          },
        },
        {
          $: {
            name: 'ruby-text',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'ruby-text-container',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'ruby-text-group',
            version: '3.0',
            browsers: 'none',
          },
        },
        {
          $: {
            name: 'run-in',
            version: '2.0',
            browsers: 'IE8',
          },
          desc: 'The element generates a run-in box. Run-in elements act like inlines or blocks, depending on the surrounding elements.',
        },
        {
          $: {
            name: 'table',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The element generates a principal table wrapper box containing an additionally-generated table box, and establishes a table formatting context.',
        },
        {
          $: {
            name: 'table-caption',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-cell',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-column',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-column-group',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-footer-group',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-header-group',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-row',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'table-row-group',
            version: '2.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-webkit-box',
            version: '1.0',
            browsers: 'C,S1',
          },
          desc: "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
        },
        {
          $: {
            name: '-webkit-flex',
            version: '1.0',
            browsers: 'C21,O15,S6.1',
          },
          desc: 'The element lays out its contents using flow layout (block-and-inline layout).',
        },
        {
          $: {
            name: '-webkit-inline-box',
            version: '1.0',
            browsers: 'C,S1',
          },
          desc: "Inline-level flex container. Standardized as 'inline-flex'",
        },
        {
          $: {
            name: '-webkit-inline-flex',
            version: '1.0',
            browsers: 'C21,O15,S6.1',
          },
          desc: 'Inline-level flex container.',
        },
      ],
    },
  },
  {
    $: {
      name: 'empty-cells',
      restriction: 'enum',
      version: '2.0',
      browsers: 'E,C,FF1,IE7,O4,S1.2',
      ref: 'http://www.w3.org/TR/CSS2/tables.html#empty-cells',
      syntax: 'table { $(name): hide; }',
    },
    desc: 'In the separated borders model, this property controls the rendering of borders and backgrounds around cells that have no visible content.',
    values: {
      value: [
        {
          $: {
            name: 'hide',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'No borders or backgrounds are drawn around/behind empty cells.',
        },
        {
          $: {
            name: '-moz-show-background',
            version: '3.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: 'show',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Borders and backgrounds are drawn around/behind empty cells (like normal cells).',
        },
      ],
    },
  },
  {
    $: {
      name: 'enable-background',
      restriction: 'integer, length, percentage, enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/filter-effects/#AccessBackgroundImage',
    },
    desc: "Deprecated. Use 'isolation' property instead when support allows. Specifies how the accumulation of the background image is managed.",
    values: {
      value: [
        {
          $: {
            name: 'accumulate',
            version: '3.0',
            browsers: 'all',
          },
          desc: "If the ancestor container element has a property of new, then all graphics elements within the current container are rendered both on the parent's background image and onto the target.",
        },
        {
          $: {
            name: 'new',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Create a new background image canvas. All children of the current container element can access the background, and they will be rendered onto both the parent's background image canvas in addition to the target device.",
        },
      ],
    },
  },
  {
    $: {
      name: 'fallback',
      restriction: 'identifier',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-fallback',
      syntax: '@counter-style { fallback: upper-alpha; }',
    },
    desc: "@counter-style descriptor. Specifies a fallback counter style to be used when the current counter style can't create a representation for a given counter value.",
  },
  {
    $: {
      name: 'fill',
      restriction: 'color, enum, url',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#FillProperty',
    },
    desc: 'Paints the interior of the given graphical element.',
    values: {
      value: [
        {
          $: {
            name: 'child',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'A reference to the last child paint server element of the element being painted.',
        },
        {
          $: {
            name: 'child()',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'A reference to the nth child paint server element of the element being painted.',
        },
        {
          $: {
            name: 'context-fill',
            version: '4.0',
            browsers: 'none',
          },
          desc: "The computed value of the 'fill' property of the context element of the element being painted.",
        },
        {
          $: {
            name: 'context-stroke',
            version: '4.0',
            browsers: 'none',
          },
          desc: "The computed value of the 'stroke' property of the context element of the element being painted.",
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: "A URL reference to a paint server element, which is an element that defines a paint server: 'hatch', 'linearGradient', 'mesh', 'pattern', 'radialGradient' and 'solidcolor'.",
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No paint is applied in this layer.',
        },
      ],
    },
  },
  {
    $: {
      name: 'fill-opacity',
      restriction: 'number(0-1)',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#FillOpacity',
    },
    desc: 'Specifies the opacity of the painting operation used to paint the interior the current object.',
  },
  {
    $: {
      name: 'fill-rule',
      restriction: 'enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#WindingRule',
    },
    desc: 'Indicates the algorithm (or winding rule) which is to be used to determine what parts of the canvas are included inside the shape.',
    values: {
      value: [
        {
          $: {
            name: 'evenodd',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.",
        },
        {
          $: {
            name: 'nonzero',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Determines the 'insideness' of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.",
        },
      ],
    },
  },
  {
    $: {
      name: 'filter',
      restriction: 'enum, url',
      version: '3.0',
      browsers: 'E13,FF35',
      ref: 'http://www.w3.org/TR/filter-effects/#propdef-filter',
      syntax: 'div { $(name): opacity(50%); }',
    },
    desc: "Processes an element's rendering before it is displayed in the document, by applying one or more filter effects.",
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No filter effects are applied.',
        },
        {
          $: {
            name: 'blur()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a Gaussian blur to the input image.',
        },
        {
          $: {
            name: 'brightness()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a linear multiplier to input image, making it appear more or less bright.',
        },
        {
          $: {
            name: 'contrast()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Adjusts the contrast of the input.',
        },
        {
          $: {
            name: 'drop-shadow()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a drop shadow effect to the input image.',
        },
        {
          $: {
            name: 'grayscale()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Converts the input image to grayscale.',
        },
        {
          $: {
            name: 'hue-rotate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a hue rotation on the input image. ',
        },
        {
          $: {
            name: 'invert()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Inverts the samples in the input image.',
        },
        {
          $: {
            name: 'opacity()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies transparency to the samples in the input image.',
        },
        {
          $: {
            name: 'saturate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Saturates the input image.',
        },
        {
          $: {
            name: 'sepia()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Converts the input image to sepia.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'FF3.6',
          },
          desc: 'A filter reference to a <filter> element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'flex',
      restriction: 'length, number, percentage',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex',
      syntax: 'p { $(name): 0 1 auto; }',
    },
    desc: 'Specifies the components of a flexible length: the flex grow factor and flex shrink factor, and the flex basis.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Retrieves the value of the main size property as the used 'flex-basis'.",
        },
        {
          $: {
            name: 'content',
            version: '3.0',
            browsers: 'E,IE11',
          },
          desc: "Indicates automatic sizing, based on the flex item's content.",
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Expands to '0 0 auto'.",
        },
      ],
    },
  },
  {
    $: {
      name: 'flex-basis',
      restriction: 'length, number, percentage',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex-basis-propdef',
      syntax: 'p { $(name): 30%; }',
    },
    desc: 'Sets the flex basis.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Retrieves the value of the main size property as the used 'flex-basis'.",
        },
        {
          $: {
            name: 'content',
            version: '3.0',
            browsers: 'E,IE11',
          },
          desc: "Indicates automatic sizing, based on the flex item's content.",
        },
      ],
    },
  },
  {
    $: {
      name: 'flex-direction',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex-direction',
      syntax: 'div { $(name): column; }',
    },
    desc: "Specifies how flex items are placed in the flex container, by setting the direction of the flex container's main axis.",
    values: {
      value: [
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The flex container's main axis has the same orientation as the block axis of the current writing mode.",
        },
        {
          $: {
            name: 'column-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Same as 'column', except the main-start and main-end directions are swapped.",
        },
        {
          $: {
            name: 'row',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The flex container's main axis has the same orientation as the inline axis of the current writing mode.",
        },
        {
          $: {
            name: 'row-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Same as 'row', except the main-start and main-end directions are swapped.",
        },
      ],
    },
  },
  {
    $: {
      name: 'flex-flow',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF28,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex-flow',
      syntax: 'div { $(name): column wrap; }',
    },
    desc: 'Specifies how flexbox items are placed in the flexbox.',
    values: {
      value: [
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The flex container's main axis has the same orientation as the block axis of the current writing mode.",
        },
        {
          $: {
            name: 'column-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Same as 'column', except the main-start and main-end directions are swapped.",
        },
        {
          $: {
            name: 'nowrap',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The flex container is single-line.',
        },
        {
          $: {
            name: 'row',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The flex container's main axis has the same orientation as the inline axis of the current writing mode.",
        },
        {
          $: {
            name: 'row-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Same as 'row', except the main-start and main-end directions are swapped.",
        },
        {
          $: {
            name: 'wrap',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The flexbox is multi-line.',
        },
        {
          $: {
            name: 'wrap-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
        },
      ],
    },
  },
  {
    $: {
      name: 'flex-grow',
      restriction: 'number',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex-grow',
      syntax: 'p { $(name): 4; }',
    },
    desc: 'Sets the flex grow factor. Negative numbers are invalid.',
  },
  {
    $: {
      name: 'flex-shrink',
      restriction: 'number',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex-shrink',
      syntax: 'p { $(name): 4; }',
    },
    desc: 'Sets the flex shrink factor. Negative numbers are invalid.',
  },
  {
    $: {
      name: 'flex-wrap',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF28,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#flex-wrap',
      syntax: 'div { $(name): nowrap; }',
    },
    desc: 'Controls whether the flex container is single-line or multi-line, and the direction of the cross-axis, which determines the direction new lines are stacked in.',
    values: {
      value: [
        {
          $: {
            name: 'nowrap',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The flex container is single-line.',
        },
        {
          $: {
            name: 'wrap',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The flexbox is multi-line.',
        },
        {
          $: {
            name: 'wrap-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
        },
      ],
    },
  },
  {
    $: {
      name: 'float',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/CSS21/visuren.html#propdef-float',
      syntax: 'img { $(name): right; }',
    },
    desc: 'Specifies how a box should be floated. It may be set for any element, but only applies to elements that generate boxes that are not absolutely positioned.',
    values: {
      value: [
        {
          $: {
            name: 'inline-end',
            version: '3.0',
            browsers: 'FF55',
          },
          desc: 'A keyword indicating that the element must float on the end side of its containing block. That is the right side with ltr scripts, and the left side with rtl scripts.',
        },
        {
          $: {
            name: 'inline-start',
            version: '3.0',
            browsers: 'FF55',
          },
          desc: 'A keyword indicating that the element must float on the start side of its containing block. That is the left side with ltr scripts, and the right side with rtl scripts.',
        },
        {
          $: {
            name: 'left',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The element generates a block box that is floated to the left. Content flows on the right side of the box, starting at the top (subject to the 'clear' property).",
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The box is not floated.',
        },
        {
          $: {
            name: 'right',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Similar to 'left', except the box is floated to the right, and content flows on the left side of the box, starting at the top.",
        },
      ],
    },
  },
  {
    $: {
      name: 'flood-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'E,C5,FF3,IE10,O9,S6',
      ref: 'http://www.w3.org/TR/filter-effects/#FloodColorProperty',
    },
    desc: 'Indicates what color to use to flood the current filter primitive subregion.',
  },
  {
    $: {
      name: 'flood-opacity',
      restriction: 'number(0-1), percentage',
      version: '3.0',
      browsers: 'E,C5,FF3,IE10,O9,S6',
      ref: 'http://www.w3.org/TR/filter-effects/#FloodOpacityProperty',
    },
    desc: 'Indicates what opacity to use to flood the current filter primitive subregion.',
  },
  {
    $: {
      name: 'font',
      restriction: 'font',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font',
      syntax: 'body { $(name): bold 12px arial, verdana; }',
    },
    desc: "Shorthand property for setting 'font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', and 'font-family', at the same place in the style sheet. The syntax of this property is based on a traditional typographical shorthand notation to set multiple properties related to fonts.",
    values: {
      value: [
        {
          $: {
            name: '100',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Thin',
        },
        {
          $: {
            name: '200',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Extra Light (Ultra Light)',
        },
        {
          $: {
            name: '300',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Light',
        },
        {
          $: {
            name: '400',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Normal',
        },
        {
          $: {
            name: '500',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Medium',
        },
        {
          $: {
            name: '600',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Semi Bold (Demi Bold)',
        },
        {
          $: {
            name: '700',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Bold',
        },
        {
          $: {
            name: '800',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Extra Bold (Ultra Bold)',
        },
        {
          $: {
            name: '900',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Black (Heavy)',
        },
        {
          $: {
            name: 'bold',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Same as 700',
        },
        {
          $: {
            name: 'bolder',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies the weight of the face bolder than the inherited value.',
        },
        {
          $: {
            name: 'caption',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The font used for captioned controls (e.g., buttons, drop-downs, etc.).',
        },
        {
          $: {
            name: 'icon',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The font used to label icons.',
        },
        {
          $: {
            name: 'italic',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Selects a font that is labeled 'italic', or, if that is not available, one labeled 'oblique'.",
        },
        {
          $: {
            name: 'large',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'larger',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'lighter',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies the weight of the face lighter than the inherited value.',
        },
        {
          $: {
            name: 'medium',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menu',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The font used in menus (e.g., dropdown menus and menu lists).',
        },
        {
          $: {
            name: 'message-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The font used in dialog boxes.',
        },
        {
          $: {
            name: 'normal',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies a face that is not labeled as a small-caps font.',
        },
        {
          $: {
            name: 'oblique',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Selects a font that is labeled 'oblique'.",
        },
        {
          $: {
            name: 'small',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'small-caps',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font.',
        },
        {
          $: {
            name: 'small-caption',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The font used for labeling small controls.',
        },
        {
          $: {
            name: 'smaller',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'status-bar',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The font used in window status bars.',
        },
        {
          $: {
            name: 'x-large',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'x-small',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'xx-large',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'xx-small',
            version: '1.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'font-family',
      restriction: 'font',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-family0',
      syntax: 'body { $(name): arial, verdana; }',
    },
    desc: 'Specifies a prioritized list of font family names or generic family names. A user agent iterates through the list of family names until it matches an available font that contains a glyph for the character to be rendered.',
    values: {
      value: [
        {
          $: {
            name: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'Arial, Helvetica, sans-serif',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Courier New', Courier, monospace",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'cursive',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'fantasy',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "Georgia, 'Times New Roman', Times, serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'monospace',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'sans-serif',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'serif',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Times New Roman', Times, serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'Verdana, Geneva, Tahoma, sans-serif',
            version: '1.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'font-feature-settings',
      restriction: 'string, integer',
      version: '3.0',
      browsers: 'E,FF34,IE10',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-feature-settings',
      syntax: "body { $(name): 'hwid'; }",
    },
    desc: 'Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.',
    values: {
      value: [
        {
          $: {
            name: '"aalt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Access All Alternates.',
        },
        {
          $: {
            name: '"abvf"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Above-base Forms. Required in Khmer script.',
        },
        {
          $: {
            name: '"abvm"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Above-base Mark Positioning. Required in Indic scripts.',
        },
        {
          $: {
            name: '"abvs"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Above-base Substitutions. Required in Indic scripts.',
        },
        {
          $: {
            name: '"afrc"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alternative Fractions.',
        },
        {
          $: {
            name: '"akhn"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Akhand. Required in most Indic scripts.',
        },
        {
          $: {
            name: '"blwf"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Below-base Form. Required in a number of Indic scripts.',
        },
        {
          $: {
            name: '"blwm"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Below-base Mark Positioning. Required in Indic scripts.',
        },
        {
          $: {
            name: '"blws"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Below-base Substitutions. Required in Indic scripts.',
        },
        {
          $: {
            name: '"calt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Contextual Alternates.',
        },
        {
          $: {
            name: '"case"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Case-Sensitive Forms. Applies only to European scripts; particularly prominent in Spanish-language setting.',
        },
        {
          $: {
            name: '"ccmp"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Glyph Composition/Decomposition.',
        },
        {
          $: {
            name: '"cfar"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Conjunct Form After Ro. Required in Khmer scripts.',
        },
        {
          $: {
            name: '"cjct"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Conjunct Forms. Required in Indic scripts that show similarity to Devanagari.',
        },
        {
          $: {
            name: '"clig"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Contextual Ligatures.',
        },
        {
          $: {
            name: '"cpct"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Centered CJK Punctuation. Used primarily in Chinese fonts.',
        },
        {
          $: {
            name: '"cpsp"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Capital Spacing. Should not be used in connecting scripts (e.g. most Arabic).',
        },
        {
          $: {
            name: '"cswh"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Contextual Swash.',
        },
        {
          $: {
            name: '"curs"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Cursive Positioning. Can be used in any cursive script.',
        },
        {
          $: {
            name: '"c2pc"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Petite Capitals From Capitals. Applies only to bicameral scripts.',
        },
        {
          $: {
            name: '"c2sc"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Small Capitals From Capitals. Applies only to bicameral scripts.',
        },
        {
          $: {
            name: '"dist"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Distances. Required in Indic scripts.',
        },
        {
          $: {
            name: '"dlig"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Discretionary ligatures.',
        },
        {
          $: {
            name: '"dnom"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Denominators.',
        },
        {
          $: {
            name: '"dtls"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Dotless Forms. Applied to math formula layout.',
        },
        {
          $: {
            name: '"expt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Expert Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"falt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Final Glyph on Line Alternates. Can be used in any cursive script.',
        },
        {
          $: {
            name: '"fin2"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Terminal Form #2. Used only with the Syriac script.',
        },
        {
          $: {
            name: '"fin3"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Terminal Form #3. Used only with the Syriac script.',
        },
        {
          $: {
            name: '"fina"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Terminal Forms. Can be used in any alphabetic script.',
        },
        {
          $: {
            name: '"flac"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Flattened ascent forms. Applied to math formula layout.',
        },
        {
          $: {
            name: '"frac"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Fractions.',
        },
        {
          $: {
            name: '"fwid"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Full Widths. Applies to any script which can use monospaced forms.',
        },
        {
          $: {
            name: '"half"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Half Forms. Required in Indic scripts that show similarity to Devanagari.',
        },
        {
          $: {
            name: '"haln"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Halant Forms. Required in Indic scripts.',
        },
        {
          $: {
            name: '"halt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alternate Half Widths. Used only in CJKV fonts.',
        },
        {
          $: {
            name: '"hist"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Historical Forms.',
        },
        {
          $: {
            name: '"hkna"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Horizontal Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).',
        },
        {
          $: {
            name: '"hlig"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Historical Ligatures.',
        },
        {
          $: {
            name: '"hngl"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Hangul. Korean only.',
        },
        {
          $: {
            name: '"hojo"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Hojo Kanji Forms (JIS X 0212-1990 Kanji Forms). Used only with Kanji script.',
        },
        {
          $: {
            name: '"hwid"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Half Widths. Generally used only in CJKV fonts.',
        },
        {
          $: {
            name: '"init"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Initial Forms. Can be used in any alphabetic script.',
        },
        {
          $: {
            name: '"isol"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Isolated Forms. Can be used in any cursive script.',
        },
        {
          $: {
            name: '"ital"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Italics. Applies mostly to Latin; note that many non-Latin fonts contain Latin as well.',
        },
        {
          $: {
            name: '"jalt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Justification Alternates. Can be used in any cursive script.',
        },
        {
          $: {
            name: '"jp78"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'JIS78 Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"jp83"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'JIS83 Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"jp90"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'JIS90 Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"jp04"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'JIS2004 Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"kern"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Kerning.',
        },
        {
          $: {
            name: '"lfbd"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Left Bounds.',
        },
        {
          $: {
            name: '"liga"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Standard Ligatures.',
        },
        {
          $: {
            name: '"ljmo"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Leading Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.',
        },
        {
          $: {
            name: '"lnum"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lining Figures.',
        },
        {
          $: {
            name: '"locl"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Localized Forms.',
        },
        {
          $: {
            name: '"ltra"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Left-to-right glyph alternates.',
        },
        {
          $: {
            name: '"ltrm"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Left-to-right mirrored forms.',
        },
        {
          $: {
            name: '"mark"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Mark Positioning.',
        },
        {
          $: {
            name: '"med2"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Medial Form #2. Used only with the Syriac script.',
        },
        {
          $: {
            name: '"medi"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Medial Forms.',
        },
        {
          $: {
            name: '"mgrk"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Mathematical Greek.',
        },
        {
          $: {
            name: '"mkmk"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Mark to Mark Positioning.',
        },
        {
          $: {
            name: '"nalt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alternate Annotation Forms.',
        },
        {
          $: {
            name: '"nlck"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'NLC Kanji Forms. Used only with Kanji script.',
        },
        {
          $: {
            name: '"nukt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Nukta Forms. Required in Indic scripts..',
        },
        {
          $: {
            name: '"numr"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Numerators.',
        },
        {
          $: {
            name: '"onum"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Oldstyle Figures.',
        },
        {
          $: {
            name: '"opbd"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Optical Bounds.',
        },
        {
          $: {
            name: '"ordn"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ordinals. Applies mostly to Latin script.',
        },
        {
          $: {
            name: '"ornm"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ornaments.',
        },
        {
          $: {
            name: '"palt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Proportional Alternate Widths. Used mostly in CJKV fonts.',
        },
        {
          $: {
            name: '"pcap"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Petite Capitals.',
        },
        {
          $: {
            name: '"pkna"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Proportional Kana. Generally used only in Japanese fonts.',
        },
        {
          $: {
            name: '"pnum"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Proportional Figures.',
        },
        {
          $: {
            name: '"pref"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Pre-base Forms. Required in Khmer and Myanmar (Burmese) scripts and southern Indic scripts that may display a pre-base form of Ra.',
        },
        {
          $: {
            name: '"pres"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Pre-base Substitutions. Required in Indic scripts.',
        },
        {
          $: {
            name: '"pstf"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Post-base Forms. Required in scripts of south and southeast Asia that have post-base forms for consonants eg: Gurmukhi, Malayalam, Khmer.',
        },
        {
          $: {
            name: '"psts"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Post-base Substitutions.',
        },
        {
          $: {
            name: '"pwid"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Proportional Widths.',
        },
        {
          $: {
            name: '"qwid"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Quarter Widths. Generally used only in CJKV fonts.',
        },
        {
          $: {
            name: '"rand"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Randomize.',
        },
        {
          $: {
            name: '"rclt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Required Contextual Alternates. May apply to any script, but is especially important for many styles of Arabic.',
        },
        {
          $: {
            name: '"rlig"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Required Ligatures. Applies to Arabic and Syriac. May apply to some other scripts.',
        },
        {
          $: {
            name: '"rkrf"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Rakar Forms. Required in Devanagari and Gujarati scripts.',
        },
        {
          $: {
            name: '"rphf"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Reph Form. Required in Indic scripts. E.g. Devanagari, Kannada.',
        },
        {
          $: {
            name: '"rtbd"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Right Bounds.',
        },
        {
          $: {
            name: '"rtla"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Right-to-left alternates.',
        },
        {
          $: {
            name: '"rtlm"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Right-to-left mirrored forms.',
        },
        {
          $: {
            name: '"ruby"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ruby Notation Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"salt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Stylistic Alternates.',
        },
        {
          $: {
            name: '"sinf"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scientific Inferiors.',
        },
        {
          $: {
            name: '"size"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Optical size.',
        },
        {
          $: {
            name: '"smcp"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Small Capitals. Applies only to bicameral scripts.',
        },
        {
          $: {
            name: '"smpl"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Simplified Forms. Applies only to Chinese and Japanese.',
        },
        {
          $: {
            name: '"ssty"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Math script style alternates.',
        },
        {
          $: {
            name: '"stch"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Stretching Glyph Decomposition.',
        },
        {
          $: {
            name: '"subs"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Subscript.',
        },
        {
          $: {
            name: '"sups"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Superscript.',
        },
        {
          $: {
            name: '"swsh"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Swash. Does not apply to ideographic scripts.',
        },
        {
          $: {
            name: '"titl"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Titling.',
        },
        {
          $: {
            name: '"tjmo"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Trailing Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.',
        },
        {
          $: {
            name: '"tnam"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Traditional Name Forms. Applies only to Japanese.',
        },
        {
          $: {
            name: '"tnum"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Tabular Figures.',
        },
        {
          $: {
            name: '"trad"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Traditional Forms. Applies only to Chinese and Japanese.',
        },
        {
          $: {
            name: '"twid"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Third Widths. Generally used only in CJKV fonts.',
        },
        {
          $: {
            name: '"unic"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Unicase.',
        },
        {
          $: {
            name: '"valt"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alternate Vertical Metrics. Applies only to scripts with vertical writing modes.',
        },
        {
          $: {
            name: '"vatu"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Vattu Variants. Used for Indic scripts. E.g. Devanagari.',
        },
        {
          $: {
            name: '"vert"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Vertical Alternates. Applies only to scripts with vertical writing modes.',
        },
        {
          $: {
            name: '"vhal"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alternate Vertical Half Metrics. Used only in CJKV fonts.',
        },
        {
          $: {
            name: '"vjmo"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Vowel Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.',
        },
        {
          $: {
            name: '"vkna"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Vertical Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).',
        },
        {
          $: {
            name: '"vkrn"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Vertical Kerning.',
        },
        {
          $: {
            name: '"vpal"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Proportional Alternate Vertical Metrics. Used mostly in CJKV fonts.',
        },
        {
          $: {
            name: '"vrt2"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Vertical Alternates and Rotation. Applies only to scripts with vertical writing modes.',
        },
        {
          $: {
            name: '"zero"',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Slashed Zero.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No change in glyph substitution or positioning occurs.',
        },
        {
          $: {
            name: 'off',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Disable feature.',
        },
        {
          $: {
            name: 'on',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enable feature.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-kerning',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C33,FF34,O20',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-kerning',
      syntax: 'body { $(name): normal; }',
    },
    desc: 'Kerning is the contextual adjustment of inter-glyph spacing. This property controls metric kerning, kerning that utilizes adjustment data contained in the font.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies that kerning is applied at the discretion of the user agent.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies that kerning is not applied.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies that kerning is applied.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-language-override',
      restriction: 'string',
      version: '3.0',
      browsers: 'FF34',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-language-override-prop',
      syntax: "body { $(name): 'SRB'; }",
    },
    desc: "The value of 'normal' implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering.",
    values: {
      value: {
        $: {
          name: 'normal',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering.',
      },
    },
  },
  {
    $: {
      name: 'font-size',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-size-prop',
      syntax: 'div { $(name): 12px; }',
    },
    desc: 'Indicates the desired height of glyphs from the font. For scalable fonts, the font-size is a scale factor applied to the EM unit of the font. (Note that certain glyphs may bleed outside their EM box.) For non-scalable fonts, the font-size is converted into absolute units and matched against the declared font-size of the font, using the same absolute coordinate space for both of the matched values.',
    values: {
      value: [
        {
          $: {
            name: 'large',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'larger',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'medium',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'small',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'smaller',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'x-large',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'x-small',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'xx-large',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'xx-small',
            version: '1.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'font-size-adjust',
      restriction: 'number',
      version: '3.0',
      browsers: 'E,FF3,IE10',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-size-adjust',
      syntax: 'div { $(name): 0.58; }',
    },
    desc: 'Preserves the readability of text when font fallback occurs by adjusting the font-size so that the x-height is the same regardless of the font used.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: "Do not preserve the font's x-height.",
      },
    },
  },
  {
    $: {
      name: 'font-stretch',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,FF9,IE9',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-stretch0',
      syntax: 'div { $(name): expanded; }',
    },
    desc: 'Selects a normal, condensed, or expanded face from a font family.',
    values: {
      value: [
        {
          $: {
            name: 'condensed',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'expanded',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'extra-condensed',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'extra-expanded',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'narrower',
            version: '3.0',
            browsers: 'E,IE10',
          },
          desc: 'Indicates a narrower value relative to the width of the parent element.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'semi-condensed',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'semi-expanded',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'ultra-condensed',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'ultra-expanded',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'wider',
            version: '3.0',
            browsers: 'E,IE10',
          },
          desc: 'Indicates a wider value relative to the width of the parent element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-style',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-style0',
      syntax: 'body { $(name): italic; }',
    },
    desc: 'Allows italic or oblique faces to be selected. Italic forms are generally cursive in nature while oblique faces are typically sloped versions of the regular face.',
    values: {
      value: [
        {
          $: {
            name: 'italic',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Selects a font that is labeled as an 'italic' face, or an 'oblique' face if one is not",
        },
        {
          $: {
            name: 'normal',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Selects a face that is classified as 'normal'.",
        },
        {
          $: {
            name: 'oblique',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Selects a font that is labeled as an 'oblique' face, or an 'italic' face if one is not.",
        },
      ],
    },
  },
  {
    $: {
      name: 'font-synthesis',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF34,S9',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-synthesis',
      syntax: 'html:lang(ar) { $(name): none; }',
    },
    desc: 'Controls whether user agents are allowed to synthesize bold or oblique font faces when a font family lacks bold or italic faces.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Disallow all synthetic faces.',
        },
        {
          $: {
            name: 'style',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Allow synthetic italic faces.',
        },
        {
          $: {
            name: 'weight',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Allow synthetic bold faces.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-variant-prop',
      syntax: 'div { $(name): small-caps; }',
    },
    desc: 'Specifies variant representations of the font',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies a face that is not labeled as a small-caps font.',
        },
        {
          $: {
            name: 'small-caps',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant-alternates',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF34',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-variant-alternates',
      syntax: 'h2 { $(name): styleset(3,5); }',
    },
    desc: 'For any given character, fonts can provide a variety of alternate glyphs in addition to the default glyph for that character. This property provides control over the selection of these alternate glyphs.',
    values: {
      value: [
        {
          $: {
            name: 'annotation()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of alternate annotation forms.',
        },
        {
          $: {
            name: 'character-variant()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of specific character variants.',
        },
        {
          $: {
            name: 'historical-forms',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of historical forms.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'None of the features are enabled.',
        },
        {
          $: {
            name: 'ornaments()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables replacement of default glyphs with ornaments, if provided in the font.',
        },
        {
          $: {
            name: 'styleset()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display with stylistic sets.',
        },
        {
          $: {
            name: 'stylistic()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of stylistic alternates.',
        },
        {
          $: {
            name: 'swash()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of swash glyphs.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant-caps',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF34',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-variant-caps-prop',
      syntax: 'p { $(name): titling-caps; }',
    },
    desc: 'Specifies control over capitalized forms.',
    values: {
      value: [
        {
          $: {
            name: 'all-petite-caps',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of petite capitals for both upper and lowercase letters.',
        },
        {
          $: {
            name: 'all-small-caps',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of small capitals for both upper and lowercase letters.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'None of the features are enabled.',
        },
        {
          $: {
            name: 'petite-caps',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of petite capitals.',
        },
        {
          $: {
            name: 'small-caps',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of small capitals. Small-caps glyphs typically use the form of uppercase letters but are reduced to the size of lowercase letters.',
        },
        {
          $: {
            name: 'titling-caps',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of titling capitals.',
        },
        {
          $: {
            name: 'unicase',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of mixture of small capitals for uppercase letters with normal lowercase letters.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant-east-asian',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF34',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-variant-east-asian-prop',
      syntax: 'mark { $(name): normal; }',
    },
    desc: 'Allows control of glyph substitute and positioning in East Asian text.',
    values: {
      value: [
        {
          $: {
            name: 'full-width',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of full-width variants.',
        },
        {
          $: {
            name: 'jis04',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of JIS04 forms.',
        },
        {
          $: {
            name: 'jis78',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of JIS78 forms.',
        },
        {
          $: {
            name: 'jis83',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of JIS83 forms.',
        },
        {
          $: {
            name: 'jis90',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of JIS90 forms.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'None of the features are enabled.',
        },
        {
          $: {
            name: 'proportional-width',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of proportionally-spaced variants.',
        },
        {
          $: {
            name: 'ruby',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of ruby variant glyphs.',
        },
        {
          $: {
            name: 'simplified',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of simplified forms.',
        },
        {
          $: {
            name: 'traditional',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables rendering of traditional forms.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant-ligatures',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C18,FF34,O15,S6',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-variant-ligatures-prop',
      syntax: 'div { $(name): historical-ligatures; }',
    },
    desc: "Specifies control over which ligatures are enabled or disabled. A value of 'normal' implies that the defaults set by the font are used.",
    values: {
      value: [
        {
          $: {
            name: 'additional-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of additional ligatures.',
        },
        {
          $: {
            name: 'common-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of common ligatures.',
        },
        {
          $: {
            name: 'contextual',
            version: '3.0',
            browsers: 'C35,F34,O22',
          },
          desc: 'Enables display of contextual alternates.',
        },
        {
          $: {
            name: 'discretionary-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of discretionary ligatures.',
        },
        {
          $: {
            name: 'historical-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of historical ligatures.',
        },
        {
          $: {
            name: 'no-additional-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Disables display of additional ligatures.',
        },
        {
          $: {
            name: 'no-common-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Disables display of common ligatures.',
        },
        {
          $: {
            name: 'no-contextual',
            version: '3.0',
            browsers: 'C35,F34,O22',
          },
          desc: 'Disables display of contextual alternates.',
        },
        {
          $: {
            name: 'no-discretionary-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Disables display of discretionary ligatures.',
        },
        {
          $: {
            name: 'no-historical-ligatures',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Disables display of historical ligatures.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'FF34',
          },
          desc: 'Disables all ligatures.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Implies that the defaults set by the font are used.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant-numeric',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF34',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-variant-numeric-prop',
      syntax: '.amount { $(name): oldstyle-nums diagonal-fractions; }',
    },
    desc: 'Specifies control over numerical forms.',
    values: {
      value: [
        {
          $: {
            name: 'diagonal-fractions',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of lining diagonal fractions.',
        },
        {
          $: {
            name: 'lining-nums',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of lining numerals.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'None of the features are enabled.',
        },
        {
          $: {
            name: 'oldstyle-nums',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of old-style numerals.',
        },
        {
          $: {
            name: 'ordinal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of letter forms used with ordinal numbers.',
        },
        {
          $: {
            name: 'proportional-nums',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of proportional numerals.',
        },
        {
          $: {
            name: 'slashed-zero',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of slashed zeros.',
        },
        {
          $: {
            name: 'stacked-fractions',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of lining stacked fractions.',
        },
        {
          $: {
            name: 'tabular-nums',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of tabular numerals.',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-variant-position',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF34',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-variant-position',
      syntax: 'sub { $(name): subscript; }',
    },
    desc: 'Specifies the vertical position',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'None of the features are enabled.',
        },
        {
          $: {
            name: 'sub',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of subscript variants (OpenType feature: subs).',
        },
        {
          $: {
            name: 'super',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Enables display of superscript variants (OpenType feature: sups).',
        },
      ],
    },
  },
  {
    $: {
      name: 'font-weight',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#font-weight-the-font-weight-property',
      syntax: 'th { $(name): bold; }',
    },
    desc: 'Specifies weight of glyphs in the font, their degree of blackness or stroke thickness.',
    values: {
      value: [
        {
          $: {
            name: '100',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Thin',
        },
        {
          $: {
            name: '200',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Extra Light (Ultra Light)',
        },
        {
          $: {
            name: '300',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Light',
        },
        {
          $: {
            name: '400',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Normal',
        },
        {
          $: {
            name: '500',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Medium',
        },
        {
          $: {
            name: '600',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Semi Bold (Demi Bold)',
        },
        {
          $: {
            name: '700',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Bold',
        },
        {
          $: {
            name: '800',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Extra Bold (Ultra Bold)',
        },
        {
          $: {
            name: '900',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Black (Heavy)',
        },
        {
          $: {
            name: 'bold',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Same as 700',
        },
        {
          $: {
            name: 'bolder',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies the weight of the face bolder than the inherited value.',
        },
        {
          $: {
            name: 'lighter',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Specifies the weight of the face lighter than the inherited value.',
        },
        {
          $: {
            name: 'normal',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Same as 400',
        },
      ],
    },
  },
  {
    $: {
      name: 'glyph-orientation-horizontal',
      restriction: 'angle, number',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/text.html#GlyphOrientationHorizontal',
    },
    desc: 'Controls glyph orientation when the inline-progression-direction is horizontal.',
  },
  {
    $: {
      name: 'glyph-orientation-vertical',
      restriction: 'angle, number, enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/text.html#GlyphOrientationVertical',
    },
    desc: 'Controls glyph orientation when the inline-progression-direction is vertical.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Sets the orientation based on the fullwidth or non-fullwidth characters and the most common orientation.',
      },
    },
  },
  {
    $: {
      name: 'grid-area',
      restriction: 'identifier, integer',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-area',
      syntax: 'div { $(name): span 3; }',
    },
    desc: "Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement. Shorthand for 'grid-row-start', 'grid-column-start', 'grid-row-end', and 'grid-column-end'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid',
      restriction: 'identifier, length, percentage, string, enum',
      version: '3.0',
      browsers: 'FF52,C57,E16,S10.1,O44',
      ref: 'https://drafts.csswg.org/css-grid/#propdef-grid',
      syntax: 'div { $(name): span 3; }',
    },
    desc: "The grid CSS property is a shorthand property that sets all of the explicit grid properties ('grid-template-rows', 'grid-template-columns', and 'grid-template-areas'), and all the implicit grid properties ('grid-auto-rows', 'grid-auto-columns', and 'grid-auto-flow'), in a single declaration.",
  },
  {
    $: {
      name: 'grid-auto-columns',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-auto-columns',
      syntax: 'div { $(name): 100px; }',
    },
    desc: 'Specifies the size of implicitly created columns.',
    values: {
      value: [
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest min-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest max-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
        },
        {
          $: {
            name: 'minmax()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Defines a size range greater than or equal to min and less than or equal to max.',
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-auto-flow',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-auto-flow',
      syntax: 'div { $(name): column; }',
    },
    desc: 'Controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.',
    values: {
      value: [
        {
          $: {
            name: 'row',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The auto-placement algorithm places items by filling each row in turn, adding new rows as necessary.',
        },
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The auto-placement algorithm places items by filling each column in turn, adding new columns as necessary.',
        },
        {
          $: {
            name: 'dense',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If specified, the auto-placement algorithm uses a "dense" packing algorithm, which attempts to fill in holes earlier in the grid if smaller items come up later.',
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-auto-rows',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-auto-rows',
      syntax: 'div { $(name): 100px; }',
    },
    desc: 'Specifies the size of implicitly created rows.',
    values: {
      value: [
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest min-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest max-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
        },
        {
          $: {
            name: 'minmax()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Defines a size range greater than or equal to min and less than or equal to max.',
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-column',
      restriction: 'identifier, integer, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-column',
      syntax: '#item1 { $(name): span 2 / auto; }',
    },
    desc: "Shorthand for 'grid-column-start' and 'grid-column-end'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-column-end',
      restriction: 'identifier, integer, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-column-end',
      syntax: '#item1 { $(name): span 2; }',
    },
    desc: "Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-column-gap',
      restriction: 'length',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-column-gap',
      syntax: '#item1 { $(name): 2em; }',
    },
    desc: "Specifies the gutters between grid columns. Replaced by 'column-gap' property.",
  },
  {
    $: {
      name: 'grid-column-start',
      restriction: 'identifier, integer, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-column-start',
      syntax: '#item1 { $(name): span 2; }',
    },
    desc: "Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-gap',
      restriction: 'length',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-gap',
      syntax: '#item1 { $(name): 2em 1em; }',
    },
    desc: "Shorthand that specifies the gutters between grid columns and grid rows in one declaration. Replaced by 'gap' property.",
  },
  {
    $: {
      name: 'grid-row',
      restriction: 'identifier, integer, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-row',
      syntax: '#item1 { $(name): span 2 / auto; }',
    },
    desc: "Shorthand for 'grid-row-start' and 'grid-row-end'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-row-end',
      restriction: 'identifier, integer, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-row-end',
      syntax: '#item1 { $(name): span 2; }',
    },
    desc: "Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-row-gap',
      restriction: 'length',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-row-gap',
      syntax: '#item1 { $(name): 2em; }',
    },
    desc: "Specifies the gutters between grid rows. Replaced by 'row-gap' property.",
  },
  {
    $: {
      name: 'grid-row-start',
      restriction: 'identifier, integer, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-row-start',
      syntax: '#item1 { $(name): span 2; }',
    },
    desc: "Determine a grid item's size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of one.",
        },
        {
          $: {
            name: 'span',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is N lines from its opposite edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-template',
      restriction: 'identifier, length, percentage, string, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-template',
      syntax: '#item1 { $(name): auto 1fr auto / auto 1fr; }',
    },
    desc: 'Shorthand for setting grid-template-columns, grid-template-rows, and grid-template-areas in a single declaration.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Sets all three properties to their initial values.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest min-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest max-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
        },
        {
          $: {
            name: 'subgrid',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Sets 'grid-template-rows' and 'grid-template-columns' to 'subgrid', and 'grid-template-areas' to its initial value.",
        },
        {
          $: {
            name: 'minmax()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Defines a size range greater than or equal to min and less than or equal to max.',
        },
        {
          $: {
            name: 'repeat()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.',
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-template-areas',
      restriction: 'string',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-template-areas',
      syntax: "#item1 { $(name): 'head head' 'nav main' 'foot foot'; }",
    },
    desc: 'Specifies named grid areas, which are not associated with any particular grid item, but can be referenced from the grid-placement properties.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: "The grid container doesn't define any named grid areas.",
      },
    },
  },
  {
    $: {
      name: 'grid-template-columns',
      restriction: 'identifier, length, percentage, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-template-columns',
      syntax:
        '#item1 { $(name): 100px 1fr max-content minmax(min-content, 1fr); }',
    },
    desc: 'specifies, as a space-separated track list, the line names and track sizing functions of the grid.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'There is no explicit grid; any rows/columns will be implicitly generated.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest min-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest max-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
        },
        {
          $: {
            name: 'subgrid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the grid will align to its parent grid in that axis.',
        },
        {
          $: {
            name: 'minmax()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Defines a size range greater than or equal to min and less than or equal to max.',
        },
        {
          $: {
            name: 'repeat()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.',
        },
      ],
    },
  },
  {
    $: {
      name: 'grid-template-rows',
      restriction: 'identifier, length, percentage, string, enum',
      version: '3.0',
      browsers: 'FF52,C57,S10.1,O44',
      ref: 'http://www.w3.org/TR/css-grid-1/#propdef-grid-template-rows',
      syntax:
        '#item1 { $(name): 100px 1fr max-content minmax(min-content, 1fr); }',
    },
    desc: 'specifies, as a space-separated track list, the line names and track sizing functions of the grid.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'There is no explicit grid; any rows/columns will be implicitly generated.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest min-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents the largest max-content contribution of the grid items occupying the grid track.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.",
        },
        {
          $: {
            name: 'subgrid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the grid will align to its parent grid in that axis.',
        },
        {
          $: {
            name: 'minmax()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Defines a size range greater than or equal to min and less than or equal to max.',
        },
        {
          $: {
            name: 'repeat()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form.',
        },
      ],
    },
  },
  {
    $: {
      name: 'height',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#height',
      syntax: 'footer { $(name): 100px; }',
    },
    desc: "Specifies the height of the content area, padding area or border area (depending on 'box-sizing') of certain boxes.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The height depends on the values of other properties.',
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the max-content inline size or max-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the min-content inline size or min-content block size, as appropriate to the writing mode.',
        },
      ],
    },
  },
  {
    $: {
      name: 'hyphens',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C55,FF43,O44',
      ref: 'http://www.w3.org/TR/css-text-3/#hyphens-property',
      syntax: 'div { $(name): manual; }',
    },
    desc: 'Controls whether hyphenation is allowed to create more break opportunities within a line of text.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.',
        },
        {
          $: {
            name: 'manual',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Words are not broken at line breaks, even if characters inside the word suggest line break points.',
        },
      ],
    },
  },
  {
    $: {
      name: 'image-orientation',
      restriction: 'angle',
      version: '3.0',
      browsers: 'FF26',
      ref: 'http://www.w3.org/TR/css4-images/#image-orientation',
      syntax: 'img.ninety { $(name): 90deg; }',
    },
    desc: 'Specifies an orthogonal rotation to be applied to an image before it is laid out.',
    values: {
      value: [
        {
          $: {
            name: 'flip',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'After rotating by the precededing angle, the image is flipped horizontally. Defaults to 0deg if the angle is ommitted.',
        },
        {
          $: {
            name: 'from-image',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the image has an orientation specified in its metadata, such as EXIF, this value computes to the angle that the metadata specifies is necessary to correctly orient the image.',
        },
      ],
    },
  },
  {
    $: {
      name: 'image-rendering',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,FF3.6,O11.6,S',
      ref: 'https://drafts.csswg.org/css-images-3/#the-image-rendering',
    },
    desc: 'Provides a hint to the user-agent about what aspects of an image are most important to preserve when the image is scaled, to aid the user-agent in the choice of an appropriate scaling algorithm.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image should be scaled with an algorithm that maximizes the appearance of the image.',
        },
        {
          $: {
            name: 'crisp-edges',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image must be scaled with an algorithm that preserves contrast and edges in the image, and which does not smooth colors or introduce blur to the image in the process.',
        },
        {
          $: {
            name: '-moz-crisp-edges',
            version: '3.0',
            browsers: 'FF',
          },
        },
        {
          $: {
            name: 'optimizeQuality',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Deprecated.',
        },
        {
          $: {
            name: 'optimizeSpeed',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Deprecated.',
        },
        {
          $: {
            name: 'pixelated',
            version: '3.0',
            browsers: 'all',
          },
          desc: "When scaling the image up, the 'nearest neighbor' or similar algorithm must be used, so that the image appears to be simply composed of very large pixels.",
        },
      ],
    },
  },
  {
    $: {
      name: 'ime-mode',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,FF3,IE5',
      ref: 'http://www.w3.org/TR/css3-ui/#ime-mode',
      syntax: 'body { $(name): active; }',
    },
    desc: 'Controls the state of the input method editor for text fields.',
    values: {
      value: [
        {
          $: {
            name: 'active',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The input method editor is initially active; text entry is performed using it unless the user specifically dismisses it.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No change is made to the current input method editor state. This is the default.',
        },
        {
          $: {
            name: 'disabled',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The input method editor is disabled and may not be activated by the user.',
        },
        {
          $: {
            name: 'inactive',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The input method editor is initially inactive, but the user may activate it if they wish.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The IME state should be normal; this value can be used in a user style sheet to override the page setting.',
        },
      ],
    },
  },
  {
    $: {
      name: 'inline-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#propdef-inline-size',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Size of an element in the direction specified by 'writing-mode'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: 'isolation',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,FF,O,S',
      ref: 'http://www.w3.org/TR/compositing-1/#isolation',
      syntax: 'div { $(name): isolate; }',
    },
    desc: "In CSS setting to 'isolate' will turn the element into a stacking context. In SVG, it defines whether an element is isolated or not.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Elements are not isolated unless an operation is applied that causes the creation of a stacking context.',
        },
        {
          $: {
            name: 'isolate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'In CSS will turn the element into a stacking context.',
        },
      ],
    },
  },
  {
    $: {
      name: 'justify-content',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#align-content',
      syntax: 'p { $(name): flex-start; }',
    },
    desc: 'Aligns flex items along the main axis of the current line of the flex container.',
    values: {
      value: [
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Flex items are packed toward the center of the line.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are packed flush to each other toward the start edge of the alignment container in the main axis.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are packed flush to each other toward the end edge of the alignment container in the main axis.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are packed flush to each other toward the left edge of the alignment container in the main axis.',
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are packed flush to each other toward the right edge of the alignment container in the main axis.',
        },
        {
          $: {
            name: 'safe',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the size of the item overflows the alignment container, the item is instead aligned as if the alignment mode were start.',
        },
        {
          $: {
            name: 'unsafe',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Regardless of the relative sizes of the item and alignment container, the given alignment value is honored.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the combined size of the alignment subjects is less than the size of the alignment container, any auto-sized alignment subjects have their size increased equally (not proportionally), while still respecting the constraints imposed by max-height/max-width (or equivalent functionality), so that the combined size exactly fills the alignment container.',
        },
        {
          $: {
            name: 'space-evenly',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The items are evenly distributed within the alignment container along the main axis.',
        },
        {
          $: {
            name: 'flex-end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Flex items are packed toward the end of the line.',
        },
        {
          $: {
            name: 'flex-start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Flex items are packed toward the start of the line.',
        },
        {
          $: {
            name: 'space-around',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Flex items are evenly distributed in the line, with half-size spaces on either end.',
        },
        {
          $: {
            name: 'space-between',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Flex items are evenly distributed in the line.',
        },
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies participation in first-baseline alignment.',
        },
        {
          $: {
            name: 'first baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies participation in first-baseline alignment.',
        },
        {
          $: {
            name: 'last baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies participation in last-baseline alignment.',
        },
      ],
    },
  },
  {
    $: {
      name: 'kerning',
      restriction: 'length, enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG11/text.html#KerningProperty',
    },
    desc: 'Indicates whether the user agent should adjust inter-glyph spacing based on kerning tables that are included in the relevant font or instead disable auto-kerning and set inter-character spacing to a specific length.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Indicates that the user agent should adjust inter-glyph spacing based on kerning tables that are included in the font that will be used.',
      },
    },
  },
  {
    $: {
      name: 'left',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-positioning/#propdef-left',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Specifies how far an absolutely positioned box's left margin edge is offset to the right of the left edge of the box's 'containing block'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '2.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
      },
    },
  },
  {
    $: {
      name: 'letter-spacing',
      restriction: 'length',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-text/#letter-spacing0',
      syntax: 'h2 { $(name): 2px; }',
    },
    desc: 'Specifies the minimum, maximum, and optimal spacing between grapheme clusters.',
    values: {
      value: {
        $: {
          name: 'normal',
          version: '1.0',
          browsers: 'all',
        },
        desc: 'The spacing is the normal spacing for the current font. It is typically zero-length.',
      },
    },
  },
  {
    $: {
      name: 'lighting-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'E,C5,FF3,IE10,O9,S6',
      ref: 'http://www.w3.org/TR/filter-effects/#LightingColorProperty',
    },
    desc: "Defines the color of the light source for filter primitives 'feDiffuseLighting' and 'feSpecularLighting'.",
  },
  {
    $: {
      name: 'line-break',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,IE5.5,C58,O45,S',
      ref: 'http://www.w3.org/TR/css3-text/#line-break0',
      syntax: 'p { $(name): normal; }',
    },
    desc: 'Specifies what set of line breaking restrictions are in effect within the element.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The UA determines the set of line-breaking restrictions to use for CJK scripts, and it may vary the restrictions based on the length of the line; e.g., use a less restrictive set of line-break rules for short lines.',
        },
        {
          $: {
            name: 'loose',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Breaks text using the least restrictive set of line-breaking rules. Typically used for short lines, such as in newspapers.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Breaks text using the most common set of line-breaking rules.',
        },
        {
          $: {
            name: 'strict',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Breaks CJK scripts using a more restrictive set of line-breaking rules than 'normal'.",
        },
        {
          $: {
            name: 'anywhere',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'There is a soft wrap opportunity around every typographic character unit, including around any punctuation character or preserved white spaces, or in the middle of words, disregarding any prohibition against line breaks, even those introduced by characters with the GL, WJ, or ZWJ line breaking classes or mandated by the word-break property.',
        },
      ],
    },
  },
  {
    $: {
      name: 'line-height',
      restriction: 'number, length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-linebox/#line-height',
      syntax: '#menu { $(name): 22px; }',
    },
    desc: 'Determines the block-progression dimension of the text content area of an inline box.',
    values: {
      value: {
        $: {
          name: 'normal',
          version: '1.0',
          browsers: 'all',
        },
        desc: "Tells user agents to set the computed value to a 'reasonable' value based on the font size of the element.",
      },
    },
  },
  {
    $: {
      name: 'list-style',
      restriction: 'image, enum, url',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-lists/#list-style',
      syntax: "ul { $(name): square url('square.png');}",
    },
    desc: "Shorthand for setting 'list-style-type', 'list-style-position' and 'list-style-image'",
    values: {
      value: [
        {
          $: {
            name: 'armenian',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'circle',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'A hollow circle.',
        },
        {
          $: {
            name: 'decimal',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'decimal-leading-zero',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'disc',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'A filled circle.',
        },
        {
          $: {
            name: 'georgian',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'hanging',
            version: '1.0',
            browsers: 'none',
          },
          desc: "As 'inside', except the marker is instead placed immediately before the first text or significant whitespace in the list item or its children",
        },
        {
          $: {
            name: 'inside',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.',
        },
        {
          $: {
            name: 'lower-alpha',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'lower-greek',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'lower-latin',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'lower-roman',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'outside',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.",
        },
        {
          $: {
            name: 'square',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'A filled square.',
        },
        {
          $: {
            name: 'symbols()',
            version: '3.0',
            browsers: 'FF35',
          },
          desc: 'Allows a counter style to be defined inline.',
        },
        {
          $: {
            name: 'upper-alpha',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'upper-latin',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'upper-roman',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'url()',
            version: '1.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'list-style-image',
      restriction: 'image',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-lists/#list-style-image',
      syntax: '<uri> | none',
    },
    desc: "Sets the image that will be used as the list item marker. When the image is available, it will replace the marker set with the 'list-style-type' marker.",
    values: {
      value: {
        $: {
          name: 'none',
          version: '1.0',
          browsers: 'all',
        },
        desc: "The default contents of the of the list item's marker are given by 'list-style-type' instead.",
      },
    },
  },
  {
    $: {
      name: 'list-style-position',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-lists/#list-style-position',
      syntax: 'ul { $(name): inside; }',
    },
    desc: "Specifies the position of the '::marker' pseudo-element's box in the list item.",
    values: {
      value: [
        {
          $: {
            name: 'inside',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.',
        },
        {
          $: {
            name: 'outside',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.",
        },
      ],
    },
  },
  {
    $: {
      name: 'list-style-type',
      restriction: 'enum, string',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-lists/#list-style-type',
      syntax:
        '<glyph> | <algorithmic> | <numeric> | <alphabetic> | <symbolic> | <non-repeating> | normal | none',
    },
    desc: "Used to construct the default contents of a list item's marker",
    values: {
      value: [
        {
          $: {
            name: 'arabic-indic',
            version: '3',
            browsers: 'none',
          },
          desc: 'Arabic-indic numbering.',
        },
        {
          $: {
            name: 'armenian',
            version: '2.1',
            browsers: 'all',
          },
          desc: 'Traditional uppercase Armenian numbering.',
        },
        {
          $: {
            name: 'bengali',
            version: '4',
            browsers: 'none',
          },
          desc: 'Bengali numbering.',
        },
        {
          $: {
            name: 'cambodian',
            version: '4',
            browsers: 'none',
          },
          desc: 'Cambodian/Khmer numbering.',
        },
        {
          $: {
            name: 'circle',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'A hollow circle.',
        },
        {
          $: {
            name: 'cjk-decimal',
            version: '4',
            browsers: 'none',
          },
          desc: 'Han decimal numbers.',
        },
        {
          $: {
            name: 'cjk-earthly-branch',
            version: '4',
            browsers: 'none',
          },
          desc: 'Han "Earthly Branch" ordinals.',
        },
        {
          $: {
            name: 'cjk-heavenly-stem',
            version: '4',
            browsers: 'none',
          },
          desc: 'Han "Heavenly Stem" ordinals.',
        },
        {
          $: {
            name: 'decimal',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Western decimal numbers.',
        },
        {
          $: {
            name: 'decimal-leading-zero',
            version: '2.1',
            browsers: 'all',
          },
          desc: 'Decimal numbers padded by initial zeros.',
        },
        {
          $: {
            name: 'devanagari',
            version: '4',
            browsers: 'none',
          },
          desc: 'Devanagari numbering.',
        },
        {
          $: {
            name: 'disc',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'A filled circle.',
        },
        {
          $: {
            name: 'disclosure-closed',
            version: '4',
            browsers: 'none',
          },
          desc: 'Symbols appropriate for indicating a closed disclosure widget.',
        },
        {
          $: {
            name: 'disclosure-open',
            version: '4',
            browsers: 'none',
          },
          desc: 'Symbols appropriate for indicating an open disclosure widget.',
        },
        {
          $: {
            name: 'georgian',
            version: '2.1',
            browsers: 'all',
          },
          desc: 'Traditional Georgian numbering.',
        },
        {
          $: {
            name: 'gujarati',
            version: '4',
            browsers: 'none',
          },
          desc: 'Gujarati numbering.',
        },
        {
          $: {
            name: 'gurmukhi',
            version: '4',
            browsers: 'none',
          },
          desc: 'Gurmukhi numbering.',
        },
        {
          $: {
            name: 'hebrew',
            version: '4',
            browsers: 'none',
          },
          desc: 'Traditional Hebrew numbering.',
        },
        {
          $: {
            name: 'hiragana',
            version: '4',
            browsers: 'none',
          },
          desc: 'Dictionary-order hiragana lettering',
        },
        {
          $: {
            name: 'hiragana-iroha',
            version: '4',
            browsers: 'none',
          },
          desc: 'Iroha-order hiragana lettering',
        },
        {
          $: {
            name: 'kannada',
            version: '4',
            browsers: 'none',
          },
          desc: 'Kannada numbering.',
        },
        {
          $: {
            name: 'katakana',
            version: '4',
            browsers: 'none',
          },
          desc: 'Dictionary-order katakana lettering',
        },
        {
          $: {
            name: 'katakana-iroha',
            version: '4',
            browsers: 'none',
          },
          desc: 'Iroha-order katakana lettering',
        },
        {
          $: {
            name: 'khmer',
            version: '4',
            browsers: 'none',
          },
          desc: 'Cambodian/Khmer numbering.',
        },
        {
          $: {
            name: 'lao',
            version: '4',
            browsers: 'none',
          },
          desc: 'Laotian numbering.',
        },
        {
          $: {
            name: 'lower-alpha',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Lowercase ASCII letters.',
        },
        {
          $: {
            name: 'lower-armenian',
            version: '4',
            browsers: 'none',
          },
          desc: 'Lowercase Armenian numbering.',
        },
        {
          $: {
            name: 'lower-greek',
            version: '2.1',
            browsers: 'all',
          },
          desc: 'Lowercase classical Greek.',
        },
        {
          $: {
            name: 'lower-latin',
            version: '2.1',
            browsers: 'all',
          },
          desc: 'Lowercase ASCII letters.',
        },
        {
          $: {
            name: 'lower-roman',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Lowercase ASCII Roman numerals.',
        },
        {
          $: {
            name: 'malayalam',
            version: '4',
            browsers: 'none',
          },
          desc: 'Malayalam numbering.',
        },
        {
          $: {
            name: 'mongolian',
            version: '4',
            browsers: 'none',
          },
          desc: 'Mongolian numbering.',
        },
        {
          $: {
            name: 'myanmar',
            version: '4',
            browsers: 'none',
          },
          desc: 'Myanmar (Burmese) numbering.',
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'No marker',
        },
        {
          $: {
            name: 'oriya',
            version: '4',
            browsers: 'none',
          },
          desc: 'Oriya numbering.',
        },
        {
          $: {
            name: 'persian',
            version: '4',
            browsers: 'none',
          },
          desc: 'Persian numbering.',
        },
        {
          $: {
            name: 'square',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'A filled square.',
        },
        {
          $: {
            name: 'tamil',
            version: '4',
            browsers: 'none',
          },
          desc: 'Tamil numbering.',
        },
        {
          $: {
            name: 'telugu',
            version: '4',
            browsers: 'none',
          },
          desc: 'Telugu numbering.',
        },
        {
          $: {
            name: 'thai',
            version: '4',
            browsers: 'none',
          },
          desc: 'Thai (Siamese) numbering.',
        },
        {
          $: {
            name: 'tibetan',
            version: '4',
            browsers: 'none',
          },
          desc: 'Tibetan numbering.',
        },
        {
          $: {
            name: 'symbols()',
            version: '3.0',
            browsers: 'FF35',
          },
          desc: 'Allows a counter style to be defined inline.',
        },
        {
          $: {
            name: 'upper-alpha',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Uppercase ASCII letters.',
        },
        {
          $: {
            name: 'upper-armenian',
            version: '4',
            browsers: 'none',
          },
          desc: 'Traditional uppercase Armenian numbering.',
        },
        {
          $: {
            name: 'upper-latin',
            version: '2.1',
            browsers: 'all',
          },
          desc: 'Uppercase ASCII letters.',
        },
        {
          $: {
            name: 'upper-roman',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Uppercase ASCII Roman numerals.',
        },
      ],
    },
  },
  {
    $: {
      name: 'margin',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#margin1',
      syntax: 'div { $(name): 4px 7px 2px 4px; }',
    },
    desc: 'Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '1.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'logical',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Indicates that the values map to the logical properties instead of the physical ones.',
        },
      ],
    },
  },
  {
    $: {
      name: 'margin-block-end',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'div { $(name): 4px; }',
    },
    desc: "Logical 'margin-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-block-start',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'div { $(name): 4px; }',
    },
    desc: "Logical 'margin-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-bottom',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#margin1',
      syntax: 'div { $(name): 4px; }',
    },
    desc: 'Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-inline-end',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'div { $(name): 4px; }',
    },
    desc: "Logical 'margin-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-inline-start',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'div { $(name): 4px; }',
    },
    desc: "Logical 'margin-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-left',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#margin1',
      syntax: 'div { $(name): 4px; }',
    },
    desc: 'Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-right',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#margin1',
      syntax: 'div { $(name): 4px; }',
    },
    desc: 'Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'margin-top',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#margin1',
      syntax: 'div { $(name): 4px; }',
    },
    desc: 'Shorthand property to set values for the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '1.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: 'marker',
      restriction: 'url',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#MarkerProperty',
    },
    desc: "Specifies the marker symbol that shall be used for all points on the sets the value for all vertices on the given 'path' element or basic shape.",
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that no marker symbol will be drawn at the given vertex or vertices.',
        },
        {
          $: {
            name: 'child',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'Indicates that the last child <marker> element of the element where the property is specified will be used.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the <marker> element referenced will be used.',
        },
      ],
    },
  },
  {
    $: {
      name: 'marker-end',
      restriction: 'url',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#VertexMarkerProperties',
    },
    desc: 'Specifies the marker that will be drawn at the last vertices of the given markable element.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that no marker symbol will be drawn at the given vertex or vertices.',
        },
        {
          $: {
            name: 'child',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'Indicates that the last child <marker> element of the element where the property is specified will be used.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the <marker> element referenced will be used.',
        },
      ],
    },
  },
  {
    $: {
      name: 'marker-mid',
      restriction: 'url',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#VertexMarkerProperties',
    },
    desc: 'Specifies the marker that will be drawn at all vertices except the first and last.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that no marker symbol will be drawn at the given vertex or vertices.',
        },
        {
          $: {
            name: 'child',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'Indicates that the last child <marker> element of the element where the property is specified will be used.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the <marker> element referenced will be used.',
        },
      ],
    },
  },
  {
    $: {
      name: 'marker-start',
      restriction: 'url',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#VertexMarkerProperties',
    },
    desc: 'Specifies the marker that will be drawn at the first vertices of the given markable element.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that no marker symbol will be drawn at the given vertex or vertices.',
        },
        {
          $: {
            name: 'child',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'Indicates that the last child <marker> element of the element where the property is specified will be used.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the <marker> element referenced will be used.',
        },
      ],
    },
  },
  {
    $: {
      name: 'mask-image',
      restriction: 'url, image, enum',
      version: '3.0',
      browsers: 'E,FF53',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-image',
    },
    desc: 'Sets the mask layer image of an element.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Counts as a transparent black image layer.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Reference to a <mask element or to a CSS image.',
        },
      ],
    },
  },
  {
    $: {
      name: 'mask-mode',
      restriction: 'url, image, enum',
      version: '3.0',
      browsers: 'FF53',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-mode',
    },
    desc: 'Indicates whether the mask layer image is treated as luminance mask or alpha mask.',
    values: {
      value: [
        {
          $: {
            name: 'alpha',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alpha values of the mask layer image should be used as the mask values.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Use alpha values if 'mask-image' is an image, luminance if a <mask> element or a CSS image.",
        },
        {
          $: {
            name: 'luminance',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Luminance values of the mask layer image should be used as the mask values.',
        },
      ],
    },
  },
  {
    $: {
      name: 'mask-origin',
      restriction: 'geometry-box, enum',
      version: '3.0',
      browsers: 'FF53',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-origin',
    },
    desc: 'Specifies the mask positioning area.',
  },
  {
    $: {
      name: 'mask-position',
      restriction: 'position, length, percentage',
      version: '3.0',
      browsers: 'FF53',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-position',
    },
    desc: 'Specifies how mask layer images are positioned.',
  },
  {
    $: {
      name: 'mask-repeat',
      restriction: 'repeat',
      version: '3.0',
      browsers: 'FF53',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-repeat',
    },
    desc: 'Specifies how mask layer images are tiled after they have been sized and positioned.',
  },
  {
    $: {
      name: 'mask-size',
      restriction: 'length, percentage, enum',
      version: '3.0',
      browsers: 'F53',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-size',
    },
    desc: 'Specifies the size of the mask layer images.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.",
        },
        {
          $: {
            name: 'contain',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.',
        },
        {
          $: {
            name: 'cover',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.',
        },
      ],
    },
  },
  {
    $: {
      name: 'mask-type',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C24,FF35,O15,S7',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-type',
    },
    desc: 'Defines whether the content of the <mask> element is treated as as luminance mask or alpha mask.',
    values: {
      value: [
        {
          $: {
            name: 'alpha',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the alpha values of the mask should be used.',
        },
        {
          $: {
            name: 'luminance',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the luminance values of the mask should be used.',
        },
      ],
    },
  },
  {
    $: {
      name: 'max-block-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#propdef-min-block-size',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Maximum size of an element in the direction opposite that of the direction specified by 'writing-mode'.",
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No limit on the width of the box.',
      },
    },
  },
  {
    $: {
      name: 'max-height',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'E,C,FF1,IE7,O7,S1',
      ref: 'http://www.w3.org/TR/css3-box/#max-height',
      syntax: 'footer { $(name): 300px; }',
    },
    desc: 'Allows authors to constrain content height to a certain range.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'No limit on the height of the box.',
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the max-content inline size or max-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the min-content inline size or min-content block size, as appropriate to the writing mode.',
        },
      ],
    },
  },
  {
    $: {
      name: 'max-inline-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#propdef-min-block-size',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Maximum size of an element in the direction specified by 'writing-mode'.",
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No limit on the height of the box.',
      },
    },
  },
  {
    $: {
      name: 'max-width',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'E,C,FF1,IE7,O7,S1',
      ref: 'http://www.w3.org/TR/css3-box/#max-width',
      syntax: 'footer { $(name): 300px; }',
    },
    desc: 'Allows authors to constrain content width to a certain range.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'No limit on the width of the box.',
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the max-content inline size or max-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the min-content inline size or min-content block size, as appropriate to the writing mode.',
        },
      ],
    },
  },
  {
    $: {
      name: 'min-block-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#propdef-min-block-size',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Minimal size of an element in the direction opposite that of the direction specified by 'writing-mode'.",
  },
  {
    $: {
      name: 'min-height',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'E,C,FF1,IE7,O7,S1',
      ref: 'http://www.w3.org/TR/css3-box/#min-height',
      syntax: 'footer { $(name): 300px; }',
    },
    desc: 'Allows authors to constrain content height to a certain range.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'E,IE11',
          },
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the max-content inline size or max-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the min-content inline size or min-content block size, as appropriate to the writing mode.',
        },
      ],
    },
  },
  {
    $: {
      name: 'min-inline-size',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#propdef-min-block-size',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Minimal size of an element in the direction specified by 'writing-mode'.",
  },
  {
    $: {
      name: 'min-width',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'E,C,FF1,IE7,O7,S1',
      ref: 'http://www.w3.org/TR/css3-box/#min-width',
      syntax: 'footer { $(name): 300px; }',
    },
    desc: 'Allows authors to constrain content width to a certain range.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'E,IE11',
          },
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the max-content inline size or max-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the min-content inline size or min-content block size, as appropriate to the writing mode.',
        },
      ],
    },
  },
  {
    $: {
      name: 'mix-blend-mode',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C41,FF32,O29,S7.1',
      ref: 'http://www.w3.org/TR/compositing-1/#propdef-mix-blend-mode',
      syntax: 'div { $(name): saturation; }',
    },
    desc: 'Defines the formula that must be used to mix the colors with the backdrop.',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Default attribute which specifies no blending',
        },
        {
          $: {
            name: 'multiply',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The source color is multiplied by the destination color and replaces the destination.',
        },
        {
          $: {
            name: 'screen',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Multiplies the complements of the backdrop and source color values, then complements the result.',
        },
        {
          $: {
            name: 'overlay',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Multiplies or screens the colors, depending on the backdrop color value.',
        },
        {
          $: {
            name: 'darken',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Selects the darker of the backdrop and source colors.',
        },
        {
          $: {
            name: 'lighten',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Selects the lighter of the backdrop and source colors.',
        },
        {
          $: {
            name: 'color-dodge',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Brightens the backdrop color to reflect the source color.',
        },
        {
          $: {
            name: 'color-burn',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Darkens the backdrop color to reflect the source color.',
        },
        {
          $: {
            name: 'hard-light',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Multiplies or screens the colors, depending on the source color value.',
        },
        {
          $: {
            name: 'soft-light',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Darkens or lightens the colors, depending on the source color value.',
        },
        {
          $: {
            name: 'difference',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Subtracts the darker of the two constituent colors from the lighter color..',
        },
        {
          $: {
            name: 'exclusion',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces an effect similar to that of the Difference mode but lower in contrast.',
        },
        {
          $: {
            name: 'hue',
            version: '3.0',
            browsers: 'C41,FF32,O29',
          },
          desc: 'Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.',
        },
        {
          $: {
            name: 'saturation',
            version: '3.0',
            browsers: 'C41,FF32,O29',
          },
          desc: 'Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.',
        },
        {
          $: {
            name: 'color',
            version: '3.0',
            browsers: 'C41,FF32,O29',
          },
          desc: 'Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.',
        },
        {
          $: {
            name: 'luminosity',
            version: '3.0',
            browsers: 'C41,FF32,O29',
          },
          desc: 'Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.',
        },
      ],
    },
  },
  {
    $: {
      name: 'motion',
      restriction: 'url, length, percentage, angle, shape, geometry-box, enum',
      version: '3.0',
      browsers: 'C46,O33',
      ref: 'http://www.w3.org/TR/motion-1/#propdef-motion',
    },
    desc: "Shorthand property for setting 'motion-path', 'motion-offset' and 'motion-rotation'.",
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No motion path gets created.',
        },
        {
          $: {
            name: 'path()',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Defines an SVG path as a string, with optional 'fill-rule' as the first argument.",
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'References an SVG shape element and uses its geometry as motion path.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the object is rotated by the angle of the direction of the motion path.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees.',
        },
      ],
    },
  },
  {
    $: {
      name: 'motion-offset',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'C46,O33',
      ref: 'http://www.w3.org/TR/motion-1/#propdef-motion-offset',
      syntax: 'div { $(name): 10%; }',
    },
    desc: 'A distance that describes the position along the specified motion path.',
  },
  {
    $: {
      name: 'motion-path',
      restriction: 'url, shape, geometry-box, enum',
      version: '3.0',
      browsers: 'C46,O33',
      ref: 'http://www.w3.org/TR/motion-1/#propdef-motion-path',
    },
    desc: 'Specifies the motion path the element gets positioned at.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No motion path gets created.',
        },
        {
          $: {
            name: 'path()',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Defines an SVG path as a string, with optional 'fill-rule' as the first argument.",
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'References an SVG shape element and uses its geometry as motion path.',
        },
      ],
    },
  },
  {
    $: {
      name: 'motion-rotation',
      restriction: 'angle',
      version: '3.0',
      browsers: 'C46,O33',
      ref: 'http://www.w3.org/TR/motion-1/#propdef-motion-rotation',
      syntax: 'div { $(name): 90%; }',
    },
    desc: 'Defines the direction of the element while positioning along the motion path.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the object is rotated by the angle of the direction of the motion path.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-animation',
      restriction: 'time, enum, timing-function, identifier, number',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation',
      syntax: 'div { $(name): movearound 4s ease 3 normal; }',
    },
    desc: 'Shorthand property combines six of the animation properties into a single property.',
    values: {
      value: [
        {
          $: {
            name: 'alternate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.',
        },
        {
          $: {
            name: 'alternate-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.',
        },
        {
          $: {
            name: 'backwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
        },
        {
          $: {
            name: 'both',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Both forwards and backwards fill modes are applied.',
        },
        {
          $: {
            name: 'forwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.',
        },
        {
          $: {
            name: 'infinite',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Causes the animation to repeat forever.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No animation is performed',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Normal playback.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All iterations of the animation are played in the reverse direction from the way they were specified.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-animation-delay',
      restriction: 'time',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-delay',
      syntax: 'div { $(name): 4s; }',
    },
    desc: 'Defines when the animation will start.',
  },
  {
    $: {
      name: '-moz-animation-direction',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-direction',
      syntax: 'div { $(name): normal; }',
    },
    desc: 'Defines whether or not the animation should play in reverse on alternate cycles.',
    values: {
      value: [
        {
          $: {
            name: 'alternate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.',
        },
        {
          $: {
            name: 'alternate-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Normal playback.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All iterations of the animation are played in the reverse direction from the way they were specified.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-animation-duration',
      restriction: 'time',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-duration',
      syntax: 'div { $(name): 4s; }',
    },
    desc: 'Defines the length of time that an animation takes to complete one cycle.',
  },
  {
    $: {
      name: '-moz-animation-iteration-count',
      restriction: 'number, enum',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-iteration-count',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.',
    values: {
      value: {
        $: {
          name: 'infinite',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Causes the animation to repeat forever.',
      },
    },
  },
  {
    $: {
      name: '-moz-animation-name',
      restriction: 'identifier, enum',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#the-animation-name-property-',
      syntax: 'div { $(name): movearound; }',
    },
    desc: 'Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No animation is performed',
      },
    },
  },
  {
    $: {
      name: '-moz-animation-play-state',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-play-state',
      syntax: 'div { $(name): running; }',
    },
    desc: 'Defines whether the animation is running or paused.',
    values: {
      value: [
        {
          $: {
            name: 'paused',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A running animation will be paused.',
        },
        {
          $: {
            name: 'running',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Resume playback of a paused animation.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-animation-timing-function',
      restriction: 'timing-function',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-timing-function',
      syntax: 'div { $(name): ease; }',
    },
    desc: "Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
  },
  {
    $: {
      name: '-moz-appearance',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-appearance',
      syntax: '.example { $(name): toolbarbutton; }',
    },
    desc: "Used in Gecko (Firefox) to display an element using a platform-native styling based on the operating system's theme.",
    values: {
      value: [
        {
          $: {
            name: 'button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'button-arrow-down',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'button-arrow-next',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'button-arrow-previous',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'button-arrow-up',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'button-bevel',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'checkbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'checkbox-container',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'checkbox-label',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'dialog',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'groupbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'listbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menuarrow',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menuimage',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menuitem',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menuitemtext',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist-text',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist-textfield',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menupopup',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menuradio',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menuseparator',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-mac-unified-toolbar',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-win-borderless-glass',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-win-browsertabbar-toolbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-win-communications-toolbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-win-glass',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-win-media-toolbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'progressbar',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'progresschunk',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'radio',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'radio-container',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'radio-label',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'radiomenuitem',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'resizer',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'resizerpanel',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-down',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-left',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-right',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-up',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbar-small',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbartrack-horizontal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbartrack-vertical',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'separator',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'spinner',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'spinner-downbutton',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'spinner-textfield',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'spinner-upbutton',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'statusbar',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'statusbarpanel',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'tab',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'tabpanels',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'tab-scroll-arrow-back',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'tab-scroll-arrow-forward',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'textfield',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'textfield-multiline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'toolbar',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'toolbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'tooltip',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'treeheadercell',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'treeheadersortarrow',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'treeitem',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'treetwistyopen',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'treeview',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'treewisty',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'window',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-backface-visibility',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF10',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#backface-visibility',
      syntax: 'div { $(name): hidden; }',
    },
    desc: "Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
    values: {
      value: [
        {
          $: {
            name: 'hidden',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'visible',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-background-clip',
      restriction: 'box, enum',
      version: '3.0',
      browsers: 'FF1-3.6',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-clip',
      syntax: 'header { $(name): border-box; }',
    },
    desc: 'Determines the background painting area.',
    values: {
      value: {
        $: {
          name: 'padding',
          version: '3.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: '-moz-background-inline-policy',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-background-inline-policy',
      syntax: 'div { $(name): bounding-box; }',
    },
    desc: 'In Gecko-based applications like Firefox, the -moz-background-inline-policy CSS property specifies how the background image of an inline element is determined when the content of the inline element wraps onto multiple lines. The choice of position has significant effects on repetition.',
    values: {
      value: [
        {
          $: {
            name: 'bounding-box',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'continuous',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'each-box',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-background-origin',
      restriction: 'box',
      version: '3.0',
      browsers: 'FF1',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-origin',
      syntax: 'header { $(name): border-box; }',
    },
    desc: "For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
  },
  {
    $: {
      name: '-moz-border-bottom-colors',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-border-left-colors',
      syntax: 'td { $(name):  #00ff33 #33ff66 #66ff99; }',
    },
    desc: 'Sets a list of colors for the bottom border.',
  },
  {
    $: {
      name: '-moz-border-image',
      restriction: 'length, percentage, number, url, enum',
      version: '3.0',
      browsers: 'FF3.6',
      ref: 'http://www.w3.org/TR/css3-background/#border-image',
      syntax: 'td { $(name): url(border.png) 30 30 round;}',
    },
    desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Causes the middle part of the border-image to be preserved.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'repeat',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area.',
        },
        {
          $: {
            name: 'round',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.',
        },
        {
          $: {
            name: 'space',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is stretched to fill the area.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-border-left-colors',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-border-left-colors',
      syntax: 'td { $(name):  #00ff33 #33ff66 #66ff99; }',
    },
    desc: 'Sets a list of colors for the bottom border.',
  },
  {
    $: {
      name: '-moz-border-right-colors',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-border-left-colors',
      syntax: 'td { $(name):  #00ff33 #33ff66 #66ff99; }',
    },
    desc: 'Sets a list of colors for the bottom border.',
  },
  {
    $: {
      name: '-moz-border-top-colors',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-border-left-colors',
      syntax: 'td { $(name):  #00ff33 #33ff66 #66ff99; }',
    },
    desc: 'Ske Firefox, -moz-border-bottom-colors sets a list of colors for the bottom border.',
  },
  {
    $: {
      name: '-moz-box-align',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-align',
      syntax: 'div { $(name): end; }',
    },
    desc: 'Specifies how a XUL box aligns its contents across (perpendicular to) the direction of its layout. The effect of this is only visible if there is extra space in the box.',
    values: {
      value: [
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used.',
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Any extra space is divided evenly, with half placed above the child and the other half placed after the child.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The height of each child is adjusted to that of the containing block.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-box-direction',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-direction',
      syntax: 'div { $(name): reverse; }',
    },
    desc: 'Specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-box-flex',
      restriction: 'number',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-flex',
      syntax: 'div { $(name): 1; }',
    },
    desc: "Specifies how a box grows to fill the box that contains it, in the direction of the containing box's layout.",
  },
  {
    $: {
      name: '-moz-box-flexgroup',
      restriction: 'integer',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-flexgroup',
      syntax: 'div { $(name): 3; }',
    },
    desc: "Flexible elements can be assigned to flex groups using the 'box-flex-group' property.",
  },
  {
    $: {
      name: '-moz-box-ordinal-group',
      restriction: 'integer',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-ordinal-group',
      syntax: 'div { $(name): 5; }',
    },
    desc: 'Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group.',
  },
  {
    $: {
      name: '-moz-box-orient',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-orient',
      syntax: 'div { $(name): vertical; }',
    },
    desc: 'In Mozilla applications, -moz-box-orient specifies whether a box lays out its contents horizontally or vertically.',
    values: {
      value: [
        {
          $: {
            name: 'block-axis',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Elements are oriented along the box's axis.",
        },
        {
          $: {
            name: 'horizontal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The box displays its children from left to right in a horizontal line.',
        },
        {
          $: {
            name: 'inline-axis',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Elements are oriented vertically.',
        },
        {
          $: {
            name: 'vertical',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The box displays its children from stacked from top to bottom vertically.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-box-pack',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-box-pack',
      syntax: 'div { $(name): end; }',
    },
    desc: 'Specifies how a box packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.',
    values: {
      value: [
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The extra space is divided evenly, with half placed before the first child and the other half placed after the last child.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child.',
        },
        {
          $: {
            name: 'justify',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-box-sizing',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1',
      ref: 'http://www.w3.org/TR/css3-ui/#box-sizing',
      syntax: 'div { $(name): content-box; }',
    },
    desc: 'Box Model addition in CSS3.',
    values: {
      value: [
        {
          $: {
            name: 'border-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The specified width and height (and respective min/max properties) on this element determine the border box of the element.',
        },
        {
          $: {
            name: 'content-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.',
        },
        {
          $: {
            name: 'padding-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The specified width and height (and respective min/max properties) on this element determine the padding box of the element.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-column-count',
      restriction: 'integer',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-count',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Describes the optimal number of columns into which the content of the element will be flowed.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "Determines the number of columns by the 'column-width' property and the element width.",
      },
    },
  },
  {
    $: {
      name: '-moz-column-gap',
      restriction: 'length',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-gap0',
      syntax: 'div { $(name): 10px; }',
    },
    desc: 'Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.',
    values: {
      value: {
        $: {
          name: 'normal',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'User agent specific and typically equivalent to 1em.',
      },
    },
  },
  {
    $: {
      name: '-moz-column-rule',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule0',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
  },
  {
    $: {
      name: '-moz-column-rule-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-color',
      syntax: 'div { $(name): #ff0; }',
    },
    desc: 'Sets the color of the column rule',
  },
  {
    $: {
      name: '-moz-column-rule-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-style',
      syntax: 'div { $(name): solid; }',
    },
    desc: 'Sets the style of the rule between columns of an element.',
  },
  {
    $: {
      name: '-moz-column-rule-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-width',
      syntax: 'div { $(name): 3px; }',
    },
    desc: 'Sets the width of the rule between columns. Negative values are not allowed.',
  },
  {
    $: {
      name: '-moz-columns',
      restriction: 'length, integer',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-multicol/#columns0',
      syntax: 'div { $(name): 100px 3; }',
    },
    desc: "A shorthand property which sets both 'column-width' and 'column-count'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The width depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: '-moz-column-width',
      restriction: 'length',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-width',
      syntax: 'div { $(name): 100px; }',
    },
    desc: 'This property describes the width of columns in multicol elements.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The width depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: '-moz-font-feature-settings',
      restriction: 'string, integer',
      version: '3.0',
      browsers: 'FF4',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-feature-settings',
      syntax: "body { $(name): 'hwid'; }",
    },
    desc: 'Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.',
    values: {
      value: [
        {
          $: {
            name: '"c2cs"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"dlig"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"kern"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"liga"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"lnum"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"onum"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"smcp"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"swsh"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"tnum"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No change in glyph substitution or positioning occurs.',
        },
        {
          $: {
            name: 'off',
            version: '3.0',
            browsers: 'FF15',
          },
        },
        {
          $: {
            name: 'on',
            version: '3.0',
            browsers: 'FF15',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-hyphens',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF9',
      ref: 'http://www.w3.org/TR/css3-text/#hyphens0',
      syntax: 'div { $(name): manual; }',
    },
    desc: 'Controls whether hyphenation is allowed to create more break opportunities within a line of text.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.',
        },
        {
          $: {
            name: 'manual',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Words are not broken at line breaks, even if characters inside the word suggest line break points.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-perspective',
      restriction: 'length',
      version: '3.0',
      browsers: 'FF10',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#perspective',
      syntax: 'div { $(name): none; }',
    },
    desc: 'Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No perspective transform is applied.',
      },
    },
  },
  {
    $: {
      name: '-moz-perspective-origin',
      restriction: 'position, percentage, length',
      version: '3.0',
      browsers: 'FF10',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#perspective-origin',
      syntax: 'div { $(name): 10px; }',
    },
    desc: 'Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.',
  },
  {
    $: {
      name: '-moz-text-align-last',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF12',
      ref: 'http://www.w3.org/TR/css3-text/#text-align-last0',
      syntax: 'div { $(name): right; }',
    },
    desc: "Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The inline contents are centered within the line box.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'The inline contents are aligned to the end edge of the line box.',
        },
        {
          $: {
            name: 'justify',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The text is justified according to the method specified by the 'text-justify' property.",
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'The inline contents are aligned to the start edge of the line box.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-text-decoration-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF6',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-color',
      syntax: 'div { $(name): #ff0; }',
    },
    desc: 'Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line.',
  },
  {
    $: {
      name: '-moz-text-decoration-line',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF6',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-line',
      syntax: 'div { $(name): underline; }',
    },
    desc: 'Specifies what line decorations, if any, are added to the element.',
    values: {
      value: [
        {
          $: {
            name: 'line-through',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each line of text has a line through the middle.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither produces nor inhibits text decoration.',
        },
        {
          $: {
            name: 'overline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each line of text has a line above it.',
        },
        {
          $: {
            name: 'underline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each line of text is underlined.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-text-decoration-style',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF6',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-style',
      syntax: 'div { $(name): solid; }',
    },
    desc: 'Specifies the line style for underline, line-through and overline text decoration.',
    values: {
      value: [
        {
          $: {
            name: 'dashed',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a dashed line style.',
        },
        {
          $: {
            name: 'dotted',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a dotted line.',
        },
        {
          $: {
            name: 'double',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a double line.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces no line.',
        },
        {
          $: {
            name: 'solid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a solid line.',
        },
        {
          $: {
            name: 'wavy',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a wavy line.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-text-size-adjust',
      restriction: 'enum, percentage',
      version: '3.0',
      browsers: 'FF',
      ref: 'http://dev.w3.org/csswg/css-size-adjust/',
      syntax: 'body { $(name): 150%; }',
    },
    desc: 'Specifies a size adjustment for displaying text content in mobile browsers.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Renderers must use the default size adjustment when displaying on a small device.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Renderers must not do size adjustment when displaying on a small device.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-transform',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-2d-transforms/#transform-property',
      syntax: 'div { $(name): rotate(-90deg); }',
    },
    desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
    values: {
      value: [
        {
          $: {
            name: 'matrix()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]',
        },
        {
          $: {
            name: 'matrix3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'perspective',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a perspective projection matrix.',
        },
        {
          $: {
            name: 'rotate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.',
        },
        {
          $: {
            name: 'rotate3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.',
        },
        {
          $: {
            name: "rotateX('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the X axis.',
        },
        {
          $: {
            name: "rotateY('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the Y axis.',
        },
        {
          $: {
            name: "rotateZ('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the Z axis.',
        },
        {
          $: {
            name: 'scale()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.',
        },
        {
          $: {
            name: 'scale3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.',
        },
        {
          $: {
            name: 'scaleX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.',
        },
        {
          $: {
            name: 'scaleY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.',
        },
        {
          $: {
            name: 'scaleZ()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.',
        },
        {
          $: {
            name: 'skew()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).',
        },
        {
          $: {
            name: 'skewX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the X axis by the given angle.',
        },
        {
          $: {
            name: 'skewY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the Y axis by the given angle.',
        },
        {
          $: {
            name: 'translate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.',
        },
        {
          $: {
            name: 'translate3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.',
        },
        {
          $: {
            name: 'translateX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the X direction.',
        },
        {
          $: {
            name: 'translateY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the Y direction.',
        },
        {
          $: {
            name: 'translateZ()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-transform-origin',
      restriction: 'position, length, percentage',
      version: '3.0',
      browsers: 'FF3.5',
      ref: 'http://www.w3.org/TR/css3-2d-transforms/#transform-origin',
      syntax: '.album { $(name): 20% 40%; }',
    },
    desc: 'Establishes the origin of transformation for an element.',
  },
  {
    $: {
      name: '-moz-transition',
      restriction: 'time, property, timing-function, enum',
      version: '3.0',
      browsers: 'FF4',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition',
      syntax: 'div { $(name): background-color linear 1s; }',
    },
    desc: 'Shorthand property combines four of the transition properties into a single property.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Every property that is able to undergo a transition will do so.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No property will transition.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-transition-delay',
      restriction: 'time',
      version: '3.0',
      browsers: 'FF4',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-delay',
      syntax: 'div { $(name): 1s; }',
    },
    desc: 'Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.',
  },
  {
    $: {
      name: '-moz-transition-duration',
      restriction: 'time',
      version: '3.0',
      browsers: 'FF4',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-duration',
      syntax: 'div { $(name): 1s; }',
    },
    desc: 'Specifies how long the transition from the old value to the new value should take.',
  },
  {
    $: {
      name: '-moz-transition-property',
      restriction: 'property',
      version: '3.0',
      browsers: 'FF4',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-property',
      syntax: 'div { $(name): background-color; }',
    },
    desc: 'Specifies the name of the CSS property to which the transition is applied.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Every property that is able to undergo a transition will do so.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No property will transition.',
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-transition-timing-function',
      restriction: 'timing-function',
      version: '3.0',
      browsers: 'FF4',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-timing-function',
      syntax: 'div { $(name): linear; }',
    },
    desc: 'Describes how the intermediate values used during a transition will be calculated.',
  },
  {
    $: {
      name: '-moz-user-focus',
      restriction: '',
      version: '',
      browsers: 'FF1.5',
      ref: 'https://developer.mozilla.org/en-US/docs/CSS/-moz-user-focus',
      syntax: 'div { $(name): ignore; }',
    },
    desc: 'Used to indicate whether the element can have focus.',
    values: {
      value: [
        {
          $: {
            name: 'ignore',
            version: '',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-moz-user-select',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF1.5',
      ref: 'https://developer.mozilla.org/en/CSS/-moz-user-select',
      syntax: 'div { $(name): text; }',
    },
    desc: 'Controls the appearance of selection.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'element',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'elements',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-all',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '-moz-none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'text',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'toggle',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'negative',
      restriction: 'image, identifier, string',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-negative',
      syntax: "@counter-style { negative: '(' ')'; }",
    },
    desc: '@counter-style descriptor. Defines how to alter the representation when the counter value is negative.',
  },
  {
    $: {
      name: 'object-fit',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C32,FF36,O19,S7.1',
      ref: 'http://www.w3.org/TR/css-images/#object-fit',
      syntax: 'p { $(name): cover; }',
    },
    desc: 'Specifies how the contents of a replaced element should be scaled relative to the box established by its used height and width.',
    values: {
      value: [
        {
          $: {
            name: 'contain',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The replaced content is sized to maintain its aspect ratio while fitting within the element's content box: its concrete object size is resolved as a contain constraint against the element's used width and height.",
        },
        {
          $: {
            name: 'cover',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The replaced content is sized to maintain its aspect ratio while filling the element's entire content box: its concrete object size is resolved as a cover constraint against the element's used width and height.",
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The replaced content is sized to fill the element's content box: the object's concrete object size is the element's used width and height.",
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The replaced content is not resized to fit inside the element's content box",
        },
        {
          $: {
            name: 'scale-down',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Size the content as if 'none' or 'contain' were specified, whichever would result in a smaller concrete object size.",
        },
      ],
    },
  },
  {
    $: {
      name: 'object-position',
      restriction: 'position, length, percentage',
      version: '3.0',
      browsers: 'C32,FF36,O19',
      ref: 'http://www.w3.org/TR/css-images/#object-position',
      syntax: 'img { $(name): left top; }',
    },
    desc: 'Determines the alignment of the replaced element inside its box.',
  },
  {
    $: {
      name: 'opacity',
      restriction: 'number(0-1)',
      version: '3.0',
      browsers: 'C,FF3.6,IE9,O9,S1.2',
      ref: 'http://www.w3.org/TR/css3-color/#opacity',
      syntax: 'article { $(name): opacity: 0.4; }',
    },
    desc: "Opacity of an element's text, where 1 is opaque and 0 is entirely transparent.",
  },
  {
    $: {
      name: 'order',
      restriction: 'integer',
      version: '3.0',
      browsers: 'E,C29,FF22,IE11,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-flexbox/#order',
      syntax: 'p { $(name): -1; }',
    },
    desc: 'Controls the order in which children of a flex container appear within the flex container, by assigning them to ordinal groups.',
  },
  {
    $: {
      name: 'orphans',
      restriction: 'integer',
      version: '2.0',
      browsers: 'C,IE8,O7,S1.3',
      ref: 'http://www.w3.org/TR/css3-break/#widows-orphans',
      syntax: '<integer>',
    },
    desc: 'Specifies the minimum number of line boxes in a block container that must be left in a fragment before a fragmentation break.',
  },
  {
    $: {
      name: 'offset-block-end',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
      },
    },
  },
  {
    $: {
      name: 'offset-block-start',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
      },
    },
  },
  {
    $: {
      name: 'offset-inline-end',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
      },
    },
  },
  {
    $: {
      name: 'offset-inline-start',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#logical-prop',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well.",
      },
    },
  },
  {
    $: {
      name: 'outline',
      restriction: 'length, line-width, line-style, color, enum',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O8,S1.2',
      ref: 'http://www.w3.org/TR/css3-ui/#outline0',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "Shorthand property for 'outline-style', 'outline-width', and 'outline-color'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Permits the user agent to render a custom outline style, typically the default platform style.',
        },
        {
          $: {
            name: 'invert',
            version: '2.0',
            browsers: 'E,IE8,O',
          },
          desc: 'Performs a color inversion on the pixels on the screen.',
        },
      ],
    },
  },
  {
    $: {
      name: 'outline-color',
      restriction: 'enum, color',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O8,S1.2',
      ref: 'http://www.w3.org/TR/css3-ui/#outline-color',
      syntax: 'body { $(name): red; }',
    },
    desc: 'The color of the outline.',
    values: {
      value: {
        $: {
          name: 'invert',
          version: '2.0',
          browsers: 'E,IE8,O',
        },
        desc: 'Performs a color inversion on the pixels on the screen.',
      },
    },
  },
  {
    $: {
      name: 'outline-offset',
      restriction: 'length',
      version: '3.0',
      browsers: 'C,FF1.5,O9.5,S1.2',
      ref: 'http://www.w3.org/TR/css3-ui/#outline-offset0',
      syntax: 'article { $(name): 15px; }',
    },
    desc: 'Offset the outline and draw it beyond the border edge.',
  },
  {
    $: {
      name: 'outline-style',
      restriction: 'line-style, enum',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O8,S1.2',
      ref: 'http://www.w3.org/TR/css3-ui/#outline-style0',
      syntax: 'td { $(name): solid; }',
    },
    desc: 'Style of the outline.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Permits the user agent to render a custom outline style, typically the default platform style.',
      },
    },
  },
  {
    $: {
      name: 'outline-width',
      restriction: 'length, line-width',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O8,S1.2',
      ref: 'http://www.w3.org/TR/css3-ui/#outline-width0',
      syntax: 'td { $(name): 2px; }',
    },
    desc: 'Width of the outline.',
  },
  {
    $: {
      name: 'overflow',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-overflow-3/#overflow',
      syntax: 'div { overflow: hidden auto; }',
    },
    desc: "Shorthand for setting 'overflow-x' and 'overflow-y'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.",
        },
        {
          $: {
            name: 'clip',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Behaves as 'hidden' except forbids scrolling entirely, through any mechanism.",
        },
        {
          $: {
            name: 'hidden',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.',
        },
        {
          $: {
            name: '-moz-hidden-unscrollable',
            version: '3.0',
            browsers: 'FF',
          },
          desc: "Same as the standardized 'clip', except doesn't establish a block formatting context.",
        },
        {
          $: {
            name: 'scroll',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.',
        },
        {
          $: {
            name: 'visible',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is not clipped, i.e., it may be rendered outside the content box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overflow-wrap',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C23,O12.1,S6.1',
      ref: 'http://www.w3.org/TR/css3-text/#overflow-wrap0',
      syntax: 'div { $(name): break-word; }',
    },
    desc: 'Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit within the line box.',
    values: {
      value: [
        {
          $: {
            name: 'break-word',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines may break only at allowed break points.',
        },
        {
          $: {
            name: 'anywhere',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'There is a soft wrap opportunity around every typographic character unit, including around any punctuation character or preserved white spaces, or in the middle of words, disregarding any prohibition against line breaks, even those introduced by characters with the GL, WJ, or ZWJ line breaking classes or mandated by the word-break property.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overflow-x',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C,FF1.5,IE5,O9.5,S3',
      ref: 'http://www.w3.org/TR/css3-box/#overflow-x',
      syntax: 'div { $(name): hidden; }',
    },
    desc: 'Specifies the handling of overflow in the horizontal direction.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.",
        },
        {
          $: {
            name: 'clip',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Behaves as 'hidden' except forbids scrolling entirely, through any mechanism.",
        },
        {
          $: {
            name: 'hidden',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.',
        },
        {
          $: {
            name: 'scroll',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.',
        },
        {
          $: {
            name: 'visible',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is not clipped, i.e., it may be rendered outside the content box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'overflow-y',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C,FF1.5,IE5,O9.5,S3',
      ref: 'http://www.w3.org/TR/css3-box/#overflow-x',
      syntax: 'div { $(name): hidden; }',
    },
    desc: 'Specifies the handling of overflow in the vertical direction.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes.",
        },
        {
          $: {
            name: 'clip',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Behaves as 'hidden' except forbids scrolling entirely, through any mechanism.",
        },
        {
          $: {
            name: 'hidden',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region.',
        },
        {
          $: {
            name: 'scroll',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped.',
        },
        {
          $: {
            name: 'visible',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Content is not clipped, i.e., it may be rendered outside the content box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'pad',
      restriction: 'integer, image, string, identifier',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-pad',
      syntax: "@counter-style { pad: 3 '0'; }",
    },
    desc: '@counter-style descriptor. Specifies a "fixed-width" counter style, where representations shorter than the pad value are padded with a particular <symbol>',
  },
  {
    $: {
      name: 'padding',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#padding1',
      syntax: 'div { $(name): 4px 7px 2px 4px; }',
    },
    desc: 'Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.',
    values: {
      value: {
        $: {
          name: 'logical',
          version: '3.0',
          browsers: 'none',
        },
        desc: 'Indicates that the values map to the logical properties instead of the physical ones.',
      },
    },
  },
  {
    $: {
      name: 'padding-bottom',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#padding1',
      syntax: 'ul { $(name): 2em; }',
    },
    desc: 'Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.',
  },
  {
    $: {
      name: 'padding-block-end',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'padding-bottom'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'padding-block-start',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'padding-top'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'padding-inline-end',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'padding-right'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'padding-inline-start',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'FF41',
      ref: 'https://drafts.csswg.org/css-logical-props/#border-padding',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Logical 'padding-left'. Mapping depends on the parent element's 'writing-mode', 'direction', and 'text-orientation'.",
  },
  {
    $: {
      name: 'padding-left',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#padding1',
      syntax: 'ul { $(name): 2em; }',
    },
    desc: 'Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.',
  },
  {
    $: {
      name: 'padding-right',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#padding1',
      syntax: 'ul { $(name): 2em; }',
    },
    desc: 'Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.',
  },
  {
    $: {
      name: 'padding-top',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#padding1',
      syntax: 'ul { $(name): 2em; }',
    },
    desc: 'Shorthand property to set values for the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.',
  },
  {
    $: {
      name: 'page-break-after',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-break/#page-break-properties',
      syntax: 'table { $(name): always; }',
    },
    desc: 'Defines rules for page breaks after an element.',
    values: {
      value: [
        {
          $: {
            name: 'always',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Always force a page break after the generated box.',
        },
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page break after generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break after the generated box.',
        },
        {
          $: {
            name: 'left',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks after the generated box so that the next page is formatted as a left page.',
        },
        {
          $: {
            name: 'recto',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Equivalent to right in left-to-right page progressions and left in right-to-left page progressions.',
        },
        {
          $: {
            name: 'right',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks after the generated box so that the next page is formatted as a right page.',
        },
        {
          $: {
            name: 'verso',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Equivalent to left in left-to-right page progressions and right in right-to-left page progressions.',
        },
      ],
    },
  },
  {
    $: {
      name: 'page-break-before',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-break/#page-break-properties',
      syntax: 'table { $(name): always; }',
    },
    desc: 'Defines rules for page breaks before an element.',
    values: {
      value: [
        {
          $: {
            name: 'always',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before the generated box.',
        },
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page break before the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break before the generated box.',
        },
        {
          $: {
            name: 'left',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before the generated box so that the next page is formatted as a left page.',
        },
        {
          $: {
            name: 'right',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before the generated box so that the next page is formatted as a right page.',
        },
      ],
    },
  },
  {
    $: {
      name: 'page-break-inside',
      restriction: 'enum',
      version: '2.0',
      browsers: 'C,IE8,O7,S1.3',
      ref: 'http://www.w3.org/TR/css3-break/#page-break-properties',
      syntax: 'table { $(name): avoid; }',
    },
    desc: 'Defines rules for page breaks inside an element.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page break inside the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break inside the generated box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'paint-order',
      restriction: 'enum',
      version: '4.0',
      browsers: 'C35,FF31,O22,S7.1',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#PaintOrderProperty',
    },
    desc: 'Controls the order that the three paint operations that shapes and text are rendered with: their fill, their stroke and any markers they might have.',
    values: {
      value: [
        {
          $: {
            name: 'fill',
            version: '4.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'markers',
            version: '4.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '4.0',
            browsers: 'all',
          },
          desc: "The element is painted with the standard order of painting operations: the 'fill' is painted first, then its 'stroke' and finally its markers.",
        },
        {
          $: {
            name: 'stroke',
            version: '4.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'perspective',
      restriction: 'length, enum',
      version: '3.0',
      browsers: 'E,C36,FF16,IE10,O23,S9',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#perspective',
      syntax: 'div { $(name): none; }',
    },
    desc: 'Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No perspective transform is applied.',
      },
    },
  },
  {
    $: {
      name: 'perspective-origin',
      restriction: 'position, percentage, length',
      version: '3.0',
      browsers: 'E,C36,FF16,IE10,O23,S9',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#perspective-origin',
      syntax: 'div { $(name): 10px; }',
    },
    desc: 'Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.',
  },
  {
    $: {
      name: 'pointer-events',
      restriction: 'enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/interact.html#PointerEventsProperty',
    },
    desc: 'Specifies under what circumstances a given element can be the target element for a pointer event.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The given element can be the target element for pointer events whenever the pointer is over either the interior or the perimeter of the element.',
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The given element can be the target element for pointer events whenever the pointer is over the interior of the element.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The given element does not receive pointer events.',
        },
        {
          $: {
            name: 'painted',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The given element can be the target element for pointer events when the pointer is over a "painted" area. ',
        },
        {
          $: {
            name: 'stroke',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The given element can be the target element for pointer events whenever the pointer is over the perimeter of the element.',
        },
        {
          $: {
            name: 'visible',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The given element can be the target element for pointer events when the 'visibility' property is set to visible and the pointer is over either the interior or the perimeter of the element.",
        },
        {
          $: {
            name: 'visibleFill',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over the interior of the element.",
        },
        {
          $: {
            name: 'visiblePainted',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over a 'painted' area.",
        },
        {
          $: {
            name: 'visibleStroke',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The given element can be the target element for pointer events when the 'visibility' property is set to visible and when the pointer is over the perimeter of the element.",
        },
      ],
    },
  },
  {
    $: {
      name: 'position',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-positioning/#propdef-position',
      syntax: 'div { $(name): absolute; }',
    },
    values: {
      value: [
        {
          $: {
            name: 'absolute',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The box's position (and possibly size) is specified with the 'top', 'right', 'bottom', and 'left' properties. These properties specify offsets with respect to the box's 'containing block'.",
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Center positioned boxes are taken out of the normal flow. This means they have no impact on the layout of later siblings.',
        },
        {
          $: {
            name: 'fixed',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The box's position is calculated according to the 'absolute' model, but in addition, the box is fixed with respect to some reference. As with the 'absolute' model, the box's margins do not collapse with any other margins.",
        },
        {
          $: {
            name: '-ms-page',
            version: '3.0',
            browsers: 'E,IE10',
          },
          desc: "The box's position is calculated according to the 'absolute' model.",
        },
        {
          $: {
            name: 'page',
            version: '3.0',
            browsers: 'none',
          },
          desc: "The box's position is calculated according to the 'absolute' model.",
        },
        {
          $: {
            name: 'relative',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The box's position is calculated according to the normal flow (this is called the position in normal flow). Then the box is offset relative to its normal position.",
        },
        {
          $: {
            name: 'static',
            version: '2.0',
            browsers: 'all',
          },
          desc: "The box is a normal box, laid out according to the normal flow. The 'top', 'right', 'bottom', and 'left' properties do not apply.",
        },
        {
          $: {
            name: 'sticky',
            version: '3.0',
            browsers: 'C56,FF32',
          },
          desc: "The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.",
        },
        {
          $: {
            name: '-webkit-sticky',
            version: '2.0',
            browsers: 'S6.1',
          },
          desc: "The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.",
        },
      ],
    },
  },
  {
    $: {
      name: 'prefix',
      restriction: 'image, string, identifier',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-prefix',
      syntax: "@counter-style { prefix: '#'; }",
    },
    desc: '@counter-style descriptor. Specifies a <symbol> that is prepended to the marker representation.',
  },
  {
    $: {
      name: 'quotes',
      restriction: 'string',
      version: '2.0',
      browsers: 'E,C,FF1.5,IE8,O8,S5.1',
      ref: 'http://www.w3.org/TR/css3-content/#quotes',
      syntax: 'none | [ <string> <string> ]+',
    },
    desc: 'Specifies quotation marks for any number of embedded quotations.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '2.0',
          browsers: 'all',
        },
        desc: "The 'open-quote' and 'close-quote' values of the 'content' property produce no quotations marks, as if they were 'no-open-quote' and 'no-close-quote' respectively.",
      },
    },
  },
  {
    $: {
      name: 'range',
      restriction: 'integer, enum',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-range',
      syntax: '@counter-style { range: 2 infinite, 8 834048; }',
    },
    desc: '@counter-style descriptor. Defines the ranges over which the counter style is defined.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The range depends on the counter system.',
        },
        {
          $: {
            name: 'infinite',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If used as the first value in a range, it represents negative infinity; if used as the second value, it represents positive infinity.',
        },
      ],
    },
  },
  {
    $: {
      name: 'resize',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,FF4,O15,S3',
      ref: 'http://www.w3.org/TR/css3-ui/#resize0',
      syntax: 'div { $(name): both; }',
    },
    desc: 'Specifies whether or not an element is resizable by the user, and if so, along which axis/axes.',
    values: {
      value: [
        {
          $: {
            name: 'both',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The UA presents a bidirectional resizing mechanism to allow the user to adjust both the height and the width of the element.',
        },
        {
          $: {
            name: 'block',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'vertical'",
        },
        {
          $: {
            name: 'horizontal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The UA presents a unidirectional horizontal resizing mechanism to allow the user to adjust only the width of the element.',
        },
        {
          $: {
            name: 'inline',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Logical 'horizontal'",
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The UA does not present a resizing mechanism on the element, and the user is given no direct manipulation mechanism to resize the element.',
        },
        {
          $: {
            name: 'vertical',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The UA presents a unidirectional vertical resizing mechanism to allow the user to adjust only the height of the element.',
        },
      ],
    },
  },
  {
    $: {
      name: 'right',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-positioning/#propdef-right',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Specifies how far an absolutely positioned box's right margin edge is offset to the left of the right edge of the box's 'containing block'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '2.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
      },
    },
  },
  {
    $: {
      name: 'ruby-align',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF10,IE5',
      ref: 'http://www.w3.org/TR/css3-ruby/#rubyalign',
      syntax:
        'auto | start | left | center | end | right | distribute-letter | distribute-space | line-edge',
    },
    desc: 'Specifies how text is distributed within the various ruby boxes when their contents do not exactly fill their respective boxes.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'E,IE5',
          },
          desc: 'The user agent determines how the ruby contents are aligned. This is the initial value.',
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby content is centered within its box.',
        },
        {
          $: {
            name: 'distribute-letter',
            version: '3.0',
            browsers: 'E,IE5',
          },
          desc: 'If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with the first and last ruby text glyphs lining up with the corresponding first and last base glyphs. If the width of the ruby text is at least the width of the base, then the letters of the base are evenly distributed across the width of the ruby text.',
        },
        {
          $: {
            name: 'distribute-space',
            version: '3.0',
            browsers: 'E,IE5',
          },
          desc: 'If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with a certain amount of white space preceding the first and following the last character in the ruby text. That amount of white space is normally equal to half the amount of inter-character space of the ruby text.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text content is aligned with the start edge of the base.',
        },
        {
          $: {
            name: 'line-edge',
            version: '3.0',
            browsers: 'E,IE5',
          },
          desc: "If the ruby text is not adjacent to a line edge, it is aligned as in 'auto'. If it is adjacent to a line edge, then it is still aligned as in auto, but the side of the ruby text that touches the end of the line is lined up with the corresponding edge of the base.",
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'E,IE5',
          },
          desc: 'The ruby text content is aligned with the end edge of the base.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'FF10',
          },
          desc: 'The ruby text content is aligned with the start edge of the base.',
        },
        {
          $: {
            name: 'space-between',
            version: '3.0',
            browsers: 'FF10',
          },
          desc: "The ruby content expands as defined for normal text justification (as defined by 'text-justify'),",
        },
        {
          $: {
            name: 'space-around',
            version: '3.0',
            browsers: 'FF10',
          },
          desc: "As for 'space-between' except that there exists an extra justification opportunities whose space is distributed half before and half after the ruby content.",
        },
      ],
    },
  },
  {
    $: {
      name: 'ruby-overhang',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF10,IE5',
      ref: 'http://www.w3.org/TR/css3-ruby/#rubyover',
      syntax: 'auto | start | end | none',
    },
    desc: 'Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text can overhang text adjacent to the base on either side. This is the initial value.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text can overhang the text that follows it.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text cannot overhang any text adjacent to its base, only its own base.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text can overhang the text that precedes it.',
        },
      ],
    },
  },
  {
    $: {
      name: 'ruby-position',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF10,IE5',
      ref: 'http://www.w3.org/TR/css3-ruby/#ruby-position',
      syntax: 'before | after | right',
    },
    desc: 'Used by the parent of elements with display: ruby-text to control the position of the ruby text with respect to its base.',
    values: {
      value: [
        {
          $: {
            name: 'after',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text appears after the base. This is a relatively rare setting used in ideographic East Asian writing systems, most easily found in educational text.',
        },
        {
          $: {
            name: 'before',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The ruby text appears before the base. This is the most common setting used in ideographic East Asian writing systems.',
        },
        {
          $: {
            name: 'inline',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The ruby text appears on the right of the base. Unlike 'before' and 'after', this value is not relative to the text flow direction.",
        },
      ],
    },
  },
  {
    $: {
      name: 'ruby-span',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF10',
      ref: 'http://www.w3.org/TR/css3-ruby/#rubyspan',
      syntax: 'attr(x) | none',
    },
    desc: 'Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base.',
    values: {
      value: [
        {
          $: {
            name: 'attr(x)',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The value of attribute 'x' is a string value. The string value is evaluated as a <number> to determine the number of ruby base elements to be spanned by the annotation element.",
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: "No spanning. The computed value is '1'.",
        },
      ],
    },
  },
  {
    $: {
      name: 'scroll-behavior',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF36',
      ref: 'http://www.w3.org/TR/cssom-view/#scroll-behavior',
    },
    desc: 'Specifies the scrolling behavior for a scrolling box, when scrolling happens due to navigation or CSSOM scrolling APIs.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scrolls in an instant fashion.',
        },
        {
          $: {
            name: 'smooth',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scrolls in a smooth fashion using a user-agent-defined timing function and time period.',
        },
      ],
    },
  },
  {
    $: {
      name: 'scroll-snap-coordinate',
      restriction: 'position, length, percentage, enum',
      version: '3.0',
      browsers: 'FF39',
      ref: 'http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-coordinate',
    },
    desc: "Defines the x and y coordinate within the element which will align with the nearest ancestor scroll container's snap-destination for the respective axis.",
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies that this element does not contribute a snap point.',
        },
        {
          $: {
            name: 'border-box',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Specifies the offset of the snap coordinate from the start edge of the element's border box.",
        },
        {
          $: {
            name: 'margin-box',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Specifies the offset of the snap coordinate from the start edge of the element's margin box.",
        },
      ],
    },
  },
  {
    $: {
      name: 'scroll-snap-destination',
      restriction: 'position, length, percentage',
      version: '3.0',
      browsers: 'FF39',
      ref: 'http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-destination',
    },
    desc: "Define the x and y coordinate within the scroll container's visual viewport which element snap points will align with.",
  },
  {
    $: {
      name: 'scroll-snap-points-x',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF39',
      ref: 'http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-points-x',
    },
    desc: 'Defines the positioning of snap points along the x axis of the scroll container it is applied to.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No snap points are defined by this scroll container.',
        },
        {
          $: {
            name: 'repeat()',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Defines an interval at which snap points are defined, starting from the container's relevant start edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'scroll-snap-points-y',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF39',
      ref: 'http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-points-y',
    },
    desc: 'Defines the positioning of snap points along the y axis of the scroll container it is applied to.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No snap points are defined by this scroll container.',
        },
        {
          $: {
            name: 'repeat()',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Defines an interval at which snap points are defined, starting from the container's relevant start edge.",
        },
      ],
    },
  },
  {
    $: {
      name: 'scroll-snap-type',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF39',
      ref: 'http://www.w3.org/TR/css-snappoints-1/#propdef-scroll-snap-type',
    },
    desc: 'Defines how strictly snap points are enforced on the scroll container.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The visual viewport of this scroll container must ignore snap points, if any, when scrolled.',
        },
        {
          $: {
            name: 'mandatory',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The visual viewport of this scroll container is guaranteed to rest on a snap point when there are no active scrolling operations.',
        },
        {
          $: {
            name: 'proximity',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The visual viewport of this scroll container may come to rest on a snap point at the termination of a scroll at the discretion of the UA given the parameters of the scroll.',
        },
      ],
    },
  },
  {
    $: {
      name: 'shape-image-threshold',
      restriction: 'number',
      version: '3.0',
      browsers: 'C37,O24',
      ref: 'http://www.w3.org/TR/css-shapes-1/#propdef-shape-image-threshold',
      syntax: 'div { $(name): 0.5; }',
    },
    desc: 'Defines the alpha channel threshold used to extract the shape using an image. A value of 0.5 means that the shape will enclose all the pixels that are more than 50% opaque.',
  },
  {
    $: {
      name: 'shape-margin',
      restriction: 'url, length, percentage',
      version: '3.0',
      browsers: 'C37,O24',
      ref: 'http://www.w3.org/TR/css-shapes-1/#propdef-shape-margin',
      syntax: 'div { $(name): 10px; }',
    },
    desc: "Adds a margin to a 'shape-outside'. This defines a new shape that is the smallest contour that includes all the points that are the 'shape-margin' distance outward in the perpendicular direction from a point on the underlying shape.",
  },
  {
    $: {
      name: 'shape-outside',
      restriction: 'image, box, shape, enum',
      version: '3.0',
      browsers: 'C37,O24',
      ref: 'http://www.w3.org/TR/css-shapes-1/#shape-outside-property',
      syntax: 'div { $(name): margin-box; }',
    },
    desc: 'Specifies an orthogonal rotation to be applied to an image before it is laid out.',
    values: {
      value: [
        {
          $: {
            name: 'margin-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The background is painted within (clipped to) the margin box.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The float area is unaffected.',
        },
      ],
    },
  },
  {
    $: {
      name: 'size',
      restriction: 'length',
      version: '2.1',
      browsers: 'C,O8',
      ref: 'http://www.w3.org/TR/css3-page/#page-size-prop',
      syntax:
        '<length>{1,2} | auto | [ <page-size> || [ portrait | landscape] ]',
    },
  },
  {
    $: {
      name: 'src',
      restriction: 'enum, url, identifier',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#src-desc',
      syntax: "src: url(font.woff) format('woff');",
    },
    desc: '@font-face descriptor. Specifies the resource containing font data. It is required, whether the font is downloadable or locally installed.',
    values: {
      value: [
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Reference font by URL',
        },
        {
          $: {
            name: 'format()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Optional hint describing the format of the font resource.',
        },
        {
          $: {
            name: 'local()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Format-specific string that identifies a locally available copy of a given font.',
        },
      ],
    },
  },
  {
    $: {
      name: 'stop-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/pservers.html#StopColorProperty',
    },
    desc: 'Indicates what color to use at that gradient stop.',
  },
  {
    $: {
      name: 'stop-opacity',
      restriction: 'number(0-1)',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty',
    },
    desc: 'Defines the opacity of a given gradient stop.',
  },
  {
    $: {
      name: 'stroke',
      restriction: 'color, enum, url',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeProperty',
    },
    desc: 'Paints along the outline of the given graphical element.',
    values: {
      value: [
        {
          $: {
            name: 'child',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'A reference to the last child paint server element of the element being painted.',
        },
        {
          $: {
            name: 'child()',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'A reference to the nth child paint server element of the element being painted.',
        },
        {
          $: {
            name: 'context-fill',
            version: '4.0',
            browsers: 'none',
          },
          desc: "The computed value of the 'fill' property of the context element of the element being painted.",
        },
        {
          $: {
            name: 'context-stroke',
            version: '4.0',
            browsers: 'none',
          },
          desc: "The computed value of the 'stroke' property of the context element of the element being painted.",
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: "A URL reference to a paint server element, which is an element that defines a paint server: 'hatch', 'linearGradient', 'mesh', 'pattern', 'radialGradient' and 'solidcolor'.",
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No paint is applied in this layer.',
        },
      ],
    },
  },
  {
    $: {
      name: 'stroke-dasharray',
      restriction: 'length, percentage, number, enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeDasharrayProperty',
    },
    desc: 'Controls the pattern of dashes and gaps used to stroke paths.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Indicates that no dashing is used.',
      },
    },
  },
  {
    $: {
      name: 'stroke-dashoffset',
      restriction: 'percentage, length',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeDashoffsetProperty',
    },
    desc: 'Specifies the distance into the dash pattern to start the dash.',
  },
  {
    $: {
      name: 'stroke-linecap',
      restriction: 'enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeLinecapProperty',
    },
    desc: 'Specifies the shape to be used at the end of open subpaths when they are stroked.',
    values: {
      value: [
        {
          $: {
            name: 'butt',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the stroke for each subpath does not extend beyond its two endpoints.',
        },
        {
          $: {
            name: 'round',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that at each end of each subpath, the shape representing the stroke will be extended by a half circle with a radius equal to the stroke width.',
        },
        {
          $: {
            name: 'square',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that at the end of each subpath, the shape representing the stroke will be extended by a rectangle with the same width as the stroke width and whose length is half of the stroke width.',
        },
      ],
    },
  },
  {
    $: {
      name: 'stroke-linejoin',
      restriction: 'enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeLinejoinProperty',
    },
    desc: 'Specifies the shape to be used at the corners of paths or basic shapes when they are stroked.',
    values: {
      value: [
        {
          $: {
            name: 'arcs',
            version: '4.0',
            browsers: 'none',
          },
          desc: 'Indicates that an arcs corner is to be used to join path segments.',
        },
        {
          $: {
            name: 'bevel',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that a bevelled corner is to be used to join path segments.',
        },
        {
          $: {
            name: 'miter',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that a sharp corner is to be used to join path segments.',
        },
        {
          $: {
            name: 'miter-clip',
            version: '4.0',
            browsers: 'none',
          },
          desc: "Same as miter but if the 'stroke-miterlimit' is exceeded, the miter is clipped at a miter length equal to the 'stroke-miterlimit' value multiplied by the stroke width.",
        },
        {
          $: {
            name: 'round',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that a round corner is to be used to join path segments.',
        },
      ],
    },
  },
  {
    $: {
      name: 'stroke-miterlimit',
      restriction: 'number',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeMiterlimitProperty',
      syntax: 'path { $(name): 4; }',
    },
    desc: "When two line segments meet at a sharp angle and miter joins have been specified for 'stroke-linejoin', it is possible for the miter to extend far beyond the thickness of the line stroking the path.",
  },
  {
    $: {
      name: 'stroke-opacity',
      restriction: 'number(0-1)',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeOpacityProperty',
    },
    desc: 'Specifies the opacity of the painting operation used to stroke the current object.',
  },
  {
    $: {
      name: 'stroke-width',
      restriction: 'percentage, length',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#StrokeWidth',
    },
    desc: 'Specifies the width of the stroke on the current object.',
  },
  {
    $: {
      name: 'suffix',
      restriction: 'image, string, identifier',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-suffix',
      syntax: "@counter-style { suffix: '\\2E\\20'; }",
    },
    desc: '@counter-style descriptor. Specifies a <symbol> that is appended to the marker representation.',
  },
  {
    $: {
      name: 'system',
      restriction: 'enum, integer',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-system',
      syntax: '@counter-style triangle { system: cyclic; }',
    },
    desc: "@counter-style descriptor. Specifies which algorithm will be used to construct the counter's representation based on the counter value.",
    values: {
      value: [
        {
          $: {
            name: 'additive',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Represents "sign-value" numbering systems, which, rather than using reusing digits in different positions to change their value, define additional digits with much larger values, so that the value of the number can be obtained by adding all the digits together.',
        },
        {
          $: {
            name: 'alphabetic',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Interprets the list of counter symbols as digits to an alphabetic numbering system, similar to the default lower-alpha counter style, which wraps from "a", "b", "c", to "aa", "ab", "ac".',
        },
        {
          $: {
            name: 'cyclic',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Cycles repeatedly through its provided symbols, looping back to the beginning when it reaches the end of the list.',
        },
        {
          $: {
            name: 'extends',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Use the algorithm of another counter style, but alter other aspects.',
        },
        {
          $: {
            name: 'fixed',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Runs through its list of counter symbols once, then falls back.',
        },
        {
          $: {
            name: 'numeric',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'interprets the list of counter symbols as digits to a "place-value" numbering system, similar to the default \'decimal\' counter style.',
        },
        {
          $: {
            name: 'symbolic',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Cycles repeatedly through its provided symbols, doubling, tripling, etc. the symbols on each successive pass through the list.',
        },
      ],
    },
  },
  {
    $: {
      name: 'symbols',
      restriction: 'image, string, identifier',
      version: '3.0',
      browsers: 'FF33',
      ref: 'http://www.w3.org/TR/css-counter-styles-3/#descdef-counter-style-symbols',
      syntax: "@counter-style { symbols: '*' ⁑ † ‡; }",
    },
    desc: '@counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor.',
  },
  {
    $: {
      name: 'table-layout',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/CSS2/tables.html#width-layout',
      syntax: 'table { $(name): fixed; }',
    },
    desc: 'Controls the algorithm used to lay out the table cells, rows, and columns.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Use any automatic table layout algorithm.',
        },
        {
          $: {
            name: 'fixed',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Use the fixed table layout algorithm.',
        },
      ],
    },
  },
  {
    $: {
      name: 'tab-size',
      restriction: 'integer, length',
      version: '3.0',
      browsers: 'C21,O15,S6.1',
      ref: 'http://www.w3.org/TR/css3-text/#tab-size',
      syntax: 'div { $(name): 4; }',
    },
    desc: 'Determines the width of the tab character (U+0009), in space characters (U+0020), when rendered.',
  },
  {
    $: {
      name: 'text-align',
      restriction: 'string',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-text/#text-align0',
      syntax: 'h2 { $(name): center; }',
    },
    desc: 'Describes how inline contents of a block are horizontally aligned if the contents do not completely fill the line box.',
    values: {
      value: [
        {
          $: {
            name: 'center',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The inline contents are centered within the line box.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'C,FF3.6,O15,S3.1',
          },
          desc: 'The inline contents are aligned to the end edge of the line box.',
        },
        {
          $: {
            name: 'justify',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The text is justified according to the method specified by the 'text-justify' property.",
        },
        {
          $: {
            name: 'left',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
        },
        {
          $: {
            name: 'match-parent',
            version: '3.0',
            browsers: 'none',
          },
          desc: "This value behaves the same as 'inherit' except that an inherited value of 'start' or 'end' is calculated against its parent's 'direction' value.",
        },
        {
          $: {
            name: 'right',
            version: '1.0',
            browsers: 'all',
          },
          desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'C,FF1,O15,S3.1',
          },
          desc: 'The inline contents are aligned to the start edge of the line box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-align-last',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,FF12,IE5',
      ref: 'http://www.w3.org/TR/css3-text/#text-align-last0',
      syntax: 'div { $(name): right; }',
    },
    desc: "Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Content on the affected line is aligned per 'text-align' unless 'text-align' is set to 'justify', in which case it is 'start-aligned'.",
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The inline contents are centered within the line box.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'The inline contents are aligned to the end edge of the line box.',
        },
        {
          $: {
            name: 'justify',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The text is justified according to the method specified by the 'text-justify' property.",
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text.",
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text.",
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'The inline contents are aligned to the start edge of the line box.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-anchor',
      restriction: 'enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/SVG2/text.html#TextAnchorProperty',
    },
    desc: 'Used to align (start-, middle- or end-alignment) a string of text relative to a given point.',
    values: {
      value: [
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The rendered characters are aligned such that the end of the resulting rendered text is at the initial current text position.',
        },
        {
          $: {
            name: 'middle',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The rendered characters are aligned such that the geometric middle of the resulting rendered text is at the initial current text position.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The rendered characters are aligned such that the start of the resulting rendered text is at the initial current text position.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-decoration',
      restriction: 'enum, color',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-style',
      syntax: 'a:visited { $(name): line-through; }',
    },
    desc: "Decorations applied to font used for an element's text.",
    values: {
      value: [
        {
          $: {
            name: 'dashed',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Produces a dashed line style.',
        },
        {
          $: {
            name: 'dotted',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Produces a dotted line.',
        },
        {
          $: {
            name: 'double',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Produces a double line.',
        },
        {
          $: {
            name: 'line-through',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Each line of text has a line through the middle.',
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Produces no line.',
        },
        {
          $: {
            name: 'overline',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Each line of text has a line above it.',
        },
        {
          $: {
            name: 'solid',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Produces a solid line.',
        },
        {
          $: {
            name: 'underline',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Each line of text is underlined.',
        },
        {
          $: {
            name: 'wavy',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Produces a wavy line.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-decoration-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'FF36,C57,O44',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-color',
      syntax: 'div { $(name): #ff0; }',
    },
    desc: 'Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line.',
  },
  {
    $: {
      name: 'text-decoration-line',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF36',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-line',
      syntax: 'div { $(name): underline; }',
    },
    desc: 'Specifies what line decorations, if any, are added to the element.',
    values: {
      value: [
        {
          $: {
            name: 'line-through',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each line of text has a line through the middle.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither produces nor inhibits text decoration.',
        },
        {
          $: {
            name: 'overline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each line of text has a line above it.',
        },
        {
          $: {
            name: 'underline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Each line of text is underlined.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-decoration-style',
      restriction: 'enum',
      version: '3.0',
      browsers: 'FF36',
      ref: 'http://www.w3.org/TR/css-text-decor-3/#text-decoration-style',
      syntax: 'div { $(name): solid; }',
    },
    desc: 'Specifies the line style for underline, line-through and overline text decoration.',
    values: {
      value: [
        {
          $: {
            name: 'dashed',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a dashed line style.',
        },
        {
          $: {
            name: 'dotted',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a dotted line.',
        },
        {
          $: {
            name: 'double',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a double line.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces no line.',
        },
        {
          $: {
            name: 'solid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a solid line.',
        },
        {
          $: {
            name: 'wavy',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Produces a wavy line.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-indent',
      restriction: 'percentage, length',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-text/#text-indent0',
      syntax: 'li { $(name): 5px; }',
    },
    desc: "Specifies the indentation applied to lines of inline content in a block. The indentation only affects the first line of inline content in the block unless the 'hanging' keyword is specified, in which case it affects all lines except the first.",
    values: {
      value: [
        {
          $: {
            name: 'each-line',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Indentation affects the first line of the block container as well as each line after a forced line break, but does not affect lines after a text wrap break.',
        },
        {
          $: {
            name: 'hanging',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Inverts which lines are affected.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-orientation',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,O15,S5.1',
      ref: 'http://www.w3.org/TR/css-writing-modes-3/#text-orientation',
      syntax: 'span { $(name): mixed; }',
    },
    desc: 'Specifies the orientation of text within a line.',
    values: {
      value: [
        {
          $: {
            name: 'mixed',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'In vertical writing modes, characters from horizontal-only scripts are set sideways, i.e. 90° clockwise from their standard orientation in horizontal text.',
        },
        {
          $: {
            name: 'sideways',
            version: '3.0',
            browsers: 'C25,O15,S6.1',
          },
          desc: "This value is equivalent to 'sideways-right' in 'vertical-rl' writing mode and equivalent to 'sideways-left' in 'vertical-lr' writing mode.",
        },
        {
          $: {
            name: 'sideways-left',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'In vertical writing modes, this causes text to be set as if in a horizontal layout, but rotated 90° counter-clockwise.',
        },
        {
          $: {
            name: 'sideways-right',
            version: '3.0',
            browsers: 'C25,O15,S6.1',
          },
          desc: 'In vertical writing modes, this causes text to be set as if in a horizontal layout, but rotated 90° clockwise.',
        },
        {
          $: {
            name: 'upright',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'In vertical writing modes, characters from horizontal-only scripts are rendered upright, i.e. in their standard horizontal orientation.',
        },
        {
          $: {
            name: 'use-glyph-orientation',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'This value deprecated and only applies to SVG.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-overflow',
      restriction: 'enum, string',
      version: '3.0',
      browsers: 'E,C,FF9,IE5.5,O11.6,S2',
      ref: 'http://www.w3.org/TR/css3-ui/#text-overflow0',
      syntax: 'span { $(name): ellipsis; }',
    },
    desc: 'Text can overflow for example when it is prevented from wrapping.',
    values: {
      value: [
        {
          $: {
            name: 'clip',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Clip inline content that overflows. Characters may be only partially rendered.',
        },
        {
          $: {
            name: 'ellipsis',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Render an ellipsis character (U+2026) to represent clipped inline content.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-rendering',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,FF3,O9,S5',
      ref: 'http://www.w3.org/TR/SVG2/painting.html#TextRenderingProperty',
    },
    desc: "The creator of SVG content might want to provide a hint to the implementation about what tradeoffs to make as it renders text. The 'text-rendering' property provides these hints.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'geometricPrecision',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the user agent shall emphasize geometric precision over legibility and rendering speed.',
        },
        {
          $: {
            name: 'optimizeLegibility',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the user agent shall emphasize legibility over rendering speed and geometric precision.',
        },
        {
          $: {
            name: 'optimizeSpeed',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the user agent shall emphasize rendering speed over legibility and geometric precision.',
        },
      ],
    },
  },
  {
    $: {
      name: 'text-shadow',
      restriction: 'length, color',
      version: '3.0',
      browsers: 'E,C,FF3.6,IE10,O9.5,S1.1',
      ref: 'http://www.w3.org/TR/css3-text/#text-shadow0',
      syntax: 'h1 { $(name): 20px 12px 2px #333;}',
    },
    desc: 'Enables shadow effects to be applied to the text of the element.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No shadow.',
      },
    },
  },
  {
    $: {
      name: 'text-transform',
      restriction: 'enum',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-text/#text-transform0',
      syntax: 'h1 { $(name): capitalize; }',
    },
    desc: "Controls capitalization effects of an element's text.",
    values: {
      value: [
        {
          $: {
            name: 'capitalize',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Puts the first typographic letter unit of each word in titlecase.',
        },
        {
          $: {
            name: 'full-width',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Puts all characters in fullwidth form. If the character does not have corresponding fullwidth form, it is left as is.',
        },
        {
          $: {
            name: 'lowercase',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Puts all letters in lowercase.',
        },
        {
          $: {
            name: 'none',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'No effects.',
        },
        {
          $: {
            name: 'uppercase',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Puts all letters in uppercase.',
        },
      ],
    },
  },
  {
    $: {
      name: 'top',
      restriction: 'length, percentage',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-positioning/#propdef-top',
      syntax: 'article { $(name): 50px; }',
    },
    desc: "Specifies how far an absolutely positioned box's top margin edge is offset below the top edge of the box's 'containing block'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '2.0',
          browsers: 'all',
        },
        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well",
      },
    },
  },
  {
    $: {
      name: 'touch-action',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C36,IE11,O23',
      ref: 'http://www.w3.org/TR/pointerevents/#the-touch-action-css-property',
      syntax: 'div { $(name): pan-x; }',
    },
    desc: 'Determines whether touch input may trigger default behavior supplied by user agent.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The user agent may determine any permitted touch behaviors for touches that begin on the element.',
        },
        {
          $: {
            name: 'cross-slide-x',
            version: '3.0',
            browsers: 'E,IE11',
          },
        },
        {
          $: {
            name: 'cross-slide-y',
            version: '3.0',
            browsers: 'E,IE11',
          },
        },
        {
          $: {
            name: 'double-tap-zoom',
            version: '3.0',
            browsers: 'E,IE11',
          },
        },
        {
          $: {
            name: 'manipulation',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The user agent may consider touches that begin on the element only for the purposes of scrolling and continuous zooming.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Touches that begin on the element must not trigger default touch behaviors.',
        },
        {
          $: {
            name: 'pan-x',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The user agent may consider touches that begin on the element only for the purposes of horizontally scrolling the element's nearest ancestor with horizontally scrollable content.",
        },
        {
          $: {
            name: 'pan-y',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The user agent may consider touches that begin on the element only for the purposes of vertically scrolling the element's nearest ancestor with vertically scrollable content.",
        },
        {
          $: {
            name: 'pinch-zoom',
            version: '3.0',
            browsers: 'E,IE11',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'transform',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C36,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-transforms/#transform-property',
      syntax: 'div { $(name): rotate(-90deg); }',
    },
    desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
    values: {
      value: [
        {
          $: {
            name: 'matrix()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]',
        },
        {
          $: {
            name: 'matrix3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'perspective()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a perspective projection matrix.',
        },
        {
          $: {
            name: 'rotate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.',
        },
        {
          $: {
            name: 'rotate3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.',
        },
        {
          $: {
            name: "rotateX('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the X axis.',
        },
        {
          $: {
            name: "rotateY('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the Y axis.',
        },
        {
          $: {
            name: "rotateZ('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the Z axis.',
        },
        {
          $: {
            name: 'scale()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.',
        },
        {
          $: {
            name: 'scale3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.',
        },
        {
          $: {
            name: 'scaleX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.',
        },
        {
          $: {
            name: 'scaleY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.',
        },
        {
          $: {
            name: 'scaleZ()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.',
        },
        {
          $: {
            name: 'skew()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).',
        },
        {
          $: {
            name: 'skewX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the X axis by the given angle.',
        },
        {
          $: {
            name: 'skewY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the Y axis by the given angle.',
        },
        {
          $: {
            name: 'translate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.',
        },
        {
          $: {
            name: 'translate3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.',
        },
        {
          $: {
            name: 'translateX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the X direction.',
        },
        {
          $: {
            name: 'translateY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the Y direction.',
        },
        {
          $: {
            name: 'translateZ()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.',
        },
      ],
    },
  },
  {
    $: {
      name: 'transform-origin',
      restriction: 'position, length, percentage',
      version: '3.0',
      browsers: 'E,C36,FF16,IE10,O12.1,S9',
      ref: 'http://www.w3.org/TR/css3-transforms/#propdef-transform-origin',
      syntax: '.album { $(name): 20% 40%; }',
    },
    desc: 'Establishes the origin of transformation for an element.',
  },
  {
    $: {
      name: 'transform-style',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C36,FF16,IE10,O23,S9',
      ref: 'http://www.w3.org/TR/css3-transforms/#propdef-transform-style',
      syntax: 'div { $(name): flat; }',
    },
    desc: 'Defines how nested elements are rendered in 3D space.',
    values: {
      value: [
        {
          $: {
            name: 'flat',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All children of this element are rendered flattened into the 2D plane of the element.',
        },
        {
          $: {
            name: 'preserve-3d',
            version: '3.0',
            browsers: 'E,C36,FF16,O23,S9',
          },
          desc: 'Flattening is not performed, so children maintain their position in 3D space.',
        },
      ],
    },
  },
  {
    $: {
      name: 'transition',
      restriction: 'time, property, timing-function, enum',
      version: '3.0',
      browsers: 'E,FF16,IE10,O12.5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition',
      syntax: 'div { $(name): background-color linear 1s; }',
    },
    desc: 'Shorthand property combines four of the transition properties into a single property.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Every property that is able to undergo a transition will do so.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No property will transition.',
        },
      ],
    },
  },
  {
    $: {
      name: 'transition-delay',
      restriction: 'time',
      version: '3.0',
      browsers: 'E,FF16,IE10,O12.5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-delay',
      syntax: 'div { $(name): 1s; }',
    },
    desc: 'Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.',
  },
  {
    $: {
      name: 'transition-duration',
      restriction: 'time',
      version: '3.0',
      browsers: 'E,FF16,IE10,O12.5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-duration',
      syntax: 'div { $(name): 1s; }',
    },
    desc: 'Specifies how long the transition from the old value to the new value should take.',
  },
  {
    $: {
      name: 'transition-property',
      restriction: 'property',
      version: '3.0',
      browsers: 'E,FF16,IE10,O12.5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-property',
      syntax: 'div { $(name): background-color; }',
    },
    desc: 'Specifies the name of the CSS property to which the transition is applied.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Every property that is able to undergo a transition will do so.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No property will transition.',
        },
      ],
    },
  },
  {
    $: {
      name: 'transition-timing-function',
      restriction: 'timing-function',
      version: '3.0',
      browsers: 'E,FF16,IE10,O12.5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-timing-function',
      syntax: 'div { $(name): linear; }',
    },
    desc: 'Describes how the intermediate values used during a transition will be calculated.',
  },
  {
    $: {
      name: 'unicode-bidi',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-writing-modes-3/#unicode-bidi',
      syntax: 'p { $(name): embed; }',
    },
    desc: 'The level of embedding with respect to the bidirectional algorithm.',
    values: {
      value: [
        {
          $: {
            name: 'bidi-override',
            version: '2.0',
            browsers: 'all',
          },
          desc: "Inside the element, reordering is strictly in sequence according to the 'direction' property; the implicit part of the bidirectional algorithm is ignored.",
        },
        {
          $: {
            name: 'embed',
            version: '2.0',
            browsers: 'all',
          },
          desc: "If the element is inline-level, this value opens an additional level of embedding with respect to the bidirectional algorithm. The direction of this embedding level is given by the 'direction' property.",
        },
        {
          $: {
            name: 'isolate',
            version: '3.0',
            browsers: 'C,FF10,O15,S5.1',
          },
          desc: 'The contents of the element are considered to be inside a separate, independent paragraph.',
        },
        {
          $: {
            name: 'isolate-override',
            version: '3.0',
            browsers: 'C,FF17,O15,S6.1',
          },
          desc: "This combines the isolation behavior of 'isolate' with the directional override behavior of 'bidi-override'",
        },
        {
          $: {
            name: 'normal',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The element does not open an additional level of embedding with respect to the bidirectional algorithm. For inline-level elements, implicit reordering works across element boundaries.',
        },
        {
          $: {
            name: 'plaintext',
            version: '3.0',
            browsers: 'C,FF10,O15,S6',
          },
          desc: "For the purposes of the Unicode bidirectional algorithm, the base directionality of each bidi paragraph for which the element forms the containing block is determined not by the element's computed 'direction'.",
        },
      ],
    },
  },
  {
    $: {
      name: 'unicode-range',
      restriction: 'unicode-range',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-fonts/#unicode-range-desc',
      syntax: '@font-face { $(name): U+26; }',
    },
    desc: '@font-face descriptor. Defines the set of Unicode codepoints that may be supported by the font face for which it is declared.',
    values: {
      value: [
        {
          $: {
            name: 'U+26',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ampersand.',
        },
        {
          $: {
            name: 'U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00-FB4F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'WGL4 character set (Pan-European).',
        },
        {
          $: {
            name: 'U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The Multilingual European Subset No. 1. Latin. Covers ~44 languages.',
        },
        {
          $: {
            name: 'U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The Multilingual European Subset No. 2. Latin, Greek, and Cyrillic. Covers ~128 language.',
        },
        {
          $: {
            name: 'U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The Multilingual European Subset No. 3. Covers all characters belonging to European scripts.',
        },
        {
          $: {
            name: 'U+00-7F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Basic Latin (ASCII).',
        },
        {
          $: {
            name: 'U+80-FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Latin-1 Supplement. Accented characters for Western European languages, common punctuation characters, multiplication and division signs.',
        },
        {
          $: {
            name: 'U+100-17F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Latin Extended-A. Accented characters for for Czech, Dutch, Polish, and Turkish.',
        },
        {
          $: {
            name: 'U+180-24F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Latin Extended-B. Croatian, Slovenian, Romanian, Non-European and historic latin, Khoisan, Pinyin, Livonian, Sinology.',
        },
        {
          $: {
            name: 'U+1E00-1EFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Latin Extended Additional. Vietnamese, German captial sharp s, Medievalist, Latin general use.',
        },
        {
          $: {
            name: 'U+250-2AF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'International Phonetic Alphabet Extensions.',
        },
        {
          $: {
            name: 'U+370-3FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Greek and Coptic.',
        },
        {
          $: {
            name: 'U+1F00-1FFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Greek Extended. Accented characters for polytonic Greek.',
        },
        {
          $: {
            name: 'U+400-4FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Cyrillic.',
        },
        {
          $: {
            name: 'U+500-52F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Cyrillic Supplement. Extra letters for Komi, Khanty, Chukchi, Mordvin, Kurdish, Aleut, Chuvash, Abkhaz, Azerbaijani, and Orok.',
        },
        {
          $: {
            name: 'U+00-52F, U+1E00-1FFF, U+2200-22FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Latin, Greek, Cyrillic, some punctuation and symbols.',
        },
        {
          $: {
            name: 'U+530-58F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Armenian.',
        },
        {
          $: {
            name: 'U+590-5FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Hebrew.',
        },
        {
          $: {
            name: 'U+600-6FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Arabic.',
        },
        {
          $: {
            name: 'U+750-77F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Arabic Supplement. Additional letters for African languages, Khowar, Torwali, Burushaski, and early Persian.',
        },
        {
          $: {
            name: 'U+8A0-8FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Arabic Extended-A. Additional letters for African languages, European and Central Asian languages, Rohingya, Tamazight, Arwi, and Koranic annotation signs.',
        },
        {
          $: {
            name: 'U+700-74F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Syriac.',
        },
        {
          $: {
            name: 'U+900-97F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Devanagari.',
        },
        {
          $: {
            name: 'U+980-9FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Bengali.',
        },
        {
          $: {
            name: 'U+A00-A7F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Gurmukhi.',
        },
        {
          $: {
            name: 'U+A80-AFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Gujarati.',
        },
        {
          $: {
            name: 'U+B00-B7F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Oriya.',
        },
        {
          $: {
            name: 'U+B80-BFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Tamil.',
        },
        {
          $: {
            name: 'U+C00-C7F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Telugu.',
        },
        {
          $: {
            name: 'U+C80-CFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Kannada.',
        },
        {
          $: {
            name: 'U+D00-D7F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Malayalam.',
        },
        {
          $: {
            name: 'U+D80-DFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Sinhala.',
        },
        {
          $: {
            name: 'U+118A0-118FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Warang Citi.',
        },
        {
          $: {
            name: 'U+E00-E7F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Thai.',
        },
        {
          $: {
            name: 'U+1A20-1AAF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Tai Tham.',
        },
        {
          $: {
            name: 'U+AA80-AADF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Tai Viet.',
        },
        {
          $: {
            name: 'U+E80-EFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lao.',
        },
        {
          $: {
            name: 'U+F00-FFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Tibetan.',
        },
        {
          $: {
            name: 'U+1000-109F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Myanmar (Burmese).',
        },
        {
          $: {
            name: 'U+10A0-10FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Georgian.',
        },
        {
          $: {
            name: 'U+1200-137F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ethiopic.',
        },
        {
          $: {
            name: 'U+1380-139F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ethiopic Supplement. Extra Syllables for Sebatbeit, and Tonal marks',
        },
        {
          $: {
            name: 'U+2D80-2DDF',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Ethiopic Extended. Extra Syllables for Me'en, Blin, and Sebatbeit.",
        },
        {
          $: {
            name: 'U+AB00-AB2F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Ethiopic Extended-A. Extra characters for Gamo-Gofa-Dawro, Basketo, and Gumuz.',
        },
        {
          $: {
            name: 'U+1780-17FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Khmer.',
        },
        {
          $: {
            name: 'U+1800-18AF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Mongolian.',
        },
        {
          $: {
            name: 'U+1B80-1BBF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Sundanese.',
        },
        {
          $: {
            name: 'U+1CC0-1CCF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Sundanese Supplement. Punctuation.',
        },
        {
          $: {
            name: 'U+4E00-9FD5',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'CJK (Chinese, Japanese, Korean) Unified Ideographs. Most common ideographs for modern Chinese and Japanese.',
        },
        {
          $: {
            name: 'U+3400-4DB5',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'CJK Unified Ideographs Extension A. Rare ideographs.',
        },
        {
          $: {
            name: 'U+2F00-2FDF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Kangxi Radicals.',
        },
        {
          $: {
            name: 'U+2E80-2EFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'CJK Radicals Supplement. Alternative forms of Kangxi Radicals.',
        },
        {
          $: {
            name: 'U+1100-11FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Hangul Jamo.',
        },
        {
          $: {
            name: 'U+AC00-D7AF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Hangul Syllables.',
        },
        {
          $: {
            name: 'U+3040-309F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Hiragana.',
        },
        {
          $: {
            name: 'U+30A0-30FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Katakana.',
        },
        {
          $: {
            name: 'U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Japanese Kanji, Hiragana and Katakana characters plus Yen/Yuan symbol.',
        },
        {
          $: {
            name: 'U+A4D0-A4FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lisu.',
        },
        {
          $: {
            name: 'U+A000-A48F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Yi Syllables.',
        },
        {
          $: {
            name: 'U+A490-A4CF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Yi Radicals.',
        },
        {
          $: {
            name: 'U+2000-206F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'General Punctuation.',
        },
        {
          $: {
            name: 'U+3000-303F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'CJK Symbols and Punctuation.',
        },
        {
          $: {
            name: 'U+2070-209F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Superscripts and Subscripts.',
        },
        {
          $: {
            name: 'U+20A0-20CF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Currency Symbols.',
        },
        {
          $: {
            name: 'U+2100-214F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Letterlike Symbols.',
        },
        {
          $: {
            name: 'U+2150-218F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Number Forms.',
        },
        {
          $: {
            name: 'U+2190-21FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Arrows.',
        },
        {
          $: {
            name: 'U+2200-22FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Mathematical Operators.',
        },
        {
          $: {
            name: 'U+2300-23FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Miscellaneous Technical.',
        },
        {
          $: {
            name: 'U+E000-F8FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Private Use Area.',
        },
        {
          $: {
            name: 'U+FB00-FB4F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Alphabetic Presentation Forms. Ligatures for latin, Armenian, and Hebrew.',
        },
        {
          $: {
            name: 'U+FB50-FDFF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Arabic Presentation Forms-A. Contextual forms / ligatures for Persian, Urdu, Sindhi, Central Asian languages, etc, Arabic pedagogical symbols, word ligatures.',
        },
        {
          $: {
            name: 'U+1F600-1F64F',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Emoji: Emoticons.',
        },
        {
          $: {
            name: 'U+2600-26FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Emoji: Miscellaneous Symbols.',
        },
        {
          $: {
            name: 'U+1F300-1F5FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Emoji: Miscellaneous Symbols and Pictographs.',
        },
        {
          $: {
            name: 'U+1F900-1F9FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Emoji: Supplemental Symbols and Pictographs.',
        },
        {
          $: {
            name: 'U+1F680-1F6FF',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Emoji: Transport and Map Symbols.',
        },
      ],
    },
  },
  {
    $: {
      name: 'user-select',
      restriction: 'enum',
      version: '3.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css-ui-4/#propdef-user-select',
      syntax: 'div { $(name): text; }',
    },
    desc: 'Controls the appearance of selection.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The content of the element must be selected atomically',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'contain',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'UAs must not allow a selection which is started in this element to be extended outside of this element.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The UA must not allow selections to be started in this element.',
        },
        {
          $: {
            name: 'text',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The element imposes no constraint on the selection.',
        },
      ],
    },
  },
  {
    $: {
      name: 'vertical-align',
      restriction: 'percentage, length',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-linebox/#vertical-align',
      syntax: 'div { $(name): middle; }',
    },
    desc: 'Affects the vertical positioning of the inline boxes generated by an inline-level element inside a line box.',
    values: {
      value: [
        {
          $: {
            name: 'alphabetic',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Match the box's alphabetic baseline to that of its parent.",
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Align the dominant baseline of the parent box with the equivalent, or heuristically reconstructed, baseline of the element inline box.',
        },
        {
          $: {
            name: 'baseline',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Align the 'alphabetic' baseline of the element with the 'alphabetic' baseline of the parent element.",
        },
        {
          $: {
            name: 'bottom',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Align the after edge of the extended inline box with the after-edge of the line box.',
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Align the center of the aligned subtree with the center of the line box.',
        },
        {
          $: {
            name: 'central',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Align the 'central' baseline of the inline element with the central baseline of the parent.",
        },
        {
          $: {
            name: 'mathematical',
            version: '3.0',
            browsers: 'none',
          },
          desc: "Match the box's mathematical baseline to that of its parent.",
        },
        {
          $: {
            name: 'middle',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Align the 'middle' baseline of the inline element with the middle baseline of the parent.",
        },
        {
          $: {
            name: 'sub',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Lower the baseline of the box to the proper position for subscripts of the parent's box. (This value has no effect on the font size of the element's text.)",
        },
        {
          $: {
            name: 'super',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Raise the baseline of the box to the proper position for superscripts of the parent's box. (This value has no effect on the font size of the element's text.)",
        },
        {
          $: {
            name: 'text-bottom',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Align the bottom of the box with the after-edge of the parent element's font.",
        },
        {
          $: {
            name: 'text-top',
            version: '1.0',
            browsers: 'all',
          },
          desc: "Align the top of the box with the before-edge of the parent element's font.",
        },
        {
          $: {
            name: 'top',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'Align the before edge of the extended inline box with the before-edge of the line box.',
        },
        {
          $: {
            name: '-webkit-baseline-middle',
            version: '2.0',
            browsers: 'C,S1',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'visibility',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#visibility',
      syntax: 'img { $(name): hidden; }',
    },
    desc: "Specifies whether the boxes generated by an element are rendered. Invisible boxes still affect layout (set the 'display' property to 'none' to suppress box generation altogether).",
    values: {
      value: [
        {
          $: {
            name: 'collapse',
            version: '2.0',
            browsers: 'all',
          },
          desc: "Table-specific. If used on elements other than rows, row groups, columns, or column groups, 'collapse' has the same meaning as 'hidden'.",
        },
        {
          $: {
            name: 'hidden',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The generated box is invisible (fully transparent, nothing is drawn), but still affects layout.',
        },
        {
          $: {
            name: 'visible',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'The generated box is visible.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-animation',
      restriction: 'time, enum, timing-function, identifier, number',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation',
      syntax: 'div { $(name): movearound 4s ease 3 normal; }',
    },
    desc: 'Shorthand property combines six of the animation properties into a single property.',
    values: {
      value: [
        {
          $: {
            name: 'alternate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.',
        },
        {
          $: {
            name: 'alternate-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.',
        },
        {
          $: {
            name: 'backwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
        },
        {
          $: {
            name: 'both',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Both forwards and backwards fill modes are applied.',
        },
        {
          $: {
            name: 'forwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.',
        },
        {
          $: {
            name: 'infinite',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Causes the animation to repeat forever.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No animation is performed',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Normal playback.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All iterations of the animation are played in the reverse direction from the way they were specified.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-animation-delay',
      restriction: 'time',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-delay',
      syntax: 'div { $(name): 4s; }',
    },
    desc: 'Defines when the animation will start.',
  },
  {
    $: {
      name: '-webkit-animation-direction',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-direction',
      syntax: 'div { $(name): normal; }',
    },
    desc: 'Defines whether or not the animation should play in reverse on alternate cycles.',
    values: {
      value: [
        {
          $: {
            name: 'alternate',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.',
        },
        {
          $: {
            name: 'alternate-reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Normal playback.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All iterations of the animation are played in the reverse direction from the way they were specified.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-animation-duration',
      restriction: 'time',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-duration',
      syntax: 'div { $(name): 4s; }',
    },
    desc: 'Defines the length of time that an animation takes to complete one cycle.',
  },
  {
    $: {
      name: '-webkit-animation-fill-mode',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-fill-mode-property',
      syntax: 'div { $(name): forwards; }',
    },
    desc: 'Defines what values are applied by the animation outside the time it is executing.',
    values: {
      value: [
        {
          $: {
            name: 'backwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: "The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
        },
        {
          $: {
            name: 'both',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Both forwards and backwards fill modes are applied.',
        },
        {
          $: {
            name: 'forwards',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-animation-iteration-count',
      restriction: 'number, enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-iteration-count',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.',
    values: {
      value: {
        $: {
          name: 'infinite',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'Causes the animation to repeat forever.',
      },
    },
  },
  {
    $: {
      name: '-webkit-animation-name',
      restriction: 'identifier, enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#the-animation-name-property-',
      syntax: 'div { $(name): movearound; }',
    },
    desc: 'Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No animation is performed',
      },
    },
  },
  {
    $: {
      name: '-webkit-animation-play-state',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-play-state',
      syntax: 'div { $(name): running; }',
    },
    desc: 'Defines whether the animation is running or paused.',
    values: {
      value: [
        {
          $: {
            name: 'paused',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A running animation will be paused.',
        },
        {
          $: {
            name: 'running',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Resume playback of a paused animation.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-animation-timing-function',
      restriction: 'timing-function',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-animations/#animation-timing-function',
      syntax: 'div { $(name): ease; }',
    },
    desc: "Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
  },
  {
    $: {
      name: '-webkit-appearance',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-appearance',
      syntax: 'h3 { $(name): button; }',
    },
    desc: 'Changes the appearance of buttons and other controls to resemble native controls.',
    values: {
      value: [
        {
          $: {
            name: 'button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'button-bevel',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'caps-lock-indicator',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'caret',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'checkbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'default-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'listbox',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'listitem',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-fullscreen-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-mute-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-play-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-seek-back-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-seek-forward-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-slider',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'media-sliderthumb',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist-text',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'menulist-textfield',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'push-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'radio',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-down',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-left',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-right',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarbutton-up',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbargripper-horizontal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbargripper-vertical',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarthumb-horizontal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbarthumb-vertical',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbartrack-horizontal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'scrollbartrack-vertical',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'searchfield',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'searchfield-cancel-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'searchfield-decoration',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'searchfield-results-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'searchfield-results-decoration',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'slider-horizontal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'sliderthumb-horizontal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'sliderthumb-vertical',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'slider-vertical',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'square-button',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'textarea',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'textfield',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-backdrop-filter',
      restriction: 'enum, url',
      version: '4.0',
      browsers: 'S9',
      ref: 'https://drafts.fxtf.org/filters-2/#propdef-backdrop-filter',
      syntax: 'div { $(name): blur(2px); }',
    },
    desc: "Applies a filter effect where the first filter in the list takes the element's background image as the input image.",
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No filter effects are applied.',
        },
        {
          $: {
            name: 'blur()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a Gaussian blur to the input image.',
        },
        {
          $: {
            name: 'brightness()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a linear multiplier to input image, making it appear more or less bright.',
        },
        {
          $: {
            name: 'contrast()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Adjusts the contrast of the input.',
        },
        {
          $: {
            name: 'drop-shadow()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a drop shadow effect to the input image.',
        },
        {
          $: {
            name: 'grayscale()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Converts the input image to grayscale.',
        },
        {
          $: {
            name: 'hue-rotate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a hue rotation on the input image. ',
        },
        {
          $: {
            name: 'invert()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Inverts the samples in the input image.',
        },
        {
          $: {
            name: 'opacity()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies transparency to the samples in the input image.',
        },
        {
          $: {
            name: 'saturate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Saturates the input image.',
        },
        {
          $: {
            name: 'sepia()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Converts the input image to sepia.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A filter reference to a <filter> element.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-backface-visibility',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#backface-visibility',
      syntax: 'div { $(name): hidden; }',
    },
    desc: "Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
    values: {
      value: [
        {
          $: {
            name: 'hidden',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'visible',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-background-clip',
      restriction: 'box',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-clip',
      syntax: 'header { $(name): border-box; }',
    },
    desc: 'Determines the background painting area.',
  },
  {
    $: {
      name: '-webkit-background-composite',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      syntax: 'div { $(name): padding; }',
    },
    values: {
      value: [
        {
          $: {
            name: 'border',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'padding',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-background-origin',
      restriction: 'box',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-background/#the-background-origin',
      syntax: 'header { $(name): border-box; }',
    },
    desc: "For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
  },
  {
    $: {
      name: '-webkit-border-image',
      restriction: 'length, percentage, number, url, enum',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://www.w3.org/TR/css3-background/#border-image',
      syntax: 'td { $(name): url(border.png) 30 30 round;}',
    },
    desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead.",
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Causes the middle part of the border-image to be preserved.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'repeat',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area.',
        },
        {
          $: {
            name: 'round',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does.',
        },
        {
          $: {
            name: 'space',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The image is stretched to fill the area.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-box-align',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-align',
      syntax: 'div { $(name): end; }',
    },
    desc: 'Specifies the alignment of nested elements within an outer flexible box element.',
    values: {
      value: [
        {
          $: {
            name: 'baseline',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used.',
        },
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Any extra space is divided evenly, with half placed above the child and the other half placed after the child.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element.',
        },
        {
          $: {
            name: 'stretch',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The height of each child is adjusted to that of the containing block.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-box-direction',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-direction',
      syntax: 'div { $(name): reverse; }',
    },
    desc: 'In webkit applications, -webkit-box-direction specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom.',
        },
        {
          $: {
            name: 'reverse',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-box-flex',
      restriction: 'number',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-flex',
      syntax: 'div { $(name): 1; }',
    },
    desc: "Specifies an element's flexibility.",
  },
  {
    $: {
      name: '-webkit-box-flex-group',
      restriction: 'integer',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-flex-group',
      syntax: 'div { $(name): 4; }',
    },
    desc: "Flexible elements can be assigned to flex groups using the 'box-flex-group' property.",
  },
  {
    $: {
      name: '-webkit-box-ordinal-group',
      restriction: 'integer',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-ordinal-group',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group.',
  },
  {
    $: {
      name: '-webkit-box-orient',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-orient',
      syntax: 'div { $(name): vertical; }',
    },
    desc: 'In webkit applications, -webkit-box-orient specifies whether a box lays out its contents horizontally or vertically.',
    values: {
      value: [
        {
          $: {
            name: 'block-axis',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Elements are oriented along the box's axis.",
        },
        {
          $: {
            name: 'horizontal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The box displays its children from left to right in a horizontal line.',
        },
        {
          $: {
            name: 'inline-axis',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Elements are oriented vertically.',
        },
        {
          $: {
            name: 'vertical',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The box displays its children from stacked from top to bottom vertically.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-box-pack',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-box-pack',
      syntax: 'div { $(name): end; }',
    },
    desc: 'Specifies alignment of child elements within the current element in the direction of orientation.',
    values: {
      value: [
        {
          $: {
            name: 'center',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The extra space is divided evenly, with half placed before the first child and the other half placed after the last child.',
        },
        {
          $: {
            name: 'end',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child.',
        },
        {
          $: {
            name: 'justify',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start.',
        },
        {
          $: {
            name: 'start',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-box-reflect',
      restriction: '',
      version: '3.0',
      browsers: 'C,S4',
      ref: 'http://css-infos.net/property/-webkit-box-reflect',
      syntax: 'div { $(name): below 5px; }',
    },
    desc: 'Defines a reflection of a border box.',
    values: {
      value: [
        {
          $: {
            name: 'above',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The reflection appears above the border box.',
        },
        {
          $: {
            name: 'below',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The reflection appears below the border box.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The reflection appears to the left of the border box.',
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The reflection appears to the right of the border box.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-box-sizing',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-ui/#box-sizing',
      syntax: 'div { $(name): content-box; }',
    },
    desc: 'Box Model addition in CSS3.',
    values: {
      value: [
        {
          $: {
            name: 'border-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The specified width and height (and respective min/max properties) on this element determine the border box of the element.',
        },
        {
          $: {
            name: 'content-box',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-break-after',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S7',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-breaks',
      syntax: 'h2 { $(name): column; }',
    },
    desc: 'Describes the page/column break behavior before the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'always',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a column break before/after the generated box.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.',
        },
        {
          $: {
            name: 'page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-break-before',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S7',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-breaks',
      syntax: 'h2 { $(name): column; }',
    },
    desc: 'Describes the page/column break behavior before the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'always',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a column break before/after the generated box.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.',
        },
        {
          $: {
            name: 'page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-break-inside',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S7',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-breaks',
      syntax: 'h2 { $(name): avoid-column; }',
    },
    desc: 'Describes the page/column break behavior inside the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page/column break inside the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page/column break inside the generated box.',
        },
        {
          $: {
            name: 'avoid-column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a column break inside the generated box.',
        },
        {
          $: {
            name: 'avoid-page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break inside the generated box.',
        },
        {
          $: {
            name: 'avoid-region',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-column-break-after',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-breaks',
      syntax: 'h2 { $(name): column; }',
    },
    desc: 'Describes the page/column break behavior before the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'always',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a column break before/after the generated box.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.',
        },
        {
          $: {
            name: 'page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-column-break-before',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-breaks',
      syntax: 'h2 { $(name): column; }',
    },
    desc: 'Describes the page/column break behavior before the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'always',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page/column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a column break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break before/after the generated box.',
        },
        {
          $: {
            name: 'avoid-region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a column break before/after the generated box.',
        },
        {
          $: {
            name: 'left',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a left page.',
        },
        {
          $: {
            name: 'page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Always force a page break before/after the generated box.',
        },
        {
          $: {
            name: 'region',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'right',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Force one or two page breaks before/after the generated box so that the next page is formatted as a right page.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-column-break-inside',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-breaks',
      syntax: 'h2 { $(name): avoid-column; }',
    },
    desc: 'Describes the page/column break behavior inside the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Neither force nor forbid a page/column break inside the generated box.',
        },
        {
          $: {
            name: 'avoid',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page/column break inside the generated box.',
        },
        {
          $: {
            name: 'avoid-column',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a column break inside the generated box.',
        },
        {
          $: {
            name: 'avoid-page',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Avoid a page break inside the generated box.',
        },
        {
          $: {
            name: 'avoid-region',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-column-count',
      restriction: 'integer',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-count',
      syntax: 'div { $(name): 3; }',
    },
    desc: 'Describes the optimal number of columns into which the content of the element will be flowed.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: "Determines the number of columns by the 'column-width' property and the element width.",
      },
    },
  },
  {
    $: {
      name: '-webkit-column-gap',
      restriction: 'length',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-gap0',
      syntax: 'div { $(name): 10px; }',
    },
    desc: 'Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.',
    values: {
      value: {
        $: {
          name: 'normal',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'User agent specific and typically equivalent to 1em.',
      },
    },
  },
  {
    $: {
      name: '-webkit-column-rule',
      restriction: 'length, line-width, line-style, color',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule0',
      syntax: 'header { $(name): 5px solid red;}',
    },
    desc: "This property is a shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
  },
  {
    $: {
      name: '-webkit-column-rule-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-color',
      syntax: 'div { $(name): #ff0; }',
    },
    desc: 'Sets the color of the column rule',
  },
  {
    $: {
      name: '-webkit-column-rule-style',
      restriction: 'line-style',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-style',
      syntax: 'div { $(name): solid; }',
    },
    desc: 'Sets the style of the rule between columns of an element.',
  },
  {
    $: {
      name: '-webkit-column-rule-width',
      restriction: 'length, line-width',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-rule-width',
      syntax: 'div { $(name): 3px; }',
    },
    desc: 'Sets the width of the rule between columns. Negative values are not allowed.',
  },
  {
    $: {
      name: '-webkit-columns',
      restriction: 'length, integer',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#columns0',
      syntax: 'div { $(name): 100px 3; }',
    },
    desc: "A shorthand property which sets both 'column-width' and 'column-count'.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The width depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: '-webkit-column-span',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-span0',
      syntax: 'article { $(name): all; }',
    },
    desc: 'Describes the page/column break behavior after the generated box.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'The element does not span multiple columns.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-column-width',
      restriction: 'length',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://www.w3.org/TR/css3-multicol/#column-width',
      syntax: 'div { $(name): 100px; }',
    },
    desc: 'This property describes the width of columns in multicol elements.',
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The width depends on the values of other properties.',
      },
    },
  },
  {
    $: {
      name: '-webkit-filter',
      restriction: 'enum, url',
      version: '3.0',
      browsers: 'C18,O15,S6',
      ref: 'http://www.w3.org/TR/filter-effects/#propdef-filter',
      syntax: 'img { $(name): blur(3px); }',
    },
    desc: "Processes an element's rendering before it is displayed in the document, by applying one or more filter effects.",
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No filter effects are applied.',
        },
        {
          $: {
            name: 'blur()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a Gaussian blur to the input image.',
        },
        {
          $: {
            name: 'brightness()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a linear multiplier to input image, making it appear more or less bright.',
        },
        {
          $: {
            name: 'contrast()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Adjusts the contrast of the input.',
        },
        {
          $: {
            name: 'drop-shadow()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a drop shadow effect to the input image.',
        },
        {
          $: {
            name: 'grayscale()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Converts the input image to grayscale.',
        },
        {
          $: {
            name: 'hue-rotate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies a hue rotation on the input image. ',
        },
        {
          $: {
            name: 'invert()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Inverts the samples in the input image.',
        },
        {
          $: {
            name: 'opacity()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Applies transparency to the samples in the input image.',
        },
        {
          $: {
            name: 'saturate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Saturates the input image.',
        },
        {
          $: {
            name: 'sepia()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Converts the input image to sepia.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'A filter reference to a <filter> element.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-flow-from',
      restriction: 'identifier',
      version: '3.0',
      browsers: 'S6.1',
      ref: 'http://www.w3.org/TR/css3-regions/#flow-from',
      syntax: 'div { $(name): identifier; }',
    },
    desc: 'Makes a block container a region and associates it with a named flow.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The block container is not a CSS Region.',
      },
    },
  },
  {
    $: {
      name: '-webkit-flow-into',
      restriction: 'identifier',
      version: '3.0',
      browsers: 'S6.1',
      ref: 'http://www.w3.org/TR/css3-regions/#flow-into',
      syntax: 'div { $(name): identifier; }',
    },
    desc: 'Places an element or its contents into a named flow.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'The element is not moved to a named flow and normal CSS processing takes place.',
      },
    },
  },
  {
    $: {
      name: '-webkit-font-feature-settings',
      restriction: 'string, integer',
      version: '3.0',
      browsers: 'C16',
      ref: 'http://www.w3.org/TR/css3-fonts/#propdef-font-feature-settings',
      syntax: "body { $(name): 'hwid'; }",
    },
    desc: 'This property provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.',
    values: {
      value: [
        {
          $: {
            name: '"c2cs"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"dlig"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"kern"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"liga"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"lnum"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"onum"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"smcp"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"swsh"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: '"tnum"',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No change in glyph substitution or positioning occurs.',
        },
        {
          $: {
            name: 'off',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'on',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-hyphens',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S5.1',
      ref: 'http://www.w3.org/TR/css3-text/#hyphens0',
      syntax: 'div { $(name): manual; }',
    },
    desc: 'Controls whether hyphenation is allowed to create more break opportunities within a line of text.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word.',
        },
        {
          $: {
            name: 'manual',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Words are not broken at line breaks, even if characters inside the word suggest line break points.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-line-break',
      restriction: '',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-line-break',
      syntax: 'p { $(name): normal; }',
    },
    desc: 'Specifies line-breaking rules for CJK (Chinese, Japanese, and Korean) text.',
    values: {
      value: [
        {
          $: {
            name: 'after-white-space',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-margin-bottom-collapse',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      syntax: 'div { $(name): collapse; }',
    },
    values: {
      value: [
        {
          $: {
            name: 'collapse',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'discard',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'separate',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-margin-collapse',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      syntax: 'div { $(name): collapse; }',
    },
    values: {
      value: [
        {
          $: {
            name: 'collapse',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'discard',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'separate',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-margin-start',
      restriction: 'percentage, length',
      version: '3.0',
      browsers: 'C,S3',
      syntax: 'div { $(name): 5px; }',
    },
    values: {
      value: {
        $: {
          name: 'auto',
          version: '3.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: '-webkit-margin-top-collapse',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      syntax: 'div { $(name): collapse; }',
    },
    values: {
      value: [
        {
          $: {
            name: 'collapse',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'discard',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'separate',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-mask-clip',
      restriction: 'box',
      version: '3.0',
      browsers: 'C,O15,S4',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-clip',
    },
    desc: 'Determines the mask painting area, which determines the area that is affected by the mask.',
  },
  {
    $: {
      name: '-webkit-mask-image',
      restriction: 'url, image, enum',
      version: '3.0',
      browsers: 'C,O15,S4',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-image',
    },
    desc: 'Sets the mask layer image of an element.',
    values: {
      value: [
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Counts as a transparent black image layer.',
        },
        {
          $: {
            name: 'url()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Reference to a <mask element or to a CSS image.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-mask-origin',
      restriction: 'box',
      version: '3.0',
      browsers: 'C,O15,S4',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-origin',
    },
    desc: 'Specifies the mask positioning area.',
  },
  {
    $: {
      name: '-webkit-mask-repeat',
      restriction: 'repeat',
      version: '3.0',
      browsers: 'C,O15,S4',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-repeat',
    },
    desc: 'Specifies how mask layer images are tiled after they have been sized and positioned.',
  },
  {
    $: {
      name: '-webkit-mask-size',
      restriction: 'length, percentage, enum',
      version: '3.0',
      browsers: 'C,O15,S4',
      ref: 'http://www.w3.org/TR/css-masking-1/#the-mask-size',
    },
    desc: 'Specifies the size of the mask layer images.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Resolved by using the image's intrinsic ratio and the size of the other dimension, or failing that, using the image's intrinsic size, or failing that, treating it as 100%.",
        },
        {
          $: {
            name: 'contain',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area.',
        },
        {
          $: {
            name: 'cover',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-nbsp-mode',
      restriction: '',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-nbsp-mode',
      syntax: 'p { $(name): space; }',
    },
    desc: 'Defines the behavior of nonbreaking spaces within text.',
    values: {
      value: [
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'space',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-overflow-scrolling',
      restriction: '',
      version: '3.0',
      browsers: 'C,S5',
      ref: 'http://css-infos.net/property/-webkit-nbsp-mode',
      syntax: 'div { $(name): touch; }',
    },
    desc: 'Specifies whether to use native-style scrolling in an overflow:scroll element.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'touch',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-padding-start',
      restriction: 'percentage, length',
      version: '3.0',
      browsers: 'C,S3',
      syntax: 'div { $(name): 5px; }',
    },
  },
  {
    $: {
      name: '-webkit-perspective',
      restriction: 'length',
      version: '3.0',
      browsers: 'C,S4',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#perspective',
      syntax: 'div { $(name): none; }',
    },
    desc: 'Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.',
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
        desc: 'No perspective transform is applied.',
      },
    },
  },
  {
    $: {
      name: '-webkit-perspective-origin',
      restriction: 'position, percentage, length',
      version: '3.0',
      browsers: 'C,S4',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#perspective-origin',
      syntax: 'div { $(name): 10px; }',
    },
    desc: 'Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.',
  },
  {
    $: {
      name: '-webkit-region-fragment',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S7',
      ref: 'http://dev.w3.org/csswg/css-regions/#region-fragment',
      syntax: 'article { $(name): break; }',
    },
    desc: "The 'region-fragment' property controls the behavior of the last region associated with a named flow.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Content flows as it would in a regular content box.',
        },
        {
          $: {
            name: 'break',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'If the content fits within the CSS Region, then this property has no effect.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-tap-highlight-color',
      restriction: 'color',
      version: '3',
      browsers: 'E,C,S3.1',
      ref: 'http://css-infos.net/property/-webkit-tap-highlight-color',
    },
  },
  {
    $: {
      name: '-webkit-text-fill-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'E,C,S3',
      syntax: 'div { $(name): red; }',
    },
  },
  {
    $: {
      name: '-webkit-text-size-adjust',
      restriction: 'percentage',
      version: '3.0',
      browsers: 'E,C,S3',
      ref: 'https://drafts.csswg.org/css-size-adjust/#text-size-adjust',
      syntax: 'div { $(name): 60%; }',
    },
    desc: 'Specifies a size adjustment for displaying text content in mobile browsers.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Renderers must use the default size adjustment when displaying on a small device.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Renderers must not do size adjustment when displaying on a small device.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-text-stroke',
      restriction: 'length, line-width, color, percentage',
      version: '3.0',
      browsers: 'S3',
      syntax: 'div { $(name): red 2x; }',
    },
  },
  {
    $: {
      name: '-webkit-text-stroke-color',
      restriction: 'color',
      version: '3.0',
      browsers: 'S3',
      syntax: 'div { $(name): red; }',
    },
  },
  {
    $: {
      name: '-webkit-text-stroke-width',
      restriction: 'length, line-width, percentage',
      version: '3.0',
      browsers: 'S3',
      syntax: 'div { $(name): 2px; }',
    },
  },
  {
    $: {
      name: '-webkit-touch-callout',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S3',
      syntax: 'a { $(name): none; }',
    },
    values: {
      value: {
        $: {
          name: 'none',
          version: '3.0',
          browsers: 'all',
        },
      },
    },
  },
  {
    $: {
      name: '-webkit-transform',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,O12,S3.1',
      ref: 'http://www.w3.org/TR/css3-2d-transforms/#transform-property',
      syntax: 'div { $(name): rotate(-90deg); }',
    },
    desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
    values: {
      value: [
        {
          $: {
            name: 'matrix()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]',
        },
        {
          $: {
            name: 'matrix3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'perspective()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a perspective projection matrix.',
        },
        {
          $: {
            name: 'rotate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.',
        },
        {
          $: {
            name: 'rotate3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.',
        },
        {
          $: {
            name: "rotateX('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the X axis.',
        },
        {
          $: {
            name: "rotateY('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the Y axis.',
        },
        {
          $: {
            name: "rotateZ('angle')",
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a clockwise rotation by the given angle about the Z axis.',
        },
        {
          $: {
            name: 'scale()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.',
        },
        {
          $: {
            name: 'scale3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.',
        },
        {
          $: {
            name: 'scaleX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.',
        },
        {
          $: {
            name: 'scaleY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.',
        },
        {
          $: {
            name: 'scaleZ()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.',
        },
        {
          $: {
            name: 'skew()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).',
        },
        {
          $: {
            name: 'skewX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the X axis by the given angle.',
        },
        {
          $: {
            name: 'skewY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a skew transformation along the Y axis by the given angle.',
        },
        {
          $: {
            name: 'translate()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.',
        },
        {
          $: {
            name: 'translate3d()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.',
        },
        {
          $: {
            name: 'translateX()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the X direction.',
        },
        {
          $: {
            name: 'translateY()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the Y direction.',
        },
        {
          $: {
            name: 'translateZ()',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-transform-origin',
      restriction: 'position, length, percentage',
      version: '3.0',
      browsers: 'C,O15,S3.1',
      ref: 'http://www.w3.org/TR/css3-2d-transforms/#transform-origin',
      syntax: '.album { $(name): 20% 40%; }',
    },
    desc: 'Establishes the origin of transformation for an element.',
  },
  {
    $: {
      name: '-webkit-transform-origin-x',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'C,S3.1',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#transform-origin',
      syntax: 'img { $(name): 5px}',
    },
    desc: 'The x coordinate of the origin for transforms applied to an element with respect to its border box.',
  },
  {
    $: {
      name: '-webkit-transform-origin-y',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'C,S3.1',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#transform-origin',
      syntax: 'img { $(name): 5px}',
    },
    desc: 'The y coordinate of the origin for transforms applied to an element with respect to its border box.',
  },
  {
    $: {
      name: '-webkit-transform-origin-z',
      restriction: 'length, percentage',
      version: '3.0',
      browsers: 'C,S4',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#transform-origin',
      syntax: 'img { $(name): 5px}',
    },
    desc: 'The z coordinate of the origin for transforms applied to an element with respect to its border box.',
  },
  {
    $: {
      name: '-webkit-transform-style',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S4',
      ref: 'http://www.w3.org/TR/css3-3d-transforms/#transform-origin',
      syntax: 'div { $(name): flat; }',
    },
    desc: 'Defines how nested elements are rendered in 3D space.',
    values: {
      value: [
        {
          $: {
            name: 'flat',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'All children of this element are rendered flattened into the 2D plane of the element.',
        },
        {
          $: {
            name: 'preserve-3d',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Flattening is not performed, so children maintain their position in 3D space.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-transition',
      restriction: 'time, property, timing-function, enum',
      version: '3.0',
      browsers: 'C,O12,S5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition',
      syntax: 'div { $(name): background-color linear 1s; }',
    },
    desc: 'Shorthand property combines four of the transition properties into a single property.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Every property that is able to undergo a transition will do so.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No property will transition.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-transition-delay',
      restriction: 'time',
      version: '3.0',
      browsers: 'C,O12,S5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-delay',
      syntax: 'div { $(name): 1s; }',
    },
    desc: 'Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.',
  },
  {
    $: {
      name: '-webkit-transition-duration',
      restriction: 'time',
      version: '3.0',
      browsers: 'C,O12,S5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-duration',
      syntax: 'div { $(name): 1s; }',
    },
    desc: 'Specifies how long the transition from the old value to the new value should take.',
  },
  {
    $: {
      name: '-webkit-transition-property',
      restriction: 'property',
      version: '3.0',
      browsers: 'C,O12,S5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-property',
      syntax: 'div { $(name): background-color; }',
    },
    desc: 'Specifies the name of the CSS property to which the transition is applied.',
    values: {
      value: [
        {
          $: {
            name: 'all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Every property that is able to undergo a transition will do so.',
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'No property will transition.',
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-transition-timing-function',
      restriction: 'timing-function',
      version: '3.0',
      browsers: 'C,O12,S5',
      ref: 'http://www.w3.org/TR/css3-transitions/#transition-timing-function',
      syntax: 'div { $(name): linear; }',
    },
    desc: 'Describes how the intermediate values used during a transition will be calculated.',
  },
  {
    $: {
      name: '-webkit-user-drag',
      restriction: 'enum',
      version: '3.0',
      browsers: 'S3',
      syntax: 'div { $(name): element; }',
    },
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'element',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-user-modify',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-user-modify',
      syntax: 'div { $(name): read-only; }',
    },
    desc: 'Determines whether a user can edit the content of an element.',
    values: {
      value: [
        {
          $: {
            name: 'read-only',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'read-write',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'read-write-plaintext-only',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: '-webkit-user-select',
      restriction: 'enum',
      version: '3.0',
      browsers: 'C,S3',
      ref: 'http://css-infos.net/property/-webkit-user-select',
      syntax: 'div { $(name): text; }',
    },
    desc: 'Controls the appearance of selection.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'none',
            version: '3.0',
            browsers: 'all',
          },
        },
        {
          $: {
            name: 'text',
            version: '3.0',
            browsers: 'all',
          },
        },
      ],
    },
  },
  {
    $: {
      name: 'widows',
      restriction: 'integer',
      version: '2.0',
      browsers: 'C,IE8,O9.5,S1',
      ref: 'http://www.w3.org/TR/css3-break/#widows-orphans',
      syntax: '<integer>',
    },
    desc: 'Specifies the minimum number of line boxes of a block container that must be left in a fragment after a break.',
  },
  {
    $: {
      name: 'width',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-box/#width',
      syntax: 'header { $(name): 200px; }',
    },
    desc: "Specifies the width of the content area, padding area or border area (depending on 'box-sizing') of certain boxes.",
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '1.0',
            browsers: 'all',
          },
          desc: 'The width depends on the values of other properties.',
        },
        {
          $: {
            name: 'fill',
            version: '3.0',
            browsers: 'none',
          },
          desc: 'Use the fill-available inline size or fill-available block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'fit-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'max-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the max-content inline size or max-content block size, as appropriate to the writing mode.',
        },
        {
          $: {
            name: 'min-content',
            version: '3.0',
            browsers: 'C46,O33',
          },
          desc: 'Use the min-content inline size or min-content block size, as appropriate to the writing mode.',
        },
      ],
    },
  },
  {
    $: {
      name: 'will-change',
      restriction: 'enum, identifier',
      version: '3.0',
      browsers: 'C36,FF36,O24',
      ref: 'http://www.w3.org/TR/css-will-change/',
      syntax: 'body { $(name): scroll-position; }',
    },
    desc: 'Provides a rendering hint to the user agent, stating what kinds of changes the author expects to perform on the element.',
    values: {
      value: [
        {
          $: {
            name: 'auto',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Expresses no particular intent.',
        },
        {
          $: {
            name: 'contents',
            version: '3.0',
            browsers: 'all',
          },
          desc: "Indicates that the author expects to animate or change something about the element's contents in the near future.",
        },
        {
          $: {
            name: 'scroll-position',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Indicates that the author expects to animate or change the scroll position of the element in the near future.',
        },
      ],
    },
  },
  {
    $: {
      name: 'word-break',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,C,FF15,IE5,S3',
      ref: 'http://www.w3.org/TR/css3-text/#word-break0',
      syntax: 'p.album { $(name): break-all; }',
    },
    desc: 'Specifies line break opportunities for non-CJK scripts.',
    values: {
      value: [
        {
          $: {
            name: 'break-all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Lines may break between any two grapheme clusters for non-CJK scripts.',
        },
        {
          $: {
            name: 'keep-all',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Block characters can no longer create implied break points.',
        },
        {
          $: {
            name: 'normal',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Breaks non-CJK scripts according to their own rules.',
        },
      ],
    },
  },
  {
    $: {
      name: 'word-spacing',
      restriction: 'length, percentage',
      version: '1.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-text/#word-spacing0',
      syntax: 'article { $(name): 3px; }',
    },
    desc: 'Specifies additional spacing between "words".',
    values: {
      value: {
        $: {
          name: 'normal',
          version: '1.0',
          browsers: 'all',
        },
        desc: 'No additional spacing is applied. Computes to zero.',
      },
    },
  },
  {
    $: {
      name: 'word-wrap',
      restriction: 'enum',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-text/#word-wrap0',
      syntax: 'p { $(name): break-word; }',
    },
    desc: 'Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit.',
    values: {
      value: [
        {
          $: {
            name: 'break-word',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line.',
        },
        {
          $: {
            name: 'normal',
            version: '2.0',
            browsers: 'all',
          },
          desc: 'Lines may break only at allowed break points.',
        },
      ],
    },
  },
  {
    $: {
      name: 'writing-mode',
      restriction: 'enum',
      version: '3.0',
      browsers: 'E,FF41',
      ref: 'http://www.w3.org/TR/css-writing-modes-3/#writing-mode',
      syntax: 'span { $(name): lr-tb; }',
    },
    desc: "This is a shorthand property for both 'direction' and 'block-progression'.",
    values: {
      value: [
        {
          $: {
            name: 'horizontal-tb',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Top-to-bottom block flow direction. The writing mode is horizontal.',
        },
        {
          $: {
            name: 'sideways-lr',
            version: '3.0',
            browsers: 'FF43',
          },
          desc: 'Left-to-right block flow direction. The writing mode is vertical, while the typographic mode is horizontal.',
        },
        {
          $: {
            name: 'sideways-rl',
            version: '3.0',
            browsers: 'FF43',
          },
          desc: 'Right-to-left block flow direction. The writing mode is vertical, while the typographic mode is horizontal.',
        },
        {
          $: {
            name: 'vertical-lr',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Left-to-right block flow direction. The writing mode is vertical.',
        },
        {
          $: {
            name: 'vertical-rl',
            version: '3.0',
            browsers: 'all',
          },
          desc: 'Right-to-left block flow direction. The writing mode is vertical.',
        },
      ],
    },
  },
  {
    $: {
      name: 'z-index',
      restriction: 'integer',
      version: '2.0',
      browsers: 'all',
      ref: 'http://www.w3.org/TR/css3-positioning/#propdef-z-index',
      syntax: 'img { $(name): 3; }',
    },
    desc: "For a positioned box, the 'z-index' property specifies the stack level of the box in the current stacking context and whether the box establishes a local stacking context.",
    values: {
      value: {
        $: {
          name: 'auto',
          version: '2.0',
          browsers: 'all',
        },
        desc: 'The stack level of the generated box in the current stacking context is 0. The box does not establish a new stacking context unless it is the root element.',
      },
    },
  },
  {
    $: {
      name: 'zoom',
      restriction: 'enum, integer, number, percentage',
      version: '3.0',
      browsers: 'E,C,IE6,O15,S4',
      ref: 'https://msdn.microsoft.com/en-us/library/ms531189(v=vs.85).aspx',
      syntax: '.example { $(name): 1; }',
    },
    desc: "Non-standard. Specifies the magnification scale of the object. See 'transform: scale()' for a standards-based alternative.",
    values: {
      value: {
        $: {
          name: 'normal',
          version: '3.0',
          browsers: 'all',
        },
      },
    },
  },
]

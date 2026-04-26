import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type FlexAlign = 'stretch' | 'start' | 'center' | 'end' | 'baseline'
export type FlexJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'between'
  | 'around'
  | 'evenly'
export type FlexWrap = boolean | 'wrap' | 'nowrap' | 'reverse' | 'true'

export interface Flex {
  container?: RefOrValue<string>
  direction?: RefOrValue<FlexDirection>
  directionSm?: RefOrValue<FlexDirection>
  directionMd?: RefOrValue<FlexDirection>
  directionLg?: RefOrValue<FlexDirection>
  directionXl?: RefOrValue<FlexDirection>
  align?: RefOrValue<FlexAlign>
  alignSm?: RefOrValue<FlexAlign>
  alignMd?: RefOrValue<FlexAlign>
  alignLg?: RefOrValue<FlexAlign>
  alignXl?: RefOrValue<FlexAlign>
  justify?: RefOrValue<FlexJustify>
  justifySm?: RefOrValue<FlexJustify>
  justifyMd?: RefOrValue<FlexJustify>
  justifyLg?: RefOrValue<FlexJustify>
  justifyXl?: RefOrValue<FlexJustify>
  wrap?: RefOrValue<FlexWrap>
  wrapSm?: RefOrValue<FlexWrap>
  wrapMd?: RefOrValue<FlexWrap>
  wrapLg?: RefOrValue<FlexWrap>
  wrapXl?: RefOrValue<FlexWrap>
  inline?: RefOrValue<boolean | string>
  classes?: ComputedRef<string>
}

const flexTemplate = html`<div :is="container ?? 'div'" class="flex" :class="classes">
  <slot></slot>
</div>`

function defineFlexComponent() {
  return defineComponent<Flex>(flexTemplate, {
    props: [
      'container',
      'direction',
      'directionSm',
      'directionMd',
      'directionLg',
      'directionXl',
      'align',
      'alignSm',
      'alignMd',
      'alignLg',
      'alignXl',
      'justify',
      'justifySm',
      'justifyMd',
      'justifyLg',
      'justifyXl',
      'wrap',
      'wrapSm',
      'wrapMd',
      'wrapLg',
      'wrapXl',
      'inline',
    ],
    context: (head) => resolveFlex(head.props),
  })
}

export function defineFlexComponents() {
  return {
    flex: defineFlexComponent(),
  }
}

function resolveFlex(props: Flex): Flex {
  const classes = computed(() => {
    return [
      resolveDirectionClass(props.direction),
      resolveResponsiveDirectionClass('sm', props.directionSm),
      resolveResponsiveDirectionClass('md', props.directionMd),
      resolveResponsiveDirectionClass('lg', props.directionLg),
      resolveResponsiveDirectionClass('xl', props.directionXl),
      resolveAlignClass(props.align),
      resolveResponsiveAlignClass('sm', props.alignSm),
      resolveResponsiveAlignClass('md', props.alignMd),
      resolveResponsiveAlignClass('lg', props.alignLg),
      resolveResponsiveAlignClass('xl', props.alignXl),
      resolveJustifyClass(props.justify),
      resolveResponsiveJustifyClass('sm', props.justifySm),
      resolveResponsiveJustifyClass('md', props.justifyMd),
      resolveResponsiveJustifyClass('lg', props.justifyLg),
      resolveResponsiveJustifyClass('xl', props.justifyXl),
      resolveWrapClass(props.wrap),
      resolveResponsiveWrapClass('sm', props.wrapSm),
      resolveResponsiveWrapClass('md', props.wrapMd),
      resolveResponsiveWrapClass('lg', props.wrapLg),
      resolveResponsiveWrapClass('xl', props.wrapXl),
      resolveInlineClass(props.inline),
    ]
      .filter(Boolean)
      .join(' ')
  })

  return {
    ...props,
    classes,
  }
}

function resolveDirectionClass(value?: RefOrValue<FlexDirection>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === 'column') return 'flex-column'
  if (normalized === 'column-reverse') return 'flex-column-reverse'
  if (normalized === 'row-reverse') return 'flex-row-reverse'
  if (normalized === 'row') return ''

  return ''
}

function resolveResponsiveDirectionClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexDirection>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === 'column') return `flex-direction-${breakpoint}-column`
  if (normalized === 'column-reverse') {
    return `flex-direction-${breakpoint}-column-reverse`
  }
  if (normalized === 'row') return `flex-direction-${breakpoint}-row`
  if (normalized === 'row-reverse') {
    return `flex-direction-${breakpoint}-row-reverse`
  }

  return ''
}

function resolveAlignClass(value?: RefOrValue<FlexAlign>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === 'start') return 'align-flex-start'
  if (normalized === 'end') return 'align-flex-end'

  if (
    normalized === 'stretch' ||
    normalized === 'center' ||
    normalized === 'baseline'
  ) {
    return `align-${normalized}`
  }

  return ''
}

function resolveResponsiveAlignClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexAlign>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === 'start') return `align-${breakpoint}-flex-start`
  if (normalized === 'end') return `align-${breakpoint}-flex-end`

  if (
    normalized === 'stretch' ||
    normalized === 'center' ||
    normalized === 'baseline'
  ) {
    return `align-${breakpoint}-${normalized}`
  }

  return ''
}

function resolveJustifyClass(value?: RefOrValue<FlexJustify>) {
  if (!value) return ''

  const normalized = unref(value)
  if (
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end' ||
    normalized === 'stretch' ||
    normalized === 'between' ||
    normalized === 'around' ||
    normalized === 'evenly'
  ) {
    return `justify-${normalized}`
  }

  return ''
}

function resolveResponsiveJustifyClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexJustify>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end' ||
    normalized === 'stretch' ||
    normalized === 'between' ||
    normalized === 'around' ||
    normalized === 'evenly'
  ) {
    return `justify-${breakpoint}-${normalized}`
  }

  return ''
}

function resolveWrapClass(value?: RefOrValue<FlexWrap>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true' || normalized === 'wrap') {
    return 'flex-wrap'
  }
  if (normalized === 'reverse') return 'flex-wrap-reverse'

  return ''
}

function resolveResponsiveWrapClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexWrap>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true' || normalized === 'wrap') {
    return `flex-wrap-${breakpoint}`
  }
  if (normalized === 'nowrap') return `flex-nowrap-${breakpoint}`
  if (normalized === 'reverse') return `flex-wrap-${breakpoint}-reverse`

  return ''
}

function resolveInlineClass(value?: RefOrValue<boolean | string>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true') return 'flex-inline'

  return ''
}

import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type FlexDirection = 'row' | 'column'
export type FlexAlign = 'stretch' | 'start' | 'center' | 'end' | 'baseline'
export type FlexJustify =
  | 'start'
  | 'center'
  | 'end'
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
  className?: ComputedRef<string>
}

const flexTemplate = html`<div :is="container ?? 'div'" class="flex" :class="className">
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
  const className = computed(() => {
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
    className,
  }
}

function resolveDirectionClass(value?: RefOrValue<FlexDirection>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === 'column') return 'flex--column'
  if (normalized === 'row') return ''

  return ''
}

function resolveResponsiveDirectionClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexDirection>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === 'column') return `flex--direction-${breakpoint}-column`
  if (normalized === 'row') return `flex--direction-${breakpoint}-row`

  return ''
}

function resolveAlignClass(value?: RefOrValue<FlexAlign>) {
  if (!value) return ''

  const normalized = unref(value)
  if (
    normalized === 'stretch' ||
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end' ||
    normalized === 'baseline'
  ) {
    return `flex--align-${normalized}`
  }

  return ''
}

function resolveResponsiveAlignClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexAlign>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (
    normalized === 'stretch' ||
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end' ||
    normalized === 'baseline'
  ) {
    return `flex--align-${breakpoint}-${normalized}`
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
    normalized === 'between' ||
    normalized === 'around' ||
    normalized === 'evenly'
  ) {
    return `flex--justify-${normalized}`
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
    normalized === 'between' ||
    normalized === 'around' ||
    normalized === 'evenly'
  ) {
    return `flex--justify-${breakpoint}-${normalized}`
  }

  return ''
}

function resolveWrapClass(value?: RefOrValue<FlexWrap>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true' || normalized === 'wrap') {
    return 'flex--wrap'
  }
  if (normalized === 'reverse') return 'flex--wrap-reverse'

  return ''
}

function resolveResponsiveWrapClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  value?: RefOrValue<FlexWrap>,
) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true' || normalized === 'wrap') {
    return `flex--wrap-${breakpoint}`
  }
  if (normalized === 'nowrap') return `flex--nowrap-${breakpoint}`
  if (normalized === 'reverse') return `flex--wrap-${breakpoint}-reverse`

  return ''
}

function resolveInlineClass(value?: RefOrValue<boolean | string>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true') return 'flex--inline'

  return ''
}

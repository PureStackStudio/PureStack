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
  direction?: RefOrValue<FlexDirection>
  align?: RefOrValue<FlexAlign>
  justify?: RefOrValue<FlexJustify>
  wrap?: RefOrValue<FlexWrap>
  inline?: RefOrValue<boolean | string>
  className?: ComputedRef<string>
}

const flexTemplate = html`<div class="flex" :class="className"><slot></slot></div>`

function createFlexComponent() {
  return defineComponent<Flex>(flexTemplate, {
    props: ['direction', 'align', 'justify', 'wrap', 'inline'],
    context: (head) => resolveFlex(head.props),
  })
}

export function defineFlexComponents() {
  return {
    flex: createFlexComponent(),
  }
}

function resolveFlex(props: Flex): Flex {
  const className = computed(() => {
    return [
      resolveDirectionClass(props.direction),
      resolveAlignClass(props.align),
      resolveJustifyClass(props.justify),
      resolveWrapClass(props.wrap),
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

function resolveWrapClass(value?: RefOrValue<FlexWrap>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true' || normalized === 'wrap') {
    return 'flex--wrap'
  }
  if (normalized === 'reverse') return 'flex--wrap-reverse'

  return ''
}

function resolveInlineClass(value?: RefOrValue<boolean | string>) {
  if (!value) return ''

  const normalized = unref(value)
  if (normalized === true || normalized === 'true') return 'flex--inline'

  return ''
}

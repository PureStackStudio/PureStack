import type { CSSProps } from '@purestack/ts-css'
import { docLayoutVar } from '@purestack/ts-style'
import { computed, defineComponent, html, type RefOrValue, unref } from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'
import { resolveComponentClasses } from '../componentVariant'
import type { LandingBand, LandingBandEdge } from './landingTypes'

const DEFAULT_LANDING_BAND_VARIANT: ComponentVariant = 'surfaceAlt'
const DEFAULT_LANDING_BAND_VARIANT_MODE: ComponentVariantMode = 'stateless'
const DEFAULT_LANDING_BAND_HEIGHT = '16rem'
const DEFAULT_LANDING_BAND_EDGE_SIZE = '4rem'
const DEFAULT_LANDING_BAND_EDGE_START = '0%'
const LANDING_BAND_INLINE_PADDING = '1em'

export function defineLandingBandComponent() {
  const landingBandTemplate = html`<section :class="classes" :style="bandStyle">
    <slot></slot>
  </section>`

  return {
    landingBand: defineComponent<LandingBand>(landingBandTemplate, {
      props: [
        'tone',
        'variant',
        'variantMode',
        'image',
        'imageFit',
        'imagePosition',
        'display',
        'alignItems',
        'justifyContent',
        'height',
        'marginTop',
        'marginBottom',
        'paddingTop',
        'paddingBottom',
        'topEdge',
        'bottomEdge',
        'edgeSize',
        'topEdgeStart',
        'bottomEdgeStart',
      ],
      context: (head) => resolveLandingBand(head.props),
    }),
  }
}

function resolveLandingBand(props: LandingBand): LandingBand {
  const height = computed(() =>
    resolveStyleValue(props.height, DEFAULT_LANDING_BAND_HEIGHT),
  )
  const edgeSize = computed(() =>
    resolveStyleValue(props.edgeSize, DEFAULT_LANDING_BAND_EDGE_SIZE),
  )
  const inlineStartBleed = resolveLandingBandInlineBleed('start')
  const inlineEndBleed = resolveLandingBandInlineBleed('end')

  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_LANDING_BAND_VARIANT,
        defaultVariantMode: DEFAULT_LANDING_BAND_VARIANT_MODE,
        classes: ['rounded-none', resolveLandingBandBorderClass(props)],
      }),
    ),
    bandStyle: computed<Partial<CSSProps>>(() => ({
      display: resolveCssPropValue(props.display, 'flex'),
      alignItems: resolveCssPropValue(props.alignItems, 'start'),
      justifyContent: resolveCssPropValue(props.justifyContent, 'center'),
      borderRadius: '0 !important',
      borderLeft: 'none !important',
      borderRight: 'none !important',
      overflow: 'hidden',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      minHeight: height(),
      marginInlineStart: `calc(-1 * (${inlineStartBleed}))`,
      marginInlineEnd: `calc(-1 * (${inlineEndBleed}))`,
      paddingInlineStart: `calc(${LANDING_BAND_INLINE_PADDING} + ${inlineStartBleed})`,
      paddingInlineEnd: `calc(${LANDING_BAND_INLINE_PADDING} + ${inlineEndBleed})`,
      paddingTop: resolveLandingBandEdgePadding(
        props.paddingTop,
        edgeSize(),
        props.topEdge,
      ),
      paddingBottom: resolveLandingBandEdgePadding(
        props.paddingBottom,
        edgeSize(),
        props.bottomEdge,
      ),
      marginTop: resolveStyleValue(props.marginTop, '0'),
      marginBottom: resolveStyleValue(props.marginBottom, '0'),
      backgroundImage: resolveBackgroundImage(props.image),
      backgroundSize: unref(props.imageFit) || 'cover',
      backgroundPosition: unref(props.imagePosition) || 'center',
      backgroundRepeat: 'no-repeat',
      clipPath: resolveLandingBandClipPath(props, edgeSize()),
    })),
  }
}

function resolveLandingBandInlineBleed(side: 'start' | 'end') {
  return `${resolveCenteredViewportBleed()} + ${resolveDocLayoutInlineCorrection(side)}`
}

function resolveCenteredViewportBleed() {
  return '50vw - 50%'
}

function resolveDocLayoutInlineCorrection(side: 'start' | 'end') {
  const inlineStartState = `(${resolveDocLayoutInlineStartState()})`
  const inlineEndState = `(${resolveDocLayoutInlineEndState()})`
  const balance =
    side === 'start'
      ? `${inlineStartState} - ${inlineEndState}`
      : `${inlineEndState} - ${inlineStartState}`
  return `(${balance}) / 2`
}

function resolveDocLayoutInlineStartState() {
  return [
    docLayoutVar('activeShellPaddingInlineStart'),
    docLayoutVar('activeNavWidth'),
  ].join(' + ')
}

function resolveDocLayoutInlineEndState() {
  return [
    docLayoutVar('activeShellPaddingInlineEnd'),
    docLayoutVar('activeTocWidth'),
  ].join(' + ')
}

function resolveLandingBandClipPath(
  props: LandingBand,
  edgeSize: string,
): string | undefined {
  const topEdge = resolveLandingBandEdge(props.topEdge)
  const bottomEdge = resolveLandingBandEdge(props.bottomEdge)

  if (topEdge === 'flat' && bottomEdge === 'flat') return undefined

  const topStart = resolveStyleValue(
    props.topEdgeStart,
    DEFAULT_LANDING_BAND_EDGE_START,
  )
  const bottomStart = resolveStyleValue(
    props.bottomEdgeStart,
    DEFAULT_LANDING_BAND_EDGE_START,
  )
  const topLeftY = topEdge === 'slant-up' ? edgeSize : '0'
  const topRightY = topEdge === 'slant-down' ? edgeSize : '0'
  const bottomRightY =
    bottomEdge === 'slant-up' ? `calc(100% - ${edgeSize})` : '100%'
  const bottomLeftY =
    bottomEdge === 'slant-down' ? `calc(100% - ${edgeSize})` : '100%'
  const points = [
    `0 ${topLeftY}`,
    `${topStart} ${topLeftY}`,
    `100% ${topRightY}`,
    `100% ${bottomRightY}`,
    `${bottomStart} ${bottomLeftY}`,
    `0 ${bottomLeftY}`,
  ]

  return `polygon(${points.join(', ')})`
}

function resolveLandingBandEdgePadding(
  padding: RefOrValue<string> | undefined,
  edgeSize: string,
  edge: RefOrValue<LandingBandEdge> | undefined,
) {
  const resolvedPadding = resolveStyleValue(padding, '1em')
  return resolveLandingBandEdge(edge) === 'flat'
    ? resolvedPadding
    : `calc(${resolvedPadding} + ${edgeSize})`
}

function resolveLandingBandEdge(edge?: RefOrValue<LandingBandEdge>) {
  const resolved = unref(edge)
  return resolved === 'slant-up' || resolved === 'slant-down'
    ? resolved
    : 'flat'
}

function resolveLandingBandBorderClass(props: LandingBand) {
  return resolveLandingBandEdge(props.topEdge) === 'flat' &&
    resolveLandingBandEdge(props.bottomEdge) === 'flat'
    ? undefined
    : 'b-0'
}

function resolveBackgroundImage(image?: RefOrValue<string>) {
  const resolved = unref(image)
  return typeof resolved === 'string' && resolved.trim()
    ? `url("${resolved.trim()}")`
    : undefined
}

function resolveStyleValue(
  value: RefOrValue<string> | undefined,
  fallback: string,
) {
  const resolved = unref(value)
  return typeof resolved === 'string' && resolved.trim()
    ? resolved.trim()
    : fallback
}

function resolveCssPropValue<T>(value: RefOrValue<T> | undefined, fallback: T) {
  return unref(value) || fallback
}

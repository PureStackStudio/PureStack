import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import { type RefOrValue, unref } from 'regor'

export type ComponentVariant =
  | 'none'
  | 'solid'
  | 'surface'
  | 'surfaceAlt'
  | 'spotlight'
  | 'glass'
  | 'flat'
  | 'flatAlt'
  | 'flatSolid'
  | 'outlineFill'
  | 'outline'
  | 'subtle'
  | 'subtleBtn'
  | 'link'
  | 'sheen'
  | 'underline'
  | 'rail'
  | 'bracket'

export type ComponentVariantMode = 'stateful' | 'stateless'

export const DEFAULT_COMPONENT_VARIANT: ComponentVariant = 'solid'
export const DEFAULT_COMPONENT_VARIANT_MODE: ComponentVariantMode = 'stateful'

export interface ComponentClassProps {
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
}

export interface ResolveComponentClassesOptions {
  defaultVariant?: ComponentVariant
  defaultVariantMode?: ComponentVariantMode
  classes?: Array<RefOrValue<string | undefined | false>>
}

const STATELESS_COMPONENT_VARIANT_CLASSES: Record<ComponentVariant, string> = {
  none: '',
  solid: 'b-1 rounded-md tone-fill-button tone-border-button tone-text-button',
  surface:
    'b-1 rounded-md tone-fill-surface tone-border-surface tone-text-surface',
  surfaceAlt:
    'b-1 rounded-md tone-fill-surface-alt tone-border-surface-alt tone-text-surface-alt',
  spotlight:
    'b-1 rounded-md tone-fill-spotlight tone-border-surface-alt tone-text-surface-alt',
  glass:
    'b-1 rounded-md tone-fill-glass tone-border-surface-alt tone-text-surface-alt',
  flat: 'b-1 rounded-md tone-fill-flat tone-border-surface tone-text-surface',
  flatAlt:
    'b-1 rounded-md tone-fill-flat-alt tone-border-surface-alt tone-text-surface-alt',
  flatSolid:
    'b-1 rounded-md tone-fill-flat-solid tone-border-button tone-text-button',
  outlineFill: 'b-2 rounded-md tone-border-button tone-text',
  outline: 'b-2 rounded-md tone-text',
  subtle: 'b-0 rounded-md tone-text',
  subtleBtn: 'b-0 rounded-md tone-text',
  link: 'tone-text',
  sheen: 'tone-text-bg-button',
  underline: 'tone-text',
  rail: 'bl-1 inset-size-4 pl-4 pr-3 tone-border-button tone-text',
  bracket: 'tone-text',
}

const STATEFUL_COMPONENT_VARIANT_CLASSES = {
  flat: 'tone-fill-flat-hover tone-fill-flat-active tone-border-surface-hover tone-border-surface-active tone-text-surface-hover tone-text-surface-active',
  flatAlt:
    'tone-fill-flat-alt-hover tone-fill-flat-alt-active tone-border-surface-alt-hover tone-border-surface-alt-active tone-text-surface-alt-hover tone-text-surface-alt-active',
  flatSolid:
    'tone-fill-flat-solid-hover tone-fill-flat-solid-active tone-border-button-hover tone-border-button-active tone-text-button-hover tone-text-button-active',
  solid:
    'tone-fill-button-hover tone-fill-button-active tone-border-button-hover tone-border-button-active tone-text-button-hover tone-text-button-active',
  surface:
    'tone-fill-surface-hover tone-fill-surface-active tone-border-surface-hover tone-border-surface-active tone-text-surface-hover tone-text-surface-active',
  surfaceAlt:
    'tone-fill-surface-alt-hover tone-fill-surface-alt-active tone-border-surface-alt-hover tone-border-surface-alt-active tone-text-surface-alt-hover tone-text-surface-alt-active',
  outlineFill:
    'tone-fill-button-hover tone-text-button-hover tone-fill-button-active tone-text-button-active',
  outline:
    'b-2-hover tone-border-button-hover tone-border-button-active tone-fill-button-active tone-text-button-active',
  subtle:
    'tone-fill-surface-hover tone-fill-surface-active tone-text-surface-hover tone-text-surface-active',
  subtleBtn:
    'tone-fill-button-hover tone-fill-button-active tone-text-button-hover tone-text-button-active',
  link: 'underline-hover',
  sheen: 'tone-text-bg-button-hover tone-text-bg-button-active',
  underline: 'tone-inset-b-hover tone-inset-b-active',
  rail: 'tone-inset-l-hover tone-fill-active tone-text-button-active',
  bracket:
    'tone-inset-y-hover tone-inset-y-active tone-fill-active tone-text-button-active',
} satisfies Partial<Record<ComponentVariant, string>>

const COMPONENT_VARIANT_CLASSES = mergeComponentVariantClasses(
  STATELESS_COMPONENT_VARIANT_CLASSES,
  STATEFUL_COMPONENT_VARIANT_CLASSES,
)

const COMPONENT_VARIANT_CLASS_MODES: Record<
  ComponentVariantMode,
  Record<ComponentVariant, string>
> = {
  stateful: COMPONENT_VARIANT_CLASSES,
  stateless: STATELESS_COMPONENT_VARIANT_CLASSES,
}

function mergeComponentVariantClasses(
  base: Record<ComponentVariant, string>,
  additions: Partial<Record<ComponentVariant, string>>,
): Record<ComponentVariant, string> {
  const merged = {} as Record<ComponentVariant, string>
  for (const variant of Object.keys(base) as ComponentVariant[]) {
    merged[variant] = [base[variant], additions[variant]]
      .filter(Boolean)
      .join(' ')
  }
  return merged
}

function resolveComponentVariantClassName(
  variant: RefOrValue<ComponentVariant> | undefined,
  defaultVariant: ComponentVariant = DEFAULT_COMPONENT_VARIANT,
  variantMode:
    | RefOrValue<ComponentVariantMode>
    | undefined = DEFAULT_COMPONENT_VARIANT_MODE,
) {
  const resolvedVariant = unref(variant) || defaultVariant
  const resolvedMode = unref(variantMode) || DEFAULT_COMPONENT_VARIANT_MODE
  return COMPONENT_VARIANT_CLASS_MODES[resolvedMode][resolvedVariant]
}

export function resolveComponentClasses(
  props: ComponentClassProps,
  options: ResolveComponentClassesOptions = {},
) {
  return [
    resolveComponentVariantClassName(
      props.variant,
      options.defaultVariant,
      props.variantMode || options.defaultVariantMode,
    ),
    getSemanticToneClass(unref(props.tone)),
    ...(options.classes || []).map(unref),
  ]
    .filter(Boolean)
    .join(' ')
}

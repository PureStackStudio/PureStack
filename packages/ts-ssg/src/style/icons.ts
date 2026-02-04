export type SvgIconName =
  | 'check'
  | 'infinity'
  | 'stack'
  | 'shield'
  | 'clock'
  | 'support'
  | 'code'
  | 'rocket'
  | 'building'

const SVG_ICONS: Record<SvgIconName, string> = {
  check:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>',
  infinity:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14c2 0 3-4 5-4s3 4 5 4c2.2 0 3-1.8 3-3s-.8-3-3-3c-2 0-3 4-5 4s-3-4-5-4C4.8 8 4 9.8 4 11s.8 3 3 3Z"/></svg>',
  stack:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 4-8 4-8-4 8-4Zm8 8-8 4-8-4m16 4-8 4-8-4"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 5 3.4 8.3 7 10 3.6-1.7 7-5 7-10V6l-7-3Z"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="9"/></svg>',
  support:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v4a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Zm16 0v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"/></svg>',
  code:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8 4 12l4 4M16 8l4 4-4 4M13.5 6l-3 12"/></svg>',
  rocket:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4c3 0 6 3 6 6-2 0-4 .7-5.5 2.2L11 16l-3-3 3.8-3.5A7.7 7.7 0 0 1 14 4Z"/><path d="M7 14l3 3M6 18c1.2 0 2.3-.5 3.1-1.3L10 16l-1.3-.9A4.4 4.4 0 0 0 6 18Z"/></svg>',
  building:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21h16M7 21V6l5-3 5 3v15M10 10h.01M14 10h.01M10 14h.01M14 14h.01"/></svg>',
}

export function getSvgIcon(
  name: string | undefined,
  fallback: SvgIconName = 'check',
) {
  if (!name) return SVG_ICONS[fallback]
  return SVG_ICONS[name as SvgIconName] ?? SVG_ICONS[fallback]
}

export const docLayoutVars = {
  defaultNavWidth: '--ps-doc-layout-default-nav-width',
  defaultTocWidth: '--ps-doc-layout-default-toc-width',
  defaultRailWidth: '--ps-doc-layout-default-rail-width',
  defaultShellPaddingInlineStart:
    '--ps-doc-layout-default-shell-padding-inline-start',
  defaultShellPaddingInlineEnd:
    '--ps-doc-layout-default-shell-padding-inline-end',
  defaultShellPaddingBlock: '--ps-doc-layout-default-shell-padding-block',
  compactShellPaddingInlineStart:
    '--ps-doc-layout-compact-shell-padding-inline-start',
  compactShellPaddingInlineEnd:
    '--ps-doc-layout-compact-shell-padding-inline-end',
  compactShellPaddingBlock: '--ps-doc-layout-compact-shell-padding-block',
  fullShellPaddingInlineStart:
    '--ps-doc-layout-full-shell-padding-inline-start',
  fullShellPaddingInlineEnd: '--ps-doc-layout-full-shell-padding-inline-end',
  fullShellPaddingBlock: '--ps-doc-layout-full-shell-padding-block',
  userNavWidth: '--ps-doc-layout-user-nav-width',
  userTocWidth: '--ps-doc-layout-user-toc-width',
  userShellPaddingInlineStart:
    '--ps-doc-layout-user-shell-padding-inline-start',
  userShellPaddingInlineEnd: '--ps-doc-layout-user-shell-padding-inline-end',
  minNavWidth: '--ps-doc-layout-min-nav-width',
  maxNavWidth: '--ps-doc-layout-max-nav-width',
  minTocWidth: '--ps-doc-layout-min-toc-width',
  maxTocWidth: '--ps-doc-layout-max-toc-width',
  preferredNavWidth: '--ps-doc-layout-preferred-nav-width',
  preferredTocWidth: '--ps-doc-layout-preferred-toc-width',
  preferredShellPaddingInlineStart:
    '--ps-doc-layout-preferred-shell-padding-inline-start',
  preferredShellPaddingInlineEnd:
    '--ps-doc-layout-preferred-shell-padding-inline-end',
  activeNavWidth: '--ps-doc-layout-active-nav-width',
  activeTocWidth: '--ps-doc-layout-active-toc-width',
  activeRailWidth: '--ps-doc-layout-active-rail-width',
  activeShellPaddingInlineStart:
    '--ps-doc-layout-active-shell-padding-inline-start',
  activeShellPaddingInlineEnd:
    '--ps-doc-layout-active-shell-padding-inline-end',
  activeShellPaddingBlock: '--ps-doc-layout-active-shell-padding-block',
} as const

export const docLayoutDefaults = {
  /**
   * Fallback desktop nav sidebar width.
   *
   * Visible when all conditions are met:
   * - body has `template-doc--has-nav`
   * - body does not have `template-doc--nav-drawer`
   * - body does not have `template-doc--nav-collapsed`
   * - viewport is at least the `lg` breakpoint
   * - no stored/user nav width overrides `userNavWidth`
   *
   * Flow: defaultNavWidth -> preferredNavWidth -> activeNavWidth.
   */
  defaultNavWidth: '260px',
  /**
   * Fallback desktop table-of-contents sidebar width.
   *
   * Visible when all conditions are met:
   * - body has `template-doc--has-toc`
   * - body does not have `template-doc--toc-collapsed`
   * - viewport is wider than the `toc` collapse breakpoint
   * - no stored/user TOC width overrides `userTocWidth`
   *
   * Flow: defaultTocWidth -> preferredTocWidth -> activeTocWidth.
   */
  defaultTocWidth: '240px',
  /**
   * Width of the collapsed nav/TOC edge rail.
   *
   * Visible when a sidebar is collapsed but still exposes its edge rail:
   * - nav rail: desktop nav exists, is not drawer mode, and nav is collapsed
   * - TOC rail: TOC exists and is collapsed or below its collapse breakpoint
   *
   * Also used by page scripts as the fallback pointer edge-open threshold.
   * Flow: defaultRailWidth -> activeRailWidth.
   */
  defaultRailWidth: '26px',
  /**
   * Fallback start padding for the normal desktop doc shell.
   *
   * Visible when all conditions are met:
   * - body uses the doc template
   * - body does not have `template-doc--full-main`
   * - viewport is at least the `lg` breakpoint
   * - no stored/user shell start padding overrides `userShellPaddingInlineStart`
   *
   * Not visible on compact/mobile layouts or full-main layouts.
   * Flow: defaultShellPaddingInlineStart -> preferredShellPaddingInlineStart
   * -> activeShellPaddingInlineStart -> .doc-shell padding-inline-start.
   */
  defaultShellPaddingInlineStart: '1rem',
  /**
   * Fallback end padding for the normal desktop doc shell.
   *
   * Visible when all conditions are met:
   * - body uses the doc template
   * - body does not have `template-doc--full-main`
   * - viewport is at least the `lg` breakpoint
   * - no stored/user shell end padding overrides `userShellPaddingInlineEnd`
   *
   * Not visible on compact/mobile layouts or full-main layouts.
   * Flow: defaultShellPaddingInlineEnd -> preferredShellPaddingInlineEnd
   * -> activeShellPaddingInlineEnd -> .doc-shell padding-inline-end.
   */
  defaultShellPaddingInlineEnd: '1rem',
  /**
   * Fallback block padding for the normal desktop doc shell.
   *
   * Visible when all conditions are met:
   * - body uses the doc template
   * - body does not have `template-doc--full-main`
   * - viewport is at least the `lg` breakpoint
   *
   * Not currently user-overridable. Not visible on compact/mobile layouts or
   * full-main layouts.
   * Flow: defaultShellPaddingBlock -> activeShellPaddingBlock
   * -> .doc-shell padding-block.
   */
  defaultShellPaddingBlock: '1rem',
  /**
   * Start padding for compact/mobile doc shells.
   *
   * Visible when all conditions are met:
   * - body uses the doc template
   * - viewport is below the `lg` breakpoint
   *
   * Applies to both normal and full-main doc layouts on mobile.
   * Flow: compactShellPaddingInlineStart -> activeShellPaddingInlineStart
   * -> .doc-shell padding-inline-start.
   */
  compactShellPaddingInlineStart: '1rem',
  /**
   * End padding for compact/mobile doc shells.
   *
   * Visible when all conditions are met:
   * - body uses the doc template
   * - viewport is below the `lg` breakpoint
   *
   * Applies to both normal and full-main doc layouts on mobile.
   * Flow: compactShellPaddingInlineEnd -> activeShellPaddingInlineEnd
   * -> .doc-shell padding-inline-end.
   */
  compactShellPaddingInlineEnd: '1rem',
  /**
   * Block padding for compact/mobile doc shells.
   *
   * Visible when all conditions are met:
   * - body uses the doc template
   * - viewport is below the `lg` breakpoint
   *
   * Applies to both normal and full-main doc layouts on mobile.
   * Flow: compactShellPaddingBlock -> activeShellPaddingBlock
   * -> .doc-shell padding-block.
   */
  compactShellPaddingBlock: '1rem',
  /**
   * Start padding for desktop full-main doc shells.
   *
   * Visible when all conditions are met:
   * - body has `template-doc--full-main`
   * - viewport is at least the `lg` breakpoint
   *
   * Below `lg`, compactShellPaddingInlineStart wins through the more specific
   * mobile full-main override.
   * Flow: fullShellPaddingInlineStart -> activeShellPaddingInlineStart
   * -> .doc-shell padding-inline-start.
   */
  fullShellPaddingInlineStart: '1rem',
  /**
   * End padding for desktop full-main doc shells.
   *
   * Visible when all conditions are met:
   * - body has `template-doc--full-main`
   * - viewport is at least the `lg` breakpoint
   *
   * Below `lg`, compactShellPaddingInlineEnd wins through the more specific
   * mobile full-main override.
   * Flow: fullShellPaddingInlineEnd -> activeShellPaddingInlineEnd
   * -> .doc-shell padding-inline-end.
   */
  fullShellPaddingInlineEnd: '1rem',
  /**
   * Block padding for desktop full-main doc shells.
   *
   * Visible when all conditions are met:
   * - body has `template-doc--full-main`
   * - viewport is at least the `lg` breakpoint
   *
   * Below `lg`, compactShellPaddingBlock wins through the more specific mobile
   * full-main override.
   * Flow: fullShellPaddingBlock -> activeShellPaddingBlock
   * -> .doc-shell padding-block.
   */
  fullShellPaddingBlock: '1rem',
  /**
   * Minimum persisted/user nav sidebar width.
   *
   * Used whenever a stored/user nav width is applied. It clamps userNavWidth
   * before that value can become preferredNavWidth and then activeNavWidth.
   * Visible only when activeNavWidth is non-zero.
   */
  minNavWidth: '220px',
  /**
   * Maximum persisted/user nav sidebar width.
   *
   * Used whenever a stored/user nav width is applied. It clamps userNavWidth
   * before that value can become preferredNavWidth and then activeNavWidth.
   * Visible only when activeNavWidth is non-zero.
   */
  maxNavWidth: '420px',
  /**
   * Minimum persisted/user table-of-contents sidebar width.
   *
   * Used whenever a stored/user TOC width is applied. It clamps userTocWidth
   * before that value can become preferredTocWidth and then activeTocWidth.
   * Visible only when activeTocWidth is non-zero.
   */
  minTocWidth: '180px',
  /**
   * Maximum persisted/user table-of-contents sidebar width.
   *
   * Used whenever a stored/user TOC width is applied. It clamps userTocWidth
   * before that value can become preferredTocWidth and then activeTocWidth.
   * Visible only when activeTocWidth is non-zero.
   */
  maxTocWidth: '360px',
} as const

export function docLayoutVar(name: keyof typeof docLayoutVars) {
  return `var(${docLayoutVars[name]})`
}

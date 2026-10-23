import type { Style } from '@purestack/ts-css'
import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'

export function registerResponsiveStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.media('min-width: 1600px').select('.landing-page .container').css({
    width: 'min(1200px, calc(100% - 120px))',
  })
  root.media('min-width: 1600px').select('.landing-page .hero').css({
    paddingTop: '85px',
  })
  root.media('min-width: 1600px').select('.landing-page .hero h1').css({
    fontSize: '88px',
  })
  root.media('min-width: 1600px').select('.landing-page .source-code').css({
    fontSize: '13px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .container')
    .css({
      width: 'calc(100% - 64px)',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .source-code')
    .css({
      paddingLeft: '23px',
      fontSize: palette.font.size.xs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .content-preview')
    .css({
      paddingInline: '30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select(
      '.landing-page .ai-layout, .landing-page .start-layout, .landing-page .faq-layout',
    )
    .css({
      gap: '50px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .feature-small h3')
    .css({
      fontSize: '15px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .tree-note')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .output-sample')
    .css({
      gap: '4px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .output-sample > span')
    .css({
      paddingInline: '5px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .tone-sample > span')
    .css({
      fontSize: '8px',
      marginLeft: '7px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .header-inner')
    .css({
      height: '68px',
      gap: '20px',
    })
  root.media(mediaBelow(BREAKPOINTS.md)).select('.landing-page .hero h1').css({
    fontSize: '66px',
    letterSpacing: '-3px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .hero-description')
    .css({
      fontSize: '15px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .content-preview')
    .css({
      padding: '30px 22px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .content-preview h2')
    .css({
      fontSize: '28px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .source-code')
    .css({
      paddingLeft: '20px',
      fontSize: palette.font.size.xxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .workbench-title')
    .css({
      fontSize: palette.font.size.xxxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .workbench-language')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .feature-small')
    .css({
      gridColumn: 'span 3',
    })
  root.media(mediaBelow(BREAKPOINTS.md)).select('.landing-page .section').css({
    paddingBlock: '70px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .section h2, .landing-page .start-section h2')
    .css({
      fontSize: '36px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .ai-layout')
    .css({
      gap: '35px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .ai-layout h2')
    .css({
      fontSize: '32px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-inputs')
    .css({
      gap: '5px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-inputs > span')
    .css({
      fontSize: '8px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-core')
    .css({
      width: '85%',
      padding: '20px 10px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-output')
    .css({
      width: '100%',
      fontSize: palette.font.size.xxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .split-heading')
    .css({
      display: 'block',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .split-heading > p')
    .css({
      marginTop: '20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .package-card')
    .css({
      padding: '23px',
      gap: '12px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .package-card h3')
    .css({
      fontSize: palette.font.size.body,
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .package-card code')
    .css({
      fontSize: palette.font.size.xxxs,
      overflowWrap: 'anywhere',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .start-layout')
    .css({
      gap: '30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .terminal-body')
    .css({
      padding: '23px 17px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select(
      '.landing-page .terminal-command pre, .landing-page .terminal-command code',
    )
    .css({
      fontSize: palette.font.size.xxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .faq-layout')
    .css({
      gap: '30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .faq-list summary')
    .css({
      fontSize: palette.font.size.sm,
    })
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .footer-top nav')
    .css({
      gap: '45px',
    })
  root.media(mediaBelow(BREAKPOINTS.sm)).select(':scope').css({
    scrollPaddingTop: '86px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .container')
    .css({
      width: 'calc(100% - 40px)',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-inner')
    .css({
      height: '65px',
      gap: '20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .desktop-nav')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .header-actions')
    .css({
      marginLeft: 'auto',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-source > span')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-source .icon')
    .css({
      width: '20px',
      height: '20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu')
    .css({
      display: 'block',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu summary')
    .css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '34px',
      height: '38px',
      listStyle: 'none',
      cursor: 'pointer',
      color: tone.neutral.surfaceAlt.rest.text,
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu summary::-webkit-details-marker')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu nav')
    .css({
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      display: 'flex',
      flexDirection: 'column',
      padding: '13px 20px 20px',
      background: tone.accent.canvas,
      borderBottom: `1px solid ${tone.accent.surface.rest.border}`,
      boxShadow: palette.effect.floatingShadow,
    })
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu nav a')
    .css({
      padding: '12px 3px',
      fontSize: palette.font.size.body,
      borderBottom: `1px solid ${tone.neutral.border.subtle}`,
    })
  root.media(mediaBelow(BREAKPOINTS.sm)).select('.landing-page .hero').css({
    paddingTop: '43px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .release-note')
    .css({
      fontSize: '8px',
      letterSpacing: '0.6px',
      gap: '8px',
      padding: '6px 8px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .release-note > span:last-child')
    .css({
      marginLeft: '0',
    })
  root.media(mediaBelow(BREAKPOINTS.sm)).select('.landing-page .hero h1').css({
    fontSize: 'clamp(42px, 10.3vw, 61px)',
    letterSpacing: '-2.5px',
    marginTop: '27px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-description')
    .css({
      fontSize: palette.font.size.body,
      marginTop: '22px !important',
      lineHeight: '1.8',
      maxWidth: '340px',
      marginInline: 'auto !important',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .desktop-break')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-actions')
    .css({
      marginTop: '25px',
      gap: '9px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-actions .button')
    .css({
      padding: '11px 14px',
      gap: '9px',
      fontSize: palette.font.size.sm,
      minHeight: '44px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-notes')
    .css({
      gap: '10px 14px',
      fontSize: palette.font.size.xxxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-notes .icon')
    .css({
      width: '11px',
      height: '11px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-wrap')
    .css({
      marginTop: '34px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench')
    .css({
      borderRadius: '7px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-toolbar')
    .css({
      height: '34px',
      paddingInline: '13px',
      gap: '15px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-title')
    .css({
      fontSize: '8px',
      letterSpacing: '0',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .window-dots')
    .css({
      gap: '4px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .window-dots i')
    .css({
      width: '5px',
      height: '5px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.workbench-tabs .tabs__tabs-row')
    .css({
      height: '43px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)')
    .css({
      paddingInline: '13px',
      fontSize: palette.font.size.xxxs,
      gap: '6px',
      flex: '1',
      justifyContent: 'center',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .source-pane')
    .css({
      borderRight: '0',
      borderBottom: `1px solid ${tone.neutral.border.subtle}`,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .pane-caption')
    .css({
      paddingInline: '17px',
      fontSize: '8px',
      height: '37px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .source-code')
    .css({
      fontSize: palette.font.size.xxs,
      lineHeight: '1.85',
      padding: '4px 19px 20px',
      minHeight: '248px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .content-preview')
    .css({
      padding: '17px 27px 26px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .content-preview h2')
    .css({
      fontSize: '30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .content-preview > p')
    .css({
      fontSize: palette.font.size.sm,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .demo-panel')
    .css({
      marginTop: '20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .demo-panel .panel__body')
    .css({
      padding: '16px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-status')
    .css({
      fontSize: '8px',
      paddingInline: '12px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-status > span:last-child')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-caption')
    .css({
      fontSize: palette.font.size.xxs,
      maxWidth: '290px',
      marginInline: 'auto !important',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .counter-preview')
    .css({
      minHeight: '271px',
      paddingTop: '27px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .style-preview')
    .css({
      minHeight: '271px',
      padding: '21px 30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .build-for')
    .css({
      marginTop: '42px',
      paddingBottom: '30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .build-for > span')
    .css({
      fontSize: '8px',
      letterSpacing: '1px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .build-for > div')
    .css({
      gap: '13px 23px',
      fontSize: palette.font.size.sm,
    })
  root.media(mediaBelow(BREAKPOINTS.sm)).select('.landing-page .section').css({
    paddingBlock: '56px',
  })
  root.media(mediaBelow(BREAKPOINTS.sm)).select('.landing-page .eyebrow').css({
    fontSize: palette.font.size.xxxs,
    letterSpacing: '1.1px',
    marginBottom: '15px',
  })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section h2, .landing-page .start-section h2')
    .css({
      fontSize: palette.font.size.h2,
      letterSpacing: '-1.4px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section-heading')
    .css({
      marginBottom: '27px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section-heading > p')
    .css({
      fontSize: palette.font.size.sm,
      lineHeight: '1.8',
      marginTop: '16px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-grid')
    .css({
      gap: '13px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .regor-highlight')
    .css({
      gap: '24px',
      padding: '24px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-card, .landing-page .feature-small')
    .css({
      gridColumn: '1',
      minHeight: 'auto',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-card h3, .landing-page .feature-small h3')
    .css({
      fontSize: '18px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-card .feature-summary')
    .css({
      fontSize: palette.font.size.sm,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-small:last-child')
    .css({
      gridColumn: '1',
      display: 'block',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-small:last-child .editor-sample')
    .css({
      marginTop: '27px',
      width: 'max-content',
      maxWidth: '100%',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-icon')
    .css({
      marginBottom: '16px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .file-tree')
    .css({
      padding: '16px',
      fontSize: palette.font.size.xxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .tone-sample > span')
    .css({
      fontSize: palette.font.size.xxxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .tone-sample')
    .css({
      marginTop: '23px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .tone-sample i')
    .css({
      width: '30px',
      height: '30px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .output-sample')
    .css({
      marginTop: '23px',
      gap: '7px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .output-sample > span')
    .css({
      padding: '6px 8px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-section')
    .css({
      paddingBlock: '53px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-layout')
    .css({
      gap: '40px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-layout h2')
    .css({
      fontSize: '33px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-layout > div > p')
    .css({
      fontSize: palette.font.size.sm,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .source-diagram')
    .css({
      width: 'min(360px, 100%)',
      marginInline: 'auto',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .diagram-inputs > span')
    .css({
      fontSize: palette.font.size.xxxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .diagram-core')
    .css({
      width: '70%',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .diagram-output')
    .css({
      width: '83%',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card')
    .css({
      padding: '25px 20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card:nth-child(odd)')
    .css({
      borderRight: '0',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card:not(:last-child)')
    .css({
      borderBottom: `1px solid ${tone.neutral.border.subtle}`,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card h3')
    .css({
      fontSize: palette.font.size.h6,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card code')
    .css({
      fontSize: palette.font.size.xxs,
      marginTop: '15px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ecosystem-note')
    .css({
      flexDirection: 'column',
      gap: '14px',
      fontSize: palette.font.size.xxs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-section')
    .css({
      paddingBlock: '53px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-layout')
    .css({
      gap: '35px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-copy > p')
    .css({
      fontSize: palette.font.size.sm,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-steps')
    .css({
      gap: '17px',
      marginTop: '25px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .terminal-body')
    .css({
      padding: '26px 20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(
      '.landing-page .terminal-command pre, .landing-page .terminal-command code',
    )
    .css({
      fontSize: palette.font.size.xs,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .faq-layout')
    .css({
      gap: '25px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .faq-intro br')
    .css({
      display: 'none',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .faq-list summary')
    .css({
      fontSize: '13px',
      paddingBlock: '19px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-section')
    .css({
      paddingBlock: '52px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-section h2')
    .css({
      fontSize: '42px',
      letterSpacing: '-1.8px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-section p')
    .css({
      fontSize: palette.font.size.sm,
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-note')
    .css({
      fontSize: '8px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-top')
    .css({
      flexDirection: 'column',
      gap: '30px',
      paddingBottom: '29px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-top nav')
    .css({
      gap: '65px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-bottom')
    .css({
      flexWrap: 'wrap',
      fontSize: '8px',
      gap: '17px',
      paddingBlock: '20px',
    })
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-built')
    .css({
      display: 'none',
    })
  root.media('prefers-reduced-motion: reduce').select(':scope').css({
    scrollBehavior: 'auto',
  })
  root
    .media('prefers-reduced-motion: reduce')
    .select('.landing-page *, .landing-page *::before, .landing-page *::after')
    .css({
      transition: 'none !important',
      animation: 'none !important',
    })
}

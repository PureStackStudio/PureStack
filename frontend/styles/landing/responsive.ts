import type { Style } from '@purestack/ts-css'
import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'

export function registerResponsiveStyles(root: Style, palette: ThemePalette) {
  registerWideScreenStyles(root)
  registerBelowLargeStyles(root, palette)
  registerBelowMediumStyles(root, palette)
  registerMobileFrameStyles(root)
  registerCompactNavigationStyles(root, palette)
  registerMobileHeroStyles(root, palette)
  registerMobileWorkbenchStyles(root, palette)
  registerMobileFeatureStyles(root, palette)
  registerMobileArchitectureStyles(root, palette)
  registerMobileEcosystemStyles(root, palette)
  registerMobileGettingStartedStyles(root, palette)
  registerMobileClosingStyles(root, palette)
  registerReducedMotionStyles(root)
}

function registerWideScreenStyles(root: Style) {
  root
    .media('min-width: 1600px')
    .select('.landing-page .container')
    .width('min(1200px, calc(100% - 120px))')
  root
    .media('min-width: 1600px')
    .select('.landing-page .hero')
    .paddingTop('85px')
  root
    .media('min-width: 1600px')
    .select('.landing-page .hero h1')
    .fontSize('88px')
  root
    .media('min-width: 1600px')
    .select('.landing-page .source-code')
    .fontSize('13px')
}

function registerBelowLargeStyles(root: Style, palette: ThemePalette) {
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .container')
    .width('calc(100% - 64px)')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .source-code')
    .paddingLeft('23px')
    .fontSize(palette.font.size.xs)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .content-preview')
    .paddingInline('30px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select(
      '.landing-page .ai-layout, .landing-page .start-layout, .landing-page .faq-layout',
    )
    .gap('50px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .feature-small h3')
    .fontSize('15px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .tree-note')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .output-sample')
    .gap('4px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .output-sample > span')
    .paddingInline('5px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .tone-sample > span')
    .fontSize('8px')
    .marginLeft('7px')
}

function registerBelowMediumStyles(root: Style, palette: ThemePalette) {
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .header-inner')
    .gridTemplateRows('68px auto')
    .columnGap('0.5rem')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .hero h1')
    .fontSize('66px')
    .letterSpacing('-3px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .hero-description')
    .fontSize('15px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .content-preview')
    .padding('30px 22px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .content-preview h2')
    .fontSize('28px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .source-code')
    .paddingLeft('20px')
    .fontSize(palette.font.size.xxs)
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .workbench-title')
    .fontSize(palette.font.size.xxxs)
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .workbench-language')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .feature-small')
    .gridColumn('span 3')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .section')
    .paddingBlock('70px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .section h2, .landing-page .start-section h2')
    .fontSize('36px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .ai-layout')
    .gap('35px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .ai-layout h2')
    .fontSize('32px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-inputs')
    .gap('5px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-inputs > span')
    .fontSize('8px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-core')
    .width('85%')
    .padding('20px 10px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .diagram-output')
    .width('100%')
    .fontSize(palette.font.size.xxs)
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .split-heading')
    .display('block')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .split-heading > p')
    .marginTop('20px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .package-card')
    .padding('23px')
    .gap('12px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .package-card h3')
    .fontSize(palette.font.size.body)
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .package-card code')
    .fontSize(palette.font.size.xxxs)
    .overflowWrap('anywhere')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .start-layout')
    .gap('30px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .terminal-body')
    .padding('23px 17px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select(
      '.landing-page .terminal-command pre, .landing-page .terminal-command code',
    )
    .fontSize(palette.font.size.xxs)
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .faq-layout')
    .gap('30px')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .faq-list summary')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.landing-page .footer-top nav')
    .gap('45px')
}

function registerMobileFrameStyles(root: Style) {
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(':scope')
    .scrollPaddingTop('86px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .container')
    .width('calc(100% - 40px)')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-inner')
    .gridTemplateRows('65px auto')
    .columnGap('0.5rem')
}

function registerCompactNavigationStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .header-inner')
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gridTemplateRows('78px auto')
    .height('auto')
    .gap('0 0.75rem')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .desktop-nav')
    .display('flex')
    .gridColumn('1 / -1')
    .gridRow('2')
    .width('100%')
    .margin('0')
    .padding('0')
    .gap('0')
    .borderTop(`1px solid ${tone.neutral.border.subtle}`)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .desktop-nav a:not(.header-docs)')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .desktop-nav .header-docs')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .flex('1 1 0')
    .gap('0.5rem')
    .minHeight('44px')
    .padding('0.5rem 0.75rem')
    .fontWeight('600')
    .color(tone.accent.text.default)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .desktop-nav .header-docs + .header-docs')
    .borderInlineStart(`1px solid ${tone.neutral.border.subtle}`)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .desktop-nav .header-docs-icon')
    .display('inline-flex')
    .width('16px')
    .height('16px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .header-actions')
    .gridColumn('2')
    .gridRow('1')
    .marginLeft('auto')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select(':scope:has(> body.landing-page)')
    .scrollPaddingTop('140px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-actions .topbar__actions > a')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-source > span')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .header-source .icon')
    .width('20px')
    .height('20px')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu')
    .display('block')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu summary')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .width('44px')
    .height('44px')
    .listStyle('none')
    .cursor('pointer')
    .color(tone.neutral.surfaceAlt.rest.text)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu summary::-webkit-details-marker')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu nav')
    .position('absolute')
    .top('100%')
    .left('0')
    .right('0')
    .display('flex')
    .flexDirection('column')
    .padding('13px 20px 20px')
    .maxHeight('calc(100dvh - 8rem)')
    .overflowY('auto')
    .overscrollBehavior('contain')
    .background(tone.accent.canvas)
    .borderBottom(`1px solid ${tone.accent.surface.rest.border}`)
    .boxShadow(palette.effect.floatingShadow)
  root
    .media(mediaBelow(BREAKPOINTS.lg))
    .select('.landing-page .mobile-menu nav a')
    .padding('12px 3px')
    .fontSize(palette.font.size.body)
    .borderBottom(`1px solid ${tone.neutral.border.subtle}`)
}

function registerMobileHeroStyles(root: Style, palette: ThemePalette) {
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero')
    .paddingTop('43px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .release-note')
    .fontSize('8px')
    .letterSpacing('0.6px')
    .gap('8px')
    .padding('6px 8px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .release-note > span:last-child')
    .marginLeft('0')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero h1')
    .fontSize('clamp(42px, 10.3vw, 61px)')
    .letterSpacing('-2.5px')
    .marginTop('27px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-description')
    .fontSize(palette.font.size.body)
    .marginTop('22px !important')
    .lineHeight('1.8')
    .maxWidth('340px')
    .marginInline('auto !important')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .desktop-break')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-actions')
    .marginTop('25px')
    .gap('9px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-actions .button')
    .padding('11px 14px')
    .gap('9px')
    .fontSize(palette.font.size.sm)
    .minHeight('44px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-notes')
    .gap('10px 14px')
    .fontSize(palette.font.size.xxxs)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .hero-notes .icon')
    .width('11px')
    .height('11px')
}

function registerMobileWorkbenchStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-wrap')
    .marginTop('34px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench')
    .borderRadius('7px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-toolbar')
    .height('34px')
    .paddingInline('13px')
    .gap('15px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-title')
    .fontSize('8px')
    .letterSpacing('0')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .window-dots')
    .gap('4px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .window-dots i')
    .width('5px')
    .height('5px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.workbench-tabs .tabs__tabs-row')
    .height('43px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.workbench-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)')
    .paddingInline('13px')
    .fontSize(palette.font.size.xxxs)
    .gap('6px')
    .flex('1')
    .justifyContent('center')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .source-pane')
    .borderRight('0')
    .borderBottom(`1px solid ${tone.neutral.border.subtle}`)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .pane-caption')
    .paddingInline('17px')
    .fontSize('8px')
    .height('37px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .source-code')
    .fontSize(palette.font.size.xxs)
    .lineHeight('1.85')
    .padding('4px 19px 20px')
    .minHeight('248px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .content-preview')
    .padding('17px 27px 26px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .content-preview h2')
    .fontSize('30px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .content-preview > p')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .demo-panel')
    .marginTop('20px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .demo-panel .panel__body')
    .padding('16px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-status')
    .fontSize('8px')
    .paddingInline('12px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-status > span:last-child')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .workbench-caption')
    .fontSize(palette.font.size.xxs)
    .maxWidth('290px')
    .marginInline('auto !important')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .counter-preview')
    .minHeight('271px')
    .paddingTop('27px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .style-preview')
    .minHeight('271px')
    .padding('21px 30px')
}

function registerMobileFeatureStyles(root: Style, palette: ThemePalette) {
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .build-for')
    .marginTop('42px')
    .paddingBottom('30px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .build-for > span')
    .fontSize('8px')
    .letterSpacing('1px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .build-for > div')
    .gap('13px 23px')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section')
    .paddingBlock('56px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .eyebrow')
    .fontSize(palette.font.size.xxxs)
    .letterSpacing('1.1px')
    .marginBottom('15px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section h2, .landing-page .start-section h2')
    .fontSize(palette.font.size.h2)
    .letterSpacing('-1.4px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section-heading')
    .marginBottom('27px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .section-heading > p')
    .fontSize(palette.font.size.sm)
    .lineHeight('1.8')
    .marginTop('16px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-grid')
    .gap('13px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .regor-highlight')
    .gap('24px')
    .padding('24px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-card, .landing-page .feature-small')
    .gridColumn('1')
    .minHeight('auto')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-card h3, .landing-page .feature-small h3')
    .fontSize('18px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-card .feature-summary')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-small:last-child')
    .gridColumn('1')
    .display('block')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-small:last-child .editor-sample')
    .marginTop('27px')
    .width('max-content')
    .maxWidth('100%')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .feature-icon')
    .marginBottom('16px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .file-tree')
    .padding('16px')
    .fontSize(palette.font.size.xxs)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .tone-sample > span')
    .fontSize(palette.font.size.xxxs)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .tone-sample')
    .marginTop('23px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .tone-sample i')
    .width('30px')
    .height('30px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .output-sample')
    .marginTop('23px')
    .gap('7px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .output-sample > span')
    .padding('6px 8px')
}

function registerMobileArchitectureStyles(root: Style, palette: ThemePalette) {
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-section')
    .paddingBlock('53px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-layout')
    .gap('40px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-layout h2')
    .fontSize('33px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ai-layout > div > p')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .source-diagram')
    .width('min(360px, 100%)')
    .marginInline('auto')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .diagram-inputs > span')
    .fontSize(palette.font.size.xxxs)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .diagram-core')
    .width('70%')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .diagram-output')
    .width('83%')
}

function registerMobileEcosystemStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone

  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card')
    .padding('25px 20px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card:nth-child(odd)')
    .borderRight('0')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card:not(:last-child)')
    .borderBottom(`1px solid ${tone.neutral.border.subtle}`)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card h3')
    .fontSize(palette.font.size.h6)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .package-card code')
    .fontSize(palette.font.size.xxs)
    .marginTop('15px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .ecosystem-note')
    .flexDirection('column')
    .gap('14px')
    .fontSize(palette.font.size.xxs)
}

function registerMobileGettingStartedStyles(
  root: Style,
  palette: ThemePalette,
) {
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-section')
    .paddingBlock('53px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-layout')
    .gap('35px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-copy > p')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .start-steps')
    .gap('17px')
    .marginTop('25px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .terminal-body')
    .padding('26px 20px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select(
      '.landing-page .terminal-command pre, .landing-page .terminal-command code',
    )
    .fontSize(palette.font.size.xs)
}

function registerMobileClosingStyles(root: Style, palette: ThemePalette) {
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .faq-layout')
    .gap('25px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .faq-intro br')
    .display('none')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .faq-list summary')
    .fontSize('13px')
    .paddingBlock('19px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-section')
    .paddingBlock('52px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-section h2')
    .fontSize('42px')
    .letterSpacing('-1.8px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-section p')
    .fontSize(palette.font.size.sm)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .closing-note')
    .fontSize('8px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-top')
    .flexDirection('column')
    .gap('30px')
    .paddingBottom('29px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-top nav')
    .gap('65px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-bottom')
    .flexWrap('wrap')
    .fontSize('8px')
    .gap('17px')
    .paddingBlock('20px')
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.landing-page .footer-built')
    .display('none')
}

function registerReducedMotionStyles(root: Style) {
  root
    .media('prefers-reduced-motion: reduce')
    .select(':scope')
    .scrollBehavior('auto')
  root
    .media('prefers-reduced-motion: reduce')
    .select('.landing-page *, .landing-page *::before, .landing-page *::after')
    .transition('none !important')
    .animation('none !important')
}

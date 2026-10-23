import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export function registerFoundationStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select(':scope').css({
    scrollBehavior: 'smooth',
    scrollPaddingTop: '100px',
  })
  root.select('body.landing-page').css({
    margin: '0',
    fontFamily: palette.font.family.base,
    fontSize: palette.font.size.h6,
    lineHeight: '1.6',
    webkitFontSmoothing: 'antialiased',
  })
  root
    .select('.landing-page *, .landing-page *::before, .landing-page *::after')
    .css({
      boxSizing: 'border-box',
    })
  root.select('.landing-page :is(h1, h2, h3, p, pre)').css({
    margin: '0',
  })
  root.select('.landing-page :is(h1, h2, h3)').css({
    color: 'inherit',
    fontWeight: '550',
  })
  root.select('.landing-page a:not(.btn)').css({
    color: 'inherit',
    textDecoration: 'none',
  })
  root.select('.landing-page button').css({
    font: 'inherit',
    cursor: 'pointer',
  })
  root.select('.landing-page button:disabled').css({
    cursor: 'default',
  })
  root
    .select('.landing-page :is(a, button, summary, [tabindex]):focus-visible')
    .css({
      outline: `2px solid ${tone.accent.text.default}`,
      outlineOffset: '5px',
    })
  root.select('.landing-page ::selection').css({
    color: tone.neutral.canvas,
    background: tone.accent.text.default,
  })
  root.select('.landing-page [hidden]').css({
    display: 'none !important',
  })
  root.select('.landing-page .icon').css({
    display: 'inline-flex',
    flexShrink: '0',
    width: '20px',
    height: '20px',
    color: 'inherit',
  })
  root.select('.landing-page .icon svg').css({
    width: '100%',
    height: '100%',
  })
  root.select('.landing-page .container').css({
    width: 'min(1120px, calc(100% - 80px))',
    marginInline: 'auto',
  })
  root.select('.landing-page .skip-link').css({
    position: 'fixed',
    zIndex: '100',
    top: '12px',
    left: '16px',
    transform: 'translateY(-200%)',
    padding: '10px 18px',
    background: tone.accent.text.default,
    color: `${tone.neutral.canvas} !important`,
    borderRadius: palette.radii.md,
  })
  root.select('.landing-page .skip-link:focus').css({
    transform: 'translateY(0)',
  })
}

import type { PageTemplate } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'

const previewStyles = `
html,body{margin:0;min-height:0;height:auto}
body.preview{display:block;min-height:0!important;padding:8px;box-sizing:border-box}
.site-guide-samples{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:1rem}
.site-guide-sample{min-width:0}
.site-guide-sample>code{display:block;margin:0 0 1rem}
.site-guide-sample iframe{width:100%;border:0;display:block}
.preview .nav__menu,.preview .page-toc{position:static!important;width:100%!important;max-height:none!important}
.preview .page-toc__panel-toggle,.preview .page-toc__restore-toggle,.preview .nav__panel-toggle,.preview .nav__collapse-toggle{display:none!important}
.site-guide-sample .consent{position:static!important;pointer-events:auto!important}
.site-guide-sample .consent__banner{position:static!important;display:block!important;max-width:none!important;width:100%!important}
.site-guide-sample .consent__panel,.site-guide-sample [data-consent-settings]{display:none!important}
.site-guide-sample .site-footer{margin:0;padding:1rem}
.site-guide-sample .site-footer__inner{padding:0}
.site-guide-sample .site-footer__bottom{flex-direction:column!important;align-items:start!important}
.site-guide-sample .sign-in__panel{position:static!important;transform:none!important;min-width:0!important;width:100%!important}
.site-guide-sample .sign-in{width:100%}
.preview .topbar{position:static!important;padding:.5rem!important}
.site-guide-sample .topbar__search{min-width:0}
.site-guide-sample .text-title{font-size:1.15rem;line-height:1.35}
.site-guide-sample .site-logo{max-width:100%}
`

// Presentation only: page head, assets, and component runtimes come from PureStack.
const frameScript = `
document.querySelectorAll('.site-guide-sample details.sign-in').forEach(menu=>menu.open=true);
document.querySelectorAll('.site-guide-sample .consent__banner').forEach(banner=>{banner.hidden=false;banner.removeAttribute('aria-hidden')});
if(window.parent!==window){
  const sync=()=>{document.documentElement.dataset.theme=parent.document.documentElement.dataset.theme||'light';document.documentElement.setAttribute('data-theme-ready','true')};
  sync();
  new MutationObserver(sync).observe(parent.document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const minimumHeight=frameElement ? parseFloat(frameElement.style.height)||0 : 0;
  const resize=()=>{if(frameElement)frameElement.style.height=Math.max(minimumHeight,Math.ceil(document.body.getBoundingClientRect().height))+'px'};
  new ResizeObserver(resize).observe(document.body);
  addEventListener('load',resize);
}
`

export const previewTemplate: PageTemplate = ({ head, bodyHtml, pageInfo }) => {
  head.push(h('style').raw(previewStyles))
  return h('html')
    .attr({ lang: pageInfo.locale ?? 'en' })
    .push(
      head,
      h('body')
        .class('preview template-doc doc-content tone--neutral')
        .raw(bodyHtml)
        .push(h('script').raw(frameScript)),
    )
}

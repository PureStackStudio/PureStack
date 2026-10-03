import fs from 'node:fs/promises'
import path from 'node:path'
import type {
  PageOutlineItem,
  SiteConfig,
  TsSsgContext,
} from '@purestack/ts-common'
import {
  type ComponentVariant,
  defineComponents,
} from '@purestack/ts-components'
import { renderApp } from '@purestack/ts-render'
import { SEMANTIC_TONES } from '@purestack/ts-style'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { withBasePath } from '@purestack/ts-util'
import { defineComponent, html, type RefOrValue, unref } from 'regor'

const variants: ComponentVariant[] = [
  'solid',
  'surface',
  'surfaceAlt',
  'spotlight',
  'glass',
  'flat',
  'flatAlt',
  'flatSolid',
  'outlineFill',
  'outline',
  'subtle',
  'subtleBtn',
  'link',
  'sheen',
  'underline',
  'rail',
  'bracket',
  'none',
]
const components = [
  'SiteFooter',
  'TopBar',
  'NavMenu',
  'NavList',
  'PageToc',
  'SearchBox',
  'SignIn',
  'Consent',
  'SiteLogo',
]
const modes = new Set(['NavMenu', 'PageToc', 'SignIn', 'Consent'])
const slugOf = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
const escapeAttribute = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
const mark =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%232563eb'/%3E%3Cpath d='m8 16 5 5 11-11' fill='none' stroke='white' stroke-width='3'/%3E%3C/svg%3E"

interface Sample {
  label: string
  template: string
  signedIn?: boolean
  search?: boolean
  auth?: boolean
  signUp?: boolean
  outline?: PageOutlineItem[]
}

function contextFor(site: SiteConfig, sample: Sample): TsSsgContext {
  return {
    site: {
      ...site,
      logo: { ...site.logo, brand: 'Studio', subtitle: undefined },
      pagefind: { ...site.pagefind, enabled: sample.search === true },
      auth: {
        ...site.auth,
        enabled: sample.auth !== false,
        signUp: sample.signUp === true,
      },
      consent: {
        ...site.consent,
        enabled: true,
        categories: [],
        services: [],
        bannerTitle: 'Privacy choices',
        bannerDescription: 'Choose how this example remembers preferences.',
      },
    },
    pageInfo: {
      relPath: 'components/site/index.mdx',
      urlPath: '/components/site/',
      frontmatter: {
        template: 'doc',
        hidden: false,
        draft: false,
        nav: { hidden: false },
        layout: {
          showNav: false,
          showToc: false,
          showFooter: false,
          fullWidth: false,
          navMode: 'sidebar',
          tocCollapsed: false,
        },
      },
    },
    theme: site.style.theme,
    basePath: site.basePath,
    locales: site.i18n.locales,
    defaultLocale: site.i18n.defaultLocale,
    resolveLocaleHref: () => undefined,
    resolvePublicHref: (href) => withBasePath(site.basePath, href),
    recordScriptEntrypoint: () => {},
    recordRuntimeEmbed: () => {},
    navigation: { root: '/components/', items: [] },
    outline: sample.outline ?? [
      {
        id: 'guide-intro',
        title: 'Introduction',
        depth: 2,
        children: [{ id: 'guide-detail', title: 'Details', depth: 3 }],
      },
    ],
  }
}

const previewCss = `html,body{margin:0;min-height:0;height:auto}body{padding:8px;box-sizing:border-box}.site-guide-samples{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:1rem}.site-guide-sample{min-width:0}.site-guide-sample>code{display:block;margin:0 0 1rem}.site-guide-sample iframe{width:100%;border:0;display:block}.site-guide-sample .nav__menu,.site-guide-sample .page-toc{position:static!important;width:100%!important;max-height:none!important}.site-guide-sample .page-toc__panel-toggle,.site-guide-sample .page-toc__restore-toggle,.site-guide-sample .nav__panel-toggle,.site-guide-sample .nav__restore-toggle{display:none!important}.site-guide-sample .consent{position:static!important;pointer-events:auto!important}.site-guide-sample .consent__banner{position:static!important;display:block!important;max-width:none!important;width:100%!important}.site-guide-sample .consent__panel,.site-guide-sample [data-consent-settings]{display:none!important}.site-guide-sample .site-footer{margin:0;padding:1rem}.site-guide-sample .site-footer__inner{padding:0}.site-guide-sample .site-footer__bottom{flex-direction:column!important;align-items:start!important}.site-guide-sample .sign-in__panel{position:static!important;transform:none!important;min-width:0!important;width:100%!important}.site-guide-sample .sign-in{width:100%}.site-guide-sample .topbar{position:static!important;padding:.5rem!important}.site-guide-sample .topbar__search{min-width:0}.site-guide-sample .text-title{font-size:1.15rem;line-height:1.35}.site-guide-sample .site-logo{max-width:100%}`

// Each frame follows its containing page's theme and grows to show every sample.
// No rendered page rewriting, global service registration, or preference mutation.
const frameScript = `document.querySelectorAll('.site-guide-sample details.sign-in').forEach(menu=>menu.open=true);document.querySelectorAll('.site-guide-sample .consent__banner').forEach(banner=>{banner.hidden=false;banner.removeAttribute('aria-hidden')});const sync=()=>{document.documentElement.dataset.theme=parent.document.documentElement.dataset.theme||'light';document.documentElement.setAttribute('data-theme-ready','true')};sync();new MutationObserver(sync).observe(parent.document.documentElement,{attributes:true,attributeFilter:['data-theme']});const resize=()=>{if(frameElement)frameElement.style.height=Math.ceil(document.body.getBoundingClientRect().height)+'px'};new ResizeObserver(resize).observe(document.body);addEventListener('load',resize);`

function documentFor(site: SiteConfig, body: string, signedIn = false): string {
  return `<!doctype html><html lang="en"${signedIn ? ' class="signed-in"' : ''}><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.css')}" data-theme="light"><link rel="stylesheet" href="${withBasePath(site.basePath, '/assets/site.dark.css')}" data-theme="dark"><style>${previewCss}</style></head><body class="template-doc doc-content tone--neutral" data-pagefind-ignore="all">${body}<script>${frameScript}</script></body></html>`
}

function templateFor(
  name: string,
  tone: string,
  variant: string,
  mode: string,
  index: number,
): string {
  const appearance = `tone="${tone}" variant="${variant}"${modes.has(name) ? ` variantMode="${mode}"` : ''}`
  switch (name) {
    case 'SiteLogo':
      return `<SiteLogo brand="Studio" subtitle="Build together" :href="null" tone="${tone}" markStyle="soft" appearance="badge"/>`
    case 'TopBar':
      return `<TopBar ${appearance}/>`
    case 'SignIn':
      return `<SignIn ${appearance} open label="Workspace account"><nav aria-label="Example account destinations"><BtnLink href="/components/" tone="${tone}" variant="subtleBtn">Component library</BtnLink><BtnLink href="/components/site/site-logo/" tone="${tone}" variant="subtleBtn">Branding guide</BtnLink></nav></SignIn>`
    case 'Consent':
      return `<Consent ${appearance}/>`
    case 'SearchBox':
      return `<SearchBox ${appearance}/>`
    case 'NavMenu':
      return `<NavMenu ${appearance} currentUrl="/components/site/" :items="[{title:'Components',tone:'${tone}',children:[{title:'Site guides',url:'/components/site/',tone:'${tone}'},{title:'Layout guides',url:'/components/layout/',tone:'${tone}'}]}]"/>`
    case 'NavList':
      return `<nav aria-label="Example guide links"><NavList tone="${tone}" :items="[{title:'Site guides',url:'/components/site/',tone:'${tone}',isActive:true,isOpen:false,stateKey:'site-${index}',ariaCurrent:'page'},{title:'Layout guides',url:'/components/layout/',tone:'${tone}',isActive:false,isOpen:false,stateKey:'layout-${index}'}]"/></nav>`
    case 'PageToc':
      return `<PageToc ${appearance} title="In this guide"/>`
    default:
      return `<div id="footer-${index}"></div><SiteFooter ${appearance} teleport="#footer-${index}" copyright="© Studio" legalLabel="Example guide destinations"><strong>A shared starting point</strong><template #legal><a href="/components/site/consent/">Privacy guide</a></template><template #social><a href="/components/">Components</a></template></SiteFooter>`
  }
}

function featureSamples(name: string): Sample[] {
  switch (name) {
    case 'TopBar':
      return [
        {
          label: 'SiteLogo identity',
          template: '<TopBar logoComponent="SiteLogo"/>',
        },
        {
          label: 'ClassicLogo identity',
          template: '<TopBar logoComponent="ClassicLogo"/>',
        },
        {
          label: 'Search enabled by site config',
          template: '<TopBar/>',
          search: true,
        },
        {
          label: 'Account access and avatar',
          template: `<TopBar :signInEnabled="true" signInAvatarSrc="${mark}" signInAvatarAlt="Studio account"/>`,
          signedIn: true,
        },
      ]
    case 'SignIn':
      return [
        { label: 'Signed out, sign-up disabled', template: '<SignIn open/>' },
        {
          label: 'Signed out, sign-up enabled',
          template: '<SignIn open/>',
          signUp: true,
        },
        {
          label: 'Signed in, default account icon',
          template: '<SignIn open/>',
          signedIn: true,
        },
        {
          label: 'Signed in, custom avatar',
          template: `<SignIn open avatarSrc="${mark}" avatarAlt="Studio account" label="Studio"/>`,
          signedIn: true,
        },
        {
          label: 'Custom icons and avatar slot',
          template:
            '<SignIn open icon="lucide:check" accountIcon="iconoir:check"><template #avatar><strong>PS</strong></template><a href="/components/">Custom account destination</a></SignIn>',
          signedIn: true,
        },
        {
          label: 'Authentication disabled',
          template:
            '<SignIn/><p>With site.auth.enabled false, no account control is rendered.</p>',
          auth: false,
        },
      ]
    case 'PageToc':
      return [
        {
          label: 'Nested outline',
          template: templateFor(name, 'accent', 'surface', 'stateless', 0),
        },
        {
          label: 'Flat outline and custom title',
          template: '<PageToc title="Read this chapter"/>',
          outline: [
            { id: 'guide-intro', title: 'Introduction', depth: 2 },
            { id: 'guide-detail', title: 'Details', depth: 2 },
          ],
        },
        {
          label: 'Empty outline',
          template: '<PageToc title="Waiting for sections"/>',
          outline: [],
        },
      ]
    case 'NavMenu':
      return [
        {
          label: 'Active child and open ancestor',
          template: templateFor(name, 'accent', 'surface', 'stateless', 0),
        },
        {
          label: 'Inactive, closed group',
          template:
            "<NavMenu currentUrl=\"/other/\" :items=\"[{title:'Components',children:[{title:'Layout',url:'/components/layout/'}]}]\"/>",
        },
        {
          label: 'Leaf links and icons',
          template:
            "<NavMenu :items=\"[{title:'Site guides',url:'/components/site/',icon:'lucide:check'},{title:'Forms',url:'/components/forms/',tone:'feature'}]\"/>",
        },
        {
          label: 'Search and account configuration',
          template: `<NavMenu signInAvatarSrc="${mark}" signInAvatarAlt="Studio account" :items="[{title:'Site guides',url:'/components/site/'}]"/>`,
          search: true,
          signedIn: true,
        },
      ]
    default:
      return []
  }
}

export function defineSiteAppearanceGallery(site: SiteConfig) {
  return defineComponent<{
    component: RefOrValue<string>
    axis: RefOrValue<string>
  }>(
    html`<iframe class="site-guide-frame w-full" :title="title" :src="previewHref" style="height:400px;border:0;display:block" loading="lazy"></iframe>`,
    {
      props: ['component', 'axis'],
      context: (head) => ({
        ...head.props,
        title: `${unref(head.props.component)} ${unref(head.props.axis)} examples`,
        previewHref: withBasePath(
          site.basePath,
          `/components/site/${slugOf(unref(head.props.component))}/guide-${unref(head.props.axis)}.html`,
        ),
      }),
    },
  )
}

export async function writeSiteGuidePreviews(site: SiteConfig) {
  for (const name of components) {
    const axes =
      name === 'SiteLogo'
        ? ['tone']
        : name === 'NavList'
          ? ['tone']
          : ['tone', 'variant', ...(modes.has(name) ? ['mode'] : [])]
    if (featureSamples(name).length) axes.push('features')
    for (const axis of axes) {
      const values =
        axis === 'tone'
          ? SEMANTIC_TONES
          : axis === 'variant'
            ? variants
            : ['stateless', 'stateful']
      const samples: Sample[] =
        axis === 'features'
          ? featureSamples(name)
          : values.map((value, index) => ({
              label: value,
              template: templateFor(
                name,
                axis === 'tone' ? value : 'accent',
                axis === 'variant'
                  ? value
                  : axis === 'mode'
                    ? 'outlineFill'
                    : 'surface',
                axis === 'mode' ? value : 'stateless',
                index,
              ),
            }))
      const cards = samples
        .map((sample) => {
          const body = renderApp(sample.template, {
            components: defineComponents(getSvgIcon),
            context: contextFor(site, sample),
          })
          const inner = `<div class="site-guide-sample">${body}</div>`
          // TopBar has a fixed toggle ID; account state is a document-level class.
          const isolated =
            name === 'TopBar' || name === 'SignIn' || sample.signedIn
          return `<section class="component-appearance-cell site-guide-sample"><code>${escapeAttribute(sample.label)}</code>${isolated ? `<iframe title="${escapeAttribute(sample.label)}" style="height:160px" srcdoc="${escapeAttribute(documentFor(site, inner, sample.signedIn))}"></iframe>` : body}</section>`
        })
        .join('')
      const targets =
        name === 'PageToc'
          ? '<section id="guide-intro"><h3>Introduction</h3><p>Outline links have real targets in this document.</p></section><section id="guide-detail"><h3>Details</h3><p>Nested entries link to supporting content.</p></section>'
          : ''
      const output = path.join(
        site.outDir,
        'components',
        'site',
        slugOf(name),
        `guide-${axis}.html`,
      )
      await fs.mkdir(path.dirname(output), { recursive: true })
      await fs.writeFile(
        output,
        documentFor(
          site,
          `<main class="site-guide-samples">${cards}</main>${targets}`,
        ),
        'utf8',
      )
    }
  }
}

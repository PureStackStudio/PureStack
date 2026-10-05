import type { SiteConfig } from '@purestack/ts-common'
import type { ComponentVariant } from '@purestack/ts-components'
import type { GeneratedPage } from '@purestack/ts-ssg'
import { SEMANTIC_TONES } from '@purestack/ts-style'
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
      return `<TopBar ${appearance} :search="false"/>`
    case 'SignIn':
      return `<SignIn :enabled="true" ${appearance} open label="Workspace account"><nav aria-label="Example account destinations"><BtnLink href="/components/" tone="${tone}" variant="subtleBtn">Component library</BtnLink><BtnLink href="/components/site/site-logo/" tone="${tone}" variant="subtleBtn">Branding guide</BtnLink></nav></SignIn>`
    case 'Consent':
      return `<Consent ${appearance}/>`
    case 'SearchBox':
      return `<SearchBox ${appearance}/>`
    case 'NavMenu':
      return `<NavMenu :search="false" :signInEnabled="false" ${appearance} currentUrl="/components/site/" :items="[{title:'Components',tone:'${tone}',children:[{title:'Site guides',url:'/components/site/',tone:'${tone}'},{title:'Layout guides',url:'/components/layout/',tone:'${tone}'}]}]"/>`
    case 'NavList':
      return `<nav aria-label="Example guide links"><NavList tone="${tone}" :items="[{title:'Site guides',url:'/components/site/',tone:'${tone}',isActive:true,isOpen:false,stateKey:'site-${index}',ariaCurrent:'page'},{title:'Layout guides',url:'/components/layout/',tone:'${tone}',isActive:false,isOpen:false,stateKey:'layout-${index}'}]"/></nav>`
    case 'PageToc':
      return `<PageToc ${appearance} title="In this guide" :outline="[{id:'introduction',title:'Introduction',depth:2,children:[{id:'details',title:'Details',depth:3}]}]"/>`
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
          template: '<TopBar logoComponent="SiteLogo" :search="false"/>',
        },
        {
          label: 'ClassicLogo identity',
          template: '<TopBar logoComponent="ClassicLogo" :search="false"/>',
        },
        {
          label: 'Search enabled for this instance',
          template: '<TopBar :search="true"/>',
        },
        {
          label: 'Account access and avatar',
          template: `<TopBar :search="false" :signInEnabled="true" :signInSignedIn="true" signInAvatarSrc="${mark}" signInAvatarAlt="Studio account"/>`,
        },
      ]
    case 'SignIn':
      return [
        {
          label: 'Signed out, sign-up disabled',
          template:
            '<SignIn :enabled="true" :signedIn="false" :signUp="false" open/>',
        },
        {
          label: 'Signed out, sign-up enabled',
          template:
            '<SignIn :enabled="true" :signedIn="false" :signUp="true" open/>',
        },
        {
          label: 'Signed in, default account icon',
          template: '<SignIn :enabled="true" :signedIn="true" open/>',
        },
        {
          label: 'Signed in, custom avatar',
          template: `<SignIn :enabled="true" :signedIn="true" open avatarSrc="${mark}" avatarAlt="Studio account" label="Studio"/>`,
        },
        {
          label: 'Custom icons and avatar slot',
          template:
            '<SignIn :enabled="true" :signedIn="true" open icon="lucide:check" accountIcon="iconoir:check"><template #avatar><strong>PS</strong></template><a href="/components/">Custom account destination</a></SignIn>',
        },
        {
          label: 'Authentication disabled',
          template:
            '<SignIn :enabled="false"/><p>With enabled false, no account control is rendered.</p>',
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
          template: `<PageToc title="Read this chapter" :outline="[{id:'introduction',title:'Introduction',depth:2},{id:'details',title:'Details',depth:2}]"/>`,
        },
        {
          label: 'Empty outline',
          template: '<PageToc title="Waiting for sections" :outline="[]"/>',
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
          template: `<NavMenu :search="false" :signInEnabled="false" currentUrl="/other/" :items="[{title:'Components',children:[{title:'Layout',url:'/components/layout/'}]}]"/>`,
        },
        {
          label: 'Leaf links and icons',
          template: `<NavMenu :search="false" :signInEnabled="false" :items="[{title:'Site guides',url:'/components/site/',icon:'lucide:check'},{title:'Forms',url:'/components/forms/',tone:'feature'}]"/>`,
        },
        {
          label: 'Search and account configuration',
          template: `<NavMenu :search="true" :signInEnabled="true" :signInSignedIn="true" signInAvatarSrc="${mark}" signInAvatarAlt="Studio account" :items="[{title:'Site guides',url:'/components/site/'}]"/>`,
        },
      ]
    default:
      return []
  }
}

export interface SiteAppearanceGallery {
  component: RefOrValue<string>
  axis: RefOrValue<'tone' | 'variant' | 'mode' | 'features'>
}

export function defineSiteAppearanceGallery(site: SiteConfig) {
  return defineComponent<SiteAppearanceGallery>(
    html`<iframe class="site-guide-frame w-full" :title="title" :src="previewHref" style="height:400px;border:0;display:block" loading="lazy"></iframe>`,
    {
      props: ['component', 'axis'],
      context: (head) => ({
        ...head.props,
        title: `${unref(head.props.component)} ${unref(head.props.axis)} examples`,
        previewHref: withBasePath(
          site.basePath,
          `/components/site/${slugOf(unref(head.props.component))}/guide-${unref(head.props.axis)}/`,
        ),
      }),
    },
  )
}

function sourceFor(title: string, body: string, showToc = false) {
  return `---\ntemplate: preview\nindex: false\ntitle: ${title}\nlayout:\n  showToc: ${showToc}\n---\n\n${body}`
}

export function sitePreviewPages(): GeneratedPage[] {
  const pages: GeneratedPage[] = []
  for (const name of components) {
    const axes =
      name === 'SiteLogo' || name === 'NavList'
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
      const root = `components/site/${slugOf(name)}/guide-${axis}`
      const cards = samples
        .map((sample, index) => {
          const template = sample.template
          // TopBar owns a document-level navigation toggle ID.
          const body =
            name === 'TopBar'
              ? `<iframe title="${escapeAttribute(sample.label)}" src="/${root}/sample-${index}/" style="height:160px"></iframe>`
              : template
          if (name === 'TopBar')
            pages.push({
              path: `${root}/sample-${index}.mdx`,
              source: sourceFor(
                sample.label,
                `<div class="site-guide-sample">${template}</div>`,
              ),
            })
          return `<section class="component-appearance-cell site-guide-sample"><code>${escapeAttribute(sample.label)}</code>${body}</section>`
        })
        .join('\n')
      const targets =
        name === 'PageToc'
          ? '\n\n## Introduction\n\nOutline links have real targets.\n\n### Details\n\nSupporting content.'
          : ''
      pages.push({
        path: `${root}.mdx`,
        source: sourceFor(
          `${name} ${axis} examples`,
          `<main class="site-guide-samples">${cards}</main>${targets}`,
          name === 'PageToc',
        ),
      })
    }
  }
  return pages
}

import type { SiteConfig } from '@purestack/ts-common'
import { withBasePath } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export interface ConsentPreview {
  title: string
  previewHref: string
  frameStyle: string
}

export interface NavMenuPreview {
  title: string
  previewHref: string
  frameStyle: string
}

export interface PageTocPreview {
  title: string
  previewHref: string
  frameStyle: string
}

export interface SignInPreview {
  title: string
  previewHref: string
  frameStyle: string
}

export interface TopBarPreview {
  title: string
  previewHref: string
  frameStyle: string
}

const sitePreviewTemplate = html`<iframe class="w-full rounded-md b-1 b-subtle" :title="title" :src="previewHref" :style="frameStyle"></iframe>`

function resolveSitePreview(site: SiteConfig, slug: string, height: number) {
  return {
    title: `${slug} isolated example`,
    previewHref: withBasePath(
      site.basePath,
      `/components/site/${slug}/preview/`,
    ),
    frameStyle: `height:${height}px`,
  }
}

export function defineConsentPreviewComponent(site: SiteConfig) {
  return defineComponent<ConsentPreview>(sitePreviewTemplate, {
    props: [],
    context: () => resolveSitePreview(site, 'consent', 560),
  })
}

export function defineNavMenuPreviewComponent(site: SiteConfig) {
  return defineComponent<NavMenuPreview>(sitePreviewTemplate, {
    props: [],
    context: () => resolveSitePreview(site, 'nav-menu', 400),
  })
}

export function definePageTocPreviewComponent(site: SiteConfig) {
  return defineComponent<PageTocPreview>(sitePreviewTemplate, {
    props: [],
    context: () => resolveSitePreview(site, 'page-toc', 420),
  })
}

export function defineSignInPreviewComponent(site: SiteConfig) {
  return defineComponent<SignInPreview>(sitePreviewTemplate, {
    props: [],
    context: () => resolveSitePreview(site, 'sign-in', 340),
  })
}

export function defineTopBarPreviewComponent(site: SiteConfig) {
  return defineComponent<TopBarPreview>(sitePreviewTemplate, {
    props: [],
    context: () => resolveSitePreview(site, 'top-bar', 260),
  })
}

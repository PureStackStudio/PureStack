import { defineComponent, html, type RefOrValue } from 'regor'

export interface PackageLink {
  number?: RefOrValue<string>
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  packageName?: RefOrValue<string>
  href?: RefOrValue<string>
}

const packageLinkTemplate = html`<a class="package-card" :href="href" target="_blank" rel="noopener">
  <span class="package-number">{{ number }}</span>
  <SectionHeader :title="title" :subtitle="summary" titleTag="h3">
    <code>{{ packageName }}</code>
  </SectionHeader>
  <Icon name="tabler:arrow-up-right" aria-hidden="true"/>
</a>`

export function definePackageLinkComponent() {
  return defineComponent<PackageLink>(packageLinkTemplate, {
    props: ['number', 'title', 'summary', 'packageName', 'href'],
  })
}

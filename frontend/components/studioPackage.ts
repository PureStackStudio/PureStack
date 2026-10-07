import { defineComponent, html, type RefOrValue } from 'regor'

export interface StudioPackage {
  number?: RefOrValue<string>
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
  packageName?: RefOrValue<string>
  href?: RefOrValue<string>
}

const studioPackageTemplate = html`<a class="package-card" :href="href" target="_blank" rel="noopener">
  <span class="package-number">{{ number }}</span>
  <SectionHeader :title="title" :subtitle="summary" titleTag="h3">
    <code>{{ packageName }}</code>
  </SectionHeader>
  <Icon name="tabler:arrow-up-right" aria-hidden="true"/>
</a>`

export function defineStudioPackageComponent() {
  return defineComponent<StudioPackage>(studioPackageTemplate, {
    props: ['number', 'title', 'summary', 'packageName', 'href'],
  })
}

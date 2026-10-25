import { defineComponent, html } from 'regor'
import { TocPlayground } from './playground'

export interface TocPlaygroundControls {
  playground: TocPlayground
}

const controlsTemplate = html`<Panel variant="surface" bodyClass="p-4" data-toc-ignore>
  <Flex direction="column" class="gap-4">
    <FormInputField
      :id="playground.prefix + '-title'"
      label="Heading text"
      :model="playground.title"/>
    <Flex wrap="true" class="gap-2">
      <Btn @click="playground.add" data-toc-action="add" tone="accent"
        >Add section</Btn>
      <Btn
        @click="playground.rename"
        :disabled="!playground.hasSections"
        data-toc-action="rename"
        variant="surface"
        >Rename last</Btn>
      <Btn
        @click="playground.reorder"
        :disabled="playground.sections.length < 2"
        data-toc-action="reorder"
        variant="surface"
        >Move last to first</Btn>
      <Btn
        @click="playground.toggleExcluded"
        :disabled="!playground.hasSections"
        data-toc-action="exclude"
        variant="surface"
        >{{ playground.lastExcluded ? 'Include last' : 'Exclude last' }}</Btn>
      <Btn
        @click="playground.remove"
        :disabled="!playground.hasSections"
        data-toc-action="remove"
        variant="surface"
        >Remove last</Btn>
      <Btn
        @click="playground.clear"
        :disabled="!playground.hasSections"
        data-toc-action="clear"
        variant="subtle"
        >Clear sections</Btn>
    </Flex>
    <Flex wrap="true" align="center" class="gap-3">
      <FormCheck
        :id="playground.prefix + '-automatic'"
        label="Refresh after every change"
        :checked="playground.automatic"
        data-toc-auto-refresh/>
      <Btn
        @click="playground.refresh"
        data-toc-action="refresh"
        variant="outlineFill"
        >Refresh TOC</Btn>
    </Flex>
    <p
      class="text-muted fs-sm m-0"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-toc-status
    >
      {{ playground.status }}
    </p>
  </Flex>
</Panel>`

export function defineTocPlaygroundControls() {
  return defineComponent<TocPlaygroundControls>(controlsTemplate, {
    context: (head) => ({ playground: head.requireContext(TocPlayground) }),
  })
}

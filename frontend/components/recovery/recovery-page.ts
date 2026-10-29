import { computed, defineComponent, html, type RefOrValue, unref } from 'regor'

export interface RecoveryPage {
  kind?: RefOrValue<'not-found' | 'error'>
}

const messages = {
  'not-found': {
    label: 'Page not found',
    headline: 'This page',
    ending: 'isn’t here.',
    description:
      'The link may be out of date, or the page may have moved. Let’s get you back to building.',
    hint: 'A different route. The same possibilities.',
  },
  error: {
    label: 'Something went wrong',
    headline: 'Something',
    ending: 'went wrong.',
    description:
      'We couldn’t load this page. Try again in a moment, or choose a new place to start.',
    hint: 'If the problem continues, you can report it below.',
  },
} as const

const destinations = [
  {
    href: '/guides/',
    icon: 'tabler:book',
    title: 'Read the guides',
    detail: 'From your first page to publishing.',
  },
  {
    href: '/components/',
    icon: 'tabler:components',
    title: 'Explore components',
    detail: 'Working examples. Pieces that fit.',
  },
]

const template = html`<Flex
  container="section"
  direction="column"
  class="container recovery-page py-6 gap-6"
  aria-labelledby="recovery-title"
>
  <Grid
    columns="repeat(auto-fit, minmax(min(100%, 24rem), 1fr))"
    alignItems="center"
    class="gap-6"
  >
    <div class="recovery-copy">
      <Flex container="p" align="center" class="text-eyebrow gap-2 mb-5">
        <span class="status-dot" aria-hidden="true"></span>
        <span class="tone--accent tone-text"
          ><span r-if="!isError">404 / </span>{{ message.label }}</span>
      </Flex>
      <h1 id="recovery-title" class="fw-600 lh-1 tracking-tight">
        {{ message.headline }}<br/><span class="tone--accent tone-text"
          >{{ message.ending }}</span>
      </h1>
      <p class="fs-h6 lh-7 text-subtle max-w-prose mt-5 mb-0">
        {{ message.description }}
      </p>
      <Flex class="gap-3 mt-6" wrap="true">
        <BtnLink
          href="/"
          tone="accent"
          variant="solid"
          icon="tabler:arrow-left"
          class="fs-body py-4 px-5 gap-3"
          >Back to home</BtnLink>
        <Btn
          r-if="isError"
          data-recovery-retry
          :hidden="true"
          tone="accent"
          variant="outlineFill"
          icon="tabler:refresh"
          class="fs-body py-4 px-5 gap-3"
          >Try again</Btn>
      </Flex>
      <p class="fs-sm lh-7 text-subtle mt-5 mb-0">{{ message.hint }}</p>
    </div>
    <MissingDestination r-if="!isError" class="hidden-lg"/>
    <InterruptedConnection r-if="isError" class="hidden-lg"/>
  </Grid>
  <Grid
    container="nav"
    columns="repeat(auto-fit, minmax(min(100%, 20rem), 1fr))"
    class="gap-4 pt-6 bt-1 b-subtle"
    aria-label="Continue exploring PureStack"
  >
    <Flex
      container="a"
      r-for="destination in destinations"
      align="center"
      class="p-4 gap-4 b-1 rounded-lg tone--neutral tone-fill-surface tone-border-surface tone-fill-surface-hover tone-border-surface-hover transition"
      :href="destination.href"
    >
      <IconFrame
        :name="destination.icon"
        tone="accent"
        variant="surface"
        class="p-3 flex-none"
        aria-hidden="true"/>
      <Flex container="span" direction="column" class="flex-1 gap-1">
        <strong class="fs-body fw-600">{{ destination.title }}</strong>
        <span class="fs-sm lh-6 text-subtle m-0"
          >{{ destination.detail }}</span>
      </Flex>
      <Icon
        name="tabler:arrow-up-right"
        class="text-subtle m-0"
        aria-hidden="true"/>
    </Flex>
  </Grid>
  <PageScript r-if="isError" src="/modules/recovery.ts"/>
</Flex>`

export function defineRecoveryPageComponent() {
  return defineComponent<RecoveryPage>(template, {
    props: ['kind'],
    context: (head) => ({
      ...head.props,
      message: computed(() => messages[unref(head.props.kind) ?? 'not-found']),
      isError: computed(() => unref(head.props.kind) === 'error'),
      destinations,
    }),
  })
}

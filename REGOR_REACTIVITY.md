# Regor Reactivity

This document describes the baseline reactivity model used in PureStack code.
It starts with the common path: how to use `ref`, `sref`, and
`flatten` correctly without losing type safety.

## Reactive Factories

`ref` and `sref` are factories. They create reactive containers.

A reactive container is called like a function:

```ts
const count = ref(0)

count() // read
count(1) // write
```

The same read/write shape applies to both `ref` and `sref`.

## `ref`

`ref` creates deep reactive content.

For primitive values, `ref` is straightforward:

```ts
const title = ref('Hello')

title()
title('Welcome')
```

For objects and arrays, `ref` changes the object shape. It wraps the value into
Regor reactive content.

```ts
interface User {
  name: string
  email: string
}

const plainUser: User = {
  name: 'Ali',
  email: 'admin@example.com',
}

const user = ref<User>(plainUser)

plainUser !== user()
```

The value returned by `user()` is no longer the original plain object. It is the
Regor reactive version of that object.

Nested fields follow Regor's smart reactive contract:

```ts
user().name()
user().name('Cem')
user().email()
```

So the important rule is:

```ts
ref(object) // wraps/mutates the object shape into reactive content
```

Use `ref` when nested fields should participate in Regor reactivity.

## `flatten`

`flatten` is the reverse operation for `ref` content.

It converts Regor reactive content back into plain JavaScript content:

```ts
const plain = flatten(user)
```

Use `flatten` when you need to send reactive content to APIs, compare plain
values, serialize state, or pass data to code that expects normal JavaScript
objects.

## `unref`

`unref` reads either a reactive value or a plain value.

Use it when an API accepts both:

```ts
import { unref, type RefOrValue } from 'regor'

function readTitle(title: RefOrValue<string>) {
  return unref(title)
}
```

If `title` is a `ref`, `unref(title)` returns `title()`.

If `title` is already a plain string, `unref(title)` returns the string.

This makes `unref` useful for component props:

```ts
interface ButtonProps {
  label?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
}

const label = unref(props.label) || 'Submit'
const disabled = unref(props.disabled) === true
```

Use `unref` for one-level read normalization. Use `flatten` when you need to
convert reactive object content back into plain JavaScript content.

## `sref`

`sref` creates a shallow/simple reactive container.

The container is reactive, but the stored object remains ordinary JavaScript
content.

```ts
interface User {
  name: string
  email: string
}

const plainUser: User = {
  name: 'Ali',
  email: 'admin@example.com',
}

const user = sref<User>(plainUser)

plainUser === user()
```

Fields are normal properties:

```ts
user().name
user().email
```

To update `sref` object content, replace the value:

```ts
user({
  ...user(),
  name: 'Ali',
})
```

So the matching rule is:

```ts
sref(object) // keeps the object as normal JavaScript content
```

Use `sref` when you want a reactive container but want the content itself to stay
plain.

## Choosing `ref` or `sref`

Use `ref` when you want deep reactive fields:

```ts
const user = ref<User>({
  name: 'Cem',
  email: 'admin@example.com',
})

user().name('Ali')
```

Use `sref` when you want normal object fields and replacement-style updates:

```ts
const user = sref<User>({
  name: 'Ali',
  email: 'admin@example.com',
})

user({
  ...user(),
  name: 'Cem',
})
```

The short version:

```ts
ref(object) // deep reactive content, object shape changes
sref(object) // reactive container, object shape stays plain
```

## Type Safety

Use known types with `ref` and `sref`.

Prefer:

```ts
const user = ref<User>(initialUser)
const draft = sref<MailDraft>(initialDraft)
```

Avoid:

```ts
const user = ref<any>(value)
const data = ref<unknown>(value)
```

Regor's smart contract is type-driven. If the type is `any` or `unknown`,
TypeScript cannot describe the generated reactive shape well enough to protect
the code.

Good type information is especially important with `ref`, because nested object
fields become reactive according to the declared type.

## Delayed Initialization

`ref` and `sref` support delayed initialization:

```ts
const user = ref<User>()
const draft = sref<MailDraft>()
```

This creates a reactive container without providing an initial runtime value.
The generated TypeScript type still behaves like `User` or `MailDraft`.

This shape is useful for component contexts where initialization is delayed
until a known lifecycle point, such as `mounted`, a fetch result, or another
setup step.

Use delayed initialization carefully. Runtime safety depends on assigning the
value before anything reads it.

Prefer an initial value when possible:

```ts
const user = ref<User>({
  name: '',
  email: '',
})
```

For nullable state, model nullability explicitly:

```ts
const user = ref<User | null>(null)
```

Do not use `undefined` to model nullable state:

```ts
const user = ref<User | undefined>()
```

`undefined` collapses out of the generated ref contract, so this breaks type
safety. Use `null` when missing state is part of the model.

## `computed`

`computed` creates derived reactive state.

Use it when a value can be calculated from other reactive values:

```ts
const firstName = ref('Ali')
const lastName = ref('Cem')

const fullName = computed(() => `${firstName()} ${lastName()}`)

fullName()
```

`computed` should describe a value. It should not be used to perform side
effects.

Good:

```ts
const messageCountText = computed(() => `${messages().length} message(s)`)
```

Avoid:

```ts
const value = computed(() => {
  localStorage.setItem('count', String(count()))
  return count()
})
```

If code needs to perform a side effect when reactive state changes, use
`observe` or `watchEffect`.

## `observe`

`observe` runs a side effect when a specific reactive source changes.

Use it when the dependency is explicit:

```ts
observe(selectedId, (id) => {
  scrollToItem(id)
})
```

`observe` is a good fit when one known source drives the effect.

```ts
observe(items, () => {
  refreshVirtualList()
})
```

Use `observe` for side effects and synchronization. Do not use it for values
that can be expressed as `computed`.

## `watchEffect`

`watchEffect` runs a reactive side effect.

Use it when the effect should re-run whenever any reactive value read inside the
effect changes:

```ts
watchEffect(() => {
  document.title = title()
})
```

`watchEffect` is for synchronization with the outside world: DOM APIs, browser
state, storage, imperative widgets, timers, or other side-effectful code.

It is also useful when an effect depends on multiple reactive values:

```ts
watchEffect(() => {
  updateChart({
    items: items(),
    selectedId: selectedId(),
    theme: theme(),
  })
})
```

Keep `watchEffect` focused. It should synchronize something; it should not hide
ordinary data derivation that belongs in `computed`.

## Effect Cleanup in Components

Inside component creation, `observe` and `watchEffect` are scoped to the
component.

That means component code should not manually stop or dispose them:

```ts
class ExampleComponent {
  constructor() {
    observe(this.items, () => {
      this.refresh()
    })

    watchEffect(() => {
      this.syncTitle(this.title())
    })
  }
}
```

Regor disposes these scoped effects when the component is disposed.

Manual cleanup is only for effects created outside a component scope or in a
custom lifetime that Regor does not own.

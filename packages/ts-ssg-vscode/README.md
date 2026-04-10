# PureStack Component Tools

PureStack Component Tools turns VS Code into a real authoring environment for PureStack and Regor.

It understands component tags in Markdown and MDX, understands Regor markup inside TypeScript `html` and `svg` tagged templates, and adds the editing behavior that makes those files feel first-class instead of “HTML inside a string”.

This extension is built for the PureStack workflow:

- author content in `.md` and `.mdx`
- build interactive UI with Regor components
- write dynamic templates in TypeScript
- move between markup and source without losing context

## What You Get

### Component-aware authoring

- `Go to Definition` on component tags in Markdown, MDX, and supported TypeScript templates
- prop IntelliSense for Regor component attributes
- literal value suggestions for resolvable prop unions and booleans
- hover information for components and props

### Regor-aware markup editing

- syntax highlighting for `html`, `raw`, and `svg` tagged templates in TypeScript
- Regor interpolation highlighting for `{{ ... }}` inside HTML tagged templates
- MDX language support with official grammar wiring plus Regor-specific improvements
- Regor-style MDX attributes such as `:model`, `@click`, and `#slot`

### Formatting and diagnostics

- format embedded markup inside TypeScript tagged templates
- format standalone markup blocks inside MDX
- red-squiggle diagnostics for invalid HTML structure in both places
- self-closing tags normalized to PureStack style such as `<Component/>`

### Editing ergonomics

- auto-close tags while typing in TypeScript templates and MDX markup
- auto-complete `/>` while typing self-closing tags
- linked editing for opening and closing tag names

## Supported Files

### TypeScript

The extension understands Regor markup editing inside these tagged templates:

- `html`
- `svg`

That means a TypeScript file like this gets real editor support inside the template body:

```ts
const view = html`
  <section>
    <Flex gap="md">
      <Btn size="sm">{{ title }}</Btn>
    </Flex>
  </section>
`
```

### Markdown and MDX

Component tags inside `.md` and `.mdx` participate in navigation, hover, and prop IntelliSense.

In `.mdx`, the extension also adds:

- official MDX syntax highlighting
- Regor-aware attribute highlighting
- markup formatting
- markup diagnostics
- tag auto-close and linked editing

## Core Workflows

## Navigate From Markup To Code

Place the cursor on a component tag such as `<Flex>` or `<Btn>` and use:

- `F12`
- `Ctrl+Click`
- `Go to Definition`

If the cursor is on an attribute, the extension will try to jump to the prop declaration instead of only the component type.

Resolution works for both:

- components defined inside the current workspace
- Regor component libraries installed in `node_modules` that declare `regorComponents` in their `package.json`

## Complete Props And Values

Inside a supported component tag, the extension suggests public props declared through `defineComponent`.

Example:

```html
<Btn size="" />
```

At `size=""`, the extension can suggest literal values when the prop type resolves to something like:

- `'sm' | 'md' | 'lg'`
- `true | false`

Prop value analysis unwraps generic wrappers recursively before type analysis, so wrapper types such as `Ref<T>`, `SRef<T>`, and `RefOrValue<T>` still flow into completion naturally.

## Format Markup Without Reformatting Everything

The extension formats only the markup-aware regions it owns.

In TypeScript:

- only the content of `html` and `svg` tagged templates is reformatted
- surrounding TypeScript stays untouched

In MDX:

- standalone markup blocks are formatted
- Markdown prose, frontmatter, and fenced code blocks are left alone

Available commands:

- `PureStack: Format HTML Templates`
- `PureStack: Format Document With HTML Templates`

`Format Document With HTML Templates` is especially useful when you want your normal document formatter to run first and then let PureStack clean up embedded markup.

## Catch Broken Markup Early

Invalid HTML structure inside supported markup regions is surfaced as diagnostics:

- in TypeScript template bodies
- in standalone MDX markup blocks

Expressions are masked during validation so the error points at the surrounding markup instead of being confused by embedded code.

## Type Markup Faster

While editing supported markup:

- typing `>` after an opening tag inserts the matching closing tag
- typing `/` at the end of an opening tag completes `/>`
- void HTML elements are not given unnecessary closing tags
- uppercase component tags auto-self-close

Examples:

```html
<section>
```

becomes:

```html
<section></section>
```

and:

```html
<Btn/
```

completes to:

```html
<Btn/>
```

## Keep Tag Names In Sync

Opening and closing tag names can be edited together through VS Code linked editing support.

Important:

- enable `editor.linkedEditing`

With that setting on, renaming `<Card>` updates `</Card>` at the same time in supported TypeScript templates and MDX markup.

## How PureStack Resolves Components

Component resolution is intentionally simple and predictable.

The extension:

- scans workspace `.ts` files
- keeps workspace files that contain `defineComponent`
- looks for exported `interface`, `type`, or `class` names matching the component tag
- if the workspace lookup does not resolve a match, scans dependency packages in `node_modules`
- keeps only dependency packages whose `package.json` declares `regorComponents`
- searches that dependency package's `.ts` files for exported `interface`, `type`, or `class` names matching the component tag
- normalizes naming so PascalCase, kebab-case, and case differences resolve the same way

This gives PureStack authoring a clean convention:

- markup stays ergonomic
- component source stays easy to locate
- shared component libraries can participate in navigation

## How Prop IntelliSense Works

Prop suggestions are driven by the component metadata extracted from `defineComponent`.

The extension reads:

- the component type argument passed to `defineComponent<T>()`
- the `props` declaration

Supported prop declaration shapes:

- `defineComponent(..., ['name', 'size'])`
- `defineComponent(..., { props: ['name', 'size'] })`

Only declared props are suggested. Context-only fields that are not exposed as props are ignored.

For value completion, the extension currently does best when the final unwrapped type resolves to:

- string literal unions
- boolean
- boolean literals
- plain string or number kinds

## Syntax Highlighting

### TypeScript templates

Inside TypeScript tagged templates, the extension provides:

- HTML or SVG highlighting
- CSS highlighting in style regions
- TypeScript highlighting inside `${...}`
- TypeScript highlighting inside Regor `{{ ... }}` interpolation

Behavior split:

- `html` and `svg` receive the full editing pipeline: formatting, diagnostics, auto-close, and linked editing
- `raw` remains syntax-highlighted, but is intentionally excluded from formatting and tag-editing behavior

### MDX

MDX support is built on the official MDX grammar and then extended for PureStack authoring.

That includes:

- MDX language registration
- MDX file icon
- language configuration
- Regor-aware attribute tokenization for `:`, `@`, and `#`

The extension does not try to turn MDX into a second TypeScript template system. It keeps MDX aligned with its role in PureStack as a static content authoring format, while still making Regor-style markup pleasant to work with.

## Formatting Rules

PureStack formatting is intentionally conservative.

- it formats only markup regions
- it preserves embedded expressions
- it respects editor indentation settings
- it normalizes self-closing tags to no-space form such as `<img/>`

The formatter uses Prettier’s HTML parser inside the extension bundle, with PureStack-specific normalization on top.

## Commands

- `PureStack: Format HTML Templates`
- `PureStack: Format Document With HTML Templates`

## Settings

The extension respects normal VS Code editing behavior where appropriate.

Useful settings:

- `editor.formatOnSave`
  Enables save-time formatting for supported TypeScript templates and MDX markup blocks.
- `editor.linkedEditing`
  Enables synced editing of opening and closing tag names.
- `editor.tabSize`
  Used by markup formatting.
- `editor.insertSpaces`
  Used by markup formatting.

## Local Development

### Run In The Extension Host

1. Open the PureStack repository in VS Code.
2. Run `yarn --cwd packages/ts-ssg-vscode build`.
3. Launch the extension development host from VS Code.
4. Open a `.ts`, `.md`, or `.mdx` file inside the repo.

### Good Files To Test

- a TypeScript file with `html`, `raw`, or `svg` tagged templates
- an MDX guide page under `packages/ts-ssg/sample-content/guide`
- a Markdown or MDX document with component tags such as `<Flex>` or `<Btn>`

### Package A VSIX

1. Run `yarn --cwd packages/ts-ssg-vscode build`.
2. Run `yarn --cwd packages/ts-ssg-vscode package`.
3. Install the generated `.vsix` with `Extensions: Install from VSIX...`.

## Design Principles

PureStack Component Tools is not trying to be a giant framework IDE.

It is trying to be something better for this ecosystem:

- small enough to stay understandable
- smart enough to feel native
- strict enough to protect authoring quality
- focused enough to match the way PureStack is actually built

When it works well, markup stops feeling like a second-class citizen. It feels connected to the component model, connected to the content pipeline, and connected to the rest of the codebase.

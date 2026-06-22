---
title: Routing
description: English routing feature page for prefixed i18n.
nav:
  order: 2
---

# Routing

With `urlStrategy: "prefix-all"`, every generated public route starts with the
locale:

| Source file | Public URL | Output file |
| --- | --- | --- |
| `en/index.mdx` | `/en/` | `en/index.html` |
| `en/docs/routing.md` | `/en/docs/routing/` | `en/docs/routing/index.html` |
| `de/docs/routing.md` | `/de/docs/routing/` | `de/docs/routing/index.html` |

The equivalent German page is [here](/de/docs/routing.md). The home page is
[here](/index.mdx), and this root-absolute content link still resolves inside
the current locale.

## Metadata to inspect

Build this sample and inspect the generated HTML. You should see:

- `<html lang="en">`
- a canonical URL ending in `/en/docs/routing/`
- alternate `hreflang` links for `en` and `de`

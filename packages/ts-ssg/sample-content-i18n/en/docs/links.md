---
title: Content links
description: English content-link rewrite examples for i18n.
nav:
  order: 3
---

# Content links

The markdown compiler rewrites links to `.md`, `.mdx`, and `.rmdx` files into public
routes. In an i18n site, the current source locale is part of that decision.

| Markdown href | Rendered href |
| --- | --- |
| `routing.md` | `/en/docs/routing/` |
| `/docs/routing.md` | `/en/docs/routing/` |
| `/de/docs/routing.md` | `/de/docs/routing/` |

Try each link:

- [Relative routing link](routing.md)
- [Root-absolute routing link](/docs/routing.md)
- [Explicit German routing link](/de/docs/routing.md)

Use the previous/next page links below to confirm the localized `_nav.json`
sequence.

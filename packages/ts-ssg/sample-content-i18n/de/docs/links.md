---
title: Content Links
description: Deutsche Content-Link Beispiele fuer i18n.
nav:
  order: 3
---

# Content Links

Der Markdown Compiler schreibt Links auf `.md` und `.mdx` Dateien zu
oeffentlichen Routen um. In einer i18n Site fliesst die aktuelle Quellsprache
in diese Entscheidung ein.

| Markdown href | Gerenderter href |
| --- | --- |
| `routing.md` | `/de/docs/routing/` |
| `/docs/routing.md` | `/de/docs/routing/` |
| `/en/docs/routing.md` | `/en/docs/routing/` |

Probiere die Links aus:

- [Relativer Routing Link](routing.md)
- [Root-absoluter Routing Link](/docs/routing.md)
- [Expliziter englischer Routing Link](/en/docs/routing.md)

Nutze die Vor/Zurueck Links unten, um die lokalisierte `_nav.json` Reihenfolge
zu pruefen.

---
title: Routing
description: Deutsche Routing Feature Seite fuer prefixed i18n.
nav:
  order: 2
---

# Routing

Mit `urlStrategy: "prefix-all"` beginnt jede oeffentliche Route mit der
Sprache:

| Quelldatei | Oeffentliche URL | Ausgabedatei |
| --- | --- | --- |
| `de/index.mdx` | `/de/` | `de/index.html` |
| `de/docs/routing.md` | `/de/docs/routing/` | `de/docs/routing/index.html` |
| `en/docs/routing.md` | `/en/docs/routing/` | `en/docs/routing/index.html` |

Die passende englische Seite ist [hier](/en/docs/routing.md). Die Startseite
ist [hier](/index.mdx), und dieser root-absolute Content Link bleibt trotzdem
in der aktuellen Sprache.

## Metadaten pruefen

Baue dieses Beispiel und pruefe das generierte HTML. Du solltest Folgendes
sehen:

- `<html lang="de">`
- eine Canonical URL mit `/de/docs/routing/`
- alternative `hreflang` Links fuer `en` und `de`

PureStack i18n Sample
=====================

This sample is a compact bilingual site for the ts-ssg i18n pipeline.

Run it from the repository root:

  yarn tsx packages/ts-ssg/src/cli.ts --content ./packages/ts-ssg/sample-content-i18n --clean
  yarn tsx packages/ts-ssg/src/cli.ts serve --content ./packages/ts-ssg/sample-content-i18n --port 4174

It demonstrates:

- global root content in index.mdx.
- en and de locale folders.
- prefix-all URLs such as /en/docs/ and /de/docs/.
- localized header.mdx and footer.mdx.
- localized navigation roots via navigation.roots: ["docs"].
- page translation groups from matching route shapes.
- <html lang="...">, canonical URLs, and hreflang alternates.
- current-locale markdown link rewriting for relative and root-absolute .md links.
- explicit locale links such as /de/docs/routing.md.
- sitemap and robots output for prefixed localized routes.

To inspect the generated result after a build, open:

- ../dist/i18n-site/index.html
- ../dist/i18n-site/en/index.html
- ../dist/i18n-site/de/index.html
- ../dist/i18n-site/sitemap.xml
- ../dist/i18n-site/robots.txt

To try the hidden URL strategy, change siteConfig.json:

  "urlStrategy": "hidden"

The output still writes locale folders, while public routes stay unprefixed for
hosts that choose the locale by cookie, query string, or Accept-Language.

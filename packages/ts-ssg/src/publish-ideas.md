For publish mode, I’d keep it boring and high-signal. The next useful things are probably:

1. Asset hashing / cache busting  
   Emit `site.<hash>.css`, JS bundles with hashes, and update HTML references. This matters more than squeezing tiny CSS variable names.

2. Publish manifest  
   Write a small manifest with build time, output dir, page count, asset count, commit/version if available, and config signature. Helpful for deployment/debugging.

3. Strict validation  
   In `--publish`, fail on things dev can tolerate:
   - missing `baseUrl` when sitemap is enabled
   - broken internal links
   - missing referenced static assets
   - duplicate routes
   - invalid frontmatter

4. No dev artifacts  
   Ensure publish output excludes diagnostics, temporary error pages, debug manifests if you ever decide those should be dev-only.

5. HTML/CSS/JS minification boundary  
   You already have HTML and CSS direction. JS bundles from esbuild are likely already optimized, but publish can be the place where “production bundle settings” become explicit.

6. Sitemap/robots as publish-first  
   Maybe dev builds skip sitemap/pagefind by default later, and publish always runs them unless disabled.

7. Output summary  
   CLI should print a compact publish summary: pages, assets, size, publishDir, duration. Very useful when deploying.

My taste: next best feature is **asset hashing**, then **strict validation**. Those make publish mode feel genuinely production-grade without adding UI or conceptual weight.
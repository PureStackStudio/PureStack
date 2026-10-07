# Private legal content

The public page wrappers import the complete legal text from these local files:

- `frontend/purestack.studio/legal/_private/imprint.mdx`
- `frontend/purestack.studio/legal/_private/privacy.mdx`

The `_private` directory is ignored by Git. Files in it are shared content,
so they are included through `import-content` rather than published as separate pages.

Starting the frontend dev server, building, or publishing creates any missing
private file with a minimal notice asking the owner to supply their own content.
No legal-text templates are provided; each site owner is responsible for their
Imprint and Privacy Policy.
Existing files are never overwritten. Edit these files directly; no environment
variables or substitution step is needed.

```sh
yarn frontend
# Or:
yarn frontend:build
yarn frontend:publish
```

Replace the setup notice with your own legal content before publishing.
Use HTML or MDX without frontmatter. The starter supplies the page heading,
spacing, and container; keep or customize that markup as needed.

These files stay out of Git, but their contents appear in the generated public
website. Supply them separately in your deployment environment.

`import-content` reads within the site's content folder. If you keep the originals
outside the repository, copy them into `_private` before building or publishing.

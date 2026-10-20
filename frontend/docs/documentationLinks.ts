/** Add native section permalinks without changing headings in live examples. */
export function addDocumentationLinks(document: Document) {
  if (!document.body.classList.contains('template-doc')) return
  if (document.body.classList.contains('preview')) return
  const article = document.querySelector('.doc-main > .doc-content')
  if (!article) return

  for (const heading of article.children) {
    if (!['H2', 'H3'].includes(heading.tagName) || !heading.id) continue
    if (heading.querySelector('a')) continue
    const link = document.createElement('a')
    link.className = 'doc-heading-link'
    link.setAttribute('href', `#${encodeURIComponent(heading.id)}`)
    link.setAttribute('aria-label', `Link to ${heading.textContent?.trim()}`)
    link.setAttribute('title', 'Link to this section')
    link.setAttribute('data-pagefind-ignore', '')
    link.textContent = '#'
    heading.appendChild(link)
  }
}

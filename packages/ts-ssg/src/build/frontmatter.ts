import matter from 'gray-matter'

export function parseFrontmatter(source: string) {
  return matter(source)
}

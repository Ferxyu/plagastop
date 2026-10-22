import type { BlogCategory, BlogPostSummary } from './types'

/** Quita etiquetas y entidades básicas: para extractos, descripciones y conteo de palabras. */
export function stripHtml(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

/** Entidades con nombre habituales en textos en español (WordPress suele enviar UTF-8, pero no siempre). */
const NAMED: Record<string, string> = {
  nbsp: ' ', hellip: '…', quot: '"', apos: "'", lt: '<', gt: '>',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', uuml: 'ü',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', Uuml: 'Ü',
  iexcl: '¡', iquest: '¿', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  ndash: '–', mdash: '—', middot: '·', deg: '°', ordm: 'º', ordf: 'ª', sup2: '²', copy: '©', reg: '®',
}

export function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+\d?);/g, (match, name: string) => NAMED[name] ?? match)
    .replace(/&amp;/g, '&')
}

/** Recorta en el último espacio antes del límite, para meta descriptions. */
export function truncate(text: string, max = 158) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:]+$/, '')}…`
}

/** Minutos de lectura a 200 palabras por minuto (mínimo 1). */
export function readingMinutes(html: string) {
  const words = stripHtml(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const dateFormat = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "14 de octubre de 2026". Se fija la zona UTC para que el prerender y el navegador coincidan. */
export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso))
}

/** Categorías presentes en los artículos, en orden de aparición. */
export function categoriesOf(posts: BlogPostSummary[]): BlogCategory[] {
  const seen = new Map<string, BlogCategory>()
  for (const p of posts) if (!seen.has(p.category.slug)) seen.set(p.category.slug, p.category)
  return [...seen.values()]
}

/** El destacado explícito más reciente o, si no hay, el último publicado. */
export function featuredOf(posts: BlogPostSummary[]) {
  return posts.find((p) => p.featured) ?? posts[0]
}

/** Relacionados: misma categoría primero, luego los más recientes; nunca el propio artículo. */
export function relatedPosts<T extends BlogPostSummary>(post: BlogPostSummary, all: T[], count = 3): T[] {
  const others = all.filter((p) => p.slug !== post.slug)
  const sameCategory = others.filter((p) => p.category.slug === post.category.slug)
  const rest = others.filter((p) => p.category.slug !== post.category.slug)
  return [...sameCategory, ...rest].slice(0, count)
}

/** Búsqueda sin distinguir mayúsculas ni tildes, en título, extracto y categoría. */
export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function matchesQuery(post: BlogPostSummary, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const haystack = normalize(`${post.title} ${post.excerpt} ${post.category.name}`)
  return terms.every((t) => haystack.includes(t))
}

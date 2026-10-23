import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { BlogCategory, BlogPostSummary } from '~/lib/cms'
import { blogConfig } from '~/lib/blog/config'
import { categoriesOf, matchesQuery } from '~/lib/blog/utils'
import { PostCard } from './PostCard'
import styles from './blog.module.css'

/** Lee los filtros de la URL (?categoria=…&q=…), para que una búsqueda se pueda compartir. */
function readUrl() {
  const params = new URLSearchParams(window.location.search)
  return { category: params.get('categoria') ?? '', query: params.get('q') ?? '' }
}

/**
 * Listado del blog con búsqueda, filtro por categoría y "Cargar más".
 * Todo el filtrado ocurre en el navegador sobre la lista completa que viene prerenderizada: la página
 * sigue siendo estática y los buscadores ven todos los artículos en el HTML.
 * Sin filtros se excluye el destacado (ya está arriba); con filtros entra en los resultados.
 */
export function BlogExplorer({
  posts,
  categories: known = [],
  featuredSlug,
}: {
  posts: BlogPostSummary[]
  /** Categorías de WordPress, en su orden; se muestran solo las que tienen artículos. */
  categories?: BlogCategory[]
  featuredSlug?: string
}) {
  const searchId = useId()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [visible, setVisible] = useState(blogConfig.pageSize)
  // Filtros vigentes, para que dos cambios seguidos no se pisen antes del siguiente render
  const current = useRef({ category: '', query: '' })

  // Tras hidratar, toma los filtros de la URL (el HTML prerenderizado siempre parte sin filtros)
  useEffect(() => {
    const sync = () => {
      const fromUrl = readUrl()
      current.current = fromUrl
      setCategory(fromUrl.category)
      setQuery(fromUrl.query)
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const categories = useMemo(() => categoriesOf(posts, known), [posts, known])
  const filtering = Boolean(query.trim() || category)
  const results = useMemo(
    () =>
      posts.filter(
        (p) =>
          (filtering || p.slug !== featuredSlug) &&
          (!category || p.category.slug === category) &&
          matchesQuery(p, query),
      ),
    [posts, featuredSlug, filtering, category, query],
  )
  const shown = results.slice(0, visible)

  function update(next: { category?: string; query?: string }) {
    const c = next.category ?? current.current.category
    const q = next.query ?? current.current.query
    current.current = { category: c, query: q }
    setCategory(c)
    setQuery(q)
    setVisible(blogConfig.pageSize)
    // Se actualiza la URL sin navegar: la página es estática y no hay nada que volver a cargar
    const params = new URLSearchParams()
    if (c) params.set('categoria', c)
    if (q.trim()) params.set('q', q.trim())
    const search = params.toString()
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${search ? `?${search}` : ''}`)
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.filters}>
        <div className={styles.search}>
          <label htmlFor={searchId} className="visually-hidden">
            Buscar artículos
          </label>
          <Search size={18} strokeWidth={2} aria-hidden />
          <input
            id={searchId}
            type="search"
            placeholder="Buscar por título o palabra clave"
            value={query}
            onChange={(e) => update({ query: e.target.value })}
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => update({ query: '' })} aria-label="Borrar búsqueda">
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          )}
        </div>
        <div className={styles.chips} role="group" aria-label="Filtrar por categoría">
          <button type="button" aria-pressed={!category} onClick={() => update({ category: '' })}>
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={category === c.slug}
              onClick={() => update({ category: category === c.slug ? '' : c.slug })}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {filtering
          ? `${results.length} ${results.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}`
          : 'Últimos artículos'}
      </p>

      {results.length === 0 ? (
        <div className={styles.noResults}>
          <h3>No encontramos artículos con esos filtros</h3>
          <p>Prueba con otra palabra clave o revisa todas las categorías.</p>
          <button type="button" className={styles.reset} onClick={() => update({ category: '', query: '' })}>
            Ver todos los artículos
          </button>
        </div>
      ) : (
        <ul className={styles.grid}>
          {shown.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}

      {results.length > shown.length && (
        <div className={styles.more}>
          <button type="button" className={styles.reset} onClick={() => setVisible((v) => v + blogConfig.pageSize)}>
            Cargar más artículos
          </button>
          <span>
            Mostrando {shown.length} de {results.length}
          </span>
        </div>
      )}
    </div>
  )
}

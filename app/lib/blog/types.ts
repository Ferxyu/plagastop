/**
 * Modelo del blog, independiente de la fuente (artículos del sitio o WordPress).
 * Los componentes solo conocen estos tipos: cambiar de fuente no obliga a tocar la interfaz.
 */

import type { PhotoId } from '~/content/photos'

export interface BlogCategory {
  slug: string
  name: string
}

export interface BlogImage {
  alt: string
  /** Foto del catálogo del sitio (artículos publicados desde el código). */
  photo?: PhotoId
  /** Imagen externa (WordPress): URL principal, variantes y medidas para evitar saltos de diseño. */
  src?: string
  srcSet?: string
  width?: number
  height?: number
}

export interface BlogPost {
  slug: string
  title: string
  /** Texto plano, sin etiquetas. */
  excerpt: string
  /** HTML del cuerpo, ya sanitizado. */
  html: string
  /** Fechas ISO 8601. */
  date: string
  modified?: string
  author?: { name: string }
  /** Categoría principal (la primera asignada). */
  category: BlogCategory
  image?: BlogImage
  seo: { title: string; description: string }
  /** Destacado en la portada del blog (en WordPress: "Fijar en la portada"). */
  featured?: boolean
  readingMinutes: number
  /** Origen: WordPress o artículo editorial del sitio (lib/blog/local-posts.ts). */
  source: 'wordpress' | 'site'
  /** Interlinking hacia páginas comerciales (slug de servicio o industria). */
  relatedService?: string
  relatedIndustry?: string
}

/** Lo necesario para tarjetas y listados, sin el cuerpo: aliviana el HTML y los datos de /blog. */
export type BlogPostSummary = Omit<BlogPost, 'html'>

export function toSummary(post: BlogPost): BlogPostSummary {
  const summary: Partial<BlogPost> = { ...post }
  delete summary.html
  return summary as BlogPostSummary
}

export interface BlogSource {
  /** Artículos publicados, del más reciente al más antiguo. */
  getPosts(options?: { limit?: number; category?: string }): Promise<BlogPost[]>
  getPost(slug: string): Promise<BlogPost | undefined>
  /** Categorías de la fuente, en su orden (pueden incluir algunas sin artículos). */
  getCategories(): Promise<BlogCategory[]>
}

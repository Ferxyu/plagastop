/**
 * Fuente del blog. Hoy: sin artículos (mock). Fase 2: implementación WordPress headless
 * (REST /wp-json/wp/v2 o WPGraphQL) detrás de esta misma interfaz, sin tocar rutas ni UI.
 */

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  html: string
  date: string
  author: { name: string }
  category: { slug: string; name: string }
  image?: { src: string; alt: string }
  seo: { title: string; description: string }
  /** Interlinking hacia páginas comerciales. */
  relatedService?: string
  relatedIndustry?: string
}

export interface BlogSource {
  getPosts(options?: { limit?: number; category?: string }): Promise<BlogPost[]>
  getPost(slug: string): Promise<BlogPost | undefined>
}

const emptySource: BlogSource = {
  async getPosts() {
    return []
  },
  async getPost() {
    return undefined
  },
}

// Fase 2: export const blog: BlogSource = createWordPressSource(import.meta.env.VITE_WP_API_URL)
export const blog: BlogSource = emptySource

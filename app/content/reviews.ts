/**
 * Reseñas de Google de Plagastop. Solo reseñas reales, copiadas tal cual desde el perfil de Google:
 * no se inventan ni se editan textos. El home muestra solo las de 4 o 5 estrellas.
 */

export interface Review {
  /** Nombre como aparece en Google (p. ej. "María G."). */
  author: string
  /** Estrellas, de 1 a 5. */
  rating: number
  /** Texto de la reseña, sin cambios. */
  text: string
  /** Fecha tal como la muestra Google (p. ej. "hace 3 meses"). */
  when?: string
}

/** Valoración del perfil de Google. Actualizar cuando cambie. */
export const googleRating = {
  value: 4.5,
  count: 15,
  url: 'https://www.google.com/maps/search/?api=1&query=Plagastop%20Camino%20Los%20Carros%201826%20Concepci%C3%B3n',
}

// Pegar aquí las reseñas reales del perfil de Google, una por objeto:
// { author: 'Nombre', rating: 5, text: 'Texto de la reseña', when: 'hace 2 meses' },
export const reviews: Review[] = []

/** Las que se muestran en el sitio: solo positivas (4 y 5 estrellas) y con texto. */
export const positiveReviews = reviews.filter((r) => r.rating >= 4 && r.text.trim())

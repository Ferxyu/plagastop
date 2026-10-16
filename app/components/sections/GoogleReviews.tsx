import type { CSSProperties } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import { googleRating, positiveReviews, type Review } from '~/content/reviews'
import styles from './GoogleReviews.module.css'

/** Cinco estrellas con relleno parcial (4,5 → cuatro y media). */
function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${String(value).replace('.', ',')} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={styles.star} style={{ '--fill': Math.max(0, Math.min(1, value - i)) } as CSSProperties}>
          <Star size={size} strokeWidth={0} fill="currentColor" aria-hidden />
          <Star size={size} strokeWidth={0} fill="currentColor" aria-hidden />
        </span>
      ))}
    </span>
  )
}

function Card({ review, hidden }: { review: Review; hidden?: boolean }) {
  return (
    <li className={styles.card} aria-hidden={hidden || undefined}>
      <Stars value={review.rating} size={16} />
      <blockquote className={styles.quote}>{review.text}</blockquote>
      <footer className={styles.author}>
        <span className={styles.avatar} aria-hidden>
          {review.author.trim().charAt(0).toUpperCase()}
        </span>
        <span>
          <b>{review.author}</b>
          {review.when && <small>{review.when}</small>}
        </span>
      </footer>
    </li>
  )
}

/**
 * Reseñas de Google: valoración del perfil y carrusel continuo con las reseñas positivas.
 * Si aún no hay reseñas cargadas, queda solo la valoración con el enlace al perfil.
 */
export function GoogleReviews() {
  const rating = String(googleRating.value).replace('.', ',')
  // El bucle necesita al menos seis tarjetas por vuelta para no dejar huecos en pantallas anchas.
  const reps = positiveReviews.length ? Math.ceil(6 / positiveReviews.length) : 0
  const lap = Array.from({ length: reps }, () => positiveReviews).flat()

  return (
    <div className={styles.wrap}>
      <div className={styles.summary} data-reveal={2}>
        <span className={styles.score}>{rating}</span>
        <span className={styles.summaryText}>
          <Stars value={googleRating.value} size={22} />
          <span>
            {googleRating.count} reseñas en <b>Google</b>
          </span>
        </span>
        <a className={styles.link} href={googleRating.url} target="_blank" rel="noopener noreferrer">
          Ver en Google <ArrowUpRight size={16} aria-hidden />
        </a>
      </div>

      {lap.length > 0 && (
        <div className={styles.carousel} data-reveal={3}>
          <ul className={styles.track} aria-label="Reseñas de clientes en Google">
            {[...lap, ...lap].map((r, i) => (
              <Card key={i} review={r} hidden={i >= positiveReviews.length} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

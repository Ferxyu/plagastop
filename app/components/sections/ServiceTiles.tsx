import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { industries } from '~/content/industries'
import type { Service } from '~/content/services'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import styles from './ServiceTiles.module.css'

/**
 * Servicios en una sola hilera de cartas grandes (foto a sangre, nombre y descripción) que avanza en carrusel
 * de derecha a izquierda. Las especialidades (featured) van primero: al llegar a la sección se ven las tres
 * quietas un momento y luego el carrusel arranca; se detiene al pasar el mouse. Debajo, accesos por industria.
 */
export function ServiceTiles({ services }: { services: Service[] }) {
  // primaryServices ya viene con las especialidades primero.
  const n = services.length

  return (
    <>
      {/* Dos copias para el bucle continuo; la segunda no se lee ni se enfoca */}
      <div className={styles.carousel} data-reveal>
        <ul className={styles.track} aria-label="Servicios">
          {[...services, ...services].map((s, i) => {
            const copy = i >= n
            return (
              <li key={i} aria-hidden={copy || undefined}>
                <Link
                  to={`/servicios/${s.slug}`}
                  className={`${styles.tile} ${styles.big}`}
                  prefetch="intent"
                  tabIndex={copy ? -1 : undefined}
                >
                  <Photo id={s.photo} sizes="(min-width: 900px) 30vw, 85vw" />
                  {s.featured && <span className={styles.badge}>Especialidad</span>}
                  <span className={styles.go} aria-hidden>
                    <ArrowRight size={18} strokeWidth={2.25} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.n}>{String((i % n) + 1).padStart(2, '0')}</span>
                    <span className={styles.name}>{s.name}</span>
                    <span className={styles.summary}>{s.summary}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.industries} data-reveal>
        <p className="eyebrow">Soluciones por industria</p>
        <ul>
          {industries.map((ind) => (
            <li key={ind.slug}>
              <Link to={`/industrias/${ind.slug}`} prefetch="intent">
                {ind.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink
          to="/cotizar?servicio=evaluacion"
          variant="secondary"
          arrow
          onClick={() => track('cta_click', { location: 'services' })}
        >
          Solicitar una evaluación
        </ButtonLink>
      </div>
    </>
  )
}

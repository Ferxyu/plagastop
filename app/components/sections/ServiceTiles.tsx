import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { industries } from '~/content/industries'
import type { Service } from '~/content/services'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import styles from './ServiceTiles.module.css'

/**
 * Servicios como fotografías a sangre con su nombre. Las especialidades (featured) van primero y en grande,
 * con su descripción; el resto, en una grilla más compacta. Debajo, accesos por industria.
 */
export function ServiceTiles({ services }: { services: Service[] }) {
  const featured = services.filter((s) => s.featured)
  const rest = services.filter((s) => !s.featured)

  return (
    <>
      <ul className={`${styles.tiles} ${styles.featured}`} aria-label="Especialidades">
        {featured.map((s, i) => (
          <li key={s.slug} data-reveal={i}>
            <Link to={`/servicios/${s.slug}`} className={`${styles.tile} ${styles.big}`} prefetch="intent">
              <Photo id={s.photo} sizes="(min-width: 900px) 30vw, 100vw" />
              <span className={styles.badge}>Especialidad</span>
              <span className={styles.go} aria-hidden>
                <ArrowRight size={18} strokeWidth={2.25} />
              </span>
              <span className={styles.text}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.summary}>{s.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className={`${styles.tiles} ${styles.others}`} aria-label="Otros servicios">
        {rest.map((s, i) => (
          <li key={s.slug} data-reveal={i % 3}>
            <Link to={`/servicios/${s.slug}`} className={styles.tile} prefetch="intent">
              <Photo id={s.photo} sizes="(min-width: 1100px) 16vw, (min-width: 700px) 32vw, 50vw" />
              <span className={styles.go} aria-hidden>
                <ArrowRight size={18} strokeWidth={2.25} />
              </span>
              <span className={styles.text}>
                <span className={styles.n}>{String(featured.length + i + 1).padStart(2, '0')}</span>
                <span className={styles.name}>{s.shortName}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

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

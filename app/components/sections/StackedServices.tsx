import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { Service } from '~/content/services'
import { Photo } from '~/components/ui/Photo'
import { ServiceIcon } from '~/components/ui/ServiceIcon'
import styles from './StackedServices.module.css'

/**
 * Sección fijada: el encabezado queda fijo a la izquierda mientras las tarjetas de servicio
 * se apilan una sobre otra al hacer scroll (cada una se fija un poco más abajo que la anterior).
 */
export function StackedServices({ services, aside }: { services: Service[]; aside: ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.aside}>{aside}</div>
      <ol className={styles.stack}>
        {services.map((s, i) => (
          <li key={s.slug} className={styles.card} style={{ '--i': i } as CSSProperties}>
            <div className={styles.media}>
              <Photo id={s.photo} sizes="(min-width: 1000px) 22vw, 100vw" />
            </div>
            <div className={styles.body}>
              <div className={styles.top}>
                <span className={styles.icon}>
                  <ServiceIcon name={s.icon} size={24} />
                </span>
                <span className={`${styles.num} tabular`}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className={styles.title}>
                <Link to={`/servicios/${s.slug}`} className={styles.link} prefetch="intent">
                  {s.shortName}
                </Link>
              </h3>
              <p className={styles.summary}>{s.summary}</p>
              <span className={styles.more} aria-hidden>
                Ver servicio <ArrowRight size={16} strokeWidth={2} />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

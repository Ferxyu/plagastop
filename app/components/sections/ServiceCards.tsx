import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { Service } from '~/content/services'
import { Photo } from '~/components/ui/Photo'
import { ServiceIcon } from '~/components/ui/ServiceIcon'
import styles from './ServiceCards.module.css'

/** Tarjetas de servicio con fotografía real, ícono y enlace. Toda la tarjeta es clicable. */
export function ServiceCards({ services, headingLevel = 3 }: { services: Service[]; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3'
  return (
    <ul className={styles.grid}>
      {services.map((s, i) => (
        <li key={s.slug} className={styles.card} data-reveal={i % 4}>
          <div className={styles.media}>
            <Photo id={s.photo} sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw" />
          </div>
          <div className={styles.body}>
            <span className={styles.icon}>
              <ServiceIcon name={s.icon} size={26} />
            </span>
            <Heading className={styles.title}>
              <Link to={`/servicios/${s.slug}`} className={styles.link} prefetch="intent">
                {s.shortName}
              </Link>
            </Heading>
            <p className={styles.summary}>{s.summary}</p>
            <span className={styles.more} aria-hidden>
              Ver servicio
              <ArrowRight size={16} strokeWidth={2} />
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

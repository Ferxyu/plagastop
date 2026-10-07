import type { ReactNode } from 'react'
import type { PhotoId } from '~/content/photos'
import { Breadcrumbs, type Crumb } from '~/components/layout/Breadcrumbs'
import { Photo } from '~/components/ui/Photo'
import styles from './PageHero.module.css'

/** Cabecera de páginas interiores: banda oscura con foto real de fondo. */
export function PageHero({
  crumbs,
  title,
  lead,
  actions,
  image,
}: {
  crumbs: Crumb[]
  title: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  image?: PhotoId
}) {
  return (
    <section className={`${styles.hero} on-dark`} data-has-image={image ? true : undefined}>
      {image && (
        <div className={styles.bg} aria-hidden>
          <Photo id={image} sizes="100vw" priority />
        </div>
      )}
      <div className={`container ${styles.copy}`}>
        <Breadcrumbs items={crumbs} />
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  )
}

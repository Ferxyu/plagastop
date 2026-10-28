import type { ReactNode } from 'react'
import type { PhotoId } from '~/content/photos'
import { Breadcrumbs, type Crumb } from '~/components/layout/Breadcrumbs'
import { Photo } from '~/components/ui/Photo'
import { MoleculeField } from '~/components/brand/MoleculeField'
import styles from './PageHero.module.css'

/** Cabecera de páginas interiores: banda azul con foto real de fondo y, opcionalmente, moléculas flotando. */
export function PageHero({
  crumbs,
  title,
  lead,
  actions,
  image,
  molecules,
}: {
  crumbs: Crumb[]
  title: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  image?: PhotoId
  molecules?: boolean
}) {
  return (
    <section className={`${styles.hero} on-dark`} data-has-image={image ? true : undefined}>
      {image && (
        <div className={styles.bg} aria-hidden>
          <Photo id={image} sizes="100vw" priority parallax={-0.2} />
        </div>
      )}
      {molecules && <MoleculeField className={styles.molecules} />}
      <div className={`container ${styles.copy}`}>
        <Breadcrumbs items={crumbs} />
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  )
}

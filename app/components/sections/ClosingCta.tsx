import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { COMMERCIAL_HOURS, SERVICE_HOURS } from '~/content/company'
import { coverageSummary } from '~/content/coverage'
import type { PhotoId } from '~/content/photos'
import { Photo } from '~/components/ui/Photo'
import { IsotypeAssembly } from '~/components/brand/IsotypeAssembly'
import { MoleculeField } from '~/components/brand/MoleculeField'
import styles from './ClosingCta.module.css'

/**
 * Banda de cierre con degradado animado: foto real del equipo en terreno, moléculas flotando y el isotipo
 * que se arma al llegar. Sin botones: el contacto queda a cargo del encabezado y del botón de WhatsApp.
 */
export function ClosingCta({
  title = (
    <>
      ¿Tu operación necesita <mark>control de plagas</mark>?
    </>
  ),
  text = 'Cuéntanos qué tipo de instalación tienes. Te visitamos, evaluamos en terreno y te proponemos un plan a la medida.',
  location = 'closing',
  image = 'galpon-tecnico',
}: {
  title?: ReactNode
  text?: string
  location?: string
  image?: PhotoId
}) {
  return (
    <section className={`section on-dark ${styles.band}`} aria-labelledby={`${location}-title`}>
      <MoleculeField />
      <div className={`container ${styles.grid}`}>
        <div className={styles.media} data-reveal data-reveal-style="clip">
          <Photo id={image} sizes="(min-width: 1000px) 40vw, 100vw" parallax={0.08} />
        </div>
        <div className={styles.copy} data-reveal={1}>
          <IsotypeAssembly className={styles.iso} />
          <h2 id={`${location}-title`}>{title}</h2>
          <p className={styles.text}>{text}</p>
          <ul className={styles.points}>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> Evaluación en terreno
            </li>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> {COMMERCIAL_HOURS}
            </li>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> {SERVICE_HOURS}
            </li>
            <li>
              <Check size={16} strokeWidth={2.5} aria-hidden /> {coverageSummary}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

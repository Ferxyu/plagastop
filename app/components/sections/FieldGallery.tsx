import type { ReactNode } from 'react'
import type { PhotoId } from '~/content/photos'
import { Photo } from '~/components/ui/Photo'
import styles from './FieldGallery.module.css'

export interface FieldShot {
  photo: PhotoId
  title: string
  place: string
}

/**
 * Galería "En terreno". En escritorio la sección queda fijada y las fotos avanzan en horizontal
 * con el scroll (motor en useReveal). En móvil, o sin JavaScript, es un carrusel con snap.
 */
export function FieldGallery({ heading, shots }: { heading: ReactNode; shots: FieldShot[] }) {
  return (
    <section className={`${styles.section} on-dark`} data-hscroll aria-labelledby="terreno-title">
      <div className={styles.sticky}>
        <div className={`container ${styles.head}`}>
          {heading}
          <div className={styles.progress} aria-hidden>
            <span />
          </div>
        </div>
        <ul className={styles.track} data-hscroll-track>
          {shots.map((shot, i) => (
            <li key={shot.photo} className={styles.card} data-tall={i % 3 === 1 || undefined}>
              <div className={styles.media}>
                <Photo id={shot.photo} sizes="(min-width: 1000px) 30vw, 80vw" />
              </div>
              <div className={styles.caption}>
                <span className={`${styles.index} tabular`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className={styles.title}>{shot.title}</p>
                  <p className={styles.place}>{shot.place}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

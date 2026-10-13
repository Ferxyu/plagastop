import type { ReactNode } from 'react'
import type { PhotoId } from '~/content/photos'
import { Photo } from '~/components/ui/Photo'
import styles from './ParallaxBand.module.css'

/**
 * Banda a pantalla completa con una foto de fondo que se desplaza mucho más lento que el scroll
 * (parallax marcado). El contenido pasa por encima.
 */
export function ParallaxBand({ image, children }: { image: PhotoId; children: ReactNode }) {
  return (
    <section className={`${styles.band} on-dark`}>
      <div className={styles.bg} aria-hidden>
        <Photo id={image} sizes="100vw" parallax={-0.45} />
      </div>
      <div className={`container ${styles.content}`}>{children}</div>
    </section>
  )
}

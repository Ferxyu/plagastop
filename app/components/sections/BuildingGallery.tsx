import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { PhotoId } from '~/content/photos'
import { Photo } from '~/components/ui/Photo'
import styles from './BuildingGallery.module.css'

/** Fotos del edificio de la sede, en el orden de un recorrido: frente, costados, posterior y patio. */
const shots: { id: PhotoId; caption: string }[] = [
  { id: 'edificio-frente', caption: 'Frente' },
  { id: 'edificio-frente-costado', caption: 'Frente desde el costado' },
  { id: 'edificio-frente-angular', caption: 'Fachada en ángulo' },
  { id: 'edificio-lateral-izquierdo', caption: 'Costado izquierdo y acceso' },
  { id: 'edificio-costado-derecho', caption: 'Costado derecho' },
  { id: 'edificio-lateral-derecho', caption: 'Vista lateral' },
  { id: 'edificio-detras-costado-derecho', caption: 'Volumen posterior' },
  { id: 'edificio-casino-bodegas', caption: 'Casino y bodegas' },
]

/**
 * Carrusel de fotos del edificio: se desliza con el dedo, la rueda o el teclado y encaja foto a foto.
 * Las flechas avanzan o retroceden una foto; al llegar al final vuelven al principio.
 */
export function BuildingGallery() {
  const trackRef = useRef<HTMLUListElement>(null)

  function move(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const items = Array.from(track.children) as HTMLElement[]
    const left = track.scrollLeft
    const atEnd = left + track.clientWidth >= track.scrollWidth - 4
    if (direction === 1 && atEnd) return track.scrollTo({ left: 0, behavior: 'smooth' })
    if (direction === -1 && left <= 4) return track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    // Siguiente o anterior foto según su borde izquierdo respecto del desplazamiento actual
    const target =
      direction === 1
        ? items.find((el) => el.offsetLeft > left + 4)
        : [...items].reverse().find((el) => el.offsetLeft < left - 4)
    if (target) track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
  }

  return (
    <div className={styles.gallery}>
      <ul ref={trackRef} className={styles.track} aria-label="Fotos del edificio de la sede" tabIndex={0}>
        {shots.map((s) => (
          <li key={s.id}>
            <figure>
              <div className={styles.frame}>
                <Photo id={s.id} sizes="(min-width: 1000px) 40vw, 85vw" />
              </div>
              <figcaption>{s.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button type="button" onClick={() => move(-1)} aria-label="Foto anterior">
          <ArrowLeft size={20} strokeWidth={2.25} aria-hidden />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Foto siguiente">
          <ArrowRight size={20} strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  )
}

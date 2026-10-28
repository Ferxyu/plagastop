import { halfVolume, SEDE_POSTER, SEDE_VIDEO } from './sede/video'
import styles from './SedeVideo.module.css'

/** Recorrido en video por la sede (vertical), con los controles normales del navegador. */
export function SedeVideo() {
  return (
    <div className={styles.frame} data-reveal>
      <video
        className={styles.video}
        ref={halfVolume}
        src={SEDE_VIDEO}
        poster={SEDE_POSTER}
        controls
        playsInline
        preload="metadata"
        aria-label="Recorrido en video por la sede de Plagastop en Concepción"
      />
    </div>
  )
}

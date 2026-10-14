import { coverage } from '~/content/coverage'
import styles from './CoverageLine.module.css'

/**
 * Cobertura de norte a sur como una línea con paradas: cada región es un nodo.
 * La línea se dibuja con el scroll y las paradas aparecen en orden.
 * `centered`: la línea va al centro y las regiones alternan de lado (desde 900 px).
 */
export function CoverageLine({ centered }: { centered?: boolean }) {
  return (
    <ol
      className={[styles.line, centered && styles.centered].filter(Boolean).join(' ')}
      aria-label="Zonas de cobertura, de norte a sur"
      data-draw
    >
      {coverage.map((zone, i) => (
        <li key={zone.region} data-reveal={i} className={styles.stop} data-base={zone.base || undefined}>
          <span className={styles.dot} aria-hidden />
          <div className={styles.zone}>
            <p className={styles.region}>{zone.region}</p>
            {zone.base && <span className={styles.base}>Base de operaciones</span>}
            <p className={styles.scope}>{zone.scope}</p>
            {zone.places.length > 0 && <p className={styles.places}>{zone.places.join(' · ')}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

import { coverage } from '~/content/coverage'
import styles from './CoverageLine.module.css'

/** Cobertura de norte a sur como una línea con paradas: cada región es un nodo. */
export function CoverageLine() {
  return (
    <ol className={styles.line} aria-label="Zonas de cobertura, de norte a sur">
      {coverage.map((zone) => (
        <li key={zone.region} className={styles.stop} data-base={zone.base || undefined}>
          <span className={styles.dot} aria-hidden />
          <div>
            <p className={styles.region}>
              {zone.region}
              {zone.base && <span className={styles.base}>Base de operaciones</span>}
            </p>
            <p className={styles.scope}>{zone.scope}</p>
            {zone.places.length > 0 && <p className={styles.places}>{zone.places.join(' · ')}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

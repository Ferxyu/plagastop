import { useId } from 'react'
import styles from './RotatingBadge.module.css'

/** Sello circular con texto que gira lentamente alrededor del símbolo de Plagastop. */
export function RotatingBadge({ text = 'Desde 1985 · Control de plagas · Concepción · ' }: { text?: string }) {
  const id = `badge-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <div className={styles.badge} aria-hidden>
      <svg viewBox="0 0 200 200" className={styles.ring}>
        <defs>
          <path id={id} d="M 100 100 m -76 0 a 76 76 0 1 1 152 0 a 76 76 0 1 1 -152 0" />
        </defs>
        <text className={styles.text}>
          <textPath href={`#${id}`} textLength="477">
            {text}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 64 64" className={styles.symbol}>
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <path d="M32 18v14M32 32l-10 12M32 32l10 12" />
        </g>
        <g fill="currentColor">
          <circle cx="32" cy="15" r="8" />
          <circle cx="20" cy="47" r="8" />
          <circle cx="44" cy="47" r="8" />
        </g>
      </svg>
    </div>
  )
}

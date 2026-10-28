import { processSteps } from '~/content/process'
import styles from './Steps.module.css'

/** Tres pasos numerados. */
export function Steps() {
  return (
    <ol className={styles.steps}>
      {processSteps.map((step, i) => (
        <li key={step.title} className={styles.step} data-reveal={i} data-tilt>
          <span className={`${styles.number} tabular`} aria-hidden>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

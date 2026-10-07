import { Phone } from 'lucide-react'
import { company, salesArea } from '~/content/company'
import { processSteps } from '~/content/process'
import { formatPhone, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import styles from './Steps.module.css'

/** Tres pasos numerados y una tarjeta oscura para llamar directamente. */
export function Steps() {
  return (
    <ol className={styles.steps}>
      {processSteps.map((step, i) => (
        <li key={step.title} className={styles.step} data-reveal={i}>
          <span className={`${styles.number} tabular`} aria-hidden>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
      <li className={`${styles.call} on-dark`} data-reveal={3}>
        <p className={styles.callTitle}>¿Prefieres conversarlo?</p>
        <p className={styles.callText}>Habla con un especialista del Área Comercial · {company.hours.label}</p>
        <a
          href={telHref(salesArea.phone)}
          className={styles.callPhone}
          onClick={() => track('tel_click', { location: 'steps' })}
        >
          <span className={styles.callIcon}>
            <Phone size={18} strokeWidth={2} aria-hidden />
          </span>
          <span className="tabular">{formatPhone(salesArea.phone)}</span>
        </a>
      </li>
    </ol>
  )
}

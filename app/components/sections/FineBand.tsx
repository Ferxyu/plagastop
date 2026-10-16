import { Banknote, Lock, Repeat } from 'lucide-react'
import { track } from '~/lib/analytics'
import { Counter } from '~/components/motion/Counter'
import { ButtonLink } from '~/components/ui/Button'
import styles from './FineBand.module.css'

const facts = [
  { icon: Banknote, title: 'Desde 0,1 UTM', text: 'según la infracción que determine la autoridad' },
  { icon: Repeat, title: 'El doble', text: 'si hay reincidencia' },
  { icon: Lock, title: 'Clausura', text: 'o paralización de faenas' },
]

/**
 * Riesgo sanitario: multas del artículo 174 del Código Sanitario (0,1 a 1.000 UTM; el doble con reincidencia;
 * clausura o paralización). El compromiso se limita a lo que depende de Plagastop: el control de plagas en regla.
 */
export function FineBand() {
  return (
    <section className={styles.band} aria-labelledby="multas-title">
      <div className={`container ${styles.head}`}>
        <p className="eyebrow" data-reveal>
          Código Sanitario · artículo 174
        </p>
        <h2 id="multas-title" className={styles.title} data-reveal={1}>
          Que una fiscalización no te tome por sorpresa.
        </h2>
        <p className={styles.figure} data-reveal="2" data-reveal-style="scale">
          <span className={styles.until}>Hasta</span>
          <span className={styles.amount}>
            <Counter value={1000} />
          </span>
          <span className={styles.unit}>UTM</span>
        </p>
        <p className={styles.text} data-reveal={3}>
          Es la multa que contempla la ley por infringir el Código Sanitario y sus reglamentos. Sumada a la detención
          de tu operación, una plaga puede salir mucho más cara que prevenirla.
        </p>
      </div>

      <ul className={styles.facts}>
        {facts.map((f, i) => (
          <li key={f.title} data-reveal={i}>
            <span className={styles.icon} aria-hidden>
              <f.icon size={26} strokeWidth={1.75} />
            </span>
            <b>{f.title}</b>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className={`container ${styles.close}`} data-reveal>
        <p className={styles.promise}>
          Nosotros nos aseguramos de que tu control de plagas esté en regla: programa, registros y certificados al
          día.
        </p>
        <ButtonLink
          to="/contacto"
          variant="secondary"
          size="lg"
          arrow
          onClick={() => track('cta_click', { location: 'multas' })}
        >
          Contáctanos
        </ButtonLink>
      </div>
    </section>
  )
}

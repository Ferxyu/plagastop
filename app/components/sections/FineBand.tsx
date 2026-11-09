import { useRef } from 'react'
import { Banknote, Lock, Repeat } from 'lucide-react'
import { MoleculeField } from '~/components/brand/MoleculeField'
import { BreakingFx } from './BreakingPoint'
import { useBreakingPoint } from './useBreakingPoint'
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
  const figureRef = useRef<HTMLParagraphElement>(null)
  const { phase, value } = useBreakingPoint(figureRef, 1000)

  return (
    <section className={`${styles.band} on-dark`} aria-labelledby="multas-title">
      <MoleculeField layout="edges" />
      <div className={`container ${styles.head}`} data-scroll-flow>
        <p className="eyebrow" data-reveal>
          Código Sanitario · artículo 174
        </p>
        <h2 id="multas-title" className={styles.title} data-reveal={1}>
          Que una fiscalización no te tome por sorpresa.
        </h2>
        <p ref={figureRef} className={styles.figure} data-reveal="2" data-reveal-style="scale">
          <BreakingFx phase={phase} />
          <span className={styles.until}>Hasta</span>
          <span className={styles.amount}>
            <span className="tabular">{value.toLocaleString('es-CL')}</span>
          </span>
          <span className={styles.unit}>UTM</span>
        </p>
        <p className={styles.text} data-reveal={3}>
          Es la multa que contempla la ley por infringir el Código Sanitario y sus reglamentos. Sumada a la detención
          de tu operación, una plaga puede salir mucho más cara que prevenirla.
        </p>
      </div>

      <ul className={styles.facts} data-scroll-flow>
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
          Nosotros nos aseguramos de mantener la asepsia general en tus dependencias e instalaciones y que estén al
          día tus registros y certificados ante auditorías y fiscalizaciones.
        </p>
      </div>
    </section>
  )
}

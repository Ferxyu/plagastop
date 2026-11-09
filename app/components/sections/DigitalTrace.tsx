import { useRef } from 'react'
import { Check } from 'lucide-react'
import { DIGITAL_HREF, digitalHome } from '~/content/digital'
import { useInView } from '~/components/motion/useInView'
import { SplitWords } from '~/components/motion/SplitWords'
import { ButtonLink } from '~/components/ui/Button'
import { MoleculeField } from '~/components/brand/MoleculeField'
import styles from './DigitalTrace.module.css'

/**
 * Gestión digital (home), entre el portal de la molécula y los servicios: el portal se abre sobre esta
 * sección, que parte del mismo azul profundo en que termina. A la izquierda el texto y, junto al botón, una
 * forma abstracta de capas de páginas (decorativa, no imita el sistema); a la derecha la traza: una línea que se
 * dibuja con el scroll (data-draw) y une cuatro nodos con forma de átomo del isotipo. Un pulso recorre la
 * línea solo mientras la sección está en pantalla. Sin acceso al portal de clientes (ver content/digital.ts).
 */
export function DigitalTrace() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.15 })

  return (
    <section
      ref={ref}
      className={`${styles.band} on-dark`}
      aria-labelledby="digital-title"
      data-active={inView || undefined}
    >
      <MoleculeField layout="edges" />
      <div className={`container ${styles.grid}`} data-scroll-flow>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`} data-reveal>
            {digitalHome.eyebrow}
          </p>
          <h2 id="digital-title" className={styles.title} data-reveal={1}>
            {/* Dos líneas en escritorio: «Tecnología que» / «respalda cada servicio.» */}
            <span className={styles.titleLine}>
              <SplitWords text="Tecnología que" />
            </span>{' '}
            <span className={styles.titleLine}>
              <SplitWords text="respalda" start={2} />{' '}
              <span className={styles.lime}>
                <SplitWords text="cada servicio." start={3} />
              </span>
            </span>
          </h2>
          {digitalHome.paragraphs.map((p, i) => (
            <p key={p} className={styles.text} data-reveal={i + 2}>
              {p}
            </p>
          ))}
          {/* Capas de páginas (forma abstracta, decorativa) y a su derecha el botón */}
          <div className={styles.action}>
            <div className={styles.docs} data-reveal={4} data-reveal-style="scale" aria-hidden>
              <span className={styles.sheet} />
              <span className={styles.sheet} />
              <span className={`${styles.sheet} ${styles.sheetTop}`}>
                <i />
                <i />
                <i />
                <i />
                <span className={styles.check}>
                  <Check size={16} strokeWidth={3} />
                </span>
              </span>
            </div>
            <div data-reveal={5}>
              <ButtonLink to={DIGITAL_HREF} variant="inverse" arrow>
                {digitalHome.cta}
              </ButtonLink>
            </div>
          </div>
        </div>

        <ol className={styles.trace} data-draw>
          {digitalHome.benefits.map((b, i) => (
            <li key={b.title} className={styles.step} data-reveal={i + 1}>
              <span className={styles.node} aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.card}>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

import { Plus } from 'lucide-react'
import styles from './Faq.module.css'

/** Acordeón nativo (details/summary): accesible y funcional sin JavaScript. El schema va en meta. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item, i) => (
        <details key={item.q} className={styles.item} open={i === 0} data-reveal={i}>
          <summary className={styles.question}>
            <span className={`${styles.index} tabular`} aria-hidden>
              {i + 1}.
            </span>
            <span className={styles.qText}>{item.q}</span>
            <span className={styles.icon} aria-hidden>
              <Plus size={18} strokeWidth={2} />
            </span>
          </summary>
          <p className={styles.answer}>{item.a}</p>
        </details>
      ))}
    </div>
  )
}

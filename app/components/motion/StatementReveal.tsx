import { useEffect, useRef, type CSSProperties } from 'react'
import styles from './StatementReveal.module.css'

/**
 * Declaración de gran formato: sus palabras se encienden una a una a medida que se hace scroll.
 * Las palabras entre [corchetes] se destacan en lima. Sin JavaScript o con movimiento reducido,
 * el texto se ve completo.
 */
export function StatementReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.dataset.active = 'true'
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)))
      el.querySelectorAll<HTMLElement>('[data-w]').forEach((w, i) => {
        w.dataset.on = i < progress * words.length ? 'true' : 'false'
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [words.length])

  return (
    <p ref={ref} className={styles.statement}>
      {words.map((word, i) => {
        const strong = word.startsWith('[') || word.endsWith(']') || word.includes(']')
        const clean = word.replace(/[[\]]/g, '')
        return (
          <span key={i}>
            <span data-w className={strong ? styles.strong : undefined} style={{ '--i': i } as CSSProperties}>
              {clean}
            </span>{' '}
          </span>
        )
      })}
    </p>
  )
}

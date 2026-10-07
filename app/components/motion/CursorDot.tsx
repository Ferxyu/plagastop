import { useEffect, useRef } from 'react'
import styles from './CursorDot.module.css'

/**
 * Punto lima que sigue al puntero con un leve retraso. Solo con mouse (pointer: fine) y
 * sin movimiento reducido. Crece sobre elementos interactivos; no reemplaza el cursor nativo.
 */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = ref.current
    if (!dot) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let frame = 0

    const tick = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      dot.dataset.visible = 'true'
      const target = e.target as Element | null
      dot.dataset.active = target?.closest('a, button, summary, select, input, textarea, label') ? 'true' : 'false'
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      dot.dataset.visible = 'false'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className={styles.dot} aria-hidden data-visible="false" />
}

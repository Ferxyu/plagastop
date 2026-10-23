import { useEffect, useState, type RefObject } from 'react'

/**
 * «El punto de quiebre» de la banda de multas (1.000 UTM):
 *   count   el contador sube (rápido al inicio, lento cerca de 1.000) con una gráfica que asciende detrás
 *   impact  al llegar a 1.000: golpe, vibración breve, grietas desde el número, fragmentos y onda expansiva
 *   crash   la gráfica se desploma con peso y estela (impacto económico de una sanción, no el monto)
 *   settled las grietas y fragmentos se van, la gráfica queda tenue y la cifra estable
 *
 * Se ejecuta al entrar en pantalla y no se repite con movimientos leves: se rearma recién cuando la cifra
 * sale por completo de la vista. Sin JavaScript o con movimiento reducido, la cifra se ve fija en 1.000.
 * Las fases se publican en data-break de la sección (vibración y aparición escalonada de los indicadores).
 */

export type BreakPhase = 'static' | 'armed' | 'count' | 'impact' | 'crash' | 'settled'

const COUNT_MS = 1700
const IMPACT_MS = 900
const CRASH_MS = 1400

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function useBreakingPoint(ref: RefObject<HTMLElement | null>, target: number) {
  const [phase, setPhase] = useState<BreakPhase>('static')
  const [value, setValue] = useState(target)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = el.closest('section')
    let current: BreakPhase = 'static'
    let frame = 0
    const timers: number[] = []
    const go = (p: BreakPhase) => {
      current = p
      setPhase(p)
      if (section) section.dataset.break = p
    }

    const play = () => {
      go('count')
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_MS)
        setValue(Math.round(target * easeOut(t)))
        if (t < 1) frame = requestAnimationFrame(step)
        else {
          go('impact')
          timers.push(window.setTimeout(() => go('crash'), IMPACT_MS))
          timers.push(window.setTimeout(() => go('settled'), IMPACT_MS + CRASH_MS))
        }
      }
      frame = requestAnimationFrame(step)
    }

    // Si la cifra ya está a la vista al cargar, se muestra estable (no se interrumpe una lectura en curso).
    // Se decide fuera del cuerpo del efecto para no encadenar renders.
    const r = el.getBoundingClientRect()
    const visible = r.top < window.innerHeight && r.bottom > 0
    queueMicrotask(() => {
      if (visible) go('settled')
      else {
        setValue(0)
        go('armed')
      }
    })

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6 && current === 'armed') play()
        // Se rearma solo cuando la cifra salió por completo de la pantalla
        if (!entry.isIntersecting && current === 'settled') {
          setValue(0)
          go('armed')
        }
      },
      { threshold: [0, 0.6] },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      timers.forEach(clearTimeout)
      if (section) delete section.dataset.break
    }
  }, [ref, target])

  return { phase, value }
}

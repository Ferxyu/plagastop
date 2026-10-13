import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { Service } from '~/content/services'
import { Photo } from '~/components/ui/Photo'
import { ServiceIcon } from '~/components/ui/ServiceIcon'
import styles from './StackedServices.module.css'

/** Velocidad del avance automático, en px por segundo. */
const AUTO_SPEED = 40

/**
 * Servicios en una hilera que se desliza sola en bucle infinito. Al pasar el mouse el avance se detiene
 * y la hilera se puede arrastrar en ambos sentidos (también con el dedo), con inercia al soltar.
 * La segunda copia de la lista solo existe para el bucle y se oculta a lectores de pantalla y teclado.
 */
export function StackedServices({ services, aside }: { services: Service[]; aside: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const loop = [...services, ...services]

  useEffect(() => {
    const vp = viewport.current
    const el = track.current
    if (!vp || !el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let x = 0
    let velocity = 0
    let hovering = false
    let dragging = false
    let moved = 0
    let lastX = 0
    let lastT = 0
    let last = performance.now()
    let frame = 0

    // Mantiene x dentro de [-mitad, 0] para que el bucle sea continuo
    const wrap = () => {
      const half = el.scrollWidth / 2
      if (half <= 0) return
      while (x <= -half) x += half
      while (x > 0) x -= half
    }

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      if (!dragging) {
        if (Math.abs(velocity) > 5) {
          // Inercia tras soltar
          x += velocity * dt
          velocity *= Math.pow(0.04, dt)
        } else if (!hovering && !reduced) {
          velocity = 0
          x -= AUTO_SPEED * dt
        }
      }
      wrap()
      el.style.translate = `${x.toFixed(1)}px 0`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovering = true
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovering = false
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      moved = 0
      velocity = 0
      lastX = e.clientX
      lastT = performance.now()
      vp.dataset.dragging = 'true'
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const now = performance.now()
      moved += Math.abs(dx)
      // Recién al superar unos píxeles se considera arrastre (y no clic)
      if (moved > 6 && !vp.hasPointerCapture(e.pointerId)) vp.setPointerCapture(e.pointerId)
      x += dx
      velocity = (dx / Math.max(1, now - lastT)) * 1000
      lastX = e.clientX
      lastT = now
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      delete vp.dataset.dragging
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId)
      if (performance.now() - lastT > 80) velocity = 0
      if (e.pointerType !== 'mouse') hovering = false
    }
    // Si fue un arrastre, el clic final no debe abrir la tarjeta
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    vp.addEventListener('pointerenter', onEnter)
    vp.addEventListener('pointerleave', onLeave)
    vp.addEventListener('pointerdown', onDown)
    vp.addEventListener('pointermove', onMove)
    vp.addEventListener('pointerup', onUp)
    vp.addEventListener('pointercancel', onUp)
    vp.addEventListener('click', onClick, true)
    return () => {
      cancelAnimationFrame(frame)
      vp.removeEventListener('pointerenter', onEnter)
      vp.removeEventListener('pointerleave', onLeave)
      vp.removeEventListener('pointerdown', onDown)
      vp.removeEventListener('pointermove', onMove)
      vp.removeEventListener('pointerup', onUp)
      vp.removeEventListener('pointercancel', onUp)
      vp.removeEventListener('click', onClick, true)
    }
  }, [])

  return (
    <div className={styles.layout}>
      <div className={styles.aside}>{aside}</div>
      <div ref={viewport} className={styles.viewport}>
        <ol ref={track} className={styles.stack} aria-label="Servicios">
          {loop.map((s, i) => {
            const copy = i >= services.length
            const n = (i % services.length) + 1
            return (
              <li key={i} className={styles.card} aria-hidden={copy || undefined}>
                <div className={styles.media}>
                  <Photo id={s.photo} sizes="(min-width: 1000px) 22vw, 80vw" />
                </div>
                <div className={styles.body}>
                  <div className={styles.top}>
                    <span className={styles.icon}>
                      <ServiceIcon name={s.icon} size={24} />
                    </span>
                    <span className={`${styles.num} tabular`}>{String(n).padStart(2, '0')}</span>
                  </div>
                  <h3 className={styles.title}>
                    <Link
                      to={`/servicios/${s.slug}`}
                      className={styles.link}
                      prefetch="intent"
                      tabIndex={copy ? -1 : undefined}
                      draggable={false}
                    >
                      {s.shortName}
                    </Link>
                  </h3>
                  <p className={styles.summary}>{s.summary}</p>
                  <span className={styles.more} aria-hidden>
                    Ver servicio <ArrowRight size={16} strokeWidth={2} />
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

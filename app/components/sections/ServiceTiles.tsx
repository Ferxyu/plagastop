import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { industries } from '~/content/industries'
import type { Service } from '~/content/services'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import { Photo } from '~/components/ui/Photo'
import styles from './ServiceTiles.module.css'

/** Velocidad del avance automático, en px por segundo: lento, para que se alcance a leer. */
const SPEED = 30
/** Pausa inicial con las cuatro primeras quietas antes de empezar a moverse. */
const START_DELAY = 1500

/**
 * Carrusel de servicios en una sola hilera: se ven cuatro (dos en tablet, una y media en móvil).
 * Al entrar en pantalla espera un momento y empieza a avanzar solo, de derecha a izquierda y en bucle.
 * Pasar el mouse no lo detiene. Las flechas adelantan o devuelven una tarjeta sin cortar el movimiento.
 * La lista se dibuja tres veces para que el bucle no tenga corte en ningún sentido; solo la del medio se anuncia.
 */
export function ServiceTiles({ services }: { services: Service[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const nudgeRef = useRef(0)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let offset = 0
    let setWidth = 0
    let frame = 0
    let last = 0
    let movingSince = Infinity

    const measure = () => {
      const items = track.children
      const n = services.length
      if (items.length < n * 2) return
      setWidth = (items[n] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft
    }

    const render = () => {
      if (!setWidth) return
      offset = ((offset % setWidth) + setWidth) % setWidth
      track.style.translate = `${-(setWidth + offset)}px 0`
    }

    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      if (!reduced && now >= movingSince) offset += SPEED * dt
      // Flechas: recorre lo pendiente con una curva suave
      const nudge = nudgeRef.current
      if (nudge !== 0) {
        const part = Math.abs(nudge) < 0.5 ? nudge : nudge * (1 - Math.exp(-dt * 9))
        offset += part
        nudgeRef.current = nudge - part
      }
      render()
      frame = requestAnimationFrame(step)
    }

    // Empieza a moverse recién cuando la sección se ve, tras mostrar quietas las primeras cuatro
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && movingSince === Infinity) movingSince = performance.now() + START_DELAY
      },
      { threshold: 0.4 },
    )
    io.observe(viewport)

    const ro = new ResizeObserver(() => {
      measure()
      render()
    })
    ro.observe(viewport)
    measure()
    render()
    frame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
    }
  }, [services.length])

  /** Adelanta (1) o devuelve (-1) exactamente una tarjeta. */
  function move(direction: 1 | -1) {
    const first = trackRef.current?.children[0] as HTMLElement | undefined
    const second = trackRef.current?.children[1] as HTMLElement | undefined
    if (!first || !second) return
    nudgeRef.current += direction * (second.offsetLeft - first.offsetLeft)
  }

  const copies = [0, 1, 2]

  return (
    <>
      <div className={styles.carousel}>
        <div ref={viewportRef} className={styles.viewport}>
          <ul ref={trackRef} className={styles.track} aria-label="Servicios">
            {copies.flatMap((copy) =>
              services.map((s, i) => {
                const hidden = copy !== 1
                return (
                  <li key={`${copy}-${s.slug}`} aria-hidden={hidden || undefined}>
                    <Link
                      to={`/servicios/${s.slug}`}
                      className={styles.tile}
                      data-glow
                      prefetch="intent"
                      tabIndex={hidden ? -1 : undefined}
                    >
                      <Photo id={s.photo} sizes="(min-width: 1100px) 23vw, (min-width: 640px) 45vw, 80vw" />
                      {s.featured && <span className={styles.badge}>Especialidad</span>}
                      <span className={styles.go} aria-hidden>
                        <ArrowRight size={18} strokeWidth={2.25} />
                      </span>
                      <span className={styles.text}>
                        <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={styles.name}>{s.name}</span>
                        <span className={styles.summary}>{s.summary}</span>
                      </span>
                    </Link>
                  </li>
                )
              }),
            )}
          </ul>
          <span className={styles.pulse} aria-hidden />
        </div>
        <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => move(-1)} aria-label="Servicio anterior">
          <ArrowLeft size={22} strokeWidth={2.25} aria-hidden />
        </button>
        <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => move(1)} aria-label="Servicio siguiente">
          <ArrowRight size={22} strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      <div className={styles.industries} data-reveal>
        <p className="eyebrow">Soluciones por industria</p>
        <ul>
          {industries.map((ind) => (
            <li key={ind.slug}>
              <Link to={`/industrias/${ind.slug}`} prefetch="intent">
                {ind.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink
          to="/cotizar?servicio=evaluacion"
          variant="secondary"
          arrow
          onClick={() => track('cta_click', { location: 'services' })}
        >
          Solicitar una evaluación
        </ButtonLink>
      </div>
    </>
  )
}

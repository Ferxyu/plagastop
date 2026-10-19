import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'
import { photo, type PhotoId } from '~/content/photos'
import { Photo } from '~/components/ui/Photo'
import { faces, type V } from './sede/geometry'
import { createRenderer, project, rotate } from './sede/renderer'
import styles from './SedeModel.module.css'

const BASE = `${import.meta.env.BASE_URL}media/sede/`

/** Puntos sobre la maqueta: cada uno abre las fotos reales de ese sector del edificio. */
const markers: { name: string; point: V; normal: V; photos: PhotoId[] }[] = [
  {
    name: 'Frente y entrada',
    point: [-0.7, 2.8, 7.1],
    normal: [0, 0, 1],
    photos: ['edificio-frente', 'edificio-frente-costado', 'edificio-frente-angular'],
  },
  { name: 'Costado izquierdo', point: [-3.4, 2.7, 1], normal: [-1, 0, 0], photos: ['edificio-lateral-izquierdo'] },
  {
    name: 'Costado derecho',
    point: [3.45, 2.7, 0],
    normal: [1, 0, 0],
    photos: ['edificio-costado-derecho', 'edificio-lateral-derecho', 'edificio-detras-costado-derecho'],
  },
  { name: 'Baños y casino', point: [-5.85, 4.45, -7.7], normal: [-1, 0, 0], photos: ['edificio-casino-bodegas'] },
]

const START_ANGLE = 0.65
const START_TILT = 0.48
/** Radianes por segundo del giro automático. */
const SPEED = 0.16
/** Pausa tras soltar el modelo antes de retomar el giro. */
const RESUME_MS = 2500

/** Un punto se muestra solo cuando su fachada mira hacia el frente. */
const facing = (normal: V, angle: number, tilt: number) => rotate(normal, angle, tilt)[2] > 0.15

/**
 * Maqueta 3D de la sede: gira sola y lento mientras está a la vista, se puede arrastrar
 * o girar con las flechas, y los puntos + abren las fotos reales. Sin WebGL queda la foto de la sede.
 */
export function SedeModel() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const view = useRef({ angle: START_ANGLE, tilt: START_TILT })
  const hold = useRef(0)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [shot, setShot] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    let renderer: ReturnType<typeof createRenderer>
    try {
      renderer = createRenderer(canvas, faces, `${BASE}logo.png`)
    } catch {
      // Sin WebGL: se cambia a la foto fuera del cuerpo del efecto.
      queueMicrotask(() => setFailed(true))
      return
    }

    const render = () => {
      const { angle, tilt } = view.current
      renderer.draw(angle, tilt)
      markers.forEach((m, i) => {
        const el = dotRefs.current[i]
        if (!el) return
        const [left, top] = project(m.point, angle, tilt)
        el.style.left = `${left}%`
        el.style.top = `${top}%`
        el.hidden = !facing(m.normal, angle, tilt)
      })
    }
    render()

    // Giro automático: solo a la vista, sin movimiento reducido y en pausa mientras se interactúa.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let prev = 0
    let inView = false
    let resumeAt = 0
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0
      prev = now
      if (hold.current > 0 || now < resumeAt) return
      view.current.angle += SPEED * dt
      render()
    }
    const start = () => {
      if (reduced || frame) return
      prev = 0
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    io.observe(stage)

    // Arrastre con mouse o dedo.
    let drag: { x: number; y: number; id: number } | null = null
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      canvas.setPointerCapture(e.pointerId)
      drag = { x: e.clientX, y: e.clientY, id: e.pointerId }
      hold.current++
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return
      view.current.angle += (e.clientX - drag.x) * 0.009
      view.current.tilt = Math.max(0.15, Math.min(0.9, view.current.tilt + (e.clientY - drag.y) * 0.005))
      drag = { x: e.clientX, y: e.clientY, id: e.pointerId }
      render()
    }
    const onUp = () => {
      if (!drag) return
      drag = null
      hold.current = Math.max(0, hold.current - 1)
      resumeAt = performance.now() + RESUME_MS
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      view.current.angle += e.key === 'ArrowLeft' ? -0.15 : 0.15
      resumeAt = performance.now() + RESUME_MS
      render()
    }
    const onLost = (e: Event) => {
      e.preventDefault()
      setFailed(true)
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('lostpointercapture', onUp)
    canvas.addEventListener('keydown', onKey)
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      stop()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('lostpointercapture', onUp)
      canvas.removeEventListener('keydown', onKey)
      canvas.removeEventListener('webglcontextlost', onLost)
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open !== null && !dialog.open) {
      hold.current++
      dialog.showModal()
    }
  }, [open])

  if (failed) {
    return (
      <div className={styles.fallback}>
        <Photo id="sede-concepcion" sizes="(min-width: 1000px) 55vw, 100vw" />
      </div>
    )
  }

  const current = open !== null ? markers[open] : null
  const total = current?.photos.length ?? 0
  const image = current ? photo(current.photos[shot]) : null
  const go = (delta: number) => setShot((s) => (s + delta + total) % total)
  // Mientras el cursor o el foco están sobre un punto, el modelo se queda quieto para poder pulsarlo.
  const pause = () => hold.current++
  const resume = () => (hold.current = Math.max(0, hold.current - 1))

  return (
    <div className={styles.wrap}>
      <div ref={stageRef} className={styles.stage}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          tabIndex={0}
          role="img"
          aria-label="Maqueta 3D de la sede de Plagastop en Concepción. Usa las flechas para girarla."
        />
        {markers.map((m, i) => {
          const [left, top] = project(m.point, START_ANGLE, START_TILT)
          return (
            <button
              key={m.name}
              ref={(el) => {
                dotRefs.current[i] = el
              }}
              type="button"
              className={styles.dot}
              style={{ left: `${left}%`, top: `${top}%` }}
              hidden={!facing(m.normal, START_ANGLE, START_TILT)}
              onClick={() => {
                setShot(0)
                setOpen(i)
              }}
              onPointerEnter={pause}
              onPointerLeave={resume}
              onFocus={pause}
              onBlur={resume}
              aria-label={`Ver fotos: ${m.name}`}
            >
              <span className={styles.dotIcon} aria-hidden>
                <Plus size={18} strokeWidth={2.5} />
              </span>
              <span className={styles.dotLabel}>{m.name}</span>
            </button>
          )
        })}
      </div>
      <p className={styles.hint}>Maqueta ilustrativa · arrastra para girar y toca un + para ver las fotos</p>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={current ? `Fotos: ${current.name}` : 'Fotos de la sede'}
        onClose={() => {
          setOpen(null)
          resume()
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
        onKeyDown={(e) => {
          if (total < 2 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
          e.preventDefault()
          go(e.key === 'ArrowLeft' ? -1 : 1)
        }}
      >
        {current && image && (
          <figure>
            <div className={styles.dialogMedia}>
              <img
                key={current.photos[shot]}
                src={image.src}
                srcSet={image.srcSet}
                sizes="92vw"
                alt={image.alt}
                decoding="async"
              />
              {total > 1 && (
                <>
                  <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Foto anterior">
                    <ArrowLeft size={20} strokeWidth={2.25} aria-hidden />
                  </button>
                  <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Foto siguiente">
                    <ArrowRight size={20} strokeWidth={2.25} aria-hidden />
                  </button>
                </>
              )}
            </div>
            <figcaption>
              <span>
                {current.name}
                {total > 1 && (
                  <small className="tabular" aria-live="polite">
                    {shot + 1} / {total}
                  </small>
                )}
              </span>
              <button type="button" onClick={() => dialogRef.current?.close()} autoFocus>
                Cerrar <X size={16} aria-hidden />
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  )
}

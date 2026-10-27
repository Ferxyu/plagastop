import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Photo } from '~/components/ui/Photo'
import { faces, type V } from './sede/geometry'
import { createRenderer, project } from './sede/renderer'
import { SEDE_POSTER, SEDE_VIDEO } from './sede/video'
import styles from './SedeModel.module.css'

const BASE = `${import.meta.env.BASE_URL}media/sede/`

/** Punto sobre el techo de la maqueta: abre el recorrido en video por la sede. Siempre a la vista. */
const ROOF: V = [0, 5.6, 0]

const START_ANGLE = 0.65
const START_TILT = 0.48
/** Radianes por segundo del giro automático. */
const SPEED = 0.16
/** Pausa tras soltar el modelo antes de retomar el giro. */
const RESUME_MS = 2500

/**
 * Maqueta 3D de la sede: gira sola y lento mientras está a la vista, se puede arrastrar
 * o girar con las flechas, y el punto + del techo abre el video de la sede. Sin WebGL queda la foto.
 */
export function SedeModel() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const view = useRef({ angle: START_ANGLE, tilt: START_TILT })
  const hold = useRef(0)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)

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
      const el = dotRef.current
      if (el) {
        const [left, top] = project(ROOF, angle, tilt)
        el.style.left = `${left}%`
        el.style.top = `${top}%`
      }
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
    if (open && !dialog.open) {
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

  const [left, top] = project(ROOF, START_ANGLE, START_TILT)
  // Mientras el cursor o el foco están sobre el punto, el modelo se queda quieto para poder pulsarlo.
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
        <Orbit side="back" />
        <Orbit side="front" />
        <button
          ref={dotRef}
          type="button"
          className={styles.dot}
          style={{ left: `${left}%`, top: `${top}%` }}
          onClick={() => setOpen(true)}
          onPointerEnter={pause}
          onPointerLeave={resume}
          onFocus={pause}
          onBlur={resume}
          aria-label="Ver video de la sede"
        >
          <span className={styles.dotIcon} aria-hidden>
            <Plus className={styles.spin} size={18} strokeWidth={2.5} />
          </span>
          <span className={styles.dotLabel}>Ver video de la sede</span>
        </button>
      </div>
      <p className={styles.hint}>Maqueta ilustrativa · arrastra para girar y toca el + para ver el video</p>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Video de la sede"
        onClose={() => {
          setOpen(false)
          resume()
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
      >
        {open && (
          <figure>
            <div className={styles.dialogMedia}>
              <video
                src={SEDE_VIDEO}
                poster={SEDE_POSTER}
                controls
                autoPlay
                playsInline
                aria-label="Recorrido en video por la sede de Plagastop"
              />
            </div>
            <figcaption>
              <span>Nuestra sede en Concepción</span>
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

/**
 * Pulso de protección orbitando la maqueta: una elipse inclinada partida en dos mitades. La de atrás va
 * debajo del lienzo (el edificio la tapa) y la de adelante encima; ambas recorren el mismo trazo, así el
 * pulso pasa por detrás y por delante de la sede. No recibe clics (los puntos + siguen encima).
 */
function Orbit({ side }: { side: 'back' | 'front' }) {
  const clip = `orbit-${side}`
  return (
    <svg className={`${styles.orbit} ${side === 'back' ? styles.orbitBack : styles.orbitFront}`} viewBox="0 0 800 550" aria-hidden focusable="false">
      <defs>
        <clipPath id={clip}>
          {side === 'back' ? <rect x="0" y="0" width="800" height="340" /> : <rect x="0" y="340" width="800" height="210" />}
        </clipPath>
      </defs>
      <g transform="rotate(-7 400 340)" clipPath={`url(#${clip})`}>
        <ellipse className={styles.orbitTrack} cx="400" cy="340" rx="370" ry="112" pathLength={1} />
        <ellipse className={styles.orbitTail} cx="400" cy="340" rx="370" ry="112" pathLength={1} />
        <ellipse className={styles.orbitHead} cx="400" cy="340" rx="370" ry="112" pathLength={1} />
      </g>
    </svg>
  )
}


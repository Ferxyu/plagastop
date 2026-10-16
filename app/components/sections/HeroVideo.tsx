import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { Award, FileCheck2, ShieldCheck, Volume2, VolumeX } from 'lucide-react'
import posterWide from '~/assets/media/hero-poster-1600.webp'
import posterTall from '~/assets/media/hero-poster-720.webp'
import { credentials } from '~/content/credentials'
import { track } from '~/lib/analytics'
import { ButtonLink } from '~/components/ui/Button'
import styles from './HeroVideo.module.css'

const VIDEO_WIDE = `${import.meta.env.BASE_URL}media/hero-1080.mp4`
const VIDEO_NARROW = `${import.meta.env.BASE_URL}media/hero-720.mp4`
const MUSIC = `${import.meta.env.BASE_URL}media/musica-fondo.mp3`
const MUSIC_KEY = 'ps-music-muted'
// v2: el volumen guardado antes era lineal y demasiado alto; con la nueva clave todos parten bajo.
const LEVEL_KEY = 'ps-music-level-v2'
/** Posición inicial del regulador (0–100): muy baja, música apenas de fondo. */
const DEFAULT_LEVEL = 22
const FADE_MS = 2500

/**
 * El oído percibe el volumen de forma logarítmica: con una escala lineal casi todo el cambio ocurre al final
 * del recorrido. Elevar al cuadrado reparte el cambio a lo largo de todo el regulador (22 → 5 % de ganancia).
 */
const gainFor = (level: number) => (level / 100) ** 2

/** Posición del regulador recordada de la visita anterior, o la de fondo por defecto. */
function readSavedLevel() {
  if (typeof window === 'undefined') return DEFAULT_LEVEL
  try {
    const saved = Number(localStorage.getItem(LEVEL_KEY))
    return saved > 0 && saved <= 100 ? saved : DEFAULT_LEVEL
  } catch {
    return DEFAULT_LEVEL
  }
}

const credentialIcons ={ sag: ShieldCheck, sns: FileCheck2, pec: Award } as const

/** Verbos que rotan en el titular, en el ritmo de las escenas del video. */
const verbs = ['importando', 'produciendo', 'vendiendo', 'creciendo']

/**
 * Hero del home: video real de terreno (cinco escenas), titular con verbo rotativo y credenciales bajo el logo.
 * El póster carga primero; el video se pide recién cuando la página terminó de cargar, y nunca con
 * movimiento reducido o ahorro de datos (en ese caso queda el póster fijo).
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const narrow = window.matchMedia('(max-width: 767px)').matches
    video.src = narrow ? VIDEO_NARROW : VIDEO_WIDE
    setReady(true)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (reduced || saveData) return

    const start = () => {
      video.play().catch(() => setPlaying(false))
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  /*
   * Música de fondo: suena mientras se recorre el home (el hero no se desmonta al hacer scroll).
   * Los navegadores bloquean el audio automático, así que si no puede partir sola, parte con el
   * primer clic, toque o tecla. El silencio y el volumen elegidos se recuerdan para la próxima visita.
   */
  const musicRef = useRef<HTMLAudioElement>(null)
  const [sounding, setSounding] = useState(false)
  // El regulador solo se dibuja en el cliente, así que leer el nivel guardado aquí no altera la hidratación.
  const [level, setLevel] = useState(readSavedLevel)
  const levelRef = useRef(level)
  const fadeRef = useRef(0)

  /** Sube el volumen desde cero hasta el nivel elegido, para que la música no entre de golpe. */
  function fadeIn(audio: HTMLAudioElement) {
    cancelAnimationFrame(fadeRef.current)
    const target = gainFor(levelRef.current)
    const start = performance.now()
    audio.volume = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS)
      audio.volume = target * t
      if (t < 1) fadeRef.current = requestAnimationFrame(step)
    }
    fadeRef.current = requestAnimationFrame(step)
  }

  function playMusic(audio: HTMLAudioElement) {
    return audio.play().then(() => fadeIn(audio))
  }

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return
    audio.volume = 0
    let muted = false
    try {
      muted = localStorage.getItem(MUSIC_KEY) === '1'
    } catch {
      // Almacenamiento bloqueado: la música intenta sonar con el volumen por defecto.
    }
    if (muted) return
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    const unlock = (e: Event) => {
      // La bocina y su regulador deciden por sí mismos.
      if ((e.target as Element | null)?.closest?.('[data-music-toggle]')) return
      playMusic(audio).then(clear, () => {})
    }
    function clear() {
      events.forEach((e) => window.removeEventListener(e, unlock))
    }
    playMusic(audio).then(clear, () => events.forEach((e) => window.addEventListener(e, unlock)))
    return () => {
      clear()
      cancelAnimationFrame(fadeRef.current)
      audio.pause()
    }
    // playMusic solo usa refs: no necesita volver a suscribirse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleMusic() {
    const audio = musicRef.current
    if (!audio) return
    const mute = !audio.paused
    try {
      localStorage.setItem(MUSIC_KEY, mute ? '1' : '0')
    } catch {
      // Sin almacenamiento la preferencia dura solo esta visita.
    }
    if (mute) {
      cancelAnimationFrame(fadeRef.current)
      audio.pause()
    } else {
      // Si quedó en cero, vuelve al nivel de fondo para que se escuche algo.
      if (levelRef.current === 0) {
        levelRef.current = DEFAULT_LEVEL
        setLevel(DEFAULT_LEVEL)
      }
      playMusic(audio).catch(() => {})
    }
  }

  /** El regulador recorre 0–100 de punta a punta; solo en 0 la música se detiene. */
  function changeLevel(next: number) {
    const audio = musicRef.current
    if (!audio) return
    cancelAnimationFrame(fadeRef.current)
    levelRef.current = next
    setLevel(next)
    audio.volume = gainFor(next)
    try {
      if (next > 0) localStorage.setItem(LEVEL_KEY, String(next))
      localStorage.setItem(MUSIC_KEY, next === 0 ? '1' : '0')
    } catch {
      // Sin almacenamiento la preferencia dura solo esta visita.
    }
    if (next === 0) audio.pause()
    else if (audio.paused) audio.play().catch(() => {})
  }

  return (
    <section className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden>
        <picture>
          <source media="(max-width: 767px)" srcSet={posterTall} />
          <img className={styles.poster} src={posterWide} alt="" fetchPriority="high" decoding="async" />
        </picture>
        <video
          ref={videoRef}
          className={styles.video}
          data-playing={playing || undefined}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      <div className={`container ${styles.top}`}>
        <ul className={styles.creds} aria-label="Autorizaciones y certificaciones">
          {credentials.map((c, i) => {
            const Icon = credentialIcons[c.id as keyof typeof credentialIcons] ?? ShieldCheck
            return (
              <li key={c.id} style={{ '--i': i } as CSSProperties}>
                <Link to="/acreditaciones" className={styles.cred} prefetch="intent">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                  <span>
                    <small>{c.short.issuer}</small>
                    <b>{c.short.code}</b>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={`container ${styles.content}`}>
        <p className={`eyebrow ${styles.eyebrow}`}>Control de plagas para empresas e industrias</p>
        <h1 id="hero-title" className={styles.title}>
          <span className="visually-hidden">
            Tú sigue produciendo, importando y vendiendo. De las plagas nos encargamos nosotros.
          </span>
          <span className={styles.line1} aria-hidden>
            Tú sigue{' '}
            <span className={styles.rot}>
              {verbs.map((v) => (
                <span key={v}>{v}.</span>
              ))}
            </span>
          </span>
          <span className={styles.line2} aria-hidden>
            De las plagas nos encargamos nosotros.
          </span>
        </h1>
        <p className={styles.lead}>
          Prevención, control y seguimiento profesional de plagas para plantas, bodegas, puertos y empresas de
          alimentos.
        </p>
        <div className={styles.actions}>
          <ButtonLink to="/cotizar" size="lg" arrow onClick={() => track('cta_click', { location: 'hero' })}>
            Solicitar cotización
          </ButtonLink>
          <ButtonLink to="/servicios" size="lg" variant="inverse">
            Conoce nuestros servicios
          </ButtonLink>
        </div>
      </div>

      <audio
        ref={musicRef}
        src={MUSIC}
        loop
        preload="none"
        onPlay={() => setSounding(true)}
        onPause={() => setSounding(false)}
      />

      {/* La bocina flota sobre el botón de WhatsApp y acompaña el scroll. Va en un portal a <body>
          para que ninguna sección posterior la tape (el hero crea su propio contexto de apilamiento). */}
      {ready &&
        createPortal(
          <div className={styles.sound} data-music-toggle>
            <div className={styles.volume}>
              <div className={styles.capsule}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={sounding ? level : 0}
                  style={{ '--level': (sounding ? level : 0) / 100 } as CSSProperties}
                  onChange={(e) => changeLevel(Number(e.target.value))}
                  aria-label="Volumen de la música"
                  aria-valuetext={`${sounding ? level : 0} %`}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.soundButton}
              onClick={toggleMusic}
              aria-pressed={sounding}
              aria-label={sounding ? 'Silenciar música' : 'Activar música'}
            >
              {sounding ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
            </button>
          </div>,
          document.body,
        )}
      <span className={styles.line} aria-hidden />
    </section>
  )
}

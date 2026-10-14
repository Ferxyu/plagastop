import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { Award, FileCheck2, Pause, Play, ShieldCheck, Volume2, VolumeX } from 'lucide-react'
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
const VOLUME_KEY = 'ps-music-volume'
const DEFAULT_VOLUME = 0.35

const credentialIcons = { sag: ShieldCheck, sns: FileCheck2, pec: Award } as const

/** Verbos que rotan en el titular, en el ritmo de las escenas del video. */
const verbs = ['importando', 'produciendo', 'vendiendo', 'creciendo']

/**
 * Hero del home: video real de terreno (cinco escenas), titular con verbo rotativo y credenciales bajo el logo.
 * El póster carga primero; el video se pide recién cuando la página terminó de cargar, y nunca con
 * movimiento reducido o ahorro de datos (en ese caso queda el botón para reproducirlo a voluntad).
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
  const [volume, setVolume] = useState(DEFAULT_VOLUME)

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return
    audio.volume = DEFAULT_VOLUME
    let muted = false
    try {
      const saved = Number(localStorage.getItem(VOLUME_KEY))
      if (saved > 0 && saved <= 1) {
        audio.volume = saved
        setVolume(saved)
      }
      muted = localStorage.getItem(MUSIC_KEY) === '1'
    } catch {}
    if (muted) return
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    const unlock = (e: Event) => {
      // La bocina y su regulador deciden por sí mismos.
      if ((e.target as Element | null)?.closest?.('[data-music-toggle]')) return
      audio.play().then(clear, () => {})
    }
    function clear() {
      events.forEach((e) => window.removeEventListener(e, unlock))
    }
    audio.play().then(clear, () => events.forEach((e) => window.addEventListener(e, unlock)))
    return () => {
      clear()
      audio.pause()
    }
  }, [])

  function toggleMusic() {
    const audio = musicRef.current
    if (!audio) return
    const mute = !audio.paused
    try {
      localStorage.setItem(MUSIC_KEY, mute ? '1' : '0')
    } catch {}
    if (mute) audio.pause()
    else {
      // Si quedó en cero, vuelve al volumen de fondo para que se escuche algo.
      if (audio.volume === 0) changeVolume(DEFAULT_VOLUME)
      audio.play().catch(() => {})
    }
  }

  function changeVolume(next: number) {
    const audio = musicRef.current
    if (!audio) return
    audio.volume = next
    setVolume(next)
    try {
      if (next > 0) localStorage.setItem(VOLUME_KEY, String(next))
      localStorage.setItem(MUSIC_KEY, next === 0 ? '1' : '0')
    } catch {}
    if (next === 0) audio.pause()
    else if (audio.paused) audio.play().catch(() => {})
  }

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => setPlaying(false))
    else video.pause()
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

      {ready && (
        <div className={styles.controls}>
          <div className={styles.sound} data-music-toggle>
            <div className={styles.volume}>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={sounding ? Math.round(volume * 100) : 0}
                onChange={(e) => changeVolume(Number(e.target.value) / 100)}
                aria-label="Volumen de la música"
              />
            </div>
            <button
              type="button"
              className={styles.toggle}
              onClick={toggleMusic}
              aria-pressed={sounding}
              aria-label={sounding ? 'Silenciar música' : 'Activar música'}
            >
              {sounding ? <Volume2 size={18} aria-hidden /> : <VolumeX size={18} aria-hidden />}
            </button>
          </div>
          <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
            aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          >
            {playing ? <Pause size={16} fill="currentColor" aria-hidden /> : <Play size={16} fill="currentColor" aria-hidden />}
          </button>
        </div>
      )}
      <span className={styles.line} aria-hidden />
    </section>
  )
}

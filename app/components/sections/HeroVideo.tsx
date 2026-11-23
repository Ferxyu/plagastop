import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { Award, FileCheck2, ShieldCheck, Volume2, VolumeX } from 'lucide-react'
import posterWide from '~/assets/media/hero-poster-1600.webp'
import posterTall from '~/assets/media/hero-poster-720.webp'
import posterWideAvif from '~/assets/media/hero-poster-1600.avif'
import posterTallAvif from '~/assets/media/hero-poster-720.avif'
import { credentials } from '~/content/credentials'
import { ButtonLink } from '~/components/ui/Button'
import { mutedByUser, SOUND_ATTR, useHeroSound } from './useHeroSound'
import styles from './HeroVideo.module.css'

/**
 * Tres versiones del mismo video (37,8 s, con audio):
 * - hero-movil.mp4 (540 × 720, 3:4, ~3,3 MB): recorte vertical para teléfonos, en el mismo encuadre que ya
 *   mostraba el video horizontal con object-position 62 % (en vertical solo se veía ~¼ del ancho del 16:9).
 * - hero-720.mp4 (1280 × 720, ~7,9 MB): tablets y pantallas de hasta ~1400 px físicos de ancho.
 * - hero-1080.mp4 (1920 × 1080, ~13 MB): escritorio.
 */
const VIDEO_WIDE = `${import.meta.env.BASE_URL}media/hero-1080.mp4`
const VIDEO_MEDIUM = `${import.meta.env.BASE_URL}media/hero-720.mp4`
const VIDEO_MOBILE = `${import.meta.env.BASE_URL}media/hero-movil.mp4`

type NetworkInfo = { saveData?: boolean; effectiveType?: string }

/** Ahorro de datos activo o conexión lenta (2G/3G según el navegador): se queda el póster fijo. */
function constrainedNetwork() {
  const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection
  return Boolean(connection?.saveData) || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')
}

function pickVideo() {
  if (window.matchMedia('(max-width: 767px)').matches) return VIDEO_MOBILE
  return window.innerWidth * (window.devicePixelRatio || 1) <= 1400 ? VIDEO_MEDIUM : VIDEO_WIDE
}

const credentialIcons = { sag: ShieldCheck, sns: FileCheck2, pec: Award } as const

/** Verbos que rotan en el titular, en el ritmo de las escenas del video. */
const verbs = ['importando', 'produciendo', 'vendiendo', 'creciendo']

/**
 * Hero del home: video real de terreno (cinco escenas), titular con verbo rotativo y credenciales bajo el logo.
 * El póster carga primero; el video se pide recién cuando la página terminó de cargar, y nunca con
 * movimiento reducido, ahorro de datos o conexión lenta: en esos casos queda el póster fijo. El video va en bucle
 * con su audio activo; un botón flotante lo silencia o lo vuelve a activar (ver useHeroSound.ts).
 */
export function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const { ready, on, toggle } = useHeroSound(sectionRef, videoRef)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || constrainedNetwork()) return
    // El src se asigna solo si el video se va a reproducir: así nunca se pide sin necesidad
    video.src = pickVideo()

    // Intenta arrancar con sonido; si el navegador aún no lo permite, sigue sin sonido y
    // useHeroSound lo activa con el primer gesto del visitante.
    const start = () => {
      video.muted = mutedByUser()
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => setPlaying(false))
      })
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  return (
    <section ref={sectionRef} className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden data-scroll-zoom>
        {/* AVIF (~35 % más liviano) con WebP de respaldo; vertical en móvil, horizontal desde 768 px */}
        <picture>
          <source media="(max-width: 767px)" type="image/avif" srcSet={posterTallAvif} />
          <source media="(max-width: 767px)" srcSet={posterTall} />
          <source type="image/avif" srcSet={posterWideAvif} />
          <img
            className={styles.poster}
            src={posterWide}
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
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

      <div className={`container ${styles.content}`} data-scroll-out>
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
          Prevención, control y seguimiento profesional de plagas para plantas, bodegas, puertos y agroindustrias.
        </p>
        <div className={styles.actions}>
          <ButtonLink to="/servicios" size="lg" arrow>
            Conoce nuestros servicios
          </ButtonLink>
        </div>
      </div>

      {/* Botón de sonido: flotante sobre el de WhatsApp, a mano mientras se recorre la página */}
      {ready &&
        createPortal(
          <button
            type="button"
            className={styles.sound}
            onClick={toggle}
            data-on={on || undefined}
            aria-label={on ? 'Silenciar el audio del video' : 'Activar el audio del video'}
            title={on ? 'Silenciar' : 'Activar sonido'}
            {...{ [SOUND_ATTR]: '' }}
          >
            {on ? <Volume2 size={20} strokeWidth={2} aria-hidden /> : <VolumeX size={20} strokeWidth={2} aria-hidden />}
          </button>,
          document.body,
        )}
    </section>
  )
}

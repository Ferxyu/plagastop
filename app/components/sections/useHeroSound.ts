import { useEffect, useRef, useState, type RefObject } from 'react'

/** El visitante silenció la portada a propósito: se respeta durante la visita. */
const KEY = 'ps-hero-muted'
/** Volumen moderado (el audio del video ya viene normalizado a -23 LUFS). */
const VOLUME = 0.6
/** El botón de sonido marca su zona: sus clics no cuentan como gesto para activar el audio solo. */
export const SOUND_ATTR = 'data-hero-sound'

const mutedByUser = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

const saveMuted = (muted: boolean) => {
  try {
    if (muted) sessionStorage.setItem(KEY, '1')
    else sessionStorage.removeItem(KEY)
  } catch {
    // Sin almacenamiento: solo se pierde la preferencia entre páginas.
  }
}

/**
 * Sonido de la portada: el audio va dentro del video y se repite con él en bucle.
 * Los navegadores no dejan sonar nada sin un gesto previo, así que el video arranca sin sonido y se
 * activa con el primer clic, toque o tecla mientras la portada está a la vista (o de inmediato si ya hubo
 * interacción en la página). El botón flotante lo silencia o lo vuelve a activar en cualquier momento.
 * Devuelve si el botón puede mostrarse (el video ya corre), si suena y la acción del botón.
 */
export function useHeroSound(sectionRef: RefObject<HTMLElement | null>, videoRef: RefObject<HTMLVideoElement | null>) {
  const [ready, setReady] = useState(false)
  const [on, setOn] = useState(false)
  const toggleRef = useRef<() => void>(() => {})

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return
    video.volume = VOLUME
    let userMuted = mutedByUser()
    let inView = true

    const gestures = ['pointerdown', 'keydown'] as const
    const detachGestures = () => gestures.forEach((g) => window.removeEventListener(g, onGesture, true))

    const unmute = () => {
      video.muted = false
      // Si el navegador no lo permite, pausa el video: se vuelve a silenciar y sigue corriendo
      if (video.paused && video.readyState > 0) {
        video.muted = true
        video.play().catch(() => {})
      }
      setOn(!video.muted)
      if (!video.muted) detachGestures()
    }

    const tryAuto = () => {
      if (userMuted || !inView || video.paused || !video.muted) return
      const active = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
      if (active?.hasBeenActive) unmute()
    }

    function onGesture(e: Event) {
      if (e.target instanceof Element && e.target.closest(`[${SOUND_ATTR}]`)) return
      if (userMuted || !inView || video!.paused || !video!.muted) return
      unmute()
    }

    const onPlaying = () => {
      setReady(true)
      tryAuto()
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) tryAuto()
    })
    io.observe(section)

    toggleRef.current = () => {
      if (!video.muted) {
        video.muted = true
        userMuted = true
        saveMuted(true)
        setOn(false)
      } else {
        // Es un clic del visitante: el navegador permite el sonido
        userMuted = false
        saveMuted(false)
        video.muted = false
        if (video.paused) video.play().catch(() => {})
        setOn(true)
        detachGestures()
      }
    }

    // Otro video con sonido (el de la sede) tiene prioridad: la portada calla mientras se reproduce
    // y retoma al pausarlo o terminarlo, salvo que el visitante la haya silenciado.
    // Los avisos de fin se escuchan en el propio elemento: al cerrar su diálogo sale del documento.
    const others = new Set<HTMLMediaElement>()
    const stops = ['pause', 'ended', 'emptied'] as const
    let resumeAfter = false
    const onOtherStop = (e: Event) => {
      const other = e.currentTarget as HTMLMediaElement
      stops.forEach((s) => other.removeEventListener(s, onOtherStop))
      others.delete(other)
      if (others.size || !resumeAfter) return
      resumeAfter = false
      if (userMuted) return
      video.muted = false
      setOn(!video.muted)
    }
    const onOtherPlay = (e: Event) => {
      const other = e.target
      if (other === video || !(other instanceof HTMLMediaElement) || others.has(other)) return
      others.add(other)
      stops.forEach((s) => other.addEventListener(s, onOtherStop))
      if (!video.muted) {
        resumeAfter = true
        video.muted = true
        setOn(false)
      }
    }

    video.addEventListener('playing', onPlaying)
    document.addEventListener('play', onOtherPlay, true)
    if (!userMuted) gestures.forEach((g) => window.addEventListener(g, onGesture, true))
    if (!video.paused) queueMicrotask(onPlaying)

    return () => {
      io.disconnect()
      detachGestures()
      video.removeEventListener('playing', onPlaying)
      document.removeEventListener('play', onOtherPlay, true)
      others.forEach((o) => stops.forEach((s) => o.removeEventListener(s, onOtherStop)))
      video.muted = true
      toggleRef.current = () => {}
    }
  }, [sectionRef, videoRef])

  return { ready, on, toggle: () => toggleRef.current() }
}

import { useEffect, useRef, useState, type RefObject } from 'react'

/** El visitante silenció la portada a propósito: se respeta durante la visita. */
const KEY = 'ps-hero-muted'
/** Volumen moderado (el audio del video ya viene normalizado a -23 LUFS). */
const VOLUME = 0.6
/** El botón de sonido marca su zona: sus clics no cuentan como gesto para activar el audio solo. */
export const SOUND_ATTR = 'data-hero-sound'

export const mutedByUser = () => {
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
 * Sonido de la portada: el audio va dentro del video y se repite con él en bucle, activo siempre salvo
 * que el visitante lo silencie con el botón flotante.
 * El video intenta arrancar con sonido (HeroVideo). Si el navegador lo bloquea por falta de un gesto previo
 * (lo normal en la primera visita), arranca sin sonido y el audio se activa con el primer clic, toque o
 * tecla en cualquier parte de la página, o de inmediato si ya hubo interacción.
 * Devuelve si el botón puede mostrarse (el video ya corre), si suena y la acción del botón.
 */
export function useHeroSound(sectionRef: RefObject<HTMLElement | null>, videoRef: RefObject<HTMLVideoElement | null>) {
  const [ready, setReady] = useState(false)
  const [on, setOn] = useState(false)
  const toggleRef = useRef<() => void>(() => {})

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = VOLUME
    let userMuted = mutedByUser()

    // Gestos que el navegador acepta para habilitar el sonido: con mouse cuenta al presionar, al tocar cuenta al soltar
    const gestures = ['pointerdown', 'mousedown', 'pointerup', 'touchend', 'click', 'keydown'] as const
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
      if (userMuted || video.paused || !video.muted) return
      const active = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
      if (active?.hasBeenActive) unmute()
    }

    function onGesture(e: Event) {
      if (e.target instanceof Element && e.target.closest(`[${SOUND_ATTR}]`)) return
      if (userMuted || video!.paused || !video!.muted) return
      unmute()
    }

    const onPlaying = () => {
      setReady(true)
      setOn(!video.muted)
      if (video.muted) tryAuto()
      else detachGestures()
    }

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

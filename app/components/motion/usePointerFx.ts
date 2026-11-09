import { useEffect } from 'react'

/**
 * Efectos de puntero (solo mouse, sin movimiento reducido):
 * - [data-magnetic]: el elemento se desplaza levemente hacia el puntero.
 * - [data-tilt]: la tarjeta se inclina en 3D según la posición del puntero y se eleva.
 * - [data-glow]: recibe --gx/--gy (posición del puntero en px) para una luz que lo sigue (CSS del componente).
 * - [data-magnetic] (botones): al pulsar nace una onda desde el punto de contacto (también en táctil).
 * Usa delegación de eventos: funciona en cualquier página sin registrar elementos.
 */
export function usePointerFx() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // Onda al pulsar: un span temporal que se borra al terminar su animación (CSS .ripple en base.css)
    const onDown = (e: PointerEvent) => {
      const b = (e.target as Element | null)?.closest<HTMLElement>('[data-magnetic]')
      if (!b) return
      const r = b.getBoundingClientRect()
      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ripple.setAttribute('aria-hidden', 'true')
      ripple.style.left = `${e.clientX - r.left}px`
      ripple.style.top = `${e.clientY - r.top}px`
      ripple.style.setProperty('--r', `${Math.hypot(r.width, r.height)}px`)
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
      b.append(ripple)
    }
    document.addEventListener('pointerdown', onDown, { passive: true })
    if (!fine) return () => document.removeEventListener('pointerdown', onDown)

    let magnet: HTMLElement | null = null
    let tilt: HTMLElement | null = null

    const reset = (el: HTMLElement | null) => {
      if (el) el.style.transform = ''
    }

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null

      const m = target?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (m !== magnet) {
        reset(magnet)
        magnet = m
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
        magnet.style.transform = `translate(${(dx * 7).toFixed(1)}px, ${(dy * 5).toFixed(1)}px)`
      }

      const g = target?.closest<HTMLElement>('[data-glow]') ?? null
      if (g) {
        const r = g.getBoundingClientRect()
        g.style.setProperty('--gx', `${(e.clientX - r.left).toFixed(0)}px`)
        g.style.setProperty('--gy', `${(e.clientY - r.top).toFixed(0)}px`)
      }

      const t = target?.closest<HTMLElement>('[data-tilt]') ?? null
      if (t !== tilt) {
        reset(tilt)
        tilt = t
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        tilt.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-6px)`
      }
    }

    const onLeave = () => {
      reset(magnet)
      reset(tilt)
      magnet = tilt = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [])
}

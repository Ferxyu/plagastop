import { useEffect } from 'react'

/**
 * Efectos de puntero (solo mouse, sin movimiento reducido):
 * - [data-magnetic]: el elemento se desplaza levemente hacia el puntero.
 * - [data-tilt]: la tarjeta se inclina en 3D según la posición del puntero y se eleva.
 * Usa delegación de eventos: funciona en cualquier página sin registrar elementos.
 */
export function usePointerFx() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

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
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [])
}

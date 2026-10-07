import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Apariciones al hacer scroll para todo elemento con [data-reveal].
 * Corre después de hidratar: lo que ya está en pantalla queda visible sin animar;
 * lo que está bajo el pliegue se oculta y aparece al entrar en el viewport.
 * data-reveal="2" escalona el retardo (2 × 90 ms).
 */
export function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-state])'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.dataset.revealState = 'shown'
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    for (const el of elements) {
      const step = Number(el.dataset.reveal) || 0
      el.style.setProperty('--reveal-delay', `${step * 90}ms`)
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) continue
      el.dataset.revealState = 'pending'
      io.observe(el)
    }
    return () => io.disconnect()
  }, [pathname])
}

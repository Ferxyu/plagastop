import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Motor de movimiento del sitio. Corre después de hidratar y se reinicia en cada navegación.
 *
 * - [data-reveal]: aparece al entrar en pantalla. data-reveal="2" escalona el retardo (2 × 90 ms).
 *   data-reveal-style="clip" revela con cortina (imágenes); "scale" con zoom de entrada.
 *   Lo que ya está en pantalla al cargar queda visible sin animar.
 * - [data-parallax="0.15"]: se desplaza en Y en proporción a su posición en el viewport
 *   (positivo = más lento que el scroll). Usa la propiedad `translate`, no `transform`.
 * - [data-draw]: recibe --draw (0 a 1) según cuánto se ha recorrido; las líneas se dibujan con el scroll.
 * - [data-scroll-fade]: se desvanece a medida que su contenedor sale por arriba.
 * - --scroll en <html>: progreso de lectura de la página (0 a 1).
 * - [data-hscroll]: sección fijada cuyo [data-hscroll-track] avanza en horizontal con el scroll.
 *
 * Con prefers-reduced-motion no se activa nada: el contenido queda estático y completo.
 */
export function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Apariciones
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-state])'))
    // Un elemento recortado por completo con su propio clip-path nunca "intersecta":
    // en la cortina se observa a su contenedor y se revela el elemento asociado.
    const targets = new Map<Element, HTMLElement[]>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          for (const el of targets.get(entry.target) ?? []) el.dataset.revealState = 'shown'
          targets.delete(entry.target)
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    for (const el of reveals) {
      const step = Number(el.dataset.reveal) || 0
      el.style.setProperty('--reveal-delay', `${step * 90}ms`)
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) continue
      el.dataset.revealState = 'pending'
      const target = el.dataset.revealStyle === 'clip' && el.parentElement ? el.parentElement : el
      targets.set(target, [...(targets.get(target) ?? []), el])
      io.observe(target)
    }

    // Parallax: solo se calculan los elementos visibles
    const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    const visible = new Set<HTMLElement>()
    const pio = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) visible.add(el)
          else visible.delete(el)
        }
        schedule()
      },
      { rootMargin: '20% 0px' },
    )
    parallax.forEach((el) => pio.observe(el))

    // Galerías horizontales fijadas (solo escritorio)
    const wide = window.matchMedia('(min-width: 1000px)')
    const tracks = Array.from(document.querySelectorAll<HTMLElement>('[data-hscroll]')).map((section) => ({
      section,
      track: section.querySelector<HTMLElement>('[data-hscroll-track]'),
    }))
    const measure = () => {
      for (const { section, track } of tracks) {
        if (!track) continue
        if (!wide.matches) {
          section.dataset.hscrollActive = 'false'
          track.style.translate = ''
          continue
        }
        section.dataset.hscrollActive = 'true'
        const distance = Math.max(0, track.scrollWidth - track.clientWidth)
        section.style.setProperty('--hs-distance', `${distance}px`)
      }
    }
    measure()

    // Líneas que se dibujan con el scroll y barra de progreso de lectura
    const draws = Array.from(document.querySelectorAll<HTMLElement>('[data-draw]'))
    draws.forEach((el) => (el.dataset.drawActive = 'true'))
    // Elementos que se desvanecen al salir por arriba (texto del hero)
    const fades = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-fade]'))
    const root = document.documentElement

    let frame = 0
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    function update() {
      frame = 0
      const vh = window.innerHeight
      const max = root.scrollHeight - vh
      root.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : '0')
      for (const el of fades) {
        const rect = (el.parentElement ?? el).getBoundingClientRect()
        const gone = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.75)))
        el.style.opacity = (1 - gone).toFixed(3)
      }
      for (const el of draws) {
        const rect = el.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (vh * 0.78 - rect.top) / Math.max(rect.height, 1)))
        el.style.setProperty('--draw', p.toFixed(3))
      }
      for (const el of visible) {
        const speed = Number(el.dataset.parallax) || 0
        const rect = (el.parentElement ?? el).getBoundingClientRect()
        const offset = rect.top + rect.height / 2 - vh / 2
        el.style.translate = `0 ${(offset * speed).toFixed(1)}px`
      }
      for (const { section, track } of tracks) {
        if (!track || section.dataset.hscrollActive !== 'true') continue
        const rect = section.getBoundingClientRect()
        const total = section.offsetHeight - vh
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
        const distance = Math.max(0, track.scrollWidth - track.clientWidth)
        track.style.translate = `${(-progress * distance).toFixed(1)}px 0`
        section.style.setProperty('--hs-progress', progress.toFixed(3))
      }
    }

    const onResize = () => {
      measure()
      schedule()
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    schedule()

    return () => {
      draws.forEach((el) => delete el.dataset.drawActive)
      io.disconnect()
      pio.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
    }
  }, [pathname])
}

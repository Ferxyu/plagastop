import { useEffect, useState, type RefObject } from 'react'

/**
 * true mientras el elemento está a la vista (según threshold). Sirve para iniciar animaciones al entrar
 * y pausarlas al salir. Con `once`, se queda en true tras la primera vez.
 */
export function useInView(ref: RefObject<Element | null>, { threshold = 0.3, once = false } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, once])

  return inView
}
